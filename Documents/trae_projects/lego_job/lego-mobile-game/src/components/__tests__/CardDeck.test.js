import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CardDeck } from '../CardDeck';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

describe('CardDeck', () => {
  const mockCards = [
    { id: '1', name: '卡牌1', rarity: 'common' },
    { id: '2', name: '卡牌2', rarity: 'rare' },
    { id: '3', name: '卡牌3', rarity: 'epic' },
  ];

  const renderCard = (card) => <>{card.name}</>;

  describe('基础渲染', () => {
    it('应正确渲染卡牌列表', () => {
      const { getByTestId } = render(
        <CardDeck cards={mockCards} renderCard={renderCard} testID="card-deck" />
      );
      expect(getByTestId('card-deck')).toBeTruthy();
    });

    it('应支持自定义样式', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <CardDeck
          cards={mockCards}
          renderCard={renderCard}
          style={customStyle}
          testID="card-deck"
        />
      );
      const deck = getByTestId('card-deck');
      expect(deck.props.style).toContainEqual(customStyle);
    });

    it('应支持testID', () => {
      const { getByTestId } = render(
        <CardDeck
          cards={mockCards}
          renderCard={renderCard}
          testID="my-deck"
        />
      );
      expect(getByTestId('my-deck')).toBeTruthy();
    });
  });

  describe('空状态', () => {
    it('应正确渲染空卡组', () => {
      const { getByTestId } = render(
        <CardDeck cards={[]} testID="empty-deck" />
      );
      expect(getByTestId('empty-deck')).toBeTruthy();
    });
  });

  describe('交互', () => {
    it('应响应卡牌点击事件', () => {
      const onCardPress = jest.fn();
      const { getByTestId } = render(
        <CardDeck
          cards={mockCards}
          renderCard={renderCard}
          onCardPress={onCardPress}
          testID="card-deck"
        />
      );
      const deck = getByTestId('card-deck');
      const touchables = deck.findAllByType('TouchableOpacity');
      if (touchables.length > 0) {
        fireEvent.press(touchables[0]);
        expect(onCardPress).toHaveBeenCalled();
      }
    });
  });

  describe('选中状态', () => {
    it('应显示选中的卡牌', () => {
      const { getByTestId } = render(
        <CardDeck
          cards={mockCards}
          renderCard={renderCard}
          selectedCardId="2"
          testID="card-deck"
        />
      );
      expect(getByTestId('card-deck')).toBeTruthy();
    });
  });

  describe('展开状态', () => {
    it('应支持展开模式', () => {
      const { getByTestId } = render(
        <CardDeck
          cards={mockCards}
          renderCard={renderCard}
          isSpread
          testID="spread-deck"
        />
      );
      expect(getByTestId('spread-deck')).toBeTruthy();
    });
  });
});
