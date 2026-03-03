package com.legostory.mobile.core.constants

import org.junit.Test
import org.junit.Assert.*

class CharacterEmojisTest {
    
    @Test
    fun `test Emojis list is not empty`() {
        assertTrue("Emojis list should not be empty", CharacterEmojis.Emojis.isNotEmpty())
    }
    
    @Test
    fun `test Emojis list contains expected emojis`() {
        val emojis = CharacterEmojis.Emojis
        assertTrue("Emojis should contain hero emoji", emojis.contains("🦸"))
        assertTrue("Emojis should contain wizard emoji", emojis.contains("🧙"))
        assertTrue("Emojis should contain elf emoji", emojis.contains("🧝"))
        assertTrue("Emojis should contain princess emoji", emojis.contains("👸"))
    }
    
    @Test
    fun `test get with valid index returns correct emoji`() {
        val emoji = CharacterEmojis.get(0)
        assertEquals("First emoji should be hero", "🦸", emoji)
    }
    
    @Test
    fun `test get with index out of bounds wraps around`() {
        val emoji = CharacterEmojis.get(CharacterEmojis.Emojis.size)
        assertEquals("Should wrap to first emoji", CharacterEmojis.Emojis[0], emoji)
    }
    
    @Test
    fun `test get with negative index wraps around`() {
        val emoji = CharacterEmojis.get(-1)
        assertNotNull("Should return an emoji", emoji)
    }
    
    @Test
    fun `test Emojis list has correct size`() {
        assertEquals("Emojis list should have 12 items", 12, CharacterEmojis.Emojis.size)
    }
}
