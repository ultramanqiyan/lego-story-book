import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../styles/colors';
import { ANIMATIONS } from '../styles/animations';

export const GlowEffect = ({
  children,
  color = COLORS.gold.primary,
  radius = ANIMATIONS.glow.radius.medium,
  animated = true,
  pulse = false,
  intensity = 0.5,
  style,
  testID,
}) => {
  const glowOpacity = useSharedValue(intensity);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    if (animated && pulse) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(ANIMATIONS.glow.animation.maxOpacity, {
            duration: ANIMATIONS.glow.animation.duration,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(ANIMATIONS.glow.animation.minOpacity, {
            duration: ANIMATIONS.glow.animation.duration,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      );

      glowScale.value = withRepeat(
        withSequence(
          withTiming(1.1, {
            duration: ANIMATIONS.glow.animation.duration,
            easing: Easing.inOut(Easing.sin),
          }),
          withTiming(1, {
            duration: ANIMATIONS.glow.animation.duration,
            easing: Easing.inOut(Easing.sin),
          })
        ),
        -1,
        true
      );
    }
  }, [animated, pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: color,
            width: radius * 4,
            height: radius * 4,
            borderRadius: radius * 2,
          },
          glowStyle,
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    zIndex: 1,
  },
});

export default GlowEffect;
