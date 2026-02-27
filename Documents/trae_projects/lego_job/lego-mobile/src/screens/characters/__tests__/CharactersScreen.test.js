/**
 * CharactersScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CharactersScreen from '../CharactersScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ToastProvider } from '../../../context/ToastContext';

const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
};

jest.mock('../../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(() => Promise.resolve('test-user-id')),
    getUsername: jest.fn(() => Promise.resolve('test-user')),
  },
}));

const mockCharactersAPI = {
  getList: jest.fn(() => Promise.resolve({
    characters: [
      { character_id: '1', name: '角色1', description: '描述1', creator_id: 'system', personality: '勇敢', speaking_style: '幽默' },
      { character_id: '2', name: '角色2', description: '描述2', creator_id: 'user', personality: '聪明', speaking_style: '严肃' },
    ]
  })),
  create: jest.fn(() => Promise.resolve({ success: true, characterId: 'new-char-id' })),
  update: jest.fn(() => Promise.resolve({ success: true })),
  delete: jest.fn(() => Promise.resolve({ success: true })),
};

jest.mock('../../../api', () => ({
  charactersAPI: mockCharactersAPI,
}));

jest.mock('../../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({
    user: { userId: 'test-user-id' },
    isLoggedIn: true,
  }),
}));

jest.mock('../../../context/ToastContext', () => ({
  ToastProvider: ({ children }) => children,
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  }),
}));

const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <ToastProvider>
        {component}
      </ToastProvider>
    </AuthProvider>
  );
};

describe('CharactersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCharactersAPI.getList.mockResolvedValue({
      characters: [
        { character_id: '1', name: '角色1', description: '描述1', creator_id: 'system', personality: '勇敢', speaking_style: '幽默' },
        { character_id: '2', name: '角色2', description: '描述2', creator_id: 'user', personality: '聪明', speaking_style: '严肃' },
      ]
    });
  });

  describe('初始渲染', () => {
    it('应该渲染角色页面', async () => {
      const { getByText } = renderWithProviders(<CharactersScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('🎭 角色收集')).toBeTruthy();
      }, { timeout: 5000 });
    });

    it('应该显示页面调试标签', async () => {
      const { getByText } = renderWithProviders(<CharactersScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText(/当前页面: CharactersScreen/)).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('空状态', () => {
    it('应该显示空状态当没有角色时', async () => {
      mockCharactersAPI.getList.mockResolvedValueOnce({ characters: [] });
      const { getByText } = renderWithProviders(<CharactersScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('还没有角色')).toBeTruthy();
      }, { timeout: 5000 });
    });
  });

  describe('API错误处理', () => {
    it('应该处理加载失败', async () => {
      mockCharactersAPI.getList.mockRejectedValueOnce(new Error('网络错误'));
      const { getByText } = renderWithProviders(<CharactersScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByText('🎭 角色收集')).toBeTruthy();
      }, { timeout: 5000 });
    });
  });
});
