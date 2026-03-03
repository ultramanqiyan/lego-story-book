package com.legostory.mobile.data.api

import com.google.gson.reflect.TypeToken
import com.legostory.mobile.core.model.*

class BooksApi(private val apiClient: ApiClient) {
    
    suspend fun getList(userId: String): BookListResponse {
        return apiClient.get("/books?userId=$userId", object : TypeToken<BookListResponse>() {})
    }
    
    suspend fun getDetail(bookId: String, userId: String? = null): BookDetailResponse {
        val url = if (userId != null) {
            "/books?bookId=$bookId&userId=$userId"
        } else {
            "/books?bookId=$bookId"
        }
        return apiClient.get(url, object : TypeToken<BookDetailResponse>() {})
    }
    
    suspend fun create(userId: String, title: String): CreateBookResponse {
        return apiClient.post("/books", mapOf("userId" to userId, "title" to title), 
            object : TypeToken<CreateBookResponse>() {})
    }
    
    suspend fun update(bookId: String, title: String? = null, status: String? = null): MessageResponse {
        val body = mutableMapOf<String, Any>("bookId" to bookId)
        title?.let { body["title"] = it }
        status?.let { body["status"] = it }
        return apiClient.put("/books", body, object : TypeToken<MessageResponse>() {})
    }
    
    suspend fun delete(bookId: String): MessageResponse {
        return apiClient.delete("/books?id=$bookId", object : TypeToken<MessageResponse>() {})
    }
}

class BookCharactersApi(private val apiClient: ApiClient) {
    
    suspend fun getList(bookId: String): BookCharacterListResponse {
        return apiClient.get("/book-characters?bookId=$bookId", 
            object : TypeToken<BookCharacterListResponse>() {})
    }
    
    suspend fun add(
        bookId: String,
        characterId: String,
        customName: String,
        roleType: String? = null
    ): AddBookCharacterResponse {
        val body = mutableMapOf<String, Any>(
            "bookId" to bookId,
            "characterId" to characterId,
            "customName" to customName
        )
        roleType?.let { body["roleType"] = it }
        return apiClient.post("/book-characters", body, 
            object : TypeToken<AddBookCharacterResponse>() {})
    }
    
    suspend fun update(
        id: String,
        customName: String? = null,
        roleType: String? = null
    ): MessageResponse {
        val body = mutableMapOf<String, Any>("id" to id)
        customName?.let { body["customName"] = it }
        roleType?.let { body["roleType"] = it }
        return apiClient.put("/book-characters", body, object : TypeToken<MessageResponse>() {})
    }
    
    suspend fun delete(id: String, force: Boolean = false): DeleteBookCharacterResponse {
        val url = if (force) "/book-characters?id=$id&force=true" else "/book-characters?id=$id"
        return apiClient.delete(url, object : TypeToken<DeleteBookCharacterResponse>() {})
    }
}
