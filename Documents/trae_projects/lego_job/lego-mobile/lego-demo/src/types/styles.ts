export enum CardStyleType {
  CLASSIC = 'CLASSIC',
  DARK = 'DARK',
  CYBERPUNK = 'CYBERPUNK',
  INK_WASH = 'INK_WASH',
  CARTOON = 'CARTOON',
  METALLIC = 'METALLIC',
  CRYSTAL = 'CRYSTAL',
  FLAME = 'FLAME',
  FROST = 'FROST',
  NATURE = 'NATURE',
}

export enum AnimationType {
  BOUNCE = 'BOUNCE',
  FLIP = 'FLIP',
  SLIDE = 'SLIDE',
  SPIN = 'SPIN',
  FADE_BLINK = 'FADE_BLINK',
  PULSE = 'PULSE',
  SHAKE = 'SHAKE',
  WAVE = 'WAVE',
  PARTICLE_BURST = 'PARTICLE_BURST',
  GLOW_RING = 'GLOW_RING',
}

export interface CardStyle {
  type: CardStyleType;
  name: string;
  nameEn: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    border: string;
    text: string;
    glow?: string;
    minionBg?: string;
  };
  borderRadius: number;
  borderWidth: number;
  shadowConfig: {
    color: string;
    offset: { width: number; height: number };
    opacity: number;
    radius: number;
  };
  gradient?: string[];
  pattern?: 'none' | 'stripes' | 'dots' | 'grid' | 'circuit';
}

export interface AnimationConfig {
  type: AnimationType;
  name: string;
  nameEn: string;
  duration: number;
  delay?: number;
  repeat?: boolean;
  intensity?: number;
}

export const CARD_STYLES: Record<CardStyleType, CardStyle> = {
  [CardStyleType.CLASSIC]: {
    type: CardStyleType.CLASSIC,
    name: '经典',
    nameEn: 'Classic',
    colors: {
      primary: '#2a2a3a',
      secondary: '#3a3a4a',
      accent: '#ffd700',
      background: '#1a1a2e',
      border: '#8b7355',
      text: '#ffffff',
      glow: '#ffd700',
    },
    borderRadius: 8,
    borderWidth: 2,
    shadowConfig: {
      color: '#000',
      offset: { width: 0, height: 4 },
      opacity: 0.5,
      radius: 8,
    },
    pattern: 'none',
  },
  [CardStyleType.DARK]: {
    type: CardStyleType.DARK,
    name: '暗黑',
    nameEn: 'Dark',
    colors: {
      primary: '#0a0a0a',
      secondary: '#1a1a1a',
      accent: '#8b0000',
      background: '#050505',
      border: '#333333',
      text: '#cccccc',
      glow: '#ff0000',
    },
    borderRadius: 4,
    borderWidth: 1,
    shadowConfig: {
      color: '#ff0000',
      offset: { width: 0, height: 0 },
      opacity: 0.3,
      radius: 15,
    },
    pattern: 'stripes',
  },
  [CardStyleType.CYBERPUNK]: {
    type: CardStyleType.CYBERPUNK,
    name: '赛博朋克',
    nameEn: 'Cyberpunk',
    colors: {
      primary: '#1a0a2e',
      secondary: '#2d1b4e',
      accent: '#00ffff',
      background: '#0d001a',
      border: '#ff00ff',
      text: '#00ffff',
      glow: '#ff00ff',
    },
    borderRadius: 0,
    borderWidth: 2,
    shadowConfig: {
      color: '#ff00ff',
      offset: { width: 0, height: 0 },
      opacity: 0.8,
      radius: 20,
    },
    pattern: 'circuit',
  },
  [CardStyleType.INK_WASH]: {
    type: CardStyleType.INK_WASH,
    name: '水墨',
    nameEn: 'Ink Wash',
    colors: {
      primary: '#f5f5f0',
      secondary: '#e8e8e0',
      accent: '#2c2c2c',
      background: '#fafaf5',
      border: '#4a4a4a',
      text: '#1a1a1a',
      glow: '#666666',
    },
    borderRadius: 2,
    borderWidth: 1,
    shadowConfig: {
      color: '#000',
      offset: { width: 2, height: 2 },
      opacity: 0.2,
      radius: 4,
    },
    pattern: 'none',
  },
  [CardStyleType.CARTOON]: {
    type: CardStyleType.CARTOON,
    name: '卡通',
    nameEn: 'Cartoon',
    colors: {
      primary: '#ffeb3b',
      secondary: '#fff176',
      accent: '#ff5722',
      background: '#fff9c4',
      border: '#000000',
      text: '#333333',
      glow: '#ff9800',
    },
    borderRadius: 16,
    borderWidth: 3,
    shadowConfig: {
      color: '#000',
      offset: { width: 3, height: 3 },
      opacity: 0.3,
      radius: 0,
    },
    pattern: 'dots',
  },
  [CardStyleType.METALLIC]: {
    type: CardStyleType.METALLIC,
    name: '金属',
    nameEn: 'Metallic',
    colors: {
      primary: '#4a4a4a',
      secondary: '#6a6a6a',
      accent: '#c0c0c0',
      background: '#2a2a2a',
      border: '#808080',
      text: '#e0e0e0',
      glow: '#ffffff',
    },
    borderRadius: 6,
    borderWidth: 2,
    shadowConfig: {
      color: '#fff',
      offset: { width: 0, height: 2 },
      opacity: 0.2,
      radius: 10,
    },
    gradient: ['#808080', '#c0c0c0', '#808080', '#404040'],
    pattern: 'none',
  },
  [CardStyleType.CRYSTAL]: {
    type: CardStyleType.CRYSTAL,
    name: '水晶',
    nameEn: 'Crystal',
    colors: {
      primary: 'rgba(100, 200, 255, 0.3)',
      secondary: 'rgba(150, 220, 255, 0.4)',
      accent: '#00bfff',
      background: 'rgba(50, 150, 200, 0.2)',
      border: 'rgba(200, 240, 255, 0.8)',
      text: '#ffffff',
      glow: '#00ffff',
    },
    borderRadius: 12,
    borderWidth: 1,
    shadowConfig: {
      color: '#00ffff',
      offset: { width: 0, height: 0 },
      opacity: 0.6,
      radius: 15,
    },
    pattern: 'grid',
  },
  [CardStyleType.FLAME]: {
    type: CardStyleType.FLAME,
    name: '火焰',
    nameEn: 'Flame',
    colors: {
      primary: '#4a1a00',
      secondary: '#6a2a00',
      accent: '#ff6600',
      background: '#2a0a00',
      border: '#ff4400',
      text: '#ffcc00',
      glow: '#ff3300',
    },
    borderRadius: 8,
    borderWidth: 2,
    shadowConfig: {
      color: '#ff3300',
      offset: { width: 0, height: 0 },
      opacity: 0.7,
      radius: 20,
    },
    pattern: 'none',
  },
  [CardStyleType.FROST]: {
    type: CardStyleType.FROST,
    name: '冰霜',
    nameEn: 'Frost',
    colors: {
      primary: '#1a3a5a',
      secondary: '#2a5a8a',
      accent: '#87ceeb',
      background: '#0a1a2a',
      border: '#4a9aca',
      text: '#e0f0ff',
      glow: '#00bfff',
    },
    borderRadius: 10,
    borderWidth: 2,
    shadowConfig: {
      color: '#00bfff',
      offset: { width: 0, height: 0 },
      opacity: 0.5,
      radius: 15,
    },
    pattern: 'grid',
  },
  [CardStyleType.NATURE]: {
    type: CardStyleType.NATURE,
    name: '自然',
    nameEn: 'Nature',
    colors: {
      primary: '#2d5a1e',
      secondary: '#4a7a2e',
      accent: '#90ee90',
      background: '#1a3a0a',
      border: '#228b22',
      text: '#e0ffe0',
      glow: '#32cd32',
    },
    borderRadius: 12,
    borderWidth: 2,
    shadowConfig: {
      color: '#228b22',
      offset: { width: 0, height: 4 },
      opacity: 0.4,
      radius: 10,
    },
    pattern: 'none',
  },
};

export const ANIMATION_CONFIGS: Record<AnimationType, AnimationConfig> = {
  [AnimationType.BOUNCE]: {
    type: AnimationType.BOUNCE,
    name: '弹跳进入',
    nameEn: 'Bounce',
    duration: 600,
    repeat: false,
    intensity: 1,
  },
  [AnimationType.FLIP]: {
    type: AnimationType.FLIP,
    name: '翻转进入',
    nameEn: 'Flip',
    duration: 800,
    repeat: false,
    intensity: 1,
  },
  [AnimationType.SLIDE]: {
    type: AnimationType.SLIDE,
    name: '滑入效果',
    nameEn: 'Slide',
    duration: 400,
    repeat: false,
    intensity: 1,
  },
  [AnimationType.SPIN]: {
    type: AnimationType.SPIN,
    name: '旋转进入',
    nameEn: 'Spin',
    duration: 700,
    repeat: false,
    intensity: 1,
  },
  [AnimationType.FADE_BLINK]: {
    type: AnimationType.FADE_BLINK,
    name: '渐变闪烁',
    nameEn: 'Fade Blink',
    duration: 1000,
    repeat: true,
    intensity: 0.5,
  },
  [AnimationType.PULSE]: {
    type: AnimationType.PULSE,
    name: '脉冲效果',
    nameEn: 'Pulse',
    duration: 1200,
    repeat: true,
    intensity: 0.15,
  },
  [AnimationType.SHAKE]: {
    type: AnimationType.SHAKE,
    name: '摇晃效果',
    nameEn: 'Shake',
    duration: 500,
    repeat: true,
    intensity: 5,
  },
  [AnimationType.WAVE]: {
    type: AnimationType.WAVE,
    name: '波浪效果',
    nameEn: 'Wave',
    duration: 2000,
    repeat: true,
    intensity: 10,
  },
  [AnimationType.PARTICLE_BURST]: {
    type: AnimationType.PARTICLE_BURST,
    name: '粒子爆发',
    nameEn: 'Particle Burst',
    duration: 1000,
    repeat: false,
    intensity: 12,
  },
  [AnimationType.GLOW_RING]: {
    type: AnimationType.GLOW_RING,
    name: '光环效果',
    nameEn: 'Glow Ring',
    duration: 1500,
    repeat: true,
    intensity: 1,
  },
};
