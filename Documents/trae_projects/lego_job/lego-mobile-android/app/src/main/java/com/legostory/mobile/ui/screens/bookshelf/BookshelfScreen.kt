package com.legostory.mobile.ui.screens.bookshelf

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.core.model.Book
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*
import com.legostory.mobile.ui.viewmodel.BookshelfViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookshelfScreen(
    viewModel: BookshelfViewModel,
    onBack: () -> Unit,
    onBookClick: (String) -> Unit,
    onCreateBook: () -> Unit
) {
    val state by viewModel.state.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    var showDeleteConfirm by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("我的书架") },
                navigationIcon = {
                    LegoBackButton(onClick = onBack)
                },
                actions = {
                    LegoAddButton(
                        onClick = onCreateBook,
                        variant = ButtonVariant.PRIMARY
                    )
                }
            )
        }
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                // Search Bar
                SearchBar(
                    query = searchQuery,
                    onQueryChange = { searchQuery = it },
                    placeholder = "搜索故事书..."
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Books List
                if (state.books.isEmpty()) {
                    EmptyBookshelf(onCreateBook = onCreateBook)
                } else {
                    val filteredBooks = state.books.filter {
                        it.title.contains(searchQuery, ignoreCase = true)
                    }

                    if (filteredBooks.isEmpty()) {
                        NoSearchResults()
                    } else {
                        BooksList(
                            books = filteredBooks,
                            onBookClick = onBookClick,
                            onDeleteClick = { showDeleteConfirm = it }
                        )
                    }
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

    // Delete Confirmation Dialog
    showDeleteConfirm?.let { bookId ->
        ConfirmModal(
            visible = true,
            onDismiss = { showDeleteConfirm = null },
            onConfirm = {
                viewModel.deleteBook(bookId)
                showDeleteConfirm = null
            },
            title = "删除故事书",
            message = "确定要删除这个故事书吗？此操作无法撤销。"
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    placeholder: String
) {
    OutlinedTextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = Modifier.fillMaxWidth(),
        placeholder = { Text(placeholder) },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = null
            )
        },
        singleLine = true,
        shape = MaterialTheme.shapes.medium
    )
}

@Composable
private fun EmptyBookshelf(
    onCreateBook: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "📚",
            fontSize = 80.sp
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "书架是空的",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "开始创建你的第一个故事吧！",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(24.dp))
        LegoButton(
            title = "创建新故事",
            onClick = onCreateBook,
            icon = Icons.Default.Add
        )
    }
}

@Composable
private fun NoSearchResults() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "🔍",
            fontSize = 64.sp
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "没有找到匹配的故事",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "试试其他关键词",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
private fun BooksList(
    books: List<Book>,
    onBookClick: (String) -> Unit,
    onDeleteClick: (String) -> Unit
) {
    LazyColumn {
        items(books, key = { it.resolveBookId() }) { book ->
            AnimationUtils.SlideInAnimation(
                visible = true,
                direction = AnimationUtils.SlideDirection.RIGHT
            ) {
                BookListItem(
                    book = book,
                    onClick = { 
                        android.util.Log.d("BookshelfScreen", "Book clicked: id=${book.resolveBookId()}, title=${book.title}")
                        onBookClick(book.resolveBookId()) 
                    },
                    onDeleteClick = { onDeleteClick(book.resolveBookId()) }
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}

@Composable
private fun BookListItem(
    book: Book,
    onClick: () -> Unit,
    onDeleteClick: () -> Unit
) {
    LegoCard(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        variant = CardVariant.ELEVATED
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Book Icon
            Surface(
                shape = MaterialTheme.shapes.medium,
                color = MaterialTheme.colorScheme.primaryContainer,
                modifier = Modifier.size(56.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(
                        text = "📖",
                        fontSize = 28.sp
                    )
                }
            }

            Spacer(modifier = Modifier.width(16.dp))

            // Book Info
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = book.title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${book.resolveChapterCount()} 章节",
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                book.createdAt?.let { date ->
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "创建于: $date",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Actions
            Row {
                LegoIconButton(
                    icon = Icons.Default.Delete,
                    onClick = onDeleteClick,
                    variant = ButtonVariant.GHOST
                )
            }
        }
    }
}
