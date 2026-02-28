import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CharactersScreen } from '../characters/CharactersScreen';
import { Text, View } from 'react-native';

const mockNavigate = jest.fn();
const mockAddCharacter = jest.fn();
const mockRemoveCharacter = jest.fn();
const mockShowSuccess = jest.fn();
const mockShowError = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

jest.mock('../../context/GameContext', () => ({
  useGame: () => ({
    selectedCharacters: [],
    addCharacter: mockAddCharacter,
    removeCharacter: mockRemoveCharacter,
  }),
}));

jest.mock('../../context/ToastContext', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

jest.mock('../../api', () => ({
  characters: {
    getAll: jest.fn(() => Promise.resolve({ data: [] })),
  },
}));

jest.mock('../../components', () => ({
  Card: ({ children, testID }) => <View testID={testID}>{children}</View>,
  EmptyState: ({ title, testID }) => <Text testID={testID}>{title}</Text>,
  Loading: ({ testID }) => <Text testID={testID}>Loading</Text>,
  Modal: ({ children, visible }) => visible ? <View>{children}</View> : null,
}));

jest.mock('../../components/ParticleBackground', () => ({
  ParticleBackground: () => <Text>ParticleBackground</Text>,
}));

jest.mock('../../components/Card', () => ({
  RARITY_STYLES: {
    common: { borderColor: '#ffffff' },
    rare: { borderColor: '#4fc3f7' },
    epic: { borderColor: '#ba68c8' },
    legendary: { borderColor: '#ff9800' },
    mythic: { borderColor: '#ffd700' },
  },
}));

describe('CharactersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基础渲染', () => {
    it('应正确渲染角色屏幕', async () => {
      const { root } = render(<CharactersScreen />);
      await waitFor(() => {
        expect(root).toBeTruthy();
      });
    });

    it('应显示页面标题', async () => {
      const { getByText } = render(<CharactersScreen />);
      await waitFor(() => {
        expect(getByText('角色收藏')).toBeTruthy();
      });
    });

    it('加载中应显示Loading组件', () => {
      const { getByText } = render(<CharactersScreen />);
      expect(getByText('Loading')).toBeTruthy();
    });
  });

  describe('筛选功能', () => {
    it('应显示全部筛选按钮', async () => {
      const { getByText } = render(<CharactersScreen />);
      await waitFor(() => {
        expect(getByText('全部')).toBeTruthy();
      });
    });

    it('应显示主角筛选按钮', async () => {
      const { getByText } = render(<CharactersScreen />);
      await waitFor(() => {
        expect(getByText('主角')).toBeTruthy();
      });
    });

    it('应显示反派筛选按钮', async () => {
      const { getByText } = render(<CharactersScreen />);
      await waitFor(() => {
        expect(getByText('反派')).toBeTruthy();
      });
    });

    it('应显示配角筛选按钮', async () => {
      const { getByText } = render(<CharactersScreen />);
      await waitFor(() => {
        expect(getByText('配角')).toBeTruthy();
      });
    });
  });

  describe('空状态', () => {
    it('无角色时应显示空状态', async () => {
      const { getByText } = render(<CharactersScreen />);
      await waitFor(() => {
        expect(getByText('没有找到角色')).toBeTruthy();
      });
    });
  });
});
