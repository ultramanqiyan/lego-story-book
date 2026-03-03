package com.lego.android.parity

import java.io.File

class ThemeComparator(
    private val rnProjectPath: String,
    private val androidProjectPath: String
) {
    private val results = mutableListOf<ComparisonResult>()
    
    private val themeProperties = listOf(
        "colors.primary",
        "colors.secondary",
        "colors.background",
        "colors.surface",
        "colors.text",
        "colors.textLight",
        "colors.error",
        "colors.success"
    )
    
    private val typographyProperties = listOf(
        "h1.fontSize",
        "h1.fontWeight",
        "h2.fontSize",
        "h2.fontWeight",
        "h3.fontSize",
        "h3.fontWeight",
        "body.fontSize",
        "body.fontWeight",
        "bodySmall.fontSize",
        "caption.fontSize"
    )
    
    private val spacingProperties = listOf(
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "xxl"
    )
    
    fun compare(): List<ComparisonResult> {
        Logger.info("Starting theme comparison...")
        results.clear()
        
        compareThemeColors()
        compareThemeTypography()
        compareThemeSpacing()
        compareThemeShadows()
        compareThemeBorderRadius()
        compareThemeVariants()
        compareThemeGradients()
        
        Logger.info("Theme comparison completed. Found ${results.size} results")
        return results.toList()
    }
    
    private fun compareThemeColors() {
        Logger.info("Comparing theme colors...")
        
        val rnThemeColors = extractRnThemeColors()
        val androidThemeColors = extractAndroidThemeColors()
        
        val colorKeys = listOf(
            "primary" to "Primary brand color",
            "secondary" to "Secondary brand color",
            "background" to "Background color",
            "surface" to "Surface/card color",
            "text" to "Primary text color",
            "textLight" to "Secondary text color",
            "error" to "Error color",
            "success" to "Success color",
            "warning" to "Warning color",
            "info" to "Info color"
        )
        
        for ((colorKey, description) in colorKeys) {
            val rnValue = rnThemeColors[colorKey]
            val androidValue = androidThemeColors[colorKey]
            
            when {
                rnValue == null && androidValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Colors",
                            itemName = colorKey,
                            status = ComparisonStatus.ERROR,
                            difference = "$description not defined in either platform",
                            priority = Priority.HIGH,
                            suggestions = listOf("Define $colorKey in both platforms")
                        )
                    )
                }
                rnValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Colors",
                            itemName = colorKey,
                            status = ComparisonStatus.MISSING_IN_RN,
                            rnValue = null,
                            androidValue = androidValue,
                            difference = "$description missing in RN",
                            priority = Priority.MEDIUM,
                            suggestions = listOf("Add $colorKey to RN theme")
                        )
                    )
                }
                androidValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Colors",
                            itemName = colorKey,
                            status = ComparisonStatus.MISSING_IN_ANDROID,
                            rnValue = rnValue,
                            androidValue = null,
                            difference = "$description missing in Android",
                            priority = Priority.HIGH,
                            suggestions = listOf("Add $colorKey to Android theme")
                        )
                    )
                }
                !ColorUtils.colorsMatch(rnValue, androidValue) -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Colors",
                            itemName = colorKey,
                            status = ComparisonStatus.MISMATCH,
                            rnValue = rnValue,
                            androidValue = androidValue,
                            difference = "$description values differ",
                            priority = Priority.MEDIUM,
                            suggestions = listOf("Align $colorKey values between platforms")
                        )
                    )
                }
                else -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Colors",
                            itemName = colorKey,
                            status = ComparisonStatus.MATCH,
                            rnValue = rnValue,
                            androidValue = androidValue,
                            priority = Priority.LOW
                        )
                    )
                }
            }
        }
    }
    
    private fun extractRnThemeColors(): Map<String, String> {
        val colors = mutableMapOf<String, String>()
        
        val themeFile = File(rnProjectPath, "src/styles/theme.js")
        if (!themeFile.exists()) return colors
        
        val content = FileUtils.readFileContent(themeFile) ?: return colors
        
        val colorsPattern = Regex("colors\\s*:\\s*\\{([^}]+)\\}")
        val colorValuePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*['\"]?([^,\\n'\"]+)['\"]?")
        
        colorsPattern.findAll(content).forEach { match ->
            val colorsContent = match.groupValues[1]
            colorValuePattern.findAll(colorsContent).forEach { colorMatch ->
                val colorName = colorMatch.groupValues[1]
                var colorValue = colorMatch.groupValues[2].trim()
                
                if (colorValue.startsWith("COLORS.")) {
                    colorValue = resolveColorReference(colorValue, content)
                }
                
                colors[colorName] = colorValue
            }
        }
        
        val constantsFile = File(rnProjectPath, "src/utils/constants.js")
        if (constantsFile.exists()) {
            val constantsContent = FileUtils.readFileContent(constantsFile) ?: return colors
            val constColorsPattern = Regex("const\\s+COLORS\\s*=\\s*\\{([^}]+)\\}", RegexOption.DOT_MATCHES_ALL)
            
            constColorsPattern.findAll(constantsContent).forEach { match ->
                val colorsContent = match.groupValues[1]
                colorValuePattern.findAll(colorsContent).forEach { colorMatch ->
                    val colorName = colorMatch.groupValues[1]
                    val colorValue = colorMatch.groupValues[2].trim().trimQuotes()
                    if (!colors.containsKey(colorName)) {
                        colors[colorName] = colorValue
                    }
                }
            }
        }
        
        return colors
    }
    
    private fun resolveColorReference(reference: String, content: String): String {
        val colorName = reference.removePrefix("COLORS.")
        val colorPattern = Regex("$colorName\\s*:\\s*['\"]([^'\"]+)['\"]")
        return colorPattern.find(content)?.groupValues?.get(1) ?: reference
    }
    
    private fun extractAndroidThemeColors(): Map<String, String> {
        val colors = mutableMapOf<String, String>()
        
        val colorFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/theme/Color.kt")
        if (!colorFile.exists()) return colors
        
        val content = FileUtils.readFileContent(colorFile) ?: return colors
        
        val colorPattern = Regex("val\\s+([A-Za-z][a-zA-Z0-9]*)\\s*=\\s*Color\\((0x[0-9A-Fa-f]+)\\)")
        
        colorPattern.findAll(content).forEach { match ->
            val colorName = match.groupValues[1]
            val colorValue = match.groupValues[2]
            colors[colorName] = colorValue.toHexColor()
        }
        
        val themeFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/theme/Theme.kt")
        if (themeFile.exists()) {
            val themeContent = FileUtils.readFileContent(themeFile) ?: return colors
            
            val lightSchemePattern = Regex("LightColorScheme\\s*=\\s*lightColorScheme\\(([^)]+)\\)")
            lightSchemePattern.findAll(themeContent).forEach { match ->
                val schemeContent = match.groupValues[1]
                val assignmentPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*=\\s*AppColors\\.([A-Za-z][a-zA-Z0-9]*)")
                
                assignmentPattern.findAll(schemeContent).forEach { assignMatch ->
                    val schemeKey = assignMatch.groupValues[1]
                    val colorRef = assignMatch.groupValues[2]
                    colors[schemeKey] = colors[colorRef] ?: "AppColors.$colorRef"
                }
            }
        }
        
        return colors
    }
    
    private fun compareThemeTypography() {
        Logger.info("Comparing theme typography...")
        
        val rnTypography = extractRnThemeTypography()
        val androidTypography = extractAndroidThemeTypography()
        
        val typographyStyles = listOf("h1", "h2", "h3", "h4", "body", "bodySmall", "caption")
        
        for (styleName in typographyStyles) {
            val rnStyle = rnTypography[styleName]
            val androidStyle = androidTypography[styleName]
            
            when {
                rnStyle == null && androidStyle == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Typography",
                            itemName = styleName,
                            status = ComparisonStatus.ERROR,
                            difference = "Typography style '$styleName' not defined",
                            priority = Priority.LOW
                        )
                    )
                }
                rnStyle == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Typography",
                            itemName = styleName,
                            status = ComparisonStatus.MISSING_IN_RN,
                            androidValue = androidStyle?.toString(),
                            difference = "Typography style '$styleName' missing in RN",
                            priority = Priority.LOW,
                            suggestions = listOf("Add $styleName typography style to RN")
                        )
                    )
                }
                androidStyle == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Typography",
                            itemName = styleName,
                            status = ComparisonStatus.MISSING_IN_ANDROID,
                            rnValue = rnStyle.toString(),
                            difference = "Typography style '$styleName' missing in Android",
                            priority = Priority.MEDIUM,
                            suggestions = listOf("Add $styleName typography style to Android theme")
                        )
                    )
                }
                else -> {
                    compareTypographyProperties(styleName, rnStyle, androidStyle)
                }
            }
        }
    }
    
    private fun compareTypographyProperties(
        styleName: String,
        rnStyle: Map<String, String>,
        androidStyle: Map<String, String>
    ) {
        val properties = listOf("fontSize", "fontWeight", "lineHeight")
        
        for (prop in properties) {
            val rnValue = rnStyle[prop]
            val androidValue = androidStyle[prop]
            
            if (rnValue != null && androidValue != null) {
                if (rnValue != androidValue) {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Typography",
                            itemName = "$styleName.$prop",
                            status = ComparisonStatus.MISMATCH,
                            rnValue = rnValue,
                            androidValue = androidValue,
                            difference = "Typography property '$prop' differs for $styleName",
                            priority = Priority.LOW,
                            suggestions = listOf("Align $prop for $styleName")
                        )
                    )
                }
            }
        }
    }
    
    private fun extractRnThemeTypography(): Map<String, Map<String, String>> {
        val typography = mutableMapOf<String, Map<String, String>>()
        
        val themeFile = File(rnProjectPath, "src/styles/theme.js")
        if (!themeFile.exists()) return typography
        
        val content = FileUtils.readFileContent(themeFile) ?: return typography
        
        val typographyPattern = Regex("typography\\s*:\\s*\\{([^}]+)\\}")
        val stylePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{([^}]+)\\}")
        val propertyPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*([^,\\n]+)")
        
        typographyPattern.findAll(content).forEach { match ->
            val typographyContent = match.groupValues[1]
            
            stylePattern.findAll(typographyContent).forEach { styleMatch ->
                val styleName = styleMatch.groupValues[1]
                val styleContent = styleMatch.groupValues[2]
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
        }
        
        return typography
    }
    
    private fun extractAndroidThemeTypography(): Map<String, Map<String, String>> {
        val typography = mutableMapOf<String, Map<String, String>>()
        
        val themeFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/theme/Theme.kt")
        if (!themeFile.exists()) return typography
        
        val content = FileUtils.readFileContent(themeFile) ?: return typography
        
        val textStylePattern = Regex("TextStyle\\(([^)]+)\\)")
        val propertyPattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*=\\s*([^,\\n]+)")
        
        var styleIndex = 0
        val styleNames = listOf("h1", "h2", "h3", "body", "bodySmall", "caption")
        
        textStylePattern.findAll(content).forEach { match ->
            val styleContent = match.groupValues[1]
            val properties = mutableMapOf<String, String>()
            
            propertyPattern.findAll(styleContent).forEach { propMatch ->
                val propName = propMatch.groupValues[1]
                val propValue = propMatch.groupValues[2].trim()
                properties[propName] = propValue
            }
            
            if (properties.isNotEmpty() && styleIndex < styleNames.size) {
                typography[styleNames[styleIndex]] = properties
                styleIndex++
            }
        }
        
        return typography
    }
    
    private fun compareThemeSpacing() {
        Logger.info("Comparing theme spacing...")
        
        val rnSpacing = extractRnThemeSpacing()
        val androidSpacing = extractAndroidThemeSpacing()
        
        for (spacingName in spacingProperties) {
            val rnValue = rnSpacing[spacingName]
            val androidValue = androidSpacing[spacingName]
            
            when {
                rnValue == null && androidValue == null -> {
                    continue
                }
                rnValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Spacing",
                            itemName = spacingName,
                            status = ComparisonStatus.MISSING_IN_RN,
                            androidValue = "${androidValue}dp",
                            difference = "Spacing '$spacingName' missing in RN",
                            priority = Priority.LOW
                        )
                    )
                }
                androidValue == null -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Spacing",
                            itemName = spacingName,
                            status = ComparisonStatus.MISSING_IN_ANDROID,
                            rnValue = "${rnValue}px",
                            difference = "Spacing '$spacingName' missing in Android",
                            priority = Priority.LOW,
                            suggestions = listOf("Add $spacingName = ${rnValue}.dp")
                        )
                    )
                }
                rnValue != androidValue -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Spacing",
                            itemName = spacingName,
                            status = ComparisonStatus.MISMATCH,
                            rnValue = "${rnValue}px",
                            androidValue = "${androidValue}dp",
                            difference = "Spacing values differ by ${kotlin.math.abs(rnValue - androidValue)}",
                            priority = Priority.LOW,
                            suggestions = listOf("Align spacing values")
                        )
                    )
                }
                else -> {
                    results.add(
                        ComparisonResult(
                            category = "Theme/Spacing",
                            itemName = spacingName,
                            status = ComparisonStatus.MATCH,
                            rnValue = "${rnValue}px",
                            androidValue = "${androidValue}dp",
                            priority = Priority.LOW
                        )
                    )
                }
            }
        }
    }
    
    private fun extractRnThemeSpacing(): Map<String, Int> {
        val spacing = mutableMapOf<String, Int>()
        
        val themeFile = File(rnProjectPath, "src/styles/theme.js")
        if (!themeFile.exists()) return spacing
        
        val content = FileUtils.readFileContent(themeFile) ?: return spacing
        
        val spacingPattern = Regex("spacing\\s*:\\s*\\{([^}]+)\\}")
        val valuePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*(\\d+)")
        
        spacingPattern.findAll(content).forEach { match ->
            val spacingContent = match.groupValues[1]
            valuePattern.findAll(spacingContent).forEach { valueMatch ->
                val name = valueMatch.groupValues[1]
                val value = valueMatch.groupValues[2].toIntOrNull()
                if (value != null) {
                    spacing[name] = value
                }
            }
        }
        
        return spacing
    }
    
    private fun extractAndroidThemeSpacing(): Map<String, Int> {
        val spacing = mutableMapOf<String, Int>()
        
        val themeFile = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/theme/Theme.kt")
        if (!themeFile.exists()) return spacing
        
        val content = FileUtils.readFileContent(themeFile) ?: return spacing
        
        val dpPattern = Regex("val\\s+([A-Za-z][a-zA-Z0-9]*)\\s*=\\s*(\\d+)\\.dp")
        
        dpPattern.findAll(content).forEach { match ->
            val name = match.groupValues[1].lowercase()
            val value = match.groupValues[2].toIntOrNull()
            if (value != null) {
                spacing[name] = value
            }
        }
        
        return spacing
    }
    
    private fun compareThemeShadows() {
        Logger.info("Comparing theme shadows...")
        
        val rnShadows = extractRnThemeShadows()
        
        val shadowLevels = listOf("sm", "md", "lg")
        
        for (level in shadowLevels) {
            val hasRnShadow = rnShadows.containsKey(level)
            
            results.add(
                ComparisonResult(
                    category = "Theme/Shadows",
                    itemName = level,
                    status = if (hasRnShadow) ComparisonStatus.MATCH else ComparisonStatus.MISSING_IN_ANDROID,
                    rnValue = if (hasRnShadow) "Configured" else null,
                    androidValue = "Modifier.shadow()",
                    priority = Priority.LOW,
                    suggestions = listOf("Implement shadow using Modifier.shadow()")
                )
            )
        }
    }
    
    private fun extractRnThemeShadows(): Map<String, String> {
        val shadows = mutableMapOf<String, String>()
        
        val themeFile = File(rnProjectPath, "src/styles/theme.js")
        if (!themeFile.exists()) return shadows
        
        val content = FileUtils.readFileContent(themeFile) ?: return shadows
        
        val shadowsPattern = Regex("shadows\\s*:\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}")
        val shadowNamePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{")
        
        shadowsPattern.findAll(content).forEach { match ->
            val shadowsContent = match.groupValues[1]
            shadowNamePattern.findAll(shadowsContent).forEach { nameMatch ->
                shadows[nameMatch.groupValues[1]] = "Configured"
            }
        }
        
        return shadows
    }
    
    private fun compareThemeBorderRadius() {
        Logger.info("Comparing theme border radius...")
        
        val rnBorderRadius = extractRnThemeBorderRadius()
        
        val radiusLevels = listOf("sm", "md", "lg", "xl", "round")
        
        for (level in radiusLevels) {
            val rnValue = rnBorderRadius[level]
            
            results.add(
                ComparisonResult(
                    category = "Theme/BorderRadius",
                    itemName = level,
                    status = if (rnValue != null) ComparisonStatus.MATCH else ComparisonStatus.MISSING_IN_ANDROID,
                    rnValue = rnValue?.let { "${it}px" },
                    androidValue = "RoundedCornerShape()",
                    priority = Priority.LOW,
                    suggestions = listOf("Use RoundedCornerShape(${rnValue ?: 8}.dp)")
                )
            )
        }
    }
    
    private fun extractRnThemeBorderRadius(): Map<String, Int> {
        val borderRadius = mutableMapOf<String, Int>()
        
        val themeFile = File(rnProjectPath, "src/styles/theme.js")
        if (!themeFile.exists()) return borderRadius
        
        val content = FileUtils.readFileContent(themeFile) ?: return borderRadius
        
        val borderRadiusPattern = Regex("borderRadius\\s*:\\s*\\{([^}]+)\\}")
        val valuePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*(\\d+)")
        
        borderRadiusPattern.findAll(content).forEach { match ->
            val radiusContent = match.groupValues[1]
            valuePattern.findAll(radiusContent).forEach { valueMatch ->
                val name = valueMatch.groupValues[1]
                val value = valueMatch.groupValues[2].toIntOrNull()
                if (value != null) {
                    borderRadius[name] = value
                }
            }
        }
        
        return borderRadius
    }
    
    private fun compareThemeVariants() {
        Logger.info("Comparing theme variants...")
        
        val rnThemes = extractRnThemeVariants()
        
        val themeIds = listOf("lego", "fairy", "scifi", "nature", "gamified", "immersive", "tabletop")
        
        for (themeId in themeIds) {
            val hasRnTheme = rnThemes.containsKey(themeId)
            
            results.add(
                ComparisonResult(
                    category = "Theme/Variants",
                    itemName = themeId,
                    status = if (hasRnTheme) ComparisonStatus.MATCH else ComparisonStatus.MISSING_IN_ANDROID,
                    rnValue = if (hasRnTheme) "Defined" else null,
                    androidValue = "ThemeManager",
                    priority = Priority.LOW,
                    suggestions = if (!hasRnTheme) {
                        listOf("Add $themeId theme variant to RN")
                    } else {
                        listOf("Implement $themeId theme in Android ThemeManager")
                    }
                )
            )
        }
    }
    
    private fun extractRnThemeVariants(): Map<String, String> {
        val themes = mutableMapOf<String, String>()
        
        val colorsFile = File(rnProjectPath, "src/styles/colors.js")
        if (!colorsFile.exists()) return themes
        
        val content = FileUtils.readFileContent(colorsFile) ?: return themes
        
        val themesPattern = Regex("const\\s+themes\\s*=\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}")
        val themeNamePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{")
        
        themesPattern.findAll(content).forEach { match ->
            val themesContent = match.groupValues[1]
            themeNamePattern.findAll(themesContent).forEach { nameMatch ->
                themes[nameMatch.groupValues[1]] = "Defined"
            }
        }
        
        return themes
    }
    
    private fun compareThemeGradients() {
        Logger.info("Comparing theme gradients...")
        
        val rnGradients = extractRnThemeGradients()
        
        for ((gradientName, gradientConfig) in rnGradients) {
            results.add(
                ComparisonResult(
                    category = "Theme/Gradients",
                    itemName = gradientName,
                    status = ComparisonStatus.MISSING_IN_ANDROID,
                    rnValue = gradientConfig,
                    androidValue = null,
                    difference = "Gradient '$gradientName' not implemented in Android",
                    priority = Priority.LOW,
                    suggestions = listOf("Implement gradient using Brush.linearGradient() or Brush.verticalGradient()")
                )
            )
        }
    }
    
    private fun extractRnThemeGradients(): Map<String, String> {
        val gradients = mutableMapOf<String, String>()
        
        val colorsFile = File(rnProjectPath, "src/styles/colors.js")
        if (!colorsFile.exists()) return gradients
        
        val content = FileUtils.readFileContent(colorsFile) ?: return gradients
        
        val gradientPattern = Regex("GRADIENT_PRESETS\\s*=\\s*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}")
        val namePattern = Regex("([a-zA-Z][a-zA-Z0-9]*)\\s*:\\s*\\{")
        
        gradientPattern.findAll(content).forEach { match ->
            val gradientsContent = match.groupValues[1]
            namePattern.findAll(gradientsContent).forEach { nameMatch ->
                gradients[nameMatch.groupValues[1]] = "Configured"
            }
        }
        
        return gradients
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
}

fun main() {
    val rnPath = "../lego-mobile"
    val androidPath = "."
    
    val comparator = ThemeComparator(rnPath, androidPath)
    val results = comparator.compare()
    
    println("\n=== Theme Comparison Report ===\n")
    
    val groupedByCategory = results.groupBy { it.category }
    groupedByCategory.forEach { (category, items) ->
        println("[$category]")
        val groupedByStatus = items.groupBy { it.status }
        groupedByStatus.forEach { (status, statusItems) ->
            println("  $status: ${statusItems.size} items")
            statusItems.take(5).forEach { item ->
                println("    - ${item.itemName}: ${item.difference ?: "OK"}")
                if (item.rnValue != null || item.androidValue != null) {
                    println("      RN: ${item.rnValue}, Android: ${item.androidValue}")
                }
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
