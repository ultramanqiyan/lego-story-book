import React from 'react';
import { render } from '@testing-library/react-native';
import { ChapterScreen } from '../chapter/ChapterScreen';
import { Text, View } from 'react-native';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../context/GameContext', () => ({
  useGame: () => ({
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
  chapters: {
    getById: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <View testID={testID}>{children}</View>,
  Loading: ({ testID }) => <Text testID={testID}>Loading</Text>,
}));

describe('ChapterScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染章节屏幕', () => {
      const { getByText } = render(<ChapterScreen />);
      expect(getByText('Loading')).toBeTruthy();
    });
  });
});
