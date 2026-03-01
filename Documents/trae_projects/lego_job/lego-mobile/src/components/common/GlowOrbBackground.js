import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../utils/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GlowOrbBackground = () => {
  const goldAnimX = useRef(new Animated.Value(0.1 * SCREEN_WIDTH)).current;
  const goldAnimY = useRef(new Animated.Value(0.15 * SCREEN_HEIGHT)).current;
  const purpleAnimX = useRef(new Animated.Value(0.85 * SCREEN_WIDTH)).current;
  const purpleAnimY = useRef(new Animated.Value(0.75 * SCREEN_HEIGHT)).current;

  useEffect(() => {
    const animateGold = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(goldAnimX, { toValue: 0.6 * SCREEN_WIDTH, duration: 5000, useNativeDriver: true }),
          Animated.timing(goldAnimY, { toValue: 0.1 * SCREEN_HEIGHT, duration: 5000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(goldAnimX, { toValue: 0.8 * SCREEN_WIDTH, duration: 5000, useNativeDriver: true }),
          Animated.timing(goldAnimY, { toValue: 0.5 * SCREEN_HEIGHT, duration: 5000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(goldAnimX, { toValue: 0.3 * SCREEN_WIDTH, duration: 5500, useNativeDriver: true }),
          Animated.timing(goldAnimY, { toValue: 0.7 * SCREEN_HEIGHT, duration: 5500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(goldAnimX, { toValue: 0.1 * SCREEN_WIDTH, duration: 5500, useNativeDriver: true }),
          Animated.timing(goldAnimY, { toValue: 0.15 * SCREEN_HEIGHT, duration: 5500, useNativeDriver: true }),
        ]),
      ]).start(() => animateGold());
    };

    const animatePurple = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(purpleAnimX, { toValue: 0.2 * SCREEN_WIDTH, duration: 6000, useNativeDriver: true }),
          Animated.timing(purpleAnimY, { toValue: 0.8 * SCREEN_HEIGHT, duration: 6000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(purpleAnimX, { toValue: 0.1 * SCREEN_WIDTH, duration: 6000, useNativeDriver: true }),
          Animated.timing(purpleAnimY, { toValue: 0.25 * SCREEN_HEIGHT, duration: 6000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(purpleAnimX, { toValue: 0.7 * SCREEN_WIDTH, duration: 6000, useNativeDriver: true }),
          Animated.timing(purpleAnimY, { toValue: 0.15 * SCREEN_HEIGHT, duration: 6000, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(purpleAnimX, { toValue: 0.85 * SCREEN_WIDTH, duration: 6000, useNativeDriver: true }),
          Animated.timing(purpleAnimY, { toValue: 0.75 * SCREEN_HEIGHT, duration: 6000, useNativeDriver: true }),
        ]),
      ]).start(() => animatePurple());
    };

    animateGold();
    animatePurple();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.orb,
          styles.goldOrb,
          {
            transform: [
              { translateX: goldAnimX },
              { translateY: goldAnimY },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.purpleOrb,
          {
            transform: [
              { translateX: purpleAnimX },
              { translateY: purpleAnimY },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  orb: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.25,
  },
  goldOrb: {
    width: 180,
    height: 180,
    backgroundColor: COLORS.legoYellow,
    shadowColor: COLORS.legoYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 10,
  },
  purpleOrb: {
    width: 220,
    height: 220,
    backgroundColor: COLORS.legoPurple,
    shadowColor: COLORS.legoPurple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 10,
  },
});

export default GlowOrbBackground;
