import storyThemes, { getTheme, getThemeColors, getThemeStyle, getGlassEffect } from './storyThemes';

export const getThemeTypography = (typeId: string) => {
  const theme = getTheme(typeId);
  return theme.typography;
};

export const getAllThemes = () => {
  return Object.values(storyThemes);
};

export const getThemeGradient = (typeId: string) => {
  const colors = getThemeColors(typeId);
  return colors.backgroundGradient;
};

export const getCardStyle = (typeId: string) => {
  const theme = getTheme(typeId);
  const { colors, style, glassEffect } = theme;
  
  return {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: style.borderRadius,
    shadowColor: glassEffect.shadowColor,
    shadowOpacity: 1,
    shadowRadius: glassEffect.blur,
  };
};

export const getGlassStyle = (typeId: string) => {
  const theme = getTheme(typeId);
  const { glassEffect } = theme;
  
  return {
    backgroundColor: glassEffect.backgroundColor,
    borderWidth: 1,
    borderColor: glassEffect.borderColor,
    shadowColor: glassEffect.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: glassEffect.blur,
    elevation: 8,
  };
};

export const getButtonGradient = (typeId: string, variant: 'primary' | 'cta' = 'primary') => {
  const colors = getThemeColors(typeId);
  return variant === 'primary' ? colors.primaryGradient : colors.ctaGradient;
};

export default {
  getThemeColors,
  getTheme,
  getThemeStyle,
  getThemeTypography,
  getAllThemes,
  getThemeGradient,
  getCardStyle,
  getGlassEffect,
  getGlassStyle,
  getButtonGradient,
};
