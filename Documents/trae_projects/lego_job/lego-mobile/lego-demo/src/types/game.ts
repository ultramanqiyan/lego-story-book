export enum CardType {
  MINION = 'MINION',
  SPELL = 'SPELL',
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  attack?: number;
  health?: number;
  description: string;
}

export interface Minion {
  id: string;
  cardId: string;
  name: string;
  attack: number;
  health: number;
  maxHealth: number;
  canAttack: boolean;
  position: number;
}

export interface Hero {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
}

export interface Player {
  id: string;
  hero: Hero;
  mana: number;
  maxMana: number;
  hand: Card[];
  minions: Minion[];
  deckCount: number;
}

export interface GameState {
  player: Player;
  opponent: Player;
  currentTurn: 'player' | 'opponent';
  turnNumber: number;
  phase: 'IDLE' | 'SELECTING_ATTACKER' | 'SELECTING_TARGET';
  selectedMinionId: string | null;
  gameOver: boolean;
  winner?: 'player' | 'opponent';
}

export interface Position {
  x: number;
  y: number;
}

export interface DragState {
  isDragging: boolean;
  cardId: string | null;
  position: Position;
}

export type GameAction =
  | { type: 'PLAY_CARD'; payload: { cardId: string; targetPosition?: number } }
  | { type: 'ATTACK_MINION'; payload: { attackerId: string; targetId: string } }
  | { type: 'ATTACK_HERO'; payload: { attackerId: string } }
  | { type: 'END_TURN' }
  | { type: 'SELECT_MINION'; payload: { minionId: string | null } }
  | { type: 'SET_PHASE'; payload: { phase: GameState['phase'] } }
  | { type: 'RESET_GAME' };
