import storyThemes from './storyThemes';

export const getThemeColors = (typeId: string) => {
  const theme = storyThemes[typeId] || storyThemes.magic;
  return theme.colors;
};

export const getTheme = (typeId: string) => {
  return storyThemes[typeId] || storyThemes.magic;
};

export const getThemeStyle = (typeId: string) => {
  const theme = getTheme(typeId);
  return theme.style;
};

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
  const { colors, style } = theme;
  
  return {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: style.borderRadius,
    shadowColor: style.shadowColor,
    shadowOpacity: style.shadowOpacity,
  };
};

export default {
  getThemeColors,
  getTheme,
  getThemeStyle,
  getThemeTypography,
  getAllThemes,
  getThemeGradient,
  getCardStyle,
};
