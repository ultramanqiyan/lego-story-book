/**
 * HomeScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve('test-user-id')),
    getUsername: jest.fn(() => Promise.resolve('test-user')),
  },
}));

jest.mock('../../../api/characters', () => ({
  charactersAPI: {
    getList: jest.fn(() => Promise.resolve({
      characters: [
        { character_id: '1', name: '角色1', description: '描述1', creator_id: 'system' },
        { character_id: '2', name: '角色2', description: '描述2', creator_id: 'system' },
        { character_id: '3', name: '角色3', description: '描述3', creator_id: 'user' },
      ]
    })),
  },
}));

jest.mock('../../../api/books', () => ({
  booksAPI: {
    getList: jest.fn(() => Promise.resolve({
      books: [
        { book_id: '1', title: '故事1', chapter_count: 3 },
        { book_id: '2', title: '故事2', chapter_count: 5 },
      ]
    })),
  },
}));

jest.mock('../../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: { userId: 'test-user-id', username: '测试用户' },
    isLoggedIn: true,
  }),
}));

jest.mock('../../../context/ToastContext', () => ({
  ToastProvider: ({ children }) => children,
  useToast: () => mockToast,
}));

jest.mock('../../../components/common', () => ({
  Card: function MockCard({ children, style, onPress, variant }) {
    const { View, Text, TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <View>{children}</View>
      </TouchableOpacity>
    );
  },
  Button: function MockButton({ title, onPress, variant, size, style }) {
    const { Text, TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} style={style}>
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  },
  Loading: function MockLoading({ fullScreen, message }) {
    const { View, Text, ActivityIndicator } = require('react-native');
    return (
      <View>
        <ActivityIndicator />
        {message && <Text>{message}</Text>}
      </View>
    );
  },
  EmptyState: function MockEmptyState({ icon, title, description, action }) {
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>{icon}</Text>
        <Text>{title}</Text>
        <Text>{description}</Text>
        {action}
      </View>
    );
  },
  GlowOrbBackground: function MockGlowOrbBackground() {
    const { View } = require('react-native');
    return <View testID="glow-orb-background" />;
  },
}));

const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <ToastProvider>
        {component}
      </ToastProvider>
    </AuthProvider>
  );
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始渲染', () => {
    it('应该渲染首页', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('📱 当前页面: HomeScreen (首页)')).toBeTruthy();
      });
    });

    it('应该显示问候语', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/你好/)).toBeTruthy();
        expect(getByText('今天想听什么故事？')).toBeTruthy();
      });
    });

    it('应该显示欢迎卡片', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('欢迎来到乐高故事世界')).toBeTruthy();
      });
    });

    it('应该显示功能列表', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('🎭 选择你喜欢的乐高人仔作为故事角色')).toBeTruthy();
        expect(getByText('📖 创建属于你自己的冒险故事')).toBeTruthy();
        expect(getByText('🧩 解答有趣的谜题推进剧情')).toBeTruthy();
        expect(getByText('📤 与朋友分享你的故事')).toBeTruthy();
      });
    });

    it('应该显示开始冒险按钮', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('🎮 开始冒险')).toBeTruthy();
      });
    });

    it('应该显示3D卡牌演示按钮', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('🎴 3D卡牌演示')).toBeTruthy();
      });
    });

    it('应该显示热门人仔区域', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('🔥 热门人仔')).toBeTruthy();
      });
    });

    it('应该显示最近故事区域', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('📚 最近故事')).toBeTruthy();
      });
    });

    it('应该显示角色列表', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('角色1')).toBeTruthy();
        expect(getByText('角色2')).toBeTruthy();
      });
    });

    it('应该显示故事列表', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('故事1')).toBeTruthy();
        expect(getByText('故事2')).toBeTruthy();
      });
    });
  });

  describe('导航功能', () => {
    it('点击开始冒险应该跳转到StoryCreate', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('🎮 开始冒险')).toBeTruthy();
      });
      fireEvent.press(getByText('🎮 开始冒险'));
      expect(mockNavigate).toHaveBeenCalledWith('StoryCreate');
    });

    it('点击3D卡牌演示应该跳转到Card3DDemo', async () => {
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('🎴 3D卡牌演示')).toBeTruthy();
      });
      fireEvent.press(getByText('🎴 3D卡牌演示'));
      expect(mockNavigate).toHaveBeenCalledWith('Card3DDemo');
    });

    it('点击查看全部角色应该跳转到Characters', async () => {
      const { getAllByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getAllByText('查看全部').length).toBeGreaterThan(0);
      });
      const buttons = getAllByText('查看全部');
      fireEvent.press(buttons[0]);
      expect(mockNavigate).toHaveBeenCalledWith('Characters');
    });

    it('点击查看全部故事应该跳转到Bookshelf', async () => {
      const { getAllByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getAllByText('查看全部').length).toBeGreaterThan(0);
      });
      const buttons = getAllByText('查看全部');
      fireEvent.press(buttons[1]);
      expect(mockNavigate).toHaveBeenCalledWith('Bookshelf');
    });
  });

  describe('加载失败', () => {
    it('应该处理加载失败的情况', async () => {
      const { charactersAPI } = require('../../../api/characters');
      charactersAPI.getList.mockRejectedValueOnce(new Error('网络错误'));
      renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('加载失败，请下拉刷新');
      });
    });
  });

  describe('空数据状态', () => {
    it('应该显示空状态当没有角色时', async () => {
      const { charactersAPI } = require('../../../api/characters');
      charactersAPI.getList.mockResolvedValueOnce({ characters: [] });
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('暂无热门人仔')).toBeTruthy();
      });
    });

    it('应该显示空状态当没有故事时', async () => {
      const { booksAPI } = require('../../../api/books');
      booksAPI.getList.mockResolvedValueOnce({ books: [] });
      const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('还没有故事')).toBeTruthy();
      });
    });
  });
});
