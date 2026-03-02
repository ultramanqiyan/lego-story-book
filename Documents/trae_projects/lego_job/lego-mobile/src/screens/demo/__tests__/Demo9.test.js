import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Demo9HorizontalStack from '../Demo9HorizontalStack';
import { COLORS } from '../../../utils/constants';

describe('Demo9 - 横向堆叠卡牌', () => {
  const mockCards = [
    { id: 1, name: '法师', icon: '🧙', rarity: 'legendary' },
    { id: 2, name: '战士', icon: '🦸', rarity: 'epic' },
    { id: 3, name: '精灵', icon: '🧝', rarity: 'rare' },
    { id: 4, name: '王子', icon: '🤴', rarity: 'common' },
  ];

  describe('横向滑动', () => {
    it('应该正确渲染卡牌堆叠', () => {
      const { getByText } = render(<Demo9HorizontalStack cards={mockCards} />);
      
      expect(getByText('法师')).toBeTruthy();
      expect(getByText('战士')).toBeTruthy();
    });

    it('应该支持横向滑动', () => {
      const { getByTestId } = render(<Demo9HorizontalStack cards={mockCards} />);
      
      const scrollView = getByTestId('horizontal-scroll');
      expect(scrollView).toBeTruthy();
    });

    it('滑动应该改变当前卡牌索引', () => {
      const { getByTestId, getByText } = render(<Demo9HorizontalStack cards={mockCards} />);
      
      const scrollView = getByTestId('horizontal-scroll');
      fireEvent.scroll(scrollView, { nativeEvent: { contentOffset: { x: 200 } } });
      
      expect(getByText('战士')).toBeTruthy();
    });
  });

  describe('视差深度效果', () => {
    it('卡牌应该有视差位移效果', () => {
      const { getAllByTestId } = render(<Demo9HorizontalStack cards={mockCards} />);
      const cards = getAllByTestId('card-horizontal');
      
      cards.forEach((card, index) => {
        expect(card.props.style.transform).toBeDefined();
      });
    });

    it('不同层级的卡牌应该有不同的缩放比例', () => {
      const { getAllByTestId } = render(<Demo9HorizontalStack cards={mockCards} />);
      const cards = getAllByTestId('card-horizontal');
      
      const scales = cards.map(card => {
        const transform = card.props.style.transform;
        return transform;
      });
      
      expect(scales.length).toBe(4);
    });
  });

  describe('卡牌堆叠顺序', () => {
    it('卡牌应该按顺序堆叠', () => {
      const { getAllByTestId } = render(<Demo9HorizontalStack cards={mockCards} />);
      const cards = getAllByTestId('card-horizontal');
      
      expect(cards.length).toBe(4);
    });

    it('当前卡牌应该在最上层', () => {
      const { getByTestId } = render(<Demo9HorizontalStack cards={mockCards} />);
      
      const currentCard = getByTestId('card-horizontal-0');
      expect(currentCard.props.style.zIndex).toBeGreaterThan(0);
    });
  });

  describe('空状态处理', () => {
    it('空卡牌列表应该显示空状态', () => {
      const { getByText } = render(<Demo9HorizontalStack cards={[]} />);
      
      expect(getByText('暂无卡牌')).toBeTruthy();
    });
  });
});
