import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ToastProvider, useToast } from '../ToastContext';

const TestComponent = () => {
  const { toasts, showSuccess, showError, showWarning, showInfo, hideToast } = useToast();
  return (
    <>
      <span testID="toastCount">{toasts.length}</span>
      <button testID="success" onPress={() => showSuccess('成功消息')}>Success</button>
      <button testID="error" onPress={() => showError('错误消息')}>Error</button>
      <button testID="warning" onPress={() => showWarning('警告消息')}>Warning</button>
      <button testID="info" onPress={() => showInfo('信息消息')}>Info</button>
      {toasts.length > 0 && (
        <button testID="hide" onPress={() => hideToast(toasts[0].id)}>Hide</button>
      )}
    </>
  );
};

describe('ToastContext', () => {
  it('应提供初始状态', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    expect(getByTestId('toastCount').props.children).toBe(0);
  });

  it('应显示成功消息', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.press(getByTestId('success'));
    expect(getByTestId('toastCount').props.children).toBe(1);
  });

  it('应显示错误消息', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.press(getByTestId('error'));
    expect(getByTestId('toastCount').props.children).toBe(1);
  });

  it('应显示警告消息', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.press(getByTestId('warning'));
    expect(getByTestId('toastCount').props.children).toBe(1);
  });

  it('应显示信息消息', () => {
    const { getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.press(getByTestId('info'));
    expect(getByTestId('toastCount').props.children).toBe(1);
  });

  it('应隐藏消息', async () => {
    const { getByTestId } = render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.press(getByTestId('success'));
    fireEvent.press(getByTestId('hide'));
    expect(getByTestId('toastCount').props.children).toBe(0);
  });
});

describe('useToast', () => {
  it('在Provider外使用应抛出错误', () => {
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');
  });
});
