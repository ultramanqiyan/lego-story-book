import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { StoryCreateScreen } from '../story/StoryCreateScreen';
import { Text, View } from 'react-native';

const mockNavigate = jest.fn();
const mockSelectBook = jest.fn();
const mockAddCharacter = jest.fn();
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
    addCharacter: mockAddCharacter,
    selectedCharacters: [],
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
  characters: {
    getAll: jest.fn(() => Promise.resolve({ data: [] })),
  },
  story: {
    create: jest.fn(() => Promise.resolve({ success: true })),
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

describe('StoryCreateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染创建故事屏幕', async () => {
      const { root } = render(<StoryCreateScreen />);
      await waitFor(() => {
        expect(root).toBeTruthy();
      });
    });

    it('应显示页面标题', async () => {
      const { getByText } = render(<StoryCreateScreen />);
      await waitFor(() => {
        expect(getByText('创建故事')).toBeTruthy();
      });
    });

    it('应显示步骤指示器', async () => {
      const { root } = render(<StoryCreateScreen />);
      await waitFor(() => {
        expect(root).toBeTruthy();
      });
    });
  });

  describe('步骤导航', () => {
    it('应显示下一步按钮', async () => {
      const { getByText } = render(<StoryCreateScreen />);
      await waitFor(() => {
        expect(getByText('下一步')).toBeTruthy();
      });
    });

    it('应显示创建故事按钮', async () => {
      const { getByText } = render(<StoryCreateScreen />);
      await waitFor(() => {
        expect(getByText('创建故事')).toBeTruthy();
      });
    });
  });
});
