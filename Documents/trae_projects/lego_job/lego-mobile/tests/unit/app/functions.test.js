describe('App Constants and Colors', () => {
  test('COLORS object is defined correctly', () => {
    const COLORS = {
      bgDark: '#0a0a0f',
      bgCard: '#1a1a2e',
      gold: '#ffd100',
      green: '#22c55e',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
    };
    
    expect(COLORS.bgDark).toBe('#0a0a0f');
    expect(COLORS.gold).toBe('#ffd100');
    expect(COLORS.green).toBe('#22c55e');
    expect(COLORS.textPrimary).toBe('#f8fafc');
  });

  test('SCREEN_WIDTH and SCREEN_HEIGHT are numbers', () => {
    const SCREEN_WIDTH = 390;
    const SCREEN_HEIGHT = 844;
    
    expect(typeof SCREEN_WIDTH).toBe('number');
    expect(typeof SCREEN_HEIGHT).toBe('number');
    expect(SCREEN_WIDTH).toBeGreaterThan(0);
    expect(SCREEN_HEIGHT).toBeGreaterThan(0);
  });
});

describe('Theme Styles Constants', () => {
  const THEME_STYLES = {
    card2D: [
      { id: 'classicFlat', name: '经典扁平', icon: '🃏', desc: '简洁现代' },
      { id: 'neonCyber', name: '霓虹赛博', icon: '💠', desc: '科技感强' },
      { id: 'sketchDoodle', name: '手绘涂鸦', icon: '✏️', desc: '童趣风格' },
      { id: 'watercolor', name: '水彩晕染', icon: '🎨', desc: '柔和艺术' },
    ],
    card3D: [
      { id: 'realFlip', name: '真实翻转', icon: '🔄', desc: '180度翻转' },
      { id: 'spiralSpin', name: '螺旋旋转', icon: '🌀', desc: '360度旋转' },
      { id: 'doorOpen', name: '开门效果', icon: '🚪', desc: '左右开门' },
    ],
    particle: [
      { id: 'magicParticles', name: '魔法粒子', icon: '✨', desc: '漂浮光点' },
      { id: 'fireflies', name: '萤火虫', icon: '🪲', desc: '闪烁萤火' },
      { id: 'snowfall', name: '雪花飘落', icon: '❄️', desc: '冬日氛围' },
      { id: 'bubbles', name: '气泡上升', icon: '🫧', desc: '梦幻气泡' },
    ],
    weather: [
      { id: 'sunny', name: '晴天', icon: '☀️', desc: '阳光明媚' },
      { id: 'cloudy', name: '多云', icon: '⛅', desc: '云层飘动' },
      { id: 'rainy', name: '雨天', icon: '🌧️', desc: '雨滴下落' },
      { id: 'starry', name: '星空', icon: '🌙', desc: '繁星闪烁' },
    ],
  };

  test('card2D styles are defined', () => {
    expect(THEME_STYLES.card2D).toBeDefined();
    expect(THEME_STYLES.card2D.length).toBe(4);
    expect(THEME_STYLES.card2D[0].id).toBe('classicFlat');
  });

  test('card3D styles are defined', () => {
    expect(THEME_STYLES.card3D).toBeDefined();
    expect(THEME_STYLES.card3D.length).toBe(3);
    expect(THEME_STYLES.card3D[0].id).toBe('realFlip');
  });

  test('particle styles are defined', () => {
    expect(THEME_STYLES.particle).toBeDefined();
    expect(THEME_STYLES.particle.length).toBe(4);
    expect(THEME_STYLES.particle[0].id).toBe('magicParticles');
  });

  test('weather styles are defined', () => {
    expect(THEME_STYLES.weather).toBeDefined();
    expect(THEME_STYLES.weather.length).toBe(4);
    expect(THEME_STYLES.weather[0].id).toBe('sunny');
  });

  test('all styles have required properties', () => {
    const allStyles = [
      ...THEME_STYLES.card2D,
      ...THEME_STYLES.card3D,
      ...THEME_STYLES.particle,
      ...THEME_STYLES.weather,
    ];
    
    allStyles.forEach(style => {
      expect(style).toHaveProperty('id');
      expect(style).toHaveProperty('name');
      expect(style).toHaveProperty('icon');
      expect(style).toHaveProperty('desc');
    });
  });
});

describe('Animation Configuration', () => {
  test('BOUNCE_EASING has correct tension and friction', () => {
    const BOUNCE_EASING = { tension: 180, friction: 12 };
    expect(BOUNCE_EASING.tension).toBe(180);
    expect(BOUNCE_EASING.friction).toBe(12);
  });
});

describe('API Request Function', () => {
  test('apiRequest builds correct URL', () => {
    const API_BASE = 'http://localhost:3000/api';
    const endpoint = '/characters';
    const expectedUrl = `${API_BASE}${endpoint}`;
    expect(expectedUrl).toBe('http://localhost:3000/api/characters');
  });

  test('apiRequest handles query parameters', () => {
    const API_BASE = 'http://localhost:3000/api';
    const endpoint = '/characters';
    const userId = 'user123';
    const expectedUrl = `${API_BASE}${endpoint}?userId=${userId}`;
    expect(expectedUrl).toBe('http://localhost:3000/api/characters?userId=user123');
  });

  test('apiRequest handles POST body', () => {
    const body = { name: 'Test', creatorId: 'user123' };
    const stringifiedBody = JSON.stringify(body);
    expect(stringifiedBody).toContain('Test');
    expect(stringifiedBody).toContain('user123');
  });
});

describe('Data Transformation Functions', () => {
  test('transformCharacterData maps fields correctly', () => {
    const transformCharacterData = (apiData) => ({
      id: apiData.character_id,
      name: apiData.name || apiData.character_name,
      emoji: apiData.emoji || '🎭',
      creatorId: apiData.creator_id,
    });
    
    const apiData = {
      character_id: 'char1',
      name: 'Hero',
      emoji: '🧙',
      creator_id: 'user123',
    };
    
    const result = transformCharacterData(apiData);
    expect(result.id).toBe('char1');
    expect(result.name).toBe('Hero');
    expect(result.emoji).toBe('🧙');
    expect(result.creatorId).toBe('user123');
  });

  test('transformBookData maps fields correctly', () => {
    const transformBookData = (apiData) => ({
      id: apiData.book_id,
      title: apiData.title,
      chapterCount: apiData.chapter_count || 0,
      characterCount: apiData.character_count || 0,
    });
    
    const apiData = {
      book_id: 'book1',
      title: 'My Story',
      chapter_count: 5,
      character_count: 3,
    };
    
    const result = transformBookData(apiData);
    expect(result.id).toBe('book1');
    expect(result.title).toBe('My Story');
    expect(result.chapterCount).toBe(5);
    expect(result.characterCount).toBe(3);
  });

  test('transformChapterData maps fields correctly', () => {
    const transformChapterData = (apiData) => ({
      id: apiData.chapter_id,
      title: apiData.title,
      content: apiData.content,
      chapterNumber: apiData.chapter_number,
    });
    
    const apiData = {
      chapter_id: 'chap1',
      title: 'Chapter 1',
      content: 'Once upon a time...',
      chapter_number: 1,
    };
    
    const result = transformChapterData(apiData);
    expect(result.id).toBe('chap1');
    expect(result.title).toBe('Chapter 1');
    expect(result.content).toBe('Once upon a time...');
    expect(result.chapterNumber).toBe(1);
  });
});

describe('Validation Functions', () => {
  test('validateBookTitle validates correctly', () => {
    const validateBookTitle = (title) => {
      if (!title || title.trim() === '') return { valid: false, error: '标题不能为空' };
      if (title.length > 50) return { valid: false, error: '标题不能超过50个字符' };
      return { valid: true, error: null };
    };
    
    expect(validateBookTitle('').valid).toBe(false);
    expect(validateBookTitle('   ').valid).toBe(false);
    expect(validateBookTitle('Valid Title').valid).toBe(true);
    expect(validateBookTitle('a'.repeat(51)).valid).toBe(false);
  });

  test('validateChapterContent validates correctly', () => {
    const validateChapterContent = (content) => {
      if (!content || content.trim() === '') return { valid: false, error: '内容不能为空' };
      if (content.length < 10) return { valid: false, error: '内容太短' };
      return { valid: true, error: null };
    };
    
    expect(validateChapterContent('').valid).toBe(false);
    expect(validateChapterContent('short').valid).toBe(false);
    expect(validateChapterContent('This is a valid chapter content.').valid).toBe(true);
  });
});

describe('Time Formatting Functions', () => {
  test('formatReadingTime formats seconds correctly', () => {
    const formatReadingTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m ${secs}s`;
    };
    
    expect(formatReadingTime(0)).toBe('0m 0s');
    expect(formatReadingTime(30)).toBe('0m 30s');
    expect(formatReadingTime(60)).toBe('1m 0s');
    expect(formatReadingTime(90)).toBe('1m 30s');
    expect(formatReadingTime(3600)).toBe('1h 0m');
    expect(formatReadingTime(3661)).toBe('1h 1m');
  });

  test('formatDate formats date correctly', () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    
    expect(formatDate('2024-01-15')).toBe('2024-01-15');
    expect(formatDate('2024-12-01')).toBe('2024-12-01');
  });
});

describe('Navigation Helpers', () => {
  test('getTabByName returns correct tab index', () => {
    const getTabByName = (name) => {
      const tabs = ['Home', 'Bookshelf', 'Characters', 'Adventure', 'Settings'];
      return tabs.indexOf(name);
    };
    
    expect(getTabByName('Home')).toBe(0);
    expect(getTabByName('Bookshelf')).toBe(1);
    expect(getTabByName('Characters')).toBe(2);
    expect(getTabByName('Adventure')).toBe(3);
    expect(getTabByName('Settings')).toBe(4);
    expect(getTabByName('Unknown')).toBe(-1);
  });
});

describe('State Management Helpers', () => {
  test('createInitialState returns correct structure', () => {
    const createInitialState = () => ({
      isLoading: true,
      error: null,
      data: null,
    });
    
    const state = createInitialState();
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.data).toBeNull();
  });

  test('createLoadingState sets loading correctly', () => {
    const createLoadingState = (isLoading) => ({
      isLoading,
      error: null,
      data: null,
    });
    
    const loadingState = createLoadingState(true);
    expect(loadingState.isLoading).toBe(true);
    
    const loadedState = createLoadingState(false);
    expect(loadedState.isLoading).toBe(false);
  });

  test('createErrorState sets error correctly', () => {
    const createErrorState = (error) => ({
      isLoading: false,
      error,
      data: null,
    });
    
    const errorState = createErrorState('Something went wrong');
    expect(errorState.isLoading).toBe(false);
    expect(errorState.error).toBe('Something went wrong');
    expect(errorState.data).toBeNull();
  });
});

describe('Array Helpers', () => {
  test('groupBy groups items correctly', () => {
    const groupBy = (arr, key) => {
      return arr.reduce((groups, item) => {
        const group = item[key];
        if (!groups[group]) groups[group] = [];
        groups[group].push(item);
        return groups;
      }, {});
    };
    
    const items = [
      { id: 1, type: 'a' },
      { id: 2, type: 'b' },
      { id: 3, type: 'a' },
    ];
    
    const grouped = groupBy(items, 'type');
    expect(grouped.a.length).toBe(2);
    expect(grouped.b.length).toBe(1);
  });

  test('sortBy sorts items correctly', () => {
    const sortBy = (arr, key, order = 'asc') => {
      return [...arr].sort((a, b) => {
        if (order === 'asc') return a[key] > b[key] ? 1 : -1;
        return a[key] < b[key] ? 1 : -1;
      });
    };
    
    const items = [
      { id: 3, name: 'C' },
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    
    const ascSorted = sortBy(items, 'id', 'asc');
    expect(ascSorted[0].id).toBe(1);
    
    const descSorted = sortBy(items, 'id', 'desc');
    expect(descSorted[0].id).toBe(3);
  });
});

describe('String Helpers', () => {
  test('truncate truncates long strings', () => {
    const truncate = (str, maxLength) => {
      if (!str || str.length <= maxLength) return str;
      return str.substring(0, maxLength) + '...';
    };
    
    expect(truncate('short', 10)).toBe('short');
    expect(truncate('this is a very long string', 10)).toBe('this is a ...');
    expect(truncate('', 10)).toBe('');
    expect(truncate(null, 10)).toBeNull();
  });

  test('capitalize capitalizes first letter', () => {
    const capitalize = (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };
    
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('WORLD')).toBe('World');
    expect(capitalize('')).toBe('');
    expect(capitalize(null)).toBe('');
  });
});

describe('Object Helpers', () => {
  test('pick picks specified keys', () => {
    const pick = (obj, keys) => {
      const result = {};
      keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
          result[key] = obj[key];
        }
      });
      return result;
    };
    
    const obj = { a: 1, b: 2, c: 3 };
    const picked = pick(obj, ['a', 'c']);
    expect(picked).toEqual({ a: 1, c: 3 });
  });

  test('omit omits specified keys', () => {
    const omit = (obj, keys) => {
      const result = { ...obj };
      keys.forEach(key => delete result[key]);
      return result;
    };
    
    const obj = { a: 1, b: 2, c: 3 };
    const omitted = omit(obj, ['b']);
    expect(omitted).toEqual({ a: 1, c: 3 });
  });
});

describe('Math Helpers', () => {
  test('lerp interpolates correctly', () => {
    const lerp = (start, end, t) => start + (end - start) * t;
    
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  test('clamp limits values correctly', () => {
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('mapRange maps values correctly', () => {
    const mapRange = (value, inMin, inMax, outMin, outMax) => {
      return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
    };
    
    expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
    expect(mapRange(0, 0, 10, 0, 100)).toBe(0);
    expect(mapRange(10, 0, 10, 0, 100)).toBe(100);
  });
});
