import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Demo8FanSpread from '../Demo8FanSpread';

describe('Demo8 - 扇形展开卡牌', () => {
  const mockCards = [
    { id: 1, name: '法师', icon: '🧙', rarity: 'legendary' },
    { id: 2, name: '战士', icon: '🦸', rarity: 'epic' },
    { id: 3, name: '精灵', icon: '🧝', rarity: 'rare' },
    { id: 4, name: '王子', icon: '🤴', rarity: 'common' },
    { id: 5, name: '吸血鬼', icon: '🧛', rarity: 'epic' },
  ];

  describe('组件渲染', () => {
    it('应该正确渲染所有卡牌', () => {
      const { getByText } = render(<Demo8FanSpread cards={mockCards} />);
      
      expect(getByText('法师')).toBeTruthy();
      expect(getByText('战士')).toBeTruthy();
      expect(getByText('精灵')).toBeTruthy();
      expect(getByText('王子')).toBeTruthy();
      expect(getByText('吸血鬼')).toBeTruthy();
    });

    it('应该显示页面标题', () => {
      const { getByText } = render(<Demo8FanSpread cards={mockCards} />);
      
      expect(getByText('Demo 8: 扇形展开卡牌')).toBeTruthy();
    });
  });

  describe('动画属性验证', () => {
    it('rotate属性应该是字符串格式', () => {
      const { getAllByTestId } = render(<Demo8FanSpread cards={mockCards} />);
      const cards = getAllByTestId('card-fan');
      
      cards.forEach((card) => {
        const transform = card.props.style.transform;
        if (transform) {
          const rotateTransform = transform.find(t => t.rotate !== undefined);
          if (rotateTransform) {
            expect(typeof rotateTransform.rotate).toBe('string');
            expect(rotateTransform.rotate).toMatch(/\d+deg$/);
          }
        }
      });
    });

    it('transform数组不应该有重复属性', () => {
      const { getAllByTestId } = render(<Demo8FanSpread cards={mockCards} />);
      const cards = getAllByTestId('card-fan');
      
      cards.forEach((card) => {
        const transform = card.props.style.transform;
        if (transform) {
          const properties = transform.map(t => Object.keys(t)[0]);
          const uniqueProperties = new Set(properties);
          expect(properties.length).toBe(uniqueProperties.size);
        }
      });
    });
  });

  describe('交互测试', () => {
    it('点击卡牌应该选中', () => {
      const { getByTestId, getByText } = render(<Demo8FanSpread cards={mockCards} />);
      
      fireEvent.press(getByTestId('card-fan-0'));
      
      await waitFor(() => {
        expect(getByText('传说品质')).toBeTruthy();
      });
    });

    it('点击展开按钮应该切换状态', () => {
      const { getByText } = render(<Demo8FanSpread cards={mockCards} />);
      
      const toggleButton = getByText('展开卡牌');
      fireEvent.press(toggleButton);
      
      expect(getByText('收起卡牌')).toBeTruthy();
    });
  });

  describe('空状态处理', () => {
    it('空卡牌列表应该正常渲染', () => {
      const { getByText } = render(<Demo8FanSpread cards={[]} />);
      
      expect(getByText('Demo 8: 扇形展开卡牌')).toBeTruthy();
    });
  });
});
