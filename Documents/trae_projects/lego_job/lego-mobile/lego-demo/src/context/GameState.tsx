import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { 
  GameState, 
  GameAction, 
  Card, 
  Minion, 
  Hero,
  Player,
  CardType,
  GameContextType 
} from '../types';
import { logger } from '../utils/Logger';

const createInitialHero = (name: string, id: string): Hero => ({
  id,
  name,
  health: 30,
  maxHealth: 30,
  armor: 0,
  attack: 0,
  canAttack: false,
});

const createInitialPlayer = (id: string, name: string): Player => ({
  id,
  hero: createInitialHero(name, id),
  mana: { current: 1, max: 1, used: 0 },
  hand: [],
  deck: [],
  graveyard: [],
  minions: [],
});

const createSampleCards = (): Card[] => {
  return [
    {
      id: 'card_1',
      name: '小精灵',
      type: CardType.MINION,
      cost: 1,
      attack: 1,
      health: 1,
      description: '一个可爱的小精灵',
      rarity: 'COMMON' as any,
    },
    {
      id: 'card_2',
      name: '战士',
      type: CardType.MINION,
      cost: 2,
      attack: 2,
      health: 3,
      description: '勇敢的战士',
      rarity: 'COMMON' as any,
    },
    {
      id: 'card_3',
      name: '火球术',
      type: CardType.SPELL,
      cost: 3,
      description: '造成6点伤害',
      rarity: 'RARE' as any,
    },
    {
      id: 'card_4',
      name: '铁甲卫士',
      type: CardType.MINION,
      cost: 4,
      attack: 3,
      health: 5,
      description: '嘲讽。坚固的铁甲保护着它。',
      rarity: 'RARE' as any,
    },
    {
      id: 'card_5',
      name: '龙骑士',
      type: CardType.MINION,
      cost: 5,
      attack: 5,
      health: 5,
      description: '骑着龙的勇敢骑士',
      rarity: 'EPIC' as any,
    },
  ];
};

const createInitialState = (): GameState => {
  const sampleCards = createSampleCards();
  
  return {
    player: {
      ...createInitialPlayer('player_1', '玩家'),
      hand: sampleCards.slice(0, 3),
      deck: sampleCards.slice(3),
    },
    opponent: {
      ...createInitialPlayer('opponent_1', '对手'),
      hand: sampleCards.slice(0, 2),
      deck: sampleCards.slice(2),
    },
    currentTurn: 'player',
    turnNumber: 1,
    gameOver: false,
  };
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  logger.logGameAction(action.type, action.payload);

  switch (action.type) {
    case 'PLAY_CARD': {
      const { cardId, targetPosition } = action.payload;
      const card = state.player.hand.find(c => c.id === cardId);
      
      if (!card || card.cost > state.player.mana.current) {
        logger.warn('无法打出卡牌', { cardId, reason: '法力不足或卡牌不存在' });
        return state;
      }

      if (card.type === CardType.MINION) {
        const newMinion: Minion = {
          id: `minion_${Date.now()}`,
          cardId: card.id,
          name: card.name,
          attack: card.attack || 0,
          health: card.health || 0,
          maxHealth: card.health || 0,
          canAttack: false,
          hasTaunt: false,
          hasDivineShield: false,
          position: targetPosition || state.player.minions.length,
        };

        logger.info('召唤随从', { minionName: newMinion.name, position: newMinion.position });

        return {
          ...state,
          player: {
            ...state.player,
            hand: state.player.hand.filter(c => c.id !== cardId),
            minions: [...state.player.minions, newMinion],
            mana: {
              ...state.player.mana,
              current: state.player.mana.current - card.cost,
              used: state.player.mana.used + card.cost,
            },
          },
        };
      }

      return {
        ...state,
        player: {
          ...state.player,
          hand: state.player.hand.filter(c => c.id !== cardId),
          mana: {
            ...state.player.mana,
            current: state.player.mana.current - card.cost,
            used: state.player.mana.used + card.cost,
          },
        },
      };
    }

    case 'ATTACK_MINION': {
      const { attackerId, targetId } = action.payload;
      
      const attacker = state.player.minions.find(m => m.id === attackerId);
      const target = state.opponent.minions.find(m => m.id === targetId);
      
      if (!attacker || !target || !attacker.canAttack) {
        logger.warn('攻击失败', { attackerId, targetId, reason: '攻击者或目标不存在，或攻击者无法攻击' });
        return state;
      }

      logger.info('随从攻击', { 
        attackerName: attacker.name, 
        targetName: target.name,
        attackDamage: attacker.attack 
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
      };
    }

    case 'ATTACK_HERO': {
      const { attackerId } = action.payload;
      
      const attacker = state.player.minions.find(m => m.id === attackerId);
      
      if (!attacker || !attacker.canAttack) {
        logger.warn('攻击英雄失败', { attackerId, reason: '攻击者不存在或无法攻击' });
        return state;
      }

      logger.info('攻击英雄', { 
        attackerName: attacker.name, 
        targetHero: state.opponent.hero.name,
        damage: attacker.attack 
      });

      const newOpponentHealth = state.opponent.hero.health - attacker.attack;
      
      if (newOpponentHealth <= 0) {
        logger.info('游戏结束，玩家获胜！');
        return {
          ...state,
          opponent: {
            ...state.opponent,
            hero: { ...state.opponent.hero, health: 0 },
          },
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
      };
    }

    case 'END_TURN': {
      logger.info('回合结束', { turnNumber: state.turnNumber });
      
      const newTurnNumber = state.turnNumber + 1;
      const isPlayerTurn = state.currentTurn === 'opponent';
      
      let newPlayerMana = state.player.mana;
      if (isPlayerTurn) {
        const newMax = Math.min(10, state.player.mana.max + 1);
        newPlayerMana = {
          current: newMax,
          max: newMax,
          used: 0,
        };
      }

      return {
        ...state,
        currentTurn: isPlayerTurn ? 'player' : 'opponent',
        turnNumber: newTurnNumber,
        player: {
          ...state.player,
          mana: newPlayerMana,
          minions: state.player.minions.map(m => ({ ...m, canAttack: true })),
        },
      };
    }

    case 'USE_HERO_POWER': {
      logger.info('使用英雄技能');
      return state;
    }

    case 'DRAW_CARD': {
      const { count = 1 } = action.payload;
      const drawnCards = state.player.deck.slice(0, count);
      
      if (drawnCards.length === 0) {
        logger.warn('牌库为空，无法抽牌');
        return state;
      }

      logger.info('抽牌', { count: drawnCards.length, cards: drawnCards.map(c => c.name) });

      return {
        ...state,
        player: {
          ...state.player,
          hand: [...state.player.hand, ...drawnCards],
          deck: state.player.deck.slice(count),
        },
      };
    }

    case 'RESET_GAME': {
      logger.info('游戏重置');
      return createInitialState();
    }

    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  const playCard = (cardId: string, targetPosition?: number) => {
    logger.logUserInteraction('打出卡牌', { cardId, targetPosition });
    dispatch({ type: 'PLAY_CARD', payload: { cardId, targetPosition }, timestamp: Date.now() });
  };

  const attackMinion = (attackerId: string, targetId: string) => {
    logger.logUserInteraction('攻击随从', { attackerId, targetId });
    dispatch({ type: 'ATTACK_MINION', payload: { attackerId, targetId }, timestamp: Date.now() });
  };

  const attackHero = (attackerId: string) => {
    logger.logUserInteraction('攻击英雄', { attackerId });
    dispatch({ type: 'ATTACK_HERO', payload: { attackerId }, timestamp: Date.now() });
  };

  const endTurn = () => {
    logger.logUserInteraction('结束回合');
    dispatch({ type: 'END_TURN', payload: {}, timestamp: Date.now() });
  };

  const useHeroPower = () => {
    logger.logUserInteraction('使用英雄技能');
    dispatch({ type: 'USE_HERO_POWER', payload: {}, timestamp: Date.now() });
  };

  const value: GameContextType = {
    state,
    dispatch,
    playCard,
    attackMinion,
    attackHero,
    endTurn,
    useHeroPower,
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
