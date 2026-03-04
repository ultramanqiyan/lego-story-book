import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { GameState, GameAction, Card, Minion, CardType } from '../types/game';
import { logger } from '../utils/GameLogger';

const createSampleCards = (): Card[] => [
  { id: 'card_1', name: '小精灵', type: CardType.MINION, cost: 1, attack: 1, health: 1, description: '可爱的小精灵' },
  { id: 'card_2', name: '战士', type: CardType.MINION, cost: 2, attack: 2, health: 3, description: '勇敢的战士' },
  { id: 'card_3', name: '火球术', type: CardType.SPELL, cost: 3, description: '造成6点伤害' },
  { id: 'card_4', name: '铁甲卫士', type: CardType.MINION, cost: 4, attack: 3, health: 5, description: '坚固的铁甲卫士' },
  { id: 'card_5', name: '龙骑士', type: CardType.MINION, cost: 5, attack: 5, health: 5, description: '骑着龙的勇敢骑士' },
];

const createInitialState = (): GameState => {
  const sampleCards = createSampleCards();
  logger.logGameState('初始化游戏状态');
  
  return {
    player: {
      id: 'player_1',
      hero: { id: 'hero_player', name: '玩家', health: 30, maxHealth: 30 },
      mana: 3,
      maxMana: 3,
      hand: sampleCards.slice(0, 3),
      minions: [
        { id: 'm1', cardId: 'card_1', name: '小精灵', attack: 1, health: 1, maxHealth: 1, canAttack: true, position: 0 },
        { id: 'm2', cardId: 'card_5', name: '龙骑士', attack: 5, health: 5, maxHealth: 5, canAttack: true, position: 1 },
      ],
      deckCount: 5,
    },
    opponent: {
      id: 'opponent_1',
      hero: { id: 'hero_opponent', name: '对手', health: 30, maxHealth: 30 },
      mana: 4,
      maxMana: 4,
      hand: sampleCards.slice(0, 2),
      minions: [
        { id: 'm3', cardId: 'card_2', name: '战士', attack: 2, health: 3, maxHealth: 3, canAttack: false, position: 0 },
        { id: 'm4', cardId: 'card_4', name: '铁甲卫士', attack: 3, health: 5, maxHealth: 5, canAttack: false, position: 1 },
      ],
      deckCount: 10,
    },
    currentTurn: 'player',
    turnNumber: 3,
    phase: 'IDLE',
    selectedMinionId: null,
    gameOver: false,
  };
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  logger.logGameState(`Action: ${action.type}`, 'payload' in action ? action.payload : undefined);

  switch (action.type) {
    case 'PLAY_CARD': {
      const { cardId, targetPosition } = action.payload;
      const card = state.player.hand.find(c => c.id === cardId);
      
      if (!card) {
        logger.warn('卡牌不存在', { cardId });
        return state;
      }
      
      if (card.cost > state.player.mana) {
        logger.warn('法力不足', { cardId, cost: card.cost, mana: state.player.mana });
        return state;
      }

      logger.info('打出卡牌', { cardName: card.name, cost: card.cost });

      if (card.type === CardType.MINION) {
        const newMinion: Minion = {
          id: `minion_${Date.now()}`,
          cardId: card.id,
          name: card.name,
          attack: card.attack || 0,
          health: card.health || 0,
          maxHealth: card.health || 0,
          canAttack: false,
          position: targetPosition ?? state.player.minions.length,
        };

        return {
          ...state,
          player: {
            ...state.player,
            hand: state.player.hand.filter(c => c.id !== cardId),
            minions: [...state.player.minions, newMinion],
            mana: state.player.mana - card.cost,
          },
        };
      }

      return {
        ...state,
        player: {
          ...state.player,
          hand: state.player.hand.filter(c => c.id !== cardId),
          mana: state.player.mana - card.cost,
        },
      };
    }

    case 'ATTACK_MINION': {
      const { attackerId, targetId } = action.payload;
      
      const attacker = state.player.minions.find(m => m.id === attackerId);
      const target = state.opponent.minions.find(m => m.id === targetId);
      
      if (!attacker || !target || !attacker.canAttack) {
        logger.warn('攻击无效', { attackerId, targetId, canAttack: attacker?.canAttack });
        return state;
      }

      logger.info('随从攻击', { 
        attacker: attacker.name, 
        target: target.name,
        damage: attacker.attack 
      });

      const newTargetHealth = target.health - attacker.attack;
      const newAttackerHealth = attacker.health - target.attack;

      let newPlayerMinions = state.player.minions.map(m => {
        if (m.id === attackerId) {
          return { ...m, health: newAttackerHealth, canAttack: false };
        }
        return m;
      });

      let newOpponentMinions = state.opponent.minions.map(m => {
        if (m.id === targetId) {
          return { ...m, health: newTargetHealth };
        }
        return m;
      });

      if (newAttackerHealth <= 0) {
        logger.info('攻击者死亡', { minionName: attacker.name });
        newPlayerMinions = newPlayerMinions.filter(m => m.id !== attackerId);
      }

      if (newTargetHealth <= 0) {
        logger.info('目标死亡', { minionName: target.name });
        newOpponentMinions = newOpponentMinions.filter(m => m.id !== targetId);
      }

      return {
        ...state,
        player: { ...state.player, minions: newPlayerMinions },
        opponent: { ...state.opponent, minions: newOpponentMinions },
        phase: 'IDLE' as const,
        selectedMinionId: null,
      };
    }

    case 'ATTACK_HERO': {
      const { attackerId } = action.payload;
      const attacker = state.player.minions.find(m => m.id === attackerId);
      
      if (!attacker || !attacker.canAttack) {
        logger.warn('攻击英雄无效', { attackerId });
        return state;
      }

      logger.info('攻击英雄', { attacker: attacker.name, damage: attacker.attack });

      const newOpponentHealth = state.opponent.hero.health - attacker.attack;
      
      if (newOpponentHealth <= 0) {
        logger.info('游戏结束，玩家获胜！');
        return {
          ...state,
          opponent: { ...state.opponent, hero: { ...state.opponent.hero, health: 0 } },
          gameOver: true,
          winner: 'player',
        };
      }

      return {
        ...state,
        player: {
          ...state.player,
          minions: state.player.minions.map(m => 
            m.id === attackerId ? { ...m, canAttack: false } : m
          ),
        },
        opponent: {
          ...state.opponent,
          hero: { ...state.opponent.hero, health: newOpponentHealth },
        },
        phase: 'IDLE' as const,
        selectedMinionId: null,
      };
    }

    case 'END_TURN': {
      logger.info('结束回合', { turnNumber: state.turnNumber });
      
      const newMaxMana = Math.min(10, state.player.maxMana + 1);
      
      return {
        ...state,
        currentTurn: state.currentTurn === 'player' ? 'opponent' : 'player',
        turnNumber: state.turnNumber + 1,
        player: {
          ...state.player,
          mana: newMaxMana,
          maxMana: newMaxMana,
          minions: state.player.minions.map(m => ({ ...m, canAttack: true })),
        },
        phase: 'IDLE' as const,
        selectedMinionId: null,
      };
    }

    case 'SELECT_MINION': {
      const { minionId } = action.payload;
      
      if (minionId === null) {
        return { ...state, selectedMinionId: null, phase: 'IDLE' as const };
      }

      const minion = state.player.minions.find(m => m.id === minionId);
      if (!minion || !minion.canAttack) {
        logger.warn('无法选择该随从', { minionId });
        return state;
      }

      logger.logInteraction('选择攻击者', { minionName: minion.name });
      
      return {
        ...state,
        selectedMinionId: minionId,
        phase: 'SELECTING_TARGET' as const,
      };
    }

    case 'SET_PHASE': {
      return { ...state, phase: action.payload.phase };
    }

    case 'RESET_GAME': {
      logger.info('重置游戏');
      return createInitialState();
    }

    default:
      return state;
  }
};

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  playCard: (cardId: string, targetPosition?: number) => void;
  attackMinion: (attackerId: string, targetId: string) => void;
  attackHero: (attackerId: string) => void;
  endTurn: () => void;
  selectMinion: (minionId: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const playCard = useCallback((cardId: string, targetPosition?: number) => {
    logger.logInteraction('打出卡牌', { cardId, targetPosition });
    dispatch({ type: 'PLAY_CARD', payload: { cardId, targetPosition } });
  }, []);

  const attackMinion = useCallback((attackerId: string, targetId: string) => {
    logger.logInteraction('攻击随从', { attackerId, targetId });
    dispatch({ type: 'ATTACK_MINION', payload: { attackerId, targetId } });
  }, []);

  const attackHero = useCallback((attackerId: string) => {
    logger.logInteraction('攻击英雄', { attackerId });
    dispatch({ type: 'ATTACK_HERO', payload: { attackerId } });
  }, []);

  const endTurn = useCallback(() => {
    logger.logInteraction('结束回合');
    dispatch({ type: 'END_TURN' });
  }, []);

  const selectMinion = useCallback((minionId: string | null) => {
    logger.logInteraction('选择随从', { minionId });
    dispatch({ type: 'SELECT_MINION', payload: { minionId } });
  }, []);

  const value: GameContextType = {
    state,
    dispatch,
    playCard,
    attackMinion,
    attackHero,
    endTurn,
    selectMinion,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;
