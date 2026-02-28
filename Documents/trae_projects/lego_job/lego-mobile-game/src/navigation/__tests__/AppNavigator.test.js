import React from 'react';
import { render } from '@testing-library/react-native';
import { AppNavigator } from '../AppNavigator';

jest.mock('../../context', () => ({
  AuthProvider: ({ children }) => <>{children}</>,
  ThemeProvider: ({ children }) => <>{children}</>,
  ToastProvider: ({ children }) => <>{children}</>,
  GameProvider: ({ children }) => <>{children}</>,
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
  }),
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      name: 'dark',
      colors: {
        gold: { primary: '#ffd700' },
        background: { primary: '#1a1a2e', card: '#16213e' },
        text: { primary: '#ffffff', secondary: '#b8b8b8' },
        border: { default: '#333333' },
        status: { error: '#ff4444' },
      },
    },
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showError: jest.fn(),
    showSuccess: jest.fn(),
  }),
}));

jest.mock('../../context/GameContext', () => ({
  useGame: () => ({
    currentBook: null,
    score: 100,
  }),
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => <>{children}</>,
}));

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  NavigationContainer: ({ children }) => <>{children}</>,
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ component: Component }) => Component ? <Component /> : null,
  }),
}));

describe('AppNavigator', () => {
  describe('基础渲染', () => {
    it('应正确渲染应用导航器', () => {
      const { root } = render(<AppNavigator />);
      expect(root).toBeTruthy();
    });
  });
});
