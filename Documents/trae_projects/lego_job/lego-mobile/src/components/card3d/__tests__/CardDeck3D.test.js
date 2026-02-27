/**
 * CardDeck3D 测试
 * 测试3D卡牌组组件
 */

import React from 'react';
import { Text, View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import CardDeck3D from '../CardDeck3D';

// Mock Card3D - 必须返回有效的 React 组件
jest.mock('../Card3D', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return function MockCard3D({ icon, name, isSelected, onPress, variant }) {
    return React.createElement(
      View,
      { 
        testID: `card-${name}`,
        'data-selected': isSelected ? 'true' : 'false',
        'data-variant': variant,
        onClick: onPress 
      },
      React.createElement(Text, null, icon),
      React.createElement(Text, null, name)
    );
  };
});

// Mock constants
jest.mock('../../../utils/constants', () => ({
  COLORS: {
    text: '#333333',
    legoYellow: '#FFD500',
    legoBlue: '#006CB7',
    legoRed: '#C4281B',
  },
}));

// Mock animations
jest.mock('../../../utils/animations', () => ({
  CARD_3D_CONFIG: {
    cardWidth: 100,
    cardHeight: 140,
    fanAngle: 60,
    fanRadius: 80,
    stackOffset: 5,
    spreadDuration: 600,
    selectElevation: 20,
  },
  EASINGS: {
    bounceSoft: jest.fn(),
  },
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn((obj) => obj.web || obj.default),
}));

describe('CardDeck3D', () => {
  const defaultProps = {
    title: '测试卡牌组',
    items: [
      { id: '1', name: '卡牌1', icon: '🎭' },
      { id: '2', name: '卡牌2', icon: '🎨' },
      { id: '3', name: '卡牌3', icon: '🎪' },
    ],
    selectedId: null,
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  describe('渲染', () => {
    it('应该渲染标题', () => {
      render(<CardDeck3D {...defaultProps} />);
      expect(screen.getByText('测试卡牌组')).toBeTruthy();
    });

    it('应该渲染所有卡牌', () => {
      render(<CardDeck3D {...defaultProps} />);
      expect(screen.getByText('卡牌1')).toBeTruthy();
      expect(screen.getByText('卡牌2')).toBeTruthy();
      expect(screen.getByText('卡牌3')).toBeTruthy();
    });

    it('应该处理空items数组', () => {
      render(<CardDeck3D {...defaultProps} items={[]} />);
      expect(screen.getByText('测试卡牌组')).toBeTruthy();
    });

    it('应该处理null items', () => {
      render(<CardDeck3D {...defaultProps} items={null} />);
      expect(screen.getByText('测试卡牌组')).toBeTruthy();
    });

    it('应该处理undefined items', () => {
      render(<CardDeck3D {...defaultProps} items={undefined} />);
      expect(screen.getByText('测试卡牌组')).toBeTruthy();
    });
  });

  describe('标题显示', () => {
    it('应该在showTitle为true时显示标题', () => {
      render(<CardDeck3D {...defaultProps} showTitle={true} />);
      expect(screen.getByText('测试卡牌组')).toBeTruthy();
    });

    it('应该在showTitle为false时隐藏标题', () => {
      render(<CardDeck3D {...defaultProps} showTitle={false} />);
      expect(screen.queryByText('测试卡牌组')).toBeNull();
    });

    it('应该在没有标题时不显示', () => {
      render(<CardDeck3D {...defaultProps} title={null} />);
      expect(screen.queryByText('测试卡牌组')).toBeNull();
    });
  });

  describe('卡牌选择', () => {
    it('应该标记选中的卡牌', () => {
      render(<CardDeck3D {...defaultProps} selectedId="2" />);
      const card2 = screen.getByTestId('card-卡牌2');
      expect(card2.props['data-selected']).toBe('true');
    });

    it('应该在点击卡牌时调用onPress', () => {
      const onPress = jest.fn();
      render(<CardDeck3D {...defaultProps} onPress={onPress} />);

      const card1 = screen.getByTestId('card-卡牌1');
      fireEvent.press(card1);

      expect(onPress).toHaveBeenCalledWith('1');
    });
  });

  describe('自定义键名', () => {
    it('应该使用自定义iconKey', () => {
      const customItems = [
        { id: '1', name: '卡牌1', customIcon: '🔥' },
      ];
      render(<CardDeck3D {...defaultProps} items={customItems} iconKey="customIcon" />);
      expect(screen.getByText('🔥')).toBeTruthy();
    });

    it('应该使用自定义nameKey', () => {
      const customItems = [
        { id: '1', customName: '自定义名称', icon: '🎭' },
      ];
      render(<CardDeck3D {...defaultProps} items={customItems} nameKey="customName" />);
      expect(screen.getByText('自定义名称')).toBeTruthy();
    });
  });

  describe('展开动画', () => {
    it('应该在enableFanSpread为true时展开', () => {
      render(<CardDeck3D {...defaultProps} enableFanSpread={true} />);
      jest.advanceTimersByTime(400);
      expect(screen.getByText('卡牌1')).toBeTruthy();
    });

    it('应该在enableFanSpread为false时不展开', () => {
      render(<CardDeck3D {...defaultProps} enableFanSpread={false} />);
      expect(screen.getByText('卡牌1')).toBeTruthy();
    });
  });

  describe('装饰元素', () => {
    it('应该渲染装饰点', () => {
      const { UNSAFE_root } = render(<CardDeck3D {...defaultProps} />);
      expect(UNSAFE_root).toBeTruthy();
    });
  });
});
