package com.legostory.mobile.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.dp

enum class CardVariant {
    DEFAULT, PRIMARY, SECONDARY, OUTLINE, ELEVATED, FILLED
}

enum class CardSize {
    SMALL, MEDIUM, LARGE
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LegoCard(
    modifier: Modifier = Modifier,
    variant: CardVariant = CardVariant.DEFAULT,
    size: CardSize = CardSize.MEDIUM,
    shape: Shape = RoundedCornerShape(12.dp),
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit
) {
    val colors = when (variant) {
        CardVariant.DEFAULT -> CardDefaults.cardColors()
        CardVariant.PRIMARY -> CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
        CardVariant.SECONDARY -> CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.secondaryContainer
        )
        CardVariant.OUTLINE -> CardDefaults.outlinedCardColors()
        CardVariant.ELEVATED -> CardDefaults.elevatedCardColors()
        CardVariant.FILLED -> CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surfaceVariant
        )
    }

    val elevation = when (size) {
        CardSize.SMALL -> 2.dp
        CardSize.MEDIUM -> 4.dp
        CardSize.LARGE -> 8.dp
    }

    val padding = when (size) {
        CardSize.SMALL -> 12.dp
        CardSize.MEDIUM -> 16.dp
        CardSize.LARGE -> 24.dp
    }

    val cardModifier = modifier
        .clip(shape)
        .then(if (variant == CardVariant.ELEVATED) Modifier.shadow(elevation) else Modifier)

    if (onClick != null) {
        if (variant == CardVariant.OUTLINE) {
            OutlinedCard(
                onClick = onClick,
                modifier = cardModifier,
                shape = shape,
                colors = colors,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(
                    modifier = Modifier.padding(padding),
                    content = content
                )
            }
        } else {
            Card(
                onClick = onClick,
                modifier = cardModifier,
                shape = shape,
                colors = colors,
                elevation = CardDefaults.cardElevation(defaultElevation = elevation)
            ) {
                Column(
                    modifier = Modifier.padding(padding),
                    content = content
                )
            }
        }
    } else {
        if (variant == CardVariant.OUTLINE) {
            OutlinedCard(
                modifier = cardModifier,
                shape = shape,
                colors = colors,
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline)
            ) {
                Column(
                    modifier = Modifier.padding(padding),
                    content = content
                )
            }
        } else {
            Card(
                modifier = cardModifier,
                shape = shape,
                colors = colors,
                elevation = CardDefaults.cardElevation(defaultElevation = elevation)
            ) {
                Column(
                    modifier = Modifier.padding(padding),
                    content = content
                )
            }
        }
    }
}

@Composable
fun LegoImageCard(
    modifier: Modifier = Modifier,
    image: @Composable () -> Unit,
    title: String,
    subtitle: String? = null,
    variant: CardVariant = CardVariant.DEFAULT,
    onClick: (() -> Unit)? = null
) {
    LegoCard(
        modifier = modifier,
        variant = variant,
        size = CardSize.MEDIUM,
        onClick = onClick
    ) {
        Column {
            Box(modifier = Modifier.fillMaxWidth()) {
                image()
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium
            )
            subtitle?.let {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LegoSelectableCard(
    modifier: Modifier = Modifier,
    selected: Boolean = false,
    onSelect: () -> Unit,
    content: @Composable ColumnScope.() -> Unit
) {
    val borderColor = if (selected) {
        MaterialTheme.colorScheme.primary
    } else {
        Color.Transparent
    }

    Card(
        onClick = onSelect,
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = if (selected) {
                MaterialTheme.colorScheme.primaryContainer
            } else {
                MaterialTheme.colorScheme.surface
            }
        ),
        border = BorderStroke(
            width = if (selected) 2.dp else 1.dp,
            color = borderColor
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            content = content
        )
    }
}

@Composable
fun LegoActionCard(
    modifier: Modifier = Modifier,
    title: String,
    description: String? = null,
    actionText: String,
    onAction: () -> Unit,
    variant: CardVariant = CardVariant.DEFAULT
) {
    LegoCard(
        modifier = modifier,
        variant = variant
    ) {
        Column {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium
            )
            description?.let {
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = it,
                    style = MaterialTheme.typography.bodySmall
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            LegoButton(
                title = actionText,
                onClick = onAction,
                size = ButtonSize.SMALL
            )
        }
    }
}
