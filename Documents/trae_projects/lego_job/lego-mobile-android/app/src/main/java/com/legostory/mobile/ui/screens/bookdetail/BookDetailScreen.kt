package com.legostory.mobile.ui.screens.bookdetail

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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.core.model.BookCharacter
import com.legostory.mobile.core.model.Chapter
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*
import com.legostory.mobile.ui.viewmodel.BookDetailViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookDetailScreen(
    viewModel: BookDetailViewModel,
    onBack: () -> Unit,
    onChapterClick: (String) -> Unit,
    onAddChapter: () -> Unit,
    onDeleteBook: (String) -> Unit
) {
    val state by viewModel.state.collectAsState()
    var selectedTab by remember { mutableStateOf(0) }
    var showDeleteConfirm by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        text = state.book?.title ?: "故事详情",
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                },
                navigationIcon = {
                    LegoBackButton(onClick = onBack)
                },
                actions = {
                    LegoIconButton(
                        icon = Icons.Default.Share,
                        onClick = { },
                        variant = ButtonVariant.GHOST
                    )
                    LegoIconButton(
                        icon = Icons.Default.MoreVert,
                        onClick = { showDeleteConfirm = true },
                        variant = ButtonVariant.GHOST
                    )
                }
            )
        },
        floatingActionButton = {
            if (selectedTab == 0) {
                ExtendedFloatingActionButton(
                    onClick = onAddChapter,
                    icon = { Icon(Icons.Default.Add, null) },
                    text = { Text("添加章节") }
                )
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Book Header
            state.book?.let { book ->
                BookHeaderCard(book = book)
            }

            // Tab Row
            TabRow(selectedTabIndex = selectedTab) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("章节") },
                    icon = { Icon(Icons.Default.Book, null) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("角色") },
                    icon = { Icon(Icons.Default.Person, null) }
                )
                Tab(
                    selected = selectedTab == 2,
                    onClick = { selectedTab = 2 },
                    text = { Text("信息") },
                    icon = { Icon(Icons.Default.Info, null) }
                )
            }

            // Content
            when (selectedTab) {
                0 -> ChaptersTab(
                    chapters = state.chapters,
                    onChapterClick = onChapterClick,
                    isLoading = state.isLoading
                )
                1 -> CharactersTab(
                    characters = state.characters,
                    isLoading = state.isLoading
                )
                2 -> InfoTab(book = state.book)
            }
        }
    }

    // Delete Confirmation
    if (showDeleteConfirm) {
        ConfirmModal(
            visible = true,
            onDismiss = { showDeleteConfirm = false },
            onConfirm = {
                showDeleteConfirm = false
                state.book?.let { book ->
                    onDeleteBook(book.resolveBookId())
                }
            },
            title = "删除故事书",
            message = "确定要删除这个故事书吗？此操作无法撤销。"
        )
    }
}

@Composable
private fun BookHeaderCard(book: com.legostory.mobile.core.model.Book) {
    LegoCard(
        variant = CardVariant.PRIMARY,
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                shape = MaterialTheme.shapes.medium,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(80.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = "📖",
                        fontSize = 40.sp
                    )
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = book.title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onPrimaryContainer
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${book.resolveChapterCount()} 章节",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f)
                )
                book.createdAt?.let {
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "创建于: $it",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.5f)
                    )
                }
            }
        }
    }
}

@Composable
private fun ChaptersTab(
    chapters: List<Chapter>,
    onChapterClick: (String) -> Unit,
    isLoading: Boolean
) {
    if (isLoading) {
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
    } else if (chapters.isEmpty()) {
        EmptyState(
            icon = "📖",
            title = "还没有章节",
            description = "点击右下角按钮添加第一个章节",
            actionText = "添加章节",
            onAction = { }
        )
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp)
        ) {
            items(chapters, key = { it.resolveChapterId() }) { chapter ->
                AnimationUtils.SlideInAnimation(
                    visible = true,
                    direction = AnimationUtils.SlideDirection.RIGHT
                ) {
                    ChapterListItem(
                        chapter = chapter,
                        onClick = { onChapterClick(chapter.resolveChapterId()) }
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

@Composable
private fun ChapterListItem(
    chapter: Chapter,
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
                shape = MaterialTheme.shapes.small,
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.size(48.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = "${chapter.resolveChapterNumber()}",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = chapter.title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${chapter.resolveWordCount()} 字",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            if (chapter.resolveHasPuzzle()) {
                Icon(
                    imageVector = Icons.Default.Star,
                    contentDescription = "包含谜题",
                    tint = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.width(8.dp))
            }

            Text(
                text = "›",
                fontSize = 24.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun CharactersTab(
    characters: List<BookCharacter>,
    isLoading: Boolean
) {
    if (isLoading) {
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
    } else if (characters.isEmpty()) {
        EmptyState(
            icon = "🧸",
            title = "还没有角色",
            description = "这个故事还没有添加任何角色",
            actionText = "添加角色",
            onAction = { }
        )
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp)
        ) {
            items(characters, key = { it.resolveId() }) { character ->
                AnimationUtils.SlideInAnimation(
                    visible = true,
                    direction = AnimationUtils.SlideDirection.RIGHT
                ) {
                    CharacterListItem(character = character)
                }
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

@Composable
private fun CharacterListItem(character: BookCharacter) {
    LegoCard(
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
                color = MaterialTheme.colorScheme.secondaryContainer,
                modifier = Modifier.size(56.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = "🧸",
                        fontSize = 28.sp
                    )
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = character.resolveCustomName(),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "角色类型: ${character.resolveRoleType()}",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun InfoTab(book: com.legostory.mobile.core.model.Book?) {
    if (book == null) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text("加载中...")
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp)
        ) {
            item {
                InfoCard(title = "基本信息") {
                    InfoItem(label = "标题", value = book.title)
                    InfoItem(label = "章节数", value = "${book.resolveChapterCount()}")
                    book.createdAt?.let {
                        InfoItem(label = "创建时间", value = it)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                InfoCard(title = "统计信息") {
                    InfoItem(label = "总字数", value = "计算中...")
                    InfoItem(label = "阅读时长", value = "计算中...")
                    InfoItem(label = "完成进度", value = "计算中...")
                }
            }
        }
    }
}

@Composable
private fun InfoCard(
    title: String,
    content: @Composable () -> Unit
) {
    LegoCard(
        modifier = Modifier.fillMaxWidth(),
        variant = CardVariant.FILLED
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(
                text = title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
            Spacer(modifier = Modifier.height(12.dp))
            content()
        }
    }
}

@Composable
private fun InfoItem(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Text(
            text = value,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium
        )
    }
}
