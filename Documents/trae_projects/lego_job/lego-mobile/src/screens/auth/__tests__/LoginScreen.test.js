/**
 * LoginScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';

// Mock storage
jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve(null)),
    getUsername: jest.fn(() => Promise.resolve(null)),
    setUserId: jest.fn(() => Promise.resolve()),
    setUsername: jest.fn(() => Promise.resolve()),
    clearUserData: jest.fn(() => Promise.resolve()),
  },
}));

// Mock API
jest.mock('../../../api/users', () => ({
  usersAPI: {
    createOrLogin: jest.fn(() => Promise.resolve({ userId: 'test-user-id' })),
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

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染登录页面', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);
    await waitFor(() => {
      expect(getByText('乐高故事书')).toBeTruthy();
      expect(getByPlaceholderText('输入你的冒险者名字')).toBeTruthy();
    });
  });

  it('应该显示副标题', async () => {
    const { getByText } = renderWithProviders(<LoginScreen />);
    await waitFor(() => {
      expect(getByText('🎮 登录开始你的冒险！')).toBeTruthy();
    });
  });

  it('应该显示登录表单标题', async () => {
    const { getByText } = renderWithProviders(<LoginScreen />);
    await waitFor(() => {
      expect(getByText('🎮 登录 / 注册')).toBeTruthy();
    });
  });

  it('应该输入用户名', async () => {
    const { getByPlaceholderText } = renderWithProviders(<LoginScreen />);
    await waitFor(() => {
      const input = getByPlaceholderText('输入你的冒险者名字');
      fireEvent.changeText(input, '测试用户');
      expect(input.props.value).toBe('测试用户');
    });
  });

  it('应该输入邮箱', async () => {
    const { getByPlaceholderText } = renderWithProviders(<LoginScreen />);
    await waitFor(() => {
      const input = getByPlaceholderText('输入邮箱地址');
      fireEvent.changeText(input, 'test@example.com');
      expect(input.props.value).toBe('test@example.com');
    });
  });

  it('应该显示开始冒险按钮', async () => {
    const { getByText } = renderWithProviders(<LoginScreen />);
    await waitFor(() => {
      expect(getByText('🚀 开始冒险')).toBeTruthy();
    });
  });

  it('应该显示提示信息', async () => {
    const { getByText } = renderWithProviders(<LoginScreen />);
    await waitFor(() => {
      expect(getByText('💡 首次登录将自动创建账号')).toBeTruthy();
    });
  });

  it('应该显示输入标签', async () => {
    const { getByText } = renderWithProviders(<LoginScreen />);
    await waitFor(() => {
      expect(getByText('👤 你的名字')).toBeTruthy();
      expect(getByText('📧 邮箱（可选）')).toBeTruthy();
    });
  });
});
