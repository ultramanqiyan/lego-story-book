package com.legostory.mobile.core.constants

object Themes {
    const val DEFAULT = "default"
    const val IMMERSIVE = "immersive"
    const val GAMIFIED = "gamified"

    val ALL_THEMES = listOf(DEFAULT, IMMERSIVE, GAMIFIED)

    fun getDisplayName(theme: String): String {
        return when (theme) {
            DEFAULT -> "经典乐高"
            IMMERSIVE -> "沉浸故事"
            GAMIFIED -> "游戏冒险"
            else -> "经典乐高"
        }
    }
}

object Card2DStyles {
    const val CLASSIC = "classic"
    const val MODERN = "modern"
    const val MINIMAL = "minimal"
    const val COLORFUL = "colorful"
    const val DARK = "dark"

    val ALL_STYLES = listOf(CLASSIC, MODERN, MINIMAL, COLORFUL, DARK)
}

object Card3DStyles {
    const val FLIP = "flip"
    const val ROTATE = "rotate"
    const val STACK = "stack"
    const val FAN = "fan"
    const val CAROUSEL = "carousel"

    val ALL_STYLES = listOf(FLIP, ROTATE, STACK, FAN, CAROUSEL)
}

object ParticleEffects {
    const val NONE = "none"
    const val SNOW = "snow"
    const val RAIN = "rain"
    const val STARS = "stars"
    const val BUBBLES = "bubbles"

    val ALL_EFFECTS = listOf(NONE, SNOW, RAIN, STARS, BUBBLES)
}

object WeatherEffects {
    const val NONE = "none"
    const val SUNNY = "sunny"
    const val CLOUDY = "cloudy"
    const val RAINY = "rainy"
    const val STORMY = "stormy"

    val ALL_EFFECTS = listOf(NONE, SUNNY, CLOUDY, RAINY, STORMY)
}
