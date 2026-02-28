import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HomeScreen } from '../home/HomeScreen';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
  }),
}));

jest.mock('../../context/GameContext', () => ({
  useGame: () => ({
    currentBook: null,
    score: 100,
  }),
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID, style }) => <div testID={testID} style={style}>{children}</div>,
  ParticleBackground: () => 'ParticleBackground',
  GlowEffect: ({ children, testID }) => <div testID={testID}>{children}</div>,
}));

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染首页', () => {
      const { root } = render(<HomeScreen />);
      expect(root).toBeTruthy();
    });

    it('应显示标题', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('LEGO 故事冒险')).toBeTruthy();
    });

    it('应显示副标题', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('选择你的冒险')).toBeTruthy();
    });

    it('应显示书架菜单项', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('书架')).toBeTruthy();
    });

    it('应显示角色菜单项', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('角色')).toBeTruthy();
    });

    it('应显示冒险菜单项', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('冒险')).toBeTruthy();
    });

    it('应显示设置菜单项', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('设置')).toBeTruthy();
    });

    it('应显示积分', () => {
      const { getByText } = render(<HomeScreen />);
      expect(getByText('100')).toBeTruthy();
    });
  });

  describe('菜单交互', () => {
    it('点击书架应导航到Bookshelf', () => {
      const { getByText } = render(<HomeScreen />);
      fireEvent.press(getByText('书架'));
      expect(mockNavigate).toHaveBeenCalledWith('Bookshelf');
    });

    it('点击角色应导航到Characters', () => {
      const { getByText } = render(<HomeScreen />);
      fireEvent.press(getByText('角色'));
      expect(mockNavigate).toHaveBeenCalledWith('Characters');
    });

    it('点击冒险应导航到Adventure', () => {
      const { getByText } = render(<HomeScreen />);
      fireEvent.press(getByText('冒险'));
      expect(mockNavigate).toHaveBeenCalledWith('Adventure');
    });

    it('点击设置应导航到Settings', () => {
      const { getByText } = render(<HomeScreen />);
      fireEvent.press(getByText('设置'));
      expect(mockNavigate).toHaveBeenCalledWith('Settings');
    });
  });
});
