import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Demo6Grid2D from '../Demo6Grid2D';
import { COLORS } from '../../../utils/constants';

describe('Demo6 - 2D卡牌网格', () => {
  const mockCards = [
    { id: 1, name: '法师', icon: '🧙', rarity: 'legendary', stars: 4 },
    { id: 2, name: '战士', icon: '🦸', rarity: 'epic', stars: 3 },
    { id: 3, name: '精灵', icon: '🧝', rarity: 'rare', stars: 2 },
    { id: 4, name: '王子', icon: '🤴', rarity: 'common', stars: 1 },
  ];

  const rarityColors = {
    common: COLORS.silver,
    rare: COLORS.blue,
    epic: COLORS.purple,
    legendary: COLORS.gold
  };

  describe('2D卡牌网格渲染', () => {
    it('应该正确渲染卡牌网格', () => {
      const { getByText } = render(<Demo6Grid2D cards={mockCards} />);
      
      expect(getByText('法师')).toBeTruthy();
      expect(getByText('战士')).toBeTruthy();
      expect(getByText('精灵')).toBeTruthy();
      expect(getByText('王子')).toBeTruthy();
    });

    it('应该显示正确的卡牌数量', () => {
      const { getAllByText } = render(<Demo6Grid2D cards={mockCards} />);
      const cardElements = getAllByText(/法师|战士|精灵|王子/);
      expect(cardElements.length).toBe(4);
    });

    it('应该正确应用稀有度边框颜色', () => {
      const { getAllByTestId } = render(<Demo6Grid2D cards={mockCards} />);
      const cards = getAllByTestId('card-2d');
      
      expect(cards[0].props.style.borderColor).toBe(rarityColors.legendary);
      expect(cards[1].props.style.borderColor).toBe(rarityColors.epic);
      expect(cards[2].props.style.borderColor).toBe(rarityColors.rare);
      expect(cards[3].props.style.borderColor).toBe(rarityColors.common);
    });
  });

  describe('卡牌点击交互', () => {
    it('点击卡牌应该触发onPress回调', () => {
      const mockOnPress = jest.fn();
      const { getByTestId } = render(
        <Demo6Grid2D cards={mockCards} onCardPress={mockOnPress} />
      );
      
      fireEvent.press(getByTestId('card-2d-0'));
      expect(mockOnPress).toHaveBeenCalledWith(mockCards[0]);
    });

    it('点击卡牌应该显示详情弹窗', () => {
      const { getByTestId, getByText } = render(<Demo6Grid2D cards={mockCards} />);
      
      fireEvent.press(getByTestId('card-2d-0'));
      
      await waitFor(() => {
        expect(getByText('法师详情')).toBeTruthy();
      });
    });
  });

  describe('卡牌详情显示', () => {
    it('详情弹窗应该显示卡牌完整信息', () => {
      const { getByTestId, getByText } = render(<Demo6Grid2D cards={mockCards} />);
      
      fireEvent.press(getByTestId('card-2d-0'));
      
      await waitFor(() => {
        expect(getByText('法师')).toBeTruthy();
        expect(getByText('⭐⭐⭐⭐')).toBeTruthy();
        expect(getByText('传说')).toBeTruthy();
      });
    });

    it('详情弹窗应该显示正确的稀有度标签', () => {
      const { getByTestId, getByText } = render(<Demo6Grid2D cards={mockCards} />);
      
      fireEvent.press(getByTestId('card-2d-0'));
      
      await waitFor(() => {
        const rarityLabel = getByText('传说');
        expect(rarityLabel.props.style.color).toBe(rarityColors.legendary);
      });
    });
  });

  describe('空状态处理', () => {
    it('空卡牌列表应该显示空状态', () => {
      const { getByText } = render(<Demo6Grid2D cards={[]} />);
      
      expect(getByText('暂无卡牌')).toBeTruthy();
      expect(getByText('快去创建你的第一个角色吧')).toBeTruthy();
    });
  });
});
