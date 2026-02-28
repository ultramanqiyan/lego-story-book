import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { BookshelfScreen } from '../bookshelf/BookshelfScreen';
import { Text, View } from 'react-native';

const mockNavigate = jest.fn();
const mockSelectBook = jest.fn();
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../context/GameContext', () => ({
  useGame: () => ({
    selectBook: mockSelectBook,
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

jest.mock('../../api', () => ({
  books: {
    getAll: jest.fn(() => Promise.resolve({ data: [] })),
  },
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <View testID={testID}>{children}</View>,
  CardDeck: ({ cards, onCardPress }) => (
    <View testID="card-deck">
      {cards.map((card, i) => (
        <Text key={i} onPress={() => onCardPress(card)}>{card.title}</Text>
      ))}
    </View>
  ),
  EmptyState: ({ title, testID }) => <Text testID={testID}>{title}</Text>,
  Loading: ({ testID }) => <Text testID={testID}>Loading</Text>,
  Modal: ({ children, visible }) => visible ? <View>{children}</View> : null,
}));

jest.mock('../../components/ParticleBackground', () => ({
  ParticleBackground: () => <Text>ParticleBackground</Text>,
}));

describe('BookshelfScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染书架屏幕', async () => {
      const { root } = render(<BookshelfScreen />);
      await waitFor(() => {
        expect(root).toBeTruthy();
      });
    });

    it('应显示页面标题', async () => {
      const { getByText } = render(<BookshelfScreen />);
      await waitFor(() => {
        expect(getByText('我的书架')).toBeTruthy();
      });
    });

    it('加载中应显示Loading组件', () => {
      const { getByText } = render(<BookshelfScreen />);
      expect(getByText('Loading')).toBeTruthy();
    });
  });

  describe('空状态', () => {
    it('无书籍时应显示空状态', async () => {
      const { getByText } = render(<BookshelfScreen />);
      await waitFor(() => {
        expect(getByText('还没有书籍')).toBeTruthy();
      });
    });
  });
});
