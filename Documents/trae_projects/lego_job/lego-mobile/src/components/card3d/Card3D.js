/**
 * Card3D组件 - 3D翻转卡牌，带悬浮倾斜效果
 * 统一版本：Web端和移动端效果一致
 */

import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { use3DCard } from '../../hooks/use3DCard';
import { COLORS } from '../../utils/constants';
import { CARD_3D_CONFIG } from '../../utils/animations';
import logger from '../../utils/logger';

const Card3D = ({
  frontContent,
  backContent,
  icon,
  name,
  isSelected = false,
  onPress,
  onFlip,
  width = CARD_3D_CONFIG.cardWidth,
  height = CARD_3D_CONFIG.cardHeight,
  style,
  enableTilt = true,
  enableFlip = true,
  variant = 'default',
}) => {
  const {
    frontAnimatedStyle,
    backAnimatedStyle,
    shadowAnimatedStyle,
    glowAnimatedStyle,
    gesture,
    updateLayout,
    animateSelect,
    flipCard,
  } = use3DCard({
    onFlip,
    onPress,
    enableTilt,
    enableFlip,
  });

  const [isWeb, setIsWeb] = useState(false);

  useEffect(() => {
    logger.component.mount('Card3D', { name, variant });
    return () => logger.component.unmount('Card3D');
  }, []);

  useEffect(() => {
    setIsWeb(Platform.OS === 'web');
  }, []);

  useEffect(() => {
    animateSelect(isSelected);
  }, [isSelected, animateSelect]);

  // 获取变体样式
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { borderColor: COLORS.legoYellow, backgroundColor: COLORS.legoYellow };
      case 'secondary':
        return { borderColor: COLORS.legoBlue, backgroundColor: COLORS.legoBlue };
      case 'success':
        return { borderColor: COLORS.legoGreen, backgroundColor: COLORS.legoGreen };
      case 'danger':
        return { borderColor: '#FF6B6B', backgroundColor: '#FF6B6B' };
      default:
        return { borderColor: COLORS.border, backgroundColor: COLORS.white };
    }
  };

  const variantStyles = getVariantStyles();

  // 卡片内容
  const cardContent = (
    <>
      {/* 发光效果层 */}
      <Animated.View
        style={[
          styles.glowLayer,
          glowAnimatedStyle,
          { width: width + 10, height: height + 10 },
        ]}
      >
        <View
          style={[
            styles.glow,
            { backgroundColor: variantStyles.borderColor },
          ]}
        />
      </Animated.View>

      {/* 阴影层 */}
      <Animated.View
        style={[
          styles.shadowLayer,
          shadowAnimatedStyle,
          { width, height },
        ]}
      >
        <View
          style={[
            styles.shadowCard,
            { backgroundColor: variantStyles.borderColor },
          ]}
        />
      </Animated.View>

      {/* 正面 */}
      <Animated.View
        style={[
          styles.cardFace,
          styles.cardFront,
          frontAnimatedStyle,
          { width, height },
        ]}
        onLayout={updateLayout}
      >
        <View
          style={[
            styles.cardContent,
            { backgroundColor: variantStyles.backgroundColor },
            { borderColor: variantStyles.borderColor },
          ]}
        >
          {frontContent || (
            <>
              <Text style={styles.cardIcon}>{icon || '🎭'}</Text>
              <Text style={styles.cardName} numberOfLines={1}>
                {name || 'Card'}
              </Text>
            </>
          )}
        </View>
      </Animated.View>

      {/* 背面 */}
      <Animated.View
        style={[
          styles.cardFace,
          styles.cardBack,
          backAnimatedStyle,
          { width, height },
        ]}
      >
        <View
          style={[
            styles.cardContent,
            styles.cardBackContent,
            { borderColor: variantStyles.borderColor },
          ]}
        >
          {backContent || (
            <>
              <View style={styles.legoPattern}>
                {[...Array(4)].map((_, i) => (
                  <View key={i} style={styles.legoDot} />
                ))}
              </View>
              <Text style={styles.backText}>🧱</Text>
            </>
          )}
        </View>
      </Animated.View>

      {/* 选中标记 */}
      {isSelected && (
        <View style={styles.selectedBadge}>
          <Text style={styles.selectedText}>✓</Text>
        </View>
      )}
    </>
  );

  // Web端使用TouchableOpacity处理点击
  if (isWeb) {
    return (
      <TouchableOpacity 
        style={[styles.container, { width, height }, style]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  // 移动端使用GestureDetector
  return (
    <GestureDetector gesture={gesture}>
      <View style={[styles.container, { width, height }, style]}>
        {cardContent}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowLayer: {
    position: 'absolute',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    opacity: 0.4,
  },
  shadowLayer: {
    position: 'absolute',
    borderRadius: 12,
  },
  shadowCard: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    opacity: 0.3,
  },
  cardFace: {
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 12,
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
  },
  cardContent: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  cardBackContent: {
    backgroundColor: COLORS.background,
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  cardName: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  legoPattern: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 40,
    height: 40,
    justifyContent: 'space-between',
    alignContent: 'space-between',
    marginBottom: 8,
  },
  legoDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.legoYellow,
    opacity: 0.6,
  },
  backText: {
    fontSize: 24,
  },
  selectedBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.legoGreen,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Card3D;
