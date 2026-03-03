package com.legostory.mobile.ui.components.characters

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
data class CharacterFormData(
    val id: String = "",
    val name: String = "",
    val type: CharacterType = CharacterType.HERO,
    val personality: List<String> = emptyList(),
    val abilities: List<String> = emptyList(),
    val backstory: String = "",
    val avatar: String = "🦸"
)

enum class CharacterType(val label: String, val color: Color, val icon: String) {
    HERO("主角", LegoRed, "🦸"),
    VILLAIN("反派", LegoPurple, "🦹"),
    SIDEKICK("伙伴", LegoGreen, "🤝"),
    MENTOR("导师", LegoYellow, "🧙"),
    CREATURE("生物", LegoBlue, "🧝")
}

val PersonalityTraits = listOf(
    "勇敢", "聪明", "善良", "幽默", "固执", "神秘", "忠诚", "好奇", "冷静", "热情"
)

val AbilityTypes = listOf(
    "力量", "智慧", "速度", "魔法", "治愈", "隐身", "飞行", "变形", "读心", "控制元素"
)

val AvatarOptions = listOf(
    "🦸", "🦹", "🧙", "🧝", "🤖", "🧛", "🧟", "🧜", "🧚", "🦊", "🐱", "🦁", "🐉", "🦅", "🐺"
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CharacterForm(
    initialData: CharacterFormData = CharacterFormData(),
    onSubmit: (CharacterFormData) -> Unit = {},
    onCancel: () -> Unit = {},
    isEditing: Boolean = false
) {
    var name by remember { mutableStateOf(initialData.name) }
    var selectedType by remember { mutableStateOf(initialData.type) }
    var selectedPersonalities by remember { mutableStateOf(initialData.personality) }
    var selectedAbilities by remember { mutableStateOf(initialData.abilities) }
    var backstory by remember { mutableStateOf(initialData.backstory) }
    var selectedAvatar by remember { mutableStateOf(initialData.avatar) }
    var showAvatarPicker by remember { mutableStateOf(false) }
    
    val scrollState = rememberScrollState()
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = if (isEditing) "编辑角色" else "创建新角色",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = LegoRed
        )
        
        AvatarSection(
            selectedAvatar = selectedAvatar,
            characterType = selectedType,
            onAvatarClick = { showAvatarPicker = true }
        )
        
        AnimatedVisibility(
            visible = showAvatarPicker,
            enter = fadeIn() + expandVertically(),
            exit = fadeOut() + shrinkVertically()
        ) {
            AvatarPicker(
                selectedAvatar = selectedAvatar,
                onAvatarSelect = { 
                    selectedAvatar = it
                    showAvatarPicker = false
                }
            )
        }
        
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("角色名称") },
            placeholder = { Text("输入角色名称") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            leadingIcon = {
                Icon(Icons.Default.Person, contentDescription = null)
            }
        )
        
        CharacterTypeSelector(
            selectedType = selectedType,
            onTypeSelect = { selectedType = it }
        )
        
        PersonalitySelector(
            selectedPersonalities = selectedPersonalities,
            onPersonalityToggle = { personality ->
                selectedPersonalities = if (selectedPersonalities.contains(personality)) {
                    selectedPersonalities - personality
                } else {
                    selectedPersonalities + personality
                }
            }
        )
        
        AbilitySelector(
            selectedAbilities = selectedAbilities,
            onAbilityToggle = { ability ->
                selectedAbilities = if (selectedAbilities.contains(ability)) {
                    selectedAbilities - ability
                } else {
                    selectedAbilities + ability
                }
            }
        )
        
        OutlinedTextField(
            value = backstory,
            onValueChange = { backstory = it },
            label = { Text("角色背景故事") },
            placeholder = { Text("描述角色的背景故事...") },
            modifier = Modifier
                .fillMaxWidth()
                .height(150.dp),
            maxLines = 6
        )
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            OutlinedButton(
                onClick = onCancel,
                modifier = Modifier.weight(1f)
            ) {
                Text("取消")
            }
            
            Button(
                onClick = {
                    onSubmit(
                        CharacterFormData(
                            id = initialData.id.ifEmpty { java.util.UUID.randomUUID().toString() },
                            name = name,
                            type = selectedType,
                            personality = selectedPersonalities,
                            abilities = selectedAbilities,
                            backstory = backstory,
                            avatar = selectedAvatar
                        )
                    )
                },
                modifier = Modifier.weight(1f),
                enabled = name.isNotBlank()
            ) {
                Text(if (isEditing) "保存" else "创建")
            }
        }
    }
}

@Composable
private fun AvatarSection(
    selectedAvatar: String,
    characterType: CharacterType,
    onAvatarClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(80.dp)
                .background(
                    characterType.color.copy(alpha = 0.2f),
                    CircleShape
                )
                .border(3.dp, characterType.color, CircleShape)
                .clickable(onClick = onAvatarClick),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = selectedAvatar,
                fontSize = 40.sp
            )
        }
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column {
            Text(
                text = "角色头像",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = "点击更换头像",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }
    }
}

@Composable
private fun AvatarPicker(
    selectedAvatar: String,
    onAvatarSelect: (String) -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "选择头像",
                fontWeight = FontWeight.Bold,
                fontSize = 16.sp
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(AvatarOptions) { avatar ->
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .background(
                                if (avatar == selectedAvatar) LegoRed.copy(alpha = 0.2f)
                                else Color.Transparent,
                                CircleShape
                            )
                            .border(
                                width = if (avatar == selectedAvatar) 2.dp else 0.dp,
                                color = if (avatar == selectedAvatar) LegoRed else Color.Transparent,
                                shape = CircleShape
                            )
                            .clickable { onAvatarSelect(avatar) },
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = avatar,
                            fontSize = 24.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CharacterTypeSelector(
    selectedType: CharacterType,
    onTypeSelect: (CharacterType) -> Unit
) {
    Column {
        Text(
            text = "角色类型",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            CharacterType.values().forEach { type ->
                TypeChip(
                    type = type,
                    isSelected = selectedType == type,
                    onClick = { onTypeSelect(type) },
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

@Composable
private fun TypeChip(
    type: CharacterType,
    isSelected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .background(
                if (isSelected) type.color.copy(alpha = 0.2f)
                else Color.Transparent
            )
            .border(
                width = if (isSelected) 2.dp else 1.dp,
                color = if (isSelected) type.color else Color.Gray.copy(alpha = 0.3f),
                shape = RoundedCornerShape(8.dp)
            )
            .clickable(onClick = onClick)
            .padding(8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = type.icon,
            fontSize = 20.sp
        )
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = type.label,
            fontSize = 10.sp,
            color = if (isSelected) type.color else Color.Gray
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun PersonalitySelector(
    selectedPersonalities: List<String>,
    onPersonalityToggle: (String) -> Unit
) {
    Column {
        Text(
            text = "性格特点 (可选多个)",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(PersonalityTraits) { trait ->
                FilterChip(
                    selected = selectedPersonalities.contains(trait),
                    onClick = { onPersonalityToggle(trait) },
                    label = { Text(trait) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = LegoRed.copy(alpha = 0.2f),
                        selectedLabelColor = LegoRed
                    )
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AbilitySelector(
    selectedAbilities: List<String>,
    onAbilityToggle: (String) -> Unit
) {
    Column {
        Text(
            text = "特殊能力 (可选多个)",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(AbilityTypes) { ability ->
                FilterChip(
                    selected = selectedAbilities.contains(ability),
                    onClick = { onAbilityToggle(ability) },
                    label = { Text(ability) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = LegoBlue.copy(alpha = 0.2f),
                        selectedLabelColor = LegoBlue
                    )
                )
            }
        }
    }
}
