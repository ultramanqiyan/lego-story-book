import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import logger from './logger';

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

const webStorage = {
  async getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      logger.error('STORAGE', `getItem error for ${key}:`, e?.message || e);
      return null;
    }
  },
  async setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      logger.error('STORAGE', `setItem error for ${key}:`, e?.message || e);
      return false;
    }
  },
  async removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      logger.error('STORAGE', `removeItem error for ${key}:`, e?.message || e);
      return false;
    }
  },
  async multiRemove(keys) {
    try {
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (e) {
      logger.error('STORAGE', 'multiRemove error:', e?.message || e);
      return false;
    }
  },
  async clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      logger.error('STORAGE', 'clear error:', e?.message || e);
      return false;
    }
  },
  async multiGet(keys) {
    try {
      return keys.map(key => [key, localStorage.getItem(key)]);
    } catch (e) {
      logger.error('STORAGE', 'multiGet error:', e?.message || e);
      return keys.map(key => [key, null]);
    }
  },
  async multiSet(keyValuePairs) {
    try {
      keyValuePairs.forEach(([key, value]) => localStorage.setItem(key, value));
      return true;
    } catch (e) {
      logger.error('STORAGE', 'multiSet error:', e?.message || e);
      return false;
    }
  },
};

const storageImpl = Platform.OS === 'web' ? webStorage : AsyncStorage;

export const storage = {
  async getUserId() {
    const value = await storageImpl.getItem(STORAGE_KEYS.USER_ID);
    logger.storage.get(STORAGE_KEYS.USER_ID, value);
    return value;
  },

  async setUserId(userId) {
    logger.storage.set(STORAGE_KEYS.USER_ID);
    return storageImpl.setItem(STORAGE_KEYS.USER_ID, userId);
  },

  async getUsername() {
    const value = await storageImpl.getItem(STORAGE_KEYS.USERNAME);
    logger.storage.get(STORAGE_KEYS.USERNAME, value);
    return value;
  },

  async setUsername(username) {
    logger.storage.set(STORAGE_KEYS.USERNAME);
    return storageImpl.setItem(STORAGE_KEYS.USERNAME, username);
  },

  async getTheme() {
    const value = await storageImpl.getItem(STORAGE_KEYS.THEME);
    logger.storage.get(STORAGE_KEYS.THEME, value);
    return value;
  },

  async setTheme(theme) {
    logger.storage.set(STORAGE_KEYS.THEME);
    return storageImpl.setItem(STORAGE_KEYS.THEME, theme);
  },

  async getFontSize() {
    const size = await storageImpl.getItem(STORAGE_KEYS.FONT_SIZE);
    logger.storage.get(STORAGE_KEYS.FONT_SIZE, size);
    return size ? parseInt(size, 10) : 16;
  },

  async setFontSize(size) {
    logger.storage.set(STORAGE_KEYS.FONT_SIZE);
    return storageImpl.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
  },

  async get(key) {
    const value = await storageImpl.getItem(key);
    logger.storage.get(key, value);
    return value;
  },

  async set(key, value) {
    logger.storage.set(key);
    return storageImpl.setItem(key, value);
  },

  async remove(key) {
    logger.storage.remove(key);
    return storageImpl.removeItem(key);
  },

  async getMultiple(keys) {
    return storageImpl.multiGet(keys);
  },

  async setMultiple(keyValuePairs) {
    return storageImpl.multiSet(keyValuePairs);
  },

  async clearUserData() {
    logger.storage.clear();
    await storageImpl.multiRemove([
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USERNAME,
    ]);
  },

  async clearAll() {
    logger.storage.clear();
    return storageImpl.clear();
  },
};

export default storage;
