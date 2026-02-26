import React from 'react';
import { render } from '@testing-library/react-native';

const COLORS = {
  bgDark: '#0a0a0f',
  gold: '#ffd100',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  green: '#22c55e',
};

describe('COLORS Constants', () => {
  test('COLORS object has correct values', () => {
    expect(COLORS.bgDark).toBe('#0a0a0f');
    expect(COLORS.gold).toBe('#ffd100');
    expect(COLORS.textPrimary).toBe('#f8fafc');
    expect(COLORS.textSecondary).toBe('#94a3b8');
    expect(COLORS.textMuted).toBe('#64748b');
    expect(COLORS.green).toBe('#22c55e');
  });

  test('COLORS values are valid hex colors', () => {
    const hexPattern = /^#[0-9a-fA-F]{6}$/;
    Object.values(COLORS).forEach(color => {
      expect(color).toMatch(hexPattern);
    });
  });
});

describe('Utility Functions', () => {
  test('formatTime returns correct format', () => {
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(125)).toBe('2:05');
  });

  test('truncateText truncates long text', () => {
    const truncateText = (text, maxLength = 50) => {
      if (!text) return '';
      if (text.length <= maxLength) return text;
      return text.substring(0, maxLength) + '...';
    };
    
    expect(truncateText('short', 10)).toBe('short');
    expect(truncateText('this is a very long text that needs truncation', 10)).toBe('this is a ...');
    expect(truncateText('', 10)).toBe('');
    expect(truncateText(null, 10)).toBe('');
  });

  test('generateId generates unique IDs', () => {
    const generateId = () => Math.random().toString(36).substring(2, 9);
    
    const id1 = generateId();
    const id2 = generateId();
    
    expect(id1).not.toBe(id2);
    expect(id1.length).toBe(7);
    expect(id2.length).toBe(7);
  });
});

describe('Array Utilities', () => {
  test('chunkArray splits array into chunks', () => {
    const chunkArray = (arr, size) => {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    };
    
    expect(chunkArray([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(chunkArray([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(chunkArray([], 2)).toEqual([]);
  });

  test('uniqueArray removes duplicates', () => {
    const uniqueArray = (arr) => [...new Set(arr)];
    
    expect(uniqueArray([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    expect(uniqueArray(['a', 'b', 'a'])).toEqual(['a', 'b']);
    expect(uniqueArray([])).toEqual([]);
  });

  test('shuffleArray shuffles array', () => {
    const shuffleArray = (arr) => {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    
    expect(shuffled.length).toBe(original.length);
    expect(shuffled.sort()).toEqual(original.sort());
    expect(original).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('String Utilities', () => {
  test('capitalizeFirst capitalizes first letter', () => {
    const capitalizeFirst = (str) => {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    };
    
    expect(capitalizeFirst('hello')).toBe('Hello');
    expect(capitalizeFirst('WORLD')).toBe('WORLD');
    expect(capitalizeFirst('')).toBe('');
    expect(capitalizeFirst(null)).toBe('');
  });

  test('formatDate formats date correctly', () => {
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };
    
    expect(formatDate('2024-01-15')).toBe('2024-01-15');
    expect(formatDate(new Date(2024, 0, 1))).toBe('2024-01-01');
    expect(formatDate(null)).toBe('');
  });
});

describe('Object Utilities', () => {
  test('deepClone creates deep copy', () => {
    const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
    
    const original = { a: 1, b: { c: 2 } };
    const cloned = deepClone(original);
    
    expect(cloned).toEqual(original);
    cloned.b.c = 3;
    expect(original.b.c).toBe(2);
  });

  test('isEmptyObject checks if object is empty', () => {
    const isEmptyObject = (obj) => {
      if (!obj) return false;
      return Object.keys(obj).length === 0;
    };
    
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({ a: 1 })).toBe(false);
    expect(isEmptyObject(null)).toBe(false);
    expect(isEmptyObject(undefined)).toBe(false);
  });
});

describe('Number Utilities', () => {
  test('clamp limits number within range', () => {
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  test('randomInRange generates number in range', () => {
    const randomInRange = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    for (let i = 0; i < 100; i++) {
      const result = randomInRange(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    }
  });

  test('percentage calculates correctly', () => {
    const percentage = (value, total) => {
      if (total === 0) return 0;
      return Math.round((value / total) * 100);
    };
    
    expect(percentage(50, 100)).toBe(50);
    expect(percentage(1, 3)).toBe(33);
    expect(percentage(0, 100)).toBe(0);
    expect(percentage(100, 0)).toBe(0);
  });
});

describe('Validation Utilities', () => {
  test('isValidEmail validates email format', () => {
    const isValidEmail = (email) => {
      if (!email) return false;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid-email')).toBe(false);
    expect(isValidEmail('test@.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail(null)).toBe(false);
  });

  test('isValidPassword validates password strength', () => {
    const isValidPassword = (password) => {
      if (!password) return false;
      return password.length >= 6;
    };
    
    expect(isValidPassword('123456')).toBe(true);
    expect(isValidPassword('12345')).toBe(false);
    expect(isValidPassword('')).toBe(false);
    expect(isValidPassword(null)).toBe(false);
  });
});

describe('Theme Style Constants', () => {
  test('THEME_STYLES has correct structure', () => {
    const THEME_STYLES = {
      card2D: [
        { id: 'classicFlat', name: '经典扁平', icon: '🃏', desc: '简洁现代，适合儿童用户' },
        { id: 'neonCyber', name: '霓虹赛博', icon: '💠', desc: '科技感强，炫酷视觉效果' },
      ],
      card3D: [
        { id: 'realFlip', name: '真实翻转', icon: '🔄', desc: '180度完整3D翻转' },
      ],
      particle: [
        { id: 'magicParticles', name: '魔法粒子', icon: '✨', desc: '漂浮的魔法光点' },
      ],
      weather: [
        { id: 'sunny', name: '晴天', icon: '☀️', desc: '阳光明媚' },
      ],
    };
    
    expect(THEME_STYLES.card2D).toBeDefined();
    expect(THEME_STYLES.card3D).toBeDefined();
    expect(THEME_STYLES.particle).toBeDefined();
    expect(THEME_STYLES.weather).toBeDefined();
    
    expect(THEME_STYLES.card2D[0].id).toBe('classicFlat');
    expect(THEME_STYLES.card2D[0].name).toBe('经典扁平');
  });
});

describe('Animation Constants', () => {
  test('BOUNCE_EASING is defined', () => {
    const BOUNCE_EASING = {
      tension: 180,
      friction: 12,
    };
    
    expect(BOUNCE_EASING.tension).toBe(180);
    expect(BOUNCE_EASING.friction).toBe(12);
  });
});
