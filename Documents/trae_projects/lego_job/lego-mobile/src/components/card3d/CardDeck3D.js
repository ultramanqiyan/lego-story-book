/**
 * CardDeck3D组件 - 3D卡牌组，带扇形展开和堆叠效果
 */

import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import Card3D from './Card3D';
import { COLORS } from '../../utils/constants';
import { CARD_3D_CONFIG, EASINGS, calculateFanAngle } from '../../utils/animations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CardDeck3D = ({
  title,
  items,
  selectedId,
  onSelect,
  iconKey = 'icon',
  nameKey = 'name',
  emoji,
  variant = 'default',
  showTitle = true,
  enableFanSpread = true,
  stackOffset = CARD_3D_CONFIG.stackOffset,
}) => {
  // 展开状态
  const isExpanded = useSharedValue(false);
  const containerScale = useSharedValue(1);

  // 初始化展开动画
  useEffect(() => {
    // 延迟展开，营造神秘感
    const timer = setTimeout(() => {
      isExpanded.value = withTiming(1, {
        duration: CARD_3D_CONFIG.spreadDuration,
        easing: EASINGS.bounceSoft,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [items.length]);

  // 获取图标
  const getIcon = (item, index) => {
    if (item[iconKey]) return item[iconKey];
    if (emoji) return emoji[index % emoji.length];
    return ['🎭', '🎨', '🎪', '🎯', '🎲', '🎸'][index % 6];
  };

  // 处理选择
  const handleSelect = useCallback((id) => {
    onSelect?.(id);
  }, [onSelect]);

  // 计算卡片位置样式
  const getCardAnimatedStyle = (index, total) => {
    return useAnimatedStyle(() => {
      const fanAngle = calculateFanAngle(index, total, CARD_3D_CONFIG.fanAngle);
      const rotateZ = interpolate(
        isExpanded.value,
        [0, 1],
        [0, fanAngle],
        Extrapolate.CLAMP
      );

      // 堆叠时的偏移
      const stackX = index * stackOffset;
      const stackY = index * stackOffset * 0.5;

      // 展开时的位置
      const spreadX = interpolate(
        isExpanded.value,
        [0, 1],
        [stackX, Math.sin((fanAngle * Math.PI) / 180) * 40],
        Extrapolate.CLAMP
      );

      const spreadY = interpolate(
        isExpanded.value,
        [0, 1],
        [stackY, -Math.abs(fanAngle) * 0.3],
        Extrapolate.CLAMP
      );

      // 选中时的提升
      const isSelected = selectedId === items[index]?.id;
      const elevation = isSelected
        ? interpolate(isExpanded.value, [0, 1], [0, CARD_3D_CONFIG.selectElevation])
        : 0;

      return {
        transform: [
          { translateX: spreadX },
          { translateY: spreadY - elevation },
          { rotateZ: `${rotateZ}deg` },
        ],
        zIndex: isSelected ? 100 : index,
      };
    });
  };

  return (
    <View style={styles.container}>
      {showTitle && title && (
        <Animated.Text
          style={[
            styles.title,
            useAnimatedStyle(() => ({
              opacity: interpolate(isExpanded.value, [0, 1], [0.5, 1]),
              transform: [
                {
                  translateY: interpolate(isExpanded.value, [0, 1], [10, 0]),
                },
              ],
            })),
          ]}
        >
          {title}
        </Animated.Text>
      )}

      <View style={styles.deckContainer}>
        {items.map((item, index) => {
          const isSelected = selectedId === item.id;
          const cardAnimatedStyle = getCardAnimatedStyle(index, items.length);

          return (
            <Animated.View
              key={item.id}
              style={[styles.cardWrapper, cardAnimatedStyle]}
            >
              <Card3D
                icon={getIcon(item, index)}
                name={item[nameKey]}
                isSelected={isSelected}
                onSelect={() => handleSelect(item.id)}
                variant={isSelected ? 'primary' : variant}
                width={CARD_3D_CONFIG.cardWidth}
                height={CARD_3D_CONFIG.cardHeight}
                enableTilt={true}
                enableFlip={true}
              />
            </Animated.View>
          );
        })}
      </View>

      {/* 装饰性元素 */}
      <View style={styles.decorations}>
        <View style={[styles.decorationDot, styles.dot1]} />
        <View style={[styles.decorationDot, styles.dot2]} />
        <View style={[styles.decorationDot, styles.dot3]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  deckContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 140,
    position: 'relative',
  },
  cardWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  decorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  decorationDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.3,
  },
  dot1: {
    top: 10,
    left: 20,
    backgroundColor: COLORS.legoYellow,
  },
  dot2: {
    top: 30,
    right: 30,
    backgroundColor: COLORS.legoBlue,
    width: 6,
    height: 6,
  },
  dot3: {
    bottom: 20,
    left: 40,
    backgroundColor: COLORS.legoRed,
    width: 10,
    height: 10,
  },
});

export default CardDeck3D;
