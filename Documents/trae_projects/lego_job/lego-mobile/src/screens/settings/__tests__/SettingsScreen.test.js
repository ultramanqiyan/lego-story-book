/**
 * SettingsScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SettingsScreen from '../SettingsScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ToastProvider } from '../../../context/ToastContext';

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

const mockLogout = jest.fn(() => Promise.resolve({ success: true }));
const mockChangeTheme = jest.fn();

jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve('test-user-id')),
    getUsername: jest.fn(() => Promise.resolve('test-user')),
    clearAll: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn((title, message, buttons) => {
    if (buttons && buttons.length > 0) {
      const confirmButton = buttons.find(b => b.text === '确定');
      if (confirmButton && confirmButton.onPress) {
        confirmButton.onPress();
      }
    }
  }),
}));

jest.mock('../../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: { userId: 'test-user-id-12345678', username: '测试用户' },
    logout: mockLogout,
  }),
}));

jest.mock('../../../context/ThemeContext', () => ({
  ThemeProvider: ({ children }) => children,
  useTheme: () => ({
    themeId: 'lego',
    themes: [
      { id: 'lego', name: '乐高经典', colors: { primary: '#FF0000' } },
      { id: 'fairy', name: '童话梦幻', colors: { primary: '#FF69B4' } },
      { id: 'scifi', name: '科幻未来', colors: { primary: '#00D4FF' } },
    ],
    changeTheme: mockChangeTheme,
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
      <ThemeProvider>
        <ToastProvider>
          {component}
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初始渲染', () => {
    it('应该渲染设置页面', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('⚙️ 设置')).toBeTruthy();
    });

    it('应该显示页面调试标签', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText(/当前页面: SettingsScreen/)).toBeTruthy();
    });

    it('应该显示账户信息区域', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('👤 账户信息')).toBeTruthy();
    });

    it('应该显示用户名', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('测试用户')).toBeTruthy();
    });

    it('应该显示用户ID', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText(/ID: test-use/)).toBeTruthy();
    });

    it('应该显示家长控制区域', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('👨‍👩‍👧 家长控制')).toBeTruthy();
      expect(getByText('⏰ 时间管理与阅读统计')).toBeTruthy();
    });

    it('应该显示主题风格区域', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('🎨 主题风格')).toBeTruthy();
      expect(getByText('🎭 卡牌、特效、天气风格设置')).toBeTruthy();
    });

    it('应该显示数据管理区域', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('📊 数据管理')).toBeTruthy();
      expect(getByText('🗑️ 清除缓存')).toBeTruthy();
    });

    it('应该显示关于区域', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('ℹ️ 关于')).toBeTruthy();
      expect(getByText('版本')).toBeTruthy();
      expect(getByText('1.1.0')).toBeTruthy();
      expect(getByText('开发者')).toBeTruthy();
      expect(getByText('乐高故事书团队')).toBeTruthy();
    });

    it('应该显示退出登录按钮', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('🚪 退出登录')).toBeTruthy();
    });

    it('应该显示页脚版权信息', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('乐高故事书 © 2024 - 让想象力飞翔')).toBeTruthy();
    });
  });

  describe('主题选择', () => {
    it('应该显示主题选项', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      expect(getByText('乐高经典')).toBeTruthy();
      expect(getByText('童话梦幻')).toBeTruthy();
      expect(getByText('科幻未来')).toBeTruthy();
    });

    it('点击主题应该切换主题', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('童话梦幻'));
      expect(mockChangeTheme).toHaveBeenCalledWith('fairy');
    });
  });

  describe('导航功能', () => {
    it('点击家长控制应该跳转', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('⏰ 时间管理与阅读统计'));
      expect(mockNavigate).toHaveBeenCalledWith('ParentControl');
    });

    it('点击主题风格设置应该跳转', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('🎭 卡牌、特效、天气风格设置'));
      expect(mockNavigate).toHaveBeenCalledWith('ThemeSettings');
    });
  });

  describe('退出登录', () => {
    it('点击退出登录应该弹出确认框', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('🚪 退出登录'));
      expect(require('react-native/Libraries/Alert/Alert').alert).toHaveBeenCalled();
    });
  });

  describe('清除缓存', () => {
    it('点击清除缓存应该弹出确认框', () => {
      const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
      fireEvent.press(getByText('🗑️ 清除缓存'));
      expect(require('react-native/Libraries/Alert/Alert').alert).toHaveBeenCalled();
    });
  });
});
