package com.legostory.mobile.ui.components.effects

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlin.math.sin
import kotlin.random.Random

enum class WeatherType {
    SUNNY, RAINY, SNOWY, CLOUDY, FOGGY, STORMY
}

data class WeatherConfig(
    val type: WeatherType,
    val intensity: Float = 1f,
    val speed: Float = 1f
)

@Composable
fun WeatherEffect(
    modifier: Modifier = Modifier,
    weatherType: WeatherType = WeatherType.SUNNY,
    intensity: Float = 1f,
    isPlaying: Boolean = true
) {
    when (weatherType) {
        WeatherType.SUNNY -> SunnyEffect(modifier, intensity, isPlaying)
        WeatherType.RAINY -> RainyEffect(modifier, intensity, isPlaying)
        WeatherType.SNOWY -> SnowyEffect(modifier, intensity, isPlaying)
        WeatherType.CLOUDY -> CloudyEffect(modifier, intensity, isPlaying)
        WeatherType.FOGGY -> FoggyEffect(modifier, intensity, isPlaying)
        WeatherType.STORMY -> StormyEffect(modifier, intensity, isPlaying)
    }
}

@Composable
private fun SunnyEffect(
    modifier: Modifier,
    intensity: Float,
    isPlaying: Boolean
) {
    val infiniteTransition = rememberInfiniteTransition(label = "sunny")
    
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(20000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotation"
    )
    
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.9f,
        targetValue = 1.1f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )
    
    Box(modifier = modifier) {
        Canvas(
            modifier = Modifier.fillMaxSize()
        ) {
            val centerX = size.width * 0.8f
            val centerY = size.height * 0.2f
            val sunRadius = size.minDimension * 0.15f * intensity
            
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        Color(0xFFFFF59D),
                        Color(0xFFFFEB3B),
                        Color(0xFFFFC107)
                    ),
                    center = Offset(centerX, centerY),
                    radius = sunRadius * scale
                ),
                radius = sunRadius * scale,
                center = Offset(centerX, centerY)
            )
            
            for (i in 0 until 8) {
                val angle = (rotation + i * 45) * kotlin.math.PI / 180
                val startX = centerX + kotlin.math.cos(angle).toFloat() * sunRadius * 1.2f
                val startY = centerY + kotlin.math.sin(angle).toFloat() * sunRadius * 1.2f
                val endX = centerX + kotlin.math.cos(angle).toFloat() * sunRadius * 2f
                val endY = centerY + kotlin.math.sin(angle).toFloat() * sunRadius * 2f
                
                drawLine(
                    color = Color(0xFFFFEB3B).copy(alpha = 0.6f),
                    start = Offset(startX, startY),
                    end = Offset(endX, endY),
                    strokeWidth = 4f * intensity
                )
            }
        }
    }
}

@Composable
private fun RainyEffect(
    modifier: Modifier,
    intensity: Float,
    isPlaying: Boolean
) {
    val rainDrops = remember { mutableStateListOf<RainDrop>() }
    
    LaunchedEffect(isPlaying) {
        if (isPlaying) {
            while (true) {
                rainDrops.add(
                    RainDrop(
                        x = Random.nextFloat(),
                        y = -0.1f,
                        speed = 0.02f + Random.nextFloat() * 0.03f,
                        length = 10 + Random.nextInt(20)
                    )
                )
                delay((50 / intensity).toLong())
                
                rainDrops.removeAll { it.y > 1.1f }
                rainDrops.forEach { it.y += it.speed * intensity }
            }
        }
    }
    
    Box(modifier = modifier) {
        Canvas(
            modifier = Modifier.fillMaxSize()
        ) {
            rainDrops.forEach { drop ->
                drawLine(
                    color = Color(0xFF64B5F6).copy(alpha = 0.6f),
                    start = Offset(
                        drop.x * size.width,
                        drop.y * size.height
                    ),
                    end = Offset(
                        drop.x * size.width + 2,
                        drop.y * size.height + drop.length
                    ),
                    strokeWidth = 2f
                )
            }
        }
    }
}

private data class RainDrop(
    val x: Float,
    var y: Float,
    val speed: Float,
    val length: Int
)

@Composable
private fun SnowyEffect(
    modifier: Modifier,
    intensity: Float,
    isPlaying: Boolean
) {
    val snowflakes = remember { mutableStateListOf<Snowflake>() }
    
    LaunchedEffect(isPlaying) {
        if (isPlaying) {
            while (true) {
                snowflakes.add(
                    Snowflake(
                        x = Random.nextFloat(),
                        y = -0.1f,
                        speed = 0.005f + Random.nextFloat() * 0.01f,
                        size = 4 + Random.nextInt(8),
                        wobble = Random.nextFloat() * 2 * kotlin.math.PI.toFloat()
                    )
                )
                delay((100 / intensity).toLong())
                
                snowflakes.removeAll { it.y > 1.1f }
                snowflakes.forEach { 
                    it.y += it.speed * intensity
                    it.wobble += 0.1f
                }
            }
        }
    }
    
    Box(modifier = modifier) {
        Canvas(
            modifier = Modifier.fillMaxSize()
        ) {
            snowflakes.forEach { flake ->
                val wobbleX = sin(flake.wobble.toDouble()).toFloat() * 10
                drawCircle(
                    color = Color.White.copy(alpha = 0.8f),
                    radius = flake.size.toFloat(),
                    center = Offset(
                        flake.x * size.width + wobbleX,
                        flake.y * size.height
                    )
                )
            }
        }
    }
}

private data class Snowflake(
    val x: Float,
    var y: Float,
    val speed: Float,
    val size: Int,
    var wobble: Float
)

@Composable
private fun CloudyEffect(
    modifier: Modifier,
    intensity: Float,
    isPlaying: Boolean
) {
    val clouds = remember { 
        mutableStateListOf(
            Cloud(0.1f, 0.1f, 0.3f),
            Cloud(0.5f, 0.2f, 0.4f),
            Cloud(0.8f, 0.15f, 0.35f)
        )
    }
    
    LaunchedEffect(isPlaying) {
        if (isPlaying) {
            while (true) {
                clouds.forEach { cloud ->
                    cloud.x += 0.001f * intensity
                    if (cloud.x > 1.2f) {
                        cloud.x = -0.2f
                    }
                }
                delay(50)
            }
        }
    }
    
    Box(modifier = modifier) {
        Canvas(
            modifier = Modifier.fillMaxSize()
        ) {
            clouds.forEach { cloud ->
                drawCloud(
                    x = cloud.x * size.width,
                    y = cloud.y * size.height,
                    scale = cloud.scale * intensity
                )
            }
        }
    }
}

private fun DrawScope.drawCloud(x: Float, y: Float, scale: Float) {
    val baseSize = 40.dp.toPx() * scale
    
    drawCircle(
        color = Color.White.copy(alpha = 0.8f),
        radius = baseSize,
        center = Offset(x, y)
    )
    drawCircle(
        color = Color.White.copy(alpha = 0.8f),
        radius = baseSize * 0.8f,
        center = Offset(x - baseSize * 0.7f, y + baseSize * 0.2f)
    )
    drawCircle(
        color = Color.White.copy(alpha = 0.8f),
        radius = baseSize * 0.9f,
        center = Offset(x + baseSize * 0.6f, y + baseSize * 0.1f)
    )
}

private data class Cloud(
    var x: Float,
    val y: Float,
    val scale: Float
)

@Composable
private fun FoggyEffect(
    modifier: Modifier,
    intensity: Float,
    isPlaying: Boolean
) {
    val infiniteTransition = rememberInfiniteTransition(label = "fog")
    
    val offset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(10000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "offset"
    )
    
    Box(modifier = modifier) {
        Canvas(
            modifier = Modifier.fillMaxSize()
        ) {
            drawRect(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        Color.White.copy(alpha = 0.1f * intensity),
                        Color.White.copy(alpha = 0.3f * intensity),
                        Color.White.copy(alpha = 0.2f * intensity),
                        Color.White.copy(alpha = 0.05f * intensity)
                    ),
                    startY = offset * size.height * 0.5f,
                    endY = size.height
                )
            )
        }
    }
}

@Composable
private fun StormyEffect(
    modifier: Modifier,
    intensity: Float,
    isPlaying: Boolean
) {
    var showLightning by remember { mutableStateOf(false) }
    
    LaunchedEffect(isPlaying) {
        if (isPlaying) {
            while (true) {
                delay((Random.nextLong(3000) + 2000) / intensity.toLong())
                showLightning = true
                delay(100)
                showLightning = false
                delay(50)
                showLightning = true
                delay(50)
                showLightning = false
            }
        }
    }
    
    Box(modifier = modifier) {
        RainyEffect(
            modifier = Modifier.fillMaxSize(),
            intensity = intensity * 1.5f,
            isPlaying = isPlaying
        )
        
        if (showLightning) {
            Canvas(
                modifier = Modifier.fillMaxSize()
            ) {
                drawRect(
                    color = Color.White.copy(alpha = 0.3f * intensity)
                )
                
                val startX = size.width * 0.3f + Random.nextFloat() * size.width * 0.4f
                drawLightning(startX, 0f, size.height * 0.8f)
            }
        }
    }
}

private fun DrawScope.drawLightning(x: Float, y: Float, height: Float) {
    var currentY = y
    var currentX = x
    val segments = 5
    
    for (i in 0 until segments) {
        val nextY = currentY + height / segments
        val nextX = currentX + (Random.nextFloat() - 0.5f) * 50
        
        drawLine(
            color = Color(0xFFE1F5FE),
            start = Offset(currentX, currentY),
            end = Offset(nextX, nextY),
            strokeWidth = 3f
        )
        
        currentX = nextX
        currentY = nextY
    }
}
