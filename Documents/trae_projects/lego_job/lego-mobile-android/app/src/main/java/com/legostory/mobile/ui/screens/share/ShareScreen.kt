package com.legostory.mobile.ui.screens.share

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.ui.theme.*

data class SharePlatform(
    val name: String,
    val icon: ImageVector,
    val color: Color,
    val description: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShareScreen(
    storyId: String? = null,
    storyTitle: String = "我的冒险故事",
    onBack: () -> Unit = {},
    onShareComplete: () -> Unit = {}
) {
    var selectedPlatform by remember { mutableStateOf<SharePlatform?>(null) }
    var showShareDialog by remember { mutableStateOf(false) }
    var shareMessage by remember { mutableStateOf("我刚在乐高故事书中创作了一个精彩的故事！快来看看吧！") }
    
    val platforms = listOf(
        SharePlatform("微信", Icons.Default.Chat, Color(0xFF07C160), "分享到微信好友或朋友圈"),
        SharePlatform("QQ", Icons.Default.Forum, Color(0xFF12B7F5), "分享到QQ好友或空间"),
        SharePlatform("微博", Icons.Default.Public, Color(0xFFE6162D), "分享到新浪微博"),
        SharePlatform("链接", Icons.Default.Link, LegoBlue, "复制链接分享"),
        SharePlatform("保存", Icons.Default.Save, LegoGreen, "保存为图片")
    )
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        text = "分享故事",
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "返回")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = LegoRed,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White
                )
            )
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                SharePreviewCard(
                    storyTitle = storyTitle,
                    modifier = Modifier.fillMaxWidth()
                )
            }
            
            item {
                Text(
                    text = "分享到",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.Black
                )
            }
            
            item {
                PlatformGrid(
                    platforms = platforms,
                    selectedPlatform = selectedPlatform,
                    onPlatformSelect = { platform ->
                        selectedPlatform = platform
                        showShareDialog = true
                    }
                )
            }
            
            item {
                OutlinedTextField(
                    value = shareMessage,
                    onValueChange = { shareMessage = it },
                    label = { Text("分享语") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp),
                    maxLines = 4
                )
            }
            
            item {
                ShareOptions()
            }
        }
    }
    
    if (showShareDialog && selectedPlatform != null) {
        ShareDialog(
            platform = selectedPlatform!!,
            message = shareMessage,
            onDismiss = { showShareDialog = false },
            onShare = {
                showShareDialog = false
                onShareComplete()
            }
        )
    }
}

@Composable
private fun SharePreviewCard(
    storyTitle: String,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.linearGradient(
                        colors = listOf(LegoRed, LegoYellow)
                    )
                )
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "🧱",
                fontSize = 48.sp
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                text = storyTitle,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                textAlign = TextAlign.Center
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "乐高故事书 - 创意故事创作平台",
                fontSize = 14.sp,
                color = Color.White.copy(alpha = 0.8f)
            )
        }
    }
}

@Composable
private fun PlatformGrid(
    platforms: List<SharePlatform>,
    selectedPlatform: SharePlatform?,
    onPlatformSelect: (SharePlatform) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly
    ) {
        platforms.forEach { platform ->
            PlatformItem(
                platform = platform,
                isSelected = selectedPlatform?.name == platform.name,
                onClick = { onPlatformSelect(platform) }
            )
        }
    }
}

@Composable
private fun PlatformItem(
    platform: SharePlatform,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .background(if (isSelected) platform.color.copy(alpha = 0.1f) else Color.Transparent)
            .padding(8.dp)
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .background(platform.color, CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = platform.icon,
                contentDescription = platform.name,
                tint = Color.White,
                modifier = Modifier.size(24.dp)
            )
        }
        
        Spacer(modifier = Modifier.height(4.dp))
        
        Text(
            text = platform.name,
            fontSize = 12.sp,
            color = if (isSelected) platform.color else Color.Gray
        )
    }
}

@Composable
private fun ShareOptions() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "分享设置",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Visibility,
                        contentDescription = null,
                        tint = Color.Gray,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("允许他人查看", fontSize = 14.sp)
                }
                
                var checked by remember { mutableStateOf(true) }
                Switch(
                    checked = checked,
                    onCheckedChange = { checked = it },
                    colors = SwitchDefaults.colors(checkedThumbColor = LegoRed)
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Comment,
                        contentDescription = null,
                        tint = Color.Gray,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("允许评论", fontSize = 14.sp)
                }
                
                var checked by remember { mutableStateOf(true) }
                Switch(
                    checked = checked,
                    onCheckedChange = { checked = it },
                    colors = SwitchDefaults.colors(checkedThumbColor = LegoRed)
                )
            }
        }
    }
}

@Composable
private fun ShareDialog(
    platform: SharePlatform,
    message: String,
    onDismiss: () -> Unit,
    onShare: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("分享到${platform.name}") },
        text = {
            Column {
                Text(
                    text = platform.description,
                    fontSize = 14.sp,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "分享内容:",
                    fontSize = 12.sp,
                    color = Color.Gray
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = message,
                    fontSize = 14.sp
                )
            }
        },
        confirmButton = {
            Button(
                onClick = onShare,
                colors = ButtonDefaults.buttonColors(containerColor = platform.color)
            ) {
                Icon(
                    imageVector = Icons.Default.Share,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("分享")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("取消")
            }
        }
    )
}
