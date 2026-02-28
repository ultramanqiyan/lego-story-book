/**
 * CardDeck3D组件 - 3D卡牌组，带扇形展开和堆叠效果（网页端风格）
 * 优化版本：修复Web端显示问题
 */

import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
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
import { CARD_3D_CONFIG, EASINGS } from '../../utils/animations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CardDeck3D = ({
  title,
  items,
  selectedId,
  onPress,
  iconKey = 'icon',
  nameKey = 'name',
  emoji,
  variant = 'default',
  showTitle = true,
  enableFanSpread = true,
  stackOffset = CARD_3D_CONFIG.stackOffset,
}) => {
  const isExpanded = useSharedValue(0);
  const [isWeb, setIsWeb] = useState(false);

  // 确保 items 是数组
  const safeItems = Array.isArray(items) ? items : [];

  useEffect(() => {
    setIsWeb(Platform.OS === 'web');
    if (enableFanSpread) {
      const timer = setTimeout(() => {
        isExpanded.value = withTiming(1, {
          duration: CARD_3D_CONFIG.spreadDuration,
          easing: EASINGS.bounceSoft,
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [safeItems.length, enableFanSpread]);

  const getIcon = (item, index) => {
    if (item[iconKey]) return item[iconKey];
    if (emoji) return emoji[index % emoji.length];
    return ['🎭', '🎨', '🎪', '🎯', '🎲', '🎸'][index % 6];
  };

  const handleSelect = useCallback((id) => {
    onPress?.(id);
  }, [onPress]);

  // 计算单个卡牌的动画样式
  const useCardAnimatedStyle = (index, total, itemId) => {
    return useAnimatedStyle(() => {
      const isSelected = selectedId === itemId;

      // 计算扇形角度
      const startAngle = -CARD_3D_CONFIG.fanAngle / 2;
      const angleStep = total > 1 ? CARD_3D_CONFIG.fanAngle / (total - 1) : 0;
      const targetAngle = startAngle + index * angleStep;
      const angleRad = (targetAngle * Math.PI) / 180;

      // 计算位置
      const targetTranslateX = Math.sin(angleRad) * CARD_3D_CONFIG.fanRadius;
      const targetTranslateY = -Math.abs(Math.cos(angleRad) * CARD_3D_CONFIG.fanRadius * 0.3);

      const rotateZ = interpolate(
        isExpanded.value,
        [0, 1],
        [0, targetAngle],
        Extrapolate.CLAMP
      );

      const translateX = interpolate(
        isExpanded.value,
        [0, 1],
        [index * stackOffset, targetTranslateX],
        Extrapolate.CLAMP
      );

      const translateY = interpolate(
        isExpanded.value,
        [0, 1],
        [index * stackOffset * 0.5, targetTranslateY],
        Extrapolate.CLAMP
      );

      const elevation = isSelected
        ? interpolate(isExpanded.value, [0, 1], [0, CARD_3D_CONFIG.selectElevation])
        : 0;

      const scale = isSelected
        ? interpolate(isExpanded.value, [0, 1], [1, 1.25])
        : 1;

      return {
        transform: [
          { translateX },
          { translateY: translateY - elevation },
          { rotateZ: `${rotateZ}deg` },
          { scale },
        ],
        zIndex: isSelected ? 100 : index,
      };
    });
  };

  // 标题动画样式
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(isExpanded.value, [0, 1], [0.5, 1]),
    transform: [
      {
        translateY: interpolate(isExpanded.value, [0, 1], [10, 0]),
      },
    ],
  }));

  // Web端使用简化的渲染
  if (isWeb) {
    return (
      <View style={styles.container}>
        {showTitle && title && (
          <Text style={styles.title}>{title}</Text>
        )}
        <View style={styles.deckContainerWeb}>
          <View style={styles.cardsRow}>
            {safeItems.map((item, index) => {
              const isSelected = selectedId === item.id;

              return (
                <View
                  key={item.id}
                  style={[
                    styles.cardWrapperWeb,
                    isSelected && styles.cardWrapperWebSelected,
                  ]}
                >
                  <Card3D
                    icon={getIcon(item, index)}
                    name={item[nameKey]}
                    isSelected={isSelected}
                    onPress={() => handleSelect(item.id)}
                    variant={isSelected ? 'primary' : variant}
                    width={CARD_3D_CONFIG.cardWidth}
                    height={CARD_3D_CONFIG.cardHeight}
                    enableTilt={false}
                    enableFlip={false}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <View style={styles.decorations}>
          <View style={[styles.decorationDot, styles.dot1]} />
          <View style={[styles.decorationDot, styles.dot2]} />
          <View style={[styles.decorationDot, styles.dot3]} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showTitle && title && (
        <Animated.Text
          style={[
            styles.title,
            titleAnimatedStyle,
          ]}
        >
          {title}
        </Animated.Text>
      )}
      <View style={styles.deckContainer}>
        {safeItems.map((item, index) => {
          const isSelected = selectedId === item.id;
          const cardAnimatedStyle = useCardAnimatedStyle(index, safeItems.length, item.id);

          return (
            <Animated.View
              key={item.id}
              style={[styles.cardWrapper, cardAnimatedStyle]}
            >
              <Card3D
                icon={getIcon(item, index)}
                name={item[nameKey]}
                isSelected={isSelected}
                onPress={() => handleSelect(item.id)}
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
    alignItems: 'flex-end',
    height: 160,
    position: 'relative',
  },
  deckContainerWeb: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
    position: 'relative',
    width: '100%',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapperWeb: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  cardWrapperWebSelected: {
    transform: [{ translateY: -10 }, { scale: 1.05 }],
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
