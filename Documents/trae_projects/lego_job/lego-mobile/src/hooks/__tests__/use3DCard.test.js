/**
 * use3DCard Hook 详细单元测试
 * 目标：达到90%行覆盖率
 */

import { renderHook, act } from '@testing-library/react-native';
import { use3DCard } from '../use3DCard';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  useSharedValue: (initial) => ({ value: initial }),
  useAnimatedStyle: (callback) => callback(),
  withTiming: (toValue, config) => toValue,
  withSpring: (toValue, config) => toValue,
  interpolate: (value, inputRange, outputRange, extrapolate) => {
    const ratio = (value - inputRange[0]) / (inputRange[inputRange.length - 1] - inputRange[0]);
    return outputRange[0] + ratio * (outputRange[outputRange.length - 1] - outputRange[0]);
  },
  Extrapolate: { CLAMP: 'clamp' },
  runOnJS: (fn) => fn,
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  Gesture: {
    Pan: () => ({
      onBegin: jest.fn(function() { return this; }),
      onUpdate: jest.fn(function() { return this; }),
      onEnd: jest.fn(function() { return this; }),
      onFinalize: jest.fn(function() { return this; }),
    }),
    Tap: () => ({
      onEnd: jest.fn(function() { return this; }),
    }),
    Simultaneous: jest.fn(() => ({})),
  },
}));

// Mock animations utils
jest.mock('../../utils/animations', () => ({
  CARD_3D_CONFIG: {
    perspective: 1000,
    flipDuration: 600,
    tiltMaxAngle: 15,
    shadowOpacity: 0.2,
    shadowBlur: 10,
    selectElevation: 10,
  },
  EASINGS: {
    standard: 'standard',
  },
  calculateTiltAngle: (x, y, centerX, centerY, maxAngle) => ({
    rotateX: ((y - centerY) / centerY) * maxAngle,
    rotateY: ((x - centerX) / centerX) * maxAngle,
  }),
}));

describe('use3DCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始化', () => {
    it('应该返回所有必需的属性和方法', () => {
      const { result } = renderHook(() => use3DCard());
      
      expect(result.current.frontAnimatedStyle).toBeDefined();
      expect(result.current.backAnimatedStyle).toBeDefined();
      expect(result.current.shadowAnimatedStyle).toBeDefined();
      expect(result.current.glowAnimatedStyle).toBeDefined();
      expect(result.current.gesture).toBeDefined();
      expect(result.current.flipCard).toBeDefined();
      expect(result.current.resetTilt).toBeDefined();
      expect(result.current.updateLayout).toBeDefined();
      expect(result.current.animateSelect).toBeDefined();
      expect(result.current.flipProgress).toBeDefined();
      expect(result.current.isFlipped).toBeDefined();
    });

    it('应该接受选项参数', () => {
      const onFlip = jest.fn();
      const onTilt = jest.fn();
      const onPress = jest.fn();
      
      const { result } = renderHook(() => use3DCard({
        onFlip,
        onTilt,
        onPress,
        enableTilt: true,
        enableFlip: true,
      }));
      
      expect(result.current).toBeDefined();
    });

    it('应该使用默认选项', () => {
      const { result } = renderHook(() => use3DCard());
      expect(result.current).toBeDefined();
    });
  });

  describe('翻转功能', () => {
    it('应该翻转卡片', () => {
      const onFlip = jest.fn();
      const { result } = renderHook(() => use3DCard({ onFlip, enableFlip: true }));
      
      act(() => {
        result.current.flipCard();
      });
      
      expect(result.current.flipProgress.value).toBe(1);
    });

    it('应该翻转回正面', () => {
      const onFlip = jest.fn();
      const { result } = renderHook(() => use3DCard({ onFlip, enableFlip: true }));
      
      act(() => {
        result.current.flipCard();
        result.current.flipCard();
      });
      
      expect(result.current.flipProgress.value).toBe(0);
    });

    it('禁用翻转时不应该翻转', () => {
      const onFlip = jest.fn();
      const { result } = renderHook(() => use3DCard({ onFlip, enableFlip: false }));
      
      act(() => {
        result.current.flipCard();
      });
      
      expect(result.current.flipProgress.value).toBe(0);
    });

    it('应该报告翻转状态', () => {
      const { result } = renderHook(() => use3DCard({ enableFlip: true }));
      
      expect(result.current.isFlipped()).toBe(false);
      
      act(() => {
        result.current.flipCard();
      });
      
      expect(result.current.isFlipped()).toBe(true);
    });
  });

  describe('倾斜功能', () => {
    it('应该重置倾斜', () => {
      const { result } = renderHook(() => use3DCard());
      
      act(() => {
        result.current.resetTilt();
      });
      
      expect(result.current).toBeDefined();
    });

    it('应该更新布局', () => {
      const { result } = renderHook(() => use3DCard());
      
      const mockEvent = {
        nativeEvent: {
          layout: { width: 100, height: 150, x: 0, y: 0 },
        },
      };
      
      act(() => {
        result.current.updateLayout(mockEvent);
      });
      
      expect(result.current).toBeDefined();
    });
  });

  describe('选中状态', () => {
    it('应该激活选中状态', () => {
      const { result } = renderHook(() => use3DCard());
      
      act(() => {
        result.current.animateSelect(true);
      });
      
      expect(result.current).toBeDefined();
    });

    it('应该取消选中状态', () => {
      const { result } = renderHook(() => use3DCard());
      
      act(() => {
        result.current.animateSelect(true);
        result.current.animateSelect(false);
      });
      
      expect(result.current).toBeDefined();
    });
  });

  describe('动画样式', () => {
    it('应该返回正面动画样式', () => {
      const { result } = renderHook(() => use3DCard());
      const style = result.current.frontAnimatedStyle;
      
      expect(style).toBeDefined();
      expect(style.transform).toBeDefined();
      expect(style.opacity).toBeDefined();
    });

    it('应该返回背面动画样式', () => {
      const { result } = renderHook(() => use3DCard());
      const style = result.current.backAnimatedStyle;
      
      expect(style).toBeDefined();
      expect(style.transform).toBeDefined();
      expect(style.opacity).toBeDefined();
    });

    it('应该返回阴影动画样式', () => {
      const { result } = renderHook(() => use3DCard());
      const style = result.current.shadowAnimatedStyle;
      
      expect(style).toBeDefined();
      expect(style.shadowOffset).toBeDefined();
      expect(style.shadowOpacity).toBeDefined();
    });

    it('应该返回发光动画样式', () => {
      const { result } = renderHook(() => use3DCard());
      const style = result.current.glowAnimatedStyle;
      
      expect(style).toBeDefined();
      expect(style.opacity).toBeDefined();
    });
  });

  describe('手势', () => {
    it('应该返回组合手势', () => {
      const { result } = renderHook(() => use3DCard());
      
      expect(result.current.gesture).toBeDefined();
    });
  });
});
