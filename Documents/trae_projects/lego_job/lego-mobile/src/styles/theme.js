import { StyleSheet } from 'react-native';
import { TABLETOP_COLORS, RARITY_COLORS, CHARACTER_TYPE_COLORS, GRADIENT_PRESETS } from './colors';
import { TABLETOP_TYPOGRAPHY, FONT_FAMILIES, FONT_SIZES, LINE_HEIGHTS, FONT_WEIGHTS } from './typography';
import { SPACING, MARGIN, PADDING, GAP, BASE_UNIT } from './spacing';
import { DURATION, EASING, CARD_ANIMATION, TRANSITION_CONFIG, ANIMATION_VARIANTS } from './animations';
import { COLORS } from '../utils/constants';

const deepMerge = (target, source) => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

export const TABLETOP_THEME = {
  colors: TABLETOP_COLORS,
  typography: TABLETOP_TYPOGRAPHY,
  spacing: SPACING,
  margin: MARGIN,
  padding: PADDING,
  gap: GAP,
  animations: {
    duration: DURATION,
    easing: EASING,
    card: CARD_ANIMATION,
    variants: ANIMATION_VARIANTS,
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: {
      shadowColor: TABLETOP_COLORS.gold.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
    magicGlow: {
      shadowColor: TABLETOP_COLORS.magic.purple,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },
  rarity: RARITY_COLORS,
  characterTypes: CHARACTER_TYPE_COLORS,
  gradients: GRADIENT_PRESETS,
};

export const createTabletopTheme = (overrides = {}) => {
  return deepMerge(TABLETOP_THEME, overrides);
};

export const getTabletopTheme = (themeId = 'default') => {
  return TABLETOP_THEME;
};

export const mergeThemes = (baseTheme, overrideTheme) => {
  return deepMerge(baseTheme, overrideTheme);
};

export const createThemedStyleSheet = (theme, styleDefinitions) => {
  const resolvedStyles = {};
  
  for (const [key, value] of Object.entries(styleDefinitions)) {
    resolvedStyles[key] = {};
    for (const [styleKey, styleValue] of Object.entries(value)) {
      if (typeof styleValue === 'function') {
        resolvedStyles[key][styleKey] = styleValue(theme);
      } else {
        resolvedStyles[key][styleKey] = styleValue;
      }
    }
  }
  
  return StyleSheet.create(resolvedStyles);
};

export const colors = COLORS;

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal',
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal',
    lineHeight: 16,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
};

export const shadows = {
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default {
  TABLETOP_THEME,
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  createTabletopTheme,
  getTabletopTheme,
  mergeThemes,
  createThemedStyleSheet,
};
