/**
 * Card2D组件 - 5种2D卡片展示样式
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

const Card2D = ({
  icon = '🎭',
  name = 'Card',
  variant = 'default',
  style = 'flip',
  isSelected = false,
  onPress,
  width = CARD_WIDTH,
  height = CARD_HEIGHT,
  delay = 0,
}) => {
  const animValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    animValue.value = withDelay(delay, withTiming(1, { duration: 500 }));
  }, [delay, animValue]);

  useEffect(() => {
    if (isSelected) {
      scaleValue.value = withSpring(1.1, { damping: 12, stiffness: 200 });
    } else {
      scaleValue.value = withSpring(1, { damping: 12, stiffness: 200 });
    }
  }, [isSelected, scaleValue]);

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

  const flipStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(animValue.value, [0, 1], [180, 0]);
    const opacity = interpolate(animValue.value, [0, 0.5, 1], [0, 0.5, 1]);
    
    return {
      transform: [
        { perspective: 1000 },
        { rotateY: `${rotateY}deg` },
        { scale: scaleValue.value },
      ],
      opacity,
    };
  });

  const slideStyle = useAnimatedStyle(() => {
    const translateX = interpolate(animValue.value, [0, 1], [-100, 0]);
    const opacity = interpolate(animValue.value, [0, 1], [0, 1]);
    
    return {
      transform: [
        { translateX },
        { scale: scaleValue.value },
      ],
      opacity,
    };
  });

  const scaleStyle = useAnimatedStyle(() => {
    const scale = interpolate(animValue.value, [0, 1], [0, 1]);
    
    return {
      transform: [
        { scale: scale * scaleValue.value },
      ],
      opacity: animValue.value,
    };
  });

  const rotateStyle = useAnimatedStyle(() => {
    const rotate = interpolate(animValue.value, [0, 1], [-180, 0]);
    
    return {
      transform: [
        { rotate: `${rotate}deg` },
        { scale: scaleValue.value },
      ],
      opacity: animValue.value,
    };
  });

  const bounceStyle = useAnimatedStyle(() => {
    const translateY = interpolate(animValue.value, [0, 0.5, 0.7, 1], [-200, 20, -10, 0]);
    
    return {
      transform: [
        { translateY },
        { scale: scaleValue.value },
      ],
      opacity: animValue.value,
    };
  });

  const getAnimatedStyle = () => {
    switch (style) {
      case 'flip':
        return flipStyle;
      case 'slide':
        return slideStyle;
      case 'scale':
        return scaleStyle;
      case 'rotate':
        return rotateStyle;
      case 'bounce':
        return bounceStyle;
      default:
        return flipStyle;
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

export default Card2D;
