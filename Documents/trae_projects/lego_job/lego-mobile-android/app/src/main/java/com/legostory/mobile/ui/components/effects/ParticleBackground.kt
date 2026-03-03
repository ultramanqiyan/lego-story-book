package com.legostory.mobile.ui.components.effects

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.tooling.preview.Preview
import kotlin.random.Random

@Composable
fun ParticleBackground(
    modifier: Modifier = Modifier,
    particleCount: Int = 50,
    particleColor: Color = Color.White.copy(alpha = 0.6f),
    particleSize: Float = 4f,
    speed: Float = 1f
) {
    val infiniteTransition = rememberInfiniteTransition(label = "particle")
    val progress by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "progress"
    )

    val particles = remember {
        List(particleCount) {
            Particle(
                x = Random.nextFloat(),
                y = Random.nextFloat(),
                size = Random.nextFloat() * particleSize + 2f,
                speed = Random.nextFloat() * speed + 0.5f,
                alpha = Random.nextFloat() * 0.5f + 0.3f
            )
        }
    }

    Canvas(modifier = modifier.fillMaxSize()) {
        particles.forEach { particle ->
            val y = (particle.y + progress * particle.speed) % 1f
            drawCircle(
                color = particleColor.copy(alpha = particle.alpha),
                radius = particle.size,
                center = Offset(
                    x = particle.x * size.width,
                    y = y * size.height
                )
            )
        }
    }
}

private data class Particle(
    val x: Float,
    val y: Float,
    val size: Float,
    val speed: Float,
    val alpha: Float
)

@Preview
@Composable
private fun ParticleBackgroundPreview() {
    ParticleBackground()
}
