/**
 * AuthContext 单元测试
 */

import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';
import { storage } from '../../utils/storage';
import { usersAPI } from '../../api/users';

// Mock storage
jest.mock('../../utils/storage', () => ({
  storage: {
    getUserId: jest.fn(),
    getUsername: jest.fn(),
    setUserId: jest.fn(),
    setUsername: jest.fn(),
    clearUserData: jest.fn(),
  },
}));

// Mock usersAPI
jest.mock('../../api/users', () => ({
  usersAPI: {
    createOrLogin: jest.fn(),
  },
}));

// Test component
const TestComponent = () => {
  const auth = useAuth();
  return (
    <>
      <text testID="user">{auth.user ? auth.user.username : 'no user'}</text>
      <text testID="isLoading">{auth.isLoading ? 'loading' : 'not loading'}</text>
      <text testID="isAuthenticated">{auth.isAuthenticated ? 'authenticated' : 'not authenticated'}</text>
    </>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该初始化时检查认证状态（已登录）', async () => {
    storage.getUserId.mockResolvedValue('user-123');
    storage.getUsername.mockResolvedValue('testuser');

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('isAuthenticated').children[0]).toBe('authenticated');
      expect(getByTestId('user').children[0]).toBe('testuser');
    });
  });

  it('应该初始化时检查认证状态（未登录）', async () => {
    storage.getUserId.mockResolvedValue(null);
    storage.getUsername.mockResolvedValue(null);

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('isAuthenticated').children[0]).toBe('not authenticated');
      expect(getByTestId('user').children[0]).toBe('no user');
    });
  });

  it('应该处理storage错误', async () => {
    storage.getUserId.mockRejectedValue(new Error('Storage error'));
    storage.getUsername.mockRejectedValue(new Error('Storage error'));

    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('isLoading').children[0]).toBe('not loading');
    });
  });
});

describe('useAuth', () => {
  it('应该在Provider外使用时抛出错误', () => {
    const TestComponentOutside = () => {
      useAuth();
      return null;
    };

    expect(() => render(<TestComponentOutside />)).toThrow('useAuth must be used within an AuthProvider');
  });
});
