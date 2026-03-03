package com.legostory.mobile.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun EmptyState(
    icon: String = "📭",
    title: String = "暂无内容",
    description: String = "这里还没有任何内容",
    actionText: String? = null,
    onAction: (() -> Unit)? = null
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = icon,
            fontSize = 64.sp
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = title,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = description,
            fontSize = 14.sp
        )
        
        if (actionText != null && onAction != null) {
            Spacer(modifier = Modifier.height(16.dp))
            LegoButton(
                title = actionText,
                onClick = onAction
            )
        }
    }
}
