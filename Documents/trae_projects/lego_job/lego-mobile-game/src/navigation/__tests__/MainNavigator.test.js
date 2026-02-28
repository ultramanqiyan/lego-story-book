import React from 'react';
import { render } from '@testing-library/react-native';
import { MainNavigator } from '../MainNavigator';

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
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

jest.mock('../../context/GameContext', () => ({
  useGame: () => ({
    currentBook: null,
    score: 100,
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ component: Component }) => Component ? <Component /> : null,
  }),
}));

describe('MainNavigator', () => {
  describe('基础渲染', () => {
    it('应正确渲染主导航器', () => {
      const { root } = render(<MainNavigator />);
      expect(root).toBeTruthy();
    });
  });
});
