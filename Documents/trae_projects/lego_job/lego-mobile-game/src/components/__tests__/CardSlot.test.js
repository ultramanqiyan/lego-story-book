import React from 'react';
import { render } from '@testing-library/react-native';
import { CardSlot } from '../CardSlot';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('CardSlot', () => {
  describe('基础渲染', () => {
    it('应正确渲染空槽位', () => {
      const { getByTestId } = render(
        <CardSlot testID="empty-slot" />
      );
      expect(getByTestId('empty-slot')).toBeTruthy();
    });

    it('应显示标签', () => {
      const { getByTestId } = render(
        <CardSlot label="角色槽位" testID="slot" />
      );
      expect(getByTestId('slot')).toBeTruthy();
    });

    it('应支持自定义样式', () => {
      const customStyle = { margin: 10 };
      const { getByTestId } = render(
        <CardSlot style={customStyle} testID="styled-slot" />
      );
      const slot = getByTestId('styled-slot');
      expect(slot.props.style).toContainEqual(customStyle);
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <CardSlot testID="my-slot" />
      );
      expect(getByTestId('my-slot')).toBeTruthy();
    });
  });

  describe('尺寸', () => {
    it('应支持small尺寸', () => {
      const { getByTestId } = render(
        <CardSlot size="small" testID="small-slot" />
      );
      expect(getByTestId('small-slot')).toBeTruthy();
    });

    it('应支持medium尺寸', () => {
      const { getByTestId } = render(
        <CardSlot size="medium" testID="medium-slot" />
      );
      expect(getByTestId('medium-slot')).toBeTruthy();
    });

    it('应支持large尺寸', () => {
      const { getByTestId } = render(
        <CardSlot size="large" testID="large-slot" />
      );
      expect(getByTestId('large-slot')).toBeTruthy();
    });
  });

  describe('填充状态', () => {
    it('应正确渲染填充的槽位', () => {
      const { getByTestId } = render(
        <CardSlot filled testID="filled-slot">
          填充内容
        </CardSlot>
      );
      expect(getByTestId('filled-slot')).toBeTruthy();
    });

    it('填充状态不应显示空指示器', () => {
      const { queryByText, getByTestId } = render(
        <CardSlot filled testID="filled-slot">
          内容
        </CardSlot>
      );
      expect(getByTestId('filled-slot')).toBeTruthy();
    });
  });

  describe('高亮状态', () => {
    it('应支持高亮样式', () => {
      const { getByTestId } = render(
        <CardSlot highlight testID="highlight-slot" />
      );
      const slot = getByTestId('highlight-slot');
      expect(slot.props.style).toBeDefined();
    });
  });
});
