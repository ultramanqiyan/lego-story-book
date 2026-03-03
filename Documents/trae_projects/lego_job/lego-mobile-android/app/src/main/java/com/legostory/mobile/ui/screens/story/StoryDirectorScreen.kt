package com.legostory.mobile.ui.screens.story

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.ui.theme.*

data class StoryScene(
    val id: String,
    val title: String,
    val description: String,
    val characters: List<String> = emptyList(),
    val background: String = "default",
    val order: Int = 0
)

data class StoryCharacter(
    val id: String,
    val name: String,
    val type: String,
    val avatar: String,
    val color: Color
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StoryDirectorScreen(
    storyId: String? = null,
    onBack: () -> Unit = {},
    onPreview: () -> Unit = {},
    onPublish: () -> Unit = {}
) {
    var selectedTab by remember { mutableIntStateOf(0) }
    var scenes by remember { 
        mutableStateOf(
            listOf(
                StoryScene("1", "开场", "故事开始...", order = 0),
                StoryScene("2", "冒险开始", "主角踏上旅程...", order = 1),
                StoryScene("3", "高潮", "面对挑战...", order = 2)
            )
        )
    }
    var selectedScene by remember { mutableStateOf<StoryScene?>(null) }
    var showAddSceneDialog by remember { mutableStateOf(false) }
    var showCharacterPicker by remember { mutableStateOf(false) }
    
    val availableCharacters = listOf(
        StoryCharacter("1", "勇敢骑士", "hero", "🦸", LegoRed),
        StoryCharacter("2", "智慧法师", "mentor", "🧙", LegoBlue),
        StoryCharacter("3", "忠诚伙伴", "sidekick", "🤝", LegoGreen),
        StoryCharacter("4", "神秘旅者", "creature", "🧝", LegoPurple)
    )
    
    val tabs = listOf("场景", "角色", "道具", "设置")
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        text = "故事导演台",
                        fontWeight = FontWeight.Bold
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "返回")
                    }
                },
                actions = {
                    IconButton(onClick = onPreview) {
                        Icon(Icons.Default.PlayArrow, contentDescription = "预览")
                    }
                    IconButton(onClick = onPublish) {
                        Icon(Icons.Default.Publish, contentDescription = "发布")
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = LegoRed,
                    titleContentColor = Color.White,
                    navigationIconContentColor = Color.White,
                    actionIconContentColor = Color.White
                )
            )
        },
        bottomBar = {
            BottomAppBar(
                containerColor = Color.White,
                content = {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        BottomAction(
                            icon = Icons.Default.Add,
                            label = "添加场景",
                            onClick = { showAddSceneDialog = true }
                        )
                        BottomAction(
                            icon = Icons.Default.PersonAdd,
                            label = "添加角色",
                            onClick = { showCharacterPicker = true }
                        )
                        BottomAction(
                            icon = Icons.Default.Save,
                            label = "保存",
                            onClick = { }
                        )
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = Color.White,
                contentColor = LegoRed
            ) {
                tabs.forEachIndexed { index, title ->
                    Tab(
                        selected = selectedTab == index,
                        onClick = { selectedTab = index },
                        text = { Text(title) }
                    )
                }
            }
            
            when (selectedTab) {
                0 -> ScenesTab(
                    scenes = scenes,
                    selectedScene = selectedScene,
                    onSceneSelect = { selectedScene = it },
                    onSceneMove = { from, to ->
                        scenes = scenes.toMutableList().apply {
                            val item = removeAt(from)
                            add(to, item)
                        }
                    }
                )
                1 -> CharactersTab(
                    characters = availableCharacters,
                    onCharacterSelect = { }
                )
                2 -> PropsTab()
                3 -> SettingsTab()
            }
        }
    }
    
    if (showAddSceneDialog) {
        AddSceneDialog(
            onDismiss = { showAddSceneDialog = false },
            onAdd = { title, description ->
                scenes = scenes + StoryScene(
                    id = System.currentTimeMillis().toString(),
                    title = title,
                    description = description,
                    order = scenes.size
                )
                showAddSceneDialog = false
            }
        )
    }
    
    if (showCharacterPicker) {
        CharacterPickerDialog(
            characters = availableCharacters,
            onDismiss = { showCharacterPicker = false },
            onSelect = { showCharacterPicker = false }
        )
    }
}

@Composable
private fun BottomAction(
    icon: ImageVector,
    label: String,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.clickable(onClick = onClick)
    ) {
        Icon(
            imageVector = icon,
            contentDescription = label,
            tint = LegoRed,
            modifier = Modifier.size(24.dp)
        )
        Text(
            text = label,
            fontSize = 12.sp,
            color = LegoRed
        )
    }
}

@Composable
private fun ScenesTab(
    scenes: List<StoryScene>,
    selectedScene: StoryScene?,
    onSceneSelect: (StoryScene) -> Unit,
    onSceneMove: (Int, Int) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(scenes, key = { it.id }) { scene ->
            SceneCard(
                scene = scene,
                isSelected = selectedScene?.id == scene.id,
                onClick = { onSceneSelect(scene) }
            )
        }
    }
}

@Composable
private fun SceneCard(
    scene: StoryScene,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .then(
                if (isSelected) {
                    Modifier.border(2.dp, LegoRed, RoundedCornerShape(12.dp))
                } else {
                    Modifier
                }
            ),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) LegoRed.copy(alpha = 0.1f) else Color.White
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
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
                        CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "${scene.order + 1}",
                    color = Color.White,
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp
                )
            }
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = scene.title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = scene.description,
                    fontSize = 14.sp,
                    color = Color.Gray,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }
            
            Icon(
                imageVector = Icons.Default.DragHandle,
                contentDescription = "拖拽排序",
                tint = Color.Gray
            )
        }
    }
}

@Composable
private fun CharactersTab(
    characters: List<StoryCharacter>,
    onCharacterSelect: (StoryCharacter) -> Unit
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(characters) { character ->
            CharacterCard(
                character = character,
                onClick = { onCharacterSelect(character) }
            )
        }
    }
}

@Composable
private fun CharacterCard(
    character: StoryCharacter,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(56.dp)
                    .background(character.color.copy(alpha = 0.2f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = character.avatar,
                    fontSize = 28.sp
                )
            }
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column {
                Text(
                    text = character.name,
                    fontWeight = FontWeight.Bold,
                    fontSize = 18.sp
                )
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = when (character.type) {
                        "hero" -> "主角"
                        "mentor" -> "导师"
                        "sidekick" -> "伙伴"
                        "creature" -> "生物"
                        else -> "角色"
                    },
                    fontSize = 14.sp,
                    color = character.color
                )
            }
        }
    }
}

@Composable
private fun PropsTab() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                imageVector = Icons.Default.Inventory,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = Color.Gray
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "道具库",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = "添加道具来丰富你的故事场景",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }
    }
}

@Composable
private fun SettingsTab() {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            SettingsItem(
                title = "故事标题",
                subtitle = "我的冒险故事",
                icon = Icons.Default.Title
            )
        }
        item {
            SettingsItem(
                title = "故事描述",
                subtitle = "一个关于勇气和友谊的故事",
                icon = Icons.Default.Description
            )
        }
        item {
            SettingsItem(
                title = "目标年龄",
                subtitle = "6-8岁",
                icon = Icons.Default.ChildCare
            )
        }
        item {
            SettingsItem(
                title = "故事时长",
                subtitle = "约15分钟",
                icon = Icons.Default.Timer
            )
        }
        item {
            SettingsItem(
                title = "难度等级",
                subtitle = "普通",
                icon = Icons.Default.Star
            )
        }
    }
}

@Composable
private fun SettingsItem(
    title: String,
    subtitle: String,
    icon: ImageVector
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = LegoRed,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontWeight = FontWeight.Medium,
                    fontSize = 16.sp
                )
                Text(
                    text = subtitle,
                    fontSize = 14.sp,
                    color = Color.Gray
                )
            }
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = "编辑",
                tint = Color.Gray
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AddSceneDialog(
    onDismiss: () -> Unit,
    onAdd: (String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("添加新场景") },
        text = {
            Column {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("场景标题") },
                    modifier = Modifier.fillMaxWidth()
                )
                Spacer(modifier = Modifier.height(8.dp))
                OutlinedTextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("场景描述") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(100.dp),
                    maxLines = 4
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onAdd(title, description) },
                enabled = title.isNotBlank()
            ) {
                Text("添加")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("取消")
            }
        }
    )
}

@Composable
private fun CharacterPickerDialog(
    characters: List<StoryCharacter>,
    onDismiss: () -> Unit,
    onSelect: (StoryCharacter) -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("选择角色") },
        text = {
            LazyColumn {
                items(characters) { character ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { onSelect(character) }
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(text = character.avatar, fontSize = 24.sp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(text = character.name, fontSize = 16.sp)
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) {
                Text("关闭")
            }
        }
    )
}
