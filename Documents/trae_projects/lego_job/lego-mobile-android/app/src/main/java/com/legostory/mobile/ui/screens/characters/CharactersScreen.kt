package com.legostory.mobile.ui.screens.characters

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.core.model.Character
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*
import com.legostory.mobile.ui.viewmodel.CharactersViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CharactersScreen(
    viewModel: CharactersViewModel,
    onBack: () -> Unit,
    onCreateCharacter: () -> Unit,
    onCharacterClick: (String) -> Unit
) {
    val state by viewModel.state.collectAsState()
    var searchQuery by remember { mutableStateOf("") }
    
    LaunchedEffect(Unit) {
        viewModel.loadCharacters()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("我的角色") },
                navigationIcon = {
                    LegoBackButton(onClick = onBack)
                },
                actions = {
                    LegoAddButton(
                        onClick = onCreateCharacter,
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
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    modifier = Modifier.fillMaxWidth(),
                    placeholder = { Text("搜索角色...") },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null
                        )
                    },
                    singleLine = true,
                    shape = MaterialTheme.shapes.medium
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Characters List
                if (state.characters.isEmpty()) {
                    EmptyCharacters(onCreateCharacter = onCreateCharacter)
                } else {
                    val filteredCharacters = state.characters.filter {
                        it.name.contains(searchQuery, ignoreCase = true)
                    }

                    if (filteredCharacters.isEmpty()) {
                        NoSearchResults()
                    } else {
                        CharactersList(
                            characters = filteredCharacters,
                            onCharacterClick = onCharacterClick
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
}

@Composable
private fun EmptyCharacters(
    onCreateCharacter: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "🧸",
            fontSize = 80.sp
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "还没有角色",
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "创建你的第一个人仔角色吧！",
            fontSize = 14.sp,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(24.dp))
        LegoButton(
            title = "创建角色",
            onClick = onCreateCharacter,
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
            text = "没有找到匹配的角色",
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
private fun CharactersList(
    characters: List<Character>,
    onCharacterClick: (String) -> Unit
) {
    LazyColumn {
        items(characters, key = { it.resolveCharacterId() }) { character ->
            AnimationUtils.SlideInAnimation(
                visible = true,
                direction = AnimationUtils.SlideDirection.RIGHT
            ) {
                CharacterListItem(
                    character = character,
                    onClick = { onCharacterClick(character.resolveCharacterId()) }
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}

@Composable
private fun CharacterListItem(
    character: Character,
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
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Character Avatar
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

            // Character Info
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = character.name,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                character.personality?.let {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = it,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                character.resolveSpeakingStyle()?.let {
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "说话风格: $it",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Arrow
            Text(
                text = "›",
                fontSize = 24.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
