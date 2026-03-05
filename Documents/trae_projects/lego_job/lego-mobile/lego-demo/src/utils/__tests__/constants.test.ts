import { API_CONFIG, STORAGE_KEYS, ANIMATION_CONFIG, COLORS, TEST_IDS, NAVIGATION_SCREENS, ERROR_MESSAGES } from '../constants';

describe('Constants', () => {
  describe('API_CONFIG', () => {
    it('应该有正确的API配置', () => {
      expect(API_CONFIG.BASE_URL).toBeDefined();
      expect(API_CONFIG.TIMEOUT).toBeGreaterThan(0);
      expect(API_CONFIG.CACHE_DURATION).toBeGreaterThan(0);
      expect(API_CONFIG.MAX_CACHE_SIZE).toBeGreaterThan(0);
    });
  });

  describe('STORAGE_KEYS', () => {
    it('应该有所有必需的存储键', () => {
      expect(STORAGE_KEYS.AUTH_TOKEN).toBeDefined();
      expect(STORAGE_KEYS.REFRESH_TOKEN).toBeDefined();
      expect(STORAGE_KEYS.USER_DATA).toBeDefined();
      expect(STORAGE_KEYS.THEME_MODE).toBeDefined();
    });
  });

  describe('ANIMATION_CONFIG', () => {
    it('应该有动画配置', () => {
      expect(ANIMATION_CONFIG.DURATION).toBeDefined();
      expect(ANIMATION_CONFIG.SPRING).toBeDefined();
      expect(ANIMATION_CONFIG.EASING).toBeDefined();
    });
  });

  describe('COLORS', () => {
    it('应该有所有必需的颜色', () => {
      expect(COLORS.PRIMARY).toBeDefined();
      expect(COLORS.SECONDARY).toBeDefined();
      expect(COLORS.BACKGROUND).toBeDefined();
      expect(COLORS.TEXT).toBeDefined();
      expect(COLORS.RARITY).toBeDefined();
    });
  });

  describe('TEST_IDS', () => {
    it('应该有登录相关的testID', () => {
      expect(TEST_IDS.LOGIN.SCREEN).toBe('login-screen');
      expect(TEST_IDS.LOGIN.USERNAME_INPUT).toBe('login-username-input');
      expect(TEST_IDS.LOGIN.LOGIN_BUTTON).toBe('login-button');
    });

    it('应该有书架相关的testID函数', () => {
      expect(TEST_IDS.BOOKSHELF.BOOK_ITEM('123')).toBe('book-item-123');
      expect(TEST_IDS.BOOKSHELF.BOOK_TITLE('456')).toBe('book-title-456');
    });

    it('应该有人仔相关的testID函数', () => {
      expect(TEST_IDS.CHARACTERS.CHARACTER_ITEM('abc')).toBe('character-item-abc');
      expect(TEST_IDS.CHARACTERS.CHARACTER_AVATAR('xyz')).toBe('character-avatar-xyz');
    });
  });

  describe('NAVIGATION_SCREENS', () => {
    it('应该有所有导航屏幕名称', () => {
      expect(NAVIGATION_SCREENS.LOGIN).toBe('Login');
      expect(NAVIGATION_SCREENS.HOME).toBe('Home');
      expect(NAVIGATION_SCREENS.BOOKSHELF).toBe('Bookshelf');
      expect(NAVIGATION_SCREENS.CHARACTERS).toBe('Characters');
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('应该有所有错误消息', () => {
      expect(ERROR_MESSAGES.NETWORK_ERROR).toBeDefined();
      expect(ERROR_MESSAGES.AUTH_FAILED).toBeDefined();
      expect(ERROR_MESSAGES.SESSION_EXPIRED).toBeDefined();
    });
  });
});
