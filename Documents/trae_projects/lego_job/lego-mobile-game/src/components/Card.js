import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { ANIMATIONS } from '../styles/animations';

export const RARITY_STYLES = {
  common: {
    borderColor: COLORS.rarity.common,
    shadowColor: COLORS.rarity.common,
    shadowOpacity: 0.1,
  },
  rare: {
    borderColor: COLORS.rarity.rare,
    shadowColor: COLORS.rarity.rare,
    shadowOpacity: 0.4,
  },
  epic: {
    borderColor: COLORS.rarity.epic,
    shadowColor: COLORS.rarity.epic,
    shadowOpacity: 0.5,
  },
  legendary: {
    borderColor: COLORS.rarity.legendary,
    shadowColor: COLORS.rarity.legendary,
    shadowOpacity: 0.6,
  },
  mythic: {
    borderColor: COLORS.rarity.mythic,
    shadowColor: COLORS.rarity.mythic,
    shadowOpacity: 0.8,
  },
};

export const Card = ({
  children,
  style,
  onPress,
  onLongPress,
  rarity = 'common',
  disabled = false,
  selected = false,
  animated = true,
  testID,
}) => {
  const [scaleAnim] = React.useState(new Animated.Value(1));
  const [shadowAnim] = React.useState(new Animated.Value(0));

  const rarityStyle = RARITY_STYLES[rarity] || RARITY_STYLES.common;

  React.useEffect(() => {
    if (selected) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.05,
          useNativeDriver: true,
          ...ANIMATIONS.spring.gentle,
        }),
        Animated.timing(shadowAnim, {
          toValue: 1,
          duration: ANIMATIONS.duration.normal,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          ...ANIMATIONS.spring.gentle,
        }),
        Animated.timing(shadowAnim, {
          toValue: 0,
          duration: ANIMATIONS.duration.normal,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [selected]);

  const handlePressIn = () => {
    if (!animated || disabled) return;
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      ...ANIMATIONS.spring.gentle,
    }).start();
  };

  const handlePressOut = () => {
    if (!animated || disabled) return;
    Animated.spring(scaleAnim, {
      toValue: selected ? 1.05 : 1,
      useNativeDriver: true,
      ...ANIMATIONS.spring.gentle,
    }).start();
  };

  const cardStyle = [
    styles.card,
    {
      borderColor: rarityStyle.borderColor,
      shadowColor: rarityStyle.shadowColor,
      shadowOpacity: rarityStyle.shadowOpacity + shadowAnim._value * 0.2,
    },
    selected && styles.selectedCard,
    disabled && styles.disabledCard,
    style,
  ];

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
        testID={testID}
      >
        <Animated.View style={[cardStyle, animated && animatedStyle]}>
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View style={[cardStyle, animated && animatedStyle]} testID={testID}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: 16,
    borderWidth: 2,
    padding: SPACING.cardPadding,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    minHeight: 100,
    minWidth: 80,
  },
  selectedCard: {
    borderWidth: 3,
    shadowRadius: 15,
    elevation: 8,
  },
  disabledCard: {
    opacity: 0.5,
  },
});

export default Card;
