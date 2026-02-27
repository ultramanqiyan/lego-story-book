/**
 * ToastContext 单元测试
 */

import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { ToastProvider, useToast, getToastColor } from '../ToastContext';
import { COLORS } from '../../utils/constants';

// Mock constants
jest.mock('../../utils/constants', () => ({
  COLORS: {
    success: '#27AE60',
    error: '#E74C3C',
    warning: '#F39C12',
    info: '#3498DB',
  },
}));

// Test component
const TestComponent = () => {
  const toast = useToast();
  return (
    <>
      <text testID="toast">{toast.toast ? toast.toast.message : 'no toast'}</text>
      <text testID="toastVisible">{toast.toast?.visible ? 'visible' : 'hidden'}</text>
    </>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('应该正确渲染Provider', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(getByTestId('toast').children[0]).toBe('no toast');
  });

  it('应该显示toast', async () => {
    const TestWithShow = () => {
      const toast = useToast();
      React.useEffect(() => {
        toast.showToast('测试消息', 'info', 3000);
      }, []);
      return <TestComponent />;
    };

    const { getByTestId } = render(
      <ToastProvider>
        <TestWithShow />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(getByTestId('toast').children[0]).toBe('测试消息');
      expect(getByTestId('toastVisible').children[0]).toBe('visible');
    });
  });

  it('应该自动隐藏toast', async () => {
    const TestWithShow = () => {
      const toast = useToast();
      React.useEffect(() => {
        toast.showToast('测试消息', 'info', 3000);
      }, []);
      return <TestComponent />;
    };

    const { getByTestId } = render(
      <ToastProvider>
        <TestWithShow />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(getByTestId('toastVisible').children[0]).toBe('visible');
    });

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(getByTestId('toastVisible').children[0]).toBe('hidden');
    });
  });
});

describe('getToastColor', () => {
  it('应该返回成功颜色', () => {
    expect(getToastColor('success')).toBe(COLORS.success);
  });

  it('应该返回错误颜色', () => {
    expect(getToastColor('error')).toBe(COLORS.error);
  });

  it('应该返回警告颜色', () => {
    expect(getToastColor('warning')).toBe(COLORS.warning);
  });

  it('应该返回信息颜色', () => {
    expect(getToastColor('info')).toBe(COLORS.info);
  });

  it('应该默认返回信息颜色', () => {
    expect(getToastColor('unknown')).toBe(COLORS.info);
  });
});

describe('useToast', () => {
  it('应该在Provider外使用时抛出错误', () => {
    const TestComponentOutside = () => {
      useToast();
      return null;
    };

    expect(() => render(<TestComponentOutside />)).toThrow('useToast must be used within a ToastProvider');
  });
});
