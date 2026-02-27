/**
 * ChapterScreen 详细单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ChapterScreen from '../ChapterScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockPush = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  push: mockPush,
};

const mockRoute = {
  params: { chapterId: 'test-chapter-id', bookId: 'test-book-id' },
};

jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve('test-user-id')),
    getUsername: jest.fn(() => Promise.resolve('test-user')),
  },
}));

jest.mock('../../../api', () => ({
  chaptersAPI: {
    getDetail: jest.fn(() => Promise.resolve({
      chapter: {
        chapter_id: '1',
        title: '第一章',
        content: '这是第一章的内容...',
        chapter_number: 1,
        has_puzzle: false,
        book_id: 'test-book-id',
      },
      puzzle: null,
      bookCharacters: [
        { character_id: '1', name: '角色1', custom_name: '自定义角色1', role_type: 'protagonist' },
      ],
      navigation: { prev: null, next: 'chapter-2', total: 5, current: 1 },
    })),
    complete: jest.fn(() => Promise.resolve({ success: true })),
    generate: jest.fn(() => Promise.resolve({ chapterId: 'new-chapter-id' })),
  },
  puzzleAPI: {
    submit: jest.fn(() => Promise.resolve({
      isCorrect: true,
      attempts: 1,
      attemptsRemaining: 2,
      message: '回答正确',
    })),
  },
  plotOptionsAPI: {
    get: jest.fn(() => Promise.resolve({
      plotOptions: {
        weather: [{ id: 'sunny', name: '晴天', icon: '☀️' }],
        adventureType: [{ id: 'exploration', name: '探索', icon: '🗺️' }],
        terrain: [{ id: 'forest', name: '森林', icon: '🌲' }],
        equipment: [{ id: 'sword', name: '剑', icon: '🗡️' }],
      },
    })),
  },
  booksAPI: {
    getDetail: jest.fn(() => Promise.resolve({
      characters: [{ character_id: '2', name: '角色2', custom_name: '自定义角色2', role_type: 'supporting' }],
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

  describe('初始渲染', () => {
    it('应该渲染加载状态', () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      expect(getByText('加载章节...')).toBeTruthy();
    });

    it('应该渲染章节页面', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('📱 当前页面: ChapterScreen (章节阅读页)')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该渲染章节标题', async () => {
      const { getAllByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        const titles = getAllByText('第一章');
        expect(titles.length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });

    it('应该渲染返回按钮', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('←')).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('章节导航', () => {
    it('应该显示章节导航指示器', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('1 / 5')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示上一章按钮', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('上一章')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示下一章按钮', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('下一章')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('点击下一章应该导航', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('下一章')).toBeTruthy();
      }, { timeout: 5000 });
      const nextButton = getByText('下一章');
      fireEvent.press(nextButton);
      expect(mockPush).toHaveBeenCalledWith('Chapter', { chapterId: 'chapter-2', bookId: 'test-book-id' });
    });

    it('点击返回按钮应该调用goBack', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('←')).toBeTruthy();
      }, { timeout: 5000 });
      const backButton = getByText('←');
      fireEvent.press(backButton);
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('创作提示', () => {
    it('应该显示展开创作提示按钮', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('▶ 展开创作提示')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('点击应该展开创作提示', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('▶ 展开创作提示')).toBeTruthy();
      }, { timeout: 5000 });
      const toggleButton = getByText('▶ 展开创作提示');
      fireEvent.press(toggleButton);
      await waitFor(() => {
        expect(getByText('▼ 收起创作提示')).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('继续生成故事', () => {
    it('应该显示继续生成故事按钮', async () => {
      const { getByText } = renderWithProviders(<ChapterScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('✨ 继续生成故事')).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('边界情况', () => {
    it('应该处理无效的chapterId', async () => {
      const invalidRoute = { params: { chapterId: null, bookId: 'test-book-id' } };
      renderWithProviders(<ChapterScreen route={invalidRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalled();
      }, { timeout: 5000 });
    });
  });
});
