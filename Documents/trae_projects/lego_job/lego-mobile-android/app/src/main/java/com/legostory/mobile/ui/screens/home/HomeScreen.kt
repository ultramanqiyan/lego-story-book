package com.legostory.mobile.ui.screens.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.core.model.*
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*
import com.legostory.mobile.ui.viewmodel.HomeViewModel

@Composable
fun HomeScreen(
    viewModel: HomeViewModel,
    onNavigateToBookshelf: () -> Unit,
    onNavigateToCharacters: () -> Unit,
    onNavigateToBookDetail: (String) -> Unit,
    onNavigateToStoryCreate: () -> Unit
) {
    val state by viewModel.state.collectAsState()
    var showCreateMenu by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp)
        ) {
            item {
                AnimationUtils.FadeInAnimation(visible = true) {
                    HomeHeader()
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
                SectionTitle(title = "热门人仔", icon = Icons.Default.Person)
            }

            items(state.popularCharacters.chunked(2)) { rowCharacters ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    rowCharacters.forEach { character ->
                        CharacterCard(
                            character = character,
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigateToCharacters() }
                        )
                    }
                    if (rowCharacters.size == 1) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
                Spacer(modifier = Modifier.height(12.dp))
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
                SectionTitle(title = "最近故事", icon = Icons.Default.Book)
            }

            items(state.recentBooks) { book ->
                BookListItem(
                    book = book,
                    onClick = { 
                        android.util.Log.d("HomeScreen", "Book clicked: id=${book.resolveBookId()}, title=${book.title}")
                        onNavigateToBookDetail(book.resolveBookId()) 
                    }
                )
                Spacer(modifier = Modifier.height(8.dp))
            }

            item {
                Spacer(modifier = Modifier.height(32.dp))
                CreateStoryButton(onClick = onNavigateToStoryCreate)
            }

            item {
                Spacer(modifier = Modifier.height(16.dp))
                QuickActions(
                    onBookshelfClick = onNavigateToBookshelf,
                    onCharactersClick = onNavigateToCharacters
                )
            }
        }

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
        }
    }
}

@Composable
private fun HomeHeader() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "🏰",
            fontSize = 48.sp
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "乐高故事书",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "创造属于你的冒险故事",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun SectionTitle(title: String, icon: androidx.compose.ui.graphics.vector.ImageVector) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.padding(bottom = 12.dp)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = MaterialTheme.colorScheme.primary
        )
        Spacer(modifier = Modifier.width(8.dp))
        Text(
            text = title,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
private fun CharacterCard(
    character: Character,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    LegoCard(
        onClick = onClick,
        modifier = modifier,
        variant = CardVariant.ELEVATED,
        size = CardSize.SMALL
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "🧸",
                fontSize = 32.sp
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = character.name,
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            character.personality?.let {
                Text(
                    text = it,
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun BookListItem(
    book: Book,
    onClick: () -> Unit
) {
    LegoCard(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        variant = CardVariant.DEFAULT
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "📖",
                fontSize = 40.sp
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = book.title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "${book.resolveChapterCount()} 章节",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Icon(
                imageVector = Icons.Default.Book,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
private fun CreateStoryButton(onClick: () -> Unit) {
    LegoButton(
        title = "创建新故事",
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        size = ButtonSize.LARGE,
        icon = Icons.Default.Add,
        iconPosition = IconPosition.START
    )
}

@Composable
private fun QuickActions(
    onBookshelfClick: () -> Unit,
    onCharactersClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        LegoButton(
            title = "我的书架",
            onClick = onBookshelfClick,
            modifier = Modifier.weight(1f),
            variant = ButtonVariant.SECONDARY,
            icon = Icons.Default.Book
        )
        LegoButton(
            title = "我的角色",
            onClick = onCharactersClick,
            modifier = Modifier.weight(1f),
            variant = ButtonVariant.OUTLINE,
            icon = Icons.Default.Person
        )
    }
}
