import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

const DEFAULT_CARDS = [
  { id: 1, name: '法师', icon: '🧙', rarity: 'legendary', description: '掌控元素之力的神秘法师' },
  { id: 2, name: '战士', icon: '🦸', rarity: 'epic', description: '无畏的战场勇士' },
  { id: 3, name: '精灵', icon: '🧝', rarity: 'rare', description: '森林的守护者' },
  { id: 4, name: '王子', icon: '🤴', rarity: 'common', description: '寻找真爱的王子' },
  { id: 5, name: '吸血鬼', icon: '🧛', rarity: 'epic', description: '暗夜的统治者' },
  { id: 6, name: '美人鱼', icon: '🧜', rarity: 'rare', description: '深海的歌声' },
];

const RARITY_COLORS = {
  common: '#c0c0c0',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#ffd700',
};

function Demo9HorizontalStack({ navigation }) {
  const cards = DEFAULT_CARDS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const cardAnims = useRef(cards.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    cardAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  const onMomentumScrollEnd = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / (CARD_WIDTH + 20));
    setCurrentIndex(index);
  };

  const renderCard = (card, index) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + 20),
      index * (CARD_WIDTH + 20),
      (index + 1) * (CARD_WIDTH + 20),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [30, 0, 30],
      extrapolate: 'clamp',
    });

    const rotateY = scrollX.interpolate({
      inputRange,
      outputRange: ['15deg', '0deg', '-15deg'],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    const initialScale = cardAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });

    return (
      <Animated.View
        key={card.id}
        testID="card-horizontal"
        style={[
          styles.cardContainer,
          {
            opacity: Animated.multiply(opacity, cardAnims[index]),
            transform: [
              { scale: Animated.multiply(scale, initialScale) },
              { translateY },
              { perspective: 1000 },
              { rotateY },
            ],
          },
        ]}
      >
        <View
          style={[
            styles.card,
            { borderColor: RARITY_COLORS[card.rarity] },
          ]}
        >
          <View style={[styles.rarityBar, { backgroundColor: RARITY_COLORS[card.rarity] }]} />
          <Text style={styles.cardIcon}>{card.icon}</Text>
          <Text style={styles.cardName}>{card.name}</Text>
          <Text style={styles.cardDescription}>{card.description}</Text>
          <View style={styles.cardFooter}>
            <View style={[styles.rarityBadge, { backgroundColor: RARITY_COLORS[card.rarity] }]}>
              <Text style={styles.rarityBadgeText}>{card.rarity.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo 9: 横向堆叠卡牌</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.introText}>
          👆 左右滑动浏览卡牌{'\n'}
          视差深度 + 3D透视效果
        </Text>

        <Animated.ScrollView
          testID="horizontal-scroll"
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 20}
          snapToAlignment="center"
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
        >
          {cards.map((card, index) => renderCard(card, index))}
        </Animated.ScrollView>

        <View style={styles.pagination}>
          {cards.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        <View style={styles.infoPanel}>
          <Text style={styles.infoText}>
            当前: {cards[currentIndex]?.name} ({cards[currentIndex]?.rarity})
          </Text>
        </View>
      </View>
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
    paddingTop: 20,
  },
  introText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  scrollContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: '#2d2d44',
    borderRadius: 24,
    borderWidth: 3,
    alignItems: 'center',
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  rarityBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
  },
  cardIcon: {
    fontSize: 80,
    marginTop: 30,
    marginBottom: 16,
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  cardFooter: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  rarityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rarityBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#ffd700',
    width: 20,
  },
  infoPanel: {
    padding: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#f8fafc',
    fontWeight: '600',
  },
});

export default Demo9HorizontalStack;
