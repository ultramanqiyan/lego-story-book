/**
 * Card3D组件 - 3D翻转卡牌
 * 完全使用 React Native Animated API
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Animated, Easing } from 'react-native';
import { COLORS } from '../../utils/constants';
import logger from '../../utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SIZE = SCREEN_WIDTH * 0.4;
const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const Card3D = ({
  frontContent,
  backContent,
  icon,
  name,
  isSelected = false,
  onPress,
  onFlip,
  width = CARD_SIZE,
  height = CARD_SIZE * 1.3,
  style,
  variant = 'default',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    logger.component.mount('Card3D', { name, variant });
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 80,
      friction: 7,
      useNativeDriver: true,
    }).start();
    return () => logger.component.unmount('Card3D');
  }, []);

  useEffect(() => {
    if (isSelected) {
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected]);

  const handlePress = () => {
    logger.component.action('Card3D', 'handlePress', { name, isFlipped });
    
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      easing: BOUNCE_EASING,
      useNativeDriver: true,
    }).start();

    setIsFlipped(!isFlipped);

    if (onFlip) {
      onFlip(!isFlipped);
    }

    if (onPress) {
      onPress();
    }
  };

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
        return COLORS.border || '#c0c0c0';
    }
  };

  const borderColor = getVariantColor();

  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0.4, 0.5],
    outputRange: [1, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0.5, 0.6],
    outputRange: [0, 1],
  });

  const scale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { width, height },
        { opacity: scaleAnim, transform: [{ scale }] },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        style={styles.touchable}
      >
        <View style={styles.cardContainer}>
          <Animated.View
            style={[
              styles.card,
              styles.cardFront,
              {
                borderColor: borderColor,
                transform: [
                  { perspective: 1000 },
                  { rotateY: frontRotateY },
                ],
                opacity: frontOpacity,
              },
            ]}
          >
            {frontContent || (
              <View style={styles.contentWrapper}>
                <Text style={styles.cardIcon}>{icon || '🎭'}</Text>
                <Text style={styles.cardName}>{name || 'Card'}</Text>
                <Text style={styles.tapHint}>点击翻转</Text>
              </View>
            )}
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              styles.cardBack,
              {
                borderColor: borderColor,
                transform: [
                  { perspective: 1000 },
                  { rotateY: backRotateY },
                ],
                opacity: backOpacity,
              },
            ]}
          >
            {backContent || (
              <View style={styles.contentWrapper}>
                <Text style={styles.cardIcon}>{icon || '🎭'}</Text>
                <Text style={styles.cardName}>{name || 'Card'}</Text>
                <Text style={styles.cardStats}>翻转查看详情</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </TouchableOpacity>

      {isSelected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedText}>✓</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardFront: {
    backgroundColor: '#FFF8E7',
  },
  cardBack: {
    backgroundColor: '#FFFDE7',
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 6,
  },
  cardStats: {
    fontSize: 13,
    color: '#795548',
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 6,
  },
  selectedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.legoGreen,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Card3D;
