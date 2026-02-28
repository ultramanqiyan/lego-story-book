import { StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

export const FONT_FAMILIES = {
  heading: ['Cinzel', 'Playfair Display', 'serif'],
  body: ['Noto Sans SC', 'Nunito', 'sans-serif'],
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 32,
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

export const FONT_WEIGHTS = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const TABLETOP_TYPOGRAPHY = {
  h1: {
    fontFamily: FONT_FAMILIES.heading.join(','),
    fontSize: 32,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 32 * LINE_HEIGHTS.tight,
    color: '#ffffff',
  },
  h2: {
    fontFamily: FONT_FAMILIES.heading.join(','),
    fontSize: 28,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 28 * LINE_HEIGHTS.tight,
    color: '#ffffff',
  },
  h3: {
    fontFamily: FONT_FAMILIES.heading.join(','),
    fontSize: 24,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 24 * LINE_HEIGHTS.normal,
    color: '#ffffff',
  },
  h4: {
    fontFamily: FONT_FAMILIES.heading.join(','),
    fontSize: 20,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: 20 * LINE_HEIGHTS.normal,
    color: '#ffffff',
  },
  body: {
    fontFamily: FONT_FAMILIES.body.join(','),
    fontSize: 16,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: 16 * LINE_HEIGHTS.relaxed,
    color: '#ffffff',
  },
  bodyLarge: {
    fontFamily: FONT_FAMILIES.body.join(','),
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: 18 * LINE_HEIGHTS.relaxed,
    color: '#ffffff',
  },
  bodySmall: {
    fontFamily: FONT_FAMILIES.body.join(','),
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: 14 * LINE_HEIGHTS.relaxed,
    color: '#ffffff',
  },
  cardTitle: {
    fontFamily: FONT_FAMILIES.heading.join(','),
    fontSize: 18,
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: 18 * LINE_HEIGHTS.tight,
    color: '#1a1a2e',
  },
  cardBody: {
    fontFamily: FONT_FAMILIES.body.join(','),
    fontSize: 14,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: 14 * LINE_HEIGHTS.relaxed,
    color: '#333333',
  },
  label: {
    fontFamily: FONT_FAMILIES.body.join(','),
    fontSize: 12,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: 12 * LINE_HEIGHTS.normal,
    color: '#888888',
  },
  caption: {
    fontFamily: FONT_FAMILIES.body.join(','),
    fontSize: 10,
    fontWeight: FONT_WEIGHTS.normal,
    lineHeight: 10 * LINE_HEIGHTS.normal,
    color: '#888888',
  },
};

export const getFontFamily = (type) => {
  const families = FONT_FAMILIES[type] || FONT_FAMILIES.body;
  return families.join(',');
};

export const getTypographyStyle = (styleName) => {
  return TABLETOP_TYPOGRAPHY[styleName] || TABLETOP_TYPOGRAPHY.body;
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

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  flexWrap: {
    flexWrap: 'wrap',
  },
  
  p4: { padding: 4 },
  p8: { padding: 8 },
  p12: { padding: 12 },
  p16: { padding: 16 },
  p20: { padding: 20 },
  p24: { padding: 24 },
  
  px4: { paddingHorizontal: 4 },
  px8: { paddingHorizontal: 8 },
  px12: { paddingHorizontal: 12 },
  px16: { paddingHorizontal: 16 },
  px20: { paddingHorizontal: 20 },
  
  py4: { paddingVertical: 4 },
  py8: { paddingVertical: 8 },
  py12: { paddingVertical: 12 },
  py16: { paddingVertical: 16 },
  py20: { paddingVertical: 20 },
  
  m4: { margin: 4 },
  m8: { margin: 8 },
  m12: { margin: 12 },
  m16: { margin: 16 },
  m20: { margin: 20 },
  m24: { margin: 24 },
  
  mx4: { marginHorizontal: 4 },
  mx8: { marginHorizontal: 8 },
  mx12: { marginHorizontal: 12 },
  mx16: { marginHorizontal: 16 },
  
  my4: { marginVertical: 4 },
  my8: { marginVertical: 8 },
  my12: { marginVertical: 12 },
  my16: { marginVertical: 16 },
  
  mb4: { marginBottom: 4 },
  mb8: { marginBottom: 8 },
  mb12: { marginBottom: 12 },
  mb16: { marginBottom: 16 },
  mb20: { marginBottom: 20 },
  mb24: { marginBottom: 24 },
  
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt16: { marginTop: 16 },
  mt20: { marginTop: 20 },
  mt24: { marginTop: 24 },
  
  gap4: { gap: 4 },
  gap8: { gap: 8 },
  gap12: { gap: 12 },
  gap16: { gap: 16 },
  gap20: { gap: 20 },
  
  rounded: { borderRadius: 8 },
  roundedMd: { borderRadius: 12 },
  roundedLg: { borderRadius: 16 },
  roundedXl: { borderRadius: 20 },
  roundedFull: { borderRadius: 999 },
  
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shadowMd: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  shadowLg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  
  fontBold: { fontWeight: 'bold' },
  fontMedium: { fontWeight: '500' },
  fontNormal: { fontWeight: 'normal' },
  
  textXs: { fontSize: 12 },
  textSm: { fontSize: 14 },
  textBase: { fontSize: 16 },
  textLg: { fontSize: 18 },
  textXl: { fontSize: 20 },
  text2xl: { fontSize: 24 },
  text3xl: { fontSize: 30 },
});

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
