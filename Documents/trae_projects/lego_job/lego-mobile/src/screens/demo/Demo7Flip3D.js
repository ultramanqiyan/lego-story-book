import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const { width } = Dimensions.get('window');
const CARD_SIZE = width * 0.4;
const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const DEFAULT_CARDS = [
  { id: 1, name: '法师', icon: '🧙', front: '法师', back: '攻击力: 5 | 生命值: 8', rarity: 'legendary' },
  { id: 2, name: '战士', icon: '🦸', front: '战士', back: '攻击力: 7 | 生命值: 6', rarity: 'epic' },
  { id: 3, name: '精灵', icon: '🧝', front: '精灵', back: '攻击力: 2 | 生命值: 4', rarity: 'rare' },
  { id: 4, name: '王子', icon: '🤴', front: '王子', back: '攻击力: 4 | 生命值: 5', rarity: 'common' },
  { id: 5, name: '吸血鬼', icon: '🧛', front: '吸血鬼', back: '攻击力: 6 | 生命值: 5', rarity: 'epic' },
  { id: 6, name: '美人鱼', icon: '🧜', front: '美人鱼', back: '攻击力: 3 | 生命值: 7', rarity: 'rare' },
];

const RARITY_COLORS = {
  common: '#c0c0c0',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#ffd700',
};

function Demo7Flip3D({ navigation }) {
  const cards = DEFAULT_CARDS;
  const [flippedCards, setFlippedCards] = useState({});
  const flipAnims = useRef(cards.map(() => new Animated.Value(0))).current;
  const cardAnims = useRef(cards.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    cardAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        delay: index * 80,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleCardPress = (index) => {
    const isFlipped = flippedCards[index];
    
    Animated.timing(flipAnims[index], {
      toValue: isFlipped ? 0 : 1,
      duration: 600,
      easing: BOUNCE_EASING,
      useNativeDriver: true,
    }).start();

    setFlippedCards(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const renderCard = (card, index) => {
    const flipValue = flipAnims[index];
    
    const frontRotateY = flipValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg'],
    });

    const backRotateY = flipValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['180deg', '0deg'],
    });

    const frontOpacity = flipValue.interpolate({
      inputRange: [0.4, 0.5],
      outputRange: [1, 0],
    });

    const backOpacity = flipValue.interpolate({
      inputRange: [0.5, 0.6],
      outputRange: [0, 1],
    });

    const scale = cardAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    });

    return (
      <Animated.View
        key={card.id}
        style={{
          opacity: cardAnims[index],
          transform: [{ scale }],
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          testID={`card-3d-${index}`}
          onPress={() => handleCardPress(index)}
          activeOpacity={0.9}
        >
          <View style={styles.cardContainer}>
            <Animated.View
              testID="card-3d"
              style={[
                styles.card,
                styles.cardFront,
                {
                  borderColor: RARITY_COLORS[card.rarity],
                  transform: [
                    { perspective: 1000 },
                    { rotateY: frontRotateY },
                  ],
                  opacity: frontOpacity,
                },
              ]}
            >
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <Text style={styles.cardName}>{card.front}</Text>
              <Text style={styles.tapHint}>点击翻转</Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.card,
                styles.cardBack,
                {
                  borderColor: RARITY_COLORS[card.rarity],
                  transform: [
                    { perspective: 1000 },
                    { rotateY: backRotateY },
                  ],
                  opacity: backOpacity,
                },
              ]}
            >
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text style={styles.cardStats}>{card.back}</Text>
            </Animated.View>
          </View>
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
        <Text style={styles.headerTitle}>Demo 7: 3D翻转卡牌</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.introText}>
          🔄 3D翻转效果{'\n'}
          透视 + 翻转动画 + 深度阴影
        </Text>

        <View style={styles.cardGrid}>
          {cards.map((card, index) => renderCard(card, index))}
        </View>
      </ScrollView>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  introText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: CARD_SIZE,
    height: CARD_SIZE * 1.3,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 3,
    backgroundColor: '#2d2d44',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  cardFront: {
    backgroundColor: '#2d2d44',
  },
  cardBack: {
    backgroundColor: '#1a1a2e',
  },
  cardIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  cardStats: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  tapHint: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
  },
});

export default Demo7Flip3D;
