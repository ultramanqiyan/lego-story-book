package com.legostory.mobile.core.constants

import org.junit.Test
import org.junit.Assert.*

class ColorsTest {
    
    @Test
    fun `test LegoRed color value`() {
        val color = Colors.LegoRed
        assertEquals("LegoRed should have correct value", 0xFFE3000B, color)
    }
    
    @Test
    fun `test LegoBlue color value`() {
        val color = Colors.LegoBlue
        assertEquals("LegoBlue should have correct value", 0xFF006BA6, color)
    }
    
    @Test
    fun `test LegoYellow color value`() {
        val color = Colors.LegoYellow
        assertEquals("LegoYellow should have correct value", 0xFFFFD100, color)
    }
    
    @Test
    fun `test LegoGreen color value`() {
        val color = Colors.LegoGreen
        assertEquals("LegoGreen should have correct value", 0xFF00A651, color)
    }
    
    @Test
    fun `test LegoOrange color value`() {
        val color = Colors.LegoOrange
        assertEquals("LegoOrange should have correct value", 0xFFFF6B00, color)
    }
    
    @Test
    fun `test LegoPurple color value`() {
        val color = Colors.LegoPurple
        assertEquals("LegoPurple should have correct value", 0xFF8B5CF6, color)
    }
    
    @Test
    fun `test Background color value`() {
        val color = Colors.Background
        assertEquals("Background should have correct value", 0xFFFFF8E7, color)
    }
    
    @Test
    fun `test Text color value`() {
        val color = Colors.Text
        assertEquals("Text should have correct value", 0xFF333333, color)
    }
    
    @Test
    fun `test Error color value`() {
        val color = Colors.Error
        assertEquals("Error should have correct value", 0xFFE74C3C, color)
    }
    
    @Test
    fun `test Success color value`() {
        val color = Colors.Success
        assertEquals("Success should have correct value", 0xFF27AE60, color)
    }
    
    @Test
    fun `test Color class with Long value`() {
        val color = Color(0xFFE3000B)
        assertEquals("Color value should match", 0xFFE3000B, color.value)
    }
    
    @Test
    fun `test Color class with RGB`() {
        val color = Color(red = 227, green = 0, blue = 11)
        assertEquals("Color red component should be correct", 227, (color.value shr 16 and 0xFF).toInt())
        assertEquals("Color green component should be correct", 0, (color.value shr 8 and 0xFF).toInt())
        assertEquals("Color blue component should be correct", 11, (color.value and 0xFF).toInt())
    }
    
    @Test
    fun `test Color class with hex string`() {
        val color = Color("#E3000B")
        assertEquals("Color value should match", 0xFFE3000B, color.value)
    }
}
