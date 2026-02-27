/**
 * ShareScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ShareScreen from '../ShareScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';

const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
const mockNavigation = {
  goBack: mockGoBack,
  navigate: mockNavigate,
};

jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve('test-user-id')),
    getUsername: jest.fn(() => Promise.resolve('test-user')),
  },
}));

const mockShareAPI = {
  create: jest.fn(() => Promise.resolve({ shareId: 'share-123', shareUrl: 'https://example.com/share/share-123' })),
  getByBook: jest.fn(),
  getByCode: jest.fn(),
  delete: jest.fn(),
};

jest.mock('../../../api', () => ({
  shareAPI: mockShareAPI,
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: { userId: 'test-user-id' },
    isLoggedIn: true,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock('../../../context/ToastContext', () => ({
  ToastProvider: ({ children }) => children,
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  }),
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

describe('ShareScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('渲染测试', () => {
    it('应该渲染分享页面', async () => {
      const route = { params: { bookId: 'book-123' } };
      const { getByText } = renderWithProviders(<ShareScreen route={route} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/分享故事/)).toBeTruthy();
      });
    });

    it('应该显示分享标题', async () => {
      const route = { params: { bookId: 'book-123' } };
      const { getByText } = renderWithProviders(<ShareScreen route={route} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('分享你的故事')).toBeTruthy();
      });
    });

    it('应该显示分享描述', async () => {
      const route = { params: { bookId: 'book-123' } };
      const { getByText } = renderWithProviders(<ShareScreen route={route} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/将你的精彩故事分享给朋友们/)).toBeTruthy();
      });
    });

    it('应该显示分享提示', async () => {
      const route = { params: { bookId: 'book-123' } };
      const { getByText } = renderWithProviders(<ShareScreen route={route} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/分享提示/)).toBeTruthy();
      });
    });

    it('应该显示返回按钮', async () => {
      const route = { params: { bookId: 'book-123' } };
      const { getByText } = renderWithProviders(<ShareScreen route={route} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('←')).toBeTruthy();
      });
    });

    it('点击返回按钮应该调用goBack', async () => {
      const route = { params: { bookId: 'book-123' } };
      const { getByText } = renderWithProviders(<ShareScreen route={route} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('←')).toBeTruthy();
      });
      fireEvent.press(getByText('←'));
      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  describe('无bookId时', () => {
    it('应该显示空状态', async () => {
      const route = { params: {} };
      const { getByText } = renderWithProviders(<ShareScreen route={route} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/选择一个故事来生成分享链接/)).toBeTruthy();
      });
    });
  });

  describe('API错误处理', () => {
    it('应该处理生成链接失败', async () => {
      mockShareAPI.create.mockRejectedValueOnce(new Error('网络错误'));
      const route = { params: { bookId: 'book-123' } };
      const { getByText } = renderWithProviders(<ShareScreen route={route} navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/分享故事/)).toBeTruthy();
      });
    });
  });
});
