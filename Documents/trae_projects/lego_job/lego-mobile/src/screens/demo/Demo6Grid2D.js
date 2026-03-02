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
const CARD_WIDTH = (width - 64) / 2;
const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const RARITY_COLORS = {
  common: COLORS.silver || '#c0c0c0',
  rare: COLORS.legoBlue || '#3b82f6',
  epic: COLORS.legoPurple || '#a855f7',
  legendary: COLORS.legoYellow || '#ffd700',
};

const RARITY_LABELS = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传说',
};

const DEFAULT_CARDS = [
  { id: 1, name: '法师', icon: '🧙', rarity: 'legendary', stars: 4, attack: 5, health: 8 },
  { id: 2, name: '战士', icon: '🦸', rarity: 'epic', stars: 3, attack: 7, health: 6 },
  { id: 3, name: '精灵', icon: '🧝', rarity: 'rare', stars: 2, attack: 2, health: 4 },
  { id: 4, name: '王子', icon: '🤴', rarity: 'common', stars: 1, attack: 4, health: 5 },
  { id: 5, name: '吸血鬼', icon: '🧛', rarity: 'epic', stars: 3, attack: 6, health: 5 },
  { id: 6, name: '美人鱼', icon: '🧜', rarity: 'rare', stars: 2, attack: 3, health: 7 },
  { id: 7, name: '英雄', icon: '🦹', rarity: 'legendary', stars: 4, attack: 8, health: 6 },
  { id: 8, name: '妖怪', icon: '👺', rarity: 'common', stars: 1, attack: 3, health: 3 },
];

function Demo6Grid2D({ navigation }) {
  const cards = DEFAULT_CARDS;
  const [selectedCard, setSelectedCard] = useState(null);
  const cardAnims = useRef(cards.map(() => new Animated.Value(0))).current;
  const detailAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    cardAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  useEffect(() => {
    if (selectedCard) {
      Animated.spring(detailAnim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(detailAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedCard]);

  const handleCardPress = (card) => {
    setSelectedCard(selectedCard?.id === card.id ? null : card);
  };

  const detailTranslateY = detailAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo 6: 2D卡牌网格</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.introText}>
          📋 传统炉石风格卡牌{'\n'}
          扁平设计 + 稀有度边框 + 点击查看详情
        </Text>

        <View style={styles.grid}>
          {cards.map((card, index) => {
            const isSelected = selectedCard?.id === card.id;
            const scale = cardAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            });

            return (
              <Animated.View
                key={card.id}
                testID="card-2d"
                style={{
                  opacity: cardAnims[index],
                  transform: [{ scale }, { scale: isSelected ? 1.05 : 1 }],
                }}
              >
                <TouchableOpacity
                  testID={`card-2d-${index}`}
                  style={[
                    styles.card,
                    { borderColor: RARITY_COLORS[card.rarity] },
                    isSelected && styles.cardSelected,
                  ]}
                  onPress={() => handleCardPress(card)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.rarityBadge, { backgroundColor: RARITY_COLORS[card.rarity] }]}>
                    <Text style={styles.rarityBadgeText}>{RARITY_LABELS[card.rarity]}</Text>
                  </View>
                  <Text style={styles.cardIcon}>{card.icon}</Text>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardStars}>{'⭐'.repeat(card.stars)}</Text>
                  <View style={styles.statsRow}>
                    <View style={[styles.statBadge, styles.attackBadge]}>
                      <Text style={styles.statText}>{card.attack}</Text>
                    </View>
                    <View style={[styles.statBadge, styles.healthBadge]}>
                      <Text style={styles.statText}>{card.health}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>

      {selectedCard && (
        <Animated.View
          style={[
            styles.detailPanel,
            { transform: [{ translateY: detailTranslateY }] },
          ]}
        >
          <View style={[styles.detailHeader, { backgroundColor: RARITY_COLORS[selectedCard.rarity] }]}>
            <Text style={styles.detailIcon}>{selectedCard.icon}</Text>
            <Text style={styles.detailName}>{selectedCard.name}</Text>
            <Text style={styles.detailRarity}>{RARITY_LABELS[selectedCard.rarity]}</Text>
          </View>
          <View style={styles.detailBody}>
            <View style={styles.detailStats}>
              <View style={styles.detailStatItem}>
                <Text style={styles.detailStatLabel}>攻击力</Text>
                <Text style={styles.detailStatValue}>{selectedCard.attack}</Text>
              </View>
              <View style={styles.detailStatItem}>
                <Text style={styles.detailStatLabel}>生命值</Text>
                <Text style={styles.detailStatValue}>{selectedCard.health}</Text>
              </View>
              <View style={styles.detailStatItem}>
                <Text style={styles.detailStatLabel}>星级</Text>
                <Text style={styles.detailStatValue}>{'⭐'.repeat(selectedCard.stars)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedCard(null)}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  introText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    borderWidth: 3,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  cardSelected: {
    shadowColor: '#ffd700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  rarityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  rarityBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 8,
    marginTop: 16,
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4,
  },
  cardStars: {
    fontSize: 10,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attackBadge: {
    backgroundColor: '#f59e0b',
  },
  healthBadge: {
    backgroundColor: '#dc2626',
  },
  statText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
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
    fontSize: 64,
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
  detailBody: {
    padding: 24,
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  detailStatItem: {
    alignItems: 'center',
  },
  detailStatLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  detailStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  closeButton: {
    backgroundColor: '#2d2d44',
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

export default Demo6Grid2D;
