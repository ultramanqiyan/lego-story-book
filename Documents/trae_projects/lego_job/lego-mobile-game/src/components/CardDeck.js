import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { ANIMATIONS } from '../styles/animations';
import Card from './Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CardDeck = ({
  cards = [],
  renderCard,
  onCardPress,
  selectedCardId,
  spread = false,
  cardWidth = 160,
  cardHeight = 220,
  maxVisible = 5,
  style,
  testID,
}) => {
  const [isSpread, setIsSpread] = React.useState(spread);
  const spreadValue = useSharedValue(spread ? 1 : 0);

  React.useEffect(() => {
    spreadValue.value = withSpring(isSpread ? 1 : 0, ANIMATIONS.spring.gentle);
  }, [isSpread]);

  React.useEffect(() => {
    setIsSpread(spread);
  }, [spread]);

  const toggleSpread = () => {
    setIsSpread(!isSpread);
  };

  const getCardStyle = (index, total) => {
    const visibleCards = Math.min(total, maxVisible);
    const spreadWidth = isSpread ? (visibleCards - 1) * (cardWidth * 0.3) : 0;
    const stackOffset = isSpread ? 0 : index * 3;

    return {
      position: 'absolute',
      left: isSpread ? index * (cardWidth * 0.3) : stackOffset,
      zIndex: isSpread ? index : total - index,
      elevation: isSpread ? index : total - index,
    };
  };

  const handleCardPress = (card, index) => {
    if (onCardPress) {
      onCardPress(card, index);
    }
  };

  if (cards.length === 0) {
    return (
      <View style={[styles.emptyContainer, style]} testID={testID}>
        <View style={[styles.emptyCard, { width: cardWidth, height: cardHeight }]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.deckContainer,
            {
              width: isSpread
                ? cards.length * (cardWidth * 0.3) + cardWidth * 0.7
                : cardWidth + (cards.length - 1) * 3,
              height: cardHeight,
            },
          ]}
        >
          {cards.map((card, index) => {
            const isSelected = selectedCardId === (card.id || index);
            return (
              <View
                key={card.id || index}
                style={getCardStyle(index, cards.length)}
              >
                <Card
                  rarity={card.rarity || 'common'}
                  selected={isSelected}
                  onPress={() => handleCardPress(card, index)}
                  style={{ width: cardWidth, height: cardHeight }}
                >
                  {renderCard ? renderCard(card, index) : null}
                </Card>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckContainer: {
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: SPACING.pageHorizontal,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.border.default,
    backgroundColor: 'transparent',
  },
});

export default CardDeck;
