export const SPACING = {
  base: 4,

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,

  pageHorizontal: 16,
  pageVertical: 20,

  cardPadding: 12,
  cardGap: 8,

  buttonPadding: 12,
  inputPadding: 12,
  listItemGap: 12,

  modalPadding: 20,
  sectionGap: 24,

  get(key, defaultValue = 0) {
    if (this[key] !== undefined && typeof this[key] === 'number') {
      return this[key];
    }
    return defaultValue;
  },

  multiply(key, multiplier) {
    const value = this.get(key, 0);
    return value * multiplier;
  },
};

export default SPACING;
