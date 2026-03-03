package com.lego.android.parity

import java.io.File

object ParityAnalyzer {
    
    @JvmStatic
    fun main(args: Array<String>) {
        val config = parseArguments(args)
        
        Logger.setLogLevel(if (config.verbose) Logger.LogLevel.DEBUG else Logger.LogLevel.INFO)
        
        printBanner()
        
        println("配置信息:")
        println("  RN项目路径: ${config.rnProjectPath}")
        println("  Android项目路径: ${config.androidProjectPath}")
        println("  输出目录: ${config.outputDir}")
        println("  比较类型: ${config.compareTypes.joinToString()}")
        println("  增量模式: ${config.incremental}")
        println()
        
        validatePaths(config)
        
        val generator = ParityReportGenerator(
            config.rnProjectPath,
            config.androidProjectPath,
            config.outputDir
        )
        
        val report = if (config.incremental && config.changedFiles.isNotEmpty()) {
            println("运行增量比较...")
            generator.generateIncrementalReport(config.changedFiles)
        } else {
            println("运行完整比较...")
            generator.generateFullReport()
        }
        
        generator.printSummary(report)
        
        if (config.outputJson) {
            generator.saveReportToJson(report, config.jsonFilename)
        }
        
        if (config.outputHtml) {
            generator.saveReportToHtml(report, config.htmlFilename)
        }
        
        println("\n分析完成!")
        
        if (report.statistics.highPriorityCount > 0) {
            println("\n⚠️ 发现 ${report.statistics.highPriorityCount} 个高优先级问题需要处理")
        }
        
        val exitCode = if (report.statistics.highPriorityCount > 0 && config.failOnHighPriority) 1 else 0
        System.exit(exitCode)
    }
    
    private fun printBanner() {
        println()
        println("╔════════════════════════════════════════════════════════════╗")
        println("║       🔍 RN-Android 一致性检查工具 v1.0.0                  ║")
        println("║       React Native & Android Parity Analyzer               ║")
        println("╚════════════════════════════════════════════════════════════╝")
        println()
    }
    
    private fun parseArguments(args: Array<String>): AnalyzerConfig {
        var rnPath = "../lego-mobile"
        var androidPath = "."
        var outputDir = "parity-reports"
        var verbose = false
        var outputJson = true
        var outputHtml = true
        var jsonFilename = "parity-report.json"
        var htmlFilename = "parity-report.html"
        var incremental = false
        var failOnHighPriority = false
        val compareTypes = mutableListOf("layout", "style", "animation", "theme")
        val changedFiles = mutableListOf<String>()
        
        var i = 0
        while (i < args.size) {
            when (args[i]) {
                "--rn-path", "-r" -> {
                    rnPath = args.getOrElse(++i) { rnPath }
                }
                "--android-path", "-a" -> {
                    androidPath = args.getOrElse(++i) { androidPath }
                }
                "--output", "-o" -> {
                    outputDir = args.getOrElse(++i) { outputDir }
                }
                "--verbose", "-v" -> {
                    verbose = true
                }
                "--no-json" -> {
                    outputJson = false
                }
                "--no-html" -> {
                    outputHtml = false
                }
                "--json-name" -> {
                    jsonFilename = args.getOrElse(++i) { jsonFilename }
                }
                "--html-name" -> {
                    htmlFilename = args.getOrElse(++i) { htmlFilename }
                }
                "--type", "-t" -> {
                    compareTypes.clear()
                    val types = args.getOrElse(++i) { "all" }
                    if (types != "all") {
                        compareTypes.addAll(types.split(","))
                    }
                }
                "--incremental", "-i" -> {
                    incremental = true
                }
                "--changed-files", "-f" -> {
                    val files = args.getOrElse(++i) { "" }
                    changedFiles.addAll(files.split(","))
                }
                "--fail-on-high" -> {
                    failOnHighPriority = true
                }
                "--help", "-h" -> {
                    printHelp()
                    System.exit(0)
                }
            }
            i++
        }
        
        return AnalyzerConfig(
            rnProjectPath = rnPath,
            androidProjectPath = androidPath,
            outputDir = outputDir,
            verbose = verbose,
            outputJson = outputJson,
            outputHtml = outputHtml,
            jsonFilename = jsonFilename,
            htmlFilename = htmlFilename,
            compareTypes = compareTypes,
            incremental = incremental,
            changedFiles = changedFiles,
            failOnHighPriority = failOnHighPriority
        )
    }
    
    private fun printHelp() {
        println("""
            用法: ParityAnalyzer [选项]
            
            选项:
              -r, --rn-path <path>       React Native项目路径 (默认: ../lego-mobile)
              -a, --android-path <path>  Android项目路径 (默认: .)
              -o, --output <dir>         报告输出目录 (默认: parity-reports)
              -t, --type <types>         比较类型: layout,style,animation,theme,all (默认: all)
              -v, --verbose              详细输出模式
              --no-json                  不生成JSON报告
              --no-html                  不生成HTML报告
              --json-name <name>         JSON文件名 (默认: parity-report.json)
              --html-name <name>         HTML文件名 (默认: parity-report.html)
              -i, --incremental          增量比较模式
              -f, --changed-files <files> 变更文件列表 (逗号分隔)
              --fail-on-high             高优先级问题时返回非零退出码
              -h, --help                 显示帮助信息
            
            示例:
              # 完整比较
              ParityAnalyzer -r ../lego-mobile -a . -o reports
              
              # 只比较布局和样式
              ParityAnalyzer -t layout,style
              
              # 增量比较
              ParityAnalyzer -i -f "src/screens/HomeScreen.js,src/styles/colors.js"
              
              # 详细模式
              ParityAnalyzer -v
        """.trimIndent())
    }
    
    private fun validatePaths(config: AnalyzerConfig) {
        val rnDir = File(config.rnProjectPath)
        if (!rnDir.exists()) {
            Logger.error("RN项目路径不存在: ${config.rnProjectPath}")
            System.exit(1)
        }
        
        val androidDir = File(config.androidProjectPath)
        if (!androidDir.exists()) {
            Logger.error("Android项目路径不存在: ${config.androidProjectPath}")
            System.exit(1)
        }
        
        Logger.info("路径验证通过")
    }
    
    data class AnalyzerConfig(
        val rnProjectPath: String,
        val androidProjectPath: String,
        val outputDir: String,
        val verbose: Boolean,
        val outputJson: Boolean,
        val outputHtml: Boolean,
        val jsonFilename: String,
        val htmlFilename: String,
        val compareTypes: List<String>,
        val incremental: Boolean,
        val changedFiles: List<String>,
        val failOnHighPriority: Boolean
    )
}

fun main(args: Array<String>) {
    ParityAnalyzer.main(args)
}
