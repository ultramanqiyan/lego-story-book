package com.legostory.mobile.ui.components.story

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.ui.theme.*

data class StageCharacter(
    val id: String,
    val name: String,
    val emoji: String,
    val position: StagePosition,
    val scale: Float = 1f
)

data class StagePosition(
    val x: Float,
    val y: Float
)

data class StageBackground(
    val name: String,
    val gradientColors: List<Color>,
    val elements: List<StageElement> = emptyList()
)

data class StageElement(
    val emoji: String,
    val position: StagePosition,
    val size: Float = 1f
)

@Composable
fun StagePreview(
    modifier: Modifier = Modifier,
    characters: List<StageCharacter> = emptyList(),
    background: StageBackground = StageBackground(
        name = "默认背景",
        gradientColors = listOf(LegoBlue, LegoRed)
    ),
    title: String = "",
    description: String = "",
    isPlaying: Boolean = false,
    onCharacterTap: (StageCharacter) -> Unit = {},
    onEditBackground: () -> Unit = {}
) {
    var animationProgress by remember { mutableFloatStateOf(0f) }
    
    val infiniteTransition = rememberInfiniteTransition(label = "stage")
    
    val floatingAnimation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "floating"
    )
    
    Card(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(16f / 9f),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.Transparent),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = background.gradientColors
                    )
                )
        ) {
            background.elements.forEach { element ->
                Text(
                    text = element.emoji,
                    fontSize = (24 * element.size).sp,
                    modifier = Modifier
                        .align(Alignment.Center)
                        .offset(
                            x = (element.position.x * 200).dp,
                            y = (element.position.y * 100).dp
                        )
                )
            }
            
            characters.forEach { character ->
                val floatOffset = if (isPlaying) {
                    kotlin.math.sin(floatingAnimation * kotlin.math.PI * 2 + character.position.x * 3).toFloat() * 5f
                } else 0f
                
                CharacterOnStage(
                    character = character,
                    floatOffset = floatOffset,
                    onClick = { onCharacterTap(character) }
                )
            }
            
            if (title.isNotEmpty()) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 16.dp)
                        .background(
                            Color.Black.copy(alpha = 0.5f),
                            RoundedCornerShape(8.dp)
                        )
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = title,
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp
                    )
                }
            }
            
            IconButton(
                onClick = onEditBackground,
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp)
                    .background(
                        Color.White.copy(alpha = 0.3f),
                        RoundedCornerShape(50)
                    )
            ) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "编辑背景",
                    tint = Color.White
                )
            }
            
            if (description.isNotEmpty()) {
                Box(
                    modifier = Modifier
                        .align(Alignment.BottomCenter)
                        .padding(bottom = 16.dp)
                        .fillMaxWidth()
                        .background(
                            Color.Black.copy(alpha = 0.5f)
                        )
                        .padding(12.dp)
                ) {
                    Text(
                        text = description,
                        color = Color.White,
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center,
                        maxLines = 2
                    )
                }
            }
        }
    }
}

@Composable
private fun CharacterOnStage(
    character: StageCharacter,
    floatOffset: Float,
    onClick: () -> Unit
) {
    val scale by animateFloatAsState(
        targetValue = character.scale,
        animationSpec = spring(stiffness = Spring.StiffnessLow),
        label = "scale"
    )
    
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .offset(
                x = (character.position.x * 300).dp,
                y = (character.position.y * 150).dp + floatOffset.dp
            )
            .scale(scale)
            .clip(RoundedCornerShape(8.dp))
            .background(
                Color.White.copy(alpha = 0.2f),
                RoundedCornerShape(8.dp)
            )
            .padding(8.dp)
    ) {
        Text(
            text = character.emoji,
            fontSize = 32.sp
        )
        if (character.name.isNotEmpty()) {
            Text(
                text = character.name,
                fontSize = 10.sp,
                color = Color.White
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StagePreviewCompact(
    modifier: Modifier = Modifier,
    title: String,
    characterCount: Int,
    backgroundName: String,
    onClick: () -> Unit = {}
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(80.dp),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        onClick = onClick
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(
                        Brush.linearGradient(
                            colors = listOf(LegoRed, LegoYellow)
                        ),
                        RoundedCornerShape(8.dp)
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "🎭", fontSize = 24.sp)
            }
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "$characterCount 角色",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                    Text(
                        text = " • ",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                    Text(
                        text = backgroundName,
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }
            }
            
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = Color.Gray
            )
        }
    }
}

val DefaultBackgrounds = listOf(
    StageBackground(
        name = "森林",
        gradientColors = listOf(Color(0xFF2E7D32), Color(0xFF1B5E20)),
        elements = listOf(
            StageElement("🌲", StagePosition(-0.3f, -0.2f), 1.5f),
            StageElement("🌳", StagePosition(0.3f, -0.15f), 1.3f),
            StageElement("🌿", StagePosition(-0.1f, 0.3f), 0.8f)
        )
    ),
    StageBackground(
        name = "海洋",
        gradientColors = listOf(Color(0xFF0288D1), Color(0xFF01579B)),
        elements = listOf(
            StageElement("🌊", StagePosition(0f, 0.2f), 1.2f),
            StageElement("🐠", StagePosition(0.3f, 0f), 0.8f),
            StageElement("🐟", StagePosition(-0.2f, 0.1f), 0.7f)
        )
    ),
    StageBackground(
        name = "城堡",
        gradientColors = listOf(Color(0xFF5D4037), Color(0xFF3E2723)),
        elements = listOf(
            StageElement("🏰", StagePosition(0f, -0.1f), 2f),
            StageElement("👑", StagePosition(0.2f, -0.3f), 0.6f)
        )
    ),
    StageBackground(
        name = "太空",
        gradientColors = listOf(Color(0xFF1A237E), Color(0xFF0D47A1)),
        elements = listOf(
            StageElement("🚀", StagePosition(0.3f, -0.2f), 1f),
            StageElement("⭐", StagePosition(-0.3f, -0.3f), 0.5f),
            StageElement("🌟", StagePosition(0.1f, -0.25f), 0.4f),
            StageElement("🌙", StagePosition(-0.2f, -0.15f), 0.8f)
        )
    ),
    StageBackground(
        name = "火山",
        gradientColors = listOf(Color(0xFFFF5722), Color(0xFFBF360C)),
        elements = listOf(
            StageElement("🌋", StagePosition(0f, 0.1f), 1.5f),
            StageElement("🔥", StagePosition(-0.2f, -0.1f), 0.8f),
            StageElement("🔥", StagePosition(0.2f, -0.15f), 0.7f)
        )
    )
)
