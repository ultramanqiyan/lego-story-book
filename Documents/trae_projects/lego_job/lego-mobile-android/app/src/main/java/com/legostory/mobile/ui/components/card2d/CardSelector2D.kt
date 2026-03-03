package com.legostory.mobile.ui.components.card2d

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.ui.components.card3d.CardRarity
import com.legostory.mobile.ui.theme.*
import kotlinx.coroutines.launch
import kotlin.math.abs

enum class SelectorStyle {
    Horizontal, Grid, Wheel
}

@Composable
fun CardSelector2D(
    cards: List<Card2DData>,
    modifier: Modifier = Modifier,
    style: SelectorStyle = SelectorStyle.Horizontal,
    selectedIndices: Set<Int> = emptySet(),
    multiSelect: Boolean = false,
    onCardSelect: (Int, Boolean) -> Unit = { _, _ -> },
    minSelections: Int = 1,
    maxSelections: Int = Int.MAX_VALUE
) {
    when (style) {
        SelectorStyle.Horizontal -> HorizontalSelector(
            cards = cards,
            modifier = modifier,
            selectedIndices = selectedIndices,
            multiSelect = multiSelect,
            onCardSelect = onCardSelect,
            minSelections = minSelections,
            maxSelections = maxSelections
        )
        SelectorStyle.Grid -> GridSelector(
            cards = cards,
            modifier = modifier,
            selectedIndices = selectedIndices,
            multiSelect = multiSelect,
            onCardSelect = onCardSelect,
            minSelections = minSelections,
            maxSelections = maxSelections
        )
        SelectorStyle.Wheel -> WheelSelector(
            cards = cards,
            modifier = modifier,
            selectedIndex = selectedIndices.firstOrNull() ?: -1,
            onCardSelect = { index -> onCardSelect(index, true) }
        )
    }
}

@Composable
private fun HorizontalSelector(
    cards: List<Card2DData>,
    modifier: Modifier,
    selectedIndices: Set<Int>,
    multiSelect: Boolean,
    onCardSelect: (Int, Boolean) -> Unit,
    minSelections: Int,
    maxSelections: Int
) {
    val listState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()
    
    Column(modifier = modifier) {
        LazyRow(
            state = listState,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(horizontal = 16.dp)
        ) {
            itemsIndexed(cards) { index, card ->
                val isSelected = selectedIndices.contains(index)
                val canSelect = !isSelected && selectedIndices.size < maxSelections
                val canDeselect = isSelected && selectedIndices.size > minSelections
                
                SelectableCard(
                    card = card,
                    isSelected = isSelected,
                    showCheckbox = multiSelect,
                    onClick = {
                        if (isSelected && canDeselect) {
                            onCardSelect(index, false)
                        } else if (!isSelected && canSelect) {
                            onCardSelect(index, true)
                        }
                    }
                )
            }
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        SelectionIndicator(
            selectedCount = selectedIndices.size,
            minSelections = minSelections,
            maxSelections = maxSelections,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
    }
}

@Composable
private fun GridSelector(
    cards: List<Card2DData>,
    modifier: Modifier,
    selectedIndices: Set<Int>,
    multiSelect: Boolean,
    onCardSelect: (Int, Boolean) -> Unit,
    minSelections: Int,
    maxSelections: Int
) {
    val columns = 3
    
    Column(modifier = modifier) {
        var index = 0
        val rows = (cards.size + columns - 1) / columns
        
        for (row in 0 until rows) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                for (col in 0 until columns) {
                    if (index < cards.size) {
                        val cardIndex = index
                        val isSelected = selectedIndices.contains(cardIndex)
                        val canSelect = !isSelected && selectedIndices.size < maxSelections
                        val canDeselect = isSelected && selectedIndices.size > minSelections
                        
                        SelectableCard(
                            card = cards[cardIndex],
                            isSelected = isSelected,
                            showCheckbox = multiSelect,
                            style = Card2DStyle.Compact,
                            onClick = {
                                if (isSelected && canDeselect) {
                                    onCardSelect(cardIndex, false)
                                } else if (!isSelected && canSelect) {
                                    onCardSelect(cardIndex, true)
                                }
                            },
                            modifier = Modifier.weight(1f)
                        )
                        index++
                    } else {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        SelectionIndicator(
            selectedCount = selectedIndices.size,
            minSelections = minSelections,
            maxSelections = maxSelections,
            modifier = Modifier.padding(horizontal = 16.dp)
        )
    }
}

@Composable
private fun WheelSelector(
    cards: List<Card2DData>,
    modifier: Modifier,
    selectedIndex: Int,
    onCardSelect: (Int) -> Unit
) {
    val listState = rememberLazyListState()
    val coroutineScope = rememberCoroutineScope()
    
    LaunchedEffect(selectedIndex) {
        if (selectedIndex >= 0) {
            listState.animateScrollToItem(selectedIndex)
        }
    }
    
    Box(
        modifier = modifier.height(200.dp),
        contentAlignment = Alignment.Center
    ) {
        LazyRow(
            state = listState,
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(horizontal = 100.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            itemsIndexed(cards) { index, card ->
                val isSelected = selectedIndex == index
                val distance = abs(index - selectedIndex)
                
                val scale by animateFloatAsState(
                    targetValue = when {
                        isSelected -> 1.2f
                        distance == 1 -> 0.85f
                        else -> 0.7f
                    },
                    animationSpec = spring(stiffness = Spring.StiffnessLow),
                    label = "scale$index"
                )
                
                val alpha by animateFloatAsState(
                    targetValue = when {
                        isSelected -> 1f
                        distance == 1 -> 0.6f
                        distance == 2 -> 0.3f
                        else -> 0.1f
                    },
                    animationSpec = tween(200),
                    label = "alpha$index"
                )
                
                Card2D(
                    card = card,
                    style = Card2DStyle.Standard,
                    modifier = Modifier
                        .graphicsLayer(
                            scaleX = scale,
                            scaleY = scale,
                            alpha = alpha
                        )
                        .clickable { onCardSelect(index) }
                )
            }
        }
        
        Box(
            modifier = Modifier
                .align(Alignment.Center)
                .fillMaxWidth()
                .height(180.dp)
                .border(2.dp, LegoRed.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                .background(LegoRed.copy(alpha = 0.1f), RoundedCornerShape(12.dp))
                .clickable { }
        )
    }
}

@Composable
private fun SelectableCard(
    card: Card2DData,
    isSelected: Boolean,
    showCheckbox: Boolean,
    style: Card2DStyle = Card2DStyle.Standard,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val animatedScale by animateFloatAsState(
        targetValue = if (isSelected) 1.05f else 1f,
        animationSpec = spring(stiffness = Spring.StiffnessLow),
        label = "scale"
    )
    
    Box(
        modifier = modifier
    ) {
        Card2D(
            card = card.copy(isSelected = isSelected),
            style = style,
            onClick = onClick,
            modifier = Modifier.graphicsLayer(
                scaleX = animatedScale,
                scaleY = animatedScale
            )
        )
        
        if (showCheckbox) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(4.dp)
                    .size(24.dp)
                    .background(
                        if (isSelected) LegoGreen else Color.White,
                        CircleShape
                    )
                    .border(2.dp, Color.Gray, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                if (isSelected) {
                    Text(
                        text = "✓",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp
                    )
                }
            }
        }
    }
}

@Composable
private fun SelectionIndicator(
    selectedCount: Int,
    minSelections: Int,
    maxSelections: Int,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = "已选择 $selectedCount",
            fontSize = 14.sp,
            color = if (selectedCount >= minSelections) LegoGreen else LegoRed
        )
        
        if (maxSelections < Int.MAX_VALUE) {
            Text(
                text = " / $maxSelections",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }
        
        if (selectedCount < minSelections) {
            Text(
                text = " (至少需要 $minSelections 个)",
                fontSize = 12.sp,
                color = LegoRed
            )
        }
    }
}
