import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = 90;
const CARD_HEIGHT = 130;

const DEFAULT_CARDS = [
  { id: 1, name: '法师', icon: '🧙', rarity: 'legendary' },
  { id: 2, name: '战士', icon: '🦸', rarity: 'epic' },
  { id: 3, name: '精灵', icon: '🧝', rarity: 'rare' },
  { id: 4, name: '王子', icon: '🤴', rarity: 'common' },
  { id: 5, name: '吸血鬼', icon: '🧛', rarity: 'epic' },
  { id: 6, name: '美人鱼', icon: '🧜', rarity: 'rare' },
  { id: 7, name: '英雄', icon: '🦹', rarity: 'legendary' },
];

const RARITY_COLORS = {
  common: '#c0c0c0',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#ffd700',
};

const RARITY_LABELS = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

function Demo8FanSpread({ navigation }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [spread, setSpread] = useState(false);
  const spreadAnim = useRef(new Animated.Value(0)).current;
  const selectAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(spreadAnim, {
      toValue: spread ? 1 : 0,
      tension: 80,
      friction: 7,
      useNativeDriver: false,
    }).start();
  }, [spread]);

  useEffect(() => {
    const timer = setTimeout(() => setSpread(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedCard) {
      Animated.spring(selectAnim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(selectAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [selectedCard]);

  const handleCardPress = (card) => {
    if (selectedCard?.id === card.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
  };

  const renderCard = (card, index) => {
    const totalCards = DEFAULT_CARDS.length;
    const centerIndex = (totalCards - 1) / 2;
    const offset = index - centerIndex;
    const isSelected = selectedCard?.id === card.id;

    const rotate = spreadAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${offset * 12}deg`],
    });

    const translateX = spreadAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, offset * 50],
    });

    const translateY = spreadAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, Math.abs(offset) * 20],
    });

    return (
      <Animated.View
        key={card.id}
        testID="card-fan"
        style={[
          styles.cardWrapper,
          {
            transform: [
              { translateX },
              { translateY },
              { rotate },
              { scale: isSelected ? 1.2 : 1 },
            ],
            zIndex: isSelected ? 100 : index,
          },
        ]}
      >
        <TouchableOpacity
          testID={`card-fan-${index}`}
          style={[
            styles.card,
            { borderColor: RARITY_COLORS[card.rarity] },
            isSelected && styles.cardSelected,
          ]}
          onPress={() => handleCardPress(card)}
          activeOpacity={0.8}
        >
          <Text style={styles.cardIcon}>{card.icon}</Text>
          <Text style={styles.cardName}>{card.name}</Text>
          <View style={[styles.rarityDot, { backgroundColor: RARITY_COLORS[card.rarity] }]} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo 8: 扇形展开卡牌</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.introText}>
          🃏 扇形展开效果{'\n'}
          点击卡牌查看详情
        </Text>

        <View testID="fan-container" style={styles.fanContainer}>
          {DEFAULT_CARDS.map((card, index) => renderCard(card, index))}
        </View>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setSpread(!spread)}
        >
          <Text style={styles.toggleButtonText}>
            {spread ? '收起卡牌' : '展开卡牌'}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedCard && (
        <Animated.View
          style={[
            styles.detailPanel,
            {
              opacity: selectAnim,
              transform: [
                {
                  translateY: selectAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={[styles.detailHeader, { backgroundColor: RARITY_COLORS[selectedCard.rarity] }]}>
            <Text style={styles.detailIcon}>{selectedCard.icon}</Text>
            <Text style={styles.detailName}>{selectedCard.name}</Text>
            <Text style={styles.detailRarity}>{RARITY_LABELS[selectedCard.rarity]}品质</Text>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedCard(null)}
          >
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d14',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    fontSize: 16,
    color: COLORS.legoYellow || '#ffd700',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  introText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  fanContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  cardWrapper: {
    position: 'absolute',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  cardSelected: {
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  rarityDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  toggleButton: {
    backgroundColor: '#2d2d44',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 40,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  toggleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffd700',
  },
  detailPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  detailHeader: {
    padding: 24,
    alignItems: 'center',
  },
  detailIcon: {
    fontSize: 56,
    marginBottom: 8,
  },
  detailName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  detailRarity: {
    fontSize: 14,
    color: '#000',
    opacity: 0.8,
  },
  closeButton: {
    backgroundColor: '#2d2d44',
    margin: 20,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
});

export default Demo8FanSpread;
