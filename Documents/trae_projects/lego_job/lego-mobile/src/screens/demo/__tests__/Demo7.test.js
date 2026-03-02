import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Demo7Flip3D from '../Demo7Flip3D';
import { COLORS } from '../../../utils/constants';

describe('Demo7 - 3D翻转卡牌', () => {
  const mockCards = [
    { id: 1, name: '法师', icon: '🧙', front: '法师', back: '攻击力: 5 | 生命值: 8' },
    { id: 2, name: '战士', icon: '🦸', front: '战士', back: '攻击力: 7 | 生命值: 6' },
    { id: 3, name: '精灵', icon: '🧝', front: '精灵', back: '攻击力: 2 | 生命值: 4' },
  ];

  describe('3D翻转动画', () => {
    it('应该正确渲染卡牌正面', () => {
      const { getByText } = render(<Demo7Flip3D cards={mockCards} />);
      
      expect(getByText('法师')).toBeTruthy();
      expect(getByText('战士')).toBeTruthy();
      expect(getByText('精灵')).toBeTruthy();
    });

    it('点击卡牌应该触发翻转动画', () => {
      const { getByTestId } = render(<Demo7Flip3D cards={mockCards} />);
      
      const card = getByTestId('card-3d-0');
      fireEvent.press(card);
      
      expect(card.props.style.transform).toBeDefined();
    });

    it('翻转后应该显示卡牌背面内容', () => {
      const { getByTestId, getByText } = render(<Demo7Flip3D cards={mockCards} />);
      
      fireEvent.press(getByTestId('card-3d-0'));
      
      await waitFor(() => {
        expect(getByText('攻击力: 5 | 生命值: 8')).toBeTruthy();
      });
    });
  });

  describe('透视效果', () => {
    it('卡牌应该有透视属性', () => {
      const { getByTestId } = render(<Demo7Flip3D cards={mockCards} />);
      
      const card = getByTestId('card-3d-0');
      expect(card.props.style.transform).toContainEqual(
        expect.objectContaining({ perspective: expect.any(Number) })
      );
    });

    it('卡牌应该有深度阴影效果', () => {
      const { getByTestId } = render(<Demo7Flip3D cards={mockCards} />);
      
      const card = getByTestId('card-3d-0');
      expect(card.props.style.shadowOpacity).toBeGreaterThan(0);
    });
  });

  describe('卡牌翻转状态', () => {
    it('初始状态卡牌应该显示正面', () => {
      const { getByTestId, queryByText } = render(<Demo7Flip3D cards={mockCards} />);
      
      expect(getByTestId('card-3d-0')).toBeTruthy();
      expect(queryByText('攻击力: 5 | 生命值: 8')).toBeNull();
    });

    it('再次点击应该翻转回正面', () => {
      const { getByTestId, queryByText } = render(<Demo7Flip3D cards={mockCards} />);
      
      fireEvent.press(getByTestId('card-3d-0'));
      fireEvent.press(getByTestId('card-3d-0'));
      
      await waitFor(() => {
        expect(queryByText('攻击力: 5 | 生命值: 8')).toBeNull();
      });
    });
  });

  describe('空状态处理', () => {
    it('空卡牌列表应该显示空状态', () => {
      const { getByText } = render(<Demo7Flip3D cards={[]} />);
      
      expect(getByText('暂无卡牌')).toBeTruthy();
    });
  });
});
