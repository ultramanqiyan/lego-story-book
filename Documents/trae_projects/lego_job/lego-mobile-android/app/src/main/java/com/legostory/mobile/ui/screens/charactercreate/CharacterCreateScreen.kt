package com.legostory.mobile.ui.screens.charactercreate

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
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
import com.legostory.mobile.core.model.CreateCharacterRequest
import com.legostory.mobile.ui.components.*
import com.legostory.mobile.ui.theme.*
import com.legostory.mobile.LegoStoryApp
import kotlinx.coroutines.launch
import androidx.compose.runtime.rememberCoroutineScope

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CharacterCreateScreen(
    userId: String?,
    onBack: () -> Unit,
    onCreated: (String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var personality by remember { mutableStateOf("") }
    var speakingStyle by remember { mutableStateOf("") }
    var selectedType by remember { mutableStateOf("hero") }
    var selectedAbilities by remember { mutableStateOf(setOf<String>()) }
    var isCreating by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    
    val coroutineScope = rememberCoroutineScope()
    
    val characterTypes = listOf(
        "hero" to "主角",
        "mentor" to "导师",
        "sidekick" to "伙伴",
        "villain" to "反派",
        "creature" to "生物"
    )
    
    val abilities = listOf("勇敢", "智慧", "善良", "幽默", "神秘", "力量", "速度", "魔法")
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("创建角色") },
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
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("角色名称 *") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                leadingIcon = {
                    Icon(Icons.Default.Person, null)
                }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            OutlinedTextField(
                value = personality,
                onValueChange = { personality = it },
                label = { Text("性格特点") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 2,
                maxLines = 3,
                leadingIcon = {
                    Icon(Icons.Default.Psychology, null)
                }
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            OutlinedTextField(
                value = speakingStyle,
                onValueChange = { speakingStyle = it },
                label = { Text("说话风格") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true,
                leadingIcon = {
                    Icon(Icons.Default.RecordVoiceOver, null)
                }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "角色类型",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                characterTypes.forEach { (type, label) ->
                    FilterChip(
                        selected = selectedType == type,
                        onClick = { selectedType = type },
                        label = label
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                text = "特殊能力",
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Column {
                abilities.chunked(4).forEach { rowAbilities ->
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        rowAbilities.forEach { ability ->
                            FilterChip(
                                selected = selectedAbilities.contains(ability),
                                onClick = {
                                    selectedAbilities = if (selectedAbilities.contains(ability)) {
                                        selectedAbilities - ability
                                    } else {
                                        selectedAbilities + ability
                                    }
                                },
                                label = ability
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            error?.let {
                Text(
                    text = it,
                    color = MaterialTheme.colorScheme.error,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.height(16.dp))
            }
            
            LegoButton(
                title = if (isCreating) "创建中..." else "创建角色",
                onClick = {
                    if (name.isBlank()) {
                        error = "请输入角色名称"
                        return@LegoButton
                    }
                    
                    isCreating = true
                    error = null
                    
                    coroutineScope.launch {
                        val request = CreateCharacterRequest(
                            name = name.trim(),
                            personality = personality.trim().takeIf { it.isNotBlank() },
                            speakingStyle = speakingStyle.trim().takeIf { it.isNotBlank() },
                            creatorId = userId ?: "user"
                        )
                        
                        LegoStoryApp.characterRepository.createCharacter(request)
                            .onSuccess { response ->
                                onCreated(response.characterId)
                            }
                            .onFailure { e ->
                                error = e.message ?: "创建失败"
                                isCreating = false
                            }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = !isCreating && name.isNotBlank(),
                icon = Icons.Default.Add
            )
        }
    }
}

@Composable
private fun FilterChip(
    selected: Boolean,
    onClick: () -> Unit,
    label: String
) {
    Surface(
        modifier = Modifier,
        shape = MaterialTheme.shapes.small,
        color = if (selected) LegoRed else MaterialTheme.colorScheme.surfaceVariant,
        onClick = onClick
    ) {
        Text(
            text = label,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            color = if (selected) androidx.compose.ui.graphics.Color.White else MaterialTheme.colorScheme.onSurfaceVariant,
            fontSize = 14.sp
        )
    }
}

private fun <T> Result<T>.onSuccess(action: (T) -> Unit): Result<T> {
    getOrNull()?.let { action(it) }
    return this
}

private fun <T> Result<T>.onFailure(action: (Throwable) -> Unit): Result<T> {
    exceptionOrNull()?.let { action(it) }
    return this
}
