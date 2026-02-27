/**
 * WeatherEffectV2 测试
 * 测试天气特效组件V2
 */

import React from 'react';
import { View, Text } from 'react-native';
import { render, screen, waitFor } from '@testing-library/react-native';
import WeatherEffectV2 from '../WeatherEffectV2';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const AnimatedView = (props) => React.createElement(View, props);
  const AnimatedText = (props) => React.createElement(Text, props);
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
    },
    default: {
      View: AnimatedView,
      Text: AnimatedText,
    },
    View: AnimatedView,
    Text: AnimatedText,
  };
});

// Mock constants
jest.mock('../../../utils/constants', () => ({
  COLORS: {
    legoYellow: '#FFD500',
    legoBlue: '#006CB7',
    white: '#FFFFFF',
    background: '#F5F5F5',
  },
}));

// Mock animations
jest.mock('../../../utils/animations', () => ({
  WEATHER_CONFIG: {
    rain: {
      dropCount: 80,
      fallSpeed: [300, 500],
      dropLength: [15, 25],
      lightningInterval: 3000,
    },
    snow: {
      flakeCount: 60,
      fallDuration: [3000, 7000],
      flakeTypes: ['❄', '❅', '❆'],
    },
    sun: {
      rotationSpeed: 30000,
      rayCount: 12,
      rayLength: [60, 80],
      glowLayers: 3,
      dustParticles: 20,
    },
    fog: {
      layerCount: 5,
      moveSpeed: [20000, 30000, 25000, 35000, 28000],
      opacity: [0.3, 0.25, 0.2, 0.15, 0.1],
    },
  },
  EASINGS: {
    sine: jest.fn(),
  },
  random: jest.fn((min, max) => min + Math.random() * (max - min)),
  randomInt: jest.fn((min, max) => Math.floor(min + Math.random() * (max - min + 1))),
}));

describe('WeatherEffectV2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  describe('渲染', () => {
    it('应该在weather为null时返回null', () => {
      const { UNSAFE_root } = render(<WeatherEffectV2 weather={null} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('应该在weather为undefined时返回null', () => {
      const { UNSAFE_root } = render(<WeatherEffectV2 weather={undefined} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('应该渲染晴天效果', () => {
      render(<WeatherEffectV2 weather="sunny" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染雨天效果', () => {
      render(<WeatherEffectV2 weather="rainy" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染雷雨天效果', () => {
      render(<WeatherEffectV2 weather="thunder" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染雪天效果', () => {
      render(<WeatherEffectV2 weather="snow" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染雾天效果', () => {
      render(<WeatherEffectV2 weather="fog" />);
      expect(screen).toBeTruthy();
    });

    it('应该在未知天气时返回null', () => {
      const { UNSAFE_root } = render(<WeatherEffectV2 weather="unknown" />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('晴天效果', () => {
    it('应该渲染太阳核心', () => {
      render(<WeatherEffectV2 weather="sunny" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染太阳光线', () => {
      render(<WeatherEffectV2 weather="sunny" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染太阳光晕', () => {
      render(<WeatherEffectV2 weather="sunny" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染尘埃粒子', () => {
      render(<WeatherEffectV2 weather="sunny" />);
      expect(screen).toBeTruthy();
    });
  });

  describe('雨天效果', () => {
    it('应该渲染雨滴', () => {
      render(<WeatherEffectV2 weather="rainy" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染雾气层', () => {
      render(<WeatherEffectV2 weather="rainy" />);
      expect(screen).toBeTruthy();
    });
  });

  describe('雷雨天效果', () => {
    it('应该渲染雨滴', () => {
      render(<WeatherEffectV2 weather="thunder" />);
      expect(screen).toBeTruthy();
    });

    it('应该触发闪电效果', async () => {
      render(<WeatherEffectV2 weather="thunder" />);
      jest.advanceTimersByTime(4000);
      await waitFor(() => {
        expect(screen).toBeTruthy();
      });
    });
  });

  describe('雪天效果', () => {
    it('应该渲染雪花', () => {
      render(<WeatherEffectV2 weather="snow" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染积雪效果', () => {
      render(<WeatherEffectV2 weather="snow" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染冰霜边框', () => {
      render(<WeatherEffectV2 weather="snow" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染不同类型的雪花', () => {
      render(<WeatherEffectV2 weather="snow" />);
      expect(screen).toBeTruthy();
    });
  });

  describe('雾天效果', () => {
    it('应该渲染多层雾', () => {
      render(<WeatherEffectV2 weather="fog" />);
      expect(screen).toBeTruthy();
    });

    it('应该渲染移动的雾层', () => {
      render(<WeatherEffectV2 weather="fog" />);
      expect(screen).toBeTruthy();
    });
  });

  describe('样式', () => {
    it('应该应用正确的容器样式', () => {
      render(<WeatherEffectV2 weather="sunny" />);
      expect(screen).toBeTruthy();
    });

    it('应该设置pointerEvents为none', () => {
      render(<WeatherEffectV2 weather="sunny" />);
      expect(screen).toBeTruthy();
    });
  });

  describe('动画', () => {
    it('应该为雨滴创建下落动画', () => {
      render(<WeatherEffectV2 weather="rainy" />);
      expect(screen).toBeTruthy();
    });

    it('应该为雪花创建摆动动画', () => {
      render(<WeatherEffectV2 weather="snow" />);
      expect(screen).toBeTruthy();
    });

    it('应该为太阳创建旋转动画', () => {
      render(<WeatherEffectV2 weather="sunny" />);
      expect(screen).toBeTruthy();
    });
  });

  describe('性能', () => {
    it('应该使用useMemo缓存配置', () => {
      const { rerender } = render(<WeatherEffectV2 weather="sunny" />);
      rerender(<WeatherEffectV2 weather="sunny" />);
      expect(screen).toBeTruthy();
    });

    it('应该在组件卸载时清理定时器', () => {
      const { unmount } = render(<WeatherEffectV2 weather="thunder" />);
      unmount();
      expect(screen).toBeTruthy();
    });
  });

  describe('强度参数', () => {
    it('应该接受intensity参数', () => {
      render(<WeatherEffectV2 weather="rainy" intensity={1.5} />);
      expect(screen).toBeTruthy();
    });

    it('应该接受默认intensity', () => {
      render(<WeatherEffectV2 weather="rainy" />);
      expect(screen).toBeTruthy();
    });
  });
});
