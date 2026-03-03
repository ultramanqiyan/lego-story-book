import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';
import { COLORS } from '../../utils/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PARTICLE_COLORS = [COLORS.legoYellow, COLORS.legoPurple, COLORS.legoBlue, COLORS.legoGreen];

const ParticleBackground = () => {
  const particles = useRef([]);
  const animations = useRef([]);
  const animationRefs = useRef([]);

  useEffect(() => {
    const particleCount = 25;
    particles.current = [...Array(particleCount)].map(() => ({
      x: Math.random() * SCREEN_WIDTH,
      type: ['star', 'diamond', 'circle'][Math.floor(Math.random() * 3)],
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      size: 3 + Math.random() * 5,
      duration: 10000 + Math.random() * 8000,
      delay: Math.random() * 12000,
    }));

    animations.current = particles.current.map((p, i) => {
      const anim = new Animated.Value(0);
      return { anim, config: p };
    });

    animationRefs.current = animations.current.map(({ anim }, i) => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.delay(particles.current[i].delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: particles.current[i].duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return animation;
    });

    return () => {
      animationRefs.current.forEach(ref => {
        if (ref && ref.stop) {
          ref.stop();
        }
      });
    };
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {animations.current.map(({ anim, config }, i) => {
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -SCREEN_HEIGHT - 100],
        });
        const translateX = anim.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [0, 20, -15, 18, -10],
        });
        const scale = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.3, 0.7, 1],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 0.1, 0.9, 1],
          outputRange: [0, 0.6, 0.3, 0],
        });
        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              config.type === 'diamond' && styles.particleDiamond,
              {
                left: config.x,
                width: config.size,
                height: config.size,
                backgroundColor: config.type !== 'star' ? config.color : 'transparent',
                borderBottomColor: config.type === 'star' ? config.color : 'transparent',
                opacity,
                transform: [
                  { translateY },
                  { translateX },
                  { scale },
                  { rotate },
                ],
              },
            ]}
          />
        );
      })}
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
  particle: {
    position: 'absolute',
    bottom: -20,
    borderRadius: 50,
  },
  particleDiamond: {
    transform: [{ rotate: '45deg' }],
  },
});

export default ParticleBackground;
