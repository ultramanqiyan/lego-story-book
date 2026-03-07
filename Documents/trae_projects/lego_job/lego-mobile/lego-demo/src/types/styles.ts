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
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      accent: '#8B5CF6',
      background: '#F8FAFC',
      border: '#E2E8F0',
      text: '#374151',
      glow: '#8B5CF6',
    },
    borderRadius: 12,
    borderWidth: 1,
    shadowConfig: {
      color: '#64748B',
      offset: { width: 0, height: 2 },
      opacity: 0.1,
      radius: 8,
    },
    pattern: 'none',
  },
  [CardStyleType.DARK]: {
    type: CardStyleType.DARK,
    name: '暗黑',
    nameEn: 'Dark',
    colors: {
      primary: '#1E293B',
      secondary: '#334155',
      accent: '#F472B6',
      background: '#0F172A',
      border: '#475569',
      text: '#F1F5F9',
      glow: '#EC4899',
    },
    borderRadius: 8,
    borderWidth: 1,
    shadowConfig: {
      color: '#EC4899',
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
      primary: '#F5F3FF',
      secondary: '#EDE9FE',
      accent: '#06B6D4',
      background: '#FAFAFA',
      border: '#7C3AED',
      text: '#5B21B6',
      glow: '#8B5CF6',
    },
    borderRadius: 8,
    borderWidth: 2,
    shadowConfig: {
      color: '#8B5CF6',
      offset: { width: 0, height: 0 },
      opacity: 0.4,
      radius: 15,
    },
    pattern: 'circuit',
  },
  [CardStyleType.INK_WASH]: {
    type: CardStyleType.INK_WASH,
    name: '水墨',
    nameEn: 'Ink Wash',
    colors: {
      primary: '#FAFAF9',
      secondary: '#F5F5F4',
      accent: '#57534E',
      background: '#FAFAF9',
      border: '#A8A29E',
      text: '#1C1917',
      glow: '#78716C',
    },
    borderRadius: 4,
    borderWidth: 1,
    shadowConfig: {
      color: '#78716C',
      offset: { width: 2, height: 2 },
      opacity: 0.15,
      radius: 4,
    },
    pattern: 'none',
  },
  [CardStyleType.CARTOON]: {
    type: CardStyleType.CARTOON,
    name: '卡通',
    nameEn: 'Cartoon',
    colors: {
      primary: '#FEF3C7',
      secondary: '#FDE68A',
      accent: '#F97316',
      background: '#FFFBEB',
      border: '#F59E0B',
      text: '#78350F',
      glow: '#FB923C',
    },
    borderRadius: 16,
    borderWidth: 2,
    shadowConfig: {
      color: '#F59E0B',
      offset: { width: 2, height: 2 },
      opacity: 0.2,
      radius: 0,
    },
    pattern: 'dots',
  },
  [CardStyleType.METALLIC]: {
    type: CardStyleType.METALLIC,
    name: '金属',
    nameEn: 'Metallic',
    colors: {
      primary: '#F1F5F9',
      secondary: '#E2E8F0',
      accent: '#64748B',
      background: '#F8FAFC',
      border: '#94A3B8',
      text: '#334155',
      glow: '#94A3B8',
    },
    borderRadius: 8,
    borderWidth: 1,
    shadowConfig: {
      color: '#64748B',
      offset: { width: 0, height: 2 },
      opacity: 0.15,
      radius: 8,
    },
    gradient: ['#E2E8F0', '#F1F5F9', '#E2E8F0', '#CBD5E1'],
    pattern: 'none',
  },
  [CardStyleType.CRYSTAL]: {
    type: CardStyleType.CRYSTAL,
    name: '水晶',
    nameEn: 'Crystal',
    colors: {
      primary: 'rgba(236, 253, 245, 0.9)',
      secondary: 'rgba(209, 250, 229, 0.9)',
      accent: '#10B981',
      background: 'rgba(247, 254, 251, 0.8)',
      border: 'rgba(52, 211, 153, 0.6)',
      text: '#064E3B',
      glow: '#34D399',
    },
    borderRadius: 12,
    borderWidth: 1,
    shadowConfig: {
      color: '#34D399',
      offset: { width: 0, height: 0 },
      opacity: 0.3,
      radius: 12,
    },
    pattern: 'grid',
  },
  [CardStyleType.FLAME]: {
    type: CardStyleType.FLAME,
    name: '火焰',
    nameEn: 'Flame',
    colors: {
      primary: '#FFF7ED',
      secondary: '#FFEDD5',
      accent: '#EA580C',
      background: '#FFFBEB',
      border: '#FDBA74',
      text: '#7C2D12',
      glow: '#F97316',
    },
    borderRadius: 12,
    borderWidth: 1,
    shadowConfig: {
      color: '#F97316',
      offset: { width: 0, height: 0 },
      opacity: 0.3,
      radius: 15,
    },
    pattern: 'none',
  },
  [CardStyleType.FROST]: {
    type: CardStyleType.FROST,
    name: '冰霜',
    nameEn: 'Frost',
    colors: {
      primary: '#ECFEFF',
      secondary: '#CFFAFE',
      accent: '#06B6D4',
      background: '#F0FDFA',
      border: '#67E8F9',
      text: '#0E7490',
      glow: '#22D3EE',
    },
    borderRadius: 12,
    borderWidth: 1,
    shadowConfig: {
      color: '#22D3EE',
      offset: { width: 0, height: 0 },
      opacity: 0.3,
      radius: 12,
    },
    pattern: 'grid',
  },
  [CardStyleType.NATURE]: {
    type: CardStyleType.NATURE,
    name: '自然',
    nameEn: 'Nature',
    colors: {
      primary: '#F0FDF4',
      secondary: '#DCFCE7',
      accent: '#16A34A',
      background: '#F7FEF9',
      border: '#86EFAC',
      text: '#166534',
      glow: '#22C55E',
    },
    borderRadius: 12,
    borderWidth: 1,
    shadowConfig: {
      color: '#22C55E',
      offset: { width: 0, height: 2 },
      opacity: 0.2,
      radius: 8,
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
