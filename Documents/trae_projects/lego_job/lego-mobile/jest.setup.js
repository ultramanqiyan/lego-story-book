// Jest 测试设置文件
import '@testing-library/jest-native/extend-expect';

// 在React Native setup.js之前覆盖requestAnimationFrame
// 避免setTimeout在测试结束后继续运行
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;
const activeTimers = new Set();

global.requestAnimationFrame = (callback) => {
  const timerId = originalSetTimeout(() => {
    activeTimers.delete(timerId);
    callback(Date.now());
  }, 0);
  activeTimers.add(timerId);
  return timerId;
};

global.cancelAnimationFrame = (id) => {
  originalClearTimeout(id);
  activeTimers.delete(id);
};

// 模拟 matchMedia
global.matchMedia = jest.fn(() => ({
  matches: false,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// 模拟 document
if (typeof document === 'undefined') {
  global.document = {
    createElement: jest.fn(() => ({
      style: {},
      setAttribute: jest.fn(),
      appendChild: jest.fn(),
    })),
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    body: {
      appendChild: jest.fn(),
      removeChild: jest.fn(),
    },
    head: {
      appendChild: jest.fn(),
    },
  };
}

// 全局 mock Dimensions
global.__DIMENSIONS_MOCK__ = {
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  set: jest.fn(),
};

// 模拟 react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  const AnimatedView = (props) => React.createElement(View, props);
  const AnimatedText = (props) => React.createElement(Text, props);
  return {
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    useAnimatedProps: jest.fn(() => ({})),
    useAnimatedReaction: jest.fn(),
    useDerivedValue: jest.fn((fn) => ({ value: fn() })),
    withTiming: jest.fn((val) => val),
    withSpring: jest.fn((val) => val),
    withDelay: jest.fn((delay, val) => val),
    withRepeat: jest.fn((val) => val),
    withSequence: jest.fn((...args) => args[args.length - 1]),
    interpolate: jest.fn((val, input, output) => val),
    Extrapolate: { CLAMP: 'clamp' },
    Easing: {
      linear: jest.fn(),
      sin: jest.fn(),
      bounce: jest.fn(),
      bezier: jest.fn(() => (input) => input),
      elastic: jest.fn(() => jest.fn()),
      out: jest.fn((fn) => fn),
      quad: jest.fn(),
    },
    runOnJS: jest.fn((fn) => fn),
    runOnUI: jest.fn((fn) => fn),
    default: {
      View: AnimatedView,
      Text: AnimatedText,
      call: jest.fn(),
      createAnimatedComponent: (Component) => Component,
    },
    View: AnimatedView,
    Text: AnimatedText,
    createAnimatedComponent: (Component) => Component,
  };
});

// 模拟 react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  return {
    Gesture: {
      Tap: () => ({
        onEnd: jest.fn().mockReturnThis(),
      }),
      Pan: () => ({
        onBegin: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
        onFinalize: jest.fn().mockReturnThis(),
      }),
      Simultaneous: jest.fn().mockReturnThis(),
    },
    GestureDetector: ({ children }) => children,
  };
});

// 模拟 AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// 模拟 expo-secure-store
jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(() => Promise.resolve()),
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

// 模拟 expo-clipboard
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
  getStringAsync: jest.fn(() => Promise.resolve('')),
}));

// 模拟 expo-sharing
jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  shareAsync: jest.fn(() => Promise.resolve()),
}));

// 模拟 react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// 模拟 @react-navigation/native
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
  };
});

// 全局测试工具
global.flushPromises = () => new Promise(resolve => setImmediate(resolve));

// 清理所有活动定时器
afterEach(() => {
  activeTimers.forEach((id) => {
    originalClearTimeout(id);
  });
  activeTimers.clear();
});

// 模拟 console.error 以捕获 React 错误
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
