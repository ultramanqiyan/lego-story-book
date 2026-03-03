package com.legostory.mobile.ui.components.card3d

import androidx.compose.animation.core.*
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import kotlin.math.abs
import kotlin.math.sin
import kotlin.math.cos

enum class DeckStyle {
    Stack, Fan, Grid, Carousel
}

@Composable
fun CardDeck3D(
    cards: List<Card3DData>,
    modifier: Modifier = Modifier,
    style: DeckStyle = DeckStyle.Fan,
    selectedCardIndex: Int? = null,
    onCardSelect: (Int) -> Unit = {},
    cardWidth: Int = 120,
    cardHeight: Int = 160
) {
    when (style) {
        DeckStyle.Stack -> StackDeck(
            cards = cards,
            modifier = modifier,
            selectedCardIndex = selectedCardIndex,
            onCardSelect = onCardSelect,
            cardWidth = cardWidth,
            cardHeight = cardHeight
        )
        DeckStyle.Fan -> FanDeck(
            cards = cards,
            modifier = modifier,
            selectedCardIndex = selectedCardIndex,
            onCardSelect = onCardSelect,
            cardWidth = cardWidth,
            cardHeight = cardHeight
        )
        DeckStyle.Grid -> GridDeck(
            cards = cards,
            modifier = modifier,
            selectedCardIndex = selectedCardIndex,
            onCardSelect = onCardSelect,
            cardWidth = cardWidth,
            cardHeight = cardHeight
        )
        DeckStyle.Carousel -> CarouselDeck(
            cards = cards,
            modifier = modifier,
            selectedCardIndex = selectedCardIndex,
            onCardSelect = onCardSelect,
            cardWidth = cardWidth,
            cardHeight = cardHeight
        )
    }
}

@Composable
private fun StackDeck(
    cards: List<Card3DData>,
    modifier: Modifier,
    selectedCardIndex: Int?,
    onCardSelect: (Int) -> Unit,
    cardWidth: Int,
    cardHeight: Int
) {
    val density = LocalDensity.current
    
    Box(
        modifier = modifier
            .width(cardWidth.dp)
            .height(cardHeight.dp)
    ) {
        cards.forEachIndexed { index, card ->
            val isSelected = selectedCardIndex == index
            val animatedOffsetY by animateDpAsState(
                targetValue = if (isSelected) (-20).dp else (-index * 5).dp,
                animationSpec = spring(stiffness = Spring.StiffnessLow),
                label = "offsetY$index"
            )
            val animatedScale by animateFloatAsState(
                targetValue = if (isSelected) 1.1f else 1f - (cards.size - index - 1) * 0.02f,
                animationSpec = spring(stiffness = Spring.StiffnessLow),
                label = "scale$index"
            )
            
            val offsetYPx = with(density) { animatedOffsetY.toPx() }
            val translationZ = index.toFloat()
            
            Card3D(
                card = card,
                modifier = Modifier
                    .width(cardWidth.dp)
                    .height(cardHeight.dp)
                    .graphicsLayer {
                        this.translationY = offsetYPx
                        this.scaleX = animatedScale
                        this.scaleY = animatedScale
                        this.shadowElevation = translationZ
                    },
                onClick = { onCardSelect(index) }
            )
        }
    }
}

@Composable
private fun FanDeck(
    cards: List<Card3DData>,
    modifier: Modifier,
    selectedCardIndex: Int?,
    onCardSelect: (Int) -> Unit,
    cardWidth: Int,
    cardHeight: Int
) {
    val fanAngle = 120f
    val radius = 200f
    val density = LocalDensity.current
    
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height((cardHeight + 100).dp)
    ) {
        cards.forEachIndexed { index, card ->
            val isSelected = selectedCardIndex == index
            val position = calculateFanPosition(index, cards.size, fanAngle, radius)
            
            val animatedY by animateDpAsState(
                targetValue = if (isSelected) (-30).dp else position.y.dp / 2,
                animationSpec = spring(stiffness = Spring.StiffnessLow),
                label = "y$index"
            )
            
            val animatedScale by animateFloatAsState(
                targetValue = if (isSelected) 1.15f else 1f,
                animationSpec = spring(stiffness = Spring.StiffnessLow),
                label = "scale$index"
            )
            
            val translationXPx = with(density) { position.x.dp.toPx() }
            val translationYPx = with(density) { animatedY.toPx() }
            val elevation = if (isSelected) 10f else index.toFloat()
            
            Card3D(
                card = card,
                modifier = Modifier
                    .width(cardWidth.dp)
                    .height(cardHeight.dp)
                    .graphicsLayer {
                        this.translationX = translationXPx
                        this.translationY = translationYPx
                        this.rotationZ = position.rotation
                        this.scaleX = animatedScale
                        this.scaleY = animatedScale
                        this.shadowElevation = elevation
                    },
                onClick = { onCardSelect(index) }
            )
        }
    }
}

@Composable
private fun GridDeck(
    cards: List<Card3DData>,
    modifier: Modifier,
    selectedCardIndex: Int?,
    onCardSelect: (Int) -> Unit,
    cardWidth: Int,
    cardHeight: Int
) {
    val columns = 3
    val rows = (cards.size + columns - 1) / columns
    
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        var cardIndex = 0
        for (row in 0 until rows) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                for (col in 0 until columns) {
                    if (cardIndex < cards.size) {
                        val isSelected = selectedCardIndex == cardIndex
                        val animatedScale by animateFloatAsState(
                            targetValue = if (isSelected) 1.1f else 1f,
                            animationSpec = spring(stiffness = Spring.StiffnessLow),
                            label = "scale$cardIndex"
                        )
                        
                        val elevation = if (isSelected) 10f else 0f
                        
                        Card3D(
                            card = cards[cardIndex],
                            modifier = Modifier
                                .width(cardWidth.dp)
                                .height(cardHeight.dp)
                                .graphicsLayer {
                                    this.scaleX = animatedScale
                                    this.scaleY = animatedScale
                                    this.shadowElevation = elevation
                                },
                            onClick = { onCardSelect(cardIndex) }
                        )
                        cardIndex++
                    } else {
                        Spacer(modifier = Modifier.width(cardWidth.dp))
                    }
                }
            }
        }
    }
}

@Composable
private fun CarouselDeck(
    cards: List<Card3DData>,
    modifier: Modifier,
    selectedCardIndex: Int?,
    onCardSelect: (Int) -> Unit,
    cardWidth: Int,
    cardHeight: Int
) {
    val selectedIndex = selectedCardIndex ?: cards.size / 2
    val density = LocalDensity.current
    
    Row(
        modifier = modifier
            .fillMaxWidth()
            .height((cardHeight + 40).dp),
        horizontalArrangement = Arrangement.Center
    ) {
        cards.forEachIndexed { index, card ->
            val isSelected = selectedIndex == index
            val distance = abs(index - selectedIndex)
            
            val animatedScale by animateFloatAsState(
                targetValue = when {
                    isSelected -> 1.2f
                    distance == 1 -> 0.9f
                    else -> 0.8f
                },
                animationSpec = spring(stiffness = Spring.StiffnessLow),
                label = "scale$index"
            )
            
            val animatedAlpha by animateFloatAsState(
                targetValue = when {
                    isSelected -> 1f
                    distance == 1 -> 0.7f
                    distance == 2 -> 0.4f
                    else -> 0.2f
                },
                animationSpec = tween(300),
                label = "alpha$index"
            )
            
            val offsetX = (index - selectedIndex) * (cardWidth + 20)
            val offsetXPx = with(density) { offsetX.dp.toPx() }
            val elevation = if (isSelected) 10f else -distance.toFloat()
            
            Card3D(
                card = card,
                modifier = Modifier
                    .width(cardWidth.dp)
                    .height(cardHeight.dp)
                    .graphicsLayer {
                        this.translationX = offsetXPx
                        this.scaleX = animatedScale
                        this.scaleY = animatedScale
                        this.alpha = animatedAlpha
                        this.shadowElevation = elevation
                    },
                onClick = { onCardSelect(index) }
            )
        }
    }
}
