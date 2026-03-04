export enum CardType {
  MINION = 'MINION',
  SPELL = 'SPELL',
  WEAPON = 'WEAPON',
  HERO = 'HERO'
}

export enum CardRarity {
  COMMON = 'COMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY'
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  attack?: number;
  health?: number;
  description: string;
  imageUrl?: string;
}

export interface Minion {
  id: string;
  cardId: string;
  name: string;
  attack: number;
  health: number;
  maxHealth: number;
  canAttack: boolean;
  hasTaunt: boolean;
  hasDivineShield: boolean;
  position: number;
}

export interface Hero {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  armor: number;
  attack: number;
  canAttack: boolean;
  imageUrl?: string;
}

export interface Mana {
  current: number;
  max: number;
  used: number;
}

export interface Player {
  id: string;
  hero: Hero;
  mana: Mana;
  hand: Card[];
  deck: Card[];
  graveyard: Card[];
  minions: Minion[];
}

export interface GameState {
  player: Player;
  opponent: Player;
  currentTurn: 'player' | 'opponent';
  turnNumber: number;
  gameOver: boolean;
  winner?: 'player' | 'opponent';
}

export interface Position {
  x: number;
  y: number;
}

export interface AnimationState {
  isAnimating: boolean;
  type: 'attack' | 'summon' | 'death' | 'damage' | 'heal' | null;
  targetId?: string;
  sourceId?: string;
}

export interface DragState {
  isDragging: boolean;
  cardId: string | null;
  startPosition: Position | null;
  currentPosition: Position | null;
}

export interface GameAction {
  type: string;
  payload?: any;
  timestamp: number;
}

export interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  data?: any;
}

export interface ParticleConfig {
  count: number;
  color: string;
  size: number;
  speed: number;
  lifetime: number;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

export interface CardProps {
  card: Card;
  index: number;
  totalCards: number;
  onDragStart?: (cardId: string, position: Position) => void;
  onDragMove?: (cardId: string, position: Position) => void;
  onDragEnd?: (cardId: string, position: Position) => void;
  onLongPress?: (cardId: string) => void;
  isPlayable?: boolean;
  isDragging?: boolean;
}

export interface MinionProps {
  minion: Minion;
  isPlayerMinion: boolean;
  onAttack?: (minionId: string) => void;
  onDeath?: (minionId: string) => void;
  isSelected?: boolean;
}

export interface HeroAvatarProps {
  hero: Hero;
  isPlayer: boolean;
  onAttack?: () => void;
}

export interface HealthDisplayProps {
  health: number;
  maxHealth: number;
  armor?: number;
  isPlayer: boolean;
}

export interface ManaCrystalsProps {
  current: number;
  max: number;
  isPlayer: boolean;
}

export interface HandCardsProps {
  cards: Card[];
  isPlayer: boolean;
  onCardSelect?: (card: Card) => void;
  onCardPlay?: (card: Card, position?: Position) => void;
}

export interface MinionFieldProps {
  minions: Minion[];
  isPlayerField: boolean;
  onMinionSelect?: (minion: Minion) => void;
  onMinionAttack?: (minion: Minion, target: Minion | Hero) => void;
}

export interface DeckAreaProps {
  deckCount: number;
  graveyardCount: number;
  isPlayer: boolean;
}

export interface ActionButtonsProps {
  onHeroPower?: () => void;
  onEndTurn?: () => void;
  isPlayerTurn: boolean;
  heroPowerAvailable: boolean;
  heroPowerCost: number;
  currentMana: number;
}

export interface BattlefieldProps {
  children?: React.ReactNode;
}

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  playCard: (cardId: string, targetPosition?: number) => void;
  attackMinion: (attackerId: string, targetId: string) => void;
  attackHero: (attackerId: string) => void;
  endTurn: () => void;
  useHeroPower: () => void;
}
