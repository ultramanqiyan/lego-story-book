package com.legostory.mobile.ui.theme

import androidx.compose.ui.graphics.Color

object RarityColors {
    val Common = Color(0xFF9E9E9E)
    val Uncommon = Color(0xFF4CAF50)
    val Rare = Color(0xFF2196F3)
    val Epic = Color(0xFF9C27B0)
    val Legendary = Color(0xFFFF9800)
    
    fun fromName(name: String): Color = when (name.lowercase()) {
        "common", "普通" -> Common
        "uncommon", "优秀" -> Uncommon
        "rare", "稀有" -> Rare
        "epic", "史诗" -> Epic
        "legendary", "传说" -> Legendary
        else -> Common
    }
}

object CharacterTypeColors {
    val Hero = Color(0xFFE3000B)
    val Villain = Color(0xFF8B008B)
    val Sidekick = Color(0xFF00A651)
    val Mentor = Color(0xFFFFD700)
    val Creature = Color(0xFF0055BF)
    
    fun fromName(name: String): Color = when (name.lowercase()) {
        "hero", "主角" -> Hero
        "villain", "反派" -> Villain
        "sidekick", "伙伴" -> Sidekick
        "mentor", "导师" -> Mentor
        "creature", "生物" -> Creature
        else -> Hero
    }
}

object GradientPresets {
    val Primary = listOf(
        Color(0xFFE3000B),
        Color(0xFFFF6B00)
    )
    
    val Secondary = listOf(
        Color(0xFF0055BF),
        Color(0xFF00A651)
    )
    
    val Success = listOf(
        Color(0xFF00A651),
        Color(0xFF4CAF50)
    )
    
    val Warning = listOf(
        Color(0xFFFFD700),
        Color(0xFFFF6B00)
    )
    
    val Danger = listOf(
        Color(0xFFE3000B),
        Color(0xFF8B008B)
    )
    
    val Magic = listOf(
        Color(0xFF8B008B),
        Color(0xFF0055BF),
        Color(0xFF00A651)
    )
    
    val Sunset = listOf(
        Color(0xFFFF6B00),
        Color(0xFFFFD700),
        Color(0xFFE3000B)
    )
    
    val Ocean = listOf(
        Color(0xFF0055BF),
        Color(0xFF00A651),
        Color(0xFF00CED1)
    )
    
    val Forest = listOf(
        Color(0xFF00A651),
        Color(0xFF228B22),
        Color(0xFF2E8B57)
    )
    
    val Galaxy = listOf(
        Color(0xFF1A1A2E),
        Color(0xFF16213E),
        Color(0xFF0F3460),
        Color(0xFF8B008B)
    )
}

object ShadowPresets {
    data class ShadowConfig(
        val offsetX: Float = 0f,
        val offsetY: Float = 4f,
        val blur: Float = 8f,
        val color: Color = Color.Black.copy(alpha = 0.15f)
    )
    
    val Small = ShadowConfig(
        offsetY = 1f,
        blur = 3f,
        color = Color.Black.copy(alpha = 0.1f)
    )
    
    val Medium = ShadowConfig(
        offsetY = 4f,
        blur = 6f,
        color = Color.Black.copy(alpha = 0.15f)
    )
    
    val Large = ShadowConfig(
        offsetY = 10f,
        blur = 15f,
        color = Color.Black.copy(alpha = 0.2f)
    )
    
    val Glow = ShadowConfig(
        offsetY = 0f,
        blur = 20f,
        color = Color.White.copy(alpha = 0.3f)
    )
    
    val MagicGlow = ShadowConfig(
        offsetY = 0f,
        blur = 30f,
        color = Color(0xFF8B008B).copy(alpha = 0.4f)
    )
    
    val Card = ShadowConfig(
        offsetY = 2f,
        blur = 4f,
        color = Color.Black.copy(alpha = 0.12f)
    )
    
    val Button = ShadowConfig(
        offsetY = 1f,
        blur = 3f,
        color = Color.Black.copy(alpha = 0.1f)
    )
}
