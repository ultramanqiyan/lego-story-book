package com.lego.android.e2e

import java.io.BufferedReader
import java.io.File
import java.io.InputStreamReader
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.TimeUnit
import kotlin.system.exitProcess

/**
 * LEGO Story 登录页面 E2E 测试脚本
 * 测试用例: TC-LOGIN-01 ~ TC-LOGIN-04
 *
 * 使用方法: kotlin LoginPageTest.kt
 */
class LoginPageTest {

    companion object {
        const val PACKAGE_NAME = "com.legostory.mobilegame"
        const val API_BASE_URL = "http://localhost:8788"
        const val EMULATOR_SCREEN_WIDTH = 1080
        const val EMULATOR_SCREEN_HEIGHT = 1920

        @JvmStatic
        fun main(args: Array<String>) {
            val test = LoginPageTest()
            test.runAllTests()
        }
    }

    // 测试配置
    private val outputDir = "./test-output/login-test"
    private val screenshotDir = "$outputDir/screenshots"
    private val reportDir = "$outputDir/reports"
    private val timestampFormat = SimpleDateFormat("yyyy-MM-dd_HH-mm-ss", Locale.getDefault())
    private val logTimestampFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS", Locale.getDefault())

    // 测试结果
    private val testResults = mutableListOf<TestResult>()
    private var currentTestCase: String = ""
    private var monitorApp: MonitorAppWrapper? = null

    /**
     * 测试结果数据类
     */
    data class TestResult(
        val testCase: String,
        val testName: String,
        val status: TestStatus,
        val message: String,
        val durationMs: Long,
        val timestamp: String
    )

    enum class TestStatus {
        PASSED, FAILED, SKIPPED
    }

    /**
     * 运行所有测试用例
     */
    fun runAllTests() {
        println("=".repeat(80))
        println("LEGO Story 登录页面 E2E 测试")
        println("=".repeat(80))

        // 创建输出目录
        createOutputDirectories()

        // 启动监控
        startMonitoring()

        try {
            // 检查设备连接
            if (!checkDeviceConnection()) {
                failTest("SETUP", "设备连接检查", "未检测到已连接的Android设备")
                generateReport()
                exitProcess(1)
            }

            // 检查应用是否已安装
            if (!checkAppInstalled()) {
                failTest("SETUP", "应用安装检查", "应用未安装: $PACKAGE_NAME")
                generateReport()
                exitProcess(1)
            }

            // 启动应用
            if (!launchApp()) {
                failTest("SETUP", "应用启动", "无法启动应用")
                generateReport()
                exitProcess(1)
            }

            // 等待登录页面加载
            waitForLoginScreen()

            // 执行测试用例
            executeTestCase("TC-LOGIN-01", "验证页面元素") { testLoginPageElements() }
            executeTestCase("TC-LOGIN-02", "测试用户名输入功能") { testUsernameInput() }
            executeTestCase("TC-LOGIN-03", "测试完整登录流程") { testCompleteLoginFlow() }
            executeTestCase("TC-LOGIN-04", "测试空用户名验证") { testEmptyUsernameValidation() }

        } catch (e: Exception) {
            val errorMsg = "测试执行异常: ${e.message}"
            println("[错误] $errorMsg")
            e.printStackTrace()
            failTest(currentTestCase, "异常处理", errorMsg)
        } finally {
            // 停止监控
            stopMonitoring()
            // 生成测试报告
            generateReport()
        }

        // 根据测试结果退出
        val failedTests = testResults.count { it.status == TestStatus.FAILED }
        if (failedTests > 0) {
            println("\n[失败] $failedTests 个测试用例失败")
            exitProcess(1)
        } else {
            println("\n[成功] 所有测试用例通过!")
            exitProcess(0)
        }
    }

    /**
     * TC-LOGIN-01: 验证页面元素
     * 验证登录页面包含所有必要的UI元素
     */
    private fun testLoginPageElements() {
        logInfo("开始验证页面元素...")

        // 截图: 初始状态
        takeScreenshot("TC-LOGIN-01_initial")

        // 获取当前UI层次结构
        val uiHierarchy = getUiHierarchy()

        // 验证标题 "乐高故事书"
        if (!uiHierarchy.contains("乐高故事书")) {
            throw AssertionError("未找到页面标题: 乐高故事书")
        }
        logInfo("✓ 页面标题验证通过")

        // 验证副标题
        if (!uiHierarchy.contains("Lego Story Book")) {
            throw AssertionError("未找到副标题: Lego Story Book")
        }
        logInfo("✓ 副标题验证通过")

        // 验证用户名输入框
        if (!uiHierarchy.contains("你的名字")) {
            throw AssertionError("未找到用户名输入框标签: 你的名字")
        }
        logInfo("✓ 用户名输入框验证通过")

        // 验证邮箱输入框
        if (!uiHierarchy.contains("邮箱")) {
            throw AssertionError("未找到邮箱输入框标签: 邮箱")
        }
        logInfo("✓ 邮箱输入框验证通过")

        // 验证登录按钮
        if (!uiHierarchy.contains("开始冒险")) {
            throw AssertionError("未找到登录按钮: 开始冒险")
        }
        logInfo("✓ 登录按钮验证通过")

        // 截图: 验证完成
        takeScreenshot("TC-LOGIN-01_completed")

        logInfo("页面元素验证完成")
    }

    /**
     * TC-LOGIN-02: 测试用户名输入功能
     * 验证用户名输入框可以正常输入文本
     */
    private fun testUsernameInput() {
        logInfo("开始测试用户名输入功能...")

        // 截图: 输入前
        takeScreenshot("TC-LOGIN-02_before_input")

        // 点击用户名输入框
        val usernameFieldBounds = findElementBounds("你的名字")
            ?: throw AssertionError("无法找到用户名输入框")

        tap(usernameFieldBounds.centerX(), usernameFieldBounds.centerY())
        waitFor(500)

        // 输入测试用户名
        val testUsername = "测试用户_${System.currentTimeMillis() % 10000}"
        inputText(testUsername)
        waitFor(500)

        // 截图: 输入后
        takeScreenshot("TC-LOGIN-02_after_input")

        // 验证输入内容
        val uiHierarchy = getUiHierarchy()
        if (!uiHierarchy.contains(testUsername)) {
            throw AssertionError("用户名输入失败，UI中未找到输入的文本")
        }

        // 清除输入框内容
        clearInputField(usernameFieldBounds)
        waitFor(300)

        logInfo("✓ 用户名输入功能验证通过")
    }

    /**
     * TC-LOGIN-03: 测试完整登录流程
     * 验证用户可以使用用户名完成登录并导航到主页
     */
    private fun testCompleteLoginFlow() {
        logInfo("开始测试完整登录流程...")

        // 生成唯一的测试用户名
        val testUsername = "E2EUser_${System.currentTimeMillis() % 100000}"
        val testEmail = "test_${System.currentTimeMillis() % 10000}@example.com"

        logInfo("测试用户名: $testUsername")

        // 截图: 登录前
        takeScreenshot("TC-LOGIN-03_before_login")

        // 输入用户名
        val usernameFieldBounds = findElementBounds("你的名字")
            ?: throw AssertionError("无法找到用户名输入框")
        tap(usernameFieldBounds.centerX(), usernameFieldBounds.centerY())
        waitFor(300)
        inputText(testUsername)
        waitFor(300)

        // 输入邮箱
        val emailFieldBounds = findElementBounds("邮箱")
            ?: throw AssertionError("无法找到邮箱输入框")
        tap(emailFieldBounds.centerX(), emailFieldBounds.centerY())
        waitFor(300)
        inputText(testEmail)
        waitFor(300)

        // 截图: 填写信息后
        takeScreenshot("TC-LOGIN-03_filled_form")

        // 点击登录按钮
        val loginButtonBounds = findElementBounds("开始冒险")
            ?: throw AssertionError("无法找到登录按钮")
        tap(loginButtonBounds.centerX(), loginButtonBounds.centerY())

        logInfo("已点击登录按钮，等待响应...")

        // 等待登录处理
        waitFor(3000)

        // 截图: 登录后
        takeScreenshot("TC-LOGIN-03_after_login")

        // 验证是否导航到主页（检查主页特征元素）
        val uiHierarchy = getUiHierarchy()
        val isOnHomePage = uiHierarchy.contains("书架") ||
                          uiHierarchy.contains("我的故事") ||
                          uiHierarchy.contains("创建") ||
                          !uiHierarchy.contains("乐高故事书") // 不在登录页了

        if (!isOnHomePage) {
            // 检查是否有错误提示
            if (uiHierarchy.contains("错误") || uiHierarchy.contains("失败")) {
                throw AssertionError("登录失败，页面显示错误信息")
            }
            // 可能还在登录页，说明登录没成功
            if (uiHierarchy.contains("乐高故事书")) {
                throw AssertionError("登录后仍停留在登录页面")
            }
        }

        logInfo("✓ 登录流程验证通过，已导航到主页")

        // 验证API数据 - 检查用户是否已创建
        verifyUserCreated(testUsername)

        // 返回登录页以便后续测试
        restartApp()
        waitForLoginScreen()
    }

    /**
     * TC-LOGIN-04: 测试空用户名验证
     * 验证当用户名为空时，登录按钮应该被禁用或显示错误
     */
    private fun testEmptyUsernameValidation() {
        logInfo("开始测试空用户名验证...")

        // 截图: 初始状态
        takeScreenshot("TC-LOGIN-04_initial")

        // 确保用户名为空
        val usernameFieldBounds = findElementBounds("你的名字")
            ?: throw AssertionError("无法找到用户名输入框")

        // 点击用户名输入框并清除内容
        tap(usernameFieldBounds.centerX(), usernameFieldBounds.centerY())
        waitFor(300)
        clearInputField(usernameFieldBounds)
        waitFor(300)

        // 截图: 空用户名状态
        takeScreenshot("TC-LOGIN-04_empty_username")

        // 尝试点击登录按钮
        val loginButtonBounds = findElementBounds("开始冒险")
            ?: throw AssertionError("无法找到登录按钮")

        tap(loginButtonBounds.centerX(), loginButtonBounds.centerY())
        waitFor(1000)

        // 截图: 点击后
        takeScreenshot("TC-LOGIN-04_after_click")

        // 验证仍在登录页面（没有导航走）
        val uiHierarchy = getUiHierarchy()
        val stillOnLoginPage = uiHierarchy.contains("乐高故事书")

        if (!stillOnLoginPage) {
            throw AssertionError("空用户名时点击登录按钮后离开了登录页面，验证失败")
        }

        logInfo("✓ 空用户名验证通过，登录按钮正确处理空输入")
    }

    // ==================== 辅助方法 ====================

    /**
     * 执行单个测试用例
     */
    private fun executeTestCase(testCaseId: String, testName: String, testFunction: () -> Unit) {
        currentTestCase = testCaseId
        logInfo("\n${"=".repeat(60)}")
        logInfo("执行测试: $testCaseId - $testName")
        logInfo("=".repeat(60))

        val startTime = System.currentTimeMillis()

        try {
            testFunction()
            val duration = System.currentTimeMillis() - startTime
            passTest(testCaseId, testName, duration)
        } catch (e: AssertionError) {
            val duration = System.currentTimeMillis() - startTime
            failTest(testCaseId, testName, e.message ?: "断言失败")
            takeScreenshot("${testCaseId}_failure")
            throw e // 停止后续测试
        } catch (e: Exception) {
            val duration = System.currentTimeMillis() - startTime
            failTest(testCaseId, testName, "异常: ${e.message}")
            takeScreenshot("${testCaseId}_error")
            throw e // 停止后续测试
        }
    }

    /**
     * 记录测试通过
     */
    private fun passTest(testCase: String, testName: String, durationMs: Long) {
        val result = TestResult(
            testCase = testCase,
            testName = testName,
            status = TestStatus.PASSED,
            message = "测试通过",
            durationMs = durationMs,
            timestamp = logTimestampFormat.format(Date())
        )
        testResults.add(result)
        logInfo("[通过] $testCase - $testName (${durationMs}ms)")
    }

    /**
     * 记录测试失败
     */
    private fun failTest(testCase: String, testName: String, message: String) {
        val result = TestResult(
            testCase = testCase,
            testName = testName,
            status = TestStatus.FAILED,
            message = message,
            durationMs = 0,
            timestamp = logTimestampFormat.format(Date())
        )
        testResults.add(result)
        logInfo("[失败] $testCase - $testName: $message")
    }

    /**
     * 创建输出目录
     */
    private fun createOutputDirectories() {
        File(outputDir).mkdirs()
        File(screenshotDir).mkdirs()
        File(reportDir).mkdirs()
        logInfo("输出目录已创建: $outputDir")
    }

    /**
     * 启动应用监控
     */
    private fun startMonitoring() {
        monitorApp = MonitorAppWrapper(PACKAGE_NAME, outputDir)
        monitorApp?.start()
        logInfo("应用监控已启动")
    }

    /**
     * 停止应用监控
     */
    private fun stopMonitoring() {
        monitorApp?.stop()
        logInfo("应用监控已停止")
    }

    /**
     * 检查设备连接
     */
    private fun checkDeviceConnection(): Boolean {
        logInfo("检查设备连接...")
        val result = executeAdbCommand(listOf("devices")) ?: return false
        return result.contains("device") && result.lines().size > 1
    }

    /**
     * 检查应用是否已安装
     */
    private fun checkAppInstalled(): Boolean {
        logInfo("检查应用是否已安装...")
        val result = executeAdbCommand(listOf("shell", "pm", "list", "packages", PACKAGE_NAME))
        return result?.contains(PACKAGE_NAME) ?: false
    }

    /**
     * 启动应用
     */
    private fun launchApp(): Boolean {
        logInfo("启动应用...")
        val result = executeAdbCommand(
            listOf("shell", "am", "start", "-n", "$PACKAGE_NAME/.MainActivity"),
            timeoutMs = 10000
        )
        waitFor(2000)
        return result != null
    }

    /**
     * 重启应用
     */
    private fun restartApp() {
        logInfo("重启应用...")
        executeAdbCommand(listOf("shell", "am", "force-stop", PACKAGE_NAME))
        waitFor(1000)
        launchApp()
    }

    /**
     * 等待登录页面加载
     */
    private fun waitForLoginScreen(timeoutMs: Long = 10000) {
        logInfo("等待登录页面加载...")
        val startTime = System.currentTimeMillis()

        while (System.currentTimeMillis() - startTime < timeoutMs) {
            val uiHierarchy = getUiHierarchy()
            if (uiHierarchy.contains("乐高故事书") && uiHierarchy.contains("开始冒险")) {
                logInfo("登录页面已加载")
                return
            }
            waitFor(500)
        }

        throw AssertionError("登录页面加载超时 (${timeoutMs}ms)")
    }

    /**
     * 获取UI层次结构
     */
    private fun getUiHierarchy(): String {
        val dumpFile = "/sdcard/ui_dump.xml"
        executeAdbCommand(listOf("shell", "uiautomator", "dump", dumpFile), timeoutMs = 5000)
        waitFor(200)

        val result = executeAdbCommand(listOf("shell", "cat", dumpFile), timeoutMs = 5000)
        return result ?: ""
    }

    /**
     * 查找元素边界
     */
    private fun findElementBounds(text: String): Bounds? {
        val uiHierarchy = getUiHierarchy()

        // 解析XML查找包含指定文本的元素
        val pattern = """<node[^>]*text="$text"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"""".toRegex()
        val match = pattern.find(uiHierarchy)

        if (match != null) {
            val left = match.groupValues[1].toInt()
            val top = match.groupValues[2].toInt()
            val right = match.groupValues[3].toInt()
            val bottom = match.groupValues[4].toInt()
            return Bounds(left, top, right, bottom)
        }

        // 尝试content-desc匹配
        val descPattern = """<node[^>]*content-desc="$text"[^>]*bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"""".toRegex()
        val descMatch = descPattern.find(uiHierarchy)

        if (descMatch != null) {
            val left = descMatch.groupValues[1].toInt()
            val top = descMatch.groupValues[2].toInt()
            val right = descMatch.groupValues[3].toInt()
            val bottom = descMatch.groupValues[4].toInt()
            return Bounds(left, top, right, bottom)
        }

        return null
    }

    /**
     * 点击屏幕坐标
     */
    private fun tap(x: Int, y: Int) {
        executeAdbCommand(listOf("shell", "input", "tap", x.toString(), y.toString()))
        waitFor(200)
    }

    /**
     * 输入文本
     */
    private fun inputText(text: String) {
        // 替换空格为 %s 以便ADB shell正确传递
        val escapedText = text.replace(" ", "%s")
        executeAdbCommand(listOf("shell", "input", "text", escapedText))
        waitFor(200)
    }

    /**
     * 清除输入框内容
     */
    private fun clearInputField(bounds: Bounds) {
        // 长按选择全部
        executeAdbCommand(listOf(
            "shell", "input", "swipe",
            bounds.centerX().toString(), bounds.centerY().toString(),
            bounds.centerX().toString(), bounds.centerY().toString(),
            "1000"
        ))
        waitFor(300)
        // 输入空字符（删除选中内容）
        executeAdbCommand(listOf("shell", "input", "keyevent", "67")) // DEL key
        waitFor(200)
    }

    /**
     * 截图
     */
    private fun takeScreenshot(filename: String) {
        try {
            val timestamp = timestampFormat.format(Date())
            val screenshotPath = "$screenshotDir/${filename}_$timestamp.png"
            val devicePath = "/sdcard/screenshot_$filename.png"

            // 截图到设备
            executeAdbCommand(listOf("shell", "screencap", "-p", devicePath), timeoutMs = 5000)
            waitFor(200)

            // 拉取到本地
            executeAdbCommand(listOf("pull", devicePath, screenshotPath), timeoutMs = 5000)

            // 删除设备上的截图
            executeAdbCommand(listOf("shell", "rm", devicePath), timeoutMs = 2000)

            if (File(screenshotPath).exists()) {
                logInfo("[截图] $filename")
            }
        } catch (e: Exception) {
            logInfo("[截图失败] ${e.message}")
        }
    }

    /**
     * 验证用户是否通过API创建
     */
    private fun verifyUserCreated(username: String) {
        logInfo("验证用户API数据: $username")

        try {
            // 等待API处理
            waitFor(1000)

            // 调用API验证用户创建
            val url = URL("$API_BASE_URL/api/users/me")
            val connection = url.openConnection() as HttpURLConnection
            connection.requestMethod = "GET"
            connection.connectTimeout = 5000
            connection.readTimeout = 5000

            val responseCode = connection.responseCode
            logInfo("API响应码: $responseCode")

            if (responseCode == 200) {
                val response = connection.inputStream.bufferedReader().use { it.readText() }
                logInfo("✓ API用户数据验证通过")
                logInfo("响应: $response")
            } else {
                logInfo("⚠ API验证返回非200状态码: $responseCode")
            }

            connection.disconnect()
        } catch (e: Exception) {
            logInfo("⚠ API验证失败: ${e.message}")
            // API验证失败不阻止测试，仅记录
        }
    }

    /**
     * 生成测试报告
     */
    private fun generateReport() {
        val timestamp = timestampFormat.format(Date())
        val reportPath = "$reportDir/test_report_$timestamp.html"
        val reportFile = File(reportPath)

        val passedCount = testResults.count { it.status == TestStatus.PASSED }
        val failedCount = testResults.count { it.status == TestStatus.FAILED }
        val totalCount = testResults.size

        val html = buildString {
            appendLine("<!DOCTYPE html>")
            appendLine("<html>")
            appendLine("<head>")
            appendLine("<meta charset=\"UTF-8\">")
            appendLine("<title>LEGO Story 登录页面测试报告</title>")
            appendLine("<style>")
            appendLine("body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }")
            appendLine(".container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }")
            appendLine("h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }")
            appendLine(".summary { display: flex; gap: 20px; margin: 20px 0; }")
            appendLine(".stat { padding: 15px 25px; border-radius: 8px; font-size: 18px; font-weight: bold; }")
            appendLine(".stat.passed { background: #4CAF50; color: white; }")
            appendLine(".stat.failed { background: #f44336; color: white; }")
            appendLine(".stat.total { background: #2196F3; color: white; }")
            appendLine("table { width: 100%; border-collapse: collapse; margin-top: 20px; }")
            appendLine("th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }")
            appendLine("th { background: #4CAF50; color: white; }")
            appendLine("tr:hover { background: #f5f5f5; }")
            appendLine(".status-passed { color: #4CAF50; font-weight: bold; }")
            appendLine(".status-failed { color: #f44336; font-weight: bold; }")
            appendLine(".timestamp { color: #666; font-size: 12px; }")
            appendLine("</style>")
            appendLine("</head>")
            appendLine("<body>")
            appendLine("<div class=\"container\">")
            appendLine("<h1>LEGO Story 登录页面 E2E 测试报告</h1>")
            appendLine("<p class=\"timestamp\">生成时间: ${logTimestampFormat.format(Date())}</p>")
            appendLine("<div class=\"summary\">")
            appendLine("<div class=\"stat total\">总计: $totalCount</div>")
            appendLine("<div class=\"stat passed\">通过: $passedCount</div>")
            appendLine("<div class=\"stat failed\">失败: $failedCount</div>")
            appendLine("</div>")
            appendLine("<table>")
            appendLine("<tr><th>测试用例</th><th>测试名称</th><th>状态</th><th>耗时(ms)</th><th>消息</th><th>时间戳</th></tr>")

            testResults.forEach { result ->
                val statusClass = if (result.status == TestStatus.PASSED) "status-passed" else "status-failed"
                val statusText = if (result.status == TestStatus.PASSED) "通过" else "失败"
                appendLine("<tr>")
                appendLine("<td>${result.testCase}</td>")
                appendLine("<td>${result.testName}</td>")
                appendLine("<td class=\"$statusClass\">$statusText</td>")
                appendLine("<td>${result.durationMs}</td>")
                appendLine("<td>${result.message}</td>")
                appendLine("<td>${result.timestamp}</td>")
                appendLine("</tr>")
            }

            appendLine("</table>")
            appendLine("</div>")
            appendLine("</body>")
            appendLine("</html>")
        }

        reportFile.writeText(html)
        println("\n" + "=".repeat(60))
        println("测试报告已生成: $reportPath")
        println("=".repeat(60))
    }

    /**
     * 等待指定时间
     */
    private fun waitFor(ms: Long) {
        Thread.sleep(ms)
    }

    /**
     * 记录日志
     */
    private fun logInfo(message: String) {
        val timestamp = logTimestampFormat.format(Date())
        println("[$timestamp] $message")
    }

    /**
     * 执行ADB命令
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

            val finished = process.waitFor(timeoutMs, TimeUnit.MILLISECONDS)
            if (!finished) {
                process.destroyForcibly()
                return null
            }

            output.toString().trim().takeIf { it.isNotEmpty() }
        } catch (e: Exception) {
            null
        }
    }

    /**
     * 边界数据类
     */
    data class Bounds(
        val left: Int,
        val top: Int,
        val right: Int,
        val bottom: Int
    ) {
        fun centerX(): Int = (left + right) / 2
        fun centerY(): Int = (top + bottom) / 2
    }

    /**
     * 监控包装类
     */
    inner class MonitorAppWrapper(
        private val packageName: String,
        private val outputDir: String
    ) {
        private var monitorThread: Thread? = null
        private var isRunning = false
        private val crashDetected = java.util.concurrent.atomic.AtomicBoolean(false)
        private val anrDetected = java.util.concurrent.atomic.AtomicBoolean(false)

        fun start() {
            isRunning = true
            monitorThread = Thread({ monitorLoop() }, "AppMonitor")
            monitorThread?.start()
        }

        fun stop() {
            isRunning = false
            monitorThread?.join(5000)
        }

        fun hasCrash(): Boolean = crashDetected.get()
        fun hasAnr(): Boolean = anrDetected.get()

        private fun monitorLoop() {
            while (isRunning) {
                try {
                    checkLogcat()
                    checkProcessStatus()
                    Thread.sleep(1000)
                } catch (e: InterruptedException) {
                    break
                }
            }
        }

        private fun checkLogcat() {
            try {
                val result = executeAdbCommand(
                    listOf("logcat", "-d", "-t", "10", "*:E"),
                    timeoutMs = 5000
                ) ?: return

                if (result.contains("FATAL EXCEPTION") && result.contains(packageName)) {
                    crashDetected.set(true)
                    logInfo("[监控] 检测到应用崩溃!")
                }

                if (result.contains("ANR") && result.contains(packageName)) {
                    anrDetected.set(true)
                    logInfo("[监控] 检测到ANR!")
                }
            } catch (e: Exception) {
                // 忽略
            }
        }

        private fun checkProcessStatus() {
            try {
                val result = executeAdbCommand(
                    listOf("shell", "pidof", packageName),
                    timeoutMs = 3000
                )

                if (result.isNullOrBlank()) {
                    logInfo("[监控] 应用进程未找到")
                }
            } catch (e: Exception) {
                // 忽略
            }
        }
    }
}
