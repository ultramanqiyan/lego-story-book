package com.legostory.mobile.data.model

import com.legostory.mobile.core.model.Chapter
import org.junit.Test
import org.junit.Assert.*

class ChapterTest {

    @Test
    fun `test resolveChapterId with chapterId`() {
        val chapter = Chapter(chapterId = "123", title = "Test", content = "Content")
        assertEquals("123", chapter.resolveChapterId())
    }

    @Test
    fun `test resolveChapterId with chapter_id`() {
        val chapter = Chapter(chapter_id = "456", title = "Test", content = "Content")
        assertEquals("456", chapter.resolveChapterId())
    }

    @Test
    fun `test resolveChapterId with id`() {
        val chapter = Chapter(id = "789", title = "Test", content = "Content")
        assertEquals("789", chapter.resolveChapterId())
    }

    @Test
    fun `test resolveChapterId returns empty when all null`() {
        val chapter = Chapter(title = "Test", content = "Content")
        assertEquals("", chapter.resolveChapterId())
    }

    @Test
    fun `test resolveChapterNumber with chapterNumber`() {
        val chapter = Chapter(title = "Test", content = "Content", chapterNumber = 5)
        assertEquals(5, chapter.resolveChapterNumber())
    }

    @Test
    fun `test resolveChapterNumber with chapter_number`() {
        val chapter = Chapter(title = "Test", content = "Content", chapter_number = 10)
        assertEquals(10, chapter.resolveChapterNumber())
    }

    @Test
    fun `test resolveChapterNumber returns 1 when all null`() {
        val chapter = Chapter(title = "Test", content = "Content")
        assertEquals(1, chapter.resolveChapterNumber())
    }

    @Test
    fun `test resolveHasPuzzle with hasPuzzle true`() {
        val chapter = Chapter(title = "Test", content = "Content", hasPuzzle = true)
        assertTrue(chapter.resolveHasPuzzle())
    }

    @Test
    fun `test resolveHasPuzzle with has_puzzle true`() {
        val chapter = Chapter(title = "Test", content = "Content", has_puzzle = true)
        assertTrue(chapter.resolveHasPuzzle())
    }

    @Test
    fun `test resolveHasPuzzle returns false when all null`() {
        val chapter = Chapter(title = "Test", content = "Content")
        assertFalse(chapter.resolveHasPuzzle())
    }

    @Test
    fun `test resolveWordCount with wordCount`() {
        val chapter = Chapter(title = "Test", content = "Content", wordCount = 100)
        assertEquals(100, chapter.resolveWordCount())
    }

    @Test
    fun `test resolveWordCount with word_count`() {
        val chapter = Chapter(title = "Test", content = "Content", word_count = 200)
        assertEquals(200, chapter.resolveWordCount())
    }

    @Test
    fun `test resolveWordCount returns 0 when all null`() {
        val chapter = Chapter(title = "Test", content = "Content")
        assertEquals(0, chapter.resolveWordCount())
    }
}
