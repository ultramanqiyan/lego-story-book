/**
 * ThemeSettingsScreen 单元测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ThemeSettingsScreen from '../ThemeSettingsScreen';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ToastProvider } from '../../../context/ToastContext';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = {
  goBack: mockGoBack,
};

const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      <ToastProvider>
        {component}
      </ToastProvider>
    </ThemeProvider>
  );
};

describe('ThemeSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染主题设置页面', () => {
    const { getByText } = renderWithProviders(<ThemeSettingsScreen navigation={mockNavigation} />);
    expect(getByText('主题风格设置')).toBeTruthy();
  });

  it('应该显示返回按钮', () => {
    const { getByText } = renderWithProviders(<ThemeSettingsScreen navigation={mockNavigation} />);
    expect(getByText('← 返回')).toBeTruthy();
  });

  it('应该显示所有Tab选项', () => {
    const { getByText } = renderWithProviders(<ThemeSettingsScreen navigation={mockNavigation} />);
    expect(getByText('2D卡牌')).toBeTruthy();
    expect(getByText('3D卡牌')).toBeTruthy();
    expect(getByText('粒子特效')).toBeTruthy();
    expect(getByText('天气效果')).toBeTruthy();
  });

  it('点击返回按钮应该调用goBack', () => {
    const { getByText } = renderWithProviders(<ThemeSettingsScreen navigation={mockNavigation} />);
    fireEvent.press(getByText('← 返回'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('应该显示使用提示', () => {
    const { getByText } = renderWithProviders(<ThemeSettingsScreen navigation={mockNavigation} />);
    expect(getByText('💡 使用提示')).toBeTruthy();
  });

  it('应该能够切换Tab到3D卡牌', () => {
    const { getAllByText } = renderWithProviders(<ThemeSettingsScreen navigation={mockNavigation} />);
    const tabElements = getAllByText('3D卡牌');
    fireEvent.press(tabElements[0]);
    expect(getAllByText('3D卡牌')[0]).toBeTruthy();
  });

  it('应该能够切换Tab到粒子特效', () => {
    const { getAllByText } = renderWithProviders(<ThemeSettingsScreen navigation={mockNavigation} />);
    const tabElements = getAllByText('粒子特效');
    fireEvent.press(tabElements[0]);
    expect(getAllByText('粒子特效')[0]).toBeTruthy();
  });

  it('应该能够切换Tab到天气效果', () => {
    const { getAllByText } = renderWithProviders(<ThemeSettingsScreen navigation={mockNavigation} />);
    const tabElements = getAllByText('天气效果');
    fireEvent.press(tabElements[0]);
    expect(getAllByText('天气效果')[0]).toBeTruthy();
  });
});
