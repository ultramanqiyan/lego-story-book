/**
 * AuthNavigator 测试
 * 测试认证导航器的所有功能
 */

import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import AuthNavigator from '../AuthNavigator';

// Mock 依赖
jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ name, component: Component }) => {
      if (Component) {
        return <Component />;
      }
      return null;
    },
  }),
}));

jest.mock('../../screens/auth/LoginScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockLoginScreen() {
    return React.createElement(Text, null, 'Login Screen');
  };
});

describe('AuthNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('渲染', () => {
    it('应该渲染登录屏幕', () => {
      render(<AuthNavigator />);

      expect(screen.getByText('Login Screen')).toBeTruthy();
    });
  });

  describe('导航结构', () => {
    it('应该包含登录屏幕内容', () => {
      render(<AuthNavigator />);

      // 验证登录屏幕被渲染
      const loginText = screen.getByText('Login Screen');
      expect(loginText).toBeTruthy();
    });
  });
});
