import { COLORS } from './colors';
import { TYPOGRAPHY } from './typography';
import { SPACING } from './spacing';
import { ANIMATIONS } from './animations';

const defaultTheme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  animations: ANIMATIONS,
  card: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border.default,
    backgroundGradient: ['#2d2d44', '#1a1a2e'],
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    padding: SPACING.cardPadding,
  },
  button: {
    primary: {
      backgroundGradient: [COLORS.gold.primary, COLORS.gold.secondary],
      borderRadius: 25,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: COLORS.text.primary,
      borderWidth: 2,
      borderRadius: 25,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
    },
    danger: {
      backgroundGradient: [COLORS.status.error, '#c0392b'],
      borderRadius: 25,
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.xl,
    },
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderColor: COLORS.border.gold,
    borderWidth: 2,
    borderRadius: 12,
    padding: SPACING.inputPadding,
  },
  modal: {
    backgroundGradient: ['#2d2d44', '#1a1a2e'],
    borderColor: COLORS.gold.primary,
    borderWidth: 3,
    borderRadius: 20,
    padding: SPACING.modalPadding,
    overlayColor: 'rgba(0, 0, 0, 0.8)',
  },
};

export const THEME = {
  dark: {
    name: 'dark',
    ...defaultTheme,
    colors: {
      ...COLORS,
      background: {
        ...COLORS.background,
        primary: COLORS.background.primary,
        secondary: COLORS.background.secondary,
      },
      text: {
        ...COLORS.text,
        primary: '#f8fafc',
        secondary: '#94a3b8',
      },
    },
  },
  light: {
    name: 'light',
    ...defaultTheme,
    colors: {
      ...COLORS,
      background: {
        ...COLORS.background,
        primary: '#fffbf0',
        secondary: '#fff8e7',
        card: '#ffffff',
      },
      text: {
        ...COLORS.text,
        primary: '#1a1a2e',
        secondary: '#64748b',
      },
    },
    card: {
      ...defaultTheme.card,
      backgroundGradient: ['#ffffff', '#f8fafc'],
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    modal: {
      ...defaultTheme.modal,
      backgroundGradient: ['#ffffff', '#f8fafc'],
      overlayColor: 'rgba(255, 255, 255, 0.9)',
    },
  },
};

export const createTheme = (config) => {
  return {
    ...defaultTheme,
    ...config,
    colors: {
      ...COLORS,
      ...config.colors,
    },
    typography: {
      ...TYPOGRAPHY,
      ...config.typography,
    },
    spacing: {
      ...SPACING,
      ...config.spacing,
    },
    animations: {
      ...ANIMATIONS,
      ...config.animations,
    },
  };
};

export const getTheme = (themeName) => {
  return THEME[themeName] || THEME.dark;
};

export default THEME;
