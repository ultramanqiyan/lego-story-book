import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_KEYS = {
  USER_ID: 'userId',
  USERNAME: 'username',
  THEME: 'theme',
  FONT_SIZE: 'fontSize',
  CARD_2D_STYLE: 'card2DStyle',
  CARD_3D_STYLE: 'card3DStyle',
  PARTICLE_EFFECT: 'particleEffect',
  WEATHER_EFFECT: 'weatherEffect',
};

// Web 端使用 localStorage 作为备选
const webStorage = {
  async getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage getItem error:', e);
      return null;
    }
  },
  async setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('localStorage setItem error:', e);
      return false;
    }
  },
  async removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('localStorage removeItem error:', e);
      return false;
    }
  },
  async multiRemove(keys) {
    try {
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (e) {
      console.warn('localStorage multiRemove error:', e);
      return false;
    }
  },
  async clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.warn('localStorage clear error:', e);
      return false;
    }
  },
  async multiGet(keys) {
    try {
      return keys.map(key => [key, localStorage.getItem(key)]);
    } catch (e) {
      console.warn('localStorage multiGet error:', e);
      return keys.map(key => [key, null]);
    }
  },
  async multiSet(keyValuePairs) {
    try {
      keyValuePairs.forEach(([key, value]) => localStorage.setItem(key, value));
      return true;
    } catch (e) {
      console.warn('localStorage multiSet error:', e);
      return false;
    }
  },
};

// 根据平台选择存储实现
const storageImpl = Platform.OS === 'web' ? webStorage : AsyncStorage;

export const storage = {
  async getUserId() {
    return storageImpl.getItem(STORAGE_KEYS.USER_ID);
  },

  async setUserId(userId) {
    return storageImpl.setItem(STORAGE_KEYS.USER_ID, userId);
  },

  async getUsername() {
    return storageImpl.getItem(STORAGE_KEYS.USERNAME);
  },

  async setUsername(username) {
    return storageImpl.setItem(STORAGE_KEYS.USERNAME, username);
  },

  async getTheme() {
    return storageImpl.getItem(STORAGE_KEYS.THEME);
  },

  async setTheme(theme) {
    return storageImpl.setItem(STORAGE_KEYS.THEME, theme);
  },

  async getFontSize() {
    const size = await storageImpl.getItem(STORAGE_KEYS.FONT_SIZE);
    return size ? parseInt(size, 10) : 16;
  },

  async setFontSize(size) {
    return storageImpl.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
  },

  async get(key) {
    return storageImpl.getItem(key);
  },

  async set(key, value) {
    return storageImpl.setItem(key, value);
  },

  async remove(key) {
    return storageImpl.removeItem(key);
  },

  async getMultiple(keys) {
    return storageImpl.multiGet(keys);
  },

  async setMultiple(keyValuePairs) {
    return storageImpl.multiSet(keyValuePairs);
  },

  async clearUserData() {
    await storageImpl.multiRemove([
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USERNAME,
    ]);
  },

  async clearAll() {
    return storageImpl.clear();
  },
};

export default storage;
