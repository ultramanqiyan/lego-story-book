import React from 'react';
import { render } from '@testing-library/react-native';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  describe('基础渲染', () => {
    it('应正确渲染空状态组件', () => {
      const { getByTestId } = render(
        <EmptyState testID="empty-state" />
      );
      expect(getByTestId('empty-state')).toBeTruthy();
    });

    it('应显示标题', () => {
      const { getByText } = render(
        <EmptyState title="没有数据" />
      );
      expect(getByText('没有数据')).toBeTruthy();
    });

    it('应显示消息', () => {
      const { getByText } = render(
        <EmptyState message="暂无内容" />
      );
      expect(getByText('暂无内容')).toBeTruthy();
    });

    it('应显示图标', () => {
      const { getByTestId } = render(
        <EmptyState icon={<>📭</>} testID="empty-icon" />
      );
      expect(getByTestId('empty-icon')).toBeTruthy();
    });

    it('应显示操作按钮', () => {
      const { getByTestId } = render(
        <EmptyState action={<>刷新</>} testID="empty-action" />
      );
      expect(getByTestId('empty-action')).toBeTruthy();
    });

    it('应支持自定义样式', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <EmptyState style={customStyle} testID="styled-empty" />
      );
      const component = getByTestId('styled-empty');
      expect(component.props.style).toContainEqual(customStyle);
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <EmptyState testID="my-empty-state" />
      );
      expect(getByTestId('my-empty-state')).toBeTruthy();
    });
  });

  describe('组合渲染', () => {
    it('应同时显示标题和消息', () => {
      const { getByText } = render(
        <EmptyState title="空标题" message="空消息" />
      );
      expect(getByText('空标题')).toBeTruthy();
      expect(getByText('空消息')).toBeTruthy();
    });

    it('应同时显示图标、标题、消息和操作', () => {
      const { getByText, getByTestId } = render(
        <EmptyState
          icon={<>📭</>}
          title="没有数据"
          message="暂无内容"
          action={<>刷新</>}
          testID="full-empty"
        />
      );
      expect(getByText('没有数据')).toBeTruthy();
      expect(getByText('暂无内容')).toBeTruthy();
      expect(getByTestId('full-empty')).toBeTruthy();
    });
  });

  describe('样式验证', () => {
    it('标题应有正确的样式', () => {
      const { getByText } = render(
        <EmptyState title="测试标题" />
      );
      const title = getByText('测试标题');
      expect(title.props.style).toBeDefined();
    });

    it('消息应有正确的样式', () => {
      const { getByText } = render(
        <EmptyState message="测试消息" />
      );
      const message = getByText('测试消息');
      expect(message.props.style).toBeDefined();
    });
  });
});
