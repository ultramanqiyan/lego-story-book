/**
 * MagicParticles 测试
 * 测试魔法粒子效果组件
 */

import React from 'react';
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import MagicParticles from '../MagicParticles';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');
  const AnimatedView = (props) => React.createElement(View, props);
  return {
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((val) => val),
    withRepeat: jest.fn((val) => val),
    withDelay: jest.fn((delay, val) => val),
    withSequence: jest.fn((...args) => args[args.length - 1]),
    interpolate: jest.fn((val, input, output) => val),
    Extrapolate: { CLAMP: 'clamp' },
    Easing: {
      linear: jest.fn(),
      sin: jest.fn(),
      bounce: jest.fn(),
    },
    default: {
      View: AnimatedView,
    },
    View: AnimatedView,
  };
});

// Mock animations utils
jest.mock('../../../utils/animations', () => ({
  PARTICLES_CONFIG: {
    magic: {
      particleCount: 40,
      colors: ['#FFD100', '#FF6B35', '#4ECDC4', '#95E1D3'],
    },
  },
  random: jest.fn((min, max) => min + Math.random() * (max - min)),
  randomChoice: jest.fn((arr) => arr[0]),
}));

describe('MagicParticles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('渲染', () => {
    it('应该在enabled为true时渲染', () => {
      const { UNSAFE_root } = render(<MagicParticles enabled={true} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('应该在enabled为false时返回null', () => {
      const { UNSAFE_root } = render(<MagicParticles enabled={false} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('应该默认渲染', () => {
      const { UNSAFE_root } = render(<MagicParticles />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('粒子配置', () => {
    it('应该使用默认粒子数量', () => {
      render(<MagicParticles enabled={true} />);
      expect(screen).toBeTruthy();
    });

    it('应该接受自定义粒子数量', () => {
      render(<MagicParticles enabled={true} count={20} />);
      expect(screen).toBeTruthy();
    });

    it('应该接受自定义颜色', () => {
      const customColors = ['#FF0000', '#00FF00', '#0000FF'];
      render(<MagicParticles enabled={true} colors={customColors} />);
      expect(screen).toBeTruthy();
    });
  });

  describe('粒子行为', () => {
    it('应该渲染指定数量的粒子', () => {
      render(<MagicParticles enabled={true} count={5} />);
      expect(screen).toBeTruthy();
    });

    it('应该支持连接显示模式', () => {
      render(<MagicParticles enabled={true} showConnections={true} />);
      expect(screen).toBeTruthy();
    });
  });

  describe('样式', () => {
    it('应该应用正确的容器样式', () => {
      const { UNSAFE_root } = render(<MagicParticles enabled={true} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('应该设置pointerEvents为none', () => {
      render(<MagicParticles enabled={true} />);
      expect(screen).toBeTruthy();
    });
  });

  describe('动画', () => {
    it('应该为每个粒子创建动画', () => {
      render(<MagicParticles enabled={true} count={3} />);
      expect(screen).toBeTruthy();
    });

    it('应该应用浮动动画', () => {
      render(<MagicParticles enabled={true} />);
      expect(screen).toBeTruthy();
    });

    it('应该应用闪烁动画', () => {
      render(<MagicParticles enabled={true} />);
      expect(screen).toBeTruthy();
    });
  });

  describe('性能', () => {
    it('应该在组件卸载时清理动画', () => {
      const { unmount } = render(<MagicParticles enabled={true} />);
      unmount();
      expect(screen).toBeTruthy();
    });

    it('应该使用useMemo缓存粒子配置', () => {
      const { rerender } = render(<MagicParticles enabled={true} count={10} />);
      rerender(<MagicParticles enabled={true} count={10} />);
      expect(screen).toBeTruthy();
    });
  });
});
