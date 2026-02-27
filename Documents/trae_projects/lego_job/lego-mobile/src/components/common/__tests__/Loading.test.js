/**
 * Loading 组件单元测试
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import Loading from '../Loading';

describe('Loading', () => {
  it('应该渲染全屏加载状态', () => {
    const { getByText } = render(<Loading fullScreen message="加载中..." />);
    expect(getByText('加载中...')).toBeTruthy();
  });

  it('应该渲染内联加载状态', () => {
    const { getByText } = render(<Loading message="请稍候" />);
    expect(getByText('请稍候')).toBeTruthy();
  });

  it('应该使用默认消息', () => {
    const { getByText } = render(<Loading fullScreen />);
    expect(getByText('加载中...')).toBeTruthy();
  });

  it('应该渲染全屏容器', () => {
    const { UNSAFE_getByType } = render(<Loading fullScreen message="测试" />);
    // 验证组件渲染成功
    expect(UNSAFE_getByType(Loading)).toBeTruthy();
  });

  it('应该渲染内联容器', () => {
    const { UNSAFE_getByType } = render(<Loading message="测试" />);
    expect(UNSAFE_getByType(Loading)).toBeTruthy();
  });
});
