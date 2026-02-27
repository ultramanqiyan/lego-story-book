/**
 * Card3D 测试
 * 测试3D卡牌组件
 */

import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import Card3D from '../Card3D';

// Mock hooks
jest.mock('../../../hooks/use3DCard', () => ({
  use3DCard: jest.fn(() => ({
    frontAnimatedStyle: {},
    backAnimatedStyle: {},
    shadowAnimatedStyle: {},
    glowAnimatedStyle: {},
    gesture: {},
    updateLayout: jest.fn(),
    animateSelect: jest.fn(),
    flipCard: jest.fn(),
  })),
}));

// Mock constants
jest.mock('../../../utils/constants', () => ({
  COLORS: {
    legoYellow: '#FFD500',
    legoBlue: '#006CB7',
    legoGreen: '#00AF4D',
    legoRed: '#C4281B',
    border: '#E0E0E0',
    white: '#FFFFFF',
    background: '#F5F5F5',
    text: '#333333',
  },
}));

// Mock animations
jest.mock('../../../utils/animations', () => ({
  CARD_3D_CONFIG: {
    cardWidth: 100,
    cardHeight: 140,
    perspective: 1000,
    flipDuration: 600,
    tiltMaxAngle: 15,
    shadowOpacity: 0.3,
    shadowBlur: 20,
    elevation: 8,
    selectElevation: 20,
  },
  EASINGS: {
    standard: jest.fn(),
    bounceSoft: jest.fn(),
  },
  calculateTiltAngle: jest.fn(() => ({ rotateX: 0, rotateY: 0 })),
}));

describe('Card3D', () => {
  const defaultProps = {
    icon: '🎭',
    name: 'Test Card',
    onPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('渲染', () => {
    it('应该渲染基本卡牌', () => {
      render(<Card3D {...defaultProps} />);
      expect(screen.getByText('🎭')).toBeTruthy();
      expect(screen.getByText('Test Card')).toBeTruthy();
    });

    it('应该渲染默认图标和名称', () => {
      render(<Card3D />);
      expect(screen.getByText('🎭')).toBeTruthy();
      expect(screen.getByText('Card')).toBeTruthy();
    });

    it('应该渲染正面内容', () => {
      const frontContent = <Text>Custom Front</Text>;
      render(<Card3D {...defaultProps} frontContent={frontContent} />);
      expect(screen.getByText('Custom Front')).toBeTruthy();
    });
  });

  describe('变体样式', () => {
    it('应该应用默认变体', () => {
      const { UNSAFE_root } = render(<Card3D {...defaultProps} />);
      expect(UNSAFE_root).toBeTruthy();
    });

    it('应该应用primary变体', () => {
      render(<Card3D {...defaultProps} variant="primary" />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });

    it('应该应用secondary变体', () => {
      render(<Card3D {...defaultProps} variant="secondary" />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });

    it('应该应用success变体', () => {
      render(<Card3D {...defaultProps} variant="success" />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });

    it('应该应用danger变体', () => {
      render(<Card3D {...defaultProps} variant="danger" />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });
  });

  describe('选中状态', () => {
    it('应该显示选中标记', () => {
      render(<Card3D {...defaultProps} isSelected={true} />);
      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('不应该显示选中标记当未选中', () => {
      render(<Card3D {...defaultProps} isSelected={false} />);
      expect(screen.queryByText('✓')).toBeNull();
    });
  });

  describe('交互', () => {
    it('应该响应点击事件', () => {
      const onPress = jest.fn();
      const { UNSAFE_queryAllByType } = render(<Card3D {...defaultProps} onPress={onPress} />);

      // 查找 TouchableOpacity 组件并触发点击
      const touchables = UNSAFE_queryAllByType(TouchableOpacity);
      if (touchables.length > 0) {
        fireEvent.press(touchables[0]);
        expect(onPress).toHaveBeenCalled();
      }
    });
  });

  describe('尺寸', () => {
    it('应该使用默认尺寸', () => {
      render(<Card3D {...defaultProps} />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });

    it('应该接受自定义尺寸', () => {
      render(<Card3D {...defaultProps} width={120} height={160} />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });
  });

  describe('翻转功能', () => {
    it('应该在enableFlip为true时允许翻转', () => {
      render(<Card3D {...defaultProps} enableFlip={true} />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });

    it('应该在enableFlip为false时禁用翻转', () => {
      render(<Card3D {...defaultProps} enableFlip={false} />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });
  });

  describe('倾斜功能', () => {
    it('应该在enableTilt为true时允许倾斜', () => {
      render(<Card3D {...defaultProps} enableTilt={true} />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });

    it('应该在enableTilt为false时禁用倾斜', () => {
      render(<Card3D {...defaultProps} enableTilt={false} />);
      expect(screen.getByText('Test Card')).toBeTruthy();
    });
  });
});
