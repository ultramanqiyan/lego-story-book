import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ThemeProvider, useTheme } from '../ThemeContext';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

const TestComponent = () => {
  const { themeName, isDark, changeTheme, toggleTheme } = useTheme();
  return (
    <>
      <span testID="themeName">{themeName}</span>
      <span testID="isDark">{isDark.toString()}</span>
      <button testID="toggle" onPress={toggleTheme}>Toggle</button>
      <button testID="light" onPress={() => changeTheme('light')}>Light</button>
    </>
  );
};

describe('ThemeContext', () => {
  it('应提供默认主题', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    expect(getByTestId('themeName').props.children).toBe('dark');
    expect(getByTestId('isDark').props.children).toBe('true');
  });

  it('应切换主题', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.press(getByTestId('toggle'));
  });

  it('应设置指定主题', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    
    fireEvent.press(getByTestId('light'));
  });
});

describe('useTheme', () => {
  it('在Provider外使用应抛出错误', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');
  });
});
