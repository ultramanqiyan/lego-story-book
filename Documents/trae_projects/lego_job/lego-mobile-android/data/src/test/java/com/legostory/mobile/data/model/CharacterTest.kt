package com.legostory.mobile.data.model

import com.legostory.mobile.core.model.Character
import org.junit.Test
import org.junit.Assert.*

class CharacterTest {

    @Test
    fun `test resolveCharacterId with characterId`() {
        val character = Character(characterId = "123", name = "Test")
        assertEquals("123", character.resolveCharacterId())
    }

    @Test
    fun `test resolveCharacterId with character_id`() {
        val character = Character(character_id = "456", name = "Test")
        assertEquals("456", character.resolveCharacterId())
    }

    @Test
    fun `test resolveCharacterId with id`() {
        val character = Character(id = "789", name = "Test")
        assertEquals("789", character.resolveCharacterId())
    }

    @Test
    fun `test resolveCharacterId returns empty when all null`() {
        val character = Character(name = "Test")
        assertEquals("", character.resolveCharacterId())
    }

    @Test
    fun `test resolveSpeakingStyle with speakingStyle`() {
        val character = Character(name = "Test", speakingStyle = "幽默")
        assertEquals("幽默", character.resolveSpeakingStyle())
    }

    @Test
    fun `test resolveSpeakingStyle with speaking_style`() {
        val character = Character(name = "Test", speaking_style = "严肃")
        assertEquals("严肃", character.resolveSpeakingStyle())
    }

    @Test
    fun `test resolveSpeakingStyle returns null when all null`() {
        val character = Character(name = "Test")
        assertNull(character.resolveSpeakingStyle())
    }

    @Test
    fun `test resolveCreatorId with creatorId`() {
        val character = Character(name = "Test", creatorId = "user123")
        assertEquals("user123", character.resolveCreatorId())
    }

    @Test
    fun `test resolveCreatorId with creator_id`() {
        val character = Character(name = "Test", creator_id = "user456")
        assertEquals("user456", character.resolveCreatorId())
    }

    @Test
    fun `test resolveCreatorId returns null when all null`() {
        val character = Character(name = "Test")
        assertNull(character.resolveCreatorId())
    }
}
