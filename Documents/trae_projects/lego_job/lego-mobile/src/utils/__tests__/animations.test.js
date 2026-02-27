/**
 * animations.js 单元测试
 */

import {
  EASINGS,
  CARD_3D_CONFIG,
  WEATHER_CONFIG,
  PARTICLES_CONFIG,
  TRANSITION_CONFIG,
  MICRO_INTERACTION_CONFIG,
  random,
  randomInt,
  randomChoice,
  generateParticleConfig,
  generateRainDropConfig,
  generateSnowFlakeConfig,
  calculateTiltAngle,
  calculateFanAngle,
  calculateFanPosition,
  debounce,
  throttle,
} from '../animations';

describe('animations', () => {
  describe('EASINGS', () => {
    it('应该导出EASINGS对象', () => {
      expect(EASINGS).toBeDefined();
    });

    it('应该包含standard缓动', () => {
      expect(EASINGS.standard).toBeDefined();
    });

    it('应该包含decelerate缓动', () => {
      expect(EASINGS.decelerate).toBeDefined();
    });

    it('应该包含accelerate缓动', () => {
      expect(EASINGS.accelerate).toBeDefined();
    });

    it('应该包含bounce缓动', () => {
      expect(EASINGS.bounce).toBeDefined();
    });

    it('应该包含bounceSoft缓动', () => {
      expect(EASINGS.bounceSoft).toBeDefined();
    });

    it('应该包含linear缓动', () => {
      expect(EASINGS.linear).toBeDefined();
    });

    it('应该包含sine缓动', () => {
      expect(EASINGS.sine).toBeDefined();
    });

    it('应该包含spring缓动', () => {
      expect(EASINGS.spring).toBeDefined();
    });
  });

  describe('CARD_3D_CONFIG', () => {
    it('应该导出CARD_3D_CONFIG对象', () => {
      expect(CARD_3D_CONFIG).toBeDefined();
    });

    it('应该包含perspective', () => {
      expect(CARD_3D_CONFIG.perspective).toBe(1000);
    });

    it('应该包含flipDuration', () => {
      expect(CARD_3D_CONFIG.flipDuration).toBe(600);
    });

    it('应该包含tiltMaxAngle', () => {
      expect(CARD_3D_CONFIG.tiltMaxAngle).toBe(15);
    });
  });

  describe('WEATHER_CONFIG', () => {
    it('应该导出WEATHER_CONFIG对象', () => {
      expect(WEATHER_CONFIG).toBeDefined();
    });

    it('应该包含rain配置', () => {
      expect(WEATHER_CONFIG.rain).toBeDefined();
    });

    it('应该包含snow配置', () => {
      expect(WEATHER_CONFIG.snow).toBeDefined();
    });
  });

  describe('PARTICLES_CONFIG', () => {
    it('应该导出PARTICLES_CONFIG对象', () => {
      expect(PARTICLES_CONFIG).toBeDefined();
    });

    it('应该包含magic粒子配置', () => {
      expect(PARTICLES_CONFIG.magic).toBeDefined();
      expect(PARTICLES_CONFIG.magic.particleCount).toBeDefined();
      expect(PARTICLES_CONFIG.magic.colors).toBeDefined();
    });

    it('应该包含burst粒子配置', () => {
      expect(PARTICLES_CONFIG.burst).toBeDefined();
      expect(PARTICLES_CONFIG.burst.particleCount).toBeDefined();
    });

    it('应该包含trail粒子配置', () => {
      expect(PARTICLES_CONFIG.trail).toBeDefined();
      expect(PARTICLES_CONFIG.trail.density).toBeDefined();
    });
  });

  describe('TRANSITION_CONFIG', () => {
    it('应该导出TRANSITION_CONFIG对象', () => {
      expect(TRANSITION_CONFIG).toBeDefined();
    });
  });

  describe('MICRO_INTERACTION_CONFIG', () => {
    it('应该导出MICRO_INTERACTION_CONFIG对象', () => {
      expect(MICRO_INTERACTION_CONFIG).toBeDefined();
    });
  });

  describe('random', () => {
    it('应该返回min和max之间的随机数', () => {
      const result = random(0, 10);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe('randomInt', () => {
    it('应该返回min和max之间的随机整数', () => {
      const result = randomInt(0, 10);
      expect(Number.isInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(10);
    });
  });

  describe('randomChoice', () => {
    it('应该从数组中随机选择一个元素', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = randomChoice(arr);
      expect(arr).toContain(result);
    });
  });

  describe('generateParticleConfig', () => {
    it('应该生成粒子配置', () => {
      const config = generateParticleConfig('magic', 0);
      expect(config).toBeDefined();
      expect(config.id).toBeDefined();
    });

    it('应该为不同索引生成不同配置', () => {
      const config1 = generateParticleConfig('magic', 0);
      const config2 = generateParticleConfig('magic', 1);
      expect(config1.id).not.toBe(config2.id);
    });

    it('应该支持burst类型', () => {
      const config = generateParticleConfig('burst', 0);
      expect(config).toBeDefined();
    });

    it('应该支持trail类型', () => {
      const config = generateParticleConfig('trail', 0);
      expect(config).toBeDefined();
    });
  });

  describe('generateRainDropConfig', () => {
    it('应该生成雨滴配置', () => {
      const config = generateRainDropConfig(0);
      expect(config).toBeDefined();
      expect(config.id).toBeDefined();
    });
  });

  describe('generateSnowFlakeConfig', () => {
    it('应该生成雪花配置', () => {
      const config = generateSnowFlakeConfig(0);
      expect(config).toBeDefined();
      expect(config.id).toBeDefined();
    });
  });

  describe('calculateTiltAngle', () => {
    it('应该计算倾斜角度', () => {
      const result = calculateTiltAngle(100, 100, 0, 0, 15);
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  describe('calculateFanAngle', () => {
    it('应该计算扇形角度', () => {
      const result = calculateFanAngle(0, 5, 60);
      expect(typeof result).toBe('number');
    });
  });

  describe('calculateFanPosition', () => {
    it('应该计算扇形位置', () => {
      const result = calculateFanPosition(0, 5, 60, 80);
      expect(result).toBeDefined();
    });
  });

  describe('debounce', () => {
    it('应该防抖函数', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const debouncedFn = debounce(fn, 100);
      debouncedFn();
      debouncedFn();
      debouncedFn();
      jest.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });
  });

  describe('throttle', () => {
    it('应该节流函数', () => {
      jest.useFakeTimers();
      const fn = jest.fn();
      const throttledFn = throttle(fn, 100);
      throttledFn();
      throttledFn();
      jest.advanceTimersByTime(100);
      throttledFn();
      expect(fn).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });
  });
});
