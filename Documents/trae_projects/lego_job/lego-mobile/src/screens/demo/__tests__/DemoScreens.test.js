/**
 * DemoScreens 测试
 * 测试Demo展示页面的所有功能
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import {
  DemoNavigator,
  Demo1Login,
  Demo2Home,
  Demo3Director,
  Demo4Reader,
  Demo5Collection,
} from '../DemoScreens';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  useSharedValue: jest.fn(() => ({ value: 0 })),
  useAnimatedStyle: jest.fn(() => ({})),
  withTiming: jest.fn((val) => val),
  withSpring: jest.fn((val) => val),
  withDelay: jest.fn((delay, val) => val),
  withRepeat: jest.fn((val) => val),
  interpolate: jest.fn((val, input, output) => val),
  Extrapolate: { CLAMP: 'clamp' },
  Easing: {
    linear: jest.fn(),
    sin: jest.fn(),
  },
  default: {
    View: 'Animated.View',
    Text: 'Animated.Text',
  },
}));

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllTimers();
});

describe('DemoScreens', () => {
  describe('DemoNavigator', () => {
    it('应该渲染Demo导航页面', () => {
      render(<DemoNavigator navigation={mockNavigation} />);

      expect(screen.getByText('桌游风格Demo展示')).toBeTruthy();
    });

    it('应该显示所有Demo卡片', () => {
      render(<DemoNavigator navigation={mockNavigation} />);

      expect(screen.getByText('Demo 1')).toBeTruthy();
      expect(screen.getByText('Demo 2')).toBeTruthy();
      expect(screen.getByText('Demo 3')).toBeTruthy();
      expect(screen.getByText('Demo 4')).toBeTruthy();
      expect(screen.getByText('Demo 5')).toBeTruthy();
    });

    it('应该显示Demo副标题', () => {
      render(<DemoNavigator navigation={mockNavigation} />);

      expect(screen.getByText('登录页面 - 冒险者入场')).toBeTruthy();
      expect(screen.getByText('主页 - 故事世界大厅')).toBeTruthy();
      expect(screen.getByText('故事导演台 - 天气特效')).toBeTruthy();
      expect(screen.getByText('章节阅读 - 沉浸体验')).toBeTruthy();
      expect(screen.getByText('角色收集 - 卡牌图鉴')).toBeTruthy();
    });

    it('应该导航到Demo1', () => {
      render(<DemoNavigator navigation={mockNavigation} />);

      const demo1Card = screen.getByText('Demo 1').parent.parent;
      fireEvent.press(demo1Card);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Demo1');
    });

    it('应该导航到Demo2', () => {
      render(<DemoNavigator navigation={mockNavigation} />);

      const demo2Card = screen.getByText('Demo 2').parent.parent;
      fireEvent.press(demo2Card);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('Demo2');
    });

    it('应该返回上一页', () => {
      render(<DemoNavigator navigation={mockNavigation} />);

      const backButton = screen.getByText('← 返回');
      fireEvent.press(backButton);

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('Demo1Login', () => {
    it('应该渲染登录Demo页面', () => {
      render(<Demo1Login navigation={mockNavigation} />);

      expect(screen.getByText('Demo 1: 冒险者入场')).toBeTruthy();
      expect(screen.getByText('🧱 乐高故事书')).toBeTruthy();
    });

    it('应该显示角色选择卡片', () => {
      render(<Demo1Login navigation={mockNavigation} />);

      expect(screen.getByText('法师')).toBeTruthy();
      expect(screen.getByText('战士')).toBeTruthy();
      expect(screen.getByText('精灵')).toBeTruthy();
    });

    it('应该显示开始按钮', () => {
      render(<Demo1Login navigation={mockNavigation} />);

      expect(screen.getByText('🎮 开始冒险')).toBeTruthy();
    });

    it('应该返回上一页', () => {
      render(<Demo1Login navigation={mockNavigation} />);

      const backButton = screen.getByText('← 返回');
      fireEvent.press(backButton);

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('Demo2Home', () => {
    it('应该渲染主页Demo页面', () => {
      render(<Demo2Home navigation={mockNavigation} />);

      expect(screen.getByText('Demo 2: 故事世界大厅')).toBeTruthy();
      expect(screen.getByText('🏰 欢迎来到乐高故事世界')).toBeTruthy();
    });

    it('应该显示功能列表标题', () => {
      render(<Demo2Home navigation={mockNavigation} />);

      expect(screen.getByText('在这里，你可以：')).toBeTruthy();
    });

    it('应该显示热门人仔', () => {
      render(<Demo2Home navigation={mockNavigation} />);

      expect(screen.getByText('🔥 热门人仔')).toBeTruthy();
    });

    it('应该显示最近故事', () => {
      render(<Demo2Home navigation={mockNavigation} />);

      expect(screen.getByText('📚 最近故事')).toBeTruthy();
    });

    it('应该返回上一页', () => {
      render(<Demo2Home navigation={mockNavigation} />);

      const backButton = screen.getByText('← 返回');
      fireEvent.press(backButton);

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('Demo3Director', () => {
    it('应该渲染导演台Demo页面', () => {
      render(<Demo3Director navigation={mockNavigation} />);

      expect(screen.getByText('Demo 3: 故事导演台')).toBeTruthy();
      expect(screen.getByText('🎭 舞台预览')).toBeTruthy();
    });

    it('应该显示舞台槽位', () => {
      render(<Demo3Director navigation={mockNavigation} />);

      const protagonistTexts = screen.getAllByText('主角');
      expect(protagonistTexts.length).toBeGreaterThan(0);
    });

    it('应该显示卡片选择区域', () => {
      render(<Demo3Director navigation={mockNavigation} />);

      expect(screen.getByText('🗺️ 冒险类型')).toBeTruthy();
      expect(screen.getByText('🏔️ 地形')).toBeTruthy();
      expect(screen.getByText('🌤️ 天气')).toBeTruthy();
      expect(screen.getByText('👥 角色')).toBeTruthy();
    });

    it('应该返回上一页', () => {
      render(<Demo3Director navigation={mockNavigation} />);

      const backButton = screen.getByText('← 返回');
      fireEvent.press(backButton);

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('Demo4Reader', () => {
    it('应该渲染阅读Demo页面', () => {
      render(<Demo4Reader navigation={mockNavigation} />);

      expect(screen.getByText('Demo 4: 沉浸式阅读')).toBeTruthy();
      expect(screen.getByText('第一章：启程')).toBeTruthy();
    });

    it('应该显示谜题挑战', () => {
      render(<Demo4Reader navigation={mockNavigation} />);

      expect(screen.getByText('🧩 谜题挑战')).toBeTruthy();
      expect(screen.getByText('骑士应该选择哪条路？')).toBeTruthy();
    });

    it('应该显示谜题选项', () => {
      render(<Demo4Reader navigation={mockNavigation} />);

      expect(screen.getByText('A. 穿越黑暗森林')).toBeTruthy();
      expect(screen.getByText('B. 绕道阳光大道')).toBeTruthy();
      expect(screen.getByText('C. 等待夜幕降临')).toBeTruthy();
    });

    it('应该返回上一页', () => {
      render(<Demo4Reader navigation={mockNavigation} />);

      const backButton = screen.getByText('← 返回');
      fireEvent.press(backButton);

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });

  describe('Demo5Collection', () => {
    it('应该渲染收集Demo页面', () => {
      render(<Demo5Collection navigation={mockNavigation} />);

      expect(screen.getByText('Demo 5: 角色图鉴')).toBeTruthy();
    });

    it('应该显示角色卡片网格', () => {
      render(<Demo5Collection navigation={mockNavigation} />);

      expect(screen.getByText('法师')).toBeTruthy();
      expect(screen.getByText('战士')).toBeTruthy();
      expect(screen.getByText('精灵')).toBeTruthy();
      expect(screen.getByText('王子')).toBeTruthy();
    });

    it('应该返回上一页', () => {
      render(<Demo5Collection navigation={mockNavigation} />);

      const backButton = screen.getByText('← 返回');
      fireEvent.press(backButton);

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });
  });
});
