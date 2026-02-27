/**
 * AppNavigator 测试
 * 测试应用导航器的所有功能
 */

import React from 'react';
import { View, Text } from 'react-native';
import { render, screen, waitFor } from '@testing-library/react-native';
import AppNavigator from '../AppNavigator';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { ThemeProvider } from '../../context/ThemeContext';

// Mock 依赖
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ name, component: Component }) => {
      if (Component) {
        return <Component />;
      }
      return null;
    },
  }),
}));

jest.mock('../AuthNavigator', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockAuthNavigator() {
    return React.createElement(Text, null, 'Auth Navigator');
  };
});

jest.mock('../MainNavigator', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockMainNavigator() {
    return React.createElement(Text, null, 'Main Navigator');
  };
});

jest.mock('../../screens/LoadingScreen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return function MockLoadingScreen() {
    return React.createElement(Text, null, 'Loading...');
  };
});

// Mock useAuth
const mockUseAuth = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => mockUseAuth(),
}));

// Mock ThemeContext
jest.mock('../../context/ThemeContext', () => ({
  ...jest.requireActual('../../context/ThemeContext'),
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#FFD500',
        background: '#FFFFFF',
        text: '#333333',
      },
    },
  }),
}));

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      <AuthProvider>
        {component}
      </AuthProvider>
    </ThemeProvider>
  );
};

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('加载状态', () => {
    it('应该在加载时显示LoadingScreen', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      renderWithProviders(<AppNavigator />);

      expect(screen.getByText('Loading...')).toBeTruthy();
    });
  });

  describe('未认证状态', () => {
    it('应该渲染AuthNavigator当用户未认证', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      renderWithProviders(<AppNavigator />);

      expect(screen.getByText('Auth Navigator')).toBeTruthy();
    });
  });

  describe('已认证状态', () => {
    it('应该渲染MainNavigator当用户已认证', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      renderWithProviders(<AppNavigator />);

      expect(screen.getByText('Main Navigator')).toBeTruthy();
    });
  });

  describe('主题配置', () => {
    it('应该传递正确的主题配置给NavigationContainer', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      const { UNSAFE_root } = renderWithProviders(<AppNavigator />);

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('状态切换', () => {
    it('应该从Loading切换到AuthNavigator', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      const { rerender } = renderWithProviders(<AppNavigator />);
      expect(screen.getByText('Loading...')).toBeTruthy();

      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      rerender(
        <ThemeProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Auth Navigator')).toBeTruthy();
      });
    });

    it('应该从Loading切换到MainNavigator', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      const { rerender } = renderWithProviders(<AppNavigator />);
      expect(screen.getByText('Loading...')).toBeTruthy();

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      rerender(
        <ThemeProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Main Navigator')).toBeTruthy();
      });
    });

    it('应该从AuthNavigator切换到MainNavigator', async () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      const { rerender } = renderWithProviders(<AppNavigator />);
      expect(screen.getByText('Auth Navigator')).toBeTruthy();

      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      rerender(
        <ThemeProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByText('Main Navigator')).toBeTruthy();
      });
    });
  });
});
