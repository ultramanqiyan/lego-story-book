package com.legostory.mobile.ui.theme

import android.content.Context
import com.legostory.mobile.core.constants.Themes
import com.legostory.mobile.data.storage.StorageManager
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.first

class ThemeManager(context: Context) {
    
    private val storageManager = StorageManager(context)
    
    private val _currentTheme = MutableStateFlow(Themes.DEFAULT)
    val currentTheme: Flow<String> = _currentTheme.asStateFlow()
    
    private val _card2DStyle = MutableStateFlow("classic")
    val card2DStyle: Flow<String> = _card2DStyle.asStateFlow()
    
    private val _card3DStyle = MutableStateFlow("flip")
    val card3DStyle: Flow<String> = _card3DStyle.asStateFlow()
    
    private val _particleEffect = MutableStateFlow("none")
    val particleEffect: Flow<String> = _particleEffect.asStateFlow()
    
    private val _weatherEffect = MutableStateFlow("none")
    val weatherEffect: Flow<String> = _weatherEffect.asStateFlow()
    
    private val _fontSize = MutableStateFlow(16)
    val fontSize: Flow<Int> = _fontSize.asStateFlow()
    
    suspend fun loadSavedTheme() {
        storageManager.getTheme()?.let { _currentTheme.value = it }
        storageManager.getCard2DStyle()?.let { _card2DStyle.value = it }
        storageManager.getCard3DStyle()?.let { _card3DStyle.value = it }
        storageManager.getParticleEffect()?.let { _particleEffect.value = it }
        storageManager.getWeatherEffect()?.let { _weatherEffect.value = it }
        _fontSize.value = storageManager.getFontSize()
    }
    
    suspend fun setTheme(theme: String) {
        _currentTheme.value = theme
        storageManager.setTheme(theme)
    }
    
    suspend fun setCard2DStyle(style: String) {
        _card2DStyle.value = style
        storageManager.setCard2DStyle(style)
    }
    
    suspend fun setCard3DStyle(style: String) {
        _card3DStyle.value = style
        storageManager.setCard3DStyle(style)
    }
    
    suspend fun setParticleEffect(effect: String) {
        _particleEffect.value = effect
        storageManager.setParticleEffect(effect)
    }
    
    suspend fun setWeatherEffect(effect: String) {
        _weatherEffect.value = effect
        storageManager.setWeatherEffect(effect)
    }
    
    suspend fun setFontSize(size: Int) {
        _fontSize.value = size
        storageManager.setFontSize(size)
    }
    
    suspend fun resetToDefaults() {
        setTheme(Themes.DEFAULT)
        setCard2DStyle("classic")
        setCard3DStyle("flip")
        setParticleEffect("none")
        setWeatherEffect("none")
        setFontSize(16)
    }
    
    suspend fun isImmersiveTheme(): Boolean {
        return _currentTheme.first() == Themes.IMMERSIVE
    }
    
    suspend fun isGamifiedTheme(): Boolean {
        return _currentTheme.first() == Themes.GAMIFIED
    }
}
