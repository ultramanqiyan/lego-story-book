package com.legostory.mobile.ui.animation

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.layout.offset
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.scale
import androidx.compose.ui.unit.dp

object AnimationUtils {

    @Composable
    fun FadeInAnimation(
        visible: Boolean,
        durationMillis: Int = 300,
        content: @Composable () -> Unit
    ) {
        AnimatedVisibility(
            visible = visible,
            enter = fadeIn(animationSpec = tween(durationMillis)),
            exit = fadeOut(animationSpec = tween(durationMillis))
        ) {
            content()
        }
    }

    @Composable
    fun SlideInAnimation(
        visible: Boolean,
        direction: SlideDirection = SlideDirection.UP,
        durationMillis: Int = 300,
        content: @Composable () -> Unit
    ) {
        val enter = when (direction) {
            SlideDirection.UP -> slideInVertically(
                initialOffsetY = { it },
                animationSpec = tween(durationMillis)
            )
            SlideDirection.DOWN -> slideInVertically(
                initialOffsetY = { -it },
                animationSpec = tween(durationMillis)
            )
            SlideDirection.LEFT -> slideInHorizontally(
                initialOffsetX = { it },
                animationSpec = tween(durationMillis)
            )
            SlideDirection.RIGHT -> slideInHorizontally(
                initialOffsetX = { -it },
                animationSpec = tween(durationMillis)
            )
        }

        val exit = when (direction) {
            SlideDirection.UP -> slideOutVertically(
                targetOffsetY = { -it },
                animationSpec = tween(durationMillis)
            )
            SlideDirection.DOWN -> slideOutVertically(
                targetOffsetY = { it },
                animationSpec = tween(durationMillis)
            )
            SlideDirection.LEFT -> slideOutHorizontally(
                targetOffsetX = { -it },
                animationSpec = tween(durationMillis)
            )
            SlideDirection.RIGHT -> slideOutHorizontally(
                targetOffsetX = { it },
                animationSpec = tween(durationMillis)
            )
        }

        AnimatedVisibility(
            visible = visible,
            enter = enter + fadeIn(),
            exit = exit + fadeOut()
        ) {
            content()
        }
    }

    @Composable
    fun ScaleAnimation(
        visible: Boolean,
        durationMillis: Int = 300,
        content: @Composable () -> Unit
    ) {
        AnimatedVisibility(
            visible = visible,
            enter = scaleIn(
                initialScale = 0.8f,
                animationSpec = tween(durationMillis)
            ) + fadeIn(),
            exit = scaleOut(
                targetScale = 0.8f,
                animationSpec = tween(durationMillis)
            ) + fadeOut()
        ) {
            content()
        }
    }

    @Composable
    fun ShakeAnimation(
        shake: Boolean,
        content: @Composable (Modifier) -> Unit
    ) {
        val offsetX by animateFloatAsState(
            targetValue = if (shake) 10f else 0f,
            animationSpec = repeatable(
                iterations = 3,
                animation = tween(50),
                repeatMode = RepeatMode.Reverse
            ),
            label = "shake"
        )

        content(Modifier.offset(x = offsetX.dp))
    }

    @Composable
    fun PulseAnimation(
        pulse: Boolean,
        content: @Composable (Modifier) -> Unit
    ) {
        val scale by animateFloatAsState(
            targetValue = if (pulse) 1.1f else 1f,
            animationSpec = tween(200),
            label = "pulse"
        )

        content(Modifier.scale(scale))
    }

    @Composable
    fun BounceAnimation(
        bounce: Boolean,
        content: @Composable (Modifier) -> Unit
    ) {
        val offsetY by animateFloatAsState(
            targetValue = if (bounce) -20f else 0f,
            animationSpec = spring(
                dampingRatio = Spring.DampingRatioMediumBouncy,
                stiffness = Spring.StiffnessLow
            ),
            label = "bounce"
        )

        content(Modifier.offset(y = offsetY.dp))
    }

    @Composable
    fun CardFlipAnimation(
        flipped: Boolean,
        front: @Composable () -> Unit,
        back: @Composable () -> Unit
    ) {
        val rotation by animateFloatAsState(
            targetValue = if (flipped) 180f else 0f,
            animationSpec = tween(400),
            label = "flip"
        )

        if (rotation <= 90f) {
            front()
        } else {
            back()
        }
    }

    @Composable
    fun StaggeredAnimation(
        itemCount: Int,
        content: @Composable (index: Int, Modifier) -> Unit
    ) {
        repeat(itemCount) { index ->
            val visible by animateFloatAsState(
                targetValue = 1f,
                animationSpec = tween(
                    durationMillis = 300,
                    delayMillis = index * 100
                ),
                label = "stagger_$index"
            )

            content(index, Modifier.alpha(visible))
        }
    }

    enum class SlideDirection {
        UP, DOWN, LEFT, RIGHT
    }
}

object PageTransitions {

    val slideInFromRight: AnimatedContentTransitionScope<*>.() -> EnterTransition = {
        slideInHorizontally(
            initialOffsetX = { it },
            animationSpec = tween(300)
        ) + fadeIn()
    }

    val slideOutToLeft: AnimatedContentTransitionScope<*>.() -> ExitTransition = {
        slideOutHorizontally(
            targetOffsetX = { -it },
            animationSpec = tween(300)
        ) + fadeOut()
    }

    val slideInFromLeft: AnimatedContentTransitionScope<*>.() -> EnterTransition = {
        slideInHorizontally(
            initialOffsetX = { -it },
            animationSpec = tween(300)
        ) + fadeIn()
    }

    val slideOutToRight: AnimatedContentTransitionScope<*>.() -> ExitTransition = {
        slideOutHorizontally(
            targetOffsetX = { it },
            animationSpec = tween(300)
        ) + fadeOut()
    }

    val fadeIn: AnimatedContentTransitionScope<*>.() -> EnterTransition = {
        fadeIn(animationSpec = tween(300))
    }

    val fadeOut: AnimatedContentTransitionScope<*>.() -> ExitTransition = {
        fadeOut(animationSpec = tween(300))
    }
}
