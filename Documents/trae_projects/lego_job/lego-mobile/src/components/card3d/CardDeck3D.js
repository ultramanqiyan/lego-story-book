/**
 * CardDeck3D组件 - 3D卡牌组，带扇形展开和堆叠效果
 */

import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Card3D from './Card3D';
import { COLORS } from '../../utils/constants';
import { CARD_3D_CONFIG, EASINGS } from '../../utils/animations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const clamp = (value, min, max) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

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

  const useCardAnimatedStyle = (index, total, itemId) => {
    return useAnimatedStyle(() => {
      const isSelected = selectedId === itemId;

      const startAngle = -CARD_3D_CONFIG.fanAngle / 2;
      const angleStep = total > 1 ? CARD_3D_CONFIG.fanAngle / (total - 1) : 0;
      const targetAngle = startAngle + index * angleStep;
      const angleRad = (targetAngle * Math.PI) / 180;

      const targetTranslateX = Math.sin(angleRad) * CARD_3D_CONFIG.fanRadius;
      const targetTranslateY = -Math.abs(Math.cos(angleRad) * CARD_3D_CONFIG.fanRadius * 0.3);

      const rotateZ = clamp(
        interpolate(isExpanded.value, [0, 1], [0, targetAngle]),
        -90, 90
      );

      const translateX = clamp(
        interpolate(isExpanded.value, [0, 1], [index * stackOffset, targetTranslateX]),
        -200, 200
      );

      const translateY = clamp(
        interpolate(isExpanded.value, [0, 1], [index * stackOffset * 0.5, targetTranslateY]),
        -100, 100
      );

      const elevation = isSelected
        ? clamp(interpolate(isExpanded.value, [0, 1], [0, CARD_3D_CONFIG.selectElevation]), 0, 30)
        : 0;

      const scale = isSelected
        ? clamp(interpolate(isExpanded.value, [0, 1], [1, 1.25]), 0.5, 2)
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

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: clamp(interpolate(isExpanded.value, [0, 1], [0.5, 1]), 0, 1),
    transform: [
      {
        translateY: clamp(interpolate(isExpanded.value, [0, 1], [10, 0]), -50, 50),
      },
    ],
  }));

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
});

export default CardDeck3D;
