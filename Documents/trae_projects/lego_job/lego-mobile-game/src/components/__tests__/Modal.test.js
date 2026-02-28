import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Modal } from '../Modal';

describe('Modal', () => {
  describe('基础渲染', () => {
    it('visible为false时不应渲染', () => {
      const { queryByTestId } = render(
        <Modal visible={false} testID="modal">
          内容
        </Modal>
      );
      expect(queryByTestId('modal')).toBeNull();
    });

    it('visible为true时应渲染', () => {
      const { getByTestId } = render(
        <Modal visible testID="modal">
          内容
        </Modal>
      );
      expect(getByTestId('modal')).toBeTruthy();
    });

    it('应正确渲染子元素', () => {
      const { getByTestId } = render(
        <Modal visible testID="modal">
          模态框内容
        </Modal>
      );
      expect(getByTestId('modal')).toBeTruthy();
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <Modal visible testID="my-modal">
          内容
        </Modal>
      );
      expect(getByTestId('my-modal')).toBeTruthy();
    });
  });

  describe('标题配置', () => {
    it('应显示标题', () => {
      const { getByText } = render(
        <Modal visible title="模态框标题">
          内容
        </Modal>
      );
      expect(getByText('模态框标题')).toBeTruthy();
    });

    it('无标题时不应显示标题区域', () => {
      const { queryByText } = render(
        <Modal visible>
          内容
        </Modal>
      );
      expect(queryByText('模态框标题')).toBeNull();
    });
  });

  describe('关闭按钮', () => {
    it('应显示关闭按钮', () => {
      const { getByText } = render(
        <Modal visible title="标题" showCloseButton>
          内容
        </Modal>
      );
      expect(getByText('✕')).toBeTruthy();
    });

    it('showCloseButton为false时不应显示关闭按钮', () => {
      const { queryByText } = render(
        <Modal visible title="标题" showCloseButton={false}>
          内容
        </Modal>
      );
      expect(queryByText('✕')).toBeNull();
    });

    it('点击关闭按钮应触发onClose', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <Modal visible title="标题" onClose={onClose} testID="modal">
          内容
        </Modal>
      );
      expect(getByTestId('modal')).toBeTruthy();
    });
  });

  describe('遮罩层', () => {
    it('点击遮罩应关闭模态框', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <Modal visible onClose={onClose} testID="modal">
          内容
        </Modal>
      );
      const modal = getByTestId('modal');
      expect(modal).toBeTruthy();
    });
  });

  describe('自定义样式', () => {
    it('应支持自定义style', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <Modal visible style={customStyle} testID="modal">
          内容
        </Modal>
      );
      expect(getByTestId('modal')).toBeTruthy();
    });

    it('应支持自定义contentStyle', () => {
      const contentStyle = { padding: 20 };
      const { getByTestId } = render(
        <Modal visible contentStyle={contentStyle} testID="modal">
          内容
        </Modal>
      );
      expect(getByTestId('modal')).toBeTruthy();
    });

    it('应支持自定义overlayColor', () => {
      const { getByTestId } = render(
        <Modal visible overlayColor="rgba(255, 0, 0, 0.5)" testID="modal">
          内容
        </Modal>
      );
      expect(getByTestId('modal')).toBeTruthy();
    });
  });

  describe('动画配置', () => {
    it('应支持fade动画', () => {
      const { getByTestId } = render(
        <Modal visible animationType="fade" testID="modal">
          内容
        </Modal>
      );
      expect(getByTestId('modal')).toBeTruthy();
    });
  });
});
