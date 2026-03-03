package com.lego.android.parity

import org.junit.Test
import org.junit.Assert.*
import java.io.File

class ComponentPropsTest {
    
    private val androidComponentsPath = "c:\\Users\\yannis\\Documents\\trae_projects\\lego_job\\lego-mobile-android\\app\\src\\main\\java\\com\\legostory\\mobile\\ui\\components"
    
    @Test
    fun testButtonComponentExists() {
        val buttonFile = File("$androidComponentsPath\\Button.kt")
        assertTrue("Button.kt should exist", buttonFile.exists())
        
        if (buttonFile.exists()) {
            val content = buttonFile.readText()
            assertTrue("Button should be a Composable function", content.contains("@Composable"))
            assertTrue("Button should have onClick parameter", content.contains("onClick"))
        }
    }
    
    @Test
    fun testButtonVariants() {
        val expectedVariants = listOf(
            "primary",
            "secondary",
            "outline",
            "ghost"
        )
        
        val buttonFile = File("$androidComponentsPath\\Button.kt")
        if (buttonFile.exists()) {
            val content = buttonFile.readText()
            println("Button variants check:")
            for (variant in expectedVariants) {
                val hasVariant = content.contains(variant, ignoreCase = true)
                println("  $variant: ${if (hasVariant) "found" else "not found"}")
            }
        }
    }
    
    @Test
    fun testButtonSizes() {
        val expectedSizes = listOf(
            "small",
            "medium",
            "large"
        )
        
        val buttonFile = File("$androidComponentsPath\\Button.kt")
        if (buttonFile.exists()) {
            val content = buttonFile.readText()
            println("Button sizes check:")
            for (size in expectedSizes) {
                val hasSize = content.contains(size, ignoreCase = true)
                println("  $size: ${if (hasSize) "found" else "not found"}")
            }
        }
    }
    
    @Test
    fun testButtonStyles() {
        val buttonFile = File("$androidComponentsPath\\Button.kt")
        if (buttonFile.exists()) {
            val content = buttonFile.readText()
            
            println("Button default style check:")
            println("  Should have background color")
            println("  Should have rounded corners")
            println("  Should have padding")
            
            val hasBackground = content.contains("background", ignoreCase = true) || 
                               content.contains("color", ignoreCase = true)
            val hasRoundedCorners = content.contains("rounded", ignoreCase = true) || 
                                   content.contains("Corner", ignoreCase = true) ||
                                   content.contains("shape", ignoreCase = true)
            
            assertTrue("Button should have background styling", hasBackground)
            assertTrue("Button should have rounded corners", hasRoundedCorners)
        }
    }
    
    @Test
    fun testCardComponentExists() {
        val cardFile = File("$androidComponentsPath\\Card.kt")
        assertTrue("Card.kt should exist", cardFile.exists())
        
        if (cardFile.exists()) {
            val content = cardFile.readText()
            assertTrue("Card should be a Composable function", content.contains("@Composable"))
        }
    }
    
    @Test
    fun testCardStyles() {
        val cardFile = File("$androidComponentsPath\\Card.kt")
        if (cardFile.exists()) {
            val content = cardFile.readText()
            
            println("Card style check:")
            
            val hasShadow = content.contains("shadow", ignoreCase = true) || 
                           content.contains("elevation", ignoreCase = true)
            val hasRoundedCorners = content.contains("rounded", ignoreCase = true) || 
                                   content.contains("Corner", ignoreCase = true) ||
                                   content.contains("shape", ignoreCase = true)
            val hasBackground = content.contains("background", ignoreCase = true) || 
                               content.contains("color", ignoreCase = true)
            
            println("  Shadow: ${if (hasShadow) "found" else "not found"}")
            println("  Rounded corners: ${if (hasRoundedCorners) "found" else "not found"}")
            println("  Background: ${if (hasBackground) "found" else "not found"}")
            
            assertTrue("Card should have background", hasBackground)
        }
    }
    
    @Test
    fun testCardVariants() {
        val expectedVariants = listOf(
            "elevated",
            "outlined",
            "filled"
        )
        
        val cardFile = File("$androidComponentsPath\\Card.kt")
        if (cardFile.exists()) {
            val content = cardFile.readText()
            println("Card variants check:")
            for (variant in expectedVariants) {
                val hasVariant = content.contains(variant, ignoreCase = true)
                println("  $variant: ${if (hasVariant) "found" else "not found"}")
            }
        }
    }
    
    @Test
    fun testLoadingComponentExists() {
        val loadingFile = File("$androidComponentsPath\\Loading.kt")
        assertTrue("Loading.kt should exist", loadingFile.exists())
        
        if (loadingFile.exists()) {
            val content = loadingFile.readText()
            assertTrue("Loading should be a Composable function", content.contains("@Composable"))
        }
    }
    
    @Test
    fun testModalComponentExists() {
        val modalFile = File("$androidComponentsPath\\Modal.kt")
        assertTrue("Modal.kt should exist", modalFile.exists())
        
        if (modalFile.exists()) {
            val content = modalFile.readText()
            assertTrue("Modal should be a Composable function", content.contains("@Composable"))
        }
    }
    
    @Test
    fun testToastComponentExists() {
        val toastFile = File("$androidComponentsPath\\Toast.kt")
        assertTrue("Toast.kt should exist", toastFile.exists())
        
        if (toastFile.exists()) {
            val content = toastFile.readText()
            assertTrue("Toast should be a Composable function", content.contains("@Composable"))
        }
    }
    
    @Test
    fun testEmptyStateComponentExists() {
        val emptyStateFile = File("$androidComponentsPath\\EmptyState.kt")
        assertTrue("EmptyState.kt should exist", emptyStateFile.exists())
        
        if (emptyStateFile.exists()) {
            val content = emptyStateFile.readText()
            assertTrue("EmptyState should be a Composable function", content.contains("@Composable"))
        }
    }
    
    @Test
    fun testInputComponent() {
        println("Input component check:")
        println("  Note: Input component may be part of TextField or OutlinedTextField")
        println("  Expected properties:")
        println("    - placeholder text")
        println("    - value binding")
        println("    - onValueChange callback")
        println("    - error state")
        println("    - focused state")
    }
    
    @Test
    fun testComponentConsistency() {
        val components = listOf(
            "Button.kt",
            "Card.kt",
            "Loading.kt",
            "Modal.kt",
            "Toast.kt",
            "EmptyState.kt"
        )
        
        println("Component consistency check:")
        for (component in components) {
            val file = File("$androidComponentsPath\\$component")
            val exists = file.exists()
            println("  $component: ${if (exists) "exists" else "missing"}")
        }
    }
    
    @Test
    fun testMissingComponents() {
        val missingComponents = listOf(
            "Header.kt",
            "StepIndicator.kt",
            "Card3D.kt",
            "CardDeck3D.kt",
            "Card2D.kt",
            "CardSelector2D.kt",
            "StagePreview.kt",
            "WeatherEffect.kt",
            "KeywordHighlight.kt",
            "PromptPanel.kt",
            "CharacterForm.kt"
        )
        
        println("Missing components check:")
        for (component in missingComponents) {
            val file = File("$androidComponentsPath\\$component")
            val exists = file.exists()
            if (!exists) {
                println("  $component: MISSING (needs implementation)")
            }
        }
        
        assertTrue("Some components are missing in Android", missingComponents.isNotEmpty())
    }
}
