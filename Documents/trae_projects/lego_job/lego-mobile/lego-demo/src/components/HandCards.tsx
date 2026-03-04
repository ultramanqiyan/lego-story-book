import React from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import Card from './Card';
import { HandCardsProps } from '../types';
import { logger } from '../utils/Logger';

const { width } = Dimensions.get('window');

const HandCards: React.FC<HandCardsProps> = ({
  cards,
  isPlayer,
  onCardSelect,
  onCardPlay,
}) => {
  const handleDragStart = (cardId: string, position: { x: number; y: number }) => {
    logger.logUserInteraction('开始拖拽手牌', { cardId, position });
  };

  const handleDragMove = (cardId: string, position: { x: number; y: number }) => {
    logger.debug('拖拽手牌移动', { cardId, position });
  };

  const handleDragEnd = (cardId: string, position: { x: number; y: number }) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      const playZoneY = Dimensions.get('window').height * 0.4;
      
      if (position.y < playZoneY) {
        logger.logUserInteraction('打出卡牌', { cardId, cardName: card.name, position });
        onCardPlay?.(card, position);
      } else {
        logger.logUserInteraction('卡牌返回手牌', { cardId, cardName: card.name });
      }
    }
  };

  const handleLongPress = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    if (card) {
      logger.logUserInteraction('查看卡牌详情', { cardId, cardName: card.name });
      onCardSelect?.(card);
    }
  };

  if (cards.length === 0) {
    return <View style={styles.emptyContainer} />;
  }

  return (
    <View style={[styles.container, !isPlayer && styles.opponentHand]}>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            totalCards={cards.length}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onLongPress={handleLongPress}
            isPlayable={isPlayer}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opponentHand: {
    transform: [{ rotate: '180deg' }],
  },
  emptyContainer: {
    height: 130,
  },
  cardsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HandCards;
