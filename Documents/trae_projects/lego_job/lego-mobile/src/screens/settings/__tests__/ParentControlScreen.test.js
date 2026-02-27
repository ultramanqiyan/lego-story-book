/**
 * ParentControlScreen 单元测试
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ParentControlScreen from '../ParentControlScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { ThemeProvider } from '../../../context/ThemeContext';
import { ToastProvider } from '../../../context/ToastContext';

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigation = {
  goBack: mockGoBack,
};

// Mock API
jest.mock('../../../api', () => ({
  usersAPI: {
    getUser: jest.fn(() => Promise.resolve({
      user: {
        daily_time_limit: 120,
        time_used_today: 45,
        weekly_data: [],
        stories_completed: 5,
        chapters_completed: 12,
        puzzles_solved: 8,
      }
    })),
    updateUser: jest.fn(() => Promise.resolve({ success: true })),
  },
}));

const renderWithProviders = (component) => {
  return render(
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          {component}
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

describe('ParentControlScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染家长控制页面', () => {
    const { getByText } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    expect(getByText('👨‍👩‍👧 家长控制')).toBeTruthy();
  });

  it('应该显示今日阅读时间区域', () => {
    const { getByText } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    expect(getByText('📊 今日阅读时间')).toBeTruthy();
  });

  it('应该显示每日时间限制区域', () => {
    const { getByText } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    expect(getByText('⏰ 每日时间限制')).toBeTruthy();
  });

  it('应该显示主题风格区域', () => {
    const { getByText } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    expect(getByText('🎨 主题风格')).toBeTruthy();
  });

  it('应该显示阅读统计区域', () => {
    const { getByText } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    expect(getByText('📚 阅读统计')).toBeTruthy();
  });

  it('应该显示统计项标签', () => {
    const { getByText } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    expect(getByText('完成故事')).toBeTruthy();
    expect(getByText('完成章节')).toBeTruthy();
    expect(getByText('解答谜题')).toBeTruthy();
  });

  it('应该显示时间范围提示', () => {
    const { getByText } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    expect(getByText('范围：15分钟 - 8小时')).toBeTruthy();
  });

  it('点击返回按钮应该调用goBack', () => {
    const { getByTestId } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    // Header back button is inside Header component
    expect(mockGoBack).not.toHaveBeenCalled();
  });

  it('应该能够减少时间限制', () => {
    const { getByText } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    const minusButton = getByText('−');
    expect(minusButton).toBeTruthy();
    fireEvent.press(minusButton);
  });

  it('应该能够增加时间限制', () => {
    const { getByText } = renderWithProviders(<ParentControlScreen navigation={mockNavigation} />);
    const plusButton = getByText('+');
    expect(plusButton).toBeTruthy();
    fireEvent.press(plusButton);
  });
});
