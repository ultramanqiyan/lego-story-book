import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { storage } from '../utils/storage';

const ThemeContext = createContext(null);

const colorThemes = {
  default: {
    id: 'default',
    name: '经典乐高',
    colors: {
      primary: '#FFD500',
      secondary: '#006CB7',
      accent: '#FF6B35',
      background: '#FFF8E7',
      backgroundLight: '#FFFEF5',
      surface: '#FFFFFF',
      text: '#333333',
      textLight: '#666666',
      textMuted: '#999999',
      error: '#E74C3C',
      success: '#27AE60',
      warning: '#F39C12',
      info: '#3498DB',
    },
  },
  immersive: {
    id: 'immersive',
    name: '沉浸故事',
    colors: {
      primary: '#1A1A2E',
      secondary: '#16213E',
      accent: '#0F3460',
      background: '#0F0F1A',
      backgroundLight: '#1A1A2E',
      surface: '#1A1A2E',
      text: '#FFFFFF',
      textLight: '#B0B0B0',
      textMuted: '#808080',
      error: '#E74C3C',
      success: '#27AE60',
      warning: '#F39C12',
      info: '#3498DB',
    },
  },
  gamified: {
    id: 'gamified',
    name: '游戏冒险',
    colors: {
      primary: '#9C27B0',
      secondary: '#E91E63',
      accent: '#FF4081',
      background: '#2D2D44',
      backgroundLight: '#3D3D54',
      surface: '#3D3D54',
      text: '#FFFFFF',
      textLight: '#B0B0B0',
      textMuted: '#808080',
      error: '#E74C3C',
      success: '#27AE60',
      warning: '#F39C12',
      info: '#3498DB',
    },
  },
};

const card2DStyles = {
  classicFlat: {
    id: 'classicFlat',
    name: '经典扁平',
    nameZh: '经典扁平',
    description: '简洁现代，适合儿童用户',
    preview: '🃏',
    config: {
      borderRadius: 16,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      borderWidth: 0,
      hoverScale: 1.05,
      hoverShadowOpacity: 0.25,
      selectedBorderWidth: 3,
      selectedBorderColor: '#FFD500',
      flipDuration: 400,
      flipEasing: 'ease-in-out',
    },
  },
  neonCyber: {
    id: 'neonCyber',
    name: '霓虹赛博',
    nameZh: '霓虹赛博',
    description: '科技感强，炫酷视觉效果',
    preview: '💠',
    config: {
      borderRadius: 12,
      shadowOpacity: 0,
      shadowRadius: 0,
      borderWidth: 2,
      borderColor: '#00FFFF',
      glowColor: '#00FFFF',
      glowRadius: 15,
      hoverScale: 1.02,
      hoverGlowRadius: 25,
      selectedBorderWidth: 3,
      selectedBorderColor: '#FF00FF',
      flipDuration: 600,
      flipEasing: 'ease-out',
      neonColors: ['#00FFFF', '#FF00FF', '#00FF00'],
    },
  },
  watercolorArt: {
    id: 'watercolorArt',
    name: '水彩艺术',
    nameZh: '水彩艺术',
    description: '柔和艺术感，温馨治愈',
    preview: '🎨',
    config: {
      borderRadius: 20,
      shadowOpacity: 0.08,
      shadowRadius: 12,
      borderWidth: 0,
      backgroundBlur: true,
      hoverScale: 1.03,
      rippleEffect: true,
      selectedBorderWidth: 2,
      selectedBorderColor: '#E8B4B8',
      flipDuration: 500,
      flipEasing: 'ease-in-out',
      colors: ['#FFB7C5', '#B5D8EB', '#D4B8E8', '#B8E8D4'],
    },
  },
  retroPixel: {
    id: 'retroPixel',
    name: '复古像素',
    nameZh: '复古像素',
    description: '8-bit游戏风格，怀旧感',
    preview: '👾',
    config: {
      borderRadius: 0,
      shadowOpacity: 0,
      borderWidth: 4,
      borderColor: '#333333',
      pixelSize: 4,
      hoverShake: true,
      hoverShakeIntensity: 2,
      selectedBlink: true,
      selectedBlinkDuration: 200,
      flipDuration: 800,
      flipEasing: 'steps(8)',
      colors: ['#E74C3C', '#3498DB', '#2ECC71', '#F1C40F'],
    },
  },
  minimalLine: {
    id: 'minimalLine',
    name: '极简线条',
    nameZh: '极简线条',
    description: '极简主义，优雅精致',
    preview: '◻️',
    config: {
      borderRadius: 8,
      shadowOpacity: 0,
      borderWidth: 1,
      borderColor: '#333333',
      hoverBorderWidth: 2,
      hoverBorderColor: '#FFD500',
      selectedBorderWidth: 2,
      selectedBorderColor: '#FFD500',
      flipDuration: 350,
      flipEasing: 'ease-out',
      lineAnimation: true,
    },
  },
};

const card3DStyles = {
  realFlip: {
    id: 'realFlip',
    name: '真实翻转',
    nameZh: '真实翻转',
    description: '180度完整3D翻转',
    preview: '🔄',
    config: {
      perspective: 1000,
      rotateY: 180,
      flipDuration: 600,
      flipEasing: 'ease-in-out',
      shadowFollow: true,
      glossEffect: true,
      glossDuration: 300,
    },
  },
  stack: {
    id: 'stack',
    name: '卡片堆叠',
    nameZh: '卡片堆叠',
    description: '层叠展开效果',
    preview: '📚',
    config: {
      perspective: 1000,
      stackOffset: 20,
      spreadAngle: 60,
      spreadDuration: 400,
      selectedElevation: 30,
      layerShadow: true,
    },
  },
  carousel: {
    id: 'carousel',
    name: '旋转木马',
    nameZh: '旋转木马',
    description: '圆形排列旋转浏览',
    preview: '🎠',
    config: {
      perspective: 1200,
      radius: 150,
      cardAngle: 30,
      rotateDuration: 500,
      autoRotate: false,
      autoRotateInterval: 3000,
    },
  },
  floating: {
    id: 'floating',
    name: '悬浮卡片',
    nameZh: '悬浮卡片',
    description: '悬浮倾斜跟随效果',
    preview: '🎈',
    config: {
      perspective: 1000,
      maxTiltX: 15,
      maxTiltY: 15,
      floatAmplitude: 5,
      floatDuration: 2000,
      shadowDynamic: true,
      reflection: true,
    },
  },
  cube: {
    id: 'cube',
    name: '魔方效果',
    nameZh: '魔方效果',
    description: '立方体旋转切换',
    preview: '🎲',
    config: {
      perspective: 800,
      cubeSize: 200,
      rotateDuration: 800,
      rotateEasing: 'ease-in-out',
      directions: ['up', 'down', 'left', 'right'],
    },
  },
};

const particleEffects = {
  magicParticles: {
    id: 'magicParticles',
    name: '魔法粒子',
    nameZh: '魔法粒子',
    description: '漂浮的魔法光点',
    preview: '✨',
    config: {
      count: 40,
      minSize: 3,
      maxSize: 8,
      colors: ['#FFD100', '#FF6B35', '#4ECDC4', '#95E1D3'],
      floatDuration: [3000, 6000],
      blinkInterval: [1000, 3000],
      burstOnClick: true,
      burstCount: 15,
    },
  },
  fireworks: {
    id: 'fireworks',
    name: '烟花爆炸',
    nameZh: '烟花爆炸',
    description: '绚丽的烟花效果',
    preview: '🎆',
    config: {
      launchInterval: [2000, 4000],
      particleCount: 50,
      explosionLayers: 3,
      colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'],
      trailLength: 10,
      gravity: 0.1,
      fadeSpeed: 0.02,
    },
  },
  aurora: {
    id: 'aurora',
    name: '极光流动',
    nameZh: '极光流动',
    description: '北极光般的流动效果',
    preview: '🌌',
    config: {
      waveCount: 5,
      colors: ['#00FF7F', '#00CED1', '#9370DB', '#FF69B4'],
      waveAmplitude: 50,
      waveSpeed: 0.001,
      opacity: [0.3, 0.7],
      blur: 30,
    },
  },
  heartsFall: {
    id: 'heartsFall',
    name: '心形飘落',
    nameZh: '心形飘落',
    description: '爱心飘落效果',
    preview: '💕',
    config: {
      count: 30,
      shapes: ['❤️', '💕', '💖', '💗', '💝'],
      minSize: 16,
      maxSize: 32,
      fallSpeed: [2000, 4000],
      swayAmplitude: 30,
      swaySpeed: 0.002,
      rotation: true,
    },
  },
  starrySky: {
    id: 'starrySky',
    name: '星空闪烁',
    nameZh: '星空闪烁',
    description: '星空背景效果',
    preview: '⭐',
    config: {
      starCount: 100,
      minSize: 1,
      maxSize: 4,
      twinkleSpeed: [1000, 3000],
      shootingStarInterval: [5000, 15000],
      shootingStarDuration: 800,
      backgroundColor: '#0a0a2e',
      starColor: '#FFFFFF',
    },
  },
};

const weatherEffects = {
  sunny: {
    id: 'sunny',
    name: '晴天',
    nameZh: '晴天',
    description: '阳光明媚',
    preview: '☀️',
    config: {
      sunSize: 80,
      rayCount: 12,
      rayLength: 40,
      rayRotateDuration: 25000,
      pulseDuration: 2500,
      cloudCount: 3,
      cloudSpeed: 0.3,
      warmthOverlay: true,
      warmthColor: 'rgba(255, 200, 100, 0.1)',
    },
  },
  rainy: {
    id: 'rainy',
    name: '雨天',
    nameZh: '雨天',
    description: '细雨绵绵',
    preview: '🌧️',
    config: {
      dropCount: 80,
      dropLength: [15, 25],
      dropSpeed: [300, 500],
      dropOpacity: [0.3, 0.6],
      splashEffect: true,
      lightningChance: 0.3,
      lightningDuration: 100,
      overlayColor: 'rgba(100, 120, 150, 0.2)',
    },
  },
  snow: {
    id: 'snow',
    name: '雪天',
    nameZh: '雪天',
    description: '雪花飘落',
    preview: '❄️',
    config: {
      flakeCount: 60,
      flakeShapes: ['❄', '❅', '❆', '✦', '•'],
      flakeSize: [10, 24],
      fallSpeed: [3000, 7000],
      swayAmplitude: 20,
      accumulation: true,
      accumulationHeight: 50,
      overlayColor: 'rgba(200, 220, 255, 0.1)',
    },
  },
  fog: {
    id: 'fog',
    name: '雾天',
    nameZh: '雾天',
    description: '雾气弥漫',
    preview: '🌫️',
    config: {
      layerCount: 5,
      layerOpacity: [0.1, 0.25],
      layerSpeed: [0.1, 0.3],
      layerHeight: [100, 400],
      blur: 0,
      overlayColor: 'rgba(200, 200, 200, 0.3)',
    },
  },
  starryNight: {
    id: 'starryNight',
    name: '星夜',
    nameZh: '星夜',
    description: '星空月夜',
    preview: '🌙',
    config: {
      starCount: 150,
      starSize: [1, 4],
      twinkleSpeed: [1000, 3000],
      moonSize: 60,
      moonPhase: 'crescent',
      shootingStarInterval: [3000, 8000],
      nebulaColors: ['rgba(100, 50, 150, 0.2)', 'rgba(50, 100, 150, 0.2)'],
      backgroundColor: '#0a0a2e',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState('default');
  const [theme, setTheme] = useState(colorThemes.default);
  const [card2DStyle, setCard2DStyle] = useState(card2DStyles.classicFlat);
  const [card3DStyle, setCard3DStyle] = useState(card3DStyles.realFlip);
  const [particleEffect, setParticleEffect] = useState(particleEffects.magicParticles);
  const [weatherEffect, setWeatherEffect] = useState(weatherEffects.sunny);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedThemeId = await storage.getTheme();
      if (savedThemeId && colorThemes[savedThemeId]) {
        changeTheme(savedThemeId);
      }
      
      const savedCard2D = await storage.get('card2DStyle');
      if (savedCard2D && card2DStyles[savedCard2D]) {
        setCard2DStyle(card2DStyles[savedCard2D]);
      }
      
      const savedCard3D = await storage.get('card3DStyle');
      if (savedCard3D && card3DStyles[savedCard3D]) {
        setCard3DStyle(card3DStyles[savedCard3D]);
      }
      
      const savedParticle = await storage.get('particleEffect');
      if (savedParticle && particleEffects[savedParticle]) {
        setParticleEffect(particleEffects[savedParticle]);
      }
      
      const savedWeather = await storage.get('weatherEffect');
      if (savedWeather && weatherEffects[savedWeather]) {
        setWeatherEffect(weatherEffects[savedWeather]);
      }
    } catch (error) {
      console.error('Load theme failed:', error);
    }
  };

  const changeTheme = async (newThemeId) => {
    try {
      const newTheme = colorThemes[newThemeId] || colorThemes.default;
      setThemeId(newThemeId);
      setTheme(newTheme);
      await storage.setTheme(newThemeId);
    } catch (error) {
      console.error('Change theme failed:', error);
    }
  };

  const changeCard2DStyle = async (styleId) => {
    try {
      const newStyle = card2DStyles[styleId] || card2DStyles.classicFlat;
      setCard2DStyle(newStyle);
      await storage.set('card2DStyle', styleId);
    } catch (error) {
      console.error('Change card 2D style failed:', error);
    }
  };

  const changeCard3DStyle = async (styleId) => {
    try {
      const newStyle = card3DStyles[styleId] || card3DStyles.realFlip;
      setCard3DStyle(newStyle);
      await storage.set('card3DStyle', styleId);
    } catch (error) {
      console.error('Change card 3D style failed:', error);
    }
  };

  const changeParticleEffect = async (effectId) => {
    try {
      const newEffect = particleEffects[effectId] || particleEffects.magicParticles;
      setParticleEffect(newEffect);
      await storage.set('particleEffect', effectId);
    } catch (error) {
      console.error('Change particle effect failed:', error);
    }
  };

  const changeWeatherEffect = async (effectId) => {
    try {
      const newEffect = weatherEffects[effectId] || weatherEffects.sunny;
      setWeatherEffect(newEffect);
      await storage.set('weatherEffect', effectId);
    } catch (error) {
      console.error('Change weather effect failed:', error);
    }
  };

  const value = useMemo(() => ({
    themeId,
    theme,
    themes: Object.values(colorThemes),
    changeTheme,
    card2DStyle,
    card2DStyles,
    changeCard2DStyle,
    card3DStyle,
    card3DStyles,
    changeCard3DStyle,
    particleEffect,
    particleEffects,
    changeParticleEffect,
    weatherEffect,
    weatherEffects,
    changeWeatherEffect,
  }), [themeId, theme, card2DStyle, card3DStyle, particleEffect, weatherEffect]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
