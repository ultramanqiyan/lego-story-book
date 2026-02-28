import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../styles/colors';
import { ANIMATIONS } from '../styles/animations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Particle = ({ index, count, color, size, speed }) => {
  const x = useSharedValue(Math.random() * SCREEN_WIDTH);
  const y = useSharedValue(Math.random() * SCREEN_HEIGHT);
  const opacity = useSharedValue(ANIMATIONS.particle.opacity.min);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    const duration = speed.max * 10000 + Math.random() * 10000;
    const delay = (index / count) * 2000;

    x.value = withDelay(
      delay,
      withRepeat(
        withTiming(Math.random() * SCREEN_WIDTH, {
          duration,
          easing: Easing.linear,
        }),
        -1,
        true
      )
    );

    y.value = withDelay(
      delay,
      withRepeat(
        withTiming(Math.random() * SCREEN_HEIGHT, {
          duration: duration * 0.8,
          easing: Easing.linear,
        }),
        -1,
        true
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(ANIMATIONS.particle.opacity.max, {
          duration: duration * 0.5,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: duration * 0.3,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
};

export const ParticleBackground = ({
  count = ANIMATIONS.particle.count,
  color = COLORS.gold.primary,
  colors,
  size = ANIMATIONS.particle.size.min,
  style,
  testID,
}) => {
  const particleCount = Math.min(count, 100);
  const particleColors = colors || [color];

  const getParticleColor = (index) => {
    return particleColors[index % particleColors.length];
  };

  const getParticleSize = () => {
    const { min, max } = ANIMATIONS.particle.size;
    return size + Math.random() * (max - min);
  };

  return (
    <View style={[styles.container, style]} testID={testID} pointerEvents="none">
      {Array.from({ length: particleCount }).map((_, index) => (
        <Particle
          key={index}
          index={index}
          count={particleCount}
          color={getParticleColor(index)}
          size={getParticleSize()}
          speed={ANIMATIONS.particle.speed}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
  },
});

export default ParticleBackground;
