/**
 * 粒子系统Hook - 管理魔法粒子、爆发粒子等效果
 */

import { useCallback, useRef, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { PARTICLES_CONFIG, generateParticleConfig } from '../utils/animations';

// 粒子池 - 用于复用粒子对象
class ParticlePool {
  constructor(maxSize = 100) {
    this.pool = [];
    this.maxSize = maxSize;
    this.activeParticles = new Map();
  }

  acquire(id, config) {
    let particle = this.pool.pop();
    if (!particle) {
      particle = { id: null, config: null, active: false };
    }
    particle.id = id;
    particle.config = config;
    particle.active = true;
    this.activeParticles.set(id, particle);
    return particle;
  }

  release(id) {
    const particle = this.activeParticles.get(id);
    if (particle) {
      particle.active = false;
      particle.config = null;
      this.activeParticles.delete(id);
      if (this.pool.length < this.maxSize) {
        this.pool.push(particle);
      }
    }
  }

  getActiveCount() {
    return this.activeParticles.size;
  }

  clear() {
    this.activeParticles.clear();
    this.pool = [];
  }
}

// 全局粒子池实例
const globalParticlePool = new ParticlePool(100);

/**
 * 魔法粒子背景Hook
 */
export const useMagicParticles = (options = {}) => {
  const {
    count = PARTICLES_CONFIG.magic.particleCount,
    enabled = true,
  } = options;

  const particles = useRef([]);
  const animationValues = useRef(new Map());

  // 初始化粒子
  useEffect(() => {
    if (!enabled) return;

    particles.current = Array.from({ length: count }, (_, i) => {
      const config = generateParticleConfig('magic', i);
      const values = {
        y: useSharedValue(0),
        opacity: useSharedValue(0),
        scale: useSharedValue(0.5),
      };
      animationValues.current.set(config.id, values);
      return { ...config, values };
    });

    // 启动动画
    particles.current.forEach((particle, index) => {
      const values = particle.values;

      // 垂直浮动动画
      values.y.value = withDelay(
        particle.delay,
        withRepeat(
          withTiming(100, { duration: particle.duration }),
          -1,
          true
        )
      );

      // 透明度动画
      values.opacity.value = withDelay(
        particle.delay,
        withRepeat(
          withTiming(particle.opacity, { duration: particle.duration / 2 }),
          -1,
          true
        )
      );

      // 缩放动画
      values.scale.value = withDelay(
        particle.delay,
        withRepeat(
          withTiming(1, { duration: particle.duration / 3 }),
          -1,
          true
        )
      );
    });

    return () => {
      animationValues.current.clear();
    };
  }, [count, enabled]);

  // 生成粒子样式
  const getParticleStyle = useCallback((particle) => {
    const values = particle.values;

    return useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: values.y.value },
          { scale: values.scale.value },
        ],
        opacity: values.opacity.value,
      };
    });
  }, []);

  return {
    particles: particles.current,
    getParticleStyle,
  };
};

/**
 * 爆发粒子效果Hook
 */
export const useBurstParticles = (options = {}) => {
  const {
    particleCount = PARTICLES_CONFIG.burst.particleCount,
    colors = PARTICLES_CONFIG.burst.colors,
  } = options;

  const particles = useRef([]);
  const isActive = useSharedValue(false);

  const triggerBurst = useCallback((originX, originY) => {
    isActive.value = true;

    // 创建爆发粒子
    particles.current = Array.from({ length: particleCount }, (_, i) => {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const velocity = 50 + Math.random() * 100;
      const config = {
        id: `burst_${i}_${Date.now()}`,
        x: useSharedValue(originX),
        y: useSharedValue(originY),
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        opacity: useSharedValue(1),
        scale: useSharedValue(0.5 + Math.random() * 0.5),
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
      };

      // 动画
      config.x.value = withTiming(
        originX + config.vx,
        { duration: 800, easing: Easing.out(Easing.quad) }
      );
      config.y.value = withTiming(
        originY + config.vy + 100, // 重力效果
        { duration: 800, easing: Easing.in(Easing.quad) }
      );
      config.opacity.value = withTiming(0, { duration: 800 });
      config.scale.value = withTiming(0, { duration: 600 });

      return config;
    });

    // 清理
    setTimeout(() => {
      particles.current = [];
      isActive.value = false;
    }, 1000);
  }, [particleCount, colors, isActive]);

  const getParticleStyle = useCallback((particle) => {
    return useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: particle.x.value },
          { translateY: particle.y.value },
          { scale: particle.scale.value },
        ],
        opacity: particle.opacity.value,
      };
    });
  }, []);

  return {
    particles: particles.current,
    triggerBurst,
    getParticleStyle,
    isActive,
  };
};

/**
 * 轨迹粒子效果Hook
 */
export const useTrailParticles = (options = {}) => {
  const {
    density = PARTICLES_CONFIG.trail.density,
    fadeDuration = PARTICLES_CONFIG.trail.fadeDuration,
  } = options;

  const trail = useRef([]);
  const frameCount = useRef(0);

  const addTrailPoint = useCallback((x, y) => {
    frameCount.current++;

    // 控制密度
    if (frameCount.current % density !== 0) return;

    const particle = {
      id: `trail_${Date.now()}_${Math.random()}`,
      x,
      y,
      opacity: useSharedValue(1),
      scale: useSharedValue(1),
    };

    // 淡出动画
    particle.opacity.value = withTiming(0, { duration: fadeDuration });
    particle.scale.value = withTiming(0, { duration: fadeDuration });

    trail.current.push(particle);

    // 清理过期粒子
    setTimeout(() => {
      trail.current = trail.current.filter((p) => p.id !== particle.id);
    }, fadeDuration);
  }, [density, fadeDuration]);

  const getParticleStyle = useCallback((particle) => {
    return useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: particle.x },
          { translateY: particle.y },
          { scale: particle.scale.value },
        ],
        opacity: particle.opacity.value,
      };
    });
  }, []);

  const clearTrail = useCallback(() => {
    trail.current = [];
    frameCount.current = 0;
  }, []);

  return {
    trail: trail.current,
    addTrailPoint,
    getParticleStyle,
    clearTrail,
  };
};

/**
 * 通用粒子系统Hook
 */
export const useParticleSystem = (type = 'magic', options = {}) => {
  switch (type) {
    case 'magic':
      return useMagicParticles(options);
    case 'burst':
      return useBurstParticles(options);
    case 'trail':
      return useTrailParticles(options);
    default:
      return useMagicParticles(options);
  }
};

export default {
  useMagicParticles,
  useBurstParticles,
  useTrailParticles,
  useParticleSystem,
  ParticlePool,
};
