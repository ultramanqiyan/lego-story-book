export const storyThemes = {
  children: {
    id: 'children',
    name: '儿童探险',
    description: '适合儿童的冒险故事',
    colors: {
      primary: '#FB923C',
      secondary: '#FBBF24',
      cta: '#F87171',
      background: '#FFFDF7',
      backgroundGradient: ['#FFFDF7', '#FFFBEB', '#FEF7E6'],
      primaryGradient: ['#FB923C', '#FBBF24'],
      ctaGradient: ['#F87171', '#FB923C'],
      text: '#92400E',
      textSecondary: '#B45309',
      border: 'rgba(251, 191, 36, 0.25)',
      card: 'rgba(255, 255, 255, 0.9)',
      cardBorder: 'rgba(251, 191, 36, 0.3)',
      accent: '#FBBF24',
    },
    glassEffect: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderColor: 'rgba(251, 191, 36, 0.25)',
      blur: 12,
      shadowColor: 'rgba(251, 146, 60, 0.12)',
    },
    typography: {
      fontFamily: 'Fredoka',
      titleSize: 24,
      bodySize: 16,
    },
    style: {
      borderRadius: 16,
      cardStyle: 'playful',
    },
  },
  magic: {
    id: 'magic',
    name: '魔法世界',
    description: '魔法奇幻故事',
    colors: {
      primary: '#A78BFA',
      secondary: '#C4B5FD',
      cta: '#F9A8D4',
      background: '#1E1B4B',
      backgroundGradient: ['#1E1B4B', '#2D2867', '#3D3683'],
      primaryGradient: ['#A78BFA', '#C4B5FD'],
      ctaGradient: ['#F9A8D4', '#FBCFE8'],
      text: '#EDE9FE',
      textSecondary: '#C4B5FD',
      border: 'rgba(167, 139, 250, 0.35)',
      card: 'rgba(67, 56, 202, 0.6)',
      cardBorder: 'rgba(167, 139, 250, 0.4)',
      accent: '#C4B5FD',
    },
    glassEffect: {
      backgroundColor: 'rgba(67, 56, 202, 0.5)',
      borderColor: 'rgba(167, 139, 250, 0.35)',
      blur: 18,
      shadowColor: 'rgba(167, 139, 250, 0.2)',
    },
    typography: {
      fontFamily: 'Cinzel',
      titleSize: 24,
      bodySize: 16,
    },
    style: {
      borderRadius: 12,
      cardStyle: 'mystical',
    },
  },
  urban: {
    id: 'urban',
    name: '都市职场',
    description: '现代都市故事',
    colors: {
      primary: '#60A5FA',
      secondary: '#93C5FD',
      cta: '#6EE7B7',
      background: '#F8FAFC',
      backgroundGradient: ['#F8FAFC', '#F1F5F9', '#E8EEF4'],
      primaryGradient: ['#60A5FA', '#93C5FD'],
      ctaGradient: ['#6EE7B7', '#A7F3D0'],
      text: '#475569',
      textSecondary: '#64748B',
      border: 'rgba(148, 163, 184, 0.2)',
      card: 'rgba(255, 255, 255, 0.92)',
      cardBorder: 'rgba(148, 163, 184, 0.25)',
      accent: '#93C5FD',
    },
    glassEffect: {
      backgroundColor: 'rgba(255, 255, 255, 0.88)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      blur: 14,
      shadowColor: 'rgba(96, 165, 250, 0.1)',
    },
    typography: {
      fontFamily: 'Inter',
      titleSize: 22,
      bodySize: 16,
    },
    style: {
      borderRadius: 8,
      cardStyle: 'professional',
    },
  },
  mechanical: {
    id: 'mechanical',
    name: '机械帝国',
    description: '科幻机械故事',
    colors: {
      primary: '#67E8F9',
      secondary: '#A5F3FC',
      cta: '#A78BFA',
      background: '#0F172A',
      backgroundGradient: ['#0F172A', '#1E293B', '#283548'],
      primaryGradient: ['#67E8F9', '#A5F3FC'],
      ctaGradient: ['#A78BFA', '#C4B5FD'],
      text: '#E2E8F0',
      textSecondary: '#94A3B8',
      border: 'rgba(103, 232, 249, 0.3)',
      card: 'rgba(51, 65, 85, 0.65)',
      cardBorder: 'rgba(103, 232, 249, 0.35)',
      accent: '#A5F3FC',
    },
    glassEffect: {
      backgroundColor: 'rgba(51, 65, 85, 0.55)',
      borderColor: 'rgba(103, 232, 249, 0.3)',
      blur: 18,
      shadowColor: 'rgba(103, 232, 249, 0.15)',
    },
    typography: {
      fontFamily: 'Orbitron',
      titleSize: 22,
      bodySize: 15,
    },
    style: {
      borderRadius: 4,
      cardStyle: 'tech',
    },
  },
};

export const getTheme = (typeId: string) => {
  return storyThemes[typeId] || storyThemes.magic;
};

export const getThemeColors = (typeId: string) => {
  const theme = getTheme(typeId);
  return theme.colors;
};

export const getThemeStyle = (typeId: string) => {
  const theme = getTheme(typeId);
  return theme.style;
};

export const getGlassEffect = (typeId: string) => {
  const theme = getTheme(typeId);
  return theme.glassEffect;
};

export default storyThemes;
