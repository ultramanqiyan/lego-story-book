package com.legostory.mobile.ui.screens.story

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.core.constants.Themes
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*
import kotlinx.coroutines.launch
import kotlinx.coroutines.delay
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.CoroutineScope

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StoryCreateScreen(
    onBack: () -> Unit,
    onComplete: (String) -> Unit
) {
    var currentStep by remember { mutableStateOf(0) }
    var storyTitle by remember { mutableStateOf("") }
    var selectedTheme by remember { mutableStateOf(Themes.DEFAULT) }
    var selectedCharacters by remember { mutableStateOf<List<String>>(emptyList()) }
    var storyDescription by remember { mutableStateOf("") }
    var isCreating by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    val steps = listOf("基本信息", "选择主题", "选择角色", "确认创建")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("创建新故事") },
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
        ) {
            // Step Indicator
            StepIndicator(
                steps = steps,
                currentStep = currentStep
            )

            // Content
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            ) {
                when (currentStep) {
                    0 -> BasicInfoStep(
                        title = storyTitle,
                        onTitleChange = { storyTitle = it },
                        description = storyDescription,
                        onDescriptionChange = { storyDescription = it }
                    )
                    1 -> ThemeSelectionStep(
                        selectedTheme = selectedTheme,
                        onThemeSelected = { selectedTheme = it }
                    )
                    2 -> CharacterSelectionStep(
                        selectedCharacters = selectedCharacters,
                        onCharactersChanged = { selectedCharacters = it }
                    )
                    3 -> ConfirmStep(
                        title = storyTitle,
                        theme = selectedTheme,
                        characterCount = selectedCharacters.size,
                        isCreating = isCreating
                    )
                }
            }

            // Navigation Buttons
            StepNavigation(
                currentStep = currentStep,
                totalSteps = steps.size,
                canProceed = when (currentStep) {
                    0 -> storyTitle.isNotBlank()
                    1 -> true
                    2 -> true
                    3 -> !isCreating
                    else -> true
                },
                onPrevious = { currentStep-- },
                onNext = {
                    if (currentStep < steps.size - 1) {
                        currentStep++
                    } else {
                        isCreating = true
                        coroutineScope.launch {
                            delay(2000)
                            onComplete("new-book-id")
                        }
                    }
                }
            )
        }
    }
}

@Composable
private fun StepIndicator(
    steps: List<String>,
    currentStep: Int
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 2.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            steps.forEachIndexed { index, step ->
                val isActive = index == currentStep
                val isCompleted = index < currentStep

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.weight(1f)
                ) {
                    Surface(
                        shape = MaterialTheme.shapes.small,
                        color = when {
                            isActive -> MaterialTheme.colorScheme.primary
                            isCompleted -> MaterialTheme.colorScheme.primaryContainer
                            else -> MaterialTheme.colorScheme.surfaceVariant
                        },
                        modifier = Modifier.size(32.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            if (isCompleted) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = MaterialTheme.colorScheme.onPrimaryContainer,
                                    modifier = Modifier.size(20.dp)
                                )
                            } else {
                                Text(
                                    text = "${index + 1}",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = if (isActive) {
                                        MaterialTheme.colorScheme.onPrimary
                                    } else {
                                        MaterialTheme.colorScheme.onSurfaceVariant
                                    }
                                )
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = step,
                        fontSize = 12.sp,
                        color = if (isActive) {
                            MaterialTheme.colorScheme.primary
                        } else {
                            MaterialTheme.colorScheme.onSurfaceVariant
                        }
                    )
                }

                if (index < steps.size - 1) {
                    Box(
                        modifier = Modifier
                            .weight(0.5f)
                            .padding(top = 16.dp)
                    ) {
                        Divider(
                            color = if (isCompleted) {
                                MaterialTheme.colorScheme.primary
                            } else {
                                MaterialTheme.colorScheme.surfaceVariant
                            }
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun BasicInfoStep(
    title: String,
    onTitleChange: (String) -> Unit,
    description: String,
    onDescriptionChange: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        AnimationUtils.FadeInAnimation(visible = true) {
            Text(
                text = "让我们开始创建你的故事",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "首先，给你的故事起个名字",
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Story Title
        OutlinedTextField(
            value = title,
            onValueChange = onTitleChange,
            label = { Text("故事标题 *") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            leadingIcon = {
                Icon(Icons.Default.Book, null)
            }
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Story Description
        OutlinedTextField(
            value = description,
            onValueChange = onDescriptionChange,
            label = { Text("故事简介 (可选)") },
            modifier = Modifier.fillMaxWidth(),
            minLines = 3,
            maxLines = 5,
            leadingIcon = {
                Icon(Icons.Default.Description, null)
            }
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Tips
        LegoCard(
            variant = CardVariant.FILLED,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "💡 小贴士",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "• 标题要简洁有趣\n• 可以简单描述故事的主要内容\n• 随时可以在设置中修改这些信息",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun ThemeSelectionStep(
    selectedTheme: String,
    onThemeSelected: (String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "选择故事主题",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "这将决定你的故事的视觉风格",
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Theme Options
        ThemeOption(
            title = "经典乐高",
            description = "传统的乐高积木风格，色彩鲜艳",
            icon = "🧱",
            isSelected = selectedTheme == Themes.DEFAULT,
            onClick = { onThemeSelected(Themes.DEFAULT) }
        )

        Spacer(modifier = Modifier.height(12.dp))

        ThemeOption(
            title = "沉浸故事",
            description = "沉浸式的阅读体验，柔和色调",
            icon = "📖",
            isSelected = selectedTheme == Themes.IMMERSIVE,
            onClick = { onThemeSelected(Themes.IMMERSIVE) }
        )

        Spacer(modifier = Modifier.height(12.dp))

        ThemeOption(
            title = "游戏冒险",
            description = "游戏化的冒险风格，充满活力",
            icon = "🎮",
            isSelected = selectedTheme == Themes.GAMIFIED,
            onClick = { onThemeSelected(Themes.GAMIFIED) }
        )
    }
}

@Composable
private fun ThemeOption(
    title: String,
    description: String,
    icon: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    LegoSelectableCard(
        selected = isSelected,
        onSelect = onClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = icon,
                fontSize = 40.sp
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = description,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            if (isSelected) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}

@Composable
private fun CharacterSelectionStep(
    selectedCharacters: List<String>,
    onCharactersChanged: (List<String>) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text(
            text = "选择故事角色",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = "选择要参与这个故事的角色",
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Empty State
        if (selectedCharacters.isEmpty()) {
            EmptyState(
                icon = "🧸",
                title = "还没有选择角色",
                description = "你可以稍后添加角色",
                actionText = "创建新角色",
                onAction = { }
            )
        } else {
            Text(
                text = "已选择 ${selectedCharacters.size} 个角色",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(16.dp))

            // Selected Characters List
            selectedCharacters.forEach { characterId ->
                LegoCard(
                    modifier = Modifier.fillMaxWidth(),
                    variant = CardVariant.ELEVATED
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "🧸",
                            fontSize = 32.sp
                        )
                        Spacer(modifier = Modifier.width(16.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "角色 $characterId",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        LegoIconButton(
                            icon = Icons.Default.Close,
                            onClick = {
                                onCharactersChanged(selectedCharacters - characterId)
                            },
                            variant = ButtonVariant.GHOST
                        )
                    }
                }
                Spacer(modifier = Modifier.height(8.dp))
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        LegoButton(
            title = "添加角色",
            onClick = { onCharactersChanged(selectedCharacters + "character-${selectedCharacters.size + 1}") },
            modifier = Modifier.fillMaxWidth(),
            variant = ButtonVariant.OUTLINE,
            icon = Icons.Default.Add
        )
    }
}

@Composable
private fun ConfirmStep(
    title: String,
    theme: String,
    characterCount: Int,
    isCreating: Boolean
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        if (isCreating) {
            Spacer(modifier = Modifier.height(64.dp))
            CircularProgressIndicator(
                modifier = Modifier.size(64.dp)
            )
            Spacer(modifier = Modifier.height(24.dp))
            Text(
                text = "正在创建故事...",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
        } else {
            AnimationUtils.ScaleAnimation(visible = true) {
                Text(
                    text = "✨",
                    fontSize = 80.sp
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text(
                text = "准备创建",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = "确认以下信息",
                fontSize = 16.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Summary Card
            LegoCard(
                modifier = Modifier.fillMaxWidth(),
                variant = CardVariant.FILLED
            ) {
                Column(modifier = Modifier.padding(24.dp)) {
                    SummaryItem(label = "故事标题", value = title)
                    Divider(modifier = Modifier.padding(vertical = 12.dp))
                    SummaryItem(
                        label = "主题风格",
                        value = when (theme) {
                            Themes.DEFAULT -> "经典乐高"
                            Themes.IMMERSIVE -> "沉浸故事"
                            Themes.GAMIFIED -> "游戏冒险"
                            else -> "经典乐高"
                        }
                    )
                    Divider(modifier = Modifier.padding(vertical = 12.dp))
                    SummaryItem(label = "角色数量", value = "$characterCount 个")
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Text(
                text = "点击下一步开始创建你的故事！",
                fontSize = 16.sp,
                color = MaterialTheme.colorScheme.primary,
                textAlign = TextAlign.Center
            )
        }
    }
}

@Composable
private fun SummaryItem(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            fontSize = 16.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
private fun StepNavigation(
    currentStep: Int,
    totalSteps: Int,
    canProceed: Boolean,
    onPrevious: () -> Unit,
    onNext: () -> Unit
) {
    Surface(
        color = MaterialTheme.colorScheme.surface,
        tonalElevation = 3.dp
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            LegoButton(
                title = "上一步",
                onClick = onPrevious,
                variant = ButtonVariant.OUTLINE,
                icon = Icons.AutoMirrored.Filled.ArrowBack,
                enabled = currentStep > 0
            )

            Text(
                text = "${currentStep + 1} / $totalSteps",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )

            LegoButton(
                title = if (currentStep == totalSteps - 1) "创建" else "下一步",
                onClick = onNext,
                icon = if (currentStep == totalSteps - 1) Icons.Default.Check else Icons.AutoMirrored.Filled.ArrowForward,
                iconPosition = IconPosition.END,
                enabled = canProceed
            )
        }
    }
}
