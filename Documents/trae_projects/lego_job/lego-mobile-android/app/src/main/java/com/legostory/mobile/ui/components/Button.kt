package com.legostory.mobile.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

enum class ButtonVariant {
    PRIMARY, SECONDARY, OUTLINE, GHOST, DANGER, SUCCESS, WARNING
}

enum class ButtonSize {
    SMALL, MEDIUM, LARGE
}

@Composable
fun LegoButton(
    title: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.PRIMARY,
    size: ButtonSize = ButtonSize.MEDIUM,
    enabled: Boolean = true,
    icon: ImageVector? = null,
    iconPosition: IconPosition = IconPosition.START
) {
    val colors = when (variant) {
        ButtonVariant.PRIMARY -> ButtonDefaults.buttonColors()
        ButtonVariant.SECONDARY -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.secondary
        )
        ButtonVariant.OUTLINE -> ButtonDefaults.outlinedButtonColors()
        ButtonVariant.GHOST -> ButtonDefaults.textButtonColors()
        ButtonVariant.DANGER -> ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.error
        )
        ButtonVariant.SUCCESS -> ButtonDefaults.buttonColors(
            containerColor = Color(0xFF4CAF50)
        )
        ButtonVariant.WARNING -> ButtonDefaults.buttonColors(
            containerColor = Color(0xFFFF9800)
        )
    }

    val height = when (size) {
        ButtonSize.SMALL -> 32.dp
        ButtonSize.MEDIUM -> 48.dp
        ButtonSize.LARGE -> 56.dp
    }

    val fontSize = when (size) {
        ButtonSize.SMALL -> 14.sp
        ButtonSize.MEDIUM -> 16.sp
        ButtonSize.LARGE -> 18.sp
    }

    val content: @Composable RowScope.() -> Unit = {
        if (icon != null && iconPosition == IconPosition.START) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
        }
        Text(
            text = title,
            fontSize = fontSize,
            fontWeight = FontWeight.Medium
        )
        if (icon != null && iconPosition == IconPosition.END) {
            Spacer(modifier = Modifier.width(8.dp))
            Icon(
                imageVector = icon,
                contentDescription = null,
                modifier = Modifier.size(20.dp)
            )
        }
    }

    if (variant == ButtonVariant.OUTLINE) {
        OutlinedButton(
            onClick = onClick,
            modifier = modifier.height(height),
            enabled = enabled,
            shape = RoundedCornerShape(8.dp),
            content = content
        )
    } else {
        Button(
            onClick = onClick,
            modifier = modifier.height(height),
            enabled = enabled,
            colors = colors,
            shape = RoundedCornerShape(8.dp),
            content = content
        )
    }
}

@Composable
fun LegoIconButton(
    icon: ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.PRIMARY,
    enabled: Boolean = true
) {
    val colors = when (variant) {
        ButtonVariant.PRIMARY -> IconButtonDefaults.iconButtonColors()
        ButtonVariant.SECONDARY -> IconButtonDefaults.iconButtonColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        )
        ButtonVariant.DANGER -> IconButtonDefaults.iconButtonColors(
            containerColor = MaterialTheme.colorScheme.errorContainer
        )
        else -> IconButtonDefaults.iconButtonColors()
    }

    IconButton(
        onClick = onClick,
        modifier = modifier.size(48.dp),
        enabled = enabled,
        colors = colors
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null
        )
    }
}

@Composable
fun LegoBackButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    LegoIconButton(
        icon = Icons.Default.ArrowBack,
        onClick = onClick,
        modifier = modifier,
        variant = ButtonVariant.GHOST
    )
}

@Composable
fun LegoCloseButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    LegoIconButton(
        icon = Icons.Default.Close,
        onClick = onClick,
        modifier = modifier,
        variant = ButtonVariant.GHOST
    )
}

@Composable
fun LegoAddButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.PRIMARY
) {
    LegoIconButton(
        icon = Icons.Default.Add,
        onClick = onClick,
        modifier = modifier,
        variant = variant
    )
}

@Composable
fun LegoCheckButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.SUCCESS
) {
    LegoIconButton(
        icon = Icons.Default.Check,
        onClick = onClick,
        modifier = modifier,
        variant = variant
    )
}

enum class IconPosition {
    START, END
}
