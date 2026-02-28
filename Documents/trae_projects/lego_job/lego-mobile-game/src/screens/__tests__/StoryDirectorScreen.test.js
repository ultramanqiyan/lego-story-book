import React from 'react';
import { render } from '@testing-library/react-native';
import { StoryDirectorScreen } from '../story/StoryDirectorScreen';
import { Text, View } from 'react-native';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showError: jest.fn(),
    showSuccess: jest.fn(),
  }),
}));

jest.mock('../../api', () => ({
  story: {
    getPlots: jest.fn(() => Promise.resolve({ data: [] })),
  },
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <View testID={testID}>{children}</View>,
  Loading: ({ testID }) => <Text testID={testID}>Loading</Text>,
}));

describe('StoryDirectorScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染故事导演屏幕', () => {
      const { getByText } = render(<StoryDirectorScreen />);
      expect(getByText('Loading')).toBeTruthy();
    });
  });
});
