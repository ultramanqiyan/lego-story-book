import React from 'react';
import { render } from '@testing-library/react-native';
import { BookDetailScreen } from '../story/BookDetailScreen';
import { Text, View } from 'react-native';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../context/GameContext', () => ({
  useGame: () => ({
    selectBook: jest.fn(),
    selectChapter: jest.fn(),
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showError: jest.fn(),
    showSuccess: jest.fn(),
  }),
}));

jest.mock('../../api', () => ({
  books: {
    getById: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <View testID={testID}>{children}</View>,
  Loading: ({ testID }) => <Text testID={testID}>Loading</Text>,
}));

describe('BookDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染书籍详情屏幕', () => {
      const { getByText } = render(<BookDetailScreen />);
      expect(getByText('Loading')).toBeTruthy();
    });
  });
});
