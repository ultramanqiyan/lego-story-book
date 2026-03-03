package com.legostory.mobile.core.constants

import org.junit.Test
import org.junit.Assert.*

class PlotTypesTest {
    
    @Test
    fun `test All list is not empty`() {
        assertTrue("PlotTypes list should not be empty", PlotTypes.All.isNotEmpty())
    }
    
    @Test
    fun `test All list contains expected types`() {
        val types = PlotTypes.All
        assertTrue("Should contain adventure type", types.any { it.id == "adventure" })
        assertTrue("Should contain mystery type", types.any { it.id == "mystery" })
        assertTrue("Should contain friendship type", types.any { it.id == "friendship" })
        assertTrue("Should contain hero type", types.any { it.id == "hero" })
    }
    
    @Test
    fun `test getById with valid id returns correct type`() {
        val plotType = PlotTypes.getById("adventure")
        assertNotNull("Should return adventure type", plotType)
        assertEquals("ID should match", "adventure", plotType?.id)
        assertEquals("Name should match", "冒险之旅", plotType?.name)
        assertEquals("Icon should match", "🗺️", plotType?.icon)
    }
    
    @Test
    fun `test getById with invalid id returns null`() {
        val plotType = PlotTypes.getById("nonexistent")
        assertNull("Should return null for invalid id", plotType)
    }
    
    @Test
    fun `test PlotType data class`() {
        val plotType = PlotType(
            id = "test",
            name = "测试类型",
            icon = "🧪",
            description = "这是一个测试类型"
        )
        assertEquals("ID should match", "test", plotType.id)
        assertEquals("Name should match", "测试类型", plotType.name)
        assertEquals("Icon should match", "🧪", plotType.icon)
        assertEquals("Description should match", "这是一个测试类型", plotType.description)
    }
    
    @Test
    fun `test All list has correct size`() {
        assertEquals("PlotTypes list should have 6 items", 6, PlotTypes.All.size)
    }
}
