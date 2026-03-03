package com.legostory.mobile.ui.screens.adventure

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdventureScreen(
    onBack: () -> Unit,
    onStartAdventure: (String) -> Unit
) {
    var selectedDifficulty by remember { mutableStateOf("normal") }
    var showStartConfirm by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("冒险模式") },
                navigationIcon = {
                    LegoBackButton(onClick = onBack)
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp)
        ) {
            // Header
            AdventureHeader()

            Spacer(modifier = Modifier.height(24.dp))

            // Difficulty Selection
            Text(
                text = "选择难度",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            DifficultySelector(
                selectedDifficulty = selectedDifficulty,
                onDifficultySelected = { selectedDifficulty = it }
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Adventure List
            Text(
                text = "可用冒险",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            LazyColumn {
                items(getAdventureList()) { adventure ->
                    AdventureCard(
                        adventure = adventure,
                        onClick = { showStartConfirm = true }
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Start Button
            LegoButton(
                title = "开始冒险",
                onClick = { showStartConfirm = true },
                modifier = Modifier.fillMaxWidth(),
                size = ButtonSize.LARGE,
                icon = Icons.Default.PlayArrow
            )
        }
    }

    // Start Confirmation
    if (showStartConfirm) {
        ConfirmModal(
            visible = true,
            onDismiss = { showStartConfirm = false },
            onConfirm = {
                showStartConfirm = false
                onStartAdventure("adventure-1")
            },
            title = "开始冒险",
            message = "准备好开始你的乐高冒险了吗？"
        )
    }
}

@Composable
private fun AdventureHeader() {
    LegoCard(
        variant = CardVariant.PRIMARY,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "🗺️",
                fontSize = 64.sp
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "冒险模式",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "选择你的冒险，开始探索未知的乐高世界！",
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }
    }
}

@Composable
private fun DifficultySelector(
    selectedDifficulty: String,
    onDifficultySelected: (String) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        DifficultyButton(
            difficulty = "easy",
            label = "简单",
            icon = "🌱",
            isSelected = selectedDifficulty == "easy",
            onClick = { onDifficultySelected("easy") },
            modifier = Modifier.weight(1f)
        )
        DifficultyButton(
            difficulty = "normal",
            label = "普通",
            icon = "⚔️",
            isSelected = selectedDifficulty == "normal",
            onClick = { onDifficultySelected("normal") },
            modifier = Modifier.weight(1f)
        )
        DifficultyButton(
            difficulty = "hard",
            label = "困难",
            icon = "🔥",
            isSelected = selectedDifficulty == "hard",
            onClick = { onDifficultySelected("hard") },
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
private fun DifficultyButton(
    difficulty: String,
    label: String,
    icon: String,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    LegoCard(
        onClick = onClick,
        modifier = modifier,
        variant = if (isSelected) CardVariant.PRIMARY else CardVariant.OUTLINE
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = icon,
                fontSize = 32.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = label,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
private fun AdventureCard(
    adventure: Adventure,
    onClick: () -> Unit
) {
    LegoCard(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        variant = CardVariant.ELEVATED
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = MaterialTheme.shapes.medium,
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.size(64.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = adventure.icon,
                        fontSize = 32.sp
                    )
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = adventure.title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = adventure.description,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(8.dp))
                Row {
                    AdventureTag(text = "${adventure.chapters} 章节")
                    Spacer(modifier = Modifier.width(8.dp))
                    AdventureTag(text = adventure.difficulty)
                }
            }

            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun AdventureTag(text: String) {
    Surface(
        shape = MaterialTheme.shapes.small,
        color = MaterialTheme.colorScheme.secondaryContainer
    ) {
        Text(
            text = text,
            fontSize = 12.sp,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            color = MaterialTheme.colorScheme.onSecondaryContainer
        )
    }
}

data class Adventure(
    val id: String,
    val title: String,
    val description: String,
    val icon: String,
    val chapters: Int,
    val difficulty: String
)

private fun getAdventureList(): List<Adventure> {
    return listOf(
        Adventure(
            id = "1",
            title = "城堡探险",
            description = "探索神秘的乐高城堡，解开古老的谜题",
            icon = "🏰",
            chapters = 5,
            difficulty = "简单"
        ),
        Adventure(
            id = "2",
            title = "太空任务",
            description = "驾驶宇宙飞船，探索未知的星球",
            icon = "🚀",
            chapters = 8,
            difficulty = "普通"
        ),
        Adventure(
            id = "3",
            title = "海盗宝藏",
            description = "跟随藏宝图，寻找传说中的海盗宝藏",
            icon = "⚓",
            chapters = 6,
            difficulty = "普通"
        ),
        Adventure(
            id = "4",
            title = "恐龙世界",
            description = "穿越到史前时代，与恐龙一起冒险",
            icon = "🦕",
            chapters = 10,
            difficulty = "困难"
        )
    )
}
