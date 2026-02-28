import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Card, RARITY_STYLES } from '../Card';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('Card', () => {
  describe('基础渲染', () => {
    it('应正确渲染子元素', () => {
      const { getByTestId } = render(
        <Card testID="test-card">
          测试内容
        </Card>
      );
      expect(getByTestId('test-card')).toBeTruthy();
    });

    it('应应用自定义样式', () => {
      const customStyle = { backgroundColor: 'red' };
      const { getByTestId } = render(
        <Card style={customStyle} testID="test-card">
          内容
        </Card>
      );
      const card = getByTestId('test-card');
      expect(card).toBeTruthy();
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <Card testID="my-card">内容</Card>
      );
      expect(getByTestId('my-card')).toBeTruthy();
    });
  });

  describe('稀有度样式', () => {
    it('应应用common稀有度样式', () => {
      const { getByTestId } = render(
        <Card rarity="common" testID="card">内容</Card>
      );
      const card = getByTestId('card');
      expect(card.props.style).toBeDefined();
    });

    it('应应用rare稀有度样式', () => {
      const { getByTestId } = render(
        <Card rarity="rare" testID="card">内容</Card>
      );
      const card = getByTestId('card');
      expect(card.props.style).toBeDefined();
    });

    it('应应用epic稀有度样式', () => {
      const { getByTestId } = render(
        <Card rarity="epic" testID="card">内容</Card>
      );
      const card = getByTestId('card');
      expect(card.props.style).toBeDefined();
    });

    it('应应用legendary稀有度样式', () => {
      const { getByTestId } = render(
        <Card rarity="legendary" testID="card">内容</Card>
      );
      const card = getByTestId('card');
      expect(card.props.style).toBeDefined();
    });

    it('应应用mythic稀有度样式', () => {
      const { getByTestId } = render(
        <Card rarity="mythic" testID="card">内容</Card>
      );
      const card = getByTestId('card');
      expect(card.props.style).toBeDefined();
    });
  });

  describe('RARITY_STYLES常量', () => {
    it('应包含common样式', () => {
      expect(RARITY_STYLES.common).toBeDefined();
      expect(RARITY_STYLES.common.borderColor).toBe('#ffffff');
    });

    it('应包含rare样式', () => {
      expect(RARITY_STYLES.rare).toBeDefined();
      expect(RARITY_STYLES.rare.borderColor).toBe('#4fc3f7');
    });

    it('应包含epic样式', () => {
      expect(RARITY_STYLES.epic).toBeDefined();
      expect(RARITY_STYLES.epic.borderColor).toBe('#ba68c8');
    });

    it('应包含legendary样式', () => {
      expect(RARITY_STYLES.legendary).toBeDefined();
      expect(RARITY_STYLES.legendary.borderColor).toBe('#ff9800');
    });

    it('应包含mythic样式', () => {
      expect(RARITY_STYLES.mythic).toBeDefined();
      expect(RARITY_STYLES.mythic.borderColor).toBe('#ffd700');
    });
  });

  describe('交互', () => {
    it('应响应点击事件', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Card onPress={onPress} testID="clickable-card">内容</Card>
      );
      fireEvent.press(getByTestId('clickable-card'));
      expect(onPress).toHaveBeenCalled();
    });

    it('应响应长按事件', () => {
      const onLongPress = jest.fn();
      const { getByTestId } = render(
        <Card onLongPress={onLongPress} testID="longpress-card">内容</Card>
      );
      fireEvent(getByTestId('longpress-card'), 'longPress');
      expect(onLongPress).toHaveBeenCalled();
    });

    it('禁用状态不应响应点击', () => {
      const onPress = jest.fn();
      const { getByTestId } = render(
        <Card onPress={onPress} disabled testID="disabled-card">内容</Card>
      );
      fireEvent.press(getByTestId('disabled-card'));
      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe('选中状态', () => {
    it('应显示选中样式', () => {
      const { getByTestId } = render(
        <Card selected testID="selected-card">内容</Card>
      );
      const card = getByTestId('selected-card');
      expect(card.props.style).toBeDefined();
    });
  });

  describe('禁用状态', () => {
    it('应显示禁用样式', () => {
      const { getByTestId } = render(
        <Card disabled testID="disabled-card">内容</Card>
      );
      const card = getByTestId('disabled-card');
      expect(card.props.style).toBeDefined();
    });
  });
});
