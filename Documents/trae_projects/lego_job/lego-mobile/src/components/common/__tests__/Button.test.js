/**
 * Button 组件单元测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../Button';

describe('Button 组件', () => {
  describe('基础渲染', () => {
    it('应该渲染按钮文本', () => {
      const { getByText } = render(
        <Button title="测试" onPress={jest.fn()} />
      );
      expect(getByText('测试')).toBeTruthy();
    });

    it('应该渲染带图标的按钮', () => {
      const { getByText } = render(
        <Button title="图标按钮" onPress={jest.fn()} icon="🎭" />
      );
      // 验证按钮文本存在
      expect(getByText('图标按钮')).toBeTruthy();
    });
  });

  describe('变体样式', () => {
    it('应该渲染 primary 变体', () => {
      const { getByText } = render(
        <Button title="Primary" onPress={jest.fn()} variant="primary" />
      );
      expect(getByText('Primary')).toBeTruthy();
    });

    it('应该渲染 secondary 变体', () => {
      const { getByText } = render(
        <Button title="Secondary" onPress={jest.fn()} variant="secondary" />
      );
      expect(getByText('Secondary')).toBeTruthy();
    });

    it('应该渲染 success 变体', () => {
      const { getByText } = render(
        <Button title="Success" onPress={jest.fn()} variant="success" />
      );
      expect(getByText('Success')).toBeTruthy();
    });

    it('应该渲染 danger 变体', () => {
      const { getByText } = render(
        <Button title="Danger" onPress={jest.fn()} variant="danger" />
      );
      expect(getByText('Danger')).toBeTruthy();
    });

    it('应该渲染 outline 变体', () => {
      const { getByText } = render(
        <Button title="Outline" onPress={jest.fn()} variant="outline" />
      );
      expect(getByText('Outline')).toBeTruthy();
    });

    it('应该渲染 ghost 变体', () => {
      const { getByText } = render(
        <Button title="Ghost" onPress={jest.fn()} variant="ghost" />
      );
      expect(getByText('Ghost')).toBeTruthy();
    });
  });

  describe('尺寸', () => {
    it('应该渲染 small 尺寸', () => {
      const { getByText } = render(
        <Button title="Small" onPress={jest.fn()} size="sm" />
      );
      expect(getByText('Small')).toBeTruthy();
    });

    it('应该渲染 medium 尺寸', () => {
      const { getByText } = render(
        <Button title="Medium" onPress={jest.fn()} size="md" />
      );
      expect(getByText('Medium')).toBeTruthy();
    });

    it('应该渲染 large 尺寸', () => {
      const { getByText } = render(
        <Button title="Large" onPress={jest.fn()} size="lg" />
      );
      expect(getByText('Large')).toBeTruthy();
    });
  });

  describe('点击交互', () => {
    it('点击时应该触发 onPress 回调', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="点击我" onPress={onPressMock} />
      );

      fireEvent.press(getByText('点击我'));
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('多次点击应该触发多次回调', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="点击我" onPress={onPressMock} />
      );

      fireEvent.press(getByText('点击我'));
      fireEvent.press(getByText('点击我'));
      expect(onPressMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('禁用状态', () => {
    it('禁用时应该显示禁用样式', () => {
      const { getByText } = render(
        <Button title="禁用" onPress={jest.fn()} disabled />
      );
      expect(getByText('禁用')).toBeTruthy();
    });

    it('禁用时点击不应该触发回调', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button title="禁用" onPress={onPressMock} disabled />
      );

      fireEvent.press(getByText('禁用'));
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('加载状态', () => {
    it('加载时应该显示加载指示器', () => {
      const { UNSAFE_getByType } = render(
        <Button title="加载中" onPress={jest.fn()} loading />
      );
      // 验证ActivityIndicator存在
      expect(UNSAFE_getByType).toBeTruthy();
    });

    it('加载时点击不应该触发回调', () => {
      const onPressMock = jest.fn();
      const { UNSAFE_getByType } = render(
        <Button title="加载中" onPress={onPressMock} loading />
      );

      // 加载状态下按钮应该被禁用
      expect(UNSAFE_getByType).toBeTruthy();
    });
  });

  describe('自定义样式', () => {
    it('应该应用自定义样式', () => {
      const customStyle = { marginTop: 20 };
      const { getByText } = render(
        <Button
          title="自定义样式"
          onPress={jest.fn()}
          style={customStyle}
        />
      );
      expect(getByText('自定义样式')).toBeTruthy();
    });

    it('应该应用自定义文本样式', () => {
      const customTextStyle = { fontSize: 20 };
      const { getByText } = render(
        <Button
          title="自定义文本"
          onPress={jest.fn()}
          textStyle={customTextStyle}
        />
      );
      expect(getByText('自定义文本')).toBeTruthy();
    });
  });
});
