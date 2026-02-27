import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
}));

jest.mock('../context', () => ({
  AuthProvider: ({ children }) => children,
  ThemeProvider: ({ children }) => children,
  ToastProvider: ({ children }) => children,
}));

jest.mock('../navigation', () => ({
  AppNavigator: () => null,
}));

jest.mock('../components/common', () => ({
  Toast: () => null,
}));

describe('App', () => {
  it('should render without crashing', () => {
    render(<App />);
  });
});
