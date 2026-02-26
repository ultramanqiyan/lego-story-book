import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { COLORS } from '../../utils/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WeatherEffect = ({ weather }) => {
  if (!weather) return null;

  switch (weather) {
    case 'sunny':
      return <SunEffect />;
    case 'rainy':
    case 'thunder':
      return <RainEffect isThunder={weather === 'thunder'} />;
    case 'snow':
      return <SnowEffect />;
    default:
      return null;
  }
};

const SunEffect = () => {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 25000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
  const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      <View style={styles.sunContainer}>
        <Animated.View style={[styles.sunCore, { transform: [{ scale }] }]} />
        <Animated.View style={[styles.sunRays, { transform: [{ rotate }] }]}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={[styles.sunRay, { transform: [{ rotate: `${i * 45}deg` }] }]} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const RainEffect = ({ isThunder }) => {
  const drops = useRef([...Array(60)].map(() => ({
    x: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 1500,
    duration: 350 + Math.random() * 350,
    opacity: 0.3 + Math.random() * 0.5,
  }))).current;

  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (isThunder) {
      const interval = setInterval(() => {
        if (Math.random() > 0.65) {
          setFlash(true);
          setTimeout(() => setFlash(false), 120);
        }
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isThunder]);

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      {drops.map((drop, i) => (
        <AnimatedRainDrop key={i} config={drop} />
      ))}
      {flash && <View style={styles.lightningFlash} />}
    </View>
  );
};

const AnimatedRainDrop = ({ config }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-25, SCREEN_HEIGHT + 25] });
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });

  return (
    <Animated.View
      style={[
        styles.rainDrop,
        { left: config.x, opacity: config.opacity, transform: [{ translateY }, { translateX }] },
      ]}
    />
  );
};

const SnowEffect = () => {
  const flakes = useRef([...Array(40)].map(() => ({
    x: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 4000,
    duration: 3500 + Math.random() * 4000,
    size: 10 + Math.random() * 16,
    opacity: 0.5 + Math.random() * 0.5,
  }))).current;

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      {flakes.map((flake, i) => (
        <AnimatedSnowFlake key={i} config={flake} />
      ))}
      <View style={styles.frostOverlay} />
    </View>
  );
};

const AnimatedSnowFlake = ({ config }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-25, SCREEN_HEIGHT + 25] });
  const translateX = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 25, -15] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.8] });

  return (
    <Animated.Text
      style={[
        styles.snowFlake,
        { left: config.x, fontSize: config.size, opacity: config.opacity, transform: [{ translateY }, { translateX }, { rotate }, { scale }] },
      ]}
    >
      ❄
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  weatherContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 5,
  },
  sunContainer: {
    position: 'absolute',
    top: 70,
    right: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.legoYellow,
    shadowColor: COLORS.legoYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 15,
  },
  sunRays: {
    position: 'absolute',
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunRay: {
    position: 'absolute',
    top: 65,
    left: 63,
    width: 4,
    height: 35,
    backgroundColor: COLORS.legoYellow,
    borderRadius: 2,
    opacity: 0.55,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(174,194,224,0.75)',
    borderRadius: 1,
  },
  lightningFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  snowFlake: {
    position: 'absolute',
    color: '#fff',
  },
  frostOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(200,220,255,0.12)',
  },
});

export default WeatherEffect;
