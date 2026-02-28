import React from 'react';
import { render } from '@testing-library/react-native';
import { ParentControlScreen } from '../settings/ParentControlScreen';
import { Text, View } from 'react-native';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { username: 'testuser' },
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showError: jest.fn(),
    showSuccess: jest.fn(),
  }),
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <View testID={testID}>{children}</View>,
}));

describe('ParentControlScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染家长控制屏幕', () => {
      const { root } = render(<ParentControlScreen />);
      expect(root).toBeTruthy();
    });
  });
});
