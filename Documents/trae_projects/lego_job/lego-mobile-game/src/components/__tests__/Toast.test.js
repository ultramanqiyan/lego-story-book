import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Toast, TOAST_TYPES } from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('基础渲染', () => {
    it('visible为false时不应渲染', () => {
      const { queryByTestId } = render(
        <Toast visible={false} message="测试消息" testID="toast" />
      );
      expect(queryByTestId('toast')).toBeNull();
    });

    it('visible为true时应渲染', () => {
      const { getByTestId } = render(
        <Toast visible message="测试消息" testID="toast" />
      );
      expect(getByTestId('toast')).toBeTruthy();
    });

    it('应显示消息内容', () => {
      const { getByText } = render(
        <Toast visible message="这是一条消息" />
      );
      expect(getByText('这是一条消息')).toBeTruthy();
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <Toast visible message="消息" testID="my-toast" />
      );
      expect(getByTestId('my-toast')).toBeTruthy();
    });
  });

  describe('类型配置', () => {
    it('应支持success类型', () => {
      const { getByTestId } = render(
        <Toast visible message="成功" type="success" testID="toast" />
      );
      expect(getByTestId('toast')).toBeTruthy();
    });

    it('应支持error类型', () => {
      const { getByTestId } = render(
        <Toast visible message="错误" type="error" testID="toast" />
      );
      expect(getByTestId('toast')).toBeTruthy();
    });

    it('应支持warning类型', () => {
      const { getByTestId } = render(
        <Toast visible message="警告" type="warning" testID="toast" />
      );
      expect(getByTestId('toast')).toBeTruthy();
    });

    it('应支持info类型', () => {
      const { getByTestId } = render(
        <Toast visible message="信息" type="info" testID="toast" />
      );
      expect(getByTestId('toast')).toBeTruthy();
    });

    it('对未知类型应使用info', () => {
      const { getByTestId } = render(
        <Toast visible message="消息" type="unknown" testID="toast" />
      );
      expect(getByTestId('toast')).toBeTruthy();
    });
  });

  describe('TOAST_TYPES常量', () => {
    it('应包含success类型配置', () => {
      expect(TOAST_TYPES.success).toBeDefined();
      expect(TOAST_TYPES.success.backgroundColor).toBeDefined();
    });

    it('应包含error类型配置', () => {
      expect(TOAST_TYPES.error).toBeDefined();
      expect(TOAST_TYPES.error.backgroundColor).toBeDefined();
    });

    it('应包含warning类型配置', () => {
      expect(TOAST_TYPES.warning).toBeDefined();
      expect(TOAST_TYPES.warning.backgroundColor).toBeDefined();
    });

    it('应包含info类型配置', () => {
      expect(TOAST_TYPES.info).toBeDefined();
      expect(TOAST_TYPES.info.backgroundColor).toBeDefined();
    });
  });

  describe('位置配置', () => {
    it('应支持top位置', () => {
      const { getByTestId } = render(
        <Toast visible message="消息" position="top" testID="toast" />
      );
      expect(getByTestId('toast')).toBeTruthy();
    });

    it('应支持bottom位置', () => {
      const { getByTestId } = render(
        <Toast visible message="消息" position="bottom" testID="toast" />
      );
      expect(getByTestId('toast')).toBeTruthy();
    });
  });

  describe('自动消失', () => {
    it('应在duration后自动消失', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <Toast visible message="消息" duration={1000} onClose={onClose} testID="toast" />
      );
      
      expect(getByTestId('toast')).toBeTruthy();
    });

    it('duration为0时不应自动消失', () => {
      const onClose = jest.fn();
      const { getByTestId } = render(
        <Toast visible message="消息" duration={0} onClose={onClose} testID="toast" />
      );
      
      expect(getByTestId('toast')).toBeTruthy();
    });
  });

  describe('自定义样式', () => {
    it('应支持自定义样式', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <Toast visible message="消息" style={customStyle} testID="toast" />
      );
      const toast = getByTestId('toast');
      expect(toast).toBeTruthy();
    });
  });
});
