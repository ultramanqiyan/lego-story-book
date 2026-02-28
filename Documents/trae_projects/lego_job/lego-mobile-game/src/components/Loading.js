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

const Brick = ({ delay, size, color }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    const animate = () => {
      scale.value = withSequence(
        withTiming(1.2, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
      rotation.value = withSequence(
        withTiming(10, { duration: 150 }),
        withTiming(-10, { duration: 150 }),
        withTiming(0, { duration: 150 })
      );
    };

    const interval = setInterval(animate, 600 + delay);
    return () => clearInterval(interval);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        styles.brick,
        { width: size, height: size * 0.6, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

export const Loading = ({
  size = 'medium',
  color = COLORS.gold.primary,
  colors,
  style,
  testID,
}) => {
  const sizes = {
    small: { brick: 16, gap: 4 },
    medium: { brick: 24, gap: 6 },
    large: { brick: 32, gap: 8 },
  };

  const config = sizes[size] || sizes.medium;
  const brickColors = colors || [color, '#006cb7', '#e3000f'];

  return (
    <View style={[styles.container, style]} testID={testID}>
      <View style={[styles.brickContainer, { gap: config.gap }]}>
        {brickColors.map((brickColor, index) => (
          <Brick
            key={index}
            delay={index * 200}
            size={config.brick}
            color={brickColor}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  brickContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brick: {
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
});

export default Loading;
