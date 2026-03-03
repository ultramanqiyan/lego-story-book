package com.legostory.mobile.ui.screens.loading

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.ui.theme.*
import kotlinx.coroutines.delay

@Composable
fun LoadingScreen(
    onLoadingComplete: () -> Unit = {},
    minimumLoadingTimeMs: Long = 2000
) {
    var progress by remember { mutableFloatStateOf(0f) }
    var loadingText by remember { mutableStateOf("正在加载...") }
    
    val loadingTexts = listOf(
        "正在加载...",
        "准备故事世界...",
        "加载角色数据...",
        "准备冒险旅程...",
        "即将开始..."
    )
    
    val infiniteTransition = rememberInfiniteTransition(label = "loading")
    
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotation"
    )
    
    val scale by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.2f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )
    
    val gradientOffset by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(3000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "gradient"
    )
    
    LaunchedEffect(key1 = true) {
        val startTime = System.currentTimeMillis()
        var textIndex = 0
        
        while (progress < 1f) {
            delay(50)
            progress += 0.02f
            
            if (progress >= textIndex * 0.2f && textIndex < loadingTexts.size) {
                loadingText = loadingTexts[textIndex]
                textIndex++
            }
        }
        
        val elapsed = System.currentTimeMillis() - startTime
        if (elapsed < minimumLoadingTimeMs) {
            delay(minimumLoadingTimeMs - elapsed)
        }
        
        onLoadingComplete()
    }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        LegoRed.copy(alpha = 0.8f),
                        LegoYellow.copy(alpha = 0.6f),
                        LegoBlue.copy(alpha = 0.8f)
                    ),
                    startY = gradientOffset * 1000f,
                    endY = gradientOffset * 1000f + 2000f
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "🧱",
                fontSize = 80.sp,
                modifier = Modifier
                    .rotate(rotation)
                    .scale(scale)
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            Text(
                text = "乐高故事书",
                fontSize = 36.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "Lego Story Book",
                fontSize = 18.sp,
                color = Color.White.copy(alpha = 0.8f)
            )
            
            Spacer(modifier = Modifier.height(48.dp))
            
            LinearProgressIndicator(
                progress = progress,
                modifier = Modifier
                    .width(200.dp)
                    .height(4.dp),
                color = Color.White,
                trackColor = Color.White.copy(alpha = 0.3f),
                strokeCap = StrokeCap.Round
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = loadingText,
                fontSize = 14.sp,
                color = Color.White.copy(alpha = 0.7f),
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "${(progress * 100).toInt()}%",
                fontSize = 12.sp,
                color = Color.White.copy(alpha = 0.5f)
            )
        }
    }
}
