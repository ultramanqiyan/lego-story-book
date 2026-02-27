import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Toast from '../Toast';

const mockHideToast = jest.fn();

jest.mock('../../../context/ToastContext', () => ({
  useToast: () => ({
    toast: { visible: true, message: '测试消息', type: 'success' },
    hideToast: jest.fn(),
  }),
  getToastColor: jest.fn((type) => {
    const colors = {
      success: '#4CAF50',
      error: '#F44336',
      info: '#2196F3',
      warning: '#FF9800',
    };
    return colors[type] || '#333';
  }),
}));

describe('Toast', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染Toast消息', () => {
    const { getByText } = render(<Toast />);
    expect(getByText('测试消息')).toBeTruthy();
  });

  it('应该调用getToastColor获取背景色', () => {
    render(<Toast />);
    const { getToastColor } = require('../../../context/ToastContext');
    expect(getToastColor).toHaveBeenCalledWith('success');
  });
});
