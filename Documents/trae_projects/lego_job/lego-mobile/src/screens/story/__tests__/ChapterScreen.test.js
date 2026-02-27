/**
 * ChapterScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChapterScreen from '../../chapter/ChapterScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

const mockRoute = {
  params: { chapterId: 'test-chapter-id', bookId: 'test-book-id' },
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
  chaptersAPI: {
    getById: jest.fn(() => Promise.resolve({
      chapter: {
        chapter_id: '1',
        title: '第一章',
        content: '这是第一章的内容...',
        chapter_number: 1,
      }
    })),
  },
  booksAPI: {
    getById: jest.fn(() => Promise.resolve({
      book: { book_id: '1', title: '测试故事' }
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

describe('ChapterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染章节阅读页面', async () => {
    const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText(/ChapterScreen/)).toBeTruthy();
    });
  });

  it('应该显示返回按钮', async () => {
    const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('←')).toBeTruthy();
    });
  });

  it('应该显示上一章按钮', async () => {
    const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('上一章')).toBeTruthy();
    });
  });

  it('应该显示下一章按钮', async () => {
    const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText('下一章')).toBeTruthy();
    });
  });

  it('应该显示继续生成故事按钮', async () => {
    const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText(/继续生成故事/)).toBeTruthy();
    });
  });

  it('应该显示展开创作提示按钮', async () => {
    const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
    await waitFor(() => {
      expect(getByText(/展开创作提示/)).toBeTruthy();
    });
  });
});
