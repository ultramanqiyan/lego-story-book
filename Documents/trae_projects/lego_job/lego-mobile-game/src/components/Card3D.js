import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { ANIMATIONS } from '../styles/animations';

export const Card3D = ({
  frontContent,
  backContent,
  style,
  onFlip,
  flipped: controlledFlipped,
  disabled = false,
  flipDuration = ANIMATIONS.duration.cardFlip,
  testID,
}) => {
  const [internalFlipped, setInternalFlipped] = React.useState(false);
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withTiming(isFlipped ? 180 : 0, {
      duration: flipDuration,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [isFlipped]);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180]);
    const opacity = interpolate(rotation.value, [90, 90.1], [1, 0]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360]);
    const opacity = interpolate(rotation.value, [90, 90.1], [0, 1]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const handlePress = () => {
    if (disabled) return;
    if (controlledFlipped === undefined) {
      setInternalFlipped(!internalFlipped);
    }
    onFlip && onFlip(!isFlipped);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress} disabled={disabled} testID={testID}>
      <View style={[styles.container, style]}>
        <Animated.View style={[styles.card, styles.frontCard, frontAnimatedStyle]}>
          {frontContent}
        </Animated.View>
        <Animated.View style={[styles.card, styles.backCard, backAnimatedStyle]}>
          {backContent}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 280,
    perspective: 1000,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border.gold,
    backgroundColor: COLORS.background.card,
    padding: SPACING.cardPadding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frontCard: {
    zIndex: 1,
  },
  backCard: {
    zIndex: 0,
    backgroundColor: COLORS.background.primary,
  },
});

export default Card3D;
