package com.lego.android.parity

import java.io.File

class LayoutComparator(
    private val rnProjectPath: String,
    private val androidProjectPath: String
) {
    private val results = mutableListOf<ComparisonResult>()
    
    private val rnComponentPatterns = mapOf(
        "View" to "Box/Column/Row",
        "Text" to "Text",
        "TextInput" to "TextField/OutlinedTextField",
        "ScrollView" to "LazyColumn/LazyRow",
        "FlatList" to "LazyColumn/LazyRow",
        "Image" to "Image/AsyncImage",
        "TouchableOpacity" to "Button/Clickable",
        "Pressable" to "Button/Clickable",
        "Button" to "Button",
        "Switch" to "Switch",
        "ActivityIndicator" to "CircularProgressIndicator",
        "Modal" to "AlertDialog/Dialog",
        "Animated.View" to "AnimatedVisibility/AnimatedContent"
    )
    
    private val rnAttributeMappings = mapOf(
        "style" to "Modifier",
        "flex" to "weight/Modifier",
        "flexDirection" to "Row/Column",
        "justifyContent" to "Arrangement",
        "alignItems" to "Alignment",
        "padding" to "padding()",
        "margin" to "padding() (outer)",
        "backgroundColor" to "background()",
        "borderRadius" to "rounded()",
        "borderWidth" to "border()",
        "borderColor" to "border()",
        "width" to "width()",
        "height" to "height()",
        "fontSize" to "fontSize",
        "fontWeight" to "fontWeight",
        "color" to "color",
        "textAlign" to "textAlign"
    )
    
    fun compare(): List<ComparisonResult> {
        Logger.info("Starting layout comparison...")
        results.clear()
        
        val rnScreensDir = File(rnProjectPath, "src/screens")
        val androidScreensDir = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/screens")
        
        if (!rnScreensDir.exists()) {
            Logger.error("RN screens directory not found: ${rnScreensDir.absolutePath}")
            return results
        }
        
        val rnScreenFiles = findRnScreenFiles(rnScreensDir)
        Logger.info("Found ${rnScreenFiles.size} RN screen files")
        
        for (rnFile in rnScreenFiles) {
            val screenName = rnFile.nameWithoutExtension
            val androidFile = findAndroidScreenFile(androidScreensDir, screenName)
            
            if (androidFile != null && androidFile.exists()) {
                compareScreenFiles(rnFile, androidFile)
            } else {
                results.add(
                    ComparisonResult(
                        category = "Layout",
                        itemName = screenName,
                        status = ComparisonStatus.MISSING_IN_ANDROID,
                        rnValue = rnFile.name,
                        androidValue = null,
                        difference = "No corresponding Android screen found",
                        priority = Priority.HIGH,
                        suggestions = listOf("Create ${screenName}.kt in Android project")
                    )
                )
                Logger.warn("Android screen not found for: $screenName")
            }
        }
        
        Logger.info("Layout comparison completed. Found ${results.size} results")
        return results.toList()
    }
    
    private fun findRnScreenFiles(directory: File): List<File> {
        return FileUtils.findFiles(directory, "js", ParityConfig.IGNORE_PATTERNS)
            .filter { file ->
                !file.name.contains(".test.") &&
                !file.name.startsWith("index") &&
                file.name.endsWith("Screen.js")
            }
    }
    
    private fun findAndroidScreenFile(screensDir: File, screenName: String): File? {
        val possiblePaths = listOf(
            File(screensDir, "${screenName}.kt"),
            File(screensDir, "${screenName.lowercase()}/${screenName}.kt"),
            File(screensDir, "${screenName.removeSuffix("Screen").lowercase()}/${screenName}.kt")
        )
        
        return possiblePaths.firstOrNull { it.exists() }
    }
    
    private fun compareScreenFiles(rnFile: File, androidFile: File) {
        Logger.info("Comparing: ${rnFile.name} vs ${androidFile.name}")
        
        val rnContent = FileUtils.readFileContent(rnFile) ?: return
        val androidContent = FileUtils.readFileContent(androidFile) ?: return
        
        val rnComponents = parseRnComponents(rnContent, rnFile.name)
        val androidComponents = parseAndroidComponents(androidContent, androidFile.name)
        
        compareComponentHierarchies(rnComponents, androidComponents, rnFile.nameWithoutExtension)
        
        compareComponentAttributes(rnComponents, androidComponents, rnFile.nameWithoutExtension)
    }
    
    private fun parseRnComponents(content: String, fileName: String): List<ComponentInfo> {
        val components = mutableListOf<ComponentInfo>()
        val lines = content.lines()
        
        val componentPattern = Regex(
            "<(View|Text|ScrollView|FlatList|Image|TouchableOpacity|Pressable|Button|TextInput|Switch|ActivityIndicator|Modal|Animated\\.View|Card|Loading|EmptyState|Header)\\s*"
        )
        val stylePattern = Regex("style=\\{?styles\\.([a-zA-Z]+)\\}?")
        val attributePattern = Regex("(\\w+)=\\{?([^}\\n]+)\\}?")
        
        lines.forEachIndexed { index, line ->
            componentPattern.findAll(line).forEach { match ->
                val componentName = match.groupValues[1]
                val attributes = mutableMapOf<String, String>()
                
                stylePattern.find(line)?.let { styleMatch ->
                    attributes["style"] = styleMatch.groupValues[1]
                }
                
                attributePattern.findAll(line).forEach { attrMatch ->
                    val attrName = attrMatch.groupValues[1]
                    if (attrName != "style" && attrName != "children") {
                        attributes[attrName] = attrMatch.groupValues[2].trim()
                    }
                }
                
                components.add(
                    ComponentInfo(
                        name = componentName,
                        type = mapRnComponentToType(componentName),
                        attributes = attributes,
                        sourceFile = fileName,
                        lineNumber = index + 1
                    )
                )
            }
        }
        
        return components
    }
    
    private fun parseAndroidComponents(content: String, fileName: String): List<ComponentInfo> {
        val components = mutableListOf<ComponentInfo>()
        val lines = content.lines()
        
        val composablePattern = Regex(
            "@Composable\\s*(?:private\\s*)?fun\\s+([a-zA-Z][a-zA-Z0-9]*)\\s*\\("
        )
        val modifierPattern = Regex("Modifier\\.(\\w+)\\(([^)]*)\\)")
        val componentPattern = Regex(
            "(Box|Column|Row|Text|TextField|OutlinedTextField|Button|Image|AsyncImage|LazyColumn|LazyRow|Switch|CircularProgressIndicator|AlertDialog|Dialog|Card|Scaffold|Surface|Icon|IconButton)\\s*\\("
        )
        
        lines.forEachIndexed { index, line ->
            composablePattern.findAll(line).forEach { match ->
                val functionName = match.groupValues[1]
                components.add(
                    ComponentInfo(
                        name = functionName,
                        type = "Composable",
                        attributes = emptyMap(),
                        sourceFile = fileName,
                        lineNumber = index + 1
                    )
                )
            }
            
            componentPattern.findAll(line).forEach { match ->
                val componentName = match.groupValues[1]
                val attributes = mutableMapOf<String, String>()
                
                modifierPattern.findAll(line).forEach { modifierMatch ->
                    val modifierName = modifierMatch.groupValues[1]
                    val modifierValue = modifierMatch.groupValues[2].trim()
                    attributes["modifier_$modifierName"] = modifierValue
                }
                
                components.add(
                    ComponentInfo(
                        name = componentName,
                        type = "ComposeComponent",
                        attributes = attributes,
                        sourceFile = fileName,
                        lineNumber = index + 1
                    )
                )
            }
        }
        
        return components
    }
    
    private fun mapRnComponentToType(componentName: String): String {
        return when (componentName) {
            "View" -> "Container"
            "Text" -> "Text"
            "TextInput" -> "Input"
            "ScrollView", "FlatList" -> "Scrollable"
            "Image" -> "Media"
            "TouchableOpacity", "Pressable", "Button" -> "Interactive"
            "Card" -> "Card"
            "Loading", "ActivityIndicator" -> "Loading"
            "EmptyState" -> "State"
            else -> "Other"
        }
    }
    
    private fun compareComponentHierarchies(
        rnComponents: List<ComponentInfo>,
        androidComponents: List<ComponentInfo>,
        screenName: String
    ) {
        val rnComponentTypes = rnComponents.groupBy { it.type }.keys
        val androidComponentTypes = androidComponents.groupBy { it.type }.keys
        
        val rnContainers = rnComponents.filter { it.type == "Container" }.size
        val androidContainers = androidComponents.filter { 
            it.name in listOf("Box", "Column", "Row", "Scaffold", "Surface") 
        }.size
        
        if (rnContainers > 0 && androidContainers == 0) {
            results.add(
                ComparisonResult(
                    category = "Layout",
                    itemName = "$screenName/ContainerStructure",
                    status = ComparisonStatus.MISSING_IN_ANDROID,
                    rnValue = "$rnContainers containers",
                    androidValue = "0 containers",
                    difference = "Missing container components in Android",
                    priority = Priority.HIGH,
                    suggestions = listOf("Add Box/Column/Row components to match RN layout structure")
                )
            )
        }
        
        val rnScrollables = rnComponents.filter { it.type == "Scrollable" }.size
        val androidScrollables = androidComponents.filter {
            it.name in listOf("LazyColumn", "LazyRow", "verticalScroll", "horizontalScroll")
        }.size
        
        if (rnScrollables > androidScrollables) {
            results.add(
                ComparisonResult(
                    category = "Layout",
                    itemName = "$screenName/ScrollableStructure",
                    status = ComparisonStatus.MISMATCH,
                    rnValue = "$rnScrollables scrollable components",
                    androidValue = "$androidScrollables scrollable components",
                    difference = "Android has fewer scrollable components",
                    priority = Priority.MEDIUM,
                    suggestions = listOf("Consider adding LazyColumn or scroll modifiers")
                )
            )
        }
        
        val rnInteractive = rnComponents.filter { it.type == "Interactive" }.size
        val androidInteractive = androidComponents.filter {
            it.name in listOf("Button", "IconButton", "Clickable", "clickable")
        }.size
        
        if (kotlin.math.abs(rnInteractive - androidInteractive) > 2) {
            results.add(
                ComparisonResult(
                    category = "Layout",
                    itemName = "$screenName/InteractiveElements",
                    status = ComparisonStatus.MISMATCH,
                    rnValue = "$rnInteractive interactive components",
                    androidValue = "$androidInteractive interactive components",
                    difference = "Different number of interactive elements",
                    priority = Priority.MEDIUM,
                    suggestions = listOf("Review interactive elements count difference")
                )
            )
        }
    }
    
    private fun compareComponentAttributes(
        rnComponents: List<ComponentInfo>,
        androidComponents: List<ComponentInfo>,
        screenName: String
    ) {
        val rnStyles = rnComponents.mapNotNull { it.attributes["style"] }.distinct()
        
        for (styleName in rnStyles) {
            val hasAndroidEquivalent = androidComponents.any { component ->
                component.attributes.keys.any { key ->
                    key.contains("modifier_", ignoreCase = true) ||
                    key.contains(styleName, ignoreCase = true)
                }
            }
            
            if (!hasAndroidEquivalent) {
                results.add(
                    ComparisonResult(
                        category = "Layout",
                        itemName = "$screenName/Style_$styleName",
                        status = ComparisonStatus.MISSING_IN_ANDROID,
                        rnValue = "StyleSheet.$styleName",
                        androidValue = null,
                        difference = "Style '$styleName' not found in Android implementation",
                        priority = Priority.LOW,
                        suggestions = listOf("Create equivalent Modifier or style in Android")
                    )
                )
            }
        }
        
        val rnTextComponents = rnComponents.filter { it.type == "Text" }
        val androidTextComponents = androidComponents.filter { it.name == "Text" }
        
        if (rnTextComponents.isNotEmpty()) {
            val rnTextCount = rnTextComponents.size
            val androidTextCount = androidTextComponents.size
            
            if (rnTextCount != androidTextCount) {
                results.add(
                    ComparisonResult(
                        category = "Layout",
                        itemName = "$screenName/TextComponents",
                        status = ComparisonStatus.MISMATCH,
                        rnValue = "$rnTextCount Text components",
                        androidValue = "$androidTextCount Text components",
                        difference = "Text component count mismatch",
                        priority = Priority.LOW,
                        suggestions = listOf("Review Text component usage in both implementations")
                    )
                )
            }
        }
    }
    
    fun compareSpecificScreen(screenName: String): List<ComparisonResult> {
        val rnFile = File(rnProjectPath, "src/screens/$screenName/${screenName}.js")
            .takeIf { it.exists() }
            ?: File(rnProjectPath, "src/screens/$screenName.js")
            .takeIf { it.exists() }
        
        val androidScreensDir = File(androidProjectPath, "app/src/main/java/com/legostory/mobile/ui/screens")
        val androidFile = findAndroidScreenFile(androidScreensDir, screenName)
        
        if (rnFile == null) {
            Logger.error("RN screen file not found: $screenName")
            return listOf(
                ComparisonResult(
                    category = "Layout",
                    itemName = screenName,
                    status = ComparisonStatus.MISSING_IN_RN,
                    priority = Priority.HIGH,
                    suggestions = listOf("Create $screenName.js in RN project")
                )
            )
        }
        
        if (androidFile == null) {
            Logger.error("Android screen file not found: $screenName")
            return listOf(
                ComparisonResult(
                    category = "Layout",
                    itemName = screenName,
                    status = ComparisonStatus.MISSING_IN_ANDROID,
                    rnValue = rnFile.name,
                    priority = Priority.HIGH,
                    suggestions = listOf("Create $screenName.kt in Android project")
                )
            )
        }
        
        val screenResults = mutableListOf<ComparisonResult>()
        val rnContent = FileUtils.readFileContent(rnFile) ?: return screenResults
        val androidContent = FileUtils.readFileContent(androidFile) ?: return screenResults
        
        val rnComponents = parseRnComponents(rnContent, rnFile.name)
        val androidComponents = parseAndroidComponents(androidContent, androidFile.name)
        
        compareComponentHierarchies(rnComponents, androidComponents, screenName)
        compareComponentAttributes(rnComponents, androidComponents, screenName)
        
        return screenResults
    }
    
    fun getComponentMappingReport(): Map<String, String> {
        return rnComponentPatterns
    }
    
    fun getAttributeMappingReport(): Map<String, String> {
        return rnAttributeMappings
    }
}

fun main() {
    val rnPath = "../lego-mobile"
    val androidPath = "."
    
    val comparator = LayoutComparator(rnPath, androidPath)
    val results = comparator.compare()
    
    println("\n=== Layout Comparison Report ===\n")
    
    val groupedResults = results.groupBy { it.status }
    
    groupedResults.forEach { (status, items) ->
        println("[$status] ${items.size} items:")
        items.forEach { result ->
            println("  - ${result.itemName}: ${result.difference ?: "OK"}")
            if (result.suggestions.isNotEmpty()) {
                println("    Suggestions: ${result.suggestions.joinToString(", ")}")
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
    println("High Priority: ${statistics.highPriorityCount}")
    println("Medium Priority: ${statistics.mediumPriorityCount}")
    println("Low Priority: ${statistics.lowPriorityCount}")
}
