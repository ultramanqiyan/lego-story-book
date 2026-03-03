package com.legostory.mobile.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun LegoModal(
    visible: Boolean,
    onDismiss: () -> Unit,
    title: String? = null,
    content: @Composable () -> Unit,
    actions: @Composable () -> Unit = {}
) {
    if (visible) {
        AlertDialog(
            onDismissRequest = onDismiss,
            title = title?.let {
                {
                    Text(
                        text = it,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            },
            text = { content() },
            confirmButton = { actions() }
        )
    }
}

@Composable
fun ConfirmModal(
    visible: Boolean,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit,
    title: String = "确认",
    message: String = "确定要执行此操作吗？"
) {
    LegoModal(
        visible = visible,
        onDismiss = onDismiss,
        title = title,
        content = {
            Text(
                text = message,
                fontSize = 14.sp
            )
        },
        actions = {
            Row {
                LegoButton(
                    title = "取消",
                    onClick = onDismiss,
                    variant = ButtonVariant.OUTLINE
                )
                Spacer(modifier = Modifier.width(8.dp))
                LegoButton(
                    title = "确定",
                    onClick = onConfirm,
                    variant = ButtonVariant.DANGER
                )
            }
        }
    )
}
