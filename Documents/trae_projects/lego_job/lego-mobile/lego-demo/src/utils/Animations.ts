import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { AnimationConfig, Position } from '../types';
import { logger } from '../utils/Logger';

export const useCardFlyAnimation = (
  from: Position,
  to: Position,
  config: AnimationConfig = { duration: 500 }
) => {
  const xAnim = useRef(new Animated.Value(from.x)).current;
  const yAnim = useRef(new Animated.Value(from.y)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const animate = (callback?: () => void) => {
    logger.logAnimation('卡牌飞行', 'fly', { from, to, duration: config.duration });

    Animated.parallel([
      Animated.timing(xAnim, {
        toValue: to.x,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.timing(yAnim, {
        toValue: to.y,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: config.duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: config.duration / 2,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 360,
        duration: config.duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
    });
  };

  const reset = () => {
    xAnim.setValue(from.x);
    yAnim.setValue(from.y);
    scaleAnim.setValue(1);
    rotateAnim.setValue(0);
    opacityAnim.setValue(1);
  };

  return {
    x: xAnim,
    y: yAnim,
    scale: scaleAnim,
    rotate: rotateAnim,
    opacity: opacityAnim,
    animate,
    reset,
  };
};

export const useAttackAnimation = (
  config: AnimationConfig = { duration: 300 }
) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const animate = (callback?: () => void) => {
    logger.logAnimation('攻击动画', 'attack', { duration: config.duration });

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: config.duration / 2,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: config.duration / 2,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: -5,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      callback?.();
    });
  };

  const reset = () => {
    scaleAnim.setValue(1);
    shakeAnim.setValue(0);
  };

  return {
    scale: scaleAnim,
    shake: shakeAnim,
    animate,
    reset,
  };
};

export const useDamageNumberAnimation = (
  config: AnimationConfig = { duration: 1000 }
) => {
  const yAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const animate = (damage: number, callback?: () => void) => {
    logger.logAnimation('伤害数字', 'damage', { damage, duration: config.duration });

    Animated.parallel([
      Animated.timing(yAnim, {
        toValue: -100,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: config.duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: config.duration * 3 / 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: config.duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
    });
  };

  const reset = () => {
    yAnim.setValue(0);
    scaleAnim.setValue(1);
    opacityAnim.setValue(1);
  };

  return {
    y: yAnim,
    scale: scaleAnim,
    opacity: opacityAnim,
    animate,
    reset,
  };
};

export const useSummonAnimation = (
  config: AnimationConfig = { duration: 600 }
) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(1)).current;

  const animate = (callback?: () => void) => {
    logger.logAnimation('召唤动画', 'summon', { duration: config.duration });

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 360,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: config.duration,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      callback?.();
    });
  };

  const reset = () => {
    scaleAnim.setValue(0);
    rotateAnim.setValue(0);
    glowAnim.setValue(1);
  };

  return {
    scale: scaleAnim,
    rotate: rotateAnim,
    glow: glowAnim,
    animate,
    reset,
  };
};

export const useDeathAnimation = (
  config: AnimationConfig = { duration: 500 }
) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const animate = (callback?: () => void) => {
    logger.logAnimation('死亡动画', 'death', { duration: config.duration });

    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: config.duration,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 180,
        duration: config.duration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback?.();
    });
  };

  const reset = () => {
    scaleAnim.setValue(1);
    opacityAnim.setValue(1);
    rotateAnim.setValue(0);
  };

  return {
    scale: scaleAnim,
    opacity: opacityAnim,
    rotate: rotateAnim,
    animate,
    reset,
  };
};

export const useParticleAnimation = (
  count: number,
  config: AnimationConfig = { duration: 2000 }
) => {
  const particles = useRef(
    Array.from({ length: count }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
    }))
  ).current;

  const animate = (callback?: () => void) => {
    logger.logAnimation('粒子特效', 'particles', { count, duration: config.duration });

    const animations = particles.map((particle, index) => {
      const angle = (index / count) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      return Animated.parallel([
        Animated.timing(particle.x, {
          toValue: targetX,
          duration: config.duration,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: targetY,
          duration: config.duration,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: 1.5,
            duration: config.duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: config.duration / 2,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: config.duration,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      callback?.();
    });
  };

  const reset = () => {
    particles.forEach(particle => {
      particle.x.setValue(0);
      particle.y.setValue(0);
      particle.scale.setValue(1);
      particle.opacity.setValue(1);
    });
  };

  return {
    particles,
    animate,
    reset,
  };
};

export default {
  useCardFlyAnimation,
  useAttackAnimation,
  useDamageNumberAnimation,
  useSummonAnimation,
  useDeathAnimation,
  useParticleAnimation,
};
