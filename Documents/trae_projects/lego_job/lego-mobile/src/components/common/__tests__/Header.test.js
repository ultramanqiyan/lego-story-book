/**
 * Header 组件单元测试
 */

import React from 'react';
import { Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import Header from '../Header';

describe('Header', () => {
  describe('基本渲染', () => {
    it('应该渲染标题', () => {
      const { getByText } = render(<Header title="测试标题" />);
      expect(getByText('测试标题')).toBeTruthy();
    });

    it('应该渲染没有标题的Header', () => {
      const { UNSAFE_getByType } = render(<Header />);
      expect(UNSAFE_getByType(Header)).toBeTruthy();
    });
  });

  describe('返回按钮', () => {
    it('应该渲染返回按钮', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Header title="测试" leftButton={<Header.BackButton onPress={mockOnPress} />} />
      );
      expect(getByText('←')).toBeTruthy();
    });

    it('点击返回按钮应该触发回调', () => {
      const mockOnPress = jest.fn();
      const { getByText } = render(
        <Header title="测试" leftButton={<Header.BackButton onPress={mockOnPress} />} />
      );
      fireEvent.press(getByText('←'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('操作按钮', () => {
    it('应该渲染右侧操作按钮', () => {
      const { getByText } = render(
        <Header
          title="测试"
          rightButton={<Text>✓</Text>}
        />
      );
      expect(getByText('✓')).toBeTruthy();
    });

    it('应该渲染多个操作按钮', () => {
      const { getByText } = render(
        <Header
          title="测试"
          rightButton={
            <View>
              <Text>✏️</Text>
              <Text>🗑️</Text>
            </View>
          }
        />
      );
      expect(getByText('✏️')).toBeTruthy();
      expect(getByText('🗑️')).toBeTruthy();
    });
  });

  describe('样式变体', () => {
    it('应该渲染默认样式', () => {
      const { getByText } = render(<Header title="默认样式" />);
      expect(getByText('默认样式')).toBeTruthy();
    });

    it('应该渲染透明样式', () => {
      const { getByText } = render(<Header title="透明样式" transparent />);
      expect(getByText('透明样式')).toBeTruthy();
    });
  });

  describe('自定义内容', () => {
    it('应该渲染自定义左侧内容', () => {
      const { getByText } = render(
        <Header title="测试" leftButton={<Text>菜单</Text>} />
      );
      expect(getByText('菜单')).toBeTruthy();
    });

    it('应该渲染自定义右侧内容', () => {
      const { getByText } = render(
        <Header title="测试" rightButton={<Text>设置</Text>} />
      );
      expect(getByText('设置')).toBeTruthy();
    });
  });
});
