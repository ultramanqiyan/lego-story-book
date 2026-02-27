/**
 * LoadingScreen 单元测试
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingScreen from '../LoadingScreen';

describe('LoadingScreen', () => {
  it('应该渲染加载屏幕', () => {
    const { getByText } = render(<LoadingScreen />);
    expect(getByText('乐高故事书')).toBeTruthy();
  });

  it('应该显示加载文本', () => {
    const { getByText } = render(<LoadingScreen />);
    expect(getByText('加载中...')).toBeTruthy();
  });

  it('应该显示图标', () => {
    const { getByText } = render(<LoadingScreen />);
    expect(getByText('🧱')).toBeTruthy();
  });

  it('应该显示ActivityIndicator', () => {
    const { UNSAFE_queryByType } = render(<LoadingScreen />);
    const ActivityIndicator = UNSAFE_queryByType('ActivityIndicator');
    expect(ActivityIndicator).toBeTruthy();
  });
});
