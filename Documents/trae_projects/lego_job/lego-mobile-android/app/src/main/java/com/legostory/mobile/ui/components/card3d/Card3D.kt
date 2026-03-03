package com.legostory.mobile.ui.components.card3d

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.ui.theme.*
import kotlin.math.sin
import kotlin.math.cos

data class Card3DData(
    val id: String,
    val title: String,
    val subtitle: String = "",
    val imageUrl: String? = null,
    val backgroundColor: Color = LegoRed,
    val accentColor: Color = LegoYellow,
    val rarity: CardRarity = CardRarity.Common
)

enum class CardRarity {
    Common, Uncommon, Rare, Epic, Legendary
}

fun CardRarity.color(): Color = when (this) {
    CardRarity.Common -> Color(0xFF9E9E9E)
    CardRarity.Uncommon -> Color(0xFF4CAF50)
    CardRarity.Rare -> Color(0xFF2196F3)
    CardRarity.Epic -> Color(0xFF9C27B0)
    CardRarity.Legendary -> Color(0xFFFF9800)
}

@Composable
fun Card3D(
    card: Card3DData,
    modifier: Modifier = Modifier,
    isFlipped: Boolean = false,
    enableTilt: Boolean = true,
    onClick: () -> Unit = {},
    onLongPress: () -> Unit = {}
) {
    var tiltX by remember { mutableFloatStateOf(0f) }
    var tiltY by remember { mutableFloatStateOf(0f) }
    var isPressed by remember { mutableStateOf(false) }
    
    val animatedTiltX by animateFloatAsState(
        targetValue = tiltX,
        animationSpec = spring(stiffness = Spring.StiffnessLow),
        label = "tiltX"
    )
    
    val animatedTiltY by animateFloatAsState(
        targetValue = tiltY,
        animationSpec = spring(stiffness = Spring.StiffnessLow),
        label = "tiltY"
    )
    
    val animatedScale by animateFloatAsState(
        targetValue = if (isPressed) 1.05f else 1f,
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "scale"
    )
    
    val animatedRotationY by animateFloatAsState(
        targetValue = if (isFlipped) 180f else 0f,
        animationSpec = tween(600, easing = FastOutSlowInEasing),
        label = "rotationY"
    )
    
    Box(
        modifier = modifier
            .graphicsLayer(
                scaleX = animatedScale,
                scaleY = animatedScale,
                rotationX = animatedTiltX,
                rotationY = animatedRotationY + animatedTiltY,
                cameraDistance = 12f
            )
            .pointerInput(enableTilt) {
                if (enableTilt) {
                    detectTapGestures(
                        onPress = {
                            isPressed = true
                            tiltX = -5f
                            tryAwaitRelease()
                            isPressed = false
                            tiltX = 0f
                            tiltY = 0f
                        },
                        onTap = { onClick() },
                        onLongPress = { onLongPress() }
                    )
                }
            }
    ) {
        if (animatedRotationY < 90f) {
            CardFront(card = card)
        } else {
            CardBack(card = card)
        }
    }
}

@Composable
private fun CardFront(card: Card3DData) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        shape = MaterialTheme.shapes.large,
        color = card.backgroundColor
    ) {
        Box {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                Text(
                    text = card.title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                
                if (card.subtitle.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = card.subtitle,
                        fontSize = 14.sp,
                        color = Color.White.copy(alpha = 0.8f),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                
                Spacer(modifier = Modifier.weight(1f))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    RarityBadge(rarity = card.rarity)
                }
            }
            
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .align(Alignment.BottomCenter)
                    .graphicsLayer(rotationX = 180f)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.White.copy(alpha = 0.3f),
                                Color.Transparent
                            )
                        )
                    )
            )
        }
    }
}

@Composable
private fun CardBack(card: Card3DData) {
    Surface(
        modifier = Modifier
            .fillMaxSize()
            .graphicsLayer(scaleX = -1f),
        shape = MaterialTheme.shapes.large,
        color = Color(0xFF1A1A2E)
    ) {
        Box(
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "🧱",
                fontSize = 48.sp
            )
        }
    }
}

@Composable
private fun RarityBadge(rarity: CardRarity) {
    Surface(
        shape = MaterialTheme.shapes.small,
        color = rarity.color()
    ) {
        Text(
            text = when (rarity) {
                CardRarity.Common -> "普通"
                CardRarity.Uncommon -> "优秀"
                CardRarity.Rare -> "稀有"
                CardRarity.Epic -> "史诗"
                CardRarity.Legendary -> "传说"
            },
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
    }
}

fun calculateTiltAngle(
    touchX: Float,
    touchY: Float,
    cardWidth: Float,
    cardHeight: Float,
    maxTiltAngle: Float = 15f
): Pair<Float, Float> {
    val centerX = cardWidth / 2
    val centerY = cardHeight / 2
    
    val normalizedX = (touchX - centerX) / centerX
    val normalizedY = (touchY - centerY) / centerY
    
    val tiltY = normalizedX * maxTiltAngle
    val tiltX = -normalizedY * maxTiltAngle
    
    return Pair(tiltX, tiltY)
}

fun calculateFanPosition(
    index: Int,
    totalCards: Int,
    fanAngle: Float = 180f,
    radius: Float = 300f
): FanPosition {
    val angleStep = if (totalCards > 1) fanAngle / (totalCards - 1) else 0f
    val startAngle = -fanAngle / 2
    val angle = startAngle + index * angleStep
    
    val x = radius * sin(Math.toRadians(angle.toDouble())).toFloat()
    val y = radius * (1 - cos(Math.toRadians(angle.toDouble()))).toFloat()
    
    return FanPosition(x = x, y = y, rotation = angle)
}

data class FanPosition(
    val x: Float,
    val y: Float,
    val rotation: Float
)
