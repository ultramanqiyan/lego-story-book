package com.legostory.mobile.data.storage

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "lego_story_prefs")

class StorageManager(private val context: Context) {
    
    companion object {
        private val USER_ID_KEY = stringPreferencesKey("userId")
        private val USERNAME_KEY = stringPreferencesKey("username")
        private val THEME_KEY = stringPreferencesKey("theme")
        private val FONT_SIZE_KEY = stringPreferencesKey("fontSize")
        private val CARD_2D_STYLE_KEY = stringPreferencesKey("card2DStyle")
        private val CARD_3D_STYLE_KEY = stringPreferencesKey("card3DStyle")
        private val PARTICLE_EFFECT_KEY = stringPreferencesKey("particleEffect")
        private val WEATHER_EFFECT_KEY = stringPreferencesKey("weatherEffect")
    }
    
    suspend fun getUserId(): String? {
        return context.dataStore.data.map { it[USER_ID_KEY] }.first()
    }
    
    suspend fun setUserId(userId: String) {
        context.dataStore.edit { it[USER_ID_KEY] = userId }
    }
    
    suspend fun getUsername(): String? {
        return context.dataStore.data.map { it[USERNAME_KEY] }.first()
    }
    
    suspend fun setUsername(username: String) {
        context.dataStore.edit { it[USERNAME_KEY] = username }
    }
    
    suspend fun getTheme(): String? {
        return context.dataStore.data.map { it[THEME_KEY] }.first()
    }
    
    suspend fun setTheme(theme: String) {
        context.dataStore.edit { it[THEME_KEY] = theme }
    }
    
    suspend fun getFontSize(): Int {
        return context.dataStore.data.map { 
            it[FONT_SIZE_KEY]?.toIntOrNull() ?: 16 
        }.first()
    }
    
    suspend fun setFontSize(size: Int) {
        context.dataStore.edit { it[FONT_SIZE_KEY] = size.toString() }
    }
    
    suspend fun getCard2DStyle(): String? {
        return context.dataStore.data.map { it[CARD_2D_STYLE_KEY] }.first()
    }
    
    suspend fun setCard2DStyle(style: String) {
        context.dataStore.edit { it[CARD_2D_STYLE_KEY] = style }
    }
    
    suspend fun getCard3DStyle(): String? {
        return context.dataStore.data.map { it[CARD_3D_STYLE_KEY] }.first()
    }
    
    suspend fun setCard3DStyle(style: String) {
        context.dataStore.edit { it[CARD_3D_STYLE_KEY] = style }
    }
    
    suspend fun getParticleEffect(): String? {
        return context.dataStore.data.map { it[PARTICLE_EFFECT_KEY] }.first()
    }
    
    suspend fun setParticleEffect(effect: String) {
        context.dataStore.edit { it[PARTICLE_EFFECT_KEY] = effect }
    }
    
    suspend fun getWeatherEffect(): String? {
        return context.dataStore.data.map { it[WEATHER_EFFECT_KEY] }.first()
    }
    
    suspend fun setWeatherEffect(effect: String) {
        context.dataStore.edit { it[WEATHER_EFFECT_KEY] = effect }
    }
    
    suspend fun clearUserData() {
        context.dataStore.edit { 
            it.remove(USER_ID_KEY)
            it.remove(USERNAME_KEY)
        }
    }
    
    suspend fun clearAll() {
        context.dataStore.edit { it.clear() }
    }
}
