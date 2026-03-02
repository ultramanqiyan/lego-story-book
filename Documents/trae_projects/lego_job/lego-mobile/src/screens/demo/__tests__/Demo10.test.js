import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Demo10VerticalStack from '../Demo10VerticalStack';
import { COLORS } from '../../../utils/constants';

describe('Demo10 - 纵向堆叠卡牌', () => {
  const mockCards = [
    { id: 1, name: '法师', icon: '🧙', rarity: 'legendary' },
    { id: 2, name: '战士', icon: '🦸', rarity: 'epic' },
    { id: 3, name: '精灵', icon: '🧝', rarity: 'rare' },
    { id: 4, name: '王子', icon: '🤴', rarity: 'common' },
  ];

  describe('纵向翻转', () => {
    it('应该正确渲染卡牌堆叠', () => {
      const { getByText } = render(<Demo10VerticalStack cards={mockCards} />);
      
      expect(getByText('法师')).toBeTruthy();
    });

    it('点击应该翻转顶部卡牌', () => {
      const { getByTestId } = render(<Demo10VerticalStack cards={mockCards} />);
      
      fireEvent.press(getByTestId('card-vertical-top'));
      
      await waitFor(() => {
        expect(getByTestId('card-vertical-top')).toBeTruthy();
      });
    });

    it('翻转后应该显示下一张卡牌', () => {
      const { getByTestId, getByText } = render(<Demo10VerticalStack cards={mockCards} />);
      
      fireEvent.press(getByTestId('card-vertical-top'));
      
      await waitFor(() => {
        expect(getByText('战士')).toBeTruthy();
      });
    });
  });

  describe('卡牌堆叠效果', () => {
    it('卡牌应该纵向堆叠显示', () => {
      const { getAllByTestId } = render(<Demo10VerticalStack cards={mockCards} />);
      const cards = getAllByTestId('card-vertical');
      
      expect(cards.length).toBeGreaterThan(0);
    });

    it('堆叠卡牌应该有位移偏移', () => {
      const { getAllByTestId } = render(<Demo10VerticalStack cards={mockCards} />);
      const cards = getAllByTestId('card-vertical');
      
      cards.forEach((card, index) => {
        expect(card.props.style.transform).toBeDefined();
      });
    });
  });

  describe('3D透视效果', () => {
    it('顶部卡牌应该有透视属性', () => {
      const { getByTestId } = render(<Demo10VerticalStack cards={mockCards} />);
      
      const topCard = getByTestId('card-vertical-top');
      expect(topCard.props.style.transform).toContainEqual(
        expect.objectContaining({ perspective: expect.any(Number) })
      );
    });

    it('顶部卡牌应该有阴影效果', () => {
      const { getByTestId } = render(<Demo10VerticalStack cards={mockCards} />);
      
      const topCard = getByTestId('card-vertical-top');
      expect(topCard.props.style.shadowOpacity).toBeGreaterThan(0);
    });
  });

  describe('空状态处理', () => {
    it('空卡牌列表应该显示空状态', () => {
      const { getByText } = render(<Demo10VerticalStack cards={[]} />);
      
      expect(getByText('暂无卡牌')).toBeTruthy();
    });
  });
});
