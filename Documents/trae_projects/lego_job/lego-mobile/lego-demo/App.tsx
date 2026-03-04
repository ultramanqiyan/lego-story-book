import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Dimensions,
  PanResponder,
} from 'react-native';

const { width, height } = Dimensions.get('window');

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
};

interface Card {
  id: string;
  name: string;
  type: 'MINION' | 'SPELL';
  cost: number;
  attack?: number;
  health?: number;
  description: string;
}

interface Minion {
  id: string;
  name: string;
  attack: number;
  health: number;
  maxHealth: number;
  canAttack: boolean;
}

interface Hero {
  name: string;
  health: number;
  maxHealth: number;
}

interface GameState {
  playerHero: Hero;
  opponentHero: Hero;
  playerMana: number;
  opponentMana: number;
  maxMana: number;
  playerHand: Card[];
  opponentHand: Card[];
  playerMinions: Minion[];
  opponentMinions: Minion[];
  playerDeck: number;
  opponentDeck: number;
  currentTurn: 'player' | 'opponent';
  turnNumber: number;
}

const initialState: GameState = {
  playerHero: { name: '玩家', health: 30, maxHealth: 30 },
  opponentHero: { name: '对手', health: 30, maxHealth: 30 },
  playerMana: 3,
  opponentMana: 4,
  maxMana: 10,
  playerHand: [
    { id: '1', name: '小精灵', type: 'MINION', cost: 1, attack: 1, health: 1, description: '可爱的小精灵' },
    { id: '2', name: '火球术', type: 'SPELL', cost: 3, description: '造成6点伤害' },
    { id: '3', name: '战士', type: 'MINION', cost: 2, attack: 2, health: 3, description: '勇敢的战士' },
  ],
  opponentHand: [
    { id: '4', name: '未知卡牌', type: 'MINION', cost: 2, attack: 2, health: 2, description: '?' },
    { id: '5', name: '未知卡牌', type: 'MINION', cost: 3, attack: 3, health: 3, description: '?' },
  ],
  playerMinions: [
    { id: 'm1', name: '小精灵', attack: 1, health: 1, maxHealth: 1, canAttack: true },
    { id: 'm2', name: '龙骑士', attack: 5, health: 5, maxHealth: 5, canAttack: true },
  ],
  opponentMinions: [
    { id: 'm3', name: '战士', attack: 2, health: 3, maxHealth: 3, canAttack: false },
    { id: 'm4', name: '铁甲卫士', attack: 3, health: 5, maxHealth: 5, canAttack: false },
  ],
  playerDeck: 5,
  opponentDeck: 10,
  currentTurn: 'player',
  turnNumber: 3,
};

const CARD_WIDTH = 70;
const CARD_HEIGHT = 100;
const DROP_ZONE_Y = 400;

interface DraggableCardProps {
  card: Card;
  index: number;
  isPlayable: boolean;
  isDragging: boolean;
  onDragStart: (card: Card) => void;
  onDragMove: (x: number, y: number) => void;
  onDragEnd: (card: Card, y: number) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  index,
  isPlayable,
  isDragging,
  onDragStart,
  onDragMove,
  onDragEnd,
}) => {
  const panResponder = React.useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        onDragStart(card);
      },
      onPanResponderMove: (evt) => {
        onDragMove(evt.nativeEvent.pageX, evt.nativeEvent.pageY);
      },
      onPanResponderRelease: (evt) => {
        onDragEnd(card, evt.nativeEvent.pageY);
      },
      onPanResponderTerminate: () => {
        onDragEnd(card, 1000);
      },
    }),
    [card.id]
  );

  return (
    <View
      style={[
        styles.cardWrapper,
        { 
          marginLeft: index === 0 ? 0 : -20,
          zIndex: isDragging ? 1000 : index + 100,
          opacity: isDragging ? 0.3 : 1,
        }
      ]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.card, isPlayable && styles.cardPlayable]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName}>{card.name}</Text>
          <View style={styles.cardCost}>
            <Text style={styles.cardCostText}>{card.cost}</Text>
          </View>
        </View>
        <View style={styles.cardImage}>
          <Text style={styles.cardIcon}>{card.type === 'MINION' ? '⚔️' : '✨'}</Text>
        </View>
        <Text style={styles.cardDesc}>{card.description}</Text>
        {card.type === 'MINION' && (
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
    </View>
  );
};

const App: React.FC = () => {
  const [state, setState] = React.useState<GameState>(initialState);
  const [message, setMessage] = React.useState<string>('');
  const [draggingCard, setDraggingCard] = React.useState<Card | null>(null);
  const [dragY, setDragY] = React.useState(0);
  const [dragX, setDragX] = React.useState(0);

  const handlePlayCard = (card: Card) => {
    const logMsg = `打出卡牌: ${card.name} (费用: ${card.cost})`;
    console.log(logMsg);
    setMessage(logMsg);
    
    if (card.cost > state.playerMana) {
      setMessage(`法力不足! 需要 ${card.cost} 法力，当前只有 ${state.playerMana} 法力`);
      return;
    }
    
    setState(prev => ({
      ...prev,
      playerMana: prev.playerMana - card.cost,
      playerHand: prev.playerHand.filter(c => c.id !== card.id),
      playerMinions: card.type === 'MINION' 
        ? [...prev.playerMinions, { 
            id: `summoned_${Date.now()}`, 
            name: card.name, 
            attack: card.attack || 0, 
            health: card.health || 0, 
            maxHealth: card.health || 0,
            canAttack: false 
          }]
        : prev.playerMinions,
    }));
  };

  const handleSelectMinion = (minion: Minion) => {
    const logMsg = `点击随从: ${minion.name}`;
    console.log(logMsg);
    setMessage(logMsg);
  };

  const handleEndTurn = () => {
    const logMsg = '点击结束回合按钮';
    console.log(logMsg);
    setMessage(logMsg);
    const newMaxMana = Math.min(10, state.maxMana + 1);
    setState(prev => ({
      ...prev,
      currentTurn: prev.currentTurn === 'player' ? 'opponent' : 'player',
      turnNumber: prev.turnNumber + 1,
      maxMana: newMaxMana,
      playerMana: newMaxMana,
      playerMinions: prev.playerMinions.map(m => ({ ...m, canAttack: true })),
    }));
  };

  const handleDragStart = (card: Card) => {
    setDraggingCard(card);
  };

  const handleDragMove = (x: number, y: number) => {
    setDragX(x);
    setDragY(y);
  };

  const handleDragEnd = (card: Card, y: number) => {
    if (y < DROP_ZONE_Y) {
      handlePlayCard(card);
    }
    setDraggingCard(null);
    setDragX(0);
    setDragY(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameContainer}>
        <View style={styles.opponentSection}>
          <View style={styles.playerInfoRow}>
            <View style={styles.heroContainer}>
              <View style={styles.heroAvatar}>
                <Text style={styles.heroIcon}>👹</Text>
              </View>
              <View style={[styles.healthBadge, { backgroundColor: COLORS.red }]}>
                <Text style={styles.healthText}>{state.opponentHero.health}</Text>
              </View>
              <Text style={styles.heroName}>{state.opponentHero.name}</Text>
            </View>
            <View style={styles.manaContainer}>
              {Array.from({ length: state.maxMana }).map((_, i) => (
                <View key={i} style={[styles.manaCrystal, i < state.opponentMana ? styles.manaFull : styles.manaEmpty]} />
              ))}
              <Text style={styles.manaText}>{state.opponentMana}/{state.maxMana}</Text>
            </View>
            <View style={styles.deckArea}>
              <View style={styles.deck}>
                <Text style={styles.deckCount}>{state.opponentDeck}</Text>
              </View>
            </View>
          </View>
          <View style={styles.minionField}>
            {state.opponentMinions.map(m => (
              <TouchableOpacity 
                key={m.id} 
                style={styles.minion} 
                onPress={() => handleSelectMinion(m)}
                activeOpacity={0.8}
              >
                <View style={styles.minionImage}>
                  <Text style={styles.minionIcon}>👹</Text>
                </View>
                <Text style={styles.minionName}>{m.name}</Text>
                <View style={styles.minionStats}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statText}>{m.attack}</Text>
                  </View>
                  <View style={[styles.statBadge, styles.healthStat]}>
                    <Text style={styles.statText}>{m.health}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.turnText}>
            {state.currentTurn === 'player' ? '你的回合' : '对手回合'}
          </Text>
          <Text style={styles.turnNumber}>第 {state.turnNumber} 回合</Text>
          <Text style={styles.hintText}>拖拽卡牌到上方打出</Text>
        </View>

        <View style={styles.playerSection}>
          <View style={styles.minionField}>
            {state.playerMinions.map(m => (
              <TouchableOpacity 
                key={m.id} 
                style={[styles.minion, m.canAttack && styles.minionCanAttack]} 
                onPress={() => handleSelectMinion(m)}
                activeOpacity={0.8}
              >
                <View style={styles.minionImage}>
                  <Text style={styles.minionIcon}>👹</Text>
                </View>
                <Text style={styles.minionName}>{m.name}</Text>
                <View style={styles.minionStats}>
                  <View style={styles.statBadge}>
                    <Text style={styles.statText}>{m.attack}</Text>
                  </View>
                  <View style={[styles.statBadge, styles.healthStat]}>
                    <Text style={styles.statText}>{m.health}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.playerInfoRow}>
            <View style={styles.heroContainer}>
              <View style={styles.heroAvatar}>
                <Text style={styles.heroIcon}>👑</Text>
              </View>
              <View style={[styles.healthBadge, { backgroundColor: COLORS.green }]}>
                <Text style={styles.healthText}>{state.playerHero.health}</Text>
              </View>
              <Text style={styles.heroName}>{state.playerHero.name}</Text>
            </View>
            <View style={styles.manaContainer}>
              {Array.from({ length: state.maxMana }).map((_, i) => (
                <View key={i} style={[styles.manaCrystal, i < state.playerMana ? styles.manaFull : styles.manaEmpty]} />
              ))}
              <Text style={styles.manaText}>{state.playerMana}/{state.maxMana}</Text>
            </View>
            <View style={styles.deckArea}>
              <View style={styles.deck}>
                <Text style={styles.deckCount}>{state.playerDeck}</Text>
              </View>
            </View>
          </View>
          <View style={styles.handArea}>
            {state.playerHand.map((card, i) => (
              <DraggableCard
                key={card.id}
                card={card}
                index={i}
                isPlayable={card.cost <= state.playerMana}
                isDragging={draggingCard?.id === card.id}
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
            <TouchableOpacity style={styles.endTurnBtn} onPress={handleEndTurn} activeOpacity={0.8}>
              <Text style={styles.endTurnText}>结束回合</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {draggingCard && (
        <View
          style={[
            styles.draggingCard,
            {
              left: dragX - CARD_WIDTH / 2,
              top: dragY - CARD_HEIGHT / 2,
            }
          ]}
          pointerEvents="none"
        >
          <View style={[styles.card, styles.cardPlayable, styles.cardDraggingStyle]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{draggingCard.name}</Text>
              <View style={styles.cardCost}>
                <Text style={styles.cardCostText}>{draggingCard.cost}</Text>
              </View>
            </View>
            <View style={styles.cardImage}>
              <Text style={styles.cardIcon}>{draggingCard.type === 'MINION' ? '⚔️' : '✨'}</Text>
            </View>
            <Text style={styles.cardDesc}>{draggingCard.description}</Text>
            {draggingCard.type === 'MINION' && (
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
      
      {message ? (
        <View style={styles.messageOverlay}>
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        </View>
      ) : null}
    </SafeAreaView>
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
  minionCanAttack: {
    borderColor: COLORS.green,
    shadowColor: COLORS.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
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
  cardDraggingStyle: {
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
  endTurnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
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
    pointerEvents: 'none',
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
  draggingCard: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    zIndex: 9999,
  },
});

export default App;
