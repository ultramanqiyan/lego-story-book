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
fun SettingsScreen(
    onLogout: () -> Unit
) {
    var showLogoutConfirm by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("设置") },
                navigationIcon = {
                    LegoBackButton(onClick = { })
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
            // Account Section
            SettingsSection(title = "账户") {
                SettingsItem(
                    icon = Icons.Default.Person,
                    title = "个人信息",
                    subtitle = "管理你的账户信息",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.Lock,
                    title = "修改密码",
                    subtitle = "更新你的登录密码",
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Appearance Section
            SettingsSection(title = "外观") {
                SettingsItem(
                    icon = Icons.Default.Palette,
                    title = "主题风格",
                    subtitle = "经典乐高 / 沉浸故事 / 游戏冒险",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.Style,
                    title = "卡牌样式",
                    subtitle = "2D风格 / 3D效果",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.TextFields,
                    title = "字体大小",
                    subtitle = "调整阅读字体大小",
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Effects Section
            SettingsSection(title = "效果") {
                SettingsItem(
                    icon = Icons.Default.Animation,
                    title = "动画效果",
                    subtitle = "页面切换动画",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.Cloud,
                    title = "天气效果",
                    subtitle = "背景天气特效",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.Star,
                    title = "粒子效果",
                    subtitle = "雪花 / 星星 / 气泡",
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Parent Control Section
            SettingsSection(title = "家长控制") {
                SettingsItem(
                    icon = Icons.Default.Timer,
                    title = "阅读时间限制",
                    subtitle = "设置每日阅读时长",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.Shield,
                    title = "内容过滤",
                    subtitle = "管理可访问的内容",
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Data Section
            SettingsSection(title = "数据") {
                SettingsItem(
                    icon = Icons.Default.CloudUpload,
                    title = "备份数据",
                    subtitle = "将数据备份到云端",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.CloudDownload,
                    title = "恢复数据",
                    subtitle = "从云端恢复数据",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.Delete,
                    title = "清除缓存",
                    subtitle = "释放存储空间",
                    onClick = { },
                    isDanger = true
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // About Section
            SettingsSection(title = "关于") {
                SettingsItem(
                    icon = Icons.Default.Info,
                    title = "关于应用",
                    subtitle = "版本 1.0.0",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.Help,
                    title = "帮助中心",
                    subtitle = "常见问题解答",
                    onClick = { }
                )
                SettingsItem(
                    icon = Icons.Default.Feedback,
                    title = "反馈建议",
                    subtitle = "向我们提交反馈",
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.height(32.dp))

            // Logout Button
            AnimationUtils.FadeInAnimation(visible = true) {
                LegoButton(
                    title = "退出登录",
                    onClick = { showLogoutConfirm = true },
                    modifier = Modifier.fillMaxWidth(),
                    variant = ButtonVariant.DANGER,
                    icon = Icons.Default.Logout
                )
            }
        }
    }

    // Logout Confirmation Dialog
    if (showLogoutConfirm) {
        ConfirmModal(
            visible = true,
            onDismiss = { showLogoutConfirm = false },
            onConfirm = {
                showLogoutConfirm = false
                onLogout()
            },
            title = "退出登录",
            message = "确定要退出登录吗？"
        )
    }
}

@Composable
internal fun SettingsSection(
    title: String,
    content: @Composable () -> Unit
) {
    Column {
        Text(
            text = title,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.primary,
            modifier = Modifier.padding(bottom = 8.dp, start = 16.dp)
        )
        LegoCard(
            variant = CardVariant.FILLED,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column {
                content()
            }
        }
    }
}

@Composable
internal fun SettingsItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit,
    isDanger: Boolean = false
) {
    val textColor = if (isDanger) {
        MaterialTheme.colorScheme.error
    } else {
        MaterialTheme.colorScheme.onSurface
    }

    val iconColor = if (isDanger) {
        MaterialTheme.colorScheme.error
    } else {
        MaterialTheme.colorScheme.primary
    }

    Surface(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = iconColor,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium,
                    color = textColor
                )
                Text(
                    text = subtitle,
                    fontSize = 14.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Text(
                text = "›",
                fontSize = 20.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
