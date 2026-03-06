import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Animated,
  ScrollView,
  Modal,
} from 'react-native';
import { GameProvider, useGame } from './src/context/GameContext';
import { StyleProvider, useStyle } from './src/context/StyleContext';
import { Card, Minion, CardType, GameState } from './src/types/game';
import { CardStyleType, AnimationType, CARD_STYLES, ANIMATION_CONFIGS } from './src/types/styles';
import { logger } from './src/utils/GameLogger';
import {
  useBounceAnimation,
  useFlipAnimation,
  useSlideAnimation,
  useSpinAnimation,
  useFadeBlinkAnimation,
  usePulseAnimation,
  useShakeAnimation,
  useWaveAnimation,
  useParticleBurstAnimation,
  useGlowRingAnimation,
} from './src/utils/AnimationEffects';
import StoryDirectorDemo from './src/screens/StoryDirectorDemo';
import UIStyleListScreen, { UIStyleType } from './src/screens/UIStyleListScreen';
import SideScrollerGameStyle from './src/screens/styles/SideScrollerGameStyle';
import PixelBlockStyle from './src/screens/styles/PixelBlockStyle';
import MovieFilmStyle from './src/screens/styles/MovieFilmStyle';
import HandDrawnStyle from './src/screens/styles/HandDrawnStyle';
import BookDetailDemo from './src/screens/BookDetailDemo';
import BookshelfDemo from './src/screens/BookshelfDemo';
import HomeScreen from './src/screens/HomeScreen';
import StyleDemo from './src/screens/StyleDemo';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = 70;
const CARD_HEIGHT = 100;
const DROP_ZONE_Y = height * 0.5;

const getCardStyleColors = (styleType: CardStyleType) => {
  return CARD_STYLES[styleType].colors;
};

interface StyleSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ visible, onClose }) => {
  const { currentStyle, currentAnimation, setStyle, setAnimation, allStyles, allAnimations } = useStyle();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>风格与动画设置</Text>
          
          <Text style={styles.sectionTitle}>卡牌风格 (当前: {CARD_STYLES[currentStyle].name})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleScroll}>
            {allStyles.map((style) => {
              const styleConfig = CARD_STYLES[style];
              return (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.styleItem,
                    { borderColor: styleConfig.colors.border },
                    currentStyle === style && styles.styleItemSelected,
                  ]}
                  onPress={() => setStyle(style)}
                >
                  <View style={[styles.stylePreview, { backgroundColor: styleConfig.colors.primary }]}>
                    <View style={[styles.stylePreviewInner, { backgroundColor: styleConfig.colors.secondary }]} />
                  </View>
                  <Text style={[styles.styleName, { color: styleConfig.colors.accent }]}>{styleConfig.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>动画效果 (当前: {ANIMATION_CONFIGS[currentAnimation].name})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.styleScroll}>
            {allAnimations.map((anim) => {
              const animConfig = ANIMATION_CONFIGS[anim];
              return (
                <TouchableOpacity
                  key={anim}
                  style={[
                    styles.animItem,
                    currentAnimation === anim && styles.animItemSelected,
                  ]}
                  onPress={() => setAnimation(anim)}
                >
                  <Text style={styles.animIcon}>
                    {anim === AnimationType.BOUNCE && '⬆️'}
                    {anim === AnimationType.FLIP && '🔄'}
                    {anim === AnimationType.SLIDE && '➡️'}
                    {anim === AnimationType.SPIN && '🌀'}
                    {anim === AnimationType.FADE_BLINK && '💫'}
                    {anim === AnimationType.PULSE && '💓'}
                    {anim === AnimationType.SHAKE && '📳'}
                    {anim === AnimationType.WAVE && '🌊'}
                    {anim === AnimationType.PARTICLE_BURST && '✨'}
                    {anim === AnimationType.GLOW_RING && '⭕'}
                  </Text>
                  <Text style={styles.animName}>{animConfig.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

interface StyledCardProps {
  card: Card;
  index: number;
  isPlayable: boolean;
  animationType: AnimationType;
  styleType: CardStyleType;
  onDragStart: (card: Card) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: (card: Card, y: number) => void;
}

const StyledCard: React.FC<StyledCardProps> = ({
  card,
  index,
  isPlayable,
  animationType,
  styleType,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const styleConfig = CARD_STYLES[styleType];
  const bounceAnim = useBounceAnimation();
  const flipAnim = useFlipAnimation();
  const slideAnim = useSlideAnimation();
  const spinAnim = useSpinAnimation();
  const fadeBlinkAnim = useFadeBlinkAnimation();
  const pulseAnim = usePulseAnimation();
  const shakeAnim = useShakeAnimation();
  const waveAnim = useWaveAnimation();
  const particleBurstAnim = useParticleBurstAnimation();
  const glowRingAnim = useGlowRingAnimation();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isDraggingRef = useRef(false);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      switch (animationType) {
        case AnimationType.BOUNCE:
          bounceAnim.animate();
          break;
        case AnimationType.FLIP:
          flipAnim.animate();
          break;
        case AnimationType.SLIDE:
          slideAnim.animate();
          break;
        case AnimationType.SPIN:
          spinAnim.animate();
          break;
        case AnimationType.PARTICLE_BURST:
          particleBurstAnim.animate();
          break;
      }
    }
  }, [animationType]);

  useEffect(() => {
    if (animationType === AnimationType.FADE_BLINK) {
      fadeBlinkAnim.start();
    } else if (animationType === AnimationType.PULSE) {
      pulseAnim.start();
    } else if (animationType === AnimationType.SHAKE) {
      shakeAnim.start();
    } else if (animationType === AnimationType.WAVE) {
      waveAnim.start();
    } else if (animationType === AnimationType.GLOW_RING) {
      glowRingAnim.start();
    }

    return () => {
      fadeBlinkAnim.stop();
      pulseAnim.stop();
      shakeAnim.stop();
      waveAnim.stop();
      glowRingAnim.stop();
    };
  }, [animationType]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isPlayable,
      onMoveShouldSetPanResponder: () => isPlayable,
      onPanResponderGrant: () => {
        if (!isPlayable) return;
        isDraggingRef.current = true;
        logger.logInteraction('开始拖拽卡牌', { cardName: card.name });
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
        }).start();
        onDragStart(card);
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isDraggingRef.current) return;
        onDragMove(gestureState.moveX, gestureState.moveY);
      },
      onPanResponderRelease: (_, gestureState) => {
        isDraggingRef.current = false;
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        logger.logInteraction('释放卡牌', { cardName: card.name, y: gestureState.moveY });
        onDragEnd(card, gestureState.moveY);
      },
      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const getCardTypeIcon = () => {
    switch (card.type) {
      case CardType.MINION: return '⚔️';
      case CardType.SPELL: return '✨';
      default: return '🃏';
    }
  };

  const getAnimationStyle = () => {
    const baseStyle: any = {};
    
    switch (animationType) {
      case AnimationType.BOUNCE:
        baseStyle.transform = [
          { scale: bounceAnim.scaleAnim },
          { translateY: bounceAnim.translateYAnim },
        ];
        break;
      case AnimationType.FLIP:
        baseStyle.transform = [
          { rotateY: flipAnim.rotateY },
          { scale: flipAnim.scaleAnim },
        ];
        break;
      case AnimationType.SLIDE:
        baseStyle.transform = [
          { translateX: slideAnim.translateXAnim },
        ];
        baseStyle.opacity = slideAnim.opacityAnim;
        break;
      case AnimationType.SPIN:
        baseStyle.transform = [
          { rotate: spinAnim.rotate },
          { scale: spinAnim.scaleAnim },
        ];
        break;
      case AnimationType.FADE_BLINK:
        baseStyle.opacity = fadeBlinkAnim.opacityAnim;
        baseStyle.transform = [{ scale: scaleAnim }];
        break;
      case AnimationType.PULSE:
        baseStyle.transform = [{ scale: pulseAnim.scaleAnim }];
        break;
      case AnimationType.SHAKE:
        baseStyle.transform = [{ translateX: shakeAnim.translateXAnim }, { scale: scaleAnim }];
        break;
      case AnimationType.WAVE:
        baseStyle.transform = [
          { translateY: waveAnim.translateYAnim },
          { rotate: waveAnim.rotate },
        ];
        break;
      case AnimationType.GLOW_RING:
        baseStyle.transform = [{ scale: scaleAnim }];
        break;
      default:
        baseStyle.transform = [{ scale: scaleAnim }];
    }
    
    return baseStyle;
  };

  const cardStyle = [
    styles.card,
    {
      backgroundColor: styleConfig.colors.primary,
      borderColor: styleConfig.colors.border,
      borderWidth: styleConfig.borderWidth,
      borderRadius: styleConfig.borderRadius,
      shadowColor: styleConfig.shadowConfig.color,
      shadowOffset: styleConfig.shadowConfig.offset,
      shadowOpacity: styleConfig.shadowConfig.opacity,
      shadowRadius: styleConfig.shadowConfig.radius,
    },
    isPlayable && {
      borderColor: styleConfig.colors.accent,
      shadowColor: styleConfig.colors.glow || styleConfig.colors.accent,
      shadowOpacity: 0.6,
      shadowRadius: 8,
    },
    !isPlayable && styles.cardDisabled,
  ];

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { marginLeft: index === 0 ? 0 : -20 },
        getAnimationStyle(),
      ]}
      {...panResponder.panHandlers}
    >
      <View style={cardStyle}>
        {animationType === AnimationType.GLOW_RING && (
          <Animated.View
            style={[
              styles.glowRing,
              {
                transform: [{ scale: glowRingAnim.scaleAnim }],
                opacity: glowRingAnim.opacityAnim,
                borderColor: styleConfig.colors.glow || styleConfig.colors.accent,
              },
            ]}
          />
        )}
        <View style={styles.cardHeader}>
          <Text style={[styles.cardName, { color: styleConfig.colors.text }]} numberOfLines={1}>
            {card.name}
          </Text>
          <View style={[styles.cardCost, { backgroundColor: styleConfig.colors.accent }]}>
            <Text style={styles.cardCostText}>{card.cost}</Text>
          </View>
        </View>
        <View style={styles.cardImage}>
          <Text style={styles.cardIcon}>{getCardTypeIcon()}</Text>
        </View>
        <Text style={[styles.cardDesc, { color: styleConfig.colors.text + '99' }]} numberOfLines={2}>
          {card.description}
        </Text>
        {card.type === CardType.MINION && (
          <View style={styles.cardStats}>
            <View style={[styles.statBadge, { backgroundColor: '#FFC107' }]}>
              <Text style={styles.statText}>{card.attack}</Text>
            </View>
            <View style={[styles.statBadge, styles.healthStat]}>
              <Text style={styles.statText}>{card.health}</Text>
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

interface StyledMinionProps {
  minion: Minion;
  isPlayer: boolean;
  isSelected: boolean;
  isTargetable: boolean;
  styleType: CardStyleType;
  onPress: () => void;
}

const StyledMinion: React.FC<StyledMinionProps> = ({
  minion,
  isPlayer,
  isSelected,
  isTargetable,
  styleType,
  onPress,
}) => {
  const styleConfig = CARD_STYLES[styleType];
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start();
    logger.logAnimation('召唤', minion.name);
  }, []);

  useEffect(() => {
    if (minion.canAttack && isPlayer) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [minion.canAttack, isPlayer]);

  const getHealthColor = () => {
    if (minion.health < minion.maxHealth) return '#F44336';
    if (minion.health > minion.maxHealth) return '#4CAF50';
    return styleConfig.colors.text;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.minion,
          {
            backgroundColor: styleConfig.colors.minionBg || styleConfig.colors.primary,
            borderColor: isSelected ? styleConfig.colors.accent : isTargetable ? '#F44336' : styleConfig.colors.border,
            borderRadius: styleConfig.borderRadius,
            transform: [{ scale: scaleAnim }],
          },
          isSelected && styles.minionSelected,
          isTargetable && styles.minionTargetable,
        ]}
      >
        {(minion.canAttack && isPlayer) && (
          <Animated.View
            style={[
              styles.minionGlow,
              {
                opacity: glowAnim,
                backgroundColor: styleConfig.colors.glow || styleConfig.colors.accent + '4D',
              },
            ]}
          />
        )}
        <View style={styles.minionImage}>
          <Text style={styles.minionIcon}>👹</Text>
        </View>
        <Text style={[styles.minionName, { color: styleConfig.colors.text }]} numberOfLines={1}>
          {minion.name}
        </Text>
        <View style={styles.minionStats}>
          <View style={[styles.statBadge, { backgroundColor: '#FFC107' }]}>
            <Text style={styles.statText}>{minion.attack}</Text>
          </View>
          <View style={[styles.statBadge, { backgroundColor: getHealthColor() }]}>
            <Text style={styles.statText}>{minion.health}</Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

interface GameBoardProps {
  onNavigateToDirector: () => void;
  onNavigateToUIStyles: () => void;
  onNavigateToBookDetail: () => void;
  onNavigateToBookshelf: () => void;
  onNavigateToHome: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ onNavigateToDirector, onNavigateToUIStyles, onNavigateToBookDetail, onNavigateToBookshelf, onNavigateToHome }) => {
  const { state, playCard, attackMinion, attackHero, endTurn, selectMinion } = useGame();
  const { currentStyle, currentAnimation, cycleStyle, cycleAnimation } = useStyle();
  const [draggingCard, setDraggingCard] = useState<Card | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 2000);
  }, []);

  const handleDragStart = useCallback((card: Card) => {
    setDraggingCard(card);
  }, []);

  const handleDragMove = useCallback((x: number, y: number) => {
    setDragPosition({ x, y });
  }, []);

  const handleDragEnd = useCallback((card: Card, y: number) => {
    if (y < DROP_ZONE_Y && card.cost <= state.player.mana) {
      playCard(card.id);
      showMessage(`打出: ${card.name}`);
    } else if (card.cost > state.player.mana) {
      showMessage('法力不足!');
    }
    setDraggingCard(null);
  }, [state.player.mana, playCard, showMessage]);

  const handleMinionPress = useCallback((minion: Minion, isPlayer: boolean) => {
    if (isPlayer) {
      if (state.phase === 'IDLE' && minion.canAttack) {
        selectMinion(minion.id);
        showMessage(`选择 ${minion.name} 攻击目标`);
      } else if (state.phase === 'SELECTING_TARGET') {
        selectMinion(null);
      }
    } else {
      if (state.phase === 'SELECTING_TARGET' && state.selectedMinionId) {
        attackMinion(state.selectedMinionId, minion.id);
        showMessage('攻击成功!');
      }
    }
  }, [state.phase, state.selectedMinionId, selectMinion, attackMinion, showMessage]);

  const handleHeroPress = useCallback((isPlayer: boolean) => {
    if (!isPlayer && state.phase === 'SELECTING_TARGET' && state.selectedMinionId) {
      attackHero(state.selectedMinionId);
      showMessage('攻击英雄!');
    }
  }, [state.phase, state.selectedMinionId, attackHero, showMessage]);

  const handleEndTurn = useCallback(() => {
    endTurn();
    showMessage('结束回合');
  }, [endTurn, showMessage]);

  const styleConfig = CARD_STYLES[currentStyle];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: styleConfig.colors.background }]}>
      <View style={styles.gameContainer}>
        <View style={styles.opponentSection}>
          <View style={styles.playerInfoRow}>
            <TouchableOpacity onPress={() => handleHeroPress(false)}>
              <View style={[styles.heroContainer]}>
                <View style={[styles.heroAvatar, { borderColor: styleConfig.colors.accent }]}>
                  <Text style={styles.heroIcon}>👹</Text>
                </View>
                <View style={[styles.healthBadge, { backgroundColor: '#F44336' }]}>
                  <Text style={styles.healthText}>{state.opponent.hero.health}</Text>
                </View>
                <Text style={[styles.heroName, { color: styleConfig.colors.accent }]}>{state.opponent.hero.name}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.manaContainer}>
              {Array.from({ length: Math.min(state.opponent.maxMana, 10) }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.manaCrystal,
                    { backgroundColor: i < state.opponent.mana ? styleConfig.colors.accent : '#333' },
                  ]}
                />
              ))}
            </View>
            <View style={styles.deckArea}>
              <View style={[styles.deck, { backgroundColor: styleConfig.colors.primary, borderColor: styleConfig.colors.border }]}>
                <Text style={[styles.deckCount, { color: styleConfig.colors.text }]}>{state.opponent.deckCount}</Text>
              </View>
            </View>
          </View>
          <View style={styles.minionField}>
            {state.opponent.minions.map(m => (
              <StyledMinion
                key={m.id}
                minion={m}
                isPlayer={false}
                isSelected={false}
                isTargetable={state.phase === 'SELECTING_TARGET'}
                styleType={currentStyle}
                onPress={() => handleMinionPress(m, false)}
              />
            ))}
          </View>
        </View>

        <View style={styles.centerSection}>
          <Text style={[styles.turnText, { color: styleConfig.colors.accent }]}>
            {state.currentTurn === 'player' ? '你的回合' : '对手回合'}
          </Text>
          <Text style={[styles.turnNumber, { color: styleConfig.colors.text }]}>第 {state.turnNumber} 回合</Text>
          {state.phase === 'SELECTING_TARGET' && (
            <Text style={styles.hintText}>选择攻击目标</Text>
          )}
        </View>

        <View style={styles.playerSection}>
          <View style={styles.minionField}>
            {state.player.minions.map(m => (
              <StyledMinion
                key={m.id}
                minion={m}
                isPlayer={true}
                isSelected={state.selectedMinionId === m.id}
                isTargetable={false}
                styleType={currentStyle}
                onPress={() => handleMinionPress(m, true)}
              />
            ))}
          </View>
          <View style={styles.playerInfoRow}>
            <TouchableOpacity onPress={() => handleHeroPress(true)}>
              <View style={styles.heroContainer}>
                <View style={[styles.heroAvatar, { borderColor: styleConfig.colors.accent }]}>
                  <Text style={styles.heroIcon}>👑</Text>
                </View>
                <View style={[styles.healthBadge, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.healthText}>{state.player.hero.health}</Text>
                </View>
                <Text style={[styles.heroName, { color: styleConfig.colors.accent }]}>{state.player.hero.name}</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.manaContainer}>
              {Array.from({ length: Math.min(state.player.maxMana, 10) }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.manaCrystal,
                    { backgroundColor: i < state.player.mana ? styleConfig.colors.accent : '#333' },
                  ]}
                />
              ))}
            </View>
            <View style={styles.deckArea}>
              <View style={[styles.deck, { backgroundColor: styleConfig.colors.primary, borderColor: styleConfig.colors.border }]}>
                <Text style={[styles.deckCount, { color: styleConfig.colors.text }]}>{state.player.deckCount}</Text>
              </View>
            </View>
          </View>
          <View style={styles.handArea}>
            {state.player.hand.map((card, i) => (
              <StyledCard
                key={card.id}
                card={card}
                index={i}
                isPlayable={card.cost <= state.player.mana && state.currentTurn === 'player'}
                animationType={currentAnimation}
                styleType={currentStyle}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
              />
            ))}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.styleBtn} onPress={onNavigateToHome}>
              <Text style={styles.btnIcon}>🏠</Text>
              <Text style={styles.btnText}>首页</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.styleBtn} onPress={() => setShowStyleSelector(true)}>
              <Text style={styles.btnIcon}>🎨</Text>
              <Text style={styles.btnText}>风格</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.endTurnBtn,
                { backgroundColor: styleConfig.colors.accent },
              ]}
              onPress={onNavigateToBookshelf}
              activeOpacity={0.8}
            >
              <Text style={styles.endTurnText}>📚 书架</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.styleBtn} onPress={onNavigateToDirector}>
              <Text style={styles.btnIcon}>🎬</Text>
              <Text style={styles.btnText}>导演台</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.styleBtn} onPress={onNavigateToBookDetail}>
              <Text style={styles.btnIcon}>📖</Text>
              <Text style={styles.btnText}>书籍</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {draggingCard && (
        <View
          style={[
            styles.draggingCard,
            {
              left: dragPosition.x - CARD_WIDTH / 2,
              top: dragPosition.y - CARD_HEIGHT / 2,
            },
          ]}
          pointerEvents="none"
        >
          <View style={[styles.card, { backgroundColor: styleConfig.colors.primary, borderColor: styleConfig.colors.accent }]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardName, { color: styleConfig.colors.text }]}>{draggingCard.name}</Text>
              <View style={[styles.cardCost, { backgroundColor: styleConfig.colors.accent }]}>
                <Text style={styles.cardCostText}>{draggingCard.cost}</Text>
              </View>
            </View>
            <View style={styles.cardImage}>
              <Text style={styles.cardIcon}>
                {draggingCard.type === CardType.MINION ? '⚔️' : '✨'}
              </Text>
            </View>
            <Text style={[styles.cardDesc, { color: styleConfig.colors.text }]}>{draggingCard.description}</Text>
            {draggingCard.type === CardType.MINION && (
              <View style={styles.cardStats}>
                <View style={[styles.statBadge, { backgroundColor: '#FFC107' }]}>
                  <Text style={styles.statText}>{draggingCard.attack}</Text>
                </View>
                <View style={[styles.statBadge, styles.healthStat]}>
                  <Text style={styles.statText}>{draggingCard.health}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {message ? (
        <View style={styles.messageOverlay} pointerEvents="none">
          <View style={[styles.messageBox, { backgroundColor: styleConfig.colors.primary }]}>
            <Text style={[styles.messageText, { color: styleConfig.colors.text }]}>{message}</Text>
          </View>
        </View>
      ) : null}

      <StyleSelector visible={showStyleSelector} onClose={() => setShowStyleSelector(false)} />

      <View style={styles.styleIndicator}>
        <Text style={[styles.styleIndicatorText, { color: styleConfig.colors.text }]}>
          风格: {styleConfig.name} | 动画: {ANIMATION_CONFIGS[currentAnimation].name}
        </Text>
      </View>
    </SafeAreaView>
  );
};

type PageState = 'main-home' | 'card-demo' | 'director' | 'ui-style-list' | 'bookshelf' | 'book-detail' | 'style-demo' | UIStyleType;

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('main-home');
  const [previousPage, setPreviousPage] = useState<PageState>('main-home');

  const navigateTo = (page: PageState) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  };

  const goBack = () => {
    setCurrentPage(previousPage);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'main-home':
        return (
          <HomeScreen
            onNavigateToBookshelf={() => navigateTo('bookshelf')}
            onNavigateToCardDemo={() => navigateTo('card-demo')}
            onNavigateToStyle={() => navigateTo('style-demo')}
          />
        );
      case 'style-demo':
        return <StyleDemo onBack={() => setCurrentPage('main-home')} />;
      case 'card-demo':
        return (
          <GameBoard
            onNavigateToDirector={() => navigateTo('director')}
            onNavigateToUIStyles={() => setCurrentPage('ui-style-list')}
            onNavigateToBookDetail={() => navigateTo('book-detail')}
            onNavigateToBookshelf={() => navigateTo('bookshelf')}
            onNavigateToHome={() => setCurrentPage('main-home')}
          />
        );
      case 'director':
        return <StoryDirectorDemo onBack={() => setCurrentPage('card-demo')} />;
      case 'bookshelf':
        return <BookshelfDemo onBack={() => setCurrentPage('main-home')} onNavigateToBookDetail={(bookId: string, bookTitle: string) => navigateTo('book-detail')} />;
      case 'book-detail':
        return <BookDetailDemo onBack={goBack} onNavigateToDirector={() => navigateTo('director')} />;
      case 'ui-style-list':
        return (
          <UIStyleListScreen
            onSelectStyle={(style) => setCurrentPage(style)}
            onBack={() => setCurrentPage('card-demo')}
          />
        );
      case 'side-scroller-game':
        return <SideScrollerGameStyle onBack={() => setCurrentPage('ui-style-list')} />;
      case 'pixel-block':
        return <PixelBlockStyle onBack={() => setCurrentPage('ui-style-list')} />;
      case 'movie-film':
        return <MovieFilmStyle onBack={() => setCurrentPage('ui-style-list')} />;
      case 'hand-drawn':
        return <HandDrawnStyle onBack={() => setCurrentPage('ui-style-list')} />;
      default:
        return (
          <GameBoard
            onNavigateToDirector={() => navigateTo('director')}
            onNavigateToUIStyles={() => setCurrentPage('ui-style-list')}
            onNavigateToBookDetail={() => navigateTo('book-detail')}
            onNavigateToBookshelf={() => navigateTo('bookshelf')}
            onNavigateToHome={() => setCurrentPage('main-home')}
          />
        );
    }
  };

  return (
    <GameProvider>
      <StyleProvider>{renderPage()}</StyleProvider>
    </GameProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  opponentSection: {
    padding: 10,
  },
  playerSection: {
    padding: 10,
  },
  playerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  centerSection: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  turnText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  turnNumber: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  hintText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 5,
  },
  heroContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  heroAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8B4513',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIcon: {
    fontSize: 28,
  },
  healthBadge: {
    position: 'absolute',
    bottom: -5,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  healthText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  heroName: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  manaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  manaCrystal: {
    width: 10,
    height: 14,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  minionField: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    minHeight: 80,
  },
  minion: {
    width: 60,
    height: 75,
    borderWidth: 2,
    marginHorizontal: 3,
    padding: 3,
    alignItems: 'center',
  },
  minionSelected: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  minionTargetable: {
    shadowColor: '#F44336',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  minionGlow: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 10,
  },
  minionImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minionIcon: {
    fontSize: 22,
  },
  minionName: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  minionStats: {
    flexDirection: 'row',
  },
  statBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  healthStat: {
    backgroundColor: '#F44336',
  },
  statText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#fff',
  },
  handArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    minHeight: 100,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    padding: 4,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 9,
    fontWeight: 'bold',
    flex: 1,
  },
  cardCost: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCostText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 24,
  },
  cardDesc: {
    fontSize: 7,
    textAlign: 'center',
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  deckArea: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  deck: {
    width: 40,
    height: 55,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckCount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  styleBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8B4513',
    borderWidth: 3,
    borderColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  btnIcon: {
    fontSize: 28,
  },
  btnText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  endTurnBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#fff',
    marginHorizontal: 10,
  },
  endTurnBtnDisabled: {
    backgroundColor: '#888',
  },
  endTurnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  draggingCard: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    zIndex: 9999,
  },
  messageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  messageBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  messageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  glowRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 20,
    borderWidth: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  styleScroll: {
    marginBottom: 20,
  },
  styleItem: {
    width: 80,
    height: 100,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 2,
    padding: 5,
    alignItems: 'center',
    backgroundColor: '#2a2a3a',
  },
  styleItemSelected: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  stylePreview: {
    width: 60,
    height: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stylePreviewInner: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  styleName: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 5,
  },
  animItem: {
    width: 70,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a3a',
  },
  animItemSelected: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  animIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  animName: {
    fontSize: 10,
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  styleIndicator: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  styleIndicatorText: {
    fontSize: 10,
    opacity: 0.7,
  },
});

export default App;
