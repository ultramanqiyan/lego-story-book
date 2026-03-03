package com.legostory.mobile.data.api

import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.util.concurrent.TimeUnit

class ApiClient(
    private val baseUrl: String = "http://10.0.2.2:8788/api"
) {
    private val client = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .writeTimeout(15, TimeUnit.SECONDS)
        .build()
    
    private val gson = Gson()
    private val cache = mutableMapOf<String, CacheEntry>()
    
    companion object {
        private const val CACHE_DURATION = 30000L
    }
    
    data class CacheEntry(
        val data: Any,
        val timestamp: Long
    )
    
    private fun getCacheKey(endpoint: String, body: Any? = null): String {
        return "$endpoint:${body?.let { gson.toJson(it) } ?: ""}"
    }
    
    private fun getCached(key: String): Any? {
        val entry = cache[key]
        return if (entry != null && System.currentTimeMillis() - entry.timestamp < CACHE_DURATION) {
            entry.data
        } else {
            cache.remove(key)
            null
        }
    }
    
    private fun setCache(key: String, data: Any) {
        if (cache.size > 50) {
            cache.remove(cache.keys.first())
        }
        cache[key] = CacheEntry(data, System.currentTimeMillis())
    }
    
    suspend fun <T> get(
        endpoint: String,
        responseType: TypeToken<T>
    ): T = withContext(Dispatchers.IO) {
        val cacheKey = getCacheKey(endpoint)
        getCached(cacheKey)?.let {
            @Suppress("UNCHECKED_CAST")
            return@withContext it as T
        }
        
        val request = Request.Builder()
            .url("$baseUrl$endpoint")
            .get()
            .build()
        
        executeRequest(request, responseType, cacheKey)
    }
    
    suspend fun <T> post(
        endpoint: String,
        body: Any,
        responseType: TypeToken<T>
    ): T = withContext(Dispatchers.IO) {
        val jsonBody = gson.toJson(body)
        val request = Request.Builder()
            .url("$baseUrl$endpoint")
            .post(jsonBody.toRequestBody("application/json".toMediaType()))
            .build()
        
        executeRequest(request, responseType, null)
    }
    
    suspend fun <T> put(
        endpoint: String,
        body: Any,
        responseType: TypeToken<T>
    ): T = withContext(Dispatchers.IO) {
        val jsonBody = gson.toJson(body)
        val request = Request.Builder()
            .url("$baseUrl$endpoint")
            .put(jsonBody.toRequestBody("application/json".toMediaType()))
            .build()
        
        executeRequest(request, responseType, null)
    }
    
    suspend fun <T> delete(
        endpoint: String,
        responseType: TypeToken<T>
    ): T = withContext(Dispatchers.IO) {
        val request = Request.Builder()
            .url("$baseUrl$endpoint")
            .delete()
            .build()
        
        executeRequest(request, responseType, null)
    }
    
    private suspend fun <T> executeRequest(
        request: Request,
        responseType: TypeToken<T>,
        cacheKey: String?
    ): T {
        return try {
            android.util.Log.d("ApiClient", "Request: ${request.url}")
            val response = client.newCall(request).execute()
            val responseBody = response.body?.string()
                ?: throw ApiException("Empty response body")
            
            android.util.Log.d("ApiClient", "Response: code=${response.code}, body=${responseBody.take(500)}")
            
            if (!response.isSuccessful) {
                val errorResponse = try {
                    gson.fromJson<Map<String, Any>>(responseBody, object : TypeToken<Map<String, Any>>() {}.type)
                } catch (e: Exception) {
                    null
                }
                val errorMessage = (errorResponse?.get("error") as? String)
                    ?: (errorResponse?.get("message") as? String)
                    ?: "Request failed with code ${response.code}"
                android.util.Log.e("ApiClient", "Error: $errorMessage")
                throw ApiException(errorMessage)
            }
            
            val data: T = gson.fromJson(responseBody, responseType.type)
            
            cacheKey?.let { setCache(it, data as Any) }
            
            data
        } catch (e: ApiException) {
            throw e
        } catch (e: Exception) {
            android.util.Log.e("ApiClient", "Exception: ${e.message}", e)
            if (e.message?.contains("network", ignoreCase = true) == true ||
                e.message?.contains("failed to connect", ignoreCase = true) == true) {
                throw ApiException("网络连接失败，请检查网络")
            }
            throw ApiException(e.message ?: "Unknown error")
        }
    }
    
    fun clearCache() {
        cache.clear()
    }
}

class ApiException(message: String) : Exception(message)
