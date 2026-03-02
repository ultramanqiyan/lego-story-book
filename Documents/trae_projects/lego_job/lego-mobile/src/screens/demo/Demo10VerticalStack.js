import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { COLORS } from '../../utils/constants';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_HEIGHT = CARD_WIDTH * 1.3;
const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

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

function Demo10VerticalStack({ navigation }) {
  const cards = DEFAULT_CARDS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const stackAnims = useRef(cards.map(() => new Animated.Value(0))).current;
  const cardAnims = useRef(cards.map(() => new Animated.Value(0))).current;

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

  const flipToNext = () => {
    if (isFlipping || currentIndex >= cards.length - 1) return;
    
    setIsFlipping(true);
    
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(prev => prev + 1);
      setIsFlipping(false);
    });
  };

  const flipToPrev = () => {
    if (isFlipping || currentIndex <= 0) return;
    
    setIsFlipping(true);
    
    Animated.sequence([
      Animated.timing(flipAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(flipAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentIndex(prev => prev - 1);
      setIsFlipping(false);
    });
  };

  const getStackStyle = (index) => {
    const offset = index - currentIndex;
    
    if (offset < 0) return { display: 'none' };
    
    const translateY = offset * 15;
    const scale = 1 - offset * 0.05;
    const opacity = 1 - offset * 0.2;
    const zIndex = cards.length - index;

    return {
      opacity: Math.max(opacity, 0),
      transform: [
        { translateY },
        { scale },
        { perspective: 1000 },
        { rotateX: `${offset * 5}deg` },
      ],
      zIndex,
    };
  };

  const topCardRotateX = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-90deg'],
  });

  const topCardScale = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });

  const topCardOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  const currentCard = cards[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo 10: 纵向堆叠卡牌</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.introText}>
          📚 点击卡牌翻转揭示下一张{'\n'}
          纵向堆叠 + 3D透视效果
        </Text>

        <View style={styles.stackContainer}>
          {cards.map((card, index) => {
            const isTop = index === currentIndex;
            const stackStyle = getStackStyle(index);
            
            if (stackStyle.display === 'none') return null;

            const initialScale = cardAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            });

            return (
              <Animated.View
                key={card.id}
                testID="card-vertical"
                style={[
                  styles.cardWrapper,
                  stackStyle,
                  {
                    opacity: Animated.multiply(stackStyle.opacity, cardAnims[index]),
                    transform: isTop
                      ? [
                          { perspective: 1000 },
                          { rotateX: topCardRotateX },
                          { scale: Animated.multiply(topCardScale, initialScale) },
                        ]
                      : [
                          ...stackStyle.transform,
                          { scale: Animated.multiply(stackStyle.transform[1].scale, initialScale) },
                        ],
                  },
                ]}
              >
                {isTop && (
                  <TouchableOpacity
                    testID="card-vertical-top"
                    style={[
                      styles.card,
                      { borderColor: RARITY_COLORS[card.rarity] },
                    ]}
                    onPress={flipToNext}
                    activeOpacity={0.9}
                  >
                    <View style={[styles.rarityBar, { backgroundColor: RARITY_COLORS[card.rarity] }]} />
                    <Text style={styles.cardIcon}>{card.icon}</Text>
                    <Text style={styles.cardName}>{card.name}</Text>
                    <Text style={styles.cardDescription}>{card.description}</Text>
                    <View style={styles.tapHint}>
                      <Text style={styles.tapHintText}>👆 点击翻转</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {!isTop && (
                  <View
                    style={[
                      styles.card,
                      styles.cardBack,
                      { borderColor: RARITY_COLORS[card.rarity] },
                    ]}
                  >
                    <Text style={styles.cardBackIcon}>🎴</Text>
                    <Text style={styles.cardBackText}>第 {index + 1} 张</Text>
                  </View>
                )}
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, currentIndex <= 0 && styles.controlButtonDisabled]}
            onPress={flipToPrev}
            disabled={currentIndex <= 0 || isFlipping}
          >
            <Text style={styles.controlButtonText}>⬆️ 上一张</Text>
          </TouchableOpacity>
          
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {currentIndex + 1} / {cards.length}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.controlButton, currentIndex >= cards.length - 1 && styles.controlButtonDisabled]}
            onPress={flipToNext}
            disabled={currentIndex >= cards.length - 1 || isFlipping}
          >
            <Text style={styles.controlButtonText}>⬇️ 下一张</Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    paddingTop: 20,
  },
  introText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  stackContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2d2d44',
    borderRadius: 24,
    borderWidth: 3,
    alignItems: 'center',
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  cardBack: {
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
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
    paddingHorizontal: 30,
  },
  tapHint: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tapHintText: {
    fontSize: 14,
    color: '#64748b',
  },
  cardBackIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  cardBackText: {
    fontSize: 16,
    color: '#64748b',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 30,
  },
  controlButton: {
    backgroundColor: '#2d2d44',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#ffd700',
  },
  controlButtonDisabled: {
    opacity: 0.3,
    borderColor: '#64748b',
  },
  controlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffd700',
  },
  counter: {
    backgroundColor: '#2d2d44',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  counterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
});

export default Demo10VerticalStack;
