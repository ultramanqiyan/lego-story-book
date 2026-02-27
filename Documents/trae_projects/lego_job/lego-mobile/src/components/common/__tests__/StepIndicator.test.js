/**
 * StepIndicator 组件单元测试
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import StepIndicator from '../StepIndicator';

describe('StepIndicator', () => {
  it('应该渲染步骤指示器', () => {
    const { getByText } = render(<StepIndicator currentStep={0} totalSteps={3} />);
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('应该渲染正确数量的步骤', () => {
    const { getByText, queryByText } = render(
      <StepIndicator currentStep={0} totalSteps={5} />
    );
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(queryByText('6')).toBeNull();
  });

  it('应该在第一步时正确显示', () => {
    const { getByText } = render(<StepIndicator currentStep={0} totalSteps={3} />);
    // 第一步应该是激活状态
    expect(getByText('1')).toBeTruthy();
  });

  it('应该在中间步骤时正确显示', () => {
    const { getByText } = render(<StepIndicator currentStep={1} totalSteps={3} />);
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('应该在最后一步时正确显示', () => {
    const { getByText } = render(<StepIndicator currentStep={2} totalSteps={3} />);
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('应该渲染单步骤', () => {
    const { getByText } = render(<StepIndicator currentStep={0} totalSteps={1} />);
    expect(getByText('1')).toBeTruthy();
  });

  it('应该渲染多步骤', () => {
    const { getByText } = render(<StepIndicator currentStep={2} totalSteps={4} />);
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
  });
});
