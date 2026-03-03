package com.legostory.mobile.data.model

import com.legostory.mobile.core.model.Puzzle
import org.junit.Test
import org.junit.Assert.*

class PuzzleTest {

    @Test
    fun `test resolvePuzzleId with puzzleId`() {
        val puzzle = Puzzle(puzzleId = "123", question = "Test?")
        assertEquals("123", puzzle.resolvePuzzleId())
    }

    @Test
    fun `test resolvePuzzleId with puzzle_id`() {
        val puzzle = Puzzle(puzzle_id = "456", question = "Test?")
        assertEquals("456", puzzle.resolvePuzzleId())
    }

    @Test
    fun `test resolvePuzzleId with id`() {
        val puzzle = Puzzle(id = "789", question = "Test?")
        assertEquals("789", puzzle.resolvePuzzleId())
    }

    @Test
    fun `test resolvePuzzleId returns empty when all null`() {
        val puzzle = Puzzle(question = "Test?")
        assertEquals("", puzzle.resolvePuzzleId())
    }

    @Test
    fun `test resolveOptionsList with valid JSON array`() {
        val puzzle = Puzzle(question = "Test?", options = "[\"A\", \"B\", \"C\"]")
        val options = puzzle.resolveOptionsList()
        assertEquals(3, options.size)
        assertEquals("A", options[0])
        assertEquals("B", options[1])
        assertEquals("C", options[2])
    }

    @Test
    fun `test resolveOptionsList returns empty for invalid JSON`() {
        val puzzle = Puzzle(question = "Test?", options = "invalid json")
        val options = puzzle.resolveOptionsList()
        assertTrue(options.isEmpty())
    }

    @Test
    fun `test resolveOptionsList returns empty for null options`() {
        val puzzle = Puzzle(question = "Test?")
        val options = puzzle.resolveOptionsList()
        assertTrue(options.isEmpty())
    }

    @Test
    fun `test resolveOptionsList returns empty for blank options`() {
        val puzzle = Puzzle(question = "Test?", options = "   ")
        val options = puzzle.resolveOptionsList()
        assertTrue(options.isEmpty())
    }
}
