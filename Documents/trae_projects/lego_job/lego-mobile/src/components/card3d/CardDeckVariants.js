/**
 * CardDeckVariants组件 - 多张卡片展示样式
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { COLORS } from '../../utils/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 60;
const CARD_HEIGHT = 85;

const CardItem = ({ item, index, style, isSelected, onPress, totalCards }) => {
  const animValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  useEffect(() => {
    animValue.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
  }, [index, animValue]);

  useEffect(() => {
    if (isSelected) {
      scaleValue.value = withSpring(1.15, { damping: 12, stiffness: 200 });
    } else {
      scaleValue.value = withSpring(1, { damping: 12, stiffness: 200 });
    }
  }, [isSelected, scaleValue]);

  const animatedStyle = useAnimatedStyle(() => {
    let transform = [];
    let zIndex = isSelected ? 10 : index;
    
    switch (style) {
      case 'fan':
        const angle = ((index - (totalCards - 1) / 2) * 15);
        const radius = 80;
        const x = Math.sin(angle * Math.PI / 180) * radius;
        const y = Math.cos(angle * Math.PI / 180) * radius * 0.3;
        const rotate = angle * 0.5;
        transform = [
          { translateX: x * animValue.value },
          { translateY: -y * animValue.value },
          { rotate: `${rotate}deg` },
          { scale: scaleValue.value },
        ];
        zIndex = isSelected ? 10 : index;
        break;

      case 'horizontal':
        const translateX = index * 30 * animValue.value;
        transform = [
          { translateX },
          { scale: scaleValue.value },
        ];
        zIndex = isSelected ? 10 : totalCards - index;
        break;

      case 'vertical':
        const translateY = index * 20 * animValue.value;
        transform = [
          { translateY },
          { scale: scaleValue.value },
        ];
        zIndex = isSelected ? 10 : totalCards - index;
        break;

      case 'grid':
        transform = [{ scale: scaleValue.value }];
        break;

      case 'carousel':
        const carouselX = (index - 1) * (CARD_WIDTH + 10) * animValue.value;
        transform = [
          { translateX: carouselX },
          { scale: scaleValue.value },
        ];
        break;

      default:
        transform = [{ scale: scaleValue.value }];
    }

    return {
      transform,
      opacity: animValue.value,
      zIndex,
    };
  });

  const handlePress = () => {
    if (onPress) {
      onPress(item.id);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      style={styles.cardContainer}
    >
      <Animated.View
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          animatedStyle,
        ]}
      >
        <Text style={styles.cardIcon}>{item.icon}</Text>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const CardDeckVariants = ({
  items = [],
  style = 'fan',
  selectedId = null,
  onSelect,
}) => {
  const [currentStyle, setCurrentStyle] = useState(style);

  const handleSelect = (id) => {
    if (onSelect) {
      onSelect(id);
    }
  };

  const renderCards = () => {
    return items.map((item, index) => (
      <CardItem
        key={item.id}
        item={item}
        index={index}
        style={currentStyle}
        isSelected={selectedId === item.id}
        onPress={handleSelect}
        totalCards={items.length}
      />
    ));
  };

  const getContainerStyle = () => {
    switch (currentStyle) {
      case 'fan':
        return styles.fanContainer;
      case 'horizontal':
        return styles.horizontalContainer;
      case 'vertical':
        return styles.verticalContainer;
      case 'grid':
        return styles.gridContainer;
      case 'carousel':
        return styles.carouselContainer;
      default:
        return styles.fanContainer;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.styleSelector}>
        {['fan', 'horizontal', 'vertical', 'grid', 'carousel'].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.styleButton, currentStyle === s && styles.styleButtonActive]}
            onPress={() => setCurrentStyle(s)}
          >
            <Text style={[styles.styleButtonText, currentStyle === s && styles.styleButtonTextActive]}>
              {s === 'fan' ? '扇形' : s === 'horizontal' ? '横叠' : s === 'vertical' ? '纵叠' : s === 'grid' ? '网格' : '轮播'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={getContainerStyle()}>
        {renderCards()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  styleSelector: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  styleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  styleButtonActive: {
    backgroundColor: COLORS.legoYellow,
  },
  styleButtonText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  styleButtonTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  cardContainer: {
    margin: 4,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderColor: COLORS.legoYellow,
    borderWidth: 3,
  },
  cardIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  cardName: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  fanContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 120,
    width: SCREEN_WIDTH - 40,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 100,
    paddingLeft: 20,
  },
  verticalContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 150,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: SCREEN_WIDTH - 40,
  },
  carouselContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
});

export default CardDeckVariants;
