import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { DeckAreaProps } from '../types';
import { logger } from '../utils/Logger';

const DeckArea: React.FC<DeckAreaProps> = ({
  deckCount,
  graveyardCount,
  isPlayer,
}) => {
  const handleDeckPress = () => {
    logger.logUserInteraction('查看牌库', { deckCount, isPlayer });
  };

  const handleGraveyardPress = () => {
    logger.logUserInteraction('查看弃牌堆', { graveyardCount, isPlayer });
  };

  return (
    <View style={[styles.container, !isPlayer && styles.opponentDeck]}>
      <Pressable style={styles.deckContainer} onPress={handleDeckPress}>
        <View style={[styles.deck, deckCount === 0 && styles.emptyDeck]}>
          <View style={styles.deckCard} />
          {deckCount > 1 && <View style={[styles.deckCard, styles.deckCard2]} />}
          {deckCount > 2 && <View style={[styles.deckCard, styles.deckCard3]} />}
        </View>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{deckCount}</Text>
        </View>
      </Pressable>

      <Pressable 
        style={[styles.graveyardContainer, graveyardCount === 0 && styles.emptyGraveyard]} 
        onPress={handleGraveyardPress}
      >
        <View style={styles.graveyard}>
          {graveyardCount > 0 && (
            <>
              <View style={styles.graveyardCard} />
              {graveyardCount > 1 && <View style={[styles.graveyardCard, styles.graveyardCard2]} />}
              {graveyardCount > 2 && <View style={[styles.graveyardCard, styles.graveyardCard3]} />}
            </>
          )}
        </View>
        {graveyardCount > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{graveyardCount}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  opponentDeck: {
    transform: [{ rotate: '180deg' }],
  },
  deckContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  deck: {
    width: 50,
    height: 70,
    position: 'relative',
  },
  deckCard: {
    position: 'absolute',
    width: 50,
    height: 70,
    backgroundColor: '#4a4a5a',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#666',
    top: 0,
    left: 0,
  },
  deckCard2: {
    top: -2,
    left: 1,
  },
  deckCard3: {
    top: -4,
    left: 2,
  },
  emptyDeck: {
    opacity: 0.3,
  },
  graveyardContainer: {
    alignItems: 'center',
  },
  graveyard: {
    width: 50,
    height: 70,
    position: 'relative',
  },
  graveyardCard: {
    position: 'absolute',
    width: 50,
    height: 70,
    backgroundColor: '#3a3a4a',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#555',
    top: 0,
    left: 0,
    opacity: 0.8,
  },
  graveyardCard2: {
    top: 2,
    left: -1,
    transform: [{ rotate: '5deg' }],
  },
  graveyardCard3: {
    top: 4,
    left: -2,
    transform: [{ rotate: '-3deg' }],
  },
  emptyGraveyard: {
    opacity: 0.3,
  },
  countBadge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default DeckArea;
