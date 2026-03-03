package com.legostory.mobile.ui.screens.settings

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
import com.legostory.mobile.ui.animation.AnimationUtils
import com.legostory.mobile.ui.components.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ParentControlScreen(
    onBack: () -> Unit
) {
    var dailyTimeLimit by remember { mutableStateOf(60) } // minutes
    var contentFilterEnabled by remember { mutableStateOf(true) }
    var passwordProtection by remember { mutableStateOf(true) }
    var readingReminder by remember { mutableStateOf(true) }
    var reminderInterval by remember { mutableStateOf(20) } // minutes
    var showResetConfirm by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("家长控制") },
                navigationIcon = {
                    LegoBackButton(onClick = onBack)
                },
                actions = {
                    TextButton(onClick = { showResetConfirm = true }) {
                        Text("重置")
                    }
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
            // Time Limit Section
            SettingsSection(title = "阅读时间限制") {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "每日阅读时长",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = "${dailyTimeLimit} 分钟",
                            fontSize = 16.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Slider(
                        value = dailyTimeLimit.toFloat(),
                        onValueChange = { dailyTimeLimit = it.toInt() },
                        valueRange = 15f..180f,
                        steps = 10
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text("15分", fontSize = 12.sp)
                        Text("60分", fontSize = 12.sp)
                        Text("180分", fontSize = 12.sp)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Reading Reminder
            SettingsSection(title = "阅读提醒") {
                SwitchSettingItem(
                    title = "开启阅读提醒",
                    subtitle = "定时提醒孩子休息",
                    checked = readingReminder,
                    onCheckedChange = { readingReminder = it }
                )

                if (readingReminder) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "提醒间隔: ${reminderInterval} 分钟",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Slider(
                            value = reminderInterval.toFloat(),
                            onValueChange = { reminderInterval = it.toInt() },
                            valueRange = 10f..60f,
                            steps = 9
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Content Filter
            SettingsSection(title = "内容过滤") {
                SwitchSettingItem(
                    title = "内容过滤",
                    subtitle = "过滤不适合的内容",
                    checked = contentFilterEnabled,
                    onCheckedChange = { contentFilterEnabled = it }
                )

                SettingsItem(
                    icon = Icons.Default.Block,
                    title = "屏蔽词管理",
                    subtitle = "管理需要屏蔽的词汇",
                    onClick = { }
                )

                SettingsItem(
                    icon = Icons.Default.Category,
                    title = "内容分类",
                    subtitle = "选择允许的内容类型",
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Security
            SettingsSection(title = "安全设置") {
                SwitchSettingItem(
                    title = "密码保护",
                    subtitle = "需要密码才能修改设置",
                    checked = passwordProtection,
                    onCheckedChange = { passwordProtection = it }
                )

                if (passwordProtection) {
                    SettingsItem(
                        icon = Icons.Default.Lock,
                        title = "修改密码",
                        subtitle = "更改家长控制密码",
                        onClick = { }
                    )
                }

                SettingsItem(
                    icon = Icons.Default.Fingerprint,
                    title = "生物识别",
                    subtitle = "使用指纹或面部识别",
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Statistics
            SettingsSection(title = "使用统计") {
                SettingsItem(
                    icon = Icons.Default.BarChart,
                    title = "阅读统计",
                    subtitle = "查看孩子的阅读情况",
                    onClick = { }
                )

                SettingsItem(
                    icon = Icons.Default.History,
                    title = "阅读历史",
                    subtitle = "查看阅读记录",
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Info Card
            AnimationUtils.FadeInAnimation(visible = true) {
                LegoCard(
                    modifier = Modifier.fillMaxWidth(),
                    variant = CardVariant.FILLED
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "💡 提示",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "• 合理设置阅读时间，保护孩子视力\n" +
                                   "• 定期查看阅读统计，了解孩子兴趣\n" +
                                   "• 开启内容过滤，确保内容安全",
                            fontSize = 14.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }

    // Reset Confirmation
    if (showResetConfirm) {
        ConfirmModal(
            visible = true,
            onDismiss = { showResetConfirm = false },
            onConfirm = {
                dailyTimeLimit = 60
                contentFilterEnabled = true
                passwordProtection = true
                readingReminder = true
                reminderInterval = 20
                showResetConfirm = false
            },
            title = "重置设置",
            message = "确定要重置所有家长控制设置吗？"
        )
    }
}

@Composable
private fun SwitchSettingItem(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium
            )
            Text(
                text = subtitle,
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange
        )
    }
}
