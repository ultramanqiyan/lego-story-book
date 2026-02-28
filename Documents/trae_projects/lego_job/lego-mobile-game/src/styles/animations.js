import { Easing } from 'react-native';

export const ANIMATIONS = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
    cardEntry: 500,
    cardFlip: 300,
    cardBounce: 200,
    particle: 20000,
    glow: 2000,
    shimmer: 1500,
  },

  easing: {
    easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
    easeOut: Easing.bezier(0, 0, 0.2, 1),
    easeIn: Easing.bezier(0.4, 0, 1, 1),
    bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
    elastic: Easing.elastic(1),
    linear: Easing.linear,
  },

  card: {
    hover: {
      translateY: -15,
      scale: 1.08,
      duration: 300,
    },
    select: {
      scale: 1.1,
      duration: 200,
    },
    flip: {
      rotateY: 180,
      duration: 300,
    },
    entry: {
      fromY: -200,
      fromScale: 0.5,
      toScale: 1,
      duration: 500,
    },
    bounce: {
      tension: 100,
      friction: 7,
    },
  },

  particle: {
    count: 50,
    size: {
      min: 2,
      max: 6,
    },
    speed: {
      min: 0.5,
      max: 2,
    },
    opacity: {
      min: 0.3,
      max: 0.8,
    },
  },

  glow: {
    radius: {
      small: 10,
      medium: 20,
      large: 30,
    },
    animation: {
      duration: 2000,
      minOpacity: 0.4,
      maxOpacity: 0.9,
    },
  },

  spring: {
    gentle: {
      damping: 15,
      stiffness: 100,
    },
    bouncy: {
      damping: 8,
      stiffness: 180,
    },
    stiff: {
      damping: 20,
      stiffness: 300,
    },
  },

  getDuration(key) {
    return this.duration[key] || this.duration.normal;
  },

  getEasing(key) {
    return this.easing[key] || this.easing.easeInOut;
  },
};

export default ANIMATIONS;
