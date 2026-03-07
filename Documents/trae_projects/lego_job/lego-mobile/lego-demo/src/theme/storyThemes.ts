export const storyThemes = {
  children: {
    id: 'children',
    name: '儿童探险',
    description: '适合儿童的冒险故事',
    colors: {
      primary: '#7C3AED',
      secondary: '#A78BFA',
      cta: '#F43F5E',
      background: '#F5F3FF',
      backgroundGradient: ['#F5F3FF', '#EDE9FE', '#DDD6FE'],
      text: '#1E1B4B',
      border: '#C4B5FD',
      card: '#FFFFFF',
      cardBorder: '#E9D5FF',
      accent: '#FBBF24',
    },
    typography: {
      fontFamily: 'Fredoka',
      titleSize: 24,
      bodySize: 16,
    },
    style: {
      borderRadius: 16,
      shadowColor: '#7C3AED',
      shadowOpacity: 0.15,
      cardStyle: 'playful',
    },
  },
  magic: {
    id: 'magic',
    name: '魔法世界',
    description: '魔法奇幻故事',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      cta: '#FBBF24',
      background: '#1E1B4B',
      backgroundGradient: ['#1E1B4B', '#312E81', '#4338CA'],
      text: '#F8FAFC',
      border: '#4C1D95',
      card: '#312E81',
      cardBorder: '#6366F1',
      accent: '#FBBF24',
    },
    typography: {
      fontFamily: 'Cinzel',
      titleSize: 24,
      bodySize: 16,
    },
    style: {
      borderRadius: 12,
      shadowColor: '#8B5CF6',
      shadowOpacity: 0.3,
      cardStyle: 'mystical',
    },
  },
  urban: {
    id: 'urban',
    name: '都市职场',
    description: '现代都市故事',
    colors: {
      primary: '#2563EB',
      secondary: '#3B82F6',
      cta: '#F97316',
      background: '#F8FAFC',
      backgroundGradient: ['#F8FAFC', '#EFF6FF', '#DBEAFE'],
      text: '#1E293B',
      border: '#E2E8F0',
      card: '#FFFFFF',
      cardBorder: '#BFDBFE',
      accent: '#0369A1',
    },
    typography: {
      fontFamily: 'Inter',
      titleSize: 22,
      bodySize: 16,
    },
    style: {
      borderRadius: 8,
      shadowColor: '#1E293B',
      shadowOpacity: 0.1,
      cardStyle: 'professional',
    },
  },
  mechanical: {
    id: 'mechanical',
    name: '机械帝国',
    description: '科幻机械故事',
    colors: {
      primary: '#00FFFF',
      secondary: '#7B61FF',
      cta: '#FF00FF',
      background: '#0B0B10',
      backgroundGradient: ['#0B0B10', '#1A1A2E', '#16213E'],
      text: '#E0E0FF',
      border: '#333344',
      card: '#1A1A2E',
      cardBorder: '#00FFFF',
      accent: '#00FF41',
    },
    typography: {
      fontFamily: 'Orbitron',
      titleSize: 22,
      bodySize: 15,
    },
    style: {
      borderRadius: 4,
      shadowColor: '#00FFFF',
      shadowOpacity: 0.2,
      cardStyle: 'tech',
    },
  },
};

export const getTheme = (typeId) => {
  return storyThemes[typeId] || storyThemes.magic;
};

export const getThemeColors = (typeId) => {
  const theme = getTheme(typeId);
  return theme.colors;
};

export const getThemeStyle = (typeId) => {
  const theme = getTheme(typeId);
  return theme.style;
};

export default storyThemes;
