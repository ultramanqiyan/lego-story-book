package com.legostory.mobile

import androidx.test.ext.junit.runners.AndroidJUnit4
import kotlinx.coroutines.runBlocking
import org.junit.Test
import org.junit.runner.RunWith
import org.junit.Assert.*
import com.legostory.mobile.data.api.ApiClient
import com.legostory.mobile.core.model.*
import com.google.gson.reflect.TypeToken

@RunWith(AndroidJUnit4::class)
class E2EFunctionalityTest {

    private val apiClient = ApiClient(baseUrl = "http://10.0.2.2:8788/api")

    @Test
    fun testLoginFunctionality() = runBlocking {
        val response = apiClient.post<User>(
            "/users",
            mapOf<String, Any>(
                "username" to "testuser_${System.currentTimeMillis()}"
            ),
            object : TypeToken<User>() {}
        )
        
        assertNotNull("Login response should not be null", response)
        assertNotNull("User ID should not be null", response.userId)
    }

    @Test
    fun testCharacterListLoading() = runBlocking {
        val response = apiClient.get<CharacterListResponse>(
            "/characters",
            object : TypeToken<CharacterListResponse>() {}
        )
        
        assertNotNull("Character list response should not be null", response)
        assertNotNull("Characters list should not be null", response.characters)
    }

    @Test
    fun testBookListLoading() = runBlocking {
        val response = apiClient.get<BookListResponse>(
            "/books?userId=test-user",
            object : TypeToken<BookListResponse>() {}
        )
        
        assertNotNull("Book list response should not be null", response)
        assertNotNull("Books list should not be null", response.books)
    }

    @Test
    fun testCreateCharacter() = runBlocking {
        val response = apiClient.post<CreateCharacterResponse>(
            "/characters",
            CreateCharacterRequest(
                name = "TestChar${System.currentTimeMillis()}".take(15),
                personality = "勇敢",
                creatorId = "test-user"
            ),
            object : TypeToken<CreateCharacterResponse>() {}
        )
        
        assertNotNull("Character creation response should not be null", response)
        assertNotNull("Character ID should not be null", response.characterId)
    }

    @Test
    fun testCreateBook() = runBlocking {
        val response = apiClient.post<CreateBookResponse>(
            "/books",
            mapOf<String, Any>(
                "title" to "TestBook_${System.currentTimeMillis()}",
                "theme" to "adventure",
                "creatorId" to "test-user"
            ),
            object : TypeToken<CreateBookResponse>() {}
        )
        
        assertNotNull("Book creation response should not be null", response)
        assertNotNull("Book ID should not be null", response.bookId)
    }
}
