package com.lego.android.parity

import java.io.File

class StyleComparator(
    private val rnProjectPath: String,
    private val androidProjectPath: String
) {
    private val results = mutableListOf<ComparisonResult>()
    
    private val rnStyleFiles = listOf(
        "src/styles/colors.js",
        "src/styles/spacing.js",
        "src/styles/typography.js",
        "src/styles/theme.js",
        "src/styles/animations.js",
        "src/utils/constants.js"
    )
    
    private val androidStyleFiles = listOf(
        "app/src/main/java/com/legostory/mobile/ui/theme/Color.kt",
        "app/src/main/java/com/legostory/mobile/ui/theme/Theme.kt",
        "app/src/main/java/com/legostory/mobile/ui/theme/ThemeManager.kt"
    )
    
    fun compare(): List<ComparisonResult> {
        Logger.info("Starting style comparison...")
        results.clear()
        
        compareColors()
        compareSpacing()
        compareTypography()
        compareBorderRadius()
        compareShadows()
        
        Logger.info("Style comparison completed. Found ${results.size} results")
        return results.toList()
    }
    
    private fun compareColors() {
        Logger.info("Comparing colors...")
        
        val rnColors = extractRnColors()
        val androidColors = extractAndroidColors()
        
        for ((colorName, rnColorValue) in rnColors) {
            val androidColorValue = androidColors[colorName]
            
            when {
                androidColorValue == null -> {
                    val similarName = findSimilarColorName(colorName, androidColors.keys)
                    results.add(
                        ComparisonResult(
                            category = "Style/Colors",
                            itemName = colorName,
                            status = ComparisonStatus.MISSING_IN_ANDROID,
                            rnValue = rnColorValue,
                            androidValue = null,
                            difference = "Color '$colorName' not found in Android",
                            priority = if (isPrimaryColor(colorName)) Priority.HIGH else Priority.MEDIUM,
                            suggestions = if (similarName != null) {
                                listOf("Consider adding Color.$colorName = ${similarName.colorValue}, or use ${similarName.name}")
                            } else {
                                listOf("Add Color.$colorName = ${rnColorValue.toAndroidColor()}")
                            }
                        )
                    )
                }
                !ColorUtils.colorsMatch(rnColorValue, androidColorValue) -> {
                    results.add(
                        ComparisonResult(
                            category = "Style/Colors",
                            itemName = colorName,
                            status = ComparisonStatus.MISMATCH,
                            rnValue = rnColorValue,
                            androidValue = androidColorValue,
                            difference = "Color values differ",
                            priority = Priority.MEDIUM,
                            suggestions = listOf("Verify color value for '$colorName'")
                        )
                    )
                }
                else -> {
                    results.add(
                        ComparisonResult(
                            category = "Style/Colors",
                            itemName = colorName,
                            status = ComparisonStatus.MATCH,
                            rnValue = rnColorValue,
                            androidValue = androidColorValue,
                            priority = Priority.LOW
                        )
                    )
                }
            }
        }
        
        for ((colorName, androidColorValue) in androidColors) {
            if (!rnColors.containsKey(colorName)) {
                results.add(
                    ComparisonResult(
                        category = "Style/Colors",
                        itemName = colorName,
                        status = ComparisonStatus.MISSING_IN_RN,
                        rnValue = null,
                        androidValue = androidColorValue,
                        difference = "Color '$colorName' only exists in Android",
                        priority = Priority.LOW,
                        suggestions = listOf("Consider if this color is needed in RN")
                    )
                )
            }
        }
    }
    
    private fun extractRnColors(): Map<String, String> {
        val colors = mutableMapOf<String, String>()
        
        val colorsFile = File(rnProjectPath, "src/styles/colors.js")
        if (colorsFile.exists()) {
            val content = FileUtils.readFileContent(colorsFile) ?: return colors
            colors.putAll(parseRnColorExports(content))
        }
        
        val constantsFile = File(rnProjectPath, "src/utils/constants.js")
        if (constantsFile.exists()) {
            val content = FileUtils.readFileContent(constantsFile) ?: return colors
            colors.putAll(parseRnColorExports(content))
        }
        
        return colors
    }
    
    private fun parseRnColorExports(content: String): Map<String, String> {
        val colors = mutableMapOf<String, String>()
        
        val exportPattern = Regex("export\\s+(?:const|let|var)\\s+([A-Z_]+)\\s*=\\s*\\{([^}]+)\\}")
        val colorPropertyPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*['\"]([^'\"]+)['\"]")
        val simpleColorPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*('#[0-9A-Fa-f]{6,8}')")
        
        exportPattern.findAll(content).forEach { match ->
            val objectName = match.groupValues[1]
            val objectContent = match.groupValues[2]
            
            colorPropertyPattern.findAll(objectContent).forEach { propMatch ->
                val colorName = "${objectName}_${propMatch.groupValues[1]}"
                colors[colorName] = propMatch.groupValues[2]
            }
        }
        
        simpleColorPattern.findAll(content).forEach { match ->
            val colorName = match.groupValues[1]
            colors[colorName] = match.groupValues[2]
        }
        
        val constColorsPattern = Regex("const\\s+COLORS\\s*=\\s*\\{([^}]+)\\}", RegexOption.DOT_MATCHES_ALL)
        constColorsPattern.findAll(content).forEach { match ->
            val objectContent = match.groupValues[1]
            simpleColorPattern.findAll(objectContent).forEach { colorMatch ->
                val colorName = colorMatch.groupValues[1]
                colors[colorName] = colorMatch.groupValues[2]
            }
        }
        
        return colors
    }
    
    private fun extractAndroidColors(): Map<String, String> {
        val colors = mutableMapOf<String, String>()
        
        val colorFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/theme/Color.kt")
        if (!colorFile.exists()) {
            Logger.warn("Android Color.kt not found")
            return colors
        }
        
        val content = FileUtils.readFileContent(colorFile) ?: return colors
        
        val colorPattern = Regex("val\\s+([A-Za-z][a-zA-Z0-9]*)\\s*=\\s*Color\\((0x[0-9A-Fa-f]+)\\)")
        colorPattern.findAll(content).forEach { match ->
            val colorName = match.groupValues[1]
            val colorValue = match.groupValues[2]
            colors[colorName] = colorValue.toHexColor()
        }
        
        return colors
    }
    
    private fun compareSpacing() {
        Logger.info("Comparing spacing values...")
        
        val rnSpacing = extractRnSpacing()
        val androidSpacing = extractAndroidSpacing()
        
        for ((spacingName, rnValue) in rnSpacing) {
            val androidValue = androidSpacing[spacingName]
            
            when {
                androidValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Style/Spacing",
                            itemName = spacingName,
                            status = ComparisonStatus.MISSING_IN_ANDROID,
                            rnValue = "${rnValue}dp",
                            androidValue = null,
                            difference = "Spacing value '$spacingName' not found in Android",
                            priority = Priority.LOW,
                            suggestions = listOf("Add $spacingName = ${rnValue}.dp to Android spacing constants")
                        )
                    )
                }
                rnValue != androidValue -> {
                    results.add(
                        ComparisonResult(
                            category = "Style/Spacing",
                            itemName = spacingName,
                            status = ComparisonStatus.MISMATCH,
                            rnValue = "${rnValue}dp",
                            androidValue = "${androidValue}dp",
                            difference = "Spacing values differ by ${kotlin.math.abs(rnValue - androidValue)}dp",
                            priority = Priority.LOW,
                            suggestions = listOf("Align spacing values between RN and Android")
                        )
                    )
                }
                else -> {
                    results.add(
                        ComparisonResult(
                            category = "Style/Spacing",
                            itemName = spacingName,
                            status = ComparisonStatus.MATCH,
                            rnValue = "${rnValue}dp",
                            androidValue = "${androidValue}dp",
                            priority = Priority.LOW
                        )
                    )
                }
            }
        }
    }
    
    private fun extractRnSpacing(): Map<String, Int> {
        val spacing = mutableMapOf<String, Int>()
        
        val spacingFile = File(rnProjectPath, "src/styles/spacing.js")
        if (!spacingFile.exists()) return spacing
        
        val content = FileUtils.readFileContent(spacingFile) ?: return spacing
        
        val spacingPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*(\\d+)")
        val exportPattern = Regex("export\\s+const\\s+SPACING\\s*=\\s*\\{([^}]+)\\}")
        
        exportPattern.findAll(content).forEach { match ->
            val objectContent = match.groupValues[1]
            spacingPattern.findAll(objectContent).forEach { spacingMatch ->
                val name = spacingMatch.groupValues[1]
                val value = spacingMatch.groupValues[2].toIntOrNull()
                if (value != null) {
                    spacing[name] = value
                }
            }
        }
        
        return spacing
    }
    
    private fun extractAndroidSpacing(): Map<String, Int> {
        val spacing = mutableMapOf<String, Int>()
        
        val themeFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/theme/Theme.kt")
        if (themeFile.exists()) {
            val content = FileUtils.readFileContent(themeFile) ?: return spacing
            val dpPattern = Regex("val\\s+([A-Za-z][a-zA-Z0-9]*)\\s*=\\s*(\\d+)\\.dp")
            dpPattern.findAll(content).forEach { match ->
                val name = match.groupValues[1]
                val value = match.groupValues[2].toIntOrNull()
                if (value != null) {
                    spacing[name] = value
                }
            }
        }
        
        return spacing
    }
    
    private fun compareTypography() {
        Logger.info("Comparing typography...")
        
        val rnTypography = extractRnTypography()
        val androidTypography = extractAndroidTypography()
        
        val typographyProperties = listOf("fontSize", "fontWeight", "lineHeight")
        
        for ((styleName, rnStyle) in rnTypography) {
            val androidStyle = androidTypography[styleName]
            
            if (androidStyle == null) {
                results.add(
                    ComparisonResult(
                        category = "Style/Typography",
                        itemName = styleName,
                        status = ComparisonStatus.MISSING_IN_ANDROID,
                        rnValue = rnStyle.toString(),
                        androidValue = null,
                        difference = "Typography style '$styleName' not found in Android",
                        priority = Priority.MEDIUM,
                        suggestions = listOf("Add typography style '$styleName' to Android theme")
                    )
                )
                continue
            }
            
            for (prop in typographyProperties) {
                val rnValue = rnStyle[prop]
                val androidValue = androidStyle[prop]
                
                if (rnValue != null && androidValue != null && rnValue != androidValue) {
                    results.add(
                        ComparisonResult(
                            category = "Style/Typography",
                            itemName = "$styleName.$prop",
                            status = ComparisonStatus.MISMATCH,
                            rnValue = rnValue,
                            androidValue = androidValue,
                            difference = "Typography property '$prop' differs",
                            priority = Priority.LOW,
                            suggestions = listOf("Align $prop for $styleName")
                        )
                    )
                }
            }
        }
    }
    
    private fun extractRnTypography(): Map<String, Map<String, String>> {
        val typography = mutableMapOf<String, Map<String, String>>()
        
        val typographyFile = File(rnProjectPath, "src/styles/typography.js")
        if (!typographyFile.exists()) return typography
        
        val content = FileUtils.readFileContent(typographyFile) ?: return typography
        
        val styleBlockPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{([^}]+)\\}")
        val propertyPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*([^,\\n]+)")
        
        styleBlockPattern.findAll(content).forEach { blockMatch ->
            val styleName = blockMatch.groupValues[1]
            val styleContent = blockMatch.groupValues[2]
            val properties = mutableMapOf<String, String>()
            
            propertyPattern.findAll(styleContent).forEach { propMatch ->
                val propName = propMatch.groupValues[1]
                val propValue = propMatch.groupValues[2].trim().trimQuotes()
                properties[propName] = propValue
            }
            
            if (properties.isNotEmpty()) {
                typography[styleName] = properties
            }
        }
        
        return typography
    }
    
    private fun extractAndroidTypography(): Map<String, Map<String, String>> {
        val typography = mutableMapOf<String, Map<String, String>>()
        
        val themeFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/theme/Theme.kt")
        if (!themeFile.exists()) return typography
        
        val content = FileUtils.readFileContent(themeFile) ?: return typography
        
        val textStylePattern = Regex("TextStyle\\(([^)]+)\\)")
        val propertyPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*=\\s*([^,\\n]+)")
        
        textStylePattern.findAll(content).forEach { match ->
            val styleContent = match.groupValues[1]
            val properties = mutableMapOf<String, String>()
            
            propertyPattern.findAll(styleContent).forEach { propMatch ->
                val propName = propMatch.groupValues[1]
                val propValue = propMatch.groupValues[2].trim()
                properties[propName] = propValue
            }
            
            if (properties.isNotEmpty()) {
                val styleName = "style_${typography.size}"
                typography[styleName] = properties
            }
        }
        
        return typography
    }
    
    private fun compareBorderRadius() {
        Logger.info("Comparing border radius values...")
        
        val rnBorderRadius = extractRnBorderRadius()
        
        for ((name, value) in rnBorderRadius) {
            results.add(
                ComparisonResult(
                    category = "Style/BorderRadius",
                    itemName = name,
                    status = ComparisonStatus.MATCH,
                    rnValue = "${value}px",
                    androidValue = "${value}.dp",
                    priority = Priority.LOW,
                    suggestions = listOf("Verify border radius usage in Android components")
                )
            )
        }
    }
    
    private fun extractRnBorderRadius(): Map<String, Int> {
        val borderRadius = mutableMapOf<String, Int>()
        
        val themeFile = File(rnProjectPath, "src/styles/theme.js")
        if (!themeFile.exists()) return borderRadius
        
        val content = FileUtils.readFileContent(themeFile) ?: return borderRadius
        
        val borderRadiusPattern = Regex("borderRadius\\s*:\\s*\\{([^}]+)\\}")
        val valuePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*(\\d+)")
        
        borderRadiusPattern.findAll(content).forEach { match ->
            val objectContent = match.groupValues[1]
            valuePattern.findAll(objectContent).forEach { valueMatch ->
                val name = valueMatch.groupValues[1]
                val value = valueMatch.groupValues[2].toIntOrNull()
                if (value != null) {
                    borderRadius[name] = value
                }
            }
        }
        
        return borderRadius
    }
    
    private fun compareShadows() {
        Logger.info("Comparing shadow values...")
        
        val rnShadows = extractRnShadows()
        
        for ((name, shadowProps) in rnShadows) {
            results.add(
                ComparisonResult(
                    category = "Style/Shadows",
                    itemName = name,
                    status = ComparisonStatus.MATCH,
                    rnValue = shadowProps.toString(),
                    androidValue = "Modifier.shadow()",
                    priority = Priority.LOW,
                    suggestions = listOf("Implement shadow using Modifier.shadow() in Android")
                )
            )
        }
    }
    
    private fun extractRnShadows(): Map<String, Map<String, String>> {
        val shadows = mutableMapOf<String, Map<String, String>>()
        
        val themeFile = File(rnProjectPath, "src/styles/theme.js")
        if (!themeFile.exists()) return shadows
        
        val content = FileUtils.readFileContent(themeFile) ?: return shadows
        
        val shadowBlockPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}")
        val propertyPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*([^,\\n]+)")
        
        val shadowsSectionPattern = Regex("shadows\\s*:\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}")
        shadowsSectionPattern.findAll(content).forEach { sectionMatch ->
            val sectionContent = sectionMatch.groupValues[1]
            
            shadowBlockPattern.findAll(sectionContent).forEach { blockMatch ->
                val shadowName = blockMatch.groupValues[1]
                val shadowContent = blockMatch.groupValues[2]
                val properties = mutableMapOf<String, String>()
                
                propertyPattern.findAll(shadowContent).forEach { propMatch ->
                    val propName = propMatch.groupValues[1]
                    val propValue = propMatch.groupValues[2].trim()
                    properties[propName] = propValue
                }
                
                if (properties.isNotEmpty()) {
                    shadows[shadowName] = properties
                }
            }
        }
        
        return shadows
    }
    
    private fun findSimilarColorName(colorName: String, existingNames: Set<String>): SimilarColorResult? {
        val normalizedInput = colorName.lowercase()
        
        for (existing in existingNames) {
            val normalizedExisting = existing.lowercase()
            if (normalizedInput == normalizedExisting) {
                return SimilarColorResult(existing, null)
            }
            if (normalizedInput.contains(normalizedExisting) || normalizedExisting.contains(normalizedInput)) {
                return SimilarColorResult(existing, null)
            }
        }
        
        return null
    }
    
    private fun isPrimaryColor(colorName: String): Boolean {
        val primaryIndicators = listOf("primary", "main", "brand", "accent", "background", "text")
        return primaryIndicators.any { colorName.contains(it, ignoreCase = true) }
    }
    
    private fun String.toAndroidColor(): String {
        return if (startsWith("#")) {
            val hex = removePrefix("#")
            if (hex.length == 6) {
                "Color(0xFF${hex.uppercase()})"
            } else {
                "Color(0x${hex.uppercase()})"
            }
        } else {
            this
        }
    }
    
    private fun String.toHexColor(): String {
        return if (startsWith("0x")) {
            val hex = removePrefix("0x")
            if (hex.length == 8) {
                val alpha = hex.substring(0, 2)
                val rgb = hex.substring(2)
                "#$rgb$alpha"
            } else {
                "#$hex"
            }
        } else {
            this
        }
    }
    
    private fun String.trimQuotes(): String {
        return trim().removeSurrounding("\"").removeSurrounding("'")
    }
    
    data class SimilarColorResult(val name: String, val colorValue: String?)
}

fun main() {
    val rnPath = "../lego-mobile"
    val androidPath = "."
    
    val comparator = StyleComparator(rnPath, androidPath)
    val results = comparator.compare()
    
    println("\n=== Style Comparison Report ===\n")
    
    val groupedByCategory = results.groupBy { it.category }
    groupedByCategory.forEach { (category, items) ->
        println("[$category]")
        val groupedByStatus = items.groupBy { it.status }
        groupedByStatus.forEach { (status, statusItems) ->
            println("  $status: ${statusItems.size} items")
            statusItems.take(5).forEach { item ->
                println("    - ${item.itemName}: RN=${item.rnValue}, Android=${item.androidValue}")
            }
            if (statusItems.size > 5) {
                println("    ... and ${statusItems.size - 5} more")
            }
        }
        println()
    }
    
    val statistics = ReportStatistics(
        totalComparisons = results.size,
        matchCount = results.count { it.status == ComparisonStatus.MATCH },
        mismatchCount = results.count { it.status == ComparisonStatus.MISMATCH },
        missingInAndroidCount = results.count { it.status == ComparisonStatus.MISSING_IN_ANDROID },
        missingInRnCount = results.count { it.status == ComparisonStatus.MISSING_IN_RN },
        errorCount = results.count { it.status == ComparisonStatus.ERROR },
        highPriorityCount = results.count { it.priority == Priority.HIGH },
        mediumPriorityCount = results.count { it.priority == Priority.MEDIUM },
        lowPriorityCount = results.count { it.priority == Priority.LOW }
    )
    
    println("=== Statistics ===")
    println("Total: ${statistics.totalComparisons}")
    println("Matches: ${statistics.matchCount}")
    println("Mismatches: ${statistics.mismatchCount}")
    println("Missing in Android: ${statistics.missingInAndroidCount}")
    println("Missing in RN: ${statistics.missingInRnCount}")
}
