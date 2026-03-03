package com.legostory.mobile.data.model

import com.legostory.mobile.core.model.BookCharacter
import org.junit.Test
import org.junit.Assert.*

class BookCharacterTest {

    @Test
    fun `test resolveId with id`() {
        val bookCharacter = BookCharacter(id = "123", name = "Test")
        assertEquals("123", bookCharacter.resolveId())
    }

    @Test
    fun `test resolveId with bookCharacterId`() {
        val bookCharacter = BookCharacter(bookCharacterId = "456", name = "Test")
        assertEquals("456", bookCharacter.resolveId())
    }

    @Test
    fun `test resolveId returns empty when all null`() {
        val bookCharacter = BookCharacter(name = "Test")
        assertEquals("", bookCharacter.resolveId())
    }

    @Test
    fun `test resolveCustomName with customName`() {
        val bookCharacter = BookCharacter(name = "Original", customName = "Custom")
        assertEquals("Custom", bookCharacter.resolveCustomName())
    }

    @Test
    fun `test resolveCustomName with custom_name`() {
        val bookCharacter = BookCharacter(name = "Original", custom_name = "Custom2")
        assertEquals("Custom2", bookCharacter.resolveCustomName())
    }

    @Test
    fun `test resolveCustomName falls back to name`() {
        val bookCharacter = BookCharacter(name = "Original")
        assertEquals("Original", bookCharacter.resolveCustomName())
    }

    @Test
    fun `test resolveCustomName returns empty when all null`() {
        val bookCharacter = BookCharacter()
        assertEquals("", bookCharacter.resolveCustomName())
    }

    @Test
    fun `test resolveRoleType with roleType`() {
        val bookCharacter = BookCharacter(name = "Test", roleType = "protagonist")
        assertEquals("protagonist", bookCharacter.resolveRoleType())
    }

    @Test
    fun `test resolveRoleType with role_type`() {
        val bookCharacter = BookCharacter(name = "Test", role_type = "antagonist")
        assertEquals("antagonist", bookCharacter.resolveRoleType())
    }

    @Test
    fun `test resolveRoleType returns supporting when all null`() {
        val bookCharacter = BookCharacter(name = "Test")
        assertEquals("supporting", bookCharacter.resolveRoleType())
    }
}
