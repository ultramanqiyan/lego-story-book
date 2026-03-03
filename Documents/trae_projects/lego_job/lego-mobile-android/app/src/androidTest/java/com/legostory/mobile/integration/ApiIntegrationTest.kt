package com.legostory.mobile.integration

import kotlinx.coroutines.runBlocking
import org.junit.Before
import org.junit.Test
import org.junit.Assert.*
import com.legostory.mobile.data.api.*
import com.legostory.mobile.core.model.*

class ApiIntegrationTest {
    
    private lateinit var apiClient: ApiClient
    private lateinit var usersApi: UsersApi
    private lateinit var booksApi: BooksApi
    private lateinit var chaptersApi: ChaptersApi
    private lateinit var charactersApi: CharactersApi
    
    @Before
    fun setup() {
        apiClient = ApiClient(baseUrl = "http://10.0.2.2:8788/api")
        usersApi = UsersApi(apiClient)
        booksApi = BooksApi(apiClient)
        chaptersApi = ChaptersApi(apiClient)
        charactersApi = CharactersApi(apiClient)
    }
    
    @Test
    fun testApiClientCreation() = runBlocking {
        assertNotNull("API client should be created", apiClient)
    }
    
    @Test
    fun testUsersApiCreation() = runBlocking {
        assertNotNull("UsersApi should be created", usersApi)
    }
    
    @Test
    fun testBooksApiCreation() = runBlocking {
        assertNotNull("BooksApi should be created", booksApi)
    }
    
    @Test
    fun testChaptersApiCreation() = runBlocking {
        assertNotNull("ChaptersApi should be created", chaptersApi)
    }
    
    @Test
    fun testCharactersApiCreation() = runBlocking {
        assertNotNull("CharactersApi should be created", charactersApi)
    }
    
    @Test
    fun testUserLoginFlow() = runBlocking {
        try {
            val user = usersApi.createOrLogin("test_user_${System.currentTimeMillis()}")
            assertNotNull("User should not be null", user)
            assertNotNull("User ID should not be null", user.userId)
            assertTrue("Username should not be empty", user.username.isNotEmpty())
        } catch (e: Exception) {
            fail("Login should succeed: ${e.message}")
        }
    }
    
    @Test
    fun testGetCharactersList() = runBlocking {
        try {
            val response = charactersApi.getList()
            assertNotNull("Response should not be null", response)
            assertNotNull("Characters list should not be null", response.characters)
        } catch (e: Exception) {
            fail("Get characters should succeed: ${e.message}")
        }
    }
}
