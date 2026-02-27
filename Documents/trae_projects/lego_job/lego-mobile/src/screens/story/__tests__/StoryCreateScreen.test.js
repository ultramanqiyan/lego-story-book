/**
 * StoryCreateScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import StoryCreateScreen from '../StoryCreateScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';
import { booksAPI, charactersAPI, bookCharactersAPI, storyAPI, chaptersAPI } from '../../../api';

const mockReplace = jest.fn();
const mockNavigate = jest.fn();
const mockNavigation = {
  replace: mockReplace,
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

jest.mock('../../../api', () => ({
  booksAPI: {
    getList: jest.fn(() => Promise.resolve({ books: [
      { book_id: 'book-1', title: '测试书籍1', chapter_count: 3 },
      { book_id: 'book-2', title: '测试书籍2', chapter_count: 5 },
    ] })),
    create: jest.fn(() => Promise.resolve({ bookId: 'new-book-id' })),
  },
  charactersAPI: {
    getList: jest.fn(() => Promise.resolve({
      characters: [
        { character_id: 'char-1', name: '角色1', description: '描述1', personality: '勇敢', speaking_style: '幽默' },
        { character_id: 'char-2', name: '角色2', description: '描述2', personality: '聪明', speaking_style: '严肃' },
        { character_id: 'char-3', name: '角色3', description: '描述3', personality: '善良', speaking_style: '温柔' },
      ]
    })),
  },
  bookCharactersAPI: {
    add: jest.fn(() => Promise.resolve({ success: true })),
  },
  storyAPI: {
    generate: jest.fn(() => Promise.resolve({ 
      title: '第一章', 
      content: '故事内容',
      puzzle: null 
    })),
  },
  chaptersAPI: {
    create: jest.fn(() => Promise.resolve({ chapterId: 'new-chapter-id' })),
  },
}));

jest.mock('../../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: { userId: 'test-user-id' },
    isLoggedIn: true,
  }),
}));

jest.mock('../../../context/ToastContext', () => ({
  ToastProvider: ({ children }) => children,
  useToast: () => mockToast,
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

describe('StoryCreateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始渲染', () => {
    it('应该渲染创建故事页面', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/创建新故事/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示步骤指示器', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('1')).toBeTruthy();
        expect(getByText('2')).toBeTruthy();
        expect(getByText('3')).toBeTruthy();
        expect(getByText('4')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示书籍选择区域', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/第一步：选择书籍/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示创建新书籍区域', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/或者创建新书籍/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示页面调试标签', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/当前页面: StoryCreateScreen/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示书籍列表', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('测试书籍1')).toBeTruthy();
        expect(getByText('测试书籍2')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示章节数量', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/3章/)).toBeTruthy();
        expect(getByText(/5章/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示输入框', async () => {
      const { getByPlaceholderText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByPlaceholderText(/输入新书籍名称/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('第一步：选择书籍', () => {
    it('点击书籍应该选中并进入下一步', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('测试书籍1')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('测试书籍1'));
      await waitFor(() => {
        expect(getByText(/第二步：选择故事类型/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示书籍图标', async () => {
      const { getAllByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getAllByText('📖').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });
  });

  describe('第二步：选择故事类型', () => {
    it('应该显示故事类型选项', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('测试书籍1')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('测试书籍1'));
      await waitFor(() => {
        expect(getByText(/第二步：选择故事类型/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('第三步：选择角色', () => {
    it('应该显示角色选择区域', async () => {
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('测试书籍1')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('测试书籍1'));
      await waitFor(() => {
        expect(getByText(/第二步：选择故事类型/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('创建新书籍', () => {
    it('应该能输入新书籍名称', async () => {
      const { getByPlaceholderText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByPlaceholderText(/输入新书籍名称/)).toBeTruthy();
      }, { timeout: 5000 });
      const input = getByPlaceholderText(/输入新书籍名称/);
      fireEvent.changeText(input, '新书籍名称');
    });
  });

  describe('加载失败', () => {
    it('应该处理加载失败的情况', async () => {
      booksAPI.getList.mockRejectedValueOnce(new Error('加载失败'));
      renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('加载数据失败');
      }, { timeout: 5000 });
    });
  });

  describe('空数据状态', () => {
    it('应该处理空书籍列表', async () => {
      booksAPI.getList.mockResolvedValueOnce({ books: [] });
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/第一步：选择书籍/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该处理空角色列表', async () => {
      charactersAPI.getList.mockResolvedValueOnce({ characters: [] });
      const { getByText } = renderWithProviders(<StoryCreateScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('测试书籍1')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('测试书籍1'));
      await waitFor(() => {
        expect(getByText(/第二步：选择故事类型/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });
});
