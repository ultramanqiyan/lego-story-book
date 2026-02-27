/**
 * SettingsScreen 单元测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SettingsScreen from '../SettingsScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ToastProvider } from '../../../context/ToastContext';

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

// Mock storage
jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve('test-user-id')),
    getUsername: jest.fn(() => Promise.resolve('test-user')),
    clearAll: jest.fn(() => Promise.resolve()),
  },
}));

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
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

  it('应该渲染设置页面', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    expect(getByText('⚙️ 设置')).toBeTruthy();
  });

  it('应该显示账户信息区域', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    expect(getByText('👤 账户信息')).toBeTruthy();
  });

  it('应该显示家长控制区域', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    expect(getByText('👨‍👩‍👧 家长控制')).toBeTruthy();
    expect(getByText('⏰ 时间管理与阅读统计')).toBeTruthy();
  });

  it('应该显示主题风格区域', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    expect(getByText('🎨 主题风格')).toBeTruthy();
    expect(getByText('🎭 卡牌、特效、天气风格设置')).toBeTruthy();
  });

  it('应该显示数据管理区域', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    expect(getByText('📊 数据管理')).toBeTruthy();
    expect(getByText('🗑️ 清除缓存')).toBeTruthy();
  });

  it('应该显示关于区域', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    expect(getByText('ℹ️ 关于')).toBeTruthy();
    expect(getByText('版本')).toBeTruthy();
    expect(getByText('1.1.0')).toBeTruthy();
    expect(getByText('开发者')).toBeTruthy();
    expect(getByText('乐高故事书团队')).toBeTruthy();
  });

  it('应该显示退出登录按钮', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    expect(getByText('🚪 退出登录')).toBeTruthy();
  });

  it('点击家长控制应该跳转', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('⏰ 时间管理与阅读统计'));
    expect(mockNavigate).toHaveBeenCalledWith('ParentControl');
  });

  it('点击主题风格设置应该跳转', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('🎭 卡牌、特效、天气风格设置'));
    expect(mockNavigate).toHaveBeenCalledWith('ThemeSettings');
  });

  it('应该显示页脚版权信息', async () => {
    const { getByText } = renderWithProviders(<SettingsScreen navigation={mockNavigation} />);
    expect(getByText('乐高故事书 © 2024 - 让想象力飞翔')).toBeTruthy();
  });
});
