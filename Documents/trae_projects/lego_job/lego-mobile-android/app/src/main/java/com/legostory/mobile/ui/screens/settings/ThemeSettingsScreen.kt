package com.legostory.mobile.ui.screens.settings

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.core.constants.*
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*
import com.legostory.mobile.ui.theme.ThemeManager
import kotlinx.coroutines.launch
import androidx.compose.runtime.rememberCoroutineScope

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ThemeSettingsScreen(
    themeManager: ThemeManager,
    onBack: () -> Unit
) {
    val currentTheme by themeManager.currentTheme.collectAsState(initial = Themes.DEFAULT)
    val card2DStyle by themeManager.card2DStyle.collectAsState(initial = "classic")
    val card3DStyle by themeManager.card3DStyle.collectAsState(initial = "flip")
    val particleEffect by themeManager.particleEffect.collectAsState(initial = "none")
    val weatherEffect by themeManager.weatherEffect.collectAsState(initial = "none")
    val fontSize by themeManager.fontSize.collectAsState(initial = 16)
    val coroutineScope = rememberCoroutineScope()

    var showResetConfirm by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("主题设置") },
                navigationIcon = {
                    LegoBackButton(onClick = onBack)
                },
                actions = {
                    TextButton(onClick = { showResetConfirm = true }) {
                        Text("重置")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Theme Selection
            SettingsSection(title = "主题风格") {
                Themes.ALL_THEMES.forEach { theme ->
                    ThemeOptionItem(
                        theme = theme,
                        displayName = Themes.getDisplayName(theme),
                        isSelected = currentTheme == theme,
                        onClick = {
                            coroutineScope.launch {
                                themeManager.setTheme(theme)
                            }
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Card Style Selection
            SettingsSection(title = "卡牌样式") {
                Text(
                    text = "2D 风格",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )
                Card2DStyles.ALL_STYLES.forEach { style ->
                    StyleOptionItem(
                        style = style,
                        displayName = getCard2DStyleName(style),
                        isSelected = card2DStyle == style,
                        onClick = {
                            coroutineScope.launch {
                                themeManager.setCard2DStyle(style)
                            }
                        }
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "3D 效果",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )
                Card3DStyles.ALL_STYLES.forEach { style ->
                    StyleOptionItem(
                        style = style,
                        displayName = getCard3DStyleName(style),
                        isSelected = card3DStyle == style,
                        onClick = {
                            coroutineScope.launch {
                                themeManager.setCard3DStyle(style)
                            }
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Effects Selection
            SettingsSection(title = "特效") {
                Text(
                    text = "粒子效果",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )
                ParticleEffects.ALL_EFFECTS.forEach { effect ->
                    EffectOptionItem(
                        effect = effect,
                        displayName = getParticleEffectName(effect),
                        isSelected = particleEffect == effect,
                        onClick = {
                            coroutineScope.launch {
                                themeManager.setParticleEffect(effect)
                            }
                        }
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "天气效果",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
                )
                WeatherEffects.ALL_EFFECTS.forEach { effect ->
                    EffectOptionItem(
                        effect = effect,
                        displayName = getWeatherEffectName(effect),
                        isSelected = weatherEffect == effect,
                        onClick = {
                            coroutineScope.launch {
                                themeManager.setWeatherEffect(effect)
                            }
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Font Size
            SettingsSection(title = "字体大小") {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "${fontSize}sp",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Slider(
                        value = fontSize.toFloat(),
                        onValueChange = {
                            coroutineScope.launch {
                                themeManager.setFontSize(it.toInt())
                            }
                        },
                        valueRange = 12f..24f,
                        steps = 11
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("小", fontSize = 12.sp)
                        Text("中", fontSize = 16.sp)
                        Text("大", fontSize = 20.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Preview
            AnimationUtils.FadeInAnimation(visible = true) {
                LegoCard(
                    modifier = Modifier.fillMaxWidth(),
                    variant = CardVariant.PRIMARY
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text(
                            text = "预览",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "这是一个预览文本",
                            fontSize = fontSize.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "当前主题: ${Themes.getDisplayName(currentTheme)}",
                            fontSize = 14.sp
                        )
                    }
                }
            }
        }
    }

    // Reset Confirmation
    if (showResetConfirm) {
        ConfirmModal(
            visible = true,
            onDismiss = { showResetConfirm = false },
            onConfirm = {
                coroutineScope.launch {
                    themeManager.resetToDefaults()
                }
                showResetConfirm = false
            },
            title = "重置主题",
            message = "确定要重置所有主题设置吗？"
        )
    }
}

@Composable
private fun ThemeOptionItem(
    theme: String,
    displayName: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    val icon = when (theme) {
        Themes.DEFAULT -> "🧱"
        Themes.IMMERSIVE -> "📖"
        Themes.GAMIFIED -> "🎮"
        else -> "🎨"
    }

    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        color = if (isSelected) {
            MaterialTheme.colorScheme.primaryContainer
        } else {
            MaterialTheme.colorScheme.surface
        }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = icon,
                fontSize = 32.sp
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = displayName,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
            }
            if (isSelected) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@Composable
private fun StyleOptionItem(
    style: String,
    displayName: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        color = if (isSelected) {
            MaterialTheme.colorScheme.secondaryContainer
        } else {
            MaterialTheme.colorScheme.surface
        }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = displayName,
                fontSize = 14.sp,
                modifier = Modifier.weight(1f)
            )
            if (isSelected) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.secondary,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

@Composable
private fun EffectOptionItem(
    effect: String,
    displayName: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        color = if (isSelected) {
            MaterialTheme.colorScheme.tertiaryContainer
        } else {
            MaterialTheme.colorScheme.surface
        }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = displayName,
                fontSize = 14.sp,
                modifier = Modifier.weight(1f)
            )
            if (isSelected) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.tertiary,
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
}

private fun getCard2DStyleName(style: String): String {
    return when (style) {
        Card2DStyles.CLASSIC -> "经典"
        Card2DStyles.MODERN -> "现代"
        Card2DStyles.MINIMAL -> "简约"
        Card2DStyles.COLORFUL -> "多彩"
        Card2DStyles.DARK -> "深色"
        else -> style
    }
}

private fun getCard3DStyleName(style: String): String {
    return when (style) {
        Card3DStyles.FLIP -> "翻转"
        Card3DStyles.ROTATE -> "旋转"
        Card3DStyles.STACK -> "堆叠"
        Card3DStyles.FAN -> "扇形"
        Card3DStyles.CAROUSEL -> "轮播"
        else -> style
    }
}

private fun getParticleEffectName(effect: String): String {
    return when (effect) {
        ParticleEffects.NONE -> "无"
        ParticleEffects.SNOW -> "雪花"
        ParticleEffects.RAIN -> "雨滴"
        ParticleEffects.STARS -> "星星"
        ParticleEffects.BUBBLES -> "气泡"
        else -> effect
    }
}

private fun getWeatherEffectName(effect: String): String {
    return when (effect) {
        WeatherEffects.NONE -> "无"
        WeatherEffects.SUNNY -> "晴天"
        WeatherEffects.CLOUDY -> "多云"
        WeatherEffects.RAINY -> "雨天"
        WeatherEffects.STORMY -> "暴风雨"
        else -> effect
    }
}
