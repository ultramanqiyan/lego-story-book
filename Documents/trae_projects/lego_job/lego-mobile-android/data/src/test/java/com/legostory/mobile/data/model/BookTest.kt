package com.legostory.mobile.data.model

import com.legostory.mobile.core.model.Book
import org.junit.Test
import org.junit.Assert.*

class BookTest {

    @Test
    fun `test resolveBookId with bookId`() {
        val book = Book(bookId = "123", title = "Test")
        assertEquals("123", book.resolveBookId())
    }

    @Test
    fun `test resolveBookId with book_id`() {
        val book = Book(book_id = "456", title = "Test")
        assertEquals("456", book.resolveBookId())
    }

    @Test
    fun `test resolveBookId with id`() {
        val book = Book(id = "789", title = "Test")
        assertEquals("789", book.resolveBookId())
    }

    @Test
    fun `test resolveBookId returns empty when all null`() {
        val book = Book(title = "Test")
        assertEquals("", book.resolveBookId())
    }

    @Test
    fun `test resolveChapterCount with chapterCount`() {
        val book = Book(title = "Test", chapterCount = 5)
        assertEquals(5, book.resolveChapterCount())
    }

    @Test
    fun `test resolveChapterCount with chapter_count`() {
        val book = Book(title = "Test", chapter_count = 10)
        assertEquals(10, book.resolveChapterCount())
    }

    @Test
    fun `test resolveChapterCount returns 0 when all null`() {
        val book = Book(title = "Test")
        assertEquals(0, book.resolveChapterCount())
    }
}
