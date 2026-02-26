export { storage } from './storage';
export { formatDate, truncateText, formatTime, getRoleLabel, getPlotNameDisplay, highlightKeywords, generateId } from './helpers';
export { COLORS, ROLE_COLORS, PLOT_ICONS, CHARACTER_EMOJIS, PLOT_TYPES, ROLE_TYPES, THEMES } from './constants';

// 新增动画工具导出
export {
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
} from './animations';
