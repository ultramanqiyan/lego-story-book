package com.legostory.mobile.ui.screens.chapter

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
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*
import com.legostory.mobile.ui.viewmodel.ChapterViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChapterScreen(
    viewModel: ChapterViewModel,
    onBack: () -> Unit,
    onNavigateToChapter: (String) -> Unit
) {
    val state by viewModel.state.collectAsState()
    var showPuzzle by remember { mutableStateOf(false) }
    var selectedAnswer by remember { mutableStateOf<String?>(null) }
    var showAnswerResult by remember { mutableStateOf<Boolean?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = state.chapter?.title ?: "章节详情",
                        maxLines = 1
                    )
                },
                navigationIcon = {
                    LegoBackButton(onClick = onBack)
                },
                actions = {
                    if (state.chapter?.resolveHasPuzzle() == true) {
                        LegoIconButton(
                            icon = Icons.Default.Star,
                            onClick = { showPuzzle = true },
                            variant = ButtonVariant.PRIMARY
                        )
                    }
                }
            )
        },
        bottomBar = {
            ChapterBottomBar(
                currentChapter = state.currentChapterIndex,
                totalChapters = state.totalChapters,
                onPrevious = { viewModel.loadPreviousChapter() },
                onNext = { viewModel.loadNextChapter() }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            if (state.isLoading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "加载中...",
                        fontSize = 18.sp,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            } else {
                state.chapter?.let { chapter ->
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .verticalScroll(rememberScrollState())
                            .padding(16.dp)
                    ) {
                        // Chapter Header
                        ChapterHeader(chapter = chapter)

                        Spacer(modifier = Modifier.height(24.dp))

                        // Chapter Content
                        AnimationUtils.FadeInAnimation(visible = true) {
                            Text(
                                text = chapter.content ?: "暂无内容",
                                fontSize = 16.sp,
                                lineHeight = 24.sp,
                                textAlign = TextAlign.Justify
                            )
                        }

                        // Puzzle Button
                        if (chapter.resolveHasPuzzle()) {
                            Spacer(modifier = Modifier.height(32.dp))
                            AnimationUtils.ScaleAnimation(visible = true) {
                                LegoButton(
                                    title = "挑战谜题",
                                    onClick = { showPuzzle = true },
                                    modifier = Modifier.fillMaxWidth(),
                                    variant = ButtonVariant.PRIMARY,
                                    icon = Icons.Default.Star
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(80.dp))
                    }
                }
            }
        }
    }

    // Puzzle Dialog
    if (showPuzzle && state.puzzle != null) {
        PuzzleDialog(
            puzzle = state.puzzle!!,
            selectedAnswer = selectedAnswer,
            onAnswerSelected = { selectedAnswer = it },
            onSubmit = {
                val isCorrect = viewModel.submitPuzzleAnswer(selectedAnswer)
                showAnswerResult = isCorrect
            },
            onDismiss = {
                showPuzzle = false
                selectedAnswer = null
                showAnswerResult = null
            },
            showResult = showAnswerResult
        )
    }
}

@Composable
private fun ChapterHeader(chapter: com.legostory.mobile.core.model.Chapter) {
    LegoCard(
        variant = CardVariant.PRIMARY,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "第 ${chapter.resolveChapterNumber()} 章",
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = chapter.title,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onPrimaryContainer,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "${chapter.resolveWordCount()} 字",
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.5f)
            )
        }
    }
}

@Composable
private fun ChapterBottomBar(
    currentChapter: Int,
    totalChapters: Int,
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
                title = "上一章",
                onClick = onPrevious,
                variant = ButtonVariant.OUTLINE,
                icon = Icons.AutoMirrored.Filled.ArrowBack,
                enabled = currentChapter > 1
            )

            Text(
                text = "$currentChapter / $totalChapters",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )

            LegoButton(
                title = "下一章",
                onClick = onNext,
                variant = ButtonVariant.OUTLINE,
                icon = Icons.AutoMirrored.Filled.ArrowForward,
                iconPosition = IconPosition.END,
                enabled = currentChapter < totalChapters
            )
        }
    }
}

@Composable
private fun PuzzleDialog(
    puzzle: com.legostory.mobile.core.model.Puzzle,
    selectedAnswer: String?,
    onAnswerSelected: (String) -> Unit,
    onSubmit: () -> Unit,
    onDismiss: () -> Unit,
    showResult: Boolean?
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("谜题挑战")
            }
        },
        text = {
            Column {
                Text(
                    text = puzzle.question,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Options
                puzzle.resolveOptionsList().forEach { option ->
                    LegoSelectableCard(
                        selected = selectedAnswer == option,
                        onSelect = { onAnswerSelected(option) },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = option,
                            fontSize = 14.sp,
                            modifier = Modifier.padding(vertical = 8.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                }

                // Result
                showResult?.let { isCorrect ->
                    Spacer(modifier = Modifier.height(16.dp))
                    if (isCorrect) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Check,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "回答正确！",
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    } else {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.error
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "回答错误，再试一次！",
                                color = MaterialTheme.colorScheme.error,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        },
        confirmButton = {
            LegoButton(
                title = "提交答案",
                onClick = onSubmit,
                enabled = selectedAnswer != null && showResult == null
            )
        },
        dismissButton = {
            LegoButton(
                title = "关闭",
                onClick = onDismiss,
                variant = ButtonVariant.GHOST
            )
        }
    )
}
