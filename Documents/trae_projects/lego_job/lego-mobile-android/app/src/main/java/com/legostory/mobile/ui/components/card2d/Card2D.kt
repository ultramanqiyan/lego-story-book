package com.legostory.mobile.ui.components.card2d

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.sp
import com.legostory.mobile.ui.components.card3d.CardRarity
import com.legostory.mobile.ui.components.card3d.color
import com.legostory.mobile.ui.theme.*

data class Card2DData(
    val id: String,
    val title: String,
    val subtitle: String = "",
    val description: String = "",
    val imageUrl: String? = null,
    val backgroundColor: Color = LegoRed,
    val rarity: CardRarity = CardRarity.Common,
    val isSelected: Boolean = false,
    val badge: String? = null
)

enum class Card2DStyle {
    Compact, Standard, Large, Wide
}

@Composable
fun Card2D(
    card: Card2DData,
    modifier: Modifier = Modifier,
    style: Card2DStyle = Card2DStyle.Standard,
    onClick: () -> Unit = {},
    onLongClick: () -> Unit = {}
) {
    var isPressed by remember { mutableStateOf(false) }
    
    val scale by animateFloatAsState(
        targetValue = if (isPressed) 0.95f else 1f,
        animationSpec = spring(stiffness = Spring.StiffnessMedium),
        label = "scale"
    )
    
    val elevation by animateDpAsState(
        targetValue = if (card.isSelected) 8.dp else 4.dp,
        animationSpec = tween(200),
        label = "elevation"
    )
    
    when (style) {
        Card2DStyle.Compact -> CompactCard2D(
            card = card,
            modifier = modifier.scale(scale),
            onClick = onClick
        )
        Card2DStyle.Standard -> StandardCard2D(
            card = card,
            modifier = modifier.scale(scale),
            elevation = elevation,
            onClick = onClick
        )
        Card2DStyle.Large -> LargeCard2D(
            card = card,
            modifier = modifier.scale(scale),
            elevation = elevation,
            onClick = onClick
        )
        Card2DStyle.Wide -> WideCard2D(
            card = card,
            modifier = modifier.scale(scale),
            elevation = elevation,
            onClick = onClick
        )
    }
}

@Composable
private fun CompactCard2D(
    card: Card2DData,
    modifier: Modifier,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .width(80.dp)
            .height(100.dp)
            .clickable(onClick = onClick)
            .then(
                if (card.isSelected) {
                    Modifier.border(2.dp, card.rarity.color(), RoundedCornerShape(8.dp))
                } else {
                    Modifier
                }
            ),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = card.backgroundColor),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(8.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = card.title,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
            }
            
            if (card.badge != null) {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(4.dp)
                        .size(16.dp)
                        .background(card.rarity.color(), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = card.badge,
                        fontSize = 8.sp,
                        color = Color.White
                    )
                }
            }
        }
    }
}

@Composable
private fun StandardCard2D(
    card: Card2DData,
    modifier: Modifier,
    elevation: Dp,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .width(140.dp)
            .height(180.dp)
            .clickable(onClick = onClick)
            .then(
                if (card.isSelected) {
                    Modifier.border(3.dp, card.rarity.color(), RoundedCornerShape(12.dp))
                } else {
                    Modifier
                }
            ),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = card.backgroundColor),
        elevation = CardDefaults.cardElevation(defaultElevation = elevation)
    ) {
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(12.dp)
            ) {
                if (card.badge != null) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RarityBadge(rarity = card.rarity)
                        Text(
                            text = card.badge,
                            fontSize = 10.sp,
                            color = Color.White.copy(alpha = 0.8f)
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                } else {
                    RarityBadge(rarity = card.rarity)
                    Spacer(modifier = Modifier.height(12.dp))
                }
                
                Text(
                    text = card.title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                
                if (card.subtitle.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = card.subtitle,
                        fontSize = 12.sp,
                        color = Color.White.copy(alpha = 0.8f),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                
                Spacer(modifier = Modifier.weight(1f))
                
                if (card.description.isNotEmpty()) {
                    Text(
                        text = card.description,
                        fontSize = 11.sp,
                        color = Color.White.copy(alpha = 0.7f),
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
            
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(60.dp)
                    .align(Alignment.BottomCenter)
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color.Transparent,
                                Color.Black.copy(alpha = 0.3f)
                            )
                        )
                    )
            )
        }
    }
}

@Composable
private fun LargeCard2D(
    card: Card2DData,
    modifier: Modifier,
    elevation: Dp,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .width(200.dp)
            .height(260.dp)
            .clickable(onClick = onClick)
            .then(
                if (card.isSelected) {
                    Modifier.border(3.dp, card.rarity.color(), RoundedCornerShape(16.dp))
                } else {
                    Modifier
                }
            ),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = card.backgroundColor),
        elevation = CardDefaults.cardElevation(defaultElevation = elevation)
    ) {
        Box(
            modifier = Modifier.fillMaxSize()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    RarityBadge(rarity = card.rarity)
                    if (card.badge != null) {
                        Surface(
                            shape = RoundedCornerShape(4.dp),
                            color = Color.Black.copy(alpha = 0.3f)
                        ) {
                            Text(
                                text = card.badge,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                fontSize = 12.sp,
                                color = Color.White
                            )
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    text = card.title,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis
                )
                
                if (card.subtitle.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = card.subtitle,
                        fontSize = 16.sp,
                        color = Color.White.copy(alpha = 0.8f),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
                
                Spacer(modifier = Modifier.weight(1f))
                
                if (card.description.isNotEmpty()) {
                    Text(
                        text = card.description,
                        fontSize = 14.sp,
                        color = Color.White.copy(alpha = 0.7f),
                        maxLines = 3,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
private fun WideCard2D(
    card: Card2DData,
    modifier: Modifier,
    elevation: Dp,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .height(100.dp)
            .clickable(onClick = onClick)
            .then(
                if (card.isSelected) {
                    Modifier.border(2.dp, card.rarity.color(), RoundedCornerShape(12.dp))
                } else {
                    Modifier
                }
            ),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = card.backgroundColor),
        elevation = CardDefaults.cardElevation(defaultElevation = elevation)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(60.dp)
                    .background(Color.White.copy(alpha = 0.2f), RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "🧱", fontSize = 28.sp)
            }
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column(
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    text = card.title,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                
                if (card.subtitle.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = card.subtitle,
                        fontSize = 14.sp,
                        color = Color.White.copy(alpha = 0.8f),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
            
            RarityBadge(rarity = card.rarity)
        }
    }
}

@Composable
private fun RarityBadge(rarity: CardRarity) {
    Surface(
        shape = RoundedCornerShape(4.dp),
        color = rarity.color()
    ) {
        Text(
            text = when (rarity) {
                CardRarity.Common -> "普通"
                CardRarity.Uncommon -> "优秀"
                CardRarity.Rare -> "稀有"
                CardRarity.Epic -> "史诗"
                CardRarity.Legendary -> "传说"
            },
            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White
        )
    }
}
