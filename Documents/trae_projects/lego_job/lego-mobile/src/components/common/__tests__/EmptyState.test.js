/**
 * EmptyState 组件单元测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';
import EmptyState from '../EmptyState';

describe('EmptyState', () => {
  it('应该渲染默认空状态', () => {
    const { getByText } = render(<EmptyState />);
    expect(getByText('📭')).toBeTruthy();
    expect(getByText('暂无数据')).toBeTruthy();
  });

  it('应该渲染自定义图标', () => {
    const { getByText } = render(<EmptyState icon="📚" />);
    expect(getByText('📚')).toBeTruthy();
  });

  it('应该渲染自定义标题', () => {
    const { getByText } = render(<EmptyState title="没有数据" />);
    expect(getByText('没有数据')).toBeTruthy();
  });

  it('应该渲染描述文本', () => {
    const { getByText } = render(
      <EmptyState description="快去添加一些内容吧" />
    );
    expect(getByText('快去添加一些内容吧')).toBeTruthy();
  });

  it('应该渲染操作按钮', () => {
    const mockAction = (
      <TouchableOpacity testID="action-button">
        <Text>点击我</Text>
      </TouchableOpacity>
    );
    const { getByText } = render(
      <EmptyState action={mockAction} />
    );
    expect(getByText('点击我')).toBeTruthy();
  });

  it('应该渲染完整的空状态', () => {
    const { getByText } = render(
      <EmptyState
        icon="🎭"
        title="没有角色"
        description="创建你的第一个角色"
      />
    );
    expect(getByText('🎭')).toBeTruthy();
    expect(getByText('没有角色')).toBeTruthy();
    expect(getByText('创建你的第一个角色')).toBeTruthy();
  });
});
