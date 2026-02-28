export const BASE_UNIT = 4;

export const SPACING = {
  xs: BASE_UNIT,
  sm: BASE_UNIT * 2,
  md: BASE_UNIT * 4,
  lg: BASE_UNIT * 6,
  xl: BASE_UNIT * 8,
  xxl: BASE_UNIT * 12,
};

export const MARGIN = {
  xs: SPACING.xs,
  sm: SPACING.sm,
  md: SPACING.md,
  lg: SPACING.lg,
  xl: SPACING.xl,
  xxl: SPACING.xxl,
};

export const PADDING = {
  xs: SPACING.xs,
  sm: SPACING.sm,
  md: SPACING.md,
  lg: SPACING.lg,
  xl: SPACING.xl,
  xxl: SPACING.xxl,
};

export const GAP = {
  xs: SPACING.xs,
  sm: SPACING.sm,
  md: SPACING.md,
  lg: SPACING.lg,
  xl: SPACING.xl,
  xxl: SPACING.xxl,
};

export const getSpacing = (key) => {
  return SPACING[key] || SPACING.md;
};

export const getMargin = (key) => {
  return MARGIN[key] || MARGIN.md;
};

export const getPadding = (key) => {
  return PADDING[key] || PADDING.md;
};

export const getGap = (key) => {
  return GAP[key] || GAP.md;
};

export default {
  BASE_UNIT,
  SPACING,
  MARGIN,
  PADDING,
  GAP,
  getSpacing,
  getMargin,
  getPadding,
  getGap,
};
