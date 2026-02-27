/**
 * BookDetailScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import BookDetailScreen from '../BookDetailScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';
import { booksAPI, bookCharactersAPI, charactersAPI, shareAPI } from '../../../api';
import Alert from 'react-native/Libraries/Alert/Alert';
import Share from 'react-native/Libraries/Share/Share';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

const mockRoute = {
  params: { bookId: 'test-book-id' },
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
    getDetail: jest.fn(() => Promise.resolve({
      book: {
        book_id: 'test-book-id',
        title: '测试书籍',
        description: '这是一本测试书籍',
        chapter_count: 5,
        word_count: 10000,
        creator_id: 'test-user-id',
        prompt: '测试提示词',
      },
      chapters: [
        { chapter_id: '1', title: '第一章', chapter_number: 1, word_count: 2000, has_puzzle: true, puzzle_result: 1 },
        { chapter_id: '2', title: '第二章', chapter_number: 2, word_count: 3000, has_puzzle: false },
      ],
      characters: [
        { character_id: '1', name: '角色1', custom_name: '自定义角色1', role_type: 'protagonist', id: 'bc-1' },
        { character_id: '2', name: '角色2', custom_name: '自定义角色2', role_type: 'supporting', id: 'bc-2' },
      ],
    })),
    update: jest.fn(() => Promise.resolve({ success: true })),
    delete: jest.fn(() => Promise.resolve({ success: true })),
  },
  charactersAPI: {
    getList: jest.fn(() => Promise.resolve({
      characters: [
        { character_id: '1', name: '角色1' },
        { character_id: '2', name: '角色2' },
        { character_id: '3', name: '角色3' },
      ]
    })),
  },
  bookCharactersAPI: {
    add: jest.fn(() => Promise.resolve({ success: true })),
    update: jest.fn(() => Promise.resolve({ success: true })),
    delete: jest.fn(() => Promise.resolve({ success: true })),
  },
  chaptersAPI: {
    create: jest.fn(() => Promise.resolve({ chapterId: 'new-chapter-id' })),
  },
  plotOptionsAPI: {
    get: jest.fn(() => Promise.resolve({ plotOptions: {} })),
  },
  shareAPI: {
    create: jest.fn(() => Promise.resolve({ shareId: 'share-id', shareCode: 'ABC123' })),
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

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

jest.mock('react-native/Libraries/Share/Share', () => ({
  share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
}));

const MockBackButton = ({ onPress }) => {
  const { Text, TouchableOpacity } = require('react-native');
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>←</Text>
    </TouchableOpacity>
  );
};

jest.mock('../../../components/common', () => ({
  Card: function MockCard({ children, style, onPress }) {
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
  Modal: function MockModal({ visible, onClose, title, children }) {
    const { View, Text, TouchableOpacity } = require('react-native');
    if (!visible) return null;
    return (
      <View>
        <Text>{title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text>关闭</Text>
        </TouchableOpacity>
        {children}
      </View>
    );
  },
  Header: Object.assign(
    function MockHeader({ title, leftButton, rightButton }) {
      const { View, Text } = require('react-native');
      return (
        <View>
          {leftButton}
          <Text>{title}</Text>
          {rightButton}
        </View>
      );
    },
    {
      BackButton: MockBackButton,
    }
  ),
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

describe('BookDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始渲染', () => {
    it('应该渲染书籍详情页面', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/当前页面: BookDetailScreen/)).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示书籍标题', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('测试书籍')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示统计数据', async () => {
      const { getAllByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getAllByText('章节').length).toBeGreaterThan(0);
        expect(getAllByText('角色').length).toBeGreaterThan(0);
        expect(getAllByText('字数').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });

    it('应该显示查看提示词按钮', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('查看提示词')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示章节列表', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('第一章')).toBeTruthy();
        expect(getByText('第二章')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示添加章节按钮', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/添加章节/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('返回功能', () => {
    it('点击返回按钮应该调用goBack', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('←')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('章节列表', () => {
    it('点击章节应该导航到章节详情', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('第一章')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('第一章'));
      expect(mockNavigate).toHaveBeenCalledWith('Chapter', expect.objectContaining({ bookId: 'test-book-id' }));
    });
  });

  describe('查看提示词', () => {
    it('点击查看提示词应该打开Modal', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('查看提示词')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('查看提示词'));
      await waitFor(() => {
        expect(getByText(/AI提示词/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('分享功能', () => {
    it('点击分享按钮应该触发分享', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('📤')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('📤'));
      await waitFor(() => {
        expect(shareAPI.create).toHaveBeenCalledWith('test-book-id', 'test-user-id');
      }, { timeout: 5000 });
    });
  });

  describe('书籍设置', () => {
    it('点击设置按钮应该打开书籍设置Modal', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('⚙️')).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText('⚙️'));
      await waitFor(() => {
        expect(getByText(/书籍设置/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('添加章节', () => {
    it('点击添加章节应该导航到StoryDirector', async () => {
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/添加章节/)).toBeTruthy();
      }, { timeout: 5000 });
      fireEvent.press(getByText(/添加章节/));
      expect(mockNavigate).toHaveBeenCalledWith('StoryDirector', { bookId: 'test-book-id' });
    });
  });

  describe('边界情况', () => {
    it('应该处理无效的bookId', async () => {
      const invalidRoute = { params: { bookId: null } };
      renderWithProviders(<BookDetailScreen route={invalidRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalled();
      }, { timeout: 5000 });
    });

    it('应该处理加载失败的情况', async () => {
      booksAPI.getDetail.mockRejectedValueOnce(new Error('加载失败'));
      renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('加载失败');
      }, { timeout: 5000 });
    });
  });

  describe('空数据状态', () => {
    it('应该处理空章节列表', async () => {
      booksAPI.getDetail.mockResolvedValueOnce({
        book: { book_id: 'test-book-id', title: '空书籍' },
        chapters: [],
        characters: [],
      });
      const { getByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('还没有章节')).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('Tab切换', () => {
    it('应该显示角色Tab', async () => {
      const { getAllByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getAllByText('角色').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });

    it('应该显示章节Tab', async () => {
      const { getAllByText } = renderWithProviders(<BookDetailScreen route={mockRoute} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getAllByText('章节').length).toBeGreaterThan(0);
      }, { timeout: 5000 });
    });
  });
});
