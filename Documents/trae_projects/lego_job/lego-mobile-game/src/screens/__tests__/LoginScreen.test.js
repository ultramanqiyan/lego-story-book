import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoginScreen } from '../auth/LoginScreen';

const mockLogin = jest.fn();
const mockShowError = jest.fn();
const mockShowSuccess = jest.fn();

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showError: mockShowError,
    showSuccess: mockShowSuccess,
  }),
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <div testID={testID}>{children}</div>,
  GlowEffect: ({ children, testID }) => <div testID={testID}>{children}</div>,
  Loading: () => 'Loading',
}));

jest.mock('../../components/ParticleBackground', () => ({
  ParticleBackground: () => 'ParticleBackground',
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染登录屏幕', () => {
      const { root } = render(<LoginScreen />);
      expect(root).toBeTruthy();
    });

    it('应显示标题', () => {
      const { getByText } = render(<LoginScreen />);
      expect(getByText('LEGO')).toBeTruthy();
    });

    it('应显示副标题', () => {
      const { getByText } = render(<LoginScreen />);
      expect(getByText('故事冒险')).toBeTruthy();
    });

    it('应显示用户名输入框', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      expect(getByPlaceholderText('用户名')).toBeTruthy();
    });

    it('应显示密码输入框', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      expect(getByPlaceholderText('密码')).toBeTruthy();
    });

    it('应显示登录按钮', () => {
      const { getByText } = render(<LoginScreen />);
      expect(getByText('进入游戏')).toBeTruthy();
    });

    it('应显示提示文本', () => {
      const { getByText } = render(<LoginScreen />);
      expect(getByText('输入任意用户名即可开始')).toBeTruthy();
    });
  });

  describe('表单交互', () => {
    it('应能输入用户名', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const usernameInput = getByPlaceholderText('用户名');
      fireEvent.changeText(usernameInput, 'testuser');
      expect(usernameInput.props.value).toBe('testuser');
    });

    it('应能输入密码', () => {
      const { getByPlaceholderText } = render(<LoginScreen />);
      const passwordInput = getByPlaceholderText('密码');
      fireEvent.changeText(passwordInput, 'password123');
      expect(passwordInput.props.value).toBe('password123');
    });
  });

  describe('登录逻辑', () => {
    it('用户名为空时应显示错误', async () => {
      const { getByText } = render(<LoginScreen />);
      fireEvent.press(getByText('进入游戏'));
      expect(mockShowError).toHaveBeenCalledWith('请输入用户名');
    });

    it('登录成功应显示成功消息', async () => {
      mockLogin.mockResolvedValue({ success: true });
      const { getByPlaceholderText, getByText } = render(<LoginScreen />);
      
      fireEvent.changeText(getByPlaceholderText('用户名'), 'testuser');
      fireEvent.press(getByText('进入游戏'));
      
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
