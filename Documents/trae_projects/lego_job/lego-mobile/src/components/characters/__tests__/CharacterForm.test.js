/**
 * CharacterForm 组件单元测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CharacterForm from '../CharacterForm';

describe('CharacterForm', () => {
  const mockSubmit = jest.fn();
  const mockCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染创建角色表单', () => {
    const { getByText, getByPlaceholderText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    expect(getByText('📛 角色名称 *')).toBeTruthy();
    expect(getByPlaceholderText('给角色起个名字')).toBeTruthy();
  });

  it('应该渲染编辑角色表单', () => {
    const character = { name: '测试角色', description: '测试描述' };
    const { getByText, getByPlaceholderText } = render(
      <CharacterForm character={character} onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    expect(getByText('保存修改')).toBeTruthy();
    expect(getByPlaceholderText('给角色起个名字').props.value).toBe('测试角色');
  });

  it('应该输入角色名称', () => {
    const { getByPlaceholderText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    const input = getByPlaceholderText('给角色起个名字');
    fireEvent.changeText(input, '新角色');
    expect(input.props.value).toBe('新角色');
  });

  it('应该输入角色描述', () => {
    const { getByPlaceholderText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    const input = getByPlaceholderText('描述一下这个角色的特点...');
    fireEvent.changeText(input, '这是一个勇敢的角色');
    expect(input.props.value).toBe('这是一个勇敢的角色');
  });

  it('应该显示性格选项', () => {
    const { getByText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    expect(getByText('✨ 性格特点')).toBeTruthy();
    expect(getByText('勇敢')).toBeTruthy();
    expect(getByText('善良')).toBeTruthy();
    expect(getByText('聪明')).toBeTruthy();
  });

  it('应该显示说话风格选项', () => {
    const { getByText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    expect(getByText('💬 说话风格')).toBeTruthy();
    expect(getByText('正常')).toBeTruthy();
    expect(getByText('活泼')).toBeTruthy();
    expect(getByText('沉稳')).toBeTruthy();
  });

  it('应该能够选择性格', () => {
    const { getByText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    fireEvent.press(getByText('勇敢'));
    // 选中后再次点击应该取消选择
    fireEvent.press(getByText('勇敢'));
  });

  it('应该能够选择说话风格', () => {
    const { getByText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    fireEvent.press(getByText('活泼'));
    // 选中后再次点击应该取消选择
    fireEvent.press(getByText('活泼'));
  });

  it('应该显示取消按钮', () => {
    const { getByText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    expect(getByText('取消')).toBeTruthy();
  });

  it('应该显示创建按钮', () => {
    const { getByText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    expect(getByText('创建角色')).toBeTruthy();
  });

  it('空名称时不应该提交', () => {
    const { getByText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    const submitButton = getByText('创建角色');
    fireEvent.press(submitButton);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('点击取消应该调用onCancel', () => {
    const { getByText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    fireEvent.press(getByText('取消'));
    expect(mockCancel).toHaveBeenCalled();
  });

  it('应该显示字符计数', () => {
    const { getByText } = render(
      <CharacterForm onSubmit={mockSubmit} onCancel={mockCancel} />
    );
    expect(getByText('0/20')).toBeTruthy();
    expect(getByText('0/200')).toBeTruthy();
  });
});
