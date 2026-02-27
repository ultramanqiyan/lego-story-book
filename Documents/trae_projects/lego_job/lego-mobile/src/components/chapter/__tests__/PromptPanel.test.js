/**
 * PromptPanel 组件单元测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PromptPanel from '../PromptPanel';

describe('PromptPanel', () => {
  it('应该渲染提示面板', () => {
    const prompts = ['提示1', '提示2', '提示3'];
    const { getByText } = render(<PromptPanel prompts={prompts} />);
    expect(getByText('💡 故事创作提示')).toBeTruthy();
  });

  it('应该渲染自定义标题', () => {
    const prompts = ['提示1'];
    const { getByText } = render(
      <PromptPanel prompts={prompts} title="自定义标题" />
    );
    expect(getByText('自定义标题')).toBeTruthy();
  });

  it('空提示列表应该返回null', () => {
    const { toJSON } = render(<PromptPanel prompts={[]} />);
    // 当prompts为空时，组件返回null
    expect(toJSON()).toBeNull();
  });

  it('应该展开和收起内容', () => {
    const prompts = ['提示1', '提示2'];
    const { getByText, queryByText } = render(<PromptPanel prompts={prompts} />);
    
    // 初始状态是收起的
    expect(queryByText('提示1')).toBeNull();
    
    // 点击展开
    fireEvent.press(getByText('💡 故事创作提示'));
    expect(getByText('提示1')).toBeTruthy();
    expect(getByText('提示2')).toBeTruthy();
    
    // 点击收起
    fireEvent.press(getByText('💡 故事创作提示'));
    expect(queryByText('提示1')).toBeNull();
  });

  it('应该显示展开图标', () => {
    const prompts = ['提示1'];
    const { getByText } = render(<PromptPanel prompts={prompts} />);
    // 收起状态显示 ▶
    expect(getByText('▶')).toBeTruthy();
    
    // 点击展开
    fireEvent.press(getByText('💡 故事创作提示'));
    // 展开状态显示 ▼
    expect(getByText('▼')).toBeTruthy();
  });

  it('应该渲染所有提示项', () => {
    const prompts = ['第一个提示', '第二个提示', '第三个提示'];
    const { getByText } = render(<PromptPanel prompts={prompts} />);
    
    // 点击展开
    fireEvent.press(getByText('💡 故事创作提示'));
    
    expect(getByText('第一个提示')).toBeTruthy();
    expect(getByText('第二个提示')).toBeTruthy();
    expect(getByText('第三个提示')).toBeTruthy();
  });

  it('undefined prompts应该返回null', () => {
    const { toJSON } = render(<PromptPanel prompts={undefined} />);
    expect(toJSON()).toBeNull();
  });

  it('null prompts应该返回null', () => {
    const { toJSON } = render(<PromptPanel prompts={null} />);
    expect(toJSON()).toBeNull();
  });
});
