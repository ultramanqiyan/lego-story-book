/**
 * LoginScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';

const mockLogin = jest.fn();
const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
};

jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve(null)),
    getUsername: jest.fn(() => Promise.resolve(null)),
    setUserId: jest.fn(() => Promise.resolve()),
    setUsername: jest.fn(() => Promise.resolve()),
    clearUserData: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../../../api/users', () => ({
  usersAPI: {
    createOrLogin: jest.fn(() => Promise.resolve({ userId: 'test-user-id' })),
  },
}));

jest.mock('../../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    login: mockLogin,
    isLoggedIn: false,
    user: null,
  }),
}));

jest.mock('../../../context/ToastContext', () => ({
  ToastProvider: ({ children }) => children,
  useToast: () => mockToast,
}));

jest.mock('../../../components/common', () => ({
  Button: function MockButton({ title, onPress, loading, disabled }) {
    const { Text, TouchableOpacity, ActivityIndicator } = require('react-native');
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled || loading}>
        {loading ? <ActivityIndicator testID="loading-indicator" /> : <Text>{title}</Text>}
      </TouchableOpacity>
    );
  },
  Card: function MockCard({ children, style }) {
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
  },
  ParticleBackground: function MockParticleBackground() {
    const { View } = require('react-native');
    return <View testID="particle-background" />;
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

  describe('初始渲染', () => {
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

    it('应该显示调试标签', async () => {
      const { getByText } = renderWithProviders(<LoginScreen />);
      await waitFor(() => {
        expect(getByText(/当前页面: LoginScreen/)).toBeTruthy();
      });
    });

    it('应该显示图标', async () => {
      const { getByText } = renderWithProviders(<LoginScreen />);
      await waitFor(() => {
        expect(getByText('🧱')).toBeTruthy();
      });
    });
  });

  describe('输入功能', () => {
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

    it('应该限制用户名最大长度为20字符', async () => {
      const { getByPlaceholderText } = renderWithProviders(<LoginScreen />);
      await waitFor(() => {
        const input = getByPlaceholderText('输入你的冒险者名字');
        expect(input.props.maxLength).toBe(20);
      });
    });
  });

  describe('登录功能', () => {
    it('空用户名应该显示错误', async () => {
      const { getByText } = renderWithProviders(<LoginScreen />);
      await waitFor(() => {
        expect(getByText('🚀 开始冒险')).toBeTruthy();
      });
      fireEvent.press(getByText('🚀 开始冒险'));
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('请输入你的名字');
      });
    });

    it('只有空格的用户名应该显示错误', async () => {
      const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);
      await waitFor(() => {
        expect(getByPlaceholderText('输入你的冒险者名字')).toBeTruthy();
      });
      const input = getByPlaceholderText('输入你的冒险者名字');
      fireEvent.changeText(input, '   ');
      fireEvent.press(getByText('🚀 开始冒险'));
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('请输入你的名字');
      });
    });

    it('成功登录应该显示欢迎消息', async () => {
      mockLogin.mockResolvedValueOnce({ success: true });
      const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);
      await waitFor(() => {
        expect(getByPlaceholderText('输入你的冒险者名字')).toBeTruthy();
      });
      const input = getByPlaceholderText('输入你的冒险者名字');
      fireEvent.changeText(input, '测试用户');
      fireEvent.press(getByText('🚀 开始冒险'));
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('测试用户', null);
        expect(mockToast.success).toHaveBeenCalledWith('欢迎，测试用户！🎉');
      });
    });

    it('带邮箱登录应该传递邮箱参数', async () => {
      mockLogin.mockResolvedValueOnce({ success: true });
      const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);
      await waitFor(() => {
        expect(getByPlaceholderText('输入你的冒险者名字')).toBeTruthy();
      });
      const nameInput = getByPlaceholderText('输入你的冒险者名字');
      const emailInput = getByPlaceholderText('输入邮箱地址');
      fireEvent.changeText(nameInput, '测试用户');
      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.press(getByText('🚀 开始冒险'));
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('测试用户', 'test@example.com');
      });
    });

    it('登录失败应该显示错误消息', async () => {
      mockLogin.mockResolvedValueOnce({ success: false, error: '服务器错误' });
      const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);
      await waitFor(() => {
        expect(getByPlaceholderText('输入你的冒险者名字')).toBeTruthy();
      });
      const input = getByPlaceholderText('输入你的冒险者名字');
      fireEvent.changeText(input, '测试用户');
      fireEvent.press(getByText('🚀 开始冒险'));
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('登录失败：服务器错误');
      });
    });

    it('登录异常应该显示通用错误', async () => {
      mockLogin.mockRejectedValueOnce(new Error('网络错误'));
      const { getByText, getByPlaceholderText } = renderWithProviders(<LoginScreen />);
      await waitFor(() => {
        expect(getByPlaceholderText('输入你的冒险者名字')).toBeTruthy();
      });
      const input = getByPlaceholderText('输入你的冒险者名字');
      fireEvent.changeText(input, '测试用户');
      fireEvent.press(getByText('🚀 开始冒险'));
      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('登录失败，请重试');
      });
    });
  });
});
