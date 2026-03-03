package com.legostory.mobile.data.model

import com.legostory.mobile.core.model.*
import org.junit.Test
import org.junit.Assert.*

class StoryTest {
    
    @Test
    fun `test PlotOption data class`() {
        val option = PlotOption(
            id = "weather-sunny",
            name = "晴天",
            icon = "☀️"
        )
        assertEquals("ID should match", "weather-sunny", option.id)
        assertEquals("Name should match", "晴天", option.name)
        assertEquals("Icon should match", "☀️", option.icon)
    }
    
    @Test
    fun `test PlotSelection default values`() {
        val selection = PlotSelection()
        assertNull("Weather should be null", selection.weather)
        assertNull("AdventureType should be null", selection.adventureType)
        assertNull("Terrain should be null", selection.terrain)
        assertNull("Equipment should be null", selection.equipment)
    }
    
    @Test
    fun `test PlotSelection with values`() {
        val selection = PlotSelection(
            weather = "sunny",
            adventureType = "adventure",
            terrain = "forest",
            equipment = "wand"
        )
        assertEquals("Weather should match", "sunny", selection.weather)
        assertEquals("AdventureType should match", "adventure", selection.adventureType)
        assertEquals("Terrain should match", "forest", selection.terrain)
        assertEquals("Equipment should match", "wand", selection.equipment)
    }
    
    @Test
    fun `test StoryCharacter data class`() {
        val character = StoryCharacter(
            characterId = "char-001",
            customName = "Hero",
            personality = "Brave",
            speakingStyle = "Formal"
        )
        assertEquals("CharacterId should match", "char-001", character.characterId)
        assertEquals("CustomName should match", "Hero", character.customName)
        assertEquals("Personality should match", "Brave", character.personality)
        assertEquals("SpeakingStyle should match", "Formal", character.speakingStyle)
    }
    
    @Test
    fun `test PreviousPuzzle data class`() {
        val puzzle = PreviousPuzzle(
            question = "What is the answer?",
            answer = "42",
            isCorrect = true
        )
        assertEquals("Question should match", "What is the answer?", puzzle.question)
        assertEquals("Answer should match", "42", puzzle.answer)
        assertTrue("IsCorrect should be true", puzzle.isCorrect)
    }
    
    @Test
    fun `test StoryGenerateRequest data class`() {
        val request = StoryGenerateRequest(
            characters = listOf(StoryCharacter("char-001", "Hero")),
            plot = "adventure",
            previousSummary = "Previous chapter summary",
            forcePuzzle = true
        )
        assertEquals("Characters should have 1 item", 1, request.characters.size)
        assertEquals("Plot should match", "adventure", request.plot)
        assertEquals("PreviousSummary should match", "Previous chapter summary", request.previousSummary)
        assertTrue("ForcePuzzle should be true", request.forcePuzzle!!)
    }
}
