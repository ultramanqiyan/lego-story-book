import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  return (
    <>
      <span testID="user">{user?.username || 'null'}</span>
      <span testID="authenticated">{isAuthenticated.toString()}</span>
      <span testID="loading">{isLoading.toString()}</span>
      <button testID="login" onPress={() => login({ username: 'test', id: '1' })}>Login</button>
      <button testID="logout" onPress={logout}>Logout</button>
    </>
  );
};

describe('AuthContext', () => {
  it('应提供初始状态', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(getByTestId('authenticated').props.children).toBe('false');
  });

  it('应处理登录', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.press(getByTestId('login'));
  });

  it('应处理登出', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    fireEvent.press(getByTestId('logout'));
  });
});

describe('useAuth', () => {
  it('在Provider外使用应抛出错误', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
  });
});
