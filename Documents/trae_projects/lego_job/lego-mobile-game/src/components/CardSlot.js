import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { ANIMATIONS } from '../styles/animations';
import { TYPOGRAPHY } from '../styles/typography';

export const CardSlot = ({
  children,
  style,
  size = 'medium',
  label,
  filled = false,
  onDrop,
  highlight = false,
  testID,
}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  React.useEffect(() => {
    if (highlight) {
      glow.value = withSequence(
        withTiming(1, { duration: ANIMATIONS.duration.fast }),
        withTiming(0.5, { duration: ANIMATIONS.duration.normal })
      );
    }
  }, [highlight]);

  React.useEffect(() => {
    if (filled) {
      scale.value = withSpring(1, ANIMATIONS.spring.bouncy);
    }
  }, [filled]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: glow.value * 0.5,
  }));

  const sizes = {
    small: { width: 80, height: 110 },
    medium: { width: 120, height: 170 },
    large: { width: 160, height: 220 },
  };

  const slotSize = sizes[size] || sizes.medium;

  if (filled && children) {
    return (
      <Animated.View style={[styles.container, style]} testID={testID}>
        {children}
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.slot,
        slotSize,
        highlight && styles.highlightSlot,
        style,
        animatedStyle,
      ]}
      testID={testID}
    >
      {label && <Text style={styles.label}>{label}</Text>}
      {!filled && (
        <View style={styles.emptyIndicator}>
          <Text style={styles.emptyText}>+</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  slot: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border.gold,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gold.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0,
  },
  highlightSlot: {
    borderColor: COLORS.gold.primary,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderStyle: 'solid',
  },
  label: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
    position: 'absolute',
    bottom: -20,
  },
  emptyIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 32,
    color: COLORS.text.secondary,
    opacity: 0.5,
  },
});

export default CardSlot;
