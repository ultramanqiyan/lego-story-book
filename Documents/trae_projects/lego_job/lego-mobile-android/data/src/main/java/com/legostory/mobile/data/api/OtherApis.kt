package com.legostory.mobile.data.api

import com.google.gson.reflect.TypeToken
import com.legostory.mobile.core.model.*

class StoryApi(private val apiClient: ApiClient) {
    
    suspend fun generate(request: StoryGenerateRequest): StoryGenerateResponse {
        return apiClient.post("/story", request, object : TypeToken<StoryGenerateResponse>() {})
    }
}

class PuzzleApi(private val apiClient: ApiClient) {
    
    suspend fun submit(puzzleId: String, userId: String?, answer: String): SubmitPuzzleResponse {
        return apiClient.post(
            "/puzzle",
            mapOf(
                "puzzleId" to puzzleId,
                "userId" to (userId ?: ""),
                "answer" to answer
            ),
            object : TypeToken<SubmitPuzzleResponse>() {}
        )
    }
}

class PlotOptionsApi(private val apiClient: ApiClient) {
    
    suspend fun get(): PlotOptionsResponse {
        return apiClient.get("/plot-options", object : TypeToken<PlotOptionsResponse>() {})
    }
}

class ShareApi(private val apiClient: ApiClient) {
    
    suspend fun create(bookId: String, userId: String): ShareResponse {
        return apiClient.post(
            "/share",
            mapOf("bookId" to bookId, "userId" to userId),
            object : TypeToken<ShareResponse>() {}
        )
    }
    
    suspend fun get(shareCode: String): ShareDetailResponse {
        return apiClient.get("/share?code=$shareCode", object : TypeToken<ShareDetailResponse>() {})
    }
}
