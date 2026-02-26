/**
 * MagicParticles组件 - 魔法粒子背景效果
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  interpolate,
  Extrapolate,
  Easing,
} from 'react-native-reanimated';
import { PARTICLES_CONFIG, random, randomChoice } from '../../utils/animations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const MagicParticles = ({
  count = PARTICLES_CONFIG.magic.particleCount,
  colors = PARTICLES_CONFIG.magic.colors,
  enabled = true,
  showConnections = false,
}) => {
  if (!enabled) return null;

  // 生成粒子配置
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: `magic_${i}_${Date.now()}`,
      x: random(20, SCREEN_WIDTH - 20),
      y: random(20, SCREEN_HEIGHT - 20),
      size: random(3, 8),
      color: randomChoice(colors),
      initialOpacity: random(0.3, 0.8),
      floatDuration: random(3000, 6000),
      blinkDuration: random(1000, 3000),
      floatRange: random(30, 80),
      delay: random(0, 2000),
    }));
  }, [count, colors]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <MagicParticle key={particle.id} config={particle} />
      ))}
    </View>
  );
};

// 单个魔法粒子
const MagicParticle = ({ config }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const glow = useSharedValue(0);

  useEffect(() => {
    // 浮动动画
    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(-config.floatRange / 2, {
            duration: config.floatDuration / 2,
            easing: Easing.sin,
          }),
          withTiming(config.floatRange / 2, {
            duration: config.floatDuration / 2,
            easing: Easing.sin,
          })
        ),
        -1,
        true
      )
    );

    // 透明度闪烁动画
    opacity.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.initialOpacity, {
            duration: config.blinkDuration / 2,
            easing: EASINGS.sine,
          }),
          withTiming(config.initialOpacity * 0.3, {
            duration: config.blinkDuration / 2,
            easing: EASINGS.sine,
          })
        ),
        -1,
        true
      )
    );

    // 缩放动画
    scale.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: config.floatDuration / 3 }),
          withTiming(0.6, { duration: config.floatDuration / 3 })
        ),
        -1,
        true
      )
    );

    // 发光动画
    glow.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: config.blinkDuration / 2 }),
          withTiming(0.3, { duration: config.blinkDuration / 2 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: config.x },
      { translateY: config.y + translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.5,
    transform: [{ scale: 1.5 + glow.value * 0.5 }],
  }));

  return (
    <Animated.View style={[styles.particleContainer, animatedStyle]}>
      {/* 发光效果 */}
      <Animated.View
        style={[
          styles.particleGlow,
          {
            width: config.size * 3,
            height: config.size * 3,
            backgroundColor: config.color,
          },
          glowStyle,
        ]}
      />
      {/* 粒子核心 */}
      <View
        style={[
          styles.particle,
          {
            width: config.size,
            height: config.size,
            backgroundColor: config.color,
            shadowColor: config.color,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  particleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    borderRadius: 100,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  particleGlow: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.3,
  },
});

export default MagicParticles;
