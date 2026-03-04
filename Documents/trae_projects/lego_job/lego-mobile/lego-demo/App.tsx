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
  Platform,
} from 'react-native';
import { GameProvider, useGame } from './src/context/GameContext';
import { Card, Minion, CardType, GameState } from './src/types/game';
import { logger } from './src/utils/GameLogger';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = 70;
const CARD_HEIGHT = 100;
const DROP_ZONE_Y = height * 0.5;

const COLORS = {
  background: '#1a1a2e',
  gold: '#ffd700',
  blue: '#2196F3',
  green: '#4CAF50',
  red: '#F44336',
  white: '#ffffff',
  gray: '#888888',
  cardBg: '#2a2a3a',
  minionBg: '#3a3a4a',
  purple: '#9C27B0',
};

interface DraggableCardProps {
  card: Card;
  index: number;
  isPlayable: boolean;
  onDragStart: (card: Card) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: (card: Card, y: number) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  index,
  isPlayable,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const isDraggingRef = useRef(false);

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

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        {
          marginLeft: index === 0 ? 0 : -20,
          transform: [{ scale: scaleAnim }],
        },
        !isPlayable && styles.cardDisabled,
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.card, isPlayable && styles.cardPlayable]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName} numberOfLines={1}>{card.name}</Text>
          <View style={styles.cardCost}>
            <Text style={styles.cardCostText}>{card.cost}</Text>
          </View>
        </View>
        <View style={styles.cardImage}>
          <Text style={styles.cardIcon}>{getCardTypeIcon()}</Text>
        </View>
        <Text style={styles.cardDesc} numberOfLines={2}>{card.description}</Text>
        {card.type === CardType.MINION && (
          <View style={styles.cardStats}>
            <View style={styles.statBadge}>
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

interface MinionViewProps {
  minion: Minion;
  isPlayer: boolean;
  isSelected: boolean;
  isTargetable: boolean;
  onPress: () => void;
}

const MinionView: React.FC<MinionViewProps> = ({
  minion,
  isPlayer,
  isSelected,
  isTargetable,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

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
    if (minion.health < minion.maxHealth) return COLORS.red;
    if (minion.health > minion.maxHealth) return COLORS.green;
    return COLORS.white;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.minion,
          isSelected && styles.minionSelected,
          isTargetable && styles.minionTargetable,
          {
            transform: [
              { scale: scaleAnim },
              { 
                translateX: shakeAnim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-5, 0, 5],
                }),
              },
            ],
          },
        ]}
      >
        {(minion.canAttack && isPlayer) && (
          <Animated.View
            style={[
              styles.minionGlow,
              { opacity: glowAnim },
            ]}
          />
        )}
        <View style={styles.minionImage}>
          <Text style={styles.minionIcon}>👹</Text>
        </View>
        <Text style={styles.minionName} numberOfLines={1}>{minion.name}</Text>
        <View style={styles.minionStats}>
          <View style={styles.statBadge}>
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

interface HeroViewProps {
  name: string;
  health: number;
  maxHealth: number;
  isPlayer: boolean;
  isTargetable: boolean;
  onPress: () => void;
}

const HeroView: React.FC<HeroViewProps> = ({
  name,
  health,
  maxHealth,
  isPlayer,
  isTargetable,
  onPress,
}) => {
  const getHealthColor = () => {
    if (health < maxHealth * 0.3) return COLORS.red;
    if (health < maxHealth * 0.6) return COLORS.gold;
    return isPlayer ? COLORS.green : COLORS.red;
  };

  return (
    <TouchableOpacity onPress={onPress} disabled={!isTargetable}>
      <View style={styles.heroContainer}>
        <View style={[styles.heroAvatar, isTargetable && styles.heroTargetable]}>
          <Text style={styles.heroIcon}>{isPlayer ? '👑' : '👹'}</Text>
        </View>
        <View style={[styles.healthBadge, { backgroundColor: getHealthColor() }]}>
          <Text style={styles.healthText}>{health}</Text>
        </View>
        <Text style={styles.heroName}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

interface ManaViewProps {
  current: number;
  max: number;
}

const ManaView: React.FC<ManaViewProps> = ({ current, max }) => (
  <View style={styles.manaContainer}>
    {Array.from({ length: Math.min(max, 10) }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.manaCrystal,
          i < current ? styles.manaFull : styles.manaEmpty,
        ]}
      />
    ))}
    <Text style={styles.manaText}>{current}/{max}</Text>
  </View>
);

const GameBoard: React.FC = () => {
  const { state, playCard, attackMinion, attackHero, endTurn, selectMinion } = useGame();
  const [draggingCard, setDraggingCard] = useState<Card | null>(null);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState('');

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

  const isMinionTargetable = (minion: Minion) => {
    return state.phase === 'SELECTING_TARGET' && !state.player.minions.find(m => m.id === minion.id);
  };

  const isHeroTargetable = !state.player.hero.health;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameContainer}>
        {/* 对手区域 */}
        <View style={styles.opponentSection}>
          <View style={styles.playerInfoRow}>
            <HeroView
              name={state.opponent.hero.name}
              health={state.opponent.hero.health}
              maxHealth={state.opponent.hero.maxHealth}
              isPlayer={false}
              isTargetable={state.phase === 'SELECTING_TARGET'}
              onPress={() => handleHeroPress(false)}
            />
            <ManaView current={state.opponent.mana} max={state.opponent.maxMana} />
            <View style={styles.deckArea}>
              <View style={styles.deck}>
                <Text style={styles.deckCount}>{state.opponent.deckCount}</Text>
              </View>
            </View>
          </View>
          <View style={styles.minionField}>
            {state.opponent.minions.map(m => (
              <MinionView
                key={m.id}
                minion={m}
                isPlayer={false}
                isSelected={false}
                isTargetable={isMinionTargetable(m)}
                onPress={() => handleMinionPress(m, false)}
              />
            ))}
          </View>
        </View>

        {/* 中央区域 */}
        <View style={styles.centerSection}>
          <Text style={styles.turnText}>
            {state.currentTurn === 'player' ? '你的回合' : '对手回合'}
          </Text>
          <Text style={styles.turnNumber}>第 {state.turnNumber} 回合</Text>
          {state.phase === 'SELECTING_TARGET' && (
            <Text style={styles.hintText}>选择攻击目标</Text>
          )}
          {state.phase === 'IDLE' && (
            <Text style={styles.hintText}>拖拽卡牌到上方打出</Text>
          )}
        </View>

        {/* 玩家区域 */}
        <View style={styles.playerSection}>
          <View style={styles.minionField}>
            {state.player.minions.map(m => (
              <MinionView
                key={m.id}
                minion={m}
                isPlayer={true}
                isSelected={state.selectedMinionId === m.id}
                isTargetable={false}
                onPress={() => handleMinionPress(m, true)}
              />
            ))}
          </View>
          <View style={styles.playerInfoRow}>
            <HeroView
              name={state.player.hero.name}
              health={state.player.hero.health}
              maxHealth={state.player.hero.maxHealth}
              isPlayer={true}
              isTargetable={false}
              onPress={() => {}}
            />
            <ManaView current={state.player.mana} max={state.player.maxMana} />
            <View style={styles.deckArea}>
              <View style={styles.deck}>
                <Text style={styles.deckCount}>{state.player.deckCount}</Text>
              </View>
            </View>
          </View>
          <View style={styles.handArea}>
            {state.player.hand.map((card, i) => (
              <DraggableCard
                key={card.id}
                card={card}
                index={i}
                isPlayable={card.cost <= state.player.mana && state.currentTurn === 'player'}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
              />
            ))}
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.heroPowerBtn} activeOpacity={0.8}>
              <Text style={styles.btnIcon}>⭐</Text>
              <Text style={styles.btnText}>技能</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.endTurnBtn,
                state.currentTurn !== 'player' && styles.endTurnBtnDisabled,
              ]}
              onPress={handleEndTurn}
              activeOpacity={0.8}
              disabled={state.currentTurn !== 'player'}
            >
              <Text style={styles.endTurnText}>结束回合</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 拖拽中的卡牌 */}
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
          <View style={[styles.card, styles.cardPlayable, styles.cardDragging]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{draggingCard.name}</Text>
              <View style={styles.cardCost}>
                <Text style={styles.cardCostText}>{draggingCard.cost}</Text>
              </View>
            </View>
            <View style={styles.cardImage}>
              <Text style={styles.cardIcon}>
                {draggingCard.type === CardType.MINION ? '⚔️' : '✨'}
              </Text>
            </View>
            <Text style={styles.cardDesc}>{draggingCard.description}</Text>
            {draggingCard.type === CardType.MINION && (
              <View style={styles.cardStats}>
                <View style={styles.statBadge}>
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

      {/* 消息提示 */}
      {message ? (
        <View style={styles.messageOverlay} pointerEvents="none">
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        </View>
      ) : null}

      {/* 游戏结束 */}
      {state.gameOver && (
        <View style={styles.gameOverOverlay}>
          <View style={styles.gameOverBox}>
            <Text style={styles.gameOverText}>
              {state.winner === 'player' ? '🎉 胜利!' : '💔 失败!'}
            </Text>
            <TouchableOpacity
              style={styles.restartBtn}
              onPress={() => {}}
            >
              <Text style={styles.restartText}>再来一局</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.gold,
  },
  turnNumber: {
    fontSize: 14,
    color: COLORS.gray,
    marginTop: 5,
  },
  hintText: {
    fontSize: 12,
    color: COLORS.green,
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
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTargetable: {
    borderColor: COLORS.red,
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
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
    borderColor: COLORS.white,
  },
  healthText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  heroName: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.gold,
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
  manaFull: {
    backgroundColor: COLORS.blue,
  },
  manaEmpty: {
    backgroundColor: '#333',
  },
  manaText: {
    marginLeft: 5,
    fontSize: 12,
    color: COLORS.blue,
    fontWeight: 'bold',
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
    backgroundColor: COLORS.minionBg,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#666',
    marginHorizontal: 3,
    padding: 3,
    alignItems: 'center',
  },
  minionSelected: {
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  minionTargetable: {
    borderColor: COLORS.red,
    shadowColor: COLORS.red,
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
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
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
    color: COLORS.white,
    fontWeight: 'bold',
  },
  minionStats: {
    flexDirection: 'row',
  },
  statBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  healthStat: {
    backgroundColor: COLORS.red,
  },
  statText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
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
    backgroundColor: COLORS.cardBg,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
    padding: 4,
  },
  cardPlayable: {
    borderColor: COLORS.green,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  cardDragging: {
    transform: [{ scale: 1.2 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: COLORS.white,
    flex: 1,
  },
  cardCost: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCostText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
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
    color: COLORS.gray,
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
    backgroundColor: '#4a4a5a',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deckCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  heroPowerBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#8B4513',
    borderWidth: 2,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  btnIcon: {
    fontSize: 18,
  },
  btnText: {
    fontSize: 8,
    color: COLORS.white,
  },
  endTurnBtn: {
    backgroundColor: COLORS.green,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.white,
    marginHorizontal: 10,
  },
  endTurnBtnDisabled: {
    backgroundColor: COLORS.gray,
  },
  endTurnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  messageText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameOverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  gameOverBox: {
    backgroundColor: COLORS.cardBg,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 20,
  },
  restartBtn: {
    backgroundColor: COLORS.green,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  restartText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default App;
