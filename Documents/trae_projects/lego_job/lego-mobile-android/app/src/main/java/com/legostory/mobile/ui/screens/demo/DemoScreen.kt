package com.legostory.mobile.ui.screens.demo

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
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DemoScreen(
    onBack: () -> Unit
) {
    var showToast by remember { mutableStateOf(false) }
    var showModal by remember { mutableStateOf(false) }
    var selectedVariant by remember { mutableStateOf(ButtonVariant.PRIMARY) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("组件演示") },
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
            // Buttons Demo
            Text(
                text = "按钮组件",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            ButtonVariant.values().forEach { variant ->
                LegoButton(
                    title = variant.name,
                    onClick = { selectedVariant = variant },
                    modifier = Modifier.fillMaxWidth(),
                    variant = variant
                )
                Spacer(modifier = Modifier.height(8.dp))
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Cards Demo
            Text(
                text = "卡片组件",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            CardVariant.values().forEach { variant ->
                LegoCard(
                    modifier = Modifier.fillMaxWidth(),
                    variant = variant,
                    onClick = {}
                ) {
                    Text(
                        text = variant.name,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Medium
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Animation Demo
            Text(
                text = "动画效果",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            var animationVisible by remember { mutableStateOf(true) }
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                LegoButton(
                    title = "淡入淡出",
                    onClick = { animationVisible = !animationVisible },
                    modifier = Modifier.weight(1f),
                    size = ButtonSize.SMALL
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            AnimationUtils.FadeInAnimation(visible = animationVisible) {
                LegoCard(
                    modifier = Modifier.fillMaxWidth(),
                    variant = CardVariant.PRIMARY
                ) {
                    Text(
                        text = "动画内容",
                        modifier = Modifier.padding(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Toast Demo
            Text(
                text = "Toast 提示",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                LegoButton(
                    title = "成功",
                    onClick = { showToast = true },
                    modifier = Modifier.weight(1f),
                    variant = ButtonVariant.SUCCESS,
                    size = ButtonSize.SMALL
                )
                LegoButton(
                    title = "错误",
                    onClick = { showToast = true },
                    modifier = Modifier.weight(1f),
                    variant = ButtonVariant.DANGER,
                    size = ButtonSize.SMALL
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Modal Demo
            Text(
                text = "模态框",
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(12.dp))

            LegoButton(
                title = "显示确认框",
                onClick = { showModal = true },
                modifier = Modifier.fillMaxWidth(),
                icon = Icons.Default.Info
            )

            Spacer(modifier = Modifier.height(80.dp))
        }
    }

    // Toast
    val scope = rememberCoroutineScope()
    if (showToast) {
        DisposableEffect(Unit) {
            val job = scope.launch {
                delay(2000)
                showToast = false
            }
            onDispose { job.cancel() }
        }
    }

    // Modal
    if (showModal) {
        ConfirmModal(
            visible = true,
            onDismiss = { showModal = false },
            onConfirm = { showModal = false },
            title = "演示确认框",
            message = "这是一个演示用的确认对话框。"
        )
    }
}
