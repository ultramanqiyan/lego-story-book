import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CardDeck from '../CardDeck';

describe('CardDeck', () => {
  const mockItems = [
    { id: '1', name: 'Item 1', icon: '🎭' },
    { id: '2', name: 'Item 2', icon: '🎪' },
    { id: '3', name: 'Item 3', icon: '🎨' },
  ];

  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('基本渲染', () => {
    it('应该渲染标题', () => {
      const { getByText } = render(
        <CardDeck title="测试标题" items={mockItems} onSelect={mockOnSelect} />
      );
      expect(getByText('测试标题')).toBeTruthy();
    });

    it('应该渲染所有项目名称', () => {
      const { getByText } = render(
        <CardDeck title="测试标题" items={mockItems} onSelect={mockOnSelect} />
      );
      expect(getByText('Item 1')).toBeTruthy();
      expect(getByText('Item 2')).toBeTruthy();
      expect(getByText('Item 3')).toBeTruthy();
    });

    it('应该渲染项目图标', () => {
      const { getByText } = render(
        <CardDeck title="测试标题" items={mockItems} onSelect={mockOnSelect} />
      );
      expect(getByText('🎭')).toBeTruthy();
      expect(getByText('🎪')).toBeTruthy();
      expect(getByText('🎨')).toBeTruthy();
    });
  });

  describe('选择功能', () => {
    it('点击卡片应该调用onSelect', () => {
      const { getByText } = render(
        <CardDeck title="测试标题" items={mockItems} onSelect={mockOnSelect} />
      );
      fireEvent.press(getByText('Item 1'));
      expect(mockOnSelect).toHaveBeenCalledWith('1');
    });

    it('选中状态应该显示选中标记', () => {
      const { getByText } = render(
        <CardDeck title="测试标题" items={mockItems} selectedId="1" onSelect={mockOnSelect} />
      );
      expect(getByText('Item 1')).toBeTruthy();
    });
  });

  describe('自定义配置', () => {
    it('应该支持自定义iconKey', () => {
      const customItems = [
        { id: '1', name: 'Item 1', customIcon: '⭐' },
      ];
      const { getByText } = render(
        <CardDeck title="测试标题" items={customItems} onSelect={mockOnSelect} iconKey="customIcon" />
      );
      expect(getByText('⭐')).toBeTruthy();
    });

    it('应该支持自定义nameKey', () => {
      const customItems = [
        { id: '1', customName: 'Custom Name', icon: '⭐' },
      ];
      const { getByText } = render(
        <CardDeck title="测试标题" items={customItems} onSelect={mockOnSelect} nameKey="customName" />
      );
      expect(getByText('Custom Name')).toBeTruthy();
    });

    it('当没有icon和emoji时应该使用默认图标', () => {
      const itemsWithoutIcon = [
        { id: '1', name: 'Item 1' },
      ];
      const { getByText } = render(
        <CardDeck title="测试标题" items={itemsWithoutIcon} onSelect={mockOnSelect} />
      );
      expect(getByText('🎭')).toBeTruthy();
    });
  });

  describe('边界情况', () => {
    it('应该处理空项目列表', () => {
      const { getByText } = render(
        <CardDeck title="测试标题" items={[]} onSelect={mockOnSelect} />
      );
      expect(getByText('测试标题')).toBeTruthy();
    });

    it('应该处理单个项目', () => {
      const singleItem = [{ id: '1', name: 'Only Item', icon: '🎯' }];
      const { getByText } = render(
        <CardDeck title="测试标题" items={singleItem} onSelect={mockOnSelect} />
      );
      expect(getByText('Only Item')).toBeTruthy();
    });
  });
});
