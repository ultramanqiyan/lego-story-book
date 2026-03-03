package com.legostory.mobile.core.model

import org.junit.Test
import org.junit.Assert.*

class UserResponseTest {
    
    @Test
    fun `test UserResponse with all fields`() {
        val user = UserResponse(
            userId = "user-123",
            username = "TestUser",
            email = "test@example.com",
            createdAt = "2024-01-01"
        )
        assertEquals("UserId should match", "user-123", user.userId)
        assertEquals("Username should match", "TestUser", user.username)
        assertEquals("Email should match", "test@example.com", user.email)
        assertEquals("CreatedAt should match", "2024-01-01", user.createdAt)
    }
    
    @Test
    fun `test UserResponse with null fields`() {
        val user = UserResponse(
            userId = "user-456",
            username = "TestUser2",
            email = null,
            createdAt = null
        )
        assertEquals("UserId should match", "user-456", user.userId)
        assertNull("Email should be null", user.email)
        assertNull("CreatedAt should be null", user.createdAt)
    }
}

class MessageResponseTest {
    
    @Test
    fun `test MessageResponse with message`() {
        val response = MessageResponse(message = "Operation successful")
        assertEquals("Message should match", "Operation successful", response.message)
    }
}

class CreateBookResponseTest {
    
    @Test
    fun `test CreateBookResponse with all fields`() {
        val response = CreateBookResponse(
            bookId = "book-123",
            message = "Book created successfully"
        )
        assertEquals("BookId should match", "book-123", response.bookId)
        assertEquals("Message should match", "Book created successfully", response.message)
    }
}

class CreateCharacterResponseTest {
    
    @Test
    fun `test CreateCharacterResponse with all fields`() {
        val response = CreateCharacterResponse(
            characterId = "char-123",
            message = "Character created successfully"
        )
        assertEquals("CharacterId should match", "char-123", response.characterId)
        assertEquals("Message should match", "Character created successfully", response.message)
    }
}

class CreateChapterResponseTest {
    
    @Test
    fun `test CreateChapterResponse with all fields`() {
        val response = CreateChapterResponse(
            chapterId = "ch-123",
            chapterNumber = 1,
            message = "Chapter created successfully"
        )
        assertEquals("ChapterId should match", "ch-123", response.chapterId)
        assertEquals("ChapterNumber should match", 1, response.chapterNumber)
        assertEquals("Message should match", "Chapter created successfully", response.message)
    }
}

class GenerateChapterResponseTest {
    
    @Test
    fun `test GenerateChapterResponse with all fields`() {
        val response = GenerateChapterResponse(
            chapterId = "ch-456",
            chapterNumber = 2,
            title = "The Adventure Begins",
            hasPuzzle = true,
            prompt = "What will happen next?",
            message = "Chapter generated successfully"
        )
        assertEquals("ChapterId should match", "ch-456", response.chapterId)
        assertEquals("ChapterNumber should match", 2, response.chapterNumber)
        assertEquals("Title should match", "The Adventure Begins", response.title)
        assertTrue("HasPuzzle should be true", response.hasPuzzle)
        assertEquals("Prompt should match", "What will happen next?", response.prompt)
    }
    
    @Test
    fun `test GenerateChapterResponse with null prompt`() {
        val response = GenerateChapterResponse(
            chapterId = "ch-789",
            chapterNumber = 3,
            title = "The Journey Continues",
            hasPuzzle = false,
            prompt = null,
            message = "Chapter generated"
        )
        assertFalse("HasPuzzle should be false", response.hasPuzzle)
        assertNull("Prompt should be null", response.prompt)
    }
}

class ChapterNavigationTest {
    
    @Test
    fun `test ChapterNavigation with all fields`() {
        val navigation = ChapterNavigation(
            prev = "ch-1",
            next = "ch-3",
            total = 10,
            current = 2
        )
        assertEquals("Prev should match", "ch-1", navigation.prev)
        assertEquals("Next should match", "ch-3", navigation.next)
        assertEquals("Total should match", 10, navigation.total)
        assertEquals("Current should match", 2, navigation.current)
    }
    
    @Test
    fun `test ChapterNavigation with null prev and next`() {
        val navigation = ChapterNavigation(
            prev = null,
            next = null,
            total = 1,
            current = 1
        )
        assertNull("Prev should be null", navigation.prev)
        assertNull("Next should be null", navigation.next)
    }
}

class SubmitPuzzleResponseTest {
    
    @Test
    fun `test SubmitPuzzleResponse correct answer`() {
        val response = SubmitPuzzleResponse(
            isCorrect = true,
            message = "Correct!",
            hint = null,
            attempts = 1
        )
        assertTrue("IsCorrect should be true", response.isCorrect)
        assertEquals("Message should match", "Correct!", response.message)
        assertNull("Hint should be null", response.hint)
        assertEquals("Attempts should match", 1, response.attempts)
    }
    
    @Test
    fun `test SubmitPuzzleResponse wrong answer`() {
        val response = SubmitPuzzleResponse(
            isCorrect = false,
            message = "Try again!",
            hint = "Think about the color",
            attempts = 2
        )
        assertFalse("IsCorrect should be false", response.isCorrect)
        assertNotNull("Hint should not be null", response.hint)
    }
}

class ShareResponseTest {
    
    @Test
    fun `test ShareResponse with all fields`() {
        val response = ShareResponse(
            shareCode = "ABC123",
            message = "Share link created"
        )
        assertEquals("ShareCode should match", "ABC123", response.shareCode)
        assertEquals("Message should match", "Share link created", response.message)
    }
}

class ShareDetailResponseTest {
    
    @Test
    fun `test ShareDetailResponse with all fields`() {
        val response = ShareDetailResponse(
            bookId = "book-123",
            title = "My Story",
            chapters = listOf(
                Chapter(title = "Chapter 1", content = "Content 1"),
                Chapter(title = "Chapter 2", content = "Content 2")
            )
        )
        assertEquals("BookId should match", "book-123", response.bookId)
        assertEquals("Title should match", "My Story", response.title)
        assertEquals("Chapters should have 2 items", 2, response.chapters.size)
    }
}
