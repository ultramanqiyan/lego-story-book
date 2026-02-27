/**
 * BookshelfScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import BookshelfScreen from '../BookshelfScreen';
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

// Mock API
jest.mock('../../../api', () => ({
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

describe('BookshelfScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染书架页面', async () => {
    const { getByText } = renderWithProviders(<BookshelfScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('📚 我的书架')).toBeTruthy();
    });
  });

  it('应该显示创建故事按钮', async () => {
    const { getByText } = renderWithProviders(<BookshelfScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('➕ 创建故事')).toBeTruthy();
    });
  });

  it('应该显示书籍列表', async () => {
    const { getByText } = renderWithProviders(<BookshelfScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('故事1')).toBeTruthy();
      expect(getByText('故事2')).toBeTruthy();
    });
  });

  it('应该显示章节数量', async () => {
    const { getByText } = renderWithProviders(<BookshelfScreen navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('📚 3章')).toBeTruthy();
      expect(getByText('📚 5章')).toBeTruthy();
    });
  });

  it('点击创建故事按钮应该跳转', async () => {
    const { getByText } = renderWithProviders(<BookshelfScreen navigation={mockNavigation} />);
    await waitFor(() => {
      const button = getByText('➕ 创建故事');
      fireEvent.press(button);
      expect(mockNavigate).toHaveBeenCalledWith('StoryCreate');
    });
  });
});
