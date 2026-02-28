import React from 'react';
import { render } from '@testing-library/react-native';
import { ShareScreen } from '../share/ShareScreen';
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
    getShareCode: jest.fn(() => Promise.resolve({ data: { code: 'ABC123' } })),
  },
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <View testID={testID}>{children}</View>,
  Loading: ({ testID }) => <Text testID={testID}>Loading</Text>,
}));

describe('ShareScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染分享屏幕', () => {
      const { getByText } = render(<ShareScreen />);
      expect(getByText('Loading')).toBeTruthy();
    });
  });
});
