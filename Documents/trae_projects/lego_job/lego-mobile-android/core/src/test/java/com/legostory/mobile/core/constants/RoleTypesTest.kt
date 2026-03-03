package com.legostory.mobile.core.constants

import org.junit.Test
import org.junit.Assert.*

class RoleTypesTest {
    
    @Test
    fun `test All list is not empty`() {
        assertTrue("RoleTypes list should not be empty", RoleTypes.All.isNotEmpty())
    }
    
    @Test
    fun `test All list contains expected types`() {
        val types = RoleTypes.All
        assertTrue("Should contain protagonist", types.any { it.value == "protagonist" })
        assertTrue("Should contain supporting", types.any { it.value == "supporting" })
        assertTrue("Should contain antagonist", types.any { it.value == "antagonist" })
        assertTrue("Should contain bystander", types.any { it.value == "bystander" })
    }
    
    @Test
    fun `test getByValue with valid value returns correct type`() {
        val roleType = RoleTypes.getByValue("protagonist")
        assertNotNull("Should return protagonist type", roleType)
        assertEquals("Value should match", "protagonist", roleType?.value)
        assertEquals("Label should contain protagonist", "⭐ 主角", roleType?.label)
    }
    
    @Test
    fun `test getByValue with invalid value returns null`() {
        val roleType = RoleTypes.getByValue("nonexistent")
        assertNull("Should return null for invalid value", roleType)
    }
    
    @Test
    fun `test getLabel with valid value returns correct label`() {
        val label = RoleTypes.getLabel("antagonist")
        assertEquals("Label should match", "👿 反派", label)
    }
    
    @Test
    fun `test getLabel with invalid value returns the value itself`() {
        val label = RoleTypes.getLabel("unknown")
        assertEquals("Should return the value itself", "unknown", label)
    }
    
    @Test
    fun `test All list has correct size`() {
        assertEquals("RoleTypes list should have 4 items", 4, RoleTypes.All.size)
    }
}
