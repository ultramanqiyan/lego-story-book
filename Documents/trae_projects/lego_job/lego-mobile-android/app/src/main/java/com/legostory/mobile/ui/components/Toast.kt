package com.legostory.mobile.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

enum class ToastType {
    SUCCESS, ERROR, WARNING, INFO
}

@Composable
fun ToastHost(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Box(modifier = modifier.fillMaxSize()) {
        content()
    }
}

@Composable
fun Toast(
    message: String,
    type: ToastType = ToastType.INFO,
    onDismiss: () -> Unit
) {
    val backgroundColor = when (type) {
        ToastType.SUCCESS -> MaterialTheme.colorScheme.primary
        ToastType.ERROR -> MaterialTheme.colorScheme.error
        ToastType.WARNING -> MaterialTheme.colorScheme.tertiary
        ToastType.INFO -> MaterialTheme.colorScheme.secondary
    }
    
    LaunchedEffect(Unit) {
        kotlinx.coroutines.delay(3000)
        onDismiss()
    }
    
    Surface(
        color = backgroundColor,
        shape = MaterialTheme.shapes.small,
        modifier = Modifier.padding(16.dp)
    ) {
        Text(
            text = message,
            color = MaterialTheme.colorScheme.onPrimary,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp)
        )
    }
}
