/**
 * HomeScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../HomeScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

// Mock storage
jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve('test-user-id')),
    getUsername: jest.fn(() => Promise.resolve('test-user')),
  },
}));

// Mock API - 使用正确的路径
jest.mock('../../../api/characters', () => ({
  charactersAPI: {
    getList: jest.fn(() => Promise.resolve({
      characters: [
        { character_id: '1', name: '角色1', description: '描述1', creator_id: 'system' },
        { character_id: '2', name: '角色2', description: '描述2', creator_id: 'system' },
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

  it('应该渲染首页', async () => {
    const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('📱 当前页面: HomeScreen (首页)')).toBeTruthy();
    });
  });

  it('应该显示问候语', async () => {
    const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
    await waitFor(() => {
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

  it('点击开始冒险应该跳转到StoryCreate', async () => {
    const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
    await waitFor(() => {
      const button = getByText('🎮 开始冒险');
      fireEvent.press(button);
      expect(mockNavigate).toHaveBeenCalledWith('StoryCreate');
    });
  });

  it('点击3D卡牌演示应该跳转到Card3DDemo', async () => {
    const { getByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
    await waitFor(() => {
      const button = getByText('🎴 3D卡牌演示');
      fireEvent.press(button);
      expect(mockNavigate).toHaveBeenCalledWith('Card3DDemo');
    });
  });

  it('点击查看全部角色应该跳转到Characters', async () => {
    const { getAllByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
    await waitFor(() => {
      const buttons = getAllByText('查看全部');
      fireEvent.press(buttons[0]);
      expect(mockNavigate).toHaveBeenCalledWith('Characters');
    });
  });

  it('点击查看全部故事应该跳转到Bookshelf', async () => {
    const { getAllByText } = renderWithProviders(<HomeScreen navigation={mockNavigation} />);
    await waitFor(() => {
      const buttons = getAllByText('查看全部');
      fireEvent.press(buttons[1]);
      expect(mockNavigate).toHaveBeenCalledWith('Bookshelf');
    });
  });
});
