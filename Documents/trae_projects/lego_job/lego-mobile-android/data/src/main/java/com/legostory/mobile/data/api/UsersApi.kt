package com.legostory.mobile.data.api

import com.google.gson.reflect.TypeToken
import com.legostory.mobile.core.model.*

class UsersApi(private val apiClient: ApiClient) {
    
    suspend fun createOrLogin(username: String, email: String? = null): UserResponse {
        val body = mutableMapOf<String, Any>("username" to username)
        email?.let { body["email"] = it }
        
        return apiClient.post("/users", body, object : TypeToken<UserResponse>() {})
    }
    
    suspend fun getUser(userId: String): UserResponse {
        return apiClient.get("/users?userId=$userId", object : TypeToken<UserResponse>() {})
    }
}
