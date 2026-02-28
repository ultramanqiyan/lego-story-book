import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../styles/colors';
import { ANIMATIONS } from '../styles/animations';

export const ShimmerEffect = ({
  children,
  color = COLORS.gold.primary,
  width = 200,
  height = 200,
  duration = ANIMATIONS.duration.shimmer,
  style,
  testID,
}) => {
  const shimmerPosition = useSharedValue(-width);

  useEffect(() => {
    shimmerPosition.value = withRepeat(
      withTiming(width * 2, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerPosition.value }],
  }));

  return (
    <View style={[styles.container, { width, height }, style]} testID={testID}>
      {children}
      <Animated.View
        style={[
          styles.shimmer,
          {
            width: width * 0.3,
            height,
            backgroundColor: color,
          },
          shimmerStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.3,
    transform: [{ skewX: '-20deg' }],
  },
});

export default ShimmerEffect;
