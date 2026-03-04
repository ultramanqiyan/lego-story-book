import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';
import { BattlefieldProps } from '../types';
import { logger } from '../utils/Logger';

const { width, height } = Dimensions.get('window');

const Battlefield: React.FC<BattlefieldProps> = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const particleAnims = useRef(
    Array.from({ length: 20 }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(Math.random() * height),
      opacity: new Animated.Value(Math.random() * 0.5 + 0.2),
      scale: new Animated.Value(Math.random() * 0.5 + 0.5),
    }))
  ).current;

  useEffect(() => {
    logger.info('战场背景组件加载');

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    particleAnims.forEach((particle, index) => {
      const animateParticle = () => {
        const duration = 3000 + Math.random() * 4000;
        
        Animated.loop(
          Animated.sequence([
            Animated.parallel([
              Animated.timing(particle.y, {
                toValue: Math.random() * height,
                duration,
                useNativeDriver: true,
              }),
              Animated.timing(particle.x, {
                toValue: Math.random() * width,
                duration,
                useNativeDriver: true,
              }),
              Animated.sequence([
                Animated.timing(particle.opacity, {
                  toValue: 0.8,
                  duration: duration / 2,
                  useNativeDriver: true,
                }),
                Animated.timing(particle.opacity, {
                  toValue: 0.2,
                  duration: duration / 2,
                  useNativeDriver: true,
                }),
              ]),
            ]),
          ])
        ).start();
      };

      animateParticle();
    });

    return () => {
      logger.info('战场背景组件卸载');
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.woodTexture} />
        <View style={styles.gradientOverlay} />
      </View>

      {particleAnims.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: particle.x },
                { translateY: particle.y },
                { scale: particle.scale },
              ],
              opacity: particle.opacity,
            },
          ]}
        />
      ))}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  woodTexture: {
    flex: 1,
    backgroundColor: '#2d1f1f',
    opacity: 0.9,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 90, 43, 0.3)',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffd700',
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  content: {
    flex: 1,
  },
});

export default Battlefield;
