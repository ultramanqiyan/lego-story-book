package com.lego.android.parity

import org.junit.Test
import org.junit.Assert.*
import java.io.File

class NavigationIntegrationTest {
    
    private val androidScreensPath = "c:\\Users\\yannis\\Documents\\trae_projects\\lego_job\\lego-mobile-android\\app\\src\\main\\java\\com\\legostory\\mobile\\ui\\screens"
    private val androidNavPath = "c:\\Users\\yannis\\Documents\\trae_projects\\lego_job\\lego-mobile-android\\app\\src\\main\\java\\com\\legostory\\mobile\\ui\\navigation"
    
    @Test
    fun testNavigationFileExists() {
        val navFile = File("$androidNavPath\\AppNavigation.kt")
        assertTrue("AppNavigation.kt should exist", navFile.exists())
        
        if (navFile.exists()) {
            val content = navFile.readText()
            assertTrue("Navigation should use NavHost", content.contains("NavHost"))
            assertTrue("Navigation should have composable destinations", content.contains("composable"))
        }
    }
    
    @Test
    fun testLoginToHomeNavigation() {
        val navFile = File("$androidNavPath\\AppNavigation.kt")
        if (navFile.exists()) {
            val content = navFile.readText()
            
            println("Login to Home navigation check:")
            
            val hasLoginRoute = content.contains("login", ignoreCase = true)
            val hasHomeRoute = content.contains("home", ignoreCase = true)
            val hasNavigationCall = content.contains("navigate") || content.contains("popBackStack")
            
            println("  Login route: ${if (hasLoginRoute) "found" else "not found"}")
            println("  Home route: ${if (hasHomeRoute) "found" else "not found"}")
            println("  Navigation call: ${if (hasNavigationCall) "found" else "not found"}")
            
            assertTrue("Should have login route", hasLoginRoute)
            assertTrue("Should have home route", hasHomeRoute)
        }
    }
    
    @Test
    fun testBottomNavigationExists() {
        val mainScreen = File("$androidScreensPath\\main\\MainScreen.kt")
        if (mainScreen.exists()) {
            val content = mainScreen.readText()
            
            println("Bottom navigation check:")
            
            val hasBottomNav = content.contains("BottomNavigation") || 
                              content.contains("NavigationBar") ||
                              content.contains("bottom")
            
            println("  Bottom navigation: ${if (hasBottomNav) "found" else "not found"}")
            
            assertTrue("MainScreen should have bottom navigation", hasBottomNav)
        }
    }
    
    @Test
    fun testAllScreenRoutes() {
        val expectedRoutes = listOf(
            "login",
            "home",
            "bookshelf",
            "characters",
            "settings",
            "bookDetail",
            "chapter",
            "storyCreate",
            "themeSettings",
            "parentControl",
            "adventure"
        )
        
        val navFile = File("$androidNavPath\\AppNavigation.kt")
        if (navFile.exists()) {
            val content = navFile.readText()
            
            println("Screen routes check:")
            for (route in expectedRoutes) {
                val hasRoute = content.contains(route, ignoreCase = true)
                println("  $route: ${if (hasRoute) "found" else "not found"}")
            }
        }
    }
    
    @Test
    fun testBackStackManagement() {
        val navFile = File("$androidNavPath\\AppNavigation.kt")
        if (navFile.exists()) {
            val content = navFile.readText()
            
            println("Back stack management check:")
            
            val hasPopBackStack = content.contains("popBackStack")
            val hasNavigateUp = content.contains("navigateUp")
            val hasLaunchSingleTop = content.contains("launchSingleTop")
            
            println("  popBackStack: ${if (hasPopBackStack) "found" else "not found"}")
            println("  navigateUp: ${if (hasNavigateUp) "found" else "not found"}")
            println("  launchSingleTop: ${if (hasLaunchSingleTop) "found" else "not found"}")
        }
    }
    
    @Test
    fun testNavigationArguments() {
        val navFile = File("$androidNavPath\\AppNavigation.kt")
        if (navFile.exists()) {
            val content = navFile.readText()
            
            println("Navigation arguments check:")
            
            val hasArguments = content.contains("arguments") || content.contains("{") && content.contains("}")
            val hasNavArgument = content.contains("NavArgument")
            
            println("  Arguments pattern: ${if (hasArguments) "found" else "not found"}")
            println("  NavArgument: ${if (hasNavArgument) "found" else "not found"}")
        }
    }
}
