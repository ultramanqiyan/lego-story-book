import React from 'react';
import { View, StyleSheet, Text, Modal, Pressable, ScrollView, SafeAreaView } from 'react-native';
import Battlefield from './src/components/Battlefield';
import PlayerInfo from './src/components/PlayerInfo';
import HandCards from './src/components/HandCards';
import MinionField from './src/components/MinionField';
import DeckArea from './src/components/DeckArea';
import ActionButtons from './src/components/ActionButtons';
import { GameProvider, useGame } from './src/context/GameState';
import { logger } from './src/utils/Logger';
import { Card, Minion as MinionType } from './src/types';

const GameScreen: React.FC = () => {
  const { state, playCard, attackMinion, attackHero, endTurn, useHeroPower } = useGame();
  const [selectedCard, setSelectedCard] = React.useState<Card | null>(null);
  const [selectedMinion, setSelectedMinion] = React.useState<MinionType | null>(null);

  const handleCardPlay = (card: Card, position?: { x: number; y: number }) => {
    if (card.cost <= state.player.mana.current) {
      playCard(card.id);
      setSelectedCard(null);
    } else {
      logger.warn('法力不足，无法打出卡牌', { cardName: card.name, cost: card.cost, currentMana: state.player.mana.current });
    }
  };

  const handleMinionSelect = (minion: MinionType) => {
    if (selectedMinion) {
      if (selectedMinion.id !== minion.id) {
        attackMinion(selectedMinion.id, minion.id);
      }
      setSelectedMinion(null);
    } else {
      setSelectedMinion(minion);
    }
  };

  const handleMinionAttack = (minionId: string) => {
    const minion = state.player.minions.find(m => m.id === minionId);
    if (minion) {
      setSelectedMinion(minion);
    }
  };

  const handleHeroAttack = () => {
    if (selectedMinion) {
      attackHero(selectedMinion.id);
      setSelectedMinion(null);
    }
  };

  const handleEndTurn = () => {
    setSelectedMinion(null);
    endTurn();
  };

  return (
    <Battlefield>
      <View style={styles.gameContainer}>
        <View style={styles.opponentSection}>
          <PlayerInfo
            player={state.opponent}
            isPlayer={false}
            onHeroAttack={handleHeroAttack}
          />
          <MinionField
            minions={state.opponent.minions}
            isPlayerField={false}
            onMinionSelect={handleMinionSelect}
          />
          <DeckArea
            deckCount={state.opponent.deck.length}
            graveyardCount={state.opponent.graveyard.length}
            isPlayer={false}
          />
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.turnIndicator}>
            {state.currentTurn === 'player' ? '你的回合' : '对手回合'}
          </Text>
          {state.gameOver && (
            <Text style={styles.gameOverText}>
              {state.winner === 'player' ? '你赢了！' : '你输了！'}
            </Text>
          )}
        </View>

        <View style={styles.playerSection}>
          <DeckArea
            deckCount={state.player.deck.length}
            graveyardCount={state.player.graveyard.length}
            isPlayer={true}
          />
          <MinionField
            minions={state.player.minions}
            isPlayerField={true}
            onMinionSelect={handleMinionSelect}
            onMinionAttack={handleMinionAttack}
          />
          <HandCards
            cards={state.player.hand}
            isPlayer={true}
            onCardPlay={handleCardPlay}
            onCardSelect={setSelectedCard}
          />
          <PlayerInfo
            player={state.player}
            isPlayer={true}
          />
          <ActionButtons
            onHeroPower={useHeroPower}
            onEndTurn={handleEndTurn}
            isPlayerTurn={state.currentTurn === 'player'}
            heroPowerAvailable={true}
            heroPowerCost={2}
            currentMana={state.player.mana.current}
          />
        </View>
      </View>

      {selectedCard && (
        <Modal
          visible={!!selectedCard}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedCard(null)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setSelectedCard(null)}
          >
            <View style={styles.cardDetail}>
              <Text style={styles.cardName}>{selectedCard.name}</Text>
              <Text style={styles.cardCost}>法力消耗: {selectedCard.cost}</Text>
              <Text style={styles.cardDescription}>{selectedCard.description}</Text>
              {selectedCard.type === 'MINION' && (
                <>
                  <Text style={styles.cardStats}>攻击力: {selectedCard.attack}</Text>
                  <Text style={styles.cardStats}>生命值: {selectedCard.health}</Text>
                </>
              )}
              <Pressable
                style={styles.closeButton}
                onPress={() => setSelectedCard(null)}
              >
                <Text style={styles.closeButtonText}>关闭</Text>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      )}
    </Battlefield>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <SafeAreaView style={styles.container}>
        <GameScreen />
      </SafeAreaView>
    </GameProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  opponentSection: {
    paddingVertical: 10,
  },
  playerSection: {
    paddingVertical: 10,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  turnIndicator: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  gameOverText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDetail: {
    backgroundColor: '#2a2a3a',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxWidth: 300,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  cardCost: {
    fontSize: 16,
    color: '#2196F3',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 10,
  },
  cardStats: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default App;
