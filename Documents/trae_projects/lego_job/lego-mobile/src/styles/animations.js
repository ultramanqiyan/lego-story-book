import { Easing } from 'react-native';

export const DURATION = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

export const EASING = {
  linear: 'linear',
  easeIn: Easing.bezier(0.42, 0, 1, 1),
  easeOut: Easing.bezier(0, 0, 0.58, 1),
  easeInOut: Easing.bezier(0.42, 0, 0.58, 1),
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  elastic: Easing.elastic(1),
};

export const CARD_ANIMATION = {
  flip: {
    duration: DURATION.normal,
    easing: EASING.easeInOut,
  },
  hover: {
    duration: DURATION.fast,
    easing: EASING.easeOut,
  },
  deal: {
    duration: DURATION.slow,
    easing: EASING.easeOut,
  },
  shuffle: {
    duration: DURATION.verySlow,
    easing: EASING.easeInOut,
  },
  glow: {
    duration: DURATION.slow,
    easing: EASING.easeInOut,
  },
};

export const TRANSITION_CONFIG = {
  default: {
    duration: DURATION.normal,
    easing: EASING.easeInOut,
  },
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  timing: {
    duration: DURATION.normal,
    easing: EASING.easeInOut,
  },
};

export const ANIMATION_VARIANTS = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  scaleIn: {
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
  },
  scaleOut: {
    from: { scale: 1, opacity: 1 },
    to: { scale: 0, opacity: 0 },
  },
  slideIn: {
    from: { translateX: -100, opacity: 0 },
    to: { translateX: 0, opacity: 1 },
  },
  slideOut: {
    from: { translateX: 0, opacity: 1 },
    to: { translateX: 100, opacity: 0 },
  },
  slideUp: {
    from: { translateY: 100, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },
  slideDown: {
    from: { translateY: 0, opacity: 1 },
    to: { translateY: 100, opacity: 0 },
  },
  cardFlip: {
    front: {
      rotateY: '0deg',
    },
    back: {
      rotateY: '180deg',
    },
  },
  cardGlow: {
    from: {
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    to: {
      shadowOpacity: 0.6,
      shadowRadius: 16,
    },
  },
};

export const getDuration = (key) => {
  return DURATION[key] || DURATION.normal;
};

export const getEasing = (key) => {
  return EASING[key] || EASING.easeInOut;
};

export const getCardAnimationConfig = (key) => {
  return CARD_ANIMATION[key] || CARD_ANIMATION.flip;
};

export default {
  DURATION,
  EASING,
  CARD_ANIMATION,
  TRANSITION_CONFIG,
  ANIMATION_VARIANTS,
  getDuration,
  getEasing,
  getCardAnimationConfig,
};
