/**
 * AdventureScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AdventureScreen from '../AdventureScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve('test-user-id')),
    getUsername: jest.fn(() => Promise.resolve('test-user')),
  },
}));

jest.mock('../../../api', () => ({
  booksAPI: {
    getList: jest.fn(() => Promise.resolve({ books: [
      { book_id: 'book-1', title: '冒险故事1', chapter_count: 3 },
      { book_id: 'book-2', title: '冒险故事2', chapter_count: 5 },
    ] })),
  },
  usersAPI: {
    getUser: jest.fn(() => Promise.resolve({ 
      user: { 
        time_used_today: 60,
        daily_time_limit: 120 
      } 
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

describe('AdventureScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始渲染', () => {
    it('应该渲染冒险模式页面', async () => {
      const { getAllByText } = renderWithProviders(<AdventureScreen navigation={mockNavigation} />);
      await waitFor(() => {
        const elements = getAllByText(/冒险模式/);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    it('应该显示页面调试标签', async () => {
      const { getByText } = renderWithProviders(<AdventureScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/当前页面: AdventureScreen/)).toBeTruthy();
      });
    });

    it('应该显示今日阅读时间', async () => {
      const { getByText } = renderWithProviders(<AdventureScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/今日阅读时间/)).toBeTruthy();
      });
    });

    it('应该显示每日限额', async () => {
      const { getByText } = renderWithProviders(<AdventureScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/每日限额/)).toBeTruthy();
      });
    });

    it('应该显示故事列表标题', async () => {
      const { getByText } = renderWithProviders(<AdventureScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/选择一个故事开始冒险/)).toBeTruthy();
      });
    });
  });

  describe('空状态', () => {
    it('应该显示空状态当没有故事时', async () => {
      const { booksAPI } = require('../../../api');
      booksAPI.getList.mockResolvedValueOnce({ books: [] });
      const { getByText } = renderWithProviders(<AdventureScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('还没有故事')).toBeTruthy();
      });
    });

    it('应该显示创建故事按钮当没有故事时', async () => {
      const { booksAPI } = require('../../../api');
      booksAPI.getList.mockResolvedValueOnce({ books: [] });
      const { getByText } = renderWithProviders(<AdventureScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/创建故事/)).toBeTruthy();
      });
    });

    it('点击创建故事应该导航到首页', async () => {
      const { booksAPI } = require('../../../api');
      booksAPI.getList.mockResolvedValueOnce({ books: [] });
      const { getByText } = renderWithProviders(<AdventureScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/创建故事/)).toBeTruthy();
      });
      fireEvent.press(getByText(/创建故事/));
      expect(mockNavigate).toHaveBeenCalledWith('Home');
    });
  });
});
