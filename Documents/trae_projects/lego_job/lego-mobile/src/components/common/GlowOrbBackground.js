import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { COLORS } from '../../utils/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GlowOrbBackground = () => {
  const goldAnim = useRef(new Animated.ValueXY({ x: 0.1, y: 0.15 })).current;
  const purpleAnim = useRef(new Animated.ValueXY({ x: 0.85, y: 0.75 })).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(goldAnim, { toValue: { x: 0.6, y: 0.1 }, duration: 5000, useNativeDriver: true }),
        Animated.timing(goldAnim, { toValue: { x: 0.8, y: 0.5 }, duration: 5000, useNativeDriver: true }),
        Animated.timing(goldAnim, { toValue: { x: 0.3, y: 0.7 }, duration: 5500, useNativeDriver: true }),
        Animated.timing(goldAnim, { toValue: { x: 0.1, y: 0.15 }, duration: 5500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(purpleAnim, { toValue: { x: 0.2, y: 0.8 }, duration: 6000, useNativeDriver: true }),
        Animated.timing(purpleAnim, { toValue: { x: 0.1, y: 0.25 }, duration: 6000, useNativeDriver: true }),
        Animated.timing(purpleAnim, { toValue: { x: 0.7, y: 0.15 }, duration: 6000, useNativeDriver: true }),
        Animated.timing(purpleAnim, { toValue: { x: 0.85, y: 0.75 }, duration: 6000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View
        style={[
          styles.orb,
          styles.goldOrb,
          {
            left: goldAnim.x.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            top: goldAnim.y.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orb,
          styles.purpleOrb,
          {
            left: purpleAnim.x.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            top: purpleAnim.y.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
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
