package com.legostory.mobile.data.api

import com.google.gson.reflect.TypeToken
import com.legostory.mobile.core.model.*

class ChaptersApi(private val apiClient: ApiClient) {
    
    suspend fun getDetail(chapterId: String, userId: String? = null): ChapterDetailResponse {
        val url = "/chapters?id=$chapterId&userId=${userId ?: ""}"
        return apiClient.get(url, object : TypeToken<ChapterDetailResponse>() {})
    }
    
    suspend fun getListByBook(bookId: String, userId: String? = null): ChapterListResponse {
        val url = "/chapters?bookId=$bookId&userId=${userId ?: ""}"
        return apiClient.get(url, object : TypeToken<ChapterListResponse>() {})
    }
    
    suspend fun create(
        bookId: String,
        title: String,
        content: String,
        puzzle: Puzzle? = null
    ): CreateChapterResponse {
        val body = mutableMapOf<String, Any>(
            "bookId" to bookId,
            "title" to title,
            "content" to content
        )
        puzzle?.let { body["puzzle"] = it }
        return apiClient.post("/chapters", body, object : TypeToken<CreateChapterResponse>() {})
    }
    
    suspend fun delete(chapterId: String): MessageResponse {
        return apiClient.delete("/chapters?id=$chapterId", object : TypeToken<MessageResponse>() {})
    }
    
    suspend fun complete(bookId: String, chapterId: String, userId: String): MessageResponse {
        return apiClient.post(
            "/chapters-complete/books/$bookId/chapters/$chapterId",
            mapOf("userId" to userId),
            object : TypeToken<MessageResponse>() {}
        )
    }
    
    suspend fun generate(
        bookId: String,
        userId: String,
        plotSelection: PlotSelection? = null,
        characterIds: List<String>? = null
    ): GenerateChapterResponse {
        val body = mutableMapOf<String, Any>("userId" to userId)
        plotSelection?.let { body["plotSelection"] = it }
        characterIds?.let { body["characterIds"] = it }
        return apiClient.post(
            "/chapters-generate?bookId=$bookId",
            body,
            object : TypeToken<GenerateChapterResponse>() {}
        )
    }
}
