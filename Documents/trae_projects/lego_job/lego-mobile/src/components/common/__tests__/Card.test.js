/**
 * Card 组件单元测试
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import Card from '../Card';

describe('Card', () => {
  describe('基本渲染', () => {
    it('应该渲染卡片内容', () => {
      const { getByText } = render(
        <Card>
          <Text>卡片内容</Text>
        </Card>
      );
      expect(getByText('卡片内容')).toBeTruthy();
    });

    it('应该渲染标题', () => {
      const { getByText } = render(
        <Card title="卡片标题">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('卡片标题')).toBeTruthy();
    });

    it('应该渲染副标题', () => {
      const { getByText } = render(
        <Card title="标题" subtitle="副标题内容">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('副标题内容')).toBeTruthy();
    });

    it('应该渲染标题和副标题', () => {
      const { getByText } = render(
        <Card title="主标题" subtitle="副标题">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('主标题')).toBeTruthy();
      expect(getByText('副标题')).toBeTruthy();
    });
  });

  describe('点击交互', () => {
    it('应该响应点击', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Card onPress={onPressMock} title="可点击卡片">
          <Text>内容</Text>
        </Card>
      );

      fireEvent.press(getByText('可点击卡片'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('没有onPress时不应该响应点击', () => {
      const { getByText } = render(
        <Card title="静态卡片">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('静态卡片')).toBeTruthy();
    });
  });

  describe('变体样式', () => {
    it('应该渲染 default 变体', () => {
      const { getByText } = render(
        <Card variant="default" title="Default">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('Default')).toBeTruthy();
    });

    it('应该渲染 primary 变体', () => {
      const { getByText } = render(
        <Card variant="primary" title="Primary">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('Primary')).toBeTruthy();
    });

    it('应该渲染 secondary 变体', () => {
      const { getByText } = render(
        <Card variant="secondary" title="Secondary">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('Secondary')).toBeTruthy();
    });

    it('应该渲染 success 变体', () => {
      const { getByText } = render(
        <Card variant="success" title="Success">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('Success')).toBeTruthy();
    });

    it('应该渲染 warning 变体', () => {
      const { getByText } = render(
        <Card variant="warning" title="Warning">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('Warning')).toBeTruthy();
    });

    it('应该渲染 error 变体', () => {
      const { getByText } = render(
        <Card variant="error" title="Error">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('Error')).toBeTruthy();
    });
  });

  describe('自定义样式', () => {
    it('应该应用自定义样式', () => {
      const customStyle = { marginTop: 20 };
      const { getByText } = render(
        <Card style={customStyle} title="自定义样式">
          <Text>内容</Text>
        </Card>
      );
      expect(getByText('自定义样式')).toBeTruthy();
    });
  });

  describe('子元素', () => {
    it('应该渲染多个子元素', () => {
      const { getByText } = render(
        <Card>
          <Text>子元素1</Text>
          <Text>子元素2</Text>
          <Text>子元素3</Text>
        </Card>
      );
      expect(getByText('子元素1')).toBeTruthy();
      expect(getByText('子元素2')).toBeTruthy();
      expect(getByText('子元素3')).toBeTruthy();
    });

    it('应该渲染复杂子元素', () => {
      const { getByText } = render(
        <Card title="复杂卡片">
          <Text>描述文本</Text>
          <Text>操作按钮</Text>
        </Card>
      );
      expect(getByText('复杂卡片')).toBeTruthy();
      expect(getByText('描述文本')).toBeTruthy();
      expect(getByText('操作按钮')).toBeTruthy();
    });
  });
});
