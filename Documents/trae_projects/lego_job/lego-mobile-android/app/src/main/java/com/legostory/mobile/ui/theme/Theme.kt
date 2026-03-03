package com.legostory.mobile.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = AppColors.LegoYellow,
    onPrimary = AppColors.Text,
    primaryContainer = AppColors.LegoYellow,
    secondary = AppColors.LegoBlue,
    onSecondary = AppColors.White,
    secondaryContainer = AppColors.LegoBlue,
    tertiary = AppColors.LegoGreen,
    onTertiary = AppColors.White,
    background = AppColors.Background,
    onBackground = AppColors.Text,
    surface = AppColors.White,
    onSurface = AppColors.Text,
    error = AppColors.Error,
    onError = AppColors.White
)

@Composable
fun LegoStoryTheme(
    darkTheme: Boolean = false,
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = LightColorScheme
    
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = true
        }
    }
    
    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
