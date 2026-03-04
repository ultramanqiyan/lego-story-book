import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Animated, 
  Pressable,
  PanResponder,
  Dimensions
} from 'react-native';
import { CardProps, Card as CardType, CardType as CardTypeEnum, CardRarity } from '../types';
import { logger } from '../utils/Logger';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = 80;
const CARD_HEIGHT = 120;

const Card: React.FC<CardProps> = ({
  card,
  index,
  totalCards,
  onDragStart,
  onDragMove,
  onDragEnd,
  onLongPress,
  isPlayable = true,
  isDragging = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const positionRef = useRef({ x: 0, y: 0 });

  const rotation = ((index - (totalCards - 1) / 2) * 5);
  const offsetX = (index - (totalCards - 1) / 2) * 30;

  useEffect(() => {
    rotateAnim.setValue(rotation);
  }, [rotation]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isPlayable,
      onMoveShouldSetPanResponder: () => isPlayable,
      onPanResponderGrant: (evt) => {
        if (!isPlayable) return;
        
        isDraggingRef.current = true;
        positionRef.current = { 
          x: evt.nativeEvent.locationX, 
          y: evt.nativeEvent.locationY 
        };
        
        logger.logUserInteraction('开始拖拽卡牌', { cardId: card.id, cardName: card.name });
        
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: -30,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();

        onDragStart?.(card.id, positionRef.current);

        longPressTimerRef.current = setTimeout(() => {
          logger.logUserInteraction('长按卡牌', { cardId: card.id, cardName: card.name });
          onLongPress?.(card.id);
        }, 500);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isDraggingRef.current) return;
        
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        positionRef.current = {
          x: gestureState.moveX,
          y: gestureState.moveY,
        };

        onDragMove?.(card.id, positionRef.current);
      },
      onPanResponderRelease: (evt, gestureState) => {
        isDraggingRef.current = false;
        
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        logger.logUserInteraction('释放卡牌', { 
          cardId: card.id, 
          cardName: card.name,
          position: positionRef.current
        });

        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        onDragEnd?.(card.id, positionRef.current);
      },
      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
        
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }

        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'COMMON': return '#fff';
      case 'RARE': return '#2196F3';
      case 'EPIC': return '#9C27B0';
      case 'LEGENDARY': return '#FFD700';
      default: return '#fff';
    }
  };

  const getCardTypeIcon = (type: CardTypeEnum): string => {
    switch (type) {
      case CardTypeEnum.MINION: return '⚔️';
      case CardTypeEnum.SPELL: return '✨';
      case CardTypeEnum.WEAPON: return '🗡️';
      case CardTypeEnum.HERO: return '👑';
      default: return '🃏';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateX: offsetX },
            { translateY: floatAnim },
            { rotate: `${rotateAnim}deg` },
            { scale: scaleAnim },
          ],
        },
        !isPlayable && styles.disabled,
        isDragging && styles.dragging,
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.card, { borderColor: getRarityColor(card.rarity) }]}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>{card.name}</Text>
          <View style={styles.costBadge}>
            <Text style={styles.costText}>{card.cost}</Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Text style={styles.typeIcon}>{getCardTypeIcon(card.type)}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.description} numberOfLines={2}>
            {card.description}
          </Text>
        </View>

        {card.type === CardTypeEnum.MINION && (
          <View style={styles.statsContainer}>
            <View style={styles.statBadge}>
              <Text style={styles.statText}>{card.attack}</Text>
            </View>
            <View style={[styles.statBadge, styles.healthBadge]}>
              <Text style={styles.statText}>{card.health}</Text>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginHorizontal: -15,
  },
  card: {
    flex: 1,
    backgroundColor: '#2a2a3a',
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  dragging: {
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  name: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 4,
  },
  costBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  costText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.3)',
  },
  typeIcon: {
    fontSize: 30,
  },
  content: {
    padding: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  description: {
    fontSize: 8,
    color: '#ccc',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
  },
  statBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthBadge: {
    backgroundColor: '#F44336',
  },
  statText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Card;
