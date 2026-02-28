import { COLORS, THEMES } from '../utils/constants';

export const TABLETOP_COLORS = {
  background: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    tertiary: '#0f3460',
  },
  card: {
    primary: '#f4e4ba',
    secondary: '#e8d5a3',
  },
  gold: {
    primary: '#ffd700',
    secondary: '#ffaa00',
  },
  magic: {
    blue: '#4fc3f7',
    purple: '#ba68c8',
  },
  text: {
    primary: '#ffffff',
    secondary: '#b8b8b8',
    muted: '#888888',
  },
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const RARITY_COLORS = {
  common: '#ffffff',
  rare: '#4fc3f7',
  epic: '#ba68c8',
  legendary: '#ff9800',
};

export const CHARACTER_TYPE_COLORS = {
  protagonist: '#d4af37',
  supporting: '#3498db',
  antagonist: '#e74c3c',
  bystander: '#95a5a6',
};

export const GRADIENT_PRESETS = {
  darkBluePurple: {
    colors: ['#1a1a2e', '#16213e', '#0f3460'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  gold: {
    colors: ['#ffd700', '#ffaa00'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
  magic: {
    colors: ['#4fc3f7', '#ba68c8'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  card: {
    colors: ['#f4e4ba', '#e8d5a3'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
};

export const getRarityColor = (rarity) => {
  return RARITY_COLORS[rarity] || RARITY_COLORS.common;
};

export const getCharacterTypeColor = (type) => {
  return CHARACTER_TYPE_COLORS[type] || CHARACTER_TYPE_COLORS.bystander;
};

export const createGradientColors = (startColor, endColor, steps) => {
  if (steps <= 0) return [];
  if (steps === 1) return [startColor];
  
  const parseHex = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  };

  const toHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const start = parseHex(startColor);
  const end = parseHex(endColor);
  const colors = [];

  for (let i = 0; i < steps; i++) {
    const ratio = steps === 1 ? 0 : i / (steps - 1);
    const r = start.r + (end.r - start.r) * ratio;
    const g = start.g + (end.g - start.g) * ratio;
    const b = start.b + (end.b - start.b) * ratio;
    colors.push(toHex(r, g, b));
  }

  return colors;
};

const baseTheme = {
  colors: {
    primary: COLORS.legoYellow,
    secondary: COLORS.legoBlue,
    accent: COLORS.legoOrange,
    background: COLORS.background,
    surface: COLORS.white,
    text: COLORS.text,
    textLight: COLORS.textLight,
    error: COLORS.error,
    success: COLORS.success,
  },
};

const themes = {
  lego: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: COLORS.legoYellow,
      secondary: COLORS.legoBlue,
    },
  },
  fairy: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#FF69B4',
      secondary: '#DDA0DD',
      background: '#FFF0F5',
    },
  },
  scifi: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#00D4FF',
      secondary: '#7B68EE',
      background: '#0A0A1A',
      text: '#FFFFFF',
      surface: '#1A1A2E',
    },
  },
  nature: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#4CAF50',
      secondary: '#8BC34A',
      background: '#F1F8E9',
    },
  },
  gamified: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#9C27B0',
      secondary: '#E91E63',
      background: '#1A1A2E',
      text: '#FFFFFF',
      surface: '#2D2D44',
    },
  },
  immersive: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#1A1A2E',
      secondary: '#16213E',
      background: '#0F0F1A',
      text: '#FFFFFF',
      surface: '#1A1A2E',
    },
  },
  tabletop: {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: TABLETOP_COLORS.gold.primary,
      secondary: TABLETOP_COLORS.magic.blue,
      background: TABLETOP_COLORS.background.primary,
      text: TABLETOP_COLORS.text.primary,
      surface: TABLETOP_COLORS.card.primary,
    },
  },
};

export const getTheme = (themeId) => {
  return themes[themeId] || themes.lego;
};

export const createThemedStyles = (theme) => {
  const { StyleSheet } = require('react-native');
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    surface: {
      backgroundColor: theme.colors.surface,
    },
    text: {
      color: theme.colors.text,
    },
    textLight: {
      color: theme.colors.textLight,
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    primaryText: {
      color: theme.colors.primary,
    },
    secondary: {
      backgroundColor: theme.colors.secondary,
    },
    secondaryText: {
      color: theme.colors.secondary,
    },
  });
};

export default themes;
