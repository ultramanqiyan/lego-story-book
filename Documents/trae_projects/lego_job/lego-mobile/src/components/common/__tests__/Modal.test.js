/**
 * Modal 组件单元测试
 */

import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import Modal from '../Modal';

describe('Modal 组件', () => {
  // 基础渲染测试
  describe('基础渲染', () => {
    it('应该正确渲染 Modal 内容', () => {
      const { getByText } = render(
        <Modal visible={true}>
          <Text>Modal 内容</Text>
        </Modal>
      );
      expect(getByText('Modal 内容')).toBeTruthy();
    });

    it('不应该渲染当 visible 为 false', () => {
      const { queryByText } = render(
        <Modal visible={false}>
          <Text>Modal 内容</Text>
        </Modal>
      );
      expect(queryByText('Modal 内容')).toBeNull();
    });
  });

  // 标题测试
  describe('标题', () => {
    it('应该显示标题', () => {
      const { getByText } = render(
        <Modal visible={true} title="测试标题">
          <Text>内容</Text>
        </Modal>
      );
      expect(getByText('测试标题')).toBeTruthy();
    });

    it('不应该显示标题当没有提供', () => {
      const { queryByText } = render(
        <Modal visible={true}>
          <Text>内容</Text>
        </Modal>
      );
      expect(queryByText('测试标题')).toBeNull();
    });
  });

  // 关闭按钮测试
  describe('关闭按钮', () => {
    it('应该显示关闭按钮', () => {
      const onCloseMock = jest.fn();
      const { getByText } = render(
        <Modal visible={true} onClose={onCloseMock}>
          <Text>内容</Text>
        </Modal>
      );
      expect(getByText('×')).toBeTruthy();
    });

    it('点击关闭按钮应该触发 onClose', () => {
      const onCloseMock = jest.fn();
      const { getByText } = render(
        <Modal visible={true} onClose={onCloseMock}>
          <Text>内容</Text>
        </Modal>
      );

      fireEvent.press(getByText('×'));
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('不应该显示关闭按钮当 showCloseButton 为 false', () => {
      const onCloseMock = jest.fn();
      const { queryByText } = render(
        <Modal visible={true} onClose={onCloseMock} showCloseButton={false}>
          <Text>内容</Text>
        </Modal>
      );
      expect(queryByText('×')).toBeNull();
    });
  });
});
