package com.lego.android.parity

import java.io.File
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ParityReportGenerator(
    private val rnProjectPath: String,
    private val androidProjectPath: String,
    private val outputDir: String
) {
    private val layoutComparator = LayoutComparator(rnProjectPath, androidProjectPath)
    private val styleComparator = StyleComparator(rnProjectPath, androidProjectPath)
    private val animationComparator = AnimationComparator(rnProjectPath, androidProjectPath)
    private val themeComparator = ThemeComparator(rnProjectPath, androidProjectPath)
    
    fun generateFullReport(): ParityReport {
        Logger.info("Generating full parity report...")
        
        val timestamp = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())
        
        val layoutResults = layoutComparator.compare()
        val styleResults = styleComparator.compare()
        val animationResults = animationComparator.compare()
        val themeResults = themeComparator.compare()
        
        val allResults = layoutResults + styleResults + animationResults + themeResults
        
        val statistics = ReportStatistics(
            totalComparisons = allResults.size,
            matchCount = allResults.count { it.status == ComparisonStatus.MATCH },
            mismatchCount = allResults.count { it.status == ComparisonStatus.MISMATCH },
            missingInAndroidCount = allResults.count { it.status == ComparisonStatus.MISSING_IN_ANDROID },
            missingInRnCount = allResults.count { it.status == ComparisonStatus.MISSING_IN_RN },
            errorCount = allResults.count { it.status == ComparisonStatus.ERROR },
            highPriorityCount = allResults.count { it.priority == Priority.HIGH },
            mediumPriorityCount = allResults.count { it.priority == Priority.MEDIUM },
            lowPriorityCount = allResults.count { it.priority == Priority.LOW }
        )
        
        return ParityReport(
            timestamp = timestamp,
            rnProjectPath = rnProjectPath,
            androidProjectPath = androidProjectPath,
            layoutComparisons = layoutResults,
            styleComparisons = styleResults,
            animationComparisons = animationResults,
            themeComparisons = themeResults,
            statistics = statistics
        )
    }
    
    fun generateIncrementalReport(changedFiles: List<String>): ParityReport {
        Logger.info("Generating incremental report for ${changedFiles.size} changed files...")
        
        val timestamp = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(Date())
        
        val layoutResults = mutableListOf<ComparisonResult>()
        val styleResults = mutableListOf<ComparisonResult>()
        val animationResults = mutableListOf<ComparisonResult>()
        val themeResults = mutableListOf<ComparisonResult>()
        
        for (file in changedFiles) {
            when {
                file.contains("/screens/") && file.endsWith(".js") -> {
                    val screenName = File(file).nameWithoutExtension
                    layoutResults.addAll(layoutComparator.compareSpecificScreen(screenName))
                }
                file.contains("/styles/") || file.contains("colors.js") || file.contains("theme.js") -> {
                    styleResults.addAll(styleComparator.compare())
                }
                file.contains("animation") -> {
                    animationResults.addAll(animationComparator.compare())
                }
                file.contains("theme") -> {
                    themeResults.addAll(themeComparator.compare())
                }
            }
        }
        
        val allResults = layoutResults + styleResults + animationResults + themeResults
        
        val statistics = ReportStatistics(
            totalComparisons = allResults.size,
            matchCount = allResults.count { it.status == ComparisonStatus.MATCH },
            mismatchCount = allResults.count { it.status == ComparisonStatus.MISMATCH },
            missingInAndroidCount = allResults.count { it.status == ComparisonStatus.MISSING_IN_ANDROID },
            missingInRnCount = allResults.count { it.status == ComparisonStatus.MISSING_IN_RN },
            errorCount = allResults.count { it.status == ComparisonStatus.ERROR },
            highPriorityCount = allResults.count { it.priority == Priority.HIGH },
            mediumPriorityCount = allResults.count { it.priority == Priority.MEDIUM },
            lowPriorityCount = allResults.count { it.priority == Priority.LOW }
        )
        
        return ParityReport(
            timestamp = timestamp,
            rnProjectPath = rnProjectPath,
            androidProjectPath = androidProjectPath,
            layoutComparisons = layoutResults,
            styleComparisons = styleResults,
            animationComparisons = animationResults,
            themeComparisons = themeResults,
            statistics = statistics
        )
    }
    
    fun saveReportToJson(report: ParityReport, filename: String = "parity-report.json") {
        val outputDirectory = FileUtils.ensureDirectory(outputDir)
        val outputFile = File(outputDirectory, filename)
        
        val jsonContent = buildJsonReport(report)
        outputFile.writeText(jsonContent)
        
        Logger.info("JSON report saved to: ${outputFile.absolutePath}")
    }
    
    fun saveReportToHtml(report: ParityReport, filename: String = "parity-report.html") {
        val outputDirectory = FileUtils.ensureDirectory(outputDir)
        val outputFile = File(outputDirectory, filename)
        
        val htmlContent = buildHtmlReport(report)
        outputFile.writeText(htmlContent)
        
        Logger.info("HTML report saved to: ${outputFile.absolutePath}")
    }
    
    private fun buildJsonReport(report: ParityReport): String {
        val sb = StringBuilder()
        
        sb.appendLine("{")
        sb.appendLine("  \"timestamp\": \"${report.timestamp}\",")
        sb.appendLine("  \"rnProjectPath\": \"${report.rnProjectPath}\",")
        sb.appendLine("  \"androidProjectPath\": \"${report.androidProjectPath}\",")
        
        sb.appendLine("  \"statistics\": {")
        sb.appendLine("    \"totalComparisons\": ${report.statistics.totalComparisons},")
        sb.appendLine("    \"matchCount\": ${report.statistics.matchCount},")
        sb.appendLine("    \"mismatchCount\": ${report.statistics.mismatchCount},")
        sb.appendLine("    \"missingInAndroidCount\": ${report.statistics.missingInAndroidCount},")
        sb.appendLine("    \"missingInRnCount\": ${report.statistics.missingInRnCount},")
        sb.appendLine("    \"errorCount\": ${report.statistics.errorCount},")
        sb.appendLine("    \"highPriorityCount\": ${report.statistics.highPriorityCount},")
        sb.appendLine("    \"mediumPriorityCount\": ${report.statistics.mediumPriorityCount},")
        sb.appendLine("    \"lowPriorityCount\": ${report.statistics.lowPriorityCount}")
        sb.appendLine("  },")
        
        sb.appendLine("  \"layoutComparisons\": [")
        sb.append(buildResultsJson(report.layoutComparisons, 4))
        sb.appendLine("  ],")
        
        sb.appendLine("  \"styleComparisons\": [")
        sb.append(buildResultsJson(report.styleComparisons, 4))
        sb.appendLine("  ],")
        
        sb.appendLine("  \"animationComparisons\": [")
        sb.append(buildResultsJson(report.animationComparisons, 4))
        sb.appendLine("  ],")
        
        sb.appendLine("  \"themeComparisons\": [")
        sb.append(buildResultsJson(report.themeComparisons, 4))
        sb.appendLine("  ]")
        
        sb.appendLine("}")
        
        return sb.toString()
    }
    
    private fun buildResultsJson(results: List<ComparisonResult>, indent: Int): String {
        val indentStr = " ".repeat(indent)
        val sb = StringBuilder()
        
        results.forEachIndexed { index, result ->
            sb.appendLine("$indentStr{")
            sb.appendLine("$indentStr  \"category\": \"${result.category}\",")
            sb.appendLine("$indentStr  \"itemName\": \"${result.itemName}\",")
            sb.appendLine("$indentStr  \"status\": \"${result.status}\",")
            sb.appendLine("$indentStr  \"rnValue\": ${result.rnValue?.let { "\"$it\"" } ?: "null"},")
            sb.appendLine("$indentStr  \"androidValue\": ${result.androidValue?.let { "\"$it\"" } ?: "null"},")
            sb.appendLine("$indentStr  \"difference\": ${result.difference?.let { "\"$it\"" } ?: "null"},")
            sb.appendLine("$indentStr  \"priority\": \"${result.priority}\",")
            sb.appendLine("$indentStr  \"suggestions\": [")
            result.suggestions.forEachIndexed { sIndex, suggestion ->
                sb.append("$indentStr    \"$suggestion\"")
                if (sIndex < result.suggestions.size - 1) sb.append(",")
                sb.appendLine()
            }
            sb.appendLine("$indentStr  ]")
            
            if (index < results.size - 1) {
                sb.appendLine("$indentStr},")
            } else {
                sb.appendLine("$indentStr}")
            }
        }
        
        return sb.toString()
    }
    
    private fun buildHtmlReport(report: ParityReport): String {
        val sb = StringBuilder()
        
        sb.appendLine("<!DOCTYPE html>")
        sb.appendLine("<html lang=\"zh-CN\">")
        sb.appendLine("<head>")
        sb.appendLine("  <meta charset=\"UTF-8\">")
        sb.appendLine("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">")
        sb.appendLine("  <title>RN-Android Parity Report</title>")
        sb.appendLine("  <style>")
        sb.appendLine(buildCssStyles())
        sb.appendLine("  </style>")
        sb.appendLine("</head>")
        sb.appendLine("<body>")
        
        sb.appendLine("  <div class=\"container\">")
        sb.appendLine("    <h1>🔍 React Native - Android 一致性检查报告</h1>")
        sb.appendLine("    <div class=\"meta\">")
        sb.appendLine("      <p>生成时间: ${report.timestamp}</p>")
        sb.appendLine("      <p>RN项目路径: ${report.rnProjectPath}</p>")
        sb.appendLine("      <p>Android项目路径: ${report.androidProjectPath}</p>")
        sb.appendLine("    </div>")
        
        sb.appendLine(buildStatisticsSection(report.statistics))
        
        sb.appendLine(buildResultsSection("布局结构比较", report.layoutComparisons, "layout"))
        sb.appendLine(buildResultsSection("样式值比较", report.styleComparisons, "style"))
        sb.appendLine(buildResultsSection("动画参数比较", report.animationComparisons, "animation"))
        sb.appendLine(buildResultsSection("主题配置比较", report.themeComparisons, "theme"))
        
        sb.appendLine(buildPriorityRecommendations(report))
        
        sb.appendLine("  </div>")
        sb.appendLine("</body>")
        sb.appendLine("</html>")
        
        return sb.toString()
    }
    
    private fun buildCssStyles(): String {
        return """
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                padding: 32px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            h1 {
                color: #1a1a2e;
                margin-bottom: 8px;
            }
            .meta {
                color: #666;
                margin-bottom: 24px;
                padding-bottom: 16px;
                border-bottom: 1px solid #eee;
            }
            .meta p {
                margin: 4px 0;
            }
            .statistics {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 16px;
                margin-bottom: 32px;
            }
            .stat-card {
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                border-radius: 12px;
                padding: 20px;
                text-align: center;
            }
            .stat-card.match { background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); }
            .stat-card.mismatch { background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); }
            .stat-card.missing { background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%); }
            .stat-card.error { background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); }
            .stat-value {
                font-size: 32px;
                font-weight: bold;
                color: #1a1a2e;
            }
            .stat-label {
                font-size: 14px;
                color: #666;
                margin-top: 4px;
            }
            .section {
                margin-bottom: 32px;
            }
            .section h2 {
                color: #1a1a2e;
                margin-bottom: 16px;
                padding-bottom: 8px;
                border-bottom: 2px solid #667eea;
            }
            .results-table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
            }
            .results-table th {
                background: #f8f9fa;
                padding: 12px;
                text-align: left;
                border-bottom: 2px solid #dee2e6;
            }
            .results-table td {
                padding: 12px;
                border-bottom: 1px solid #dee2e6;
            }
            .results-table tr:hover {
                background: #f8f9fa;
            }
            .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
            }
            .status-match { background: #d4edda; color: #155724; }
            .status-mismatch { background: #f8d7da; color: #721c24; }
            .status-missing-android { background: #fff3cd; color: #856404; }
            .status-missing-rn { background: #cce5ff; color: #004085; }
            .status-error { background: #f8d7da; color: #721c24; }
            .priority-high { color: #dc3545; font-weight: bold; }
            .priority-medium { color: #ffc107; font-weight: bold; }
            .priority-low { color: #28a745; }
            .recommendations {
                background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
                border-radius: 12px;
                padding: 20px;
            }
            .recommendations h3 {
                margin-top: 0;
                color: #856404;
            }
            .recommendations ul {
                margin: 0;
                padding-left: 20px;
            }
            .recommendations li {
                margin-bottom: 8px;
                color: #856404;
            }
            .collapsible {
                cursor: pointer;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 8px;
                margin-bottom: 8px;
            }
            .collapsible:hover {
                background: #e9ecef;
            }
            .content {
                display: none;
                padding: 12px;
            }
            .active {
                display: block;
            }
        """.trimIndent()
    }
    
    private fun buildStatisticsSection(statistics: ReportStatistics): String {
        val sb = StringBuilder()
        
        sb.appendLine("    <div class=\"statistics\">")
        sb.appendLine("      <div class=\"stat-card match\">")
        sb.appendLine("        <div class=\"stat-value\">${statistics.matchCount}</div>")
        sb.appendLine("        <div class=\"stat-label\">✅ 匹配</div>")
        sb.appendLine("      </div>")
        
        sb.appendLine("      <div class=\"stat-card mismatch\">")
        sb.appendLine("        <div class=\"stat-value\">${statistics.mismatchCount}</div>")
        sb.appendLine("        <div class=\"stat-label\">⚠️ 不匹配</div>")
        sb.appendLine("      </div>")
        
        sb.appendLine("      <div class=\"stat-card missing\">")
        sb.appendLine("        <div class=\"stat-value\">${statistics.missingInAndroidCount}</div>")
        sb.appendLine("        <div class=\"stat-label\">❌ Android缺失</div>")
        sb.appendLine("      </div>")
        
        sb.appendLine("      <div class=\"stat-card missing\">")
        sb.appendLine("        <div class=\"stat-value\">${statistics.missingInRnCount}</div>")
        sb.appendLine("        <div class=\"stat-label\">❌ RN缺失</div>")
        sb.appendLine("      </div>")
        
        sb.appendLine("      <div class=\"stat-card\">")
        sb.appendLine("        <div class=\"stat-value\">${statistics.highPriorityCount}</div>")
        sb.appendLine("        <div class=\"stat-label\">🔴 高优先级</div>")
        sb.appendLine("      </div>")
        
        sb.appendLine("      <div class=\"stat-card\">")
        sb.appendLine("        <div class=\"stat-value\">${statistics.totalComparisons}</div>")
        sb.appendLine("        <div class=\"stat-label\">📊 总计</div>")
        sb.appendLine("      </div>")
        
        sb.appendLine("    </div>")
        
        return sb.toString()
    }
    
    private fun buildResultsSection(title: String, results: List<ComparisonResult>, id: String): String {
        val sb = StringBuilder()
        
        sb.appendLine("    <div class=\"section\">")
        sb.appendLine("      <div class=\"collapsible\" onclick=\"toggleContent('$id')\">")
        sb.appendLine("        <h2>$title (${results.size} 项)</h2>")
        sb.appendLine("      </div>")
        sb.appendLine("      <div id=\"$id\" class=\"content active\">")
        
        if (results.isEmpty()) {
            sb.appendLine("        <p>无比较结果</p>")
        } else {
            sb.appendLine("        <table class=\"results-table\">")
            sb.appendLine("          <thead>")
            sb.appendLine("            <tr>")
            sb.appendLine("              <th>项目</th>")
            sb.appendLine("              <th>状态</th>")
            sb.appendLine("              <th>RN值</th>")
            sb.appendLine("              <th>Android值</th>")
            sb.appendLine("              <th>差异</th>")
            sb.appendLine("              <th>优先级</th>")
            sb.appendLine("              <th>建议</th>")
            sb.appendLine("            </tr>")
            sb.appendLine("          </thead>")
            sb.appendLine("          <tbody>")
            
            for (result in results) {
                sb.appendLine("            <tr>")
                sb.appendLine("              <td>${result.itemName}</td>")
                sb.appendLine("              <td><span class=\"status-badge status-${result.status.name.lowercase().replace("_", "-")}\">${result.status}</span></td>")
                sb.appendLine("              <td>${result.rnValue ?: "-"}</td>")
                sb.appendLine("              <td>${result.androidValue ?: "-"}</td>")
                sb.appendLine("              <td>${result.difference ?: "-"}</td>")
                sb.appendLine("              <td class=\"priority-${result.priority.name.lowercase()}\">${result.priority}</td>")
                sb.appendLine("              <td>${result.suggestions.take(2).joinToString("; ").ifEmpty { "-" }}</td>")
                sb.appendLine("            </tr>")
            }
            
            sb.appendLine("          </tbody>")
            sb.appendLine("        </table>")
        }
        
        sb.appendLine("      </div>")
        sb.appendLine("    </div>")
        
        return sb.toString()
    }
    
    private fun buildPriorityRecommendations(report: ParityReport): String {
        val sb = StringBuilder()
        
        val highPriorityItems = (report.layoutComparisons + report.styleComparisons + 
            report.animationComparisons + report.themeComparisons)
            .filter { it.priority == Priority.HIGH }
            .sortedByDescending { 
                when (it.status) {
                    ComparisonStatus.MISSING_IN_ANDROID -> 3
                    ComparisonStatus.MISMATCH -> 2
                    ComparisonStatus.MISSING_IN_RN -> 1
                    else -> 0
                }
            }
            .take(10)
        
        sb.appendLine("    <div class=\"recommendations\">")
        sb.appendLine("      <h3>🎯 优先修复建议</h3>")
        
        if (highPriorityItems.isEmpty()) {
            sb.appendLine("      <p>无高优先级问题需要修复 🎉</p>")
        } else {
            sb.appendLine("      <ul>")
            for (item in highPriorityItems) {
                sb.appendLine("        <li>")
                sb.appendLine("          <strong>[${item.category}]</strong> ${item.itemName}: ")
                sb.appendLine("          ${item.difference ?: item.status}")
                if (item.suggestions.isNotEmpty()) {
                    sb.appendLine("          <br><em>建议: ${item.suggestions.first()}</em>")
                }
                sb.appendLine("        </li>")
            }
            sb.appendLine("      </ul>")
        }
        
        sb.appendLine("    </div>")
        
        sb.appendLine("    <script>")
        sb.appendLine("      function toggleContent(id) {")
        sb.appendLine("        const content = document.getElementById(id);")
        sb.appendLine("        content.classList.toggle('active');")
        sb.appendLine("      }")
        sb.appendLine("    </script>")
        
        return sb.toString()
    }
    
    fun printSummary(report: ParityReport) {
        println("\n" + "=".repeat(60))
        println("📊 RN-Android 一致性检查报告摘要")
        println("=".repeat(60))
        println()
        println("生成时间: ${report.timestamp}")
        println()
        println("📈 统计数据:")
        println("  总比较项: ${report.statistics.totalComparisons}")
        println("  ✅ 匹配: ${report.statistics.matchCount}")
        println("  ⚠️ 不匹配: ${report.statistics.mismatchCount}")
        println("  ❌ Android缺失: ${report.statistics.missingInAndroidCount}")
        println("  ❌ RN缺失: ${report.statistics.missingInRnCount}")
        println("  🔴 高优先级: ${report.statistics.highPriorityCount}")
        println()
        
        val matchRate = if (report.statistics.totalComparisons > 0) {
            (report.statistics.matchCount.toDouble() / report.statistics.totalComparisons * 100).toInt()
        } else 0
        
        println("一致性评分: $matchRate%")
        println()
        
        if (report.statistics.highPriorityCount > 0) {
            println("🎯 需要优先处理的问题:")
            val allResults = report.layoutComparisons + report.styleComparisons + 
                report.animationComparisons + report.themeComparisons
            allResults.filter { it.priority == Priority.HIGH }.take(5).forEach { item ->
                println("  - [${item.category}] ${item.itemName}: ${item.difference ?: item.status}")
            }
            if (report.statistics.highPriorityCount > 5) {
                println("  ... 还有 ${report.statistics.highPriorityCount - 5} 个高优先级问题")
            }
        }
        
        println()
        println("=".repeat(60))
    }
}

fun main(args: Array<String>) {
    val rnPath = args.getOrElse(0) { "../lego-mobile" }
    val androidPath = args.getOrElse(1) { "." }
    val outputPath = args.getOrElse(2) { "parity-reports" }
    
    println("RN项目路径: $rnPath")
    println("Android项目路径: $androidPath")
    println("报告输出路径: $outputPath")
    println()
    
    val generator = ParityReportGenerator(rnPath, androidPath, outputPath)
    
    val report = generator.generateFullReport()
    
    generator.printSummary(report)
    
    generator.saveReportToJson(report)
    generator.saveReportToHtml(report)
    
    println("\n报告已生成:")
    println("  - JSON: $outputPath/parity-report.json")
    println("  - HTML: $outputPath/parity-report.html")
}
