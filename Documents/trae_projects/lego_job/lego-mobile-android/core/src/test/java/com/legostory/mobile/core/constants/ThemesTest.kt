package com.legostory.mobile.core.constants

import org.junit.Test
import org.junit.Assert.*

class ThemesTest {

    @Test
    fun `test default theme exists`() {
        assertEquals("default", Themes.DEFAULT)
    }

    @Test
    fun `test immersive theme exists`() {
        assertEquals("immersive", Themes.IMMERSIVE)
    }

    @Test
    fun `test gamified theme exists`() {
        assertEquals("gamified", Themes.GAMIFIED)
    }

    @Test
    fun `test all themes list contains all themes`() {
        assertEquals(3, Themes.ALL_THEMES.size)
        assertTrue(Themes.ALL_THEMES.contains(Themes.DEFAULT))
        assertTrue(Themes.ALL_THEMES.contains(Themes.IMMERSIVE))
        assertTrue(Themes.ALL_THEMES.contains(Themes.GAMIFIED))
    }

    @Test
    fun `test theme display names`() {
        assertEquals("经典乐高", Themes.getDisplayName(Themes.DEFAULT))
        assertEquals("沉浸故事", Themes.getDisplayName(Themes.IMMERSIVE))
        assertEquals("游戏冒险", Themes.getDisplayName(Themes.GAMIFIED))
    }

    @Test
    fun `test card 2D styles`() {
        assertEquals(5, Card2DStyles.ALL_STYLES.size)
        assertEquals("classic", Card2DStyles.CLASSIC)
        assertEquals("modern", Card2DStyles.MODERN)
        assertEquals("minimal", Card2DStyles.MINIMAL)
        assertEquals("colorful", Card2DStyles.COLORFUL)
        assertEquals("dark", Card2DStyles.DARK)
    }

    @Test
    fun `test card 3D styles`() {
        assertEquals(5, Card3DStyles.ALL_STYLES.size)
        assertEquals("flip", Card3DStyles.FLIP)
        assertEquals("rotate", Card3DStyles.ROTATE)
        assertEquals("stack", Card3DStyles.STACK)
        assertEquals("fan", Card3DStyles.FAN)
        assertEquals("carousel", Card3DStyles.CAROUSEL)
    }

    @Test
    fun `test particle effects`() {
        assertEquals(5, ParticleEffects.ALL_EFFECTS.size)
        assertEquals("none", ParticleEffects.NONE)
        assertEquals("snow", ParticleEffects.SNOW)
        assertEquals("rain", ParticleEffects.RAIN)
        assertEquals("stars", ParticleEffects.STARS)
        assertEquals("bubbles", ParticleEffects.BUBBLES)
    }

    @Test
    fun `test weather effects`() {
        assertEquals(5, WeatherEffects.ALL_EFFECTS.size)
        assertEquals("none", WeatherEffects.NONE)
        assertEquals("sunny", WeatherEffects.SUNNY)
        assertEquals("cloudy", WeatherEffects.CLOUDY)
        assertEquals("rainy", WeatherEffects.RAINY)
        assertEquals("stormy", WeatherEffects.STORMY)
    }
}
