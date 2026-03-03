package com.legostory.mobile.data.api

import com.google.gson.reflect.TypeToken
import com.legostory.mobile.core.model.*

class CharactersApi(private val apiClient: ApiClient) {
    
    suspend fun getList(userId: String? = null): CharacterListResponse {
        val url = if (userId != null) {
            "/characters?userId=$userId"
        } else {
            "/characters"
        }
        return apiClient.get(url, object : TypeToken<CharacterListResponse>() {})
    }
    
    suspend fun create(request: CreateCharacterRequest): CreateCharacterResponse {
        return apiClient.post("/characters", request, object : TypeToken<CreateCharacterResponse>() {})
    }
    
    suspend fun update(request: UpdateCharacterRequest): MessageResponse {
        return apiClient.put("/characters", request, object : TypeToken<MessageResponse>() {})
    }
    
    suspend fun delete(characterId: String, force: Boolean = false): MessageResponse {
        val url = "/characters?id=$characterId&force=$force"
        return apiClient.delete(url, object : TypeToken<MessageResponse>() {})
    }
}
