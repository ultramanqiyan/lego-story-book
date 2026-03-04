import { useRef, useEffect, useCallback } from 'react';
import { Animated, Easing } from 'react-native';
import { AnimationType, AnimationConfig, ANIMATION_CONFIGS } from '../types/styles';
import { logger } from './GameLogger';

export const useBounceAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.BOUNCE]) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(-100)).current;

  const animate = useCallback((callback?: () => void) => {
    logger.logAnimation('弹跳', 'card');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: config.duration / 2,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(callback);
  }, [config.duration, scaleAnim, translateYAnim]);

  const reset = useCallback(() => {
    scaleAnim.setValue(0);
    translateYAnim.setValue(-100);
  }, [scaleAnim, translateYAnim]);

  return { scaleAnim, translateYAnim, animate, reset };
};

export const useFlipAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.FLIP]) => {
  const rotateYAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  const animate = useCallback((callback?: () => void) => {
    logger.logAnimation('翻转', 'card');
    
    Animated.parallel([
      Animated.timing(rotateYAnim, {
        toValue: 1,
        duration: config.duration,
        easing: Easing.out(Easing.back(1.5)),
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
    ]).start(callback);
  }, [config.duration, rotateYAnim, scaleAnim]);

  const reset = useCallback(() => {
    rotateYAnim.setValue(0);
    scaleAnim.setValue(0.5);
  }, [rotateYAnim, scaleAnim]);

  const rotateY = rotateYAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '0deg'],
  });

  return { rotateY, scaleAnim, animate, reset };
};

export const useSlideAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.SLIDE]) => {
  const translateXAnim = useRef(new Animated.Value(-200)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const animate = useCallback((callback?: () => void) => {
    logger.logAnimation('滑入', 'card');
    
    Animated.parallel([
      Animated.timing(translateXAnim, {
        toValue: 0,
        duration: config.duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: config.duration / 2,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }, [config.duration, translateXAnim, opacityAnim]);

  const reset = useCallback(() => {
    translateXAnim.setValue(-200);
    opacityAnim.setValue(0);
  }, [translateXAnim, opacityAnim]);

  return { translateXAnim, opacityAnim, animate, reset };
};

export const useSpinAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.SPIN]) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const animate = useCallback((callback?: () => void) => {
    logger.logAnimation('旋转', 'card');
    
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: config.duration,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start(callback);
  }, [config.duration, rotateAnim, scaleAnim]);

  const reset = useCallback(() => {
    rotateAnim.setValue(0);
    scaleAnim.setValue(0);
  }, [rotateAnim, scaleAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return { rotate, scaleAnim, animate, reset };
};

export const useFadeBlinkAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.FADE_BLINK]) => {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const start = useCallback(() => {
    logger.logAnimation('渐变闪烁', 'card');
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: config.duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: config.duration / 2,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [config.duration, opacityAnim]);

  const stop = useCallback(() => {
    opacityAnim.stopAnimation();
    opacityAnim.setValue(1);
  }, [opacityAnim]);

  return { opacityAnim, start, stop };
};

export const usePulseAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.PULSE]) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const start = useCallback(() => {
    logger.logAnimation('脉冲', 'card');
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1 + (config.intensity || 0.15),
          duration: config.duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: config.duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [config.duration, config.intensity, scaleAnim]);

  const stop = useCallback(() => {
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
  }, [scaleAnim]);

  return { scaleAnim, start, stop };
};

export const useShakeAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.SHAKE]) => {
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const intensity = config.intensity || 5;

  const start = useCallback(() => {
    logger.logAnimation('摇晃', 'card');
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(translateXAnim, {
          toValue: intensity,
          duration: config.duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: -intensity,
          duration: config.duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: intensity / 2,
          duration: config.duration / 4,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: config.duration / 4,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [config.duration, intensity, translateXAnim]);

  const stop = useCallback(() => {
    translateXAnim.stopAnimation();
    translateXAnim.setValue(0);
  }, [translateXAnim]);

  return { translateXAnim, start, stop };
};

export const useWaveAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.WAVE]) => {
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const intensity = config.intensity || 10;

  const start = useCallback(() => {
    logger.logAnimation('波浪', 'card');
    
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateYAnim, {
            toValue: -intensity,
            duration: config.duration / 4,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: intensity,
            duration: config.duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateYAnim, {
            toValue: 0,
            duration: config.duration / 4,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [config.duration, intensity, translateYAnim, rotateAnim]);

  const stop = useCallback(() => {
    translateYAnim.stopAnimation();
    translateYAnim.setValue(0);
    rotateAnim.stopAnimation();
    rotateAnim.setValue(0);
  }, [translateYAnim, rotateAnim]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '3deg', '0deg'],
  });

  return { translateYAnim, rotate, start, stop };
};

export const useParticleBurstAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.PARTICLE_BURST]) => {
  const particles = useRef(
    Array.from({ length: config.intensity || 12 }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
    }))
  ).current;

  const animate = useCallback((callback?: () => void) => {
    logger.logAnimation('粒子爆发', 'card');
    
    const animations = particles.map((particle, index) => {
      const angle = (index / particles.length) * Math.PI * 2;
      const distance = 50 + Math.random() * 50;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      return Animated.parallel([
        Animated.timing(particle.x, {
          toValue: targetX,
          duration: config.duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: targetY,
          duration: config.duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: 1.5,
            duration: config.duration / 3,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: config.duration * 2 / 3,
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

    Animated.parallel(animations).start(callback);
  }, [config.duration, config.intensity, particles]);

  const reset = useCallback(() => {
    particles.forEach(particle => {
      particle.x.setValue(0);
      particle.y.setValue(0);
      particle.scale.setValue(1);
      particle.opacity.setValue(1);
    });
  }, [particles]);

  return { particles, animate, reset };
};

export const useGlowRingAnimation = (config: AnimationConfig = ANIMATION_CONFIGS[AnimationType.GLOW_RING]) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  const start = useCallback(() => {
    logger.logAnimation('光环', 'card');
    
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.5,
            duration: config.duration / 2,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: config.duration / 2,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration: config.duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: config.duration / 2,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, [config.duration, scaleAnim, opacityAnim]);

  const stop = useCallback(() => {
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
    opacityAnim.stopAnimation();
    opacityAnim.setValue(0.8);
  }, [scaleAnim, opacityAnim]);

  return { scaleAnim, opacityAnim, start, stop };
};

export const useAnimationByType = (type: AnimationType) => {
  const bounceAnim = useBounceAnimation();
  const flipAnim = useFlipAnimation();
  const slideAnim = useSlideAnimation();
  const spinAnim = useSpinAnimation();
  const fadeBlinkAnim = useFadeBlinkAnimation();
  const pulseAnim = usePulseAnimation();
  const shakeAnim = useShakeAnimation();
  const waveAnim = useWaveAnimation();
  const particleBurstAnim = useParticleBurstAnimation();
  const glowRingAnim = useGlowRingAnimation();

  switch (type) {
    case AnimationType.BOUNCE:
      return bounceAnim;
    case AnimationType.FLIP:
      return flipAnim;
    case AnimationType.SLIDE:
      return slideAnim;
    case AnimationType.SPIN:
      return spinAnim;
    case AnimationType.FADE_BLINK:
      return fadeBlinkAnim;
    case AnimationType.PULSE:
      return pulseAnim;
    case AnimationType.SHAKE:
      return shakeAnim;
    case AnimationType.WAVE:
      return waveAnim;
    case AnimationType.PARTICLE_BURST:
      return particleBurstAnim;
    case AnimationType.GLOW_RING:
      return glowRingAnim;
    default:
      return bounceAnim;
  }
};
