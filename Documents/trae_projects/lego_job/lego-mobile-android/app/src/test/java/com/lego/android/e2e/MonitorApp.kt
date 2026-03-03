package com.lego.android.e2e

import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.ConcurrentLinkedQueue
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.system.exitProcess

/**
 * Android APP 监控工具
 * 用于 E2E 测试期间监控 APP 状态，捕获崩溃、ANR 等异常
 */
class MonitorApp private constructor(
    private val packageName: String,
    private val outputDir: String,
    private val checkIntervalMs: Long
) {
    private val timestampFormat = SimpleDateFormat("yyyy-MM-dd_HH-mm-ss", Locale.getDefault())
    private val logTimestampFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.getDefault())
    private val reportLines = ConcurrentLinkedQueue<String>()
    private val isRunning = AtomicBoolean(false)
    private val crashDetected = AtomicBoolean(false)
    private val anrDetected = AtomicBoolean(false)
    private var logcatProcess: Process? = null
    private var monitorThread: Thread? = null

    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            val config = parseArguments(args)
            if (config == null) {
                printUsage()
                exitProcess(1)
            }

            val monitor = MonitorApp(
                packageName = config.packageName,
                outputDir = config.outputDir,
                checkIntervalMs = config.checkIntervalMs
            )

            Runtime.getRuntime().addShutdownHook(Thread {
                println("\n正在停止监控...")
                monitor.stop()
            })

            monitor.start()
        }

        private fun parseArguments(args: Array<String>): MonitorConfig? {
            var packageName = ""
            var outputDir = "./monitor-output"
            var checkIntervalMs = 1000L

            var i = 0
            while (i < args.size) {
                when (args[i]) {
                    "-p", "--package" -> {
                        if (i + 1 >= args.size) return null
                        packageName = args[++i]
                    }
                    "-o", "--output" -> {
                        if (i + 1 >= args.size) return null
                        outputDir = args[++i]
                    }
                    "-i", "--interval" -> {
                        if (i + 1 >= args.size) return null
                        checkIntervalMs = args[++i].toLongOrNull() ?: 1000L
                    }
                    "-h", "--help" -> {
                        printUsage()
                        exitProcess(0)
                    }
                    else -> {
                        println("未知参数: ${args[i]}")
                        return null
                    }
                }
                i++
            }

            if (packageName.isBlank()) {
                println("错误: 必须指定包名 (-p|--package)")
                return null
            }

            return MonitorConfig(packageName, outputDir, checkIntervalMs)
        }

        private fun printUsage() {
            println("""
                Android APP 监控工具
                
                用法: kotlin MonitorApp.kt [选项]
                
                选项:
                  -p, --package <包名>     要监控的 APP 包名 (必需)
                  -o, --output <目录>      输出目录 (默认: ./monitor-output)
                  -i, --interval <毫秒>    检查间隔 (默认: 1000ms)
                  -h, --help               显示帮助信息
                
                示例:
                  kotlin MonitorApp.kt -p com.legostory.mobilegame -o ./output -i 1000
            """.trimIndent())
        }
    }

    data class MonitorConfig(
        val packageName: String,
        val outputDir: String,
        val checkIntervalMs: Long
    )

    /**
     * 开始监控
     */
    fun start() {
        if (isRunning.get()) {
            println("监控已在运行中")
            return
        }

        // 创建输出目录
        File(outputDir).mkdirs()
        File("$outputDir/screenshots").mkdirs()
        File("$outputDir/logs").mkdirs()

        isRunning.set(true)
        crashDetected.set(false)
        anrDetected.set(false)

        println("=".repeat(60))
        println("Android APP 监控工具已启动")
        println("包名: $packageName")
        println("输出目录: $outputDir")
        println("检查间隔: ${checkIntervalMs}ms")
        println("=".repeat(60))

        // 记录启动信息
        logEvent("MONITOR_START", "监控工具已启动")

        // 启动 logcat 监控
        startLogcatMonitor()

        // 启动进程状态监控
        startProcessMonitor()

        // 等待监控结束
        try {
            monitorThread?.join()
        } catch (e: InterruptedException) {
            Thread.currentThread().interrupt()
        }
    }

    /**
     * 停止监控
     */
    fun stop() {
        if (!isRunning.get()) return

        isRunning.set(false)

        // 停止 logcat 进程
        logcatProcess?.destroy()
        logcatProcess = null

        // 生成最终报告
        generateReport()

        println("监控已停止")
    }

    /**
     * 启动 logcat 监控
     */
    private fun startLogcatMonitor() {
        Thread({
            try {
                // 清除旧日志
                executeAdbCommand(listOf("logcat", "-c"))

                // 启动 logcat
                val processBuilder = ProcessBuilder(
                    "adb", "logcat", "-v", "threadtime",
                    "*:E"  // 只监控 Error 级别及以上
                )
                processBuilder.redirectErrorStream(true)
                logcatProcess = processBuilder.start()

                val reader = BufferedReader(InputStreamReader(logcatProcess!!.inputStream))
                var line: String? = ""

                while (isRunning.get() && reader.readLine().also { line = it } != null) {
                    line?.let { processLogLine(it) }
                }
            } catch (e: Exception) {
                if (isRunning.get()) {
                    logEvent("LOGCAT_ERROR", "Logcat 监控出错: ${e.message}")
                    e.printStackTrace()
                }
            }
        }, "LogcatMonitor").start()
    }

    /**
     * 处理 logcat 输出行
     */
    private fun processLogLine(line: String) {
        // 检查是否与应用相关
        if (!line.contains(packageName) && !line.contains("AndroidRuntime")) {
            return
        }

        // 检测崩溃
        if (line.contains("FATAL EXCEPTION") ||
            line.contains("AndroidRuntime") && line.contains("Exception") ||
            line.contains("Process: $packageName") && line.contains("Exception")
        ) {
            if (!crashDetected.get()) {
                crashDetected.set(true)
                val timestamp = timestampFormat.format(Date())
                logEvent("CRASH_DETECTED", "检测到应用崩溃\n$line")
                println("\n[警告] 检测到崩溃!")
                println(line)

                // 保存崩溃日志
                saveCrashLog(timestamp, line)

                // 截图
                takeScreenshot("crash_$timestamp")
            }
        }

        // 检测 ANR
        if (line.contains("ANR") && line.contains(packageName)) {
            if (!anrDetected.get()) {
                anrDetected.set(true)
                val timestamp = timestampFormat.format(Date())
                logEvent("ANR_DETECTED", "检测到 ANR\n$line")
                println("\n[警告] 检测到 ANR!")
                println(line)

                // 保存 ANR 日志
                saveAnrLog(timestamp, line)

                // 截图
                takeScreenshot("anr_$timestamp")

                // 获取 ANR traces
                collectAnrTraces(timestamp)
            }
        }
    }

    /**
     * 启动进程状态监控
     */
    private fun startProcessMonitor() {
        monitorThread = Thread({
            var lastPid: String? = null
            var consecutiveFailures = 0

            while (isRunning.get()) {
                try {
                    val pid = getProcessPid()
                    val timestamp = timestampFormat.format(Date())

                    if (pid != null) {
                        consecutiveFailures = 0
                        if (pid != lastPid) {
                            lastPid = pid
                            logEvent("PROCESS_INFO", "进程 PID: $pid")
                            println("[${logTimestampFormat.format(Date())}] 进程运行中 - PID: $pid")
                        }
                    } else {
                        consecutiveFailures++
                        if (consecutiveFailures >= 3) {
                            logEvent("PROCESS_NOT_FOUND", "应用进程未找到 (连续 $consecutiveFailures 次)")
                            println("[${logTimestampFormat.format(Date())}] [警告] 应用进程未找到!")

                            // 截图
                            takeScreenshot("process_not_found_$timestamp")

                            // 如果进程消失且没有检测到崩溃，可能是被杀死
                            if (!crashDetected.get() && !anrDetected.get()) {
                                logEvent("PROCESS_KILLED", "应用进程被终止")
                            }

                            consecutiveFailures = 0
                        }
                    }

                    Thread.sleep(checkIntervalMs)
                } catch (e: InterruptedException) {
                    Thread.currentThread().interrupt()
                    break
                } catch (e: Exception) {
                    logEvent("MONITOR_ERROR", "监控出错: ${e.message}")
                    e.printStackTrace()
                }
            }
        }, "ProcessMonitor")

        monitorThread?.start()
    }

    /**
     * 获取应用进程 PID
     */
    private fun getProcessPid(): String? {
        return try {
            val result = executeAdbCommand(
                listOf("shell", "pidof", packageName),
                timeoutMs = 5000
            )
            result?.trim()?.takeIf { it.isNotEmpty() }
        } catch (e: Exception) {
            null
        }
    }

    /**
     * 截图
     */
    private fun takeScreenshot(filename: String) {
        try {
            val timestamp = timestampFormat.format(Date())
            val screenshotPath = "$outputDir/screenshots/${filename}_$timestamp.png"
            val devicePath = "/sdcard/screenshot_$timestamp.png"

            // 截图到设备
            val captureResult = executeAdbCommand(
                listOf("shell", "screencap", "-p", devicePath),
                timeoutMs = 10000
            )

            // 拉取到本地
            val pullResult = executeAdbCommand(
                listOf("pull", devicePath, screenshotPath),
                timeoutMs = 10000
            )

            // 删除设备上的截图
            executeAdbCommand(listOf("shell", "rm", devicePath), timeoutMs = 5000)

            if (File(screenshotPath).exists()) {
                logEvent("SCREENSHOT", "截图已保存: $screenshotPath")
                println("[截图] 已保存: $screenshotPath")
            } else {
                logEvent("SCREENSHOT_FAILED", "截图失败")
            }
        } catch (e: Exception) {
            logEvent("SCREENSHOT_ERROR", "截图出错: ${e.message}")
            e.printStackTrace()
        }
    }

    /**
     * 保存崩溃日志
     */
    private fun saveCrashLog(timestamp: String, initialLine: String) {
        try {
            val logPath = "$outputDir/logs/crash_$timestamp.log"
            val logFile = File(logPath)

            logFile.writeText("崩溃时间: ${logTimestampFormat.format(Date())}\n")
            logFile.appendText("包名: $packageName\n")
            logFile.appendText("=".repeat(60) + "\n")
            logFile.appendText(initialLine + "\n")

            // 获取更多日志上下文
            val recentLogs = executeAdbCommand(
                listOf("logcat", "-d", "-t", "100", "*:E"),
                timeoutMs = 10000
            )

            recentLogs?.let {
                logFile.appendText("\n\n最近日志:\n")
                logFile.appendText("-".repeat(60) + "\n")
                logFile.appendText(it)
            }

            logEvent("CRASH_LOG_SAVED", "崩溃日志已保存: $logPath")
            println("[崩溃日志] 已保存: $logPath")
        } catch (e: Exception) {
            logEvent("CRASH_LOG_ERROR", "保存崩溃日志出错: ${e.message}")
            e.printStackTrace()
        }
    }

    /**
     * 保存 ANR 日志
     */
    private fun saveAnrLog(timestamp: String, initialLine: String) {
        try {
            val logPath = "$outputDir/logs/anr_$timestamp.log"
            val logFile = File(logPath)

            logFile.writeText("ANR 时间: ${logTimestampFormat.format(Date())}\n")
            logFile.appendText("包名: $packageName\n")
            logFile.appendText("=".repeat(60) + "\n")
            logFile.appendText(initialLine + "\n")

            logEvent("ANR_LOG_SAVED", "ANR 日志已保存: $logPath")
            println("[ANR 日志] 已保存: $logPath")
        } catch (e: Exception) {
            logEvent("ANR_LOG_ERROR", "保存 ANR 日志出错: ${e.message}")
            e.printStackTrace()
        }
    }

    /**
     * 收集 ANR traces
     */
    private fun collectAnrTraces(timestamp: String) {
        try {
            val tracesPath = "$outputDir/logs/anr_traces_$timestamp.txt"

            // 尝试获取 traces
            val traces = executeAdbCommand(
                listOf("shell", "cat", "/data/anr/traces.txt"),
                timeoutMs = 10000
            )

            traces?.let {
                File(tracesPath).writeText(it)
                logEvent("ANR_TRACES_SAVED", "ANR traces 已保存: $tracesPath")
                println("[ANR Traces] 已保存: $tracesPath")
            }
        } catch (e: Exception) {
            logEvent("ANR_TRACES_ERROR", "获取 ANR traces 出错: ${e.message}")
        }
    }

    /**
     * 记录事件
     */
    private fun logEvent(eventType: String, message: String) {
        val timestamp = logTimestampFormat.format(Date())
        val logLine = "[$timestamp] [$eventType] $message"
        reportLines.add(logLine)
    }

    /**
     * 生成监控报告
     */
    private fun generateReport() {
        try {
            val timestamp = timestampFormat.format(Date())
            val reportPath = "$outputDir/monitor_report_$timestamp.txt"
            val reportFile = File(reportPath)

            reportFile.writeText("=".repeat(80) + "\n")
            reportFile.appendText("Android APP 监控报告\n")
            reportFile.appendText("=".repeat(80) + "\n")
            reportFile.appendText("包名: $packageName\n")
            reportFile.appendText("报告时间: ${logTimestampFormat.format(Date())}\n")
            reportFile.appendText("检查间隔: ${checkIntervalMs}ms\n")
            reportFile.appendText("-".repeat(80) + "\n")
            reportFile.appendText("崩溃检测: ${if (crashDetected.get()) "是" else "否"}\n")
            reportFile.appendText("ANR 检测: ${if (anrDetected.get()) "是" else "否"}\n")
            reportFile.appendText("=".repeat(80) + "\n\n")

            reportFile.appendText("事件日志:\n")
            reportFile.appendText("-".repeat(80) + "\n")

            reportLines.forEach { line ->
                reportFile.appendText(line + "\n")
            }

            println("\n" + "=".repeat(60))
            println("监控报告已生成: $reportPath")
            println("=".repeat(60))
        } catch (e: Exception) {
            println("生成报告出错: ${e.message}")
            e.printStackTrace()
        }
    }

    /**
     * 执行 ADB 命令
     */
    private fun executeAdbCommand(args: List<String>, timeoutMs: Long = 30000): String? {
        return try {
            val command = mutableListOf("adb")
            command.addAll(args)

            val processBuilder = ProcessBuilder(command)
            processBuilder.redirectErrorStream(true)

            val process = processBuilder.start()
            val reader = BufferedReader(InputStreamReader(process.inputStream))
            val output = StringBuilder()

            var line: String?
            while (reader.readLine().also { line = it } != null) {
                output.append(line).append("\n")
            }

            val finished = process.waitFor(timeoutMs, java.util.concurrent.TimeUnit.MILLISECONDS)
            if (!finished) {
                process.destroyForcibly()
                return null
            }

            output.toString().trim().takeIf { it.isNotEmpty() }
        } catch (e: Exception) {
            null
        }
    }
}
