/**
 * 动画工具库 - 提供通用动画配置和工具函数
 */

import { Easing } from 'react-native-reanimated';

// ============ 缓动函数配置 ============
export const EASINGS = {
  // 标准Material Design缓动
  standard: Easing.bezier(0.4, 0, 0.2, 1),
  // 减速缓动（进入）
  decelerate: Easing.bezier(0, 0, 0.2, 1),
  // 加速缓动（退出）
  accelerate: Easing.bezier(0.4, 0, 1, 1),
  // 弹性缓动
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  // 弹性柔和
  bounceSoft: Easing.bezier(0.34, 1.56, 0.64, 1),
  // 线性
  linear: Easing.linear,
  // 正弦波动
  sine: Easing.sin,
  // 弹簧效果
  spring: Easing.elastic(1.2),
};

// ============ 3D卡牌配置 ============
export const CARD_3D_CONFIG = {
  perspective: 1000,
  flipDuration: 600,
  tiltMaxAngle: 15,
  shadowOpacity: 0.3,
  shadowBlur: 20,
  elevation: 8,
  cardWidth: 80,
  cardHeight: 110,
  fanAngle: 60,
  stackOffset: 2,
  spreadDuration: 400,
  selectElevation: 20,
};

// ============ 天气特效配置 ============
export const WEATHER_CONFIG = {
  rain: {
    dropCount: 80,
    dropLength: [15, 35],
    fallSpeed: [300, 600],
    windAngle: -15,
    splashEnabled: true,
    lightningInterval: 3000,
  },
  snow: {
    flakeCount: 50,
    flakeTypes: ['❄', '❅', '❆', '✦'],
    fallDuration: [4000, 8000],
    swayAmplitude: 30,
    accumulation: true,
  },
  sun: {
    rayCount: 12,
    rayLength: [60, 100],
    glowLayers: 3,
    rotationSpeed: 20000,
    dustParticles: 30,
  },
  fog: {
    layerCount: 3,
    moveSpeed: [15000, 25000, 35000],
    opacity: [0.15, 0.25, 0.35],
  },
};

// ============ 粒子系统配置 ============
export const PARTICLES_CONFIG = {
  magic: {
    particleCount: 25,
    colors: ['#FFD100', '#FF6B35', '#4ECDC4', '#95E1D3'],
    floatSpeed: [3000, 6000],
    blinkInterval: [1000, 3000],
    connectionDistance: 100,
    maxOpacity: 0.8,
    minOpacity: 0.2,
  },
  burst: {
    particleCount: 20,
    colors: ['#FFD100', '#FF6B35', '#4ECDC4', '#F7FFF7', '#FF6B6B'],
    gravity: 0.5,
    decay: 0.98,
    spread: 100,
  },
  trail: {
    density: 5,
    fadeDuration: 500,
    colors: ['#FFD100', '#FF6B35'],
  },
};

// ============ 转场动画配置 ============
export const TRANSITION_CONFIG = {
  slide: {
    duration: 300,
    easing: EASINGS.standard,
  },
  scale: {
    duration: 400,
    easing: EASINGS.decelerate,
  },
  fade: {
    duration: 250,
    easing: EASINGS.standard,
  },
  sharedElement: {
    duration: 500,
    easing: EASINGS.standard,
  },
};

// ============ 微交互配置 ============
export const MICRO_INTERACTION_CONFIG = {
  button: {
    pressScale: 0.95,
    releaseScale: 1,
    pressDuration: 100,
    releaseDuration: 200,
    rippleDuration: 400,
  },
  card: {
    hoverScale: 1.02,
    pressScale: 0.98,
    elevationHover: 8,
    elevationNormal: 3,
  },
  input: {
    focusDuration: 200,
    labelTranslateY: -20,
    labelScale: 0.85,
  },
};

// ============ 动画工具函数 ============

/**
 * 生成随机数
 */
export const random = (min, max) => Math.random() * (max - min) + min;

/**
 * 生成随机整数
 */
export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * 从数组中随机选择
 */
export const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * 生成粒子初始配置
 */
export const generateParticleConfig = (type = 'magic', index = 0) => {
  const config = PARTICLES_CONFIG[type];
  const screenWidth = 400; // 默认屏幕宽度
  const screenHeight = 800; // 默认屏幕高度

  return {
    id: `particle_${type}_${index}_${Date.now()}`,
    x: random(0, screenWidth),
    y: random(0, screenHeight),
    size: random(3, 8),
    color: randomChoice(config.colors),
    opacity: random(config.minOpacity || 0.3, config.maxOpacity || 1),
    speedX: random(-0.5, 0.5),
    speedY: random(-0.3, -0.8),
    delay: random(0, 2000),
    duration: random(config.floatSpeed?.[0] || 3000, config.floatSpeed?.[1] || 6000),
  };
};

/**
 * 生成雨滴配置
 */
export const generateRainDropConfig = (index) => {
  const config = WEATHER_CONFIG.rain;
  const screenWidth = 400;

  return {
    id: `rain_${index}_${Date.now()}`,
    x: random(0, screenWidth + 100),
    delay: random(0, 1500),
    duration: random(config.fallSpeed[0], config.fallSpeed[1]),
    length: random(config.dropLength[0], config.dropLength[1]),
    opacity: random(0.3, 0.8),
    speedX: Math.tan((config.windAngle * Math.PI) / 180),
  };
};

/**
 * 生成雪花配置
 */
export const generateSnowFlakeConfig = (index) => {
  const config = WEATHER_CONFIG.snow;
  const screenWidth = 400;

  return {
    id: `snow_${index}_${Date.now()}`,
    x: random(0, screenWidth),
    delay: random(0, 4000),
    duration: random(config.fallDuration[0], config.fallDuration[1]),
    size: random(10, 26),
    type: randomChoice(config.flakeTypes),
    opacity: random(0.5, 1),
    swayOffset: random(0, Math.PI * 2),
    swaySpeed: random(0.5, 1.5),
  };
};

/**
 * 计算3D倾斜角度
 */
export const calculateTiltAngle = (touchX, touchY, centerX, centerY, maxAngle = 15) => {
  const deltaX = (touchX - centerX) / centerX;
  const deltaY = (touchY - centerY) / centerY;

  return {
    rotateX: -deltaY * maxAngle,
    rotateY: deltaX * maxAngle,
  };
};

/**
 * 计算扇形卡牌角度
 */
export const calculateFanAngle = (index, total, fanAngle = 60) => {
  const startAngle = -fanAngle / 2;
  const angleStep = total > 1 ? fanAngle / (total - 1) : 0;
  return startAngle + index * angleStep;
};

/**
 * 防抖函数
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  EASINGS,
  CARD_3D_CONFIG,
  WEATHER_CONFIG,
  PARTICLES_CONFIG,
  TRANSITION_CONFIG,
  MICRO_INTERACTION_CONFIG,
  random,
  randomInt,
  randomChoice,
  generateParticleConfig,
  generateRainDropConfig,
  generateSnowFlakeConfig,
  calculateTiltAngle,
  calculateFanAngle,
  debounce,
  throttle,
};
