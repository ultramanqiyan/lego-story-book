package com.lego.android.parity

import org.junit.Test
import org.junit.Assert.*
import java.io.File

class ComponentInteractionTest {
    
    private val androidComponentsPath = "c:\\Users\\yannis\\Documents\\trae_projects\\lego_job\\lego-mobile-android\\app\\src\\main\\java\\com\\legostory\\mobile\\ui\\components"
    
    @Test
    fun testButtonInteraction() {
        val buttonFile = File("$androidComponentsPath\\Button.kt")
        assertTrue("Button.kt should exist", buttonFile.exists())
        
        if (buttonFile.exists()) {
            val content = buttonFile.readText()
            
            println("Button interaction check:")
            
            val hasOnClick = content.contains("onClick")
            val hasEnabled = content.contains("enabled")
            val hasModifier = content.contains("Modifier")
            
            println("  onClick callback: ${if (hasOnClick) "found" else "not found"}")
            println("  enabled state: ${if (hasEnabled) "found" else "not found"}")
            println("  Modifier: ${if (hasModifier) "found" else "not found"}")
            
            assertTrue("Button should have onClick callback", hasOnClick)
            assertTrue("Button should have Modifier", hasModifier)
        }
    }
    
    @Test
    fun testCardInteraction() {
        val cardFile = File("$androidComponentsPath\\Card.kt")
        assertTrue("Card.kt should exist", cardFile.exists())
        
        if (cardFile.exists()) {
            val content = cardFile.readText()
            
            println("Card interaction check:")
            
            val hasOnClick = content.contains("onClick")
            val hasElevation = content.contains("elevation") || content.contains("shadow")
            val hasShape = content.contains("shape") || content.contains("RoundedCornerShape")
            
            println("  onClick callback: ${if (hasOnClick) "found" else "not found"}")
            println("  elevation/shadow: ${if (hasElevation) "found" else "not found"}")
            println("  shape: ${if (hasShape) "found" else "not found"}")
        }
    }
    
    @Test
    fun testModalInteraction() {
        val modalFile = File("$androidComponentsPath\\Modal.kt")
        assertTrue("Modal.kt should exist", modalFile.exists())
        
        if (modalFile.exists()) {
            val content = modalFile.readText()
            
            println("Modal interaction check:")
            
            val hasOnDismiss = content.contains("onDismiss") || content.contains("onDismissRequest")
            val hasVisible = content.contains("visible") || content.contains("show")
            val hasContent = content.contains("content")
            
            println("  onDismiss: ${if (hasOnDismiss) "found" else "not found"}")
            println("  visible state: ${if (hasVisible) "found" else "not found"}")
            println("  content: ${if (hasContent) "found" else "not found"}")
        }
    }
    
    @Test
    fun testToastInteraction() {
        val toastFile = File("$androidComponentsPath\\Toast.kt")
        assertTrue("Toast.kt should exist", toastFile.exists())
        
        if (toastFile.exists()) {
            val content = toastFile.readText()
            
            println("Toast interaction check:")
            
            val hasMessage = content.contains("message") || content.contains("text")
            val hasDuration = content.contains("duration") || content.contains("Length")
            val hasShow = content.contains("show") || content.contains("Show")
            
            println("  message: ${if (hasMessage) "found" else "not found"}")
            println("  duration: ${if (hasDuration) "found" else "not found"}")
            println("  show: ${if (hasShow) "found" else "not found"}")
        }
    }
    
    @Test
    fun testLoadingInteraction() {
        val loadingFile = File("$androidComponentsPath\\Loading.kt")
        assertTrue("Loading.kt should exist", loadingFile.exists())
        
        if (loadingFile.exists()) {
            val content = loadingFile.readText()
            
            println("Loading interaction check:")
            
            val hasProgress = content.contains("progress") || content.contains("Progress")
            val hasAnimating = content.contains("animate") || content.contains("Animat")
            
            println("  progress: ${if (hasProgress) "found" else "not found"}")
            println("  animation: ${if (hasAnimating) "found" else "not found"}")
        }
    }
    
    @Test
    fun testEmptyStateInteraction() {
        val emptyStateFile = File("$androidComponentsPath\\EmptyState.kt")
        assertTrue("EmptyState.kt should exist", emptyStateFile.exists())
        
        if (emptyStateFile.exists()) {
            val content = emptyStateFile.readText()
            
            println("EmptyState interaction check:")
            
            val hasTitle = content.contains("title")
            val hasMessage = content.contains("message") || content.contains("description")
            val hasAction = content.contains("action") || content.contains("button") || content.contains("onClick")
            
            println("  title: ${if (hasTitle) "found" else "not found"}")
            println("  message: ${if (hasMessage) "found" else "not found"}")
            println("  action: ${if (hasAction) "found" else "not found"}")
        }
    }
    
    @Test
    fun testComponentStateManagement() {
        println("Component state management check:")
        
        val components = listOf("Button.kt", "Card.kt", "Modal.kt", "Toast.kt", "Loading.kt", "EmptyState.kt")
        var totalComponents = 0
        var componentsWithState = 0
        
        for (component in components) {
            val file = File("$androidComponentsPath\\$component")
            if (file.exists()) {
                totalComponents++
                val content = file.readText()
                
                val hasState = content.contains("remember") || 
                              content.contains("mutableStateOf") ||
                              content.contains("State") ||
                              content.contains("var ")
                
                if (hasState) {
                    componentsWithState++
                }
                
                println("  $component: ${if (hasState) "has state management" else "no state management"}")
            }
        }
        
        println("\n  Total components: $totalComponents")
        println("  Components with state: $componentsWithState")
    }
}
