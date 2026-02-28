import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AdventureScreen } from '../adventure/AdventureScreen';
import { Text, View } from 'react-native';

const mockNavigate = jest.fn();
const mockStartGame = jest.fn();
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../context/GameContext', () => ({
  useGame: () => ({
    currentBook: null,
    startGame: mockStartGame,
    gameState: 'idle',
    adventureProgress: { correctAnswers: 5 },
    score: 100,
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

jest.mock('../../api', () => ({
  story: {
    getAll: jest.fn(() => Promise.resolve({ data: [] })),
  },
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <View testID={testID}>{children}</View>,
  EmptyState: ({ title, testID }) => <Text testID={testID}>{title}</Text>,
  Loading: ({ testID }) => <Text testID={testID}>Loading</Text>,
}));

jest.mock('../../components/ParticleBackground', () => ({
  ParticleBackground: () => <Text>ParticleBackground</Text>,
}));

describe('AdventureScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染冒险屏幕', async () => {
      const { root } = render(<AdventureScreen />);
      await waitFor(() => {
        expect(root).toBeTruthy();
      });
    });

    it('应显示页面标题', async () => {
      const { getByText } = render(<AdventureScreen />);
      await waitFor(() => {
        expect(getByText('冒险模式')).toBeTruthy();
      });
    });

    it('应显示总积分', async () => {
      const { getByText } = render(<AdventureScreen />);
      await waitFor(() => {
        expect(getByText('100')).toBeTruthy();
      });
    });

    it('应显示正确答案数', async () => {
      const { getByText } = render(<AdventureScreen />);
      await waitFor(() => {
        expect(getByText('5')).toBeTruthy();
      });
    });
  });

  describe('空状态', () => {
    it('无故事时应显示空状态', async () => {
      const { getByText } = render(<AdventureScreen />);
      await waitFor(() => {
        expect(getByText('没有可用的冒险')).toBeTruthy();
      });
    });
  });
});
