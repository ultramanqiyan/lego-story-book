/**
 * useParticles 测试
 * 测试粒子系统 hooks
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useMagicParticles, useBurstParticles, useTrailParticles } from '../useParticles';

jest.mock('react-native-reanimated', () => {
  const mockSharedValue = (initialValue) => ({
    value: initialValue,
  });
  const bezierFn = jest.fn(() => jest.fn());
  const mockEasing = {
    linear: jest.fn(),
    sin: jest.fn(),
    bounce: jest.fn(),
    out: jest.fn(() => mockSharedValue(1)),
    quad: jest.fn(),
    bezier: bezierFn,
    elastic: jest.fn(() => jest.fn()),
    in: jest.fn(() => mockSharedValue(1)),
  };
  return {
    useSharedValue: mockSharedValue,
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((val) => val),
    withDelay: jest.fn((delay, val) => val),
    withRepeat: jest.fn((val) => val),
    withSequence: jest.fn((...args) => args[args.length - 1]),
    interpolate: jest.fn((val) => val),
    Extrapolate: { CLAMP: 'clamp' },
    Easing: mockEasing,
    runOnJS: jest.fn((fn) => fn),
  };
});

jest.mock('../../utils/animations', () => ({
  EASINGS: {
    standard: jest.fn(),
    decelerate: jest.fn(),
    accelerate: jest.fn(),
    bounceSoft: jest.fn(),
  },
  PARTICLES_CONFIG: {
    magic: {
      particleCount: 40,
      colors: ['#FFD100', '#FF6B35', '#4ECDC4', '#95E1D3'],
    },
    burst: {
      particleCount: 20,
      colors: ['#FFD100', '#FF6B35', '#4ECDC4'],
    },
    trail: {
      density: 10,
      fadeDuration: 500,
    },
  },
  generateParticleConfig: jest.fn((type, index) => ({
    id: `particle_${type}_${index}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10,
    size: Math.random() * 10 + 5,
    color: ['#FFD100', '#FF6B35', '#4ECDC4'][index % 3],
    delay: index * 50,
    duration: 2000 + Math.random() * 1000,
    opacity: 0.5 + Math.random() * 0.5,
  })),
}));

describe('useParticles', () => {
  describe('useMagicParticles', () => {
    it('应该返回粒子配置', () => {
      const { result } = renderHook(() => useMagicParticles());

      expect(result.current.particles).toBeDefined();
    });

    it('应该返回getParticleStyle函数', () => {
      const { result } = renderHook(() => useMagicParticles());

      expect(result.current.getParticleStyle).toBeDefined();
    });

    it('应该初始化指定数量的粒子', () => {
      const { result, rerender } = renderHook(
        ({ count }) => useMagicParticles({ count }),
        { initialProps: { count: 10 } }
      );

      rerender({ count: 10 });

      expect(result.current.particles.length).toBe(10);
    });

    it('应该在disabled时不初始化粒子', () => {
      const { result } = renderHook(() => useMagicParticles({ enabled: false }));

      expect(result.current.particles.length).toBe(0);
    });
  });

  describe('useBurstParticles', () => {
    it('应该返回粒子配置', () => {
      const { result } = renderHook(() => useBurstParticles());

      expect(result.current.particles).toBeDefined();
    });

    it('应该返回triggerBurst函数', () => {
      const { result } = renderHook(() => useBurstParticles());

      expect(result.current.triggerBurst).toBeDefined();
      expect(typeof result.current.triggerBurst).toBe('function');
    });

    it('应该返回getParticleStyle函数', () => {
      const { result } = renderHook(() => useBurstParticles());

      expect(result.current.getParticleStyle).toBeDefined();
    });

    it('应该返回isActive状态', () => {
      const { result } = renderHook(() => useBurstParticles());

      expect(result.current.isActive).toBeDefined();
    });

    it('应该触发爆发效果', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useBurstParticles());

      act(() => {
        result.current.triggerBurst(100, 100);
      });

      expect(result.current.isActive.value).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1100);
      });

      jest.useRealTimers();
    });
  });

  describe('useTrailParticles', () => {
    it('应该返回轨迹配置', () => {
      const { result } = renderHook(() => useTrailParticles());

      expect(result.current.trail).toBeDefined();
    });

    it('应该返回addTrailPoint函数', () => {
      const { result } = renderHook(() => useTrailParticles());

      expect(result.current.addTrailPoint).toBeDefined();
      expect(typeof result.current.addTrailPoint).toBe('function');
    });

    it('应该返回getParticleStyle函数', () => {
      const { result } = renderHook(() => useTrailParticles());

      expect(result.current.getParticleStyle).toBeDefined();
    });

    it('应该返回clearTrail函数', () => {
      const { result } = renderHook(() => useTrailParticles());

      expect(result.current.clearTrail).toBeDefined();
      expect(typeof result.current.clearTrail).toBe('function');
    });

    it('应该添加轨迹点', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useTrailParticles({ density: 1 }));

      act(() => {
        result.current.addTrailPoint(100, 100);
      });

      expect(result.current.trail.length).toBeGreaterThan(0);

      jest.useRealTimers();
    });

    it('应该能够调用clearTrail函数', () => {
      jest.useFakeTimers();
      const { result } = renderHook(() => useTrailParticles({ density: 1 }));

      act(() => {
        result.current.addTrailPoint(100, 100);
      });

      expect(() => {
        act(() => {
          result.current.clearTrail();
        });
      }).not.toThrow();

      jest.useRealTimers();
    });
  });
});
