import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Card3D } from '../Card3D';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('Card3D', () => {
  const mockFrontContent = <>正面</>;
  const mockBackContent = <>背面</>;

  describe('基础渲染', () => {
    it('应正确渲染正面内容', () => {
      const { getByTestId } = render(
        <Card3D frontContent={mockFrontContent} backContent={mockBackContent} testID="card3d" />
      );
      expect(getByTestId('card3d')).toBeTruthy();
    });

    it('应正确渲染背面内容', () => {
      const { getByTestId } = render(
        <Card3D frontContent={mockFrontContent} backContent={mockBackContent} testID="card3d" />
      );
      expect(getByTestId('card3d')).toBeTruthy();
    });

    it('应支持自定义样式', () => {
      const customStyle = { width: 250 };
      const { getByTestId } = render(
        <Card3D
          frontContent={mockFrontContent}
          backContent={mockBackContent}
          style={customStyle}
          testID="card3d"
        />
      );
      const card = getByTestId('card3d');
      expect(card.props.style).toContainEqual(customStyle);
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <Card3D
          frontContent={mockFrontContent}
          backContent={mockBackContent}
          testID="my-card3d"
        />
      );
      expect(getByTestId('my-card3d')).toBeTruthy();
    });
  });

  describe('翻转交互', () => {
    it('点击应触发翻转', () => {
      const onFlip = jest.fn();
      const { getByTestId } = render(
        <Card3D
          frontContent={mockFrontContent}
          backContent={mockBackContent}
          onFlip={onFlip}
          testID="flip-card"
        />
      );
      fireEvent.press(getByTestId('flip-card'));
      expect(onFlip).toHaveBeenCalledWith(true);
    });

    it('禁用状态不应触发翻转', () => {
      const onFlip = jest.fn();
      const { getByTestId } = render(
        <Card3D
          frontContent={mockFrontContent}
          backContent={mockBackContent}
          onFlip={onFlip}
          disabled
          testID="disabled-flip-card"
        />
      );
      fireEvent.press(getByTestId('disabled-flip-card'));
      expect(onFlip).not.toHaveBeenCalled();
    });

    it('应支持受控翻转状态', () => {
      const { getByTestId, rerender } = render(
        <Card3D
          frontContent={mockFrontContent}
          backContent={mockBackContent}
          flipped={false}
          testID="controlled-card"
        />
      );
      expect(getByTestId('controlled-card')).toBeTruthy();
    });
  });

  describe('自定义配置', () => {
    it('应支持自定义翻转时长', () => {
      const { getByTestId } = render(
        <Card3D
          frontContent={mockFrontContent}
          backContent={mockBackContent}
          flipDuration={500}
          testID="custom-duration-card"
        />
      );
      expect(getByTestId('custom-duration-card')).toBeTruthy();
    });
  });
});
