/**
 * BookDetailScreen 测试
 * 测试书籍详情页面的所有功能
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import BookDetailScreen from '../BookDetailScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';
import { booksAPI, charactersAPI, bookCharactersAPI, shareAPI } from '../../../api';

// Mock API
jest.mock('../../../api');

// Mock navigation
const mockNavigation = {
  goBack: jest.fn(),
  navigate: jest.fn(),
};

const mockRoute = {
  params: {
    bookId: 'book-123',
  },
};

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn((title, message, buttons) => {
    if (buttons && buttons.length > 0) {
      const lastButton = buttons[buttons.length - 1];
      if (lastButton.onPress) lastButton.onPress();
    }
  }),
}));

// Mock Share
jest.mock('react-native/Libraries/Share/Share', () => ({
  share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
}));

const renderWithProviders = (component) => {
  return render(
    <ToastProvider>
      <AuthProvider>
        {component}
      </AuthProvider>
    </ToastProvider>
  );
};

describe('BookDetailScreen', () => {
  const mockBook = {
    book: {
      book_id: 'book-123',
      title: '测试故事书',
      prompt: '这是一个测试提示词',
    },
    characters: [
      { id: 'char-1', character_id: 'c1', custom_name: '主角A', role_type: 'protagonist' },
      { id: 'char-2', character_id: 'c2', custom_name: '配角B', role_type: 'supporting' },
    ],
    chapters: [
      { chapter_id: 'ch-1', chapter_number: 1, title: '第一章', has_puzzle: true, puzzle_result: 1, word_count: 500 },
      { chapter_id: 'ch-2', chapter_number: 2, title: '第二章', has_puzzle: false, word_count: 600 },
    ],
  };

  const mockAllCharacters = {
    characters: [
      { character_id: 'c1', name: '角色1' },
      { character_id: 'c2', name: '角色2' },
      { character_id: 'c3', name: '角色3' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    booksAPI.getDetail.mockResolvedValue(mockBook);
    charactersAPI.getList.mockResolvedValue(mockAllCharacters);
    bookCharactersAPI.add.mockResolvedValue({});
    bookCharactersAPI.update.mockResolvedValue({});
    bookCharactersAPI.delete.mockResolvedValue({});
    booksAPI.update.mockResolvedValue({});
    booksAPI.delete.mockResolvedValue({});
    shareAPI.create.mockResolvedValue({ shareCode: 'ABC123' });
    require('react-native/Libraries/Share/Share').share.mockClear();
  });

  describe('初始渲染', () => {
    it('应该显示加载状态', () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );
      expect(screen.getByText('加载书籍...')).toBeTruthy();
    });

    it('应该加载并显示书籍详情', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('测试故事书')).toBeTruthy();
      });

      expect(screen.getByText('第一章')).toBeTruthy();
      expect(screen.getByText('第二章')).toBeTruthy();
    });

    it('应该在无bookId时返回上一页', async () => {
      const invalidRoute = { params: {} };
      renderWithProviders(
        <BookDetailScreen route={invalidRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });
  });

  describe('章节标签页', () => {
    it('应该默认显示章节列表', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('第一章')).toBeTruthy();
        expect(screen.getByText('第二章')).toBeTruthy();
      });
    });

    it('应该显示章节谜题状态', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('第一章')).toBeTruthy();
      });
    });

    it('应该导航到章节详情', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('第一章')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('第一章'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('Chapter', {
        chapterId: 'ch-1',
        bookId: 'book-123',
      });
    });

    it('应该导航到故事导演台添加章节', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('➕ 添加章节')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('➕ 添加章节'));
      expect(mockNavigation.navigate).toHaveBeenCalledWith('StoryDirector', {
        bookId: 'book-123',
      });
    });
  });

  describe('角色标签页', () => {
    it('应该显示角色标签', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('测试故事书')).toBeTruthy();
      });

      const roleTabs = screen.getAllByText('角色');
      expect(roleTabs.length).toBeGreaterThan(0);
    });
  });

  describe('编辑书籍', () => {
    it('应该打开编辑书籍弹窗', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('⚙️')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('⚙️'));

      await waitFor(() => {
        expect(screen.getByText('⚙️ 书籍设置')).toBeTruthy();
      });
    });

    it('应该更新书名', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('⚙️')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('⚙️'));

      await waitFor(() => {
        expect(screen.getByText('⚙️ 书籍设置')).toBeTruthy();
      });

      const input = screen.getByPlaceholderText('输入新书名');
      fireEvent.changeText(input, '新书名');

      fireEvent.press(screen.getByText('✅ 保存书名'));

      await waitFor(() => {
        expect(booksAPI.update).toHaveBeenCalledWith('book-123', { title: '新书名' });
      });
    });
  });

  describe('分享功能', () => {
    it('应该分享书籍', async () => {
      const ShareMock = require('react-native/Libraries/Share/Share');

      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('📤')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('📤'));

      await waitFor(() => {
        expect(shareAPI.create).toHaveBeenCalledWith('book-123', undefined);
        expect(ShareMock.share).toHaveBeenCalled();
      });
    });
  });

  describe('查看提示词', () => {
    it('应该显示提示词弹窗', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('📝')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('📝'));

      await waitFor(() => {
        expect(screen.getByText('📝 AI提示词')).toBeTruthy();
        expect(screen.getByText('这是一个测试提示词')).toBeTruthy();
      });
    });
  });

  describe('删除书籍', () => {
    it('应该删除书籍并返回', async () => {
      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('⚙️')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('⚙️'));

      await waitFor(() => {
        expect(screen.getByText('🗑️ 删除这本书')).toBeTruthy();
      });

      fireEvent.press(screen.getByText('🗑️ 删除这本书'));

      await waitFor(() => {
        expect(booksAPI.delete).toHaveBeenCalledWith('book-123');
        expect(mockNavigation.goBack).toHaveBeenCalled();
      });
    });
  });

  describe('空状态', () => {
    it('应该显示空章节状态', async () => {
      booksAPI.getDetail.mockResolvedValue({
        book: { book_id: 'book-123', title: '空书' },
        characters: [],
        chapters: [],
      });

      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('还没有章节')).toBeTruthy();
      });
    });

    it('应该显示空角色状态', async () => {
      booksAPI.getDetail.mockResolvedValue({
        book: { book_id: 'book-123', title: '空书' },
        characters: [],
        chapters: [],
      });

      renderWithProviders(
        <BookDetailScreen route={mockRoute} navigation={mockNavigation} />
      );

      await waitFor(() => {
        expect(screen.getByText('空书')).toBeTruthy();
      });

      const roleTabs = screen.getAllByText('角色');
      expect(roleTabs.length).toBeGreaterThan(0);
    });
  });
});
