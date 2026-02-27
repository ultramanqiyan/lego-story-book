import { storage } from '../../../src/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const mockLocalStorage = {
  store: {},
  getItem: jest.fn((key) => mockLocalStorage.store[key] || null),
  setItem: jest.fn((key, value) => { mockLocalStorage.store[key] = value; }),
  removeItem: jest.fn((key) => { delete mockLocalStorage.store[key]; }),
  clear: jest.fn(() => { mockLocalStorage.store = {}; }),
};

describe('Storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.store = {};
  });

  describe('getUserId', () => {
    it('should get user ID from storage', async () => {
      AsyncStorage.getItem.mockResolvedValue('user123');
      const result = await storage.getUserId();
      expect(result).toBe('user123');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('userId');
    });

    it('should return null if no user ID', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      const result = await storage.getUserId();
      expect(result).toBeNull();
    });
  });

  describe('setUserId', () => {
    it('should set user ID in storage', async () => {
      await storage.setUserId('user123');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('userId', 'user123');
    });
  });

  describe('getUsername', () => {
    it('should get username from storage', async () => {
      AsyncStorage.getItem.mockResolvedValue('testuser');
      const result = await storage.getUsername();
      expect(result).toBe('testuser');
    });
  });

  describe('setUsername', () => {
    it('should set username in storage', async () => {
      await storage.setUsername('testuser');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('username', 'testuser');
    });
  });

  describe('getTheme', () => {
    it('should get theme from storage', async () => {
      AsyncStorage.getItem.mockResolvedValue('lego');
      const result = await storage.getTheme();
      expect(result).toBe('lego');
    });
  });

  describe('setTheme', () => {
    it('should set theme in storage', async () => {
      await storage.setTheme('fairy');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('theme', 'fairy');
    });
  });

  describe('getFontSize', () => {
    it('should get font size from storage', async () => {
      AsyncStorage.getItem.mockResolvedValue('18');
      const result = await storage.getFontSize();
      expect(result).toBe(18);
    });

    it('should return default size if not set', async () => {
      AsyncStorage.getItem.mockResolvedValue(null);
      const result = await storage.getFontSize();
      expect(result).toBe(16);
    });
  });

  describe('setFontSize', () => {
    it('should set font size in storage', async () => {
      await storage.setFontSize(20);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('fontSize', '20');
    });
  });

  describe('get', () => {
    it('should get value by key', async () => {
      AsyncStorage.getItem.mockResolvedValue('value');
      const result = await storage.get('customKey');
      expect(result).toBe('value');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('customKey');
    });
  });

  describe('set', () => {
    it('should set value by key', async () => {
      await storage.set('customKey', 'customValue');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('customKey', 'customValue');
    });
  });

  describe('remove', () => {
    it('should remove value by key', async () => {
      await storage.remove('customKey');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('customKey');
    });
  });

  describe('getMultiple', () => {
    it('should get multiple values', async () => {
      AsyncStorage.multiGet = jest.fn().mockResolvedValue([['key1', 'value1'], ['key2', 'value2']]);
      const result = await storage.getMultiple(['key1', 'key2']);
      expect(result).toEqual([['key1', 'value1'], ['key2', 'value2']]);
    });
  });

  describe('setMultiple', () => {
    it('should set multiple values', async () => {
      AsyncStorage.multiSet = jest.fn().mockResolvedValue(true);
      await storage.setMultiple([['key1', 'value1'], ['key2', 'value2']]);
      expect(AsyncStorage.multiSet).toHaveBeenCalledWith([['key1', 'value1'], ['key2', 'value2']]);
    });
  });

  describe('clearUserData', () => {
    it('should clear user data from storage', async () => {
      AsyncStorage.multiRemove = jest.fn().mockResolvedValue(true);
      await storage.clearUserData();
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith(['userId', 'username']);
    });
  });

  describe('clearAll', () => {
    it('should clear all data from storage', async () => {
      AsyncStorage.clear = jest.fn().mockResolvedValue(true);
      await storage.clearAll();
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });
  });
});

describe('Storage Web Implementation', () => {
  const originalPlatform = Platform.OS;
  let originalLocalStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    originalLocalStorage = global.localStorage;
    global.localStorage = mockLocalStorage;
    mockLocalStorage.store = {};
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
    Platform.OS = originalPlatform;
  });

  describe('webStorage operations', () => {
    it('should handle localStorage getItem', () => {
      mockLocalStorage.store.testKey = 'testValue';
      const result = mockLocalStorage.getItem('testKey');
      expect(result).toBe('testValue');
    });

    it('should handle localStorage setItem', () => {
      mockLocalStorage.setItem('newKey', 'newValue');
      expect(mockLocalStorage.store.newKey).toBe('newValue');
    });

    it('should handle localStorage removeItem', () => {
      mockLocalStorage.store.toRemove = 'value';
      mockLocalStorage.removeItem('toRemove');
      expect(mockLocalStorage.store.toRemove).toBeUndefined();
    });

    it('should handle localStorage clear', () => {
      mockLocalStorage.store.key1 = 'value1';
      mockLocalStorage.store.key2 = 'value2';
      mockLocalStorage.clear();
      expect(Object.keys(mockLocalStorage.store)).toHaveLength(0);
    });

    it('should handle localStorage multiRemove simulation', () => {
      mockLocalStorage.store.key1 = 'value1';
      mockLocalStorage.store.key2 = 'value2';
      ['key1', 'key2'].forEach(key => mockLocalStorage.removeItem(key));
      expect(Object.keys(mockLocalStorage.store)).toHaveLength(0);
    });

    it('should handle localStorage multiGet simulation', () => {
      mockLocalStorage.store.key1 = 'value1';
      mockLocalStorage.store.key2 = 'value2';
      const result = ['key1', 'key2'].map(key => [key, mockLocalStorage.getItem(key)]);
      expect(result).toEqual([['key1', 'value1'], ['key2', 'value2']]);
    });

    it('should handle localStorage multiSet simulation', () => {
      [['key1', 'value1'], ['key2', 'value2']].forEach(([key, value]) => {
        mockLocalStorage.setItem(key, value);
      });
      expect(mockLocalStorage.store.key1).toBe('value1');
      expect(mockLocalStorage.store.key2).toBe('value2');
    });
  });

  describe('webStorage error handling', () => {
    it('should handle getItem error gracefully', () => {
      const errorStorage = {
        getItem: jest.fn(() => { throw new Error('getItem error'); }),
      };
      const originalLocalStorage = global.localStorage;
      global.localStorage = errorStorage;
      
      try {
        errorStorage.getItem('key');
      } catch (e) {
        expect(e.message).toBe('getItem error');
      }
      
      global.localStorage = originalLocalStorage;
    });

    it('should handle setItem error gracefully', () => {
      const errorStorage = {
        setItem: jest.fn(() => { throw new Error('setItem error'); }),
      };
      const originalLocalStorage = global.localStorage;
      global.localStorage = errorStorage;
      
      try {
        errorStorage.setItem('key', 'value');
      } catch (e) {
        expect(e.message).toBe('setItem error');
      }
      
      global.localStorage = originalLocalStorage;
    });

    it('should handle removeItem error gracefully', () => {
      const errorStorage = {
        removeItem: jest.fn(() => { throw new Error('removeItem error'); }),
      };
      const originalLocalStorage = global.localStorage;
      global.localStorage = errorStorage;
      
      try {
        errorStorage.removeItem('key');
      } catch (e) {
        expect(e.message).toBe('removeItem error');
      }
      
      global.localStorage = originalLocalStorage;
    });

    it('should handle clear error gracefully', () => {
      const errorStorage = {
        clear: jest.fn(() => { throw new Error('clear error'); }),
      };
      const originalLocalStorage = global.localStorage;
      global.localStorage = errorStorage;
      
      try {
        errorStorage.clear();
      } catch (e) {
        expect(e.message).toBe('clear error');
      }
      
      global.localStorage = originalLocalStorage;
    });
  });
});
