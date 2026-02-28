import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SettingsScreen } from '../settings/SettingsScreen';

const mockNavigate = jest.fn();
const mockLogout = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'testuser' },
    logout: mockLogout,
  }),
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    themeName: 'dark',
    isDark: true,
  }),
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <div testID={testID}>{children}</div>,
}));

jest.mock('../../components/ParticleBackground', () => ({
  ParticleBackground: () => 'ParticleBackground',
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染设置屏幕', () => {
      const { root } = render(<SettingsScreen />);
      expect(root).toBeTruthy();
    });

    it('应显示页面标题', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('设置')).toBeTruthy();
    });

    it('应显示用户名', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('testuser')).toBeTruthy();
    });

    it('应显示主题设置选项', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('主题设置')).toBeTruthy();
    });

    it('应显示家长控制选项', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('家长控制')).toBeTruthy();
    });

    it('应显示退出登录选项', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('退出登录')).toBeTruthy();
    });

    it('应显示版本号', () => {
      const { getByText } = render(<SettingsScreen />);
      expect(getByText('版本 1.0.0')).toBeTruthy();
    });
  });

  describe('设置交互', () => {
    it('点击主题设置应导航到ThemeSettings', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('主题设置'));
      expect(mockNavigate).toHaveBeenCalledWith('ThemeSettings');
    });

    it('点击家长控制应导航到ParentControl', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('家长控制'));
      expect(mockNavigate).toHaveBeenCalledWith('ParentControl');
    });

    it('点击退出登录应调用logout', () => {
      const { getByText } = render(<SettingsScreen />);
      fireEvent.press(getByText('退出登录'));
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
