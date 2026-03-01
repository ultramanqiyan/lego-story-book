/**
 * Card3DVariant组件 - 5种3D卡片展示样式
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../../utils/constants';

const CARD_WIDTH = 80;
const CARD_HEIGHT = 110;

const Card3DVariant = ({
  icon = '🎭',
  name = 'Card',
  variant = 'default',
  style = 'flip3d',
  isSelected = false,
  onPress,
  width = CARD_WIDTH,
  height = CARD_HEIGHT,
  delay = 0,
}) => {
  const animValue = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    animValue.value = withDelay(delay, withTiming(1, { duration: 600 }));
  }, [delay, animValue]);

  useEffect(() => {
    if (isSelected) {
      scaleValue.value = withSpring(1.15, { damping: 12, stiffness: 200 });
      tiltX.value = withSpring(-10, { damping: 15, stiffness: 150 });
      tiltY.value = withSpring(15, { damping: 15, stiffness: 150 });
    } else {
      scaleValue.value = withSpring(1, { damping: 12, stiffness: 200 });
      tiltX.value = withSpring(0, { damping: 15, stiffness: 150 });
      tiltY.value = withSpring(0, { damping: 15, stiffness: 150 });
    }
  }, [isSelected, scaleValue, tiltX, tiltY]);

  const getVariantColor = () => {
    switch (variant) {
      case 'primary':
        return COLORS.legoYellow;
      case 'secondary':
        return COLORS.legoBlue;
      case 'success':
        return COLORS.legoGreen;
      case 'danger':
        return '#FF6B6B';
      default:
        return COLORS.border;
    }
  };

  const variantColor = getVariantColor();

  const flip3DStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(animValue.value, [0, 1], [180, 0]);
    const opacity = interpolate(animValue.value, [0, 0.5, 1], [0, 0.5, 1]);
    
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { rotateX: `${tiltX.value}deg` },
        { scale: scaleValue.value },
      ],
      opacity,
    };
  });

  const rotate3DStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(animValue.value, [0, 1], [-90, 0]);
    const rotateX = interpolate(animValue.value, [0, 1], [45, 0]);
    
    return {
      transform: [
        { perspective: 1000 },
        { rotateZ: `${rotateZ}deg` },
        { rotateX: `${rotateX + tiltX.value}deg` },
        { scale: scaleValue.value },
      ],
      opacity: animValue.value,
    };
  });

  const perspective3DStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(animValue.value, [0, 1], [60, 0]);
    const translateY = interpolate(animValue.value, [0, 1], [50, 0]);
    
    return {
      transform: [
        { perspective: 500 },
        { rotateX: `${rotateX + tiltX.value}deg` },
        { translateY },
        { scale: scaleValue.value },
      ],
      opacity: animValue.value,
    };
  });

  const tilt3DStyle = useAnimatedStyle(() => {
    const rotateX = interpolate(animValue.value, [0, 1], [-30, 0]);
    const rotateY = interpolate(animValue.value, [0, 1], [45, 0]);
    
    return {
      transform: [
        { perspective: 800 },
        { rotateX: `${rotateX + tiltX.value}deg` },
        { rotateY: `${rotateY + tiltY.value}deg` },
        { scale: scaleValue.value },
      ],
      opacity: animValue.value,
    };
  });

  const depth3DStyle = useAnimatedStyle(() => {
    const translateZ = interpolate(animValue.value, [0, 1], [-100, 0]);
    const scale = interpolate(animValue.value, [0, 1], [0.5, 1]);
    
    return {
      transform: [
        { perspective: 1000 },
        { translateX: translateZ },
        { scale: scale * scaleValue.value },
        { rotateX: `${tiltX.value}deg` },
        { rotateY: `${tiltY.value}deg` },
      ],
      opacity: animValue.value,
    };
  });

  const getAnimatedStyle = () => {
    switch (style) {
      case 'flip3d':
        return flip3DStyle;
      case 'rotate3d':
        return rotate3DStyle;
      case 'perspective3d':
        return perspective3DStyle;
      case 'tilt3d':
        return tilt3DStyle;
      case 'depth3d':
        return depth3DStyle;
      default:
        return flip3DStyle;
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.card,
          { width, height, borderColor: variantColor },
          getAnimatedStyle(),
        ]}
      >
        <View style={[styles.cardContent, { backgroundColor: COLORS.white }]}>
          <Text style={styles.cardIcon}>{icon}</Text>
          <Text style={styles.cardName} numberOfLines={1}>{name}</Text>
        </View>
        
        {isSelected && (
          <View style={[styles.selectedBadge, { backgroundColor: variantColor }]}>
            <Text style={styles.selectedText}>✓</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  cardIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default Card3DVariant;
