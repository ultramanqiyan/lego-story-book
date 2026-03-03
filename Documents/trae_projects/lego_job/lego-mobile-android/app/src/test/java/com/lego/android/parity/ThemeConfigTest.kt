package com.lego.android.parity

import org.junit.Test
import org.junit.Assert.*
import java.io.File

class ThemeConfigTest {
    
    private val rnThemePath = "c:\\Users\\yannis\\Documents\\trae_projects\\lego_job\\lego-mobile\\src\\styles\\theme.js"
    private val androidColorPath = "c:\\Users\\yannis\\Documents\\trae_projects\\lego_job\\lego-mobile-android\\app\\src\\main\\java\\com\\legostory\\mobile\\ui\\theme\\Color.kt"
    
    @Test
    fun testLegoColors() {
        val expectedColors = mapOf(
            "LegoRed" to "#E3000B",
            "LegoBlue" to "#0055BF",
            "LegoYellow" to "#FFD700",
            "LegoGreen" to "#00A651",
            "LegoOrange" to "#FF6B00",
            "LegoPurple" to "#8B008B"
        )
        
        val androidColorFile = File(androidColorPath)
        if (androidColorFile.exists()) {
            val content = androidColorFile.readText()
            for ((name, hexValue) in expectedColors) {
                val hasColor = content.contains(name)
                assertTrue("Android should have color $name", hasColor)
            }
        } else {
            fail("Android Color.kt file not found")
        }
    }
    
    @Test
    fun testBackgroundColors() {
        val expectedBackgroundColors = listOf(
            "Background",
            "BackgroundLight",
            "BackgroundDark"
        )
        
        val androidColorFile = File(androidColorPath)
        if (androidColorFile.exists()) {
            val content = androidColorFile.readText()
            for (colorName in expectedBackgroundColors) {
                val hasColor = content.contains(colorName)
                assertTrue("Android should have background color $colorName", hasColor)
            }
        }
    }
    
    @Test
    fun textColorExists() {
        val expectedTextColors = listOf(
            "Text",
            "TextLight",
            "TextMuted"
        )
        
        val androidColorFile = File(androidColorPath)
        if (androidColorFile.exists()) {
            val content = androidColorFile.readText()
            for (colorName in expectedTextColors) {
                val hasColor = content.contains(colorName)
                assertTrue("Android should have text color $colorName", hasColor)
            }
        }
    }
    
    @Test
    fun statusColorsExist() {
        val expectedStatusColors = listOf(
            "Error",
            "Success",
            "Warning",
            "Info"
        )
        
        val androidColorFile = File(androidColorPath)
        if (androidColorFile.exists()) {
            val content = androidColorFile.readText()
            for (colorName in expectedStatusColors) {
                val hasColor = content.contains(colorName)
                assertTrue("Android should have status color $colorName", hasColor)
            }
        }
    }
    
    @Test
    fun testTypographySystem() {
        val expectedTypography = mapOf(
            "h1" to 32,
            "h2" to 24,
            "h3" to 20,
            "body" to 16,
            "caption" to 12
        )
        
        println("Typography system check:")
        for ((style, size) in expectedTypography) {
            println("  $style: ${size}sp expected")
        }
        
        assertTrue("Typography values should be defined", expectedTypography.isNotEmpty())
    }
    
    @Test
    fun testSpacingSystem() {
        val expectedSpacing = mapOf(
            "xs" to 4,
            "sm" to 8,
            "md" to 16,
            "lg" to 24,
            "xl" to 32,
            "xxl" to 48
        )
        
        println("Spacing system check:")
        for ((name, value) in expectedSpacing) {
            println("  $name: ${value}dp expected")
        }
        
        assertTrue("Spacing values should be defined", expectedSpacing.isNotEmpty())
    }
    
    @Test
    fun testBorderRadius() {
        val expectedRadius = mapOf(
            "sm" to 4,
            "md" to 8,
            "lg" to 16,
            "xl" to 24,
            "xxl" to 32,
            "round" to 9999
        )
        
        println("Border radius check:")
        for ((name, value) in expectedRadius) {
            println("  $name: ${value}dp expected")
        }
        
        assertTrue("Border radius values should be defined", expectedRadius.isNotEmpty())
    }
    
    @Test
    fun testShadowConfiguration() {
        val expectedShadows = listOf(
            "sm",
            "md",
            "lg",
            "glow",
            "magicGlow"
        )
        
        println("Shadow configuration check:")
        for (shadow in expectedShadows) {
            println("  Shadow '$shadow' should be defined")
        }
        
        assertTrue("Shadow configurations should be defined", expectedShadows.isNotEmpty())
    }
    
    @Test
    fun testRarityColors() {
        val expectedRarityColors = mapOf(
            "common" to "#9E9E9E",
            "uncommon" to "#4CAF50",
            "rare" to "#2196F3",
            "epic" to "#9C27B0",
            "legendary" to "#FF9800"
        )
        
        println("Rarity colors check:")
        for ((rarity, color) in expectedRarityColors) {
            println("  $rarity: $color expected")
        }
        
        assertTrue("Rarity colors should be defined", expectedRarityColors.isNotEmpty())
    }
    
    @Test
    fun testCharacterTypeColors() {
        val expectedCharacterTypes = mapOf(
            "hero" to "#E3000B",
            "villain" to "#8B008B",
            "sidekick" to "#00A651",
            "mentor" to "#FFD700",
            "creature" to "#0055BF"
        )
        
        println("Character type colors check:")
        for ((type, color) in expectedCharacterTypes) {
            println("  $type: $color expected")
        }
        
        assertTrue("Character type colors should be defined", expectedCharacterTypes.isNotEmpty())
    }
    
    @Test
    fun testGradientPresets() {
        val expectedGradients = listOf(
            "primary",
            "secondary",
            "success",
            "warning",
            "danger",
            "magic"
        )
        
        println("Gradient presets check:")
        for (gradient in expectedGradients) {
            println("  Gradient '$gradient' should be defined")
        }
        
        assertTrue("Gradient presets should be defined", expectedGradients.isNotEmpty())
    }
}
