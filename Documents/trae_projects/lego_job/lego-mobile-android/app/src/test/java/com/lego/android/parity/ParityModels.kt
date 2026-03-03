package com.lego.android.parity

import java.io.File

data class ComparisonResult(
    val category: String,
    val itemName: String,
    val status: ComparisonStatus,
    val rnValue: String? = null,
    val androidValue: String? = null,
    val difference: String? = null,
    val priority: Priority = Priority.MEDIUM,
    val suggestions: List<String> = emptyList()
)

enum class ComparisonStatus {
    MATCH, MISMATCH, MISSING_IN_ANDROID, MISSING_IN_RN, ERROR
}

enum class Priority {
    HIGH, MEDIUM, LOW
}

data class ComponentInfo(
    val name: String,
    val type: String,
    val attributes: Map<String, String>,
    val children: List<ComponentInfo> = emptyList(),
    val sourceFile: String,
    val lineNumber: Int = 0
)

data class StyleValue(
    val name: String,
    val value: String,
    val category: String,
    val sourceFile: String,
    val lineNumber: Int = 0
)

data class AnimationConfig(
    val name: String,
    val duration: Int? = null,
    val easing: String? = null,
    val properties: Map<String, String> = emptyMap(),
    val sourceFile: String,
    val lineNumber: Int = 0
)

data class ThemeConfig(
    val name: String,
    val colors: Map<String, String>,
    val typography: Map<String, String>,
    val spacing: Map<String, Int>,
    val sourceFile: String
)

data class ParityReport(
    val timestamp: String,
    val rnProjectPath: String,
    val androidProjectPath: String,
    val layoutComparisons: List<ComparisonResult>,
    val styleComparisons: List<ComparisonResult>,
    val animationComparisons: List<ComparisonResult>,
    val themeComparisons: List<ComparisonResult>,
    val statistics: ReportStatistics
)

data class ReportStatistics(
    val totalComparisons: Int,
    val matchCount: Int,
    val mismatchCount: Int,
    val missingInAndroidCount: Int,
    val missingInRnCount: Int,
    val errorCount: Int,
    val highPriorityCount: Int,
    val mediumPriorityCount: Int,
    val lowPriorityCount: Int
)

object ParityConfig {
    const val RN_PROJECT_PATH = "../lego-mobile"
    const val ANDROID_PROJECT_PATH = "."
    const val REPORT_OUTPUT_PATH = "parity-reports"
    
    val RN_SCREENS_PATH = "$RN_PROJECT_PATH/src/screens"
    val RN_STYLES_PATH = "$RN_PROJECT_PATH/src/styles"
    val RN_UTILS_PATH = "$RN_PROJECT_PATH/src/utils"
    
    val ANDROID_SCREENS_PATH = "$ANDROID_PROJECT_PATH/app/src/main/java/com/legostory/mobile/ui/screens"
    val ANDROID_THEME_PATH = "$ANDROID_PROJECT_PATH/app/src/main/java/com/legostory/mobile/ui/theme"
    val ANDROID_ANIMATION_PATH = "$ANDROID_PROJECT_PATH/app/src/main/java/com/legostory/mobile/ui/animation"
    
    val SCREEN_MAPPINGS = mapOf(
        "HomeScreen.js" to "home/HomeScreen.kt",
        "LoginScreen.js" to "login/LoginScreen.kt",
        "BookshelfScreen.js" to "bookshelf/BookshelfScreen.kt",
        "BookDetailScreen.js" to "bookdetail/BookDetailScreen.kt",
        "ChapterScreen.js" to "chapter/ChapterScreen.kt",
        "CharactersScreen.js" to "characters/CharactersScreen.kt",
        "StoryCreateScreen.js" to "story/StoryCreateScreen.kt",
        "SettingsScreen.js" to "settings/SettingsScreen.kt",
        "ThemeSettingsScreen.js" to "settings/ThemeSettingsScreen.kt",
        "ParentControlScreen.js" to "settings/ParentControlScreen.kt",
        "AdventureScreen.js" to "adventure/AdventureScreen.kt"
    )
    
    val IGNORE_PATTERNS = listOf(
        "node_modules",
        "build",
        ".gradle",
        "__tests__",
        ".git"
    )
}

object Logger {
    private var logLevel = LogLevel.INFO
    
    enum class LogLevel {
        DEBUG, INFO, WARN, ERROR
    }
    
    fun setLogLevel(level: LogLevel) {
        logLevel = level
    }
    
    fun debug(message: String) {
        if (logLevel.ordinal <= LogLevel.DEBUG.ordinal) {
            println("[DEBUG] $message")
        }
    }
    
    fun info(message: String) {
        if (logLevel.ordinal <= LogLevel.INFO.ordinal) {
            println("[INFO] $message")
        }
    }
    
    fun warn(message: String) {
        if (logLevel.ordinal <= LogLevel.WARN.ordinal) {
            println("[WARN] $message")
        }
    }
    
    fun error(message: String) {
        if (logLevel.ordinal <= LogLevel.ERROR.ordinal) {
            println("[ERROR] $message")
        }
    }
}

object FileUtils {
    fun findFiles(directory: File, extension: String, excludePatterns: List<String> = emptyList()): List<File> {
        if (!directory.exists() || !directory.isDirectory) {
            Logger.warn("Directory not found: ${directory.absolutePath}")
            return emptyList()
        }
        
        return directory.walkTopDown()
            .filter { file ->
                file.isFile && file.extension == extension.trimStart('.')
            }
            .filter { file ->
                excludePatterns.none { pattern ->
                    file.absolutePath.contains(pattern)
                }
            }
            .toList()
    }
    
    fun readFileContent(file: File): String? {
        return try {
            file.readText()
        } catch (e: Exception) {
            Logger.error("Failed to read file: ${file.absolutePath} - ${e.message}")
            null
        }
    }
    
    fun ensureDirectory(path: String): File {
        val dir = File(path)
        if (!dir.exists()) {
            dir.mkdirs()
        }
        return dir
    }
    
    fun getRelativePath(basePath: String, fullPath: String): String {
        return try {
            val baseFile = File(basePath).canonicalFile
            val fullFile = File(fullPath).canonicalFile
            fullFile.relativeTo(baseFile).path
        } catch (e: Exception) {
            fullPath
        }
    }
}

object ColorUtils {
    private val HEX_COLOR_PATTERN = Regex("#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})")
    private val RGB_COLOR_PATTERN = Regex("rgb\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*\\)")
    private val RGBA_COLOR_PATTERN = Regex("rgba\\s*\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*([\\d.]+)\\s*\\)")
    
    fun normalizeColor(color: String): String {
        val trimmed = color.trim()
        
        HEX_COLOR_PATTERN.find(trimmed)?.let { match ->
            return match.value.uppercase()
        }
        
        RGB_COLOR_PATTERN.find(trimmed)?.let { match ->
            val (r, g, b) = match.destructured
            return "#%02X%02X%02X".format(r.toInt(), g.toInt(), b.toInt())
        }
        
        RGBA_COLOR_PATTERN.find(trimmed)?.let { match ->
            val (r, g, b, a) = match.destructured
            val alpha = (a.toFloat() * 255).toInt()
            return "#%02X%02X%02X%02X".format(r.toInt(), g.toInt(), b.toInt(), alpha)
        }
        
        return trimmed
    }
    
    fun colorsMatch(color1: String?, color2: String?): Boolean {
        if (color1 == null && color2 == null) return true
        if (color1 == null || color2 == null) return false
        
        return normalizeColor(color1) == normalizeColor(color2)
    }
    
    fun extractColors(text: String): List<String> {
        val colors = mutableListOf<String>()
        
        HEX_COLOR_PATTERN.findAll(text).forEach { match ->
            colors.add(match.value)
        }
        
        RGB_COLOR_PATTERN.findAll(text).forEach { match ->
            colors.add(normalizeColor(match.value))
        }
        
        RGBA_COLOR_PATTERN.findAll(text).forEach { match ->
            colors.add(normalizeColor(match.value))
        }
        
        return colors
    }
}

object NumberUtils {
    fun parseNumber(value: String?): Double? {
        if (value == null) return null
        
        val cleaned = value
            .replace("px", "")
            .replace("dp", "")
            .replace("sp", "")
            .replace("ms", "")
            .trim()
        
        return cleaned.toDoubleOrNull()
    }
    
    fun numbersMatch(value1: String?, value2: String?, tolerance: Double = 0.01): Boolean {
        val num1 = parseNumber(value1) ?: return false
        val num2 = parseNumber(value2) ?: return false
        
        return kotlin.math.abs(num1 - num2) <= tolerance
    }
    
    fun normalizeDimension(value: String): String {
        return value
            .replace("px", "")
            .replace("dp", "")
            .replace("sp", "")
            .trim()
    }
}
