import AsyncStorage from '@react-native-async-storage/async-storage';

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

export const storage = {
  async getUserId() {
    return AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  },

  async setUserId(userId) {
    return AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  },

  async getUsername() {
    return AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
  },

  async setUsername(username) {
    return AsyncStorage.setItem(STORAGE_KEYS.USERNAME, username);
  },

  async getTheme() {
    return AsyncStorage.getItem(STORAGE_KEYS.THEME);
  },

  async setTheme(theme) {
    return AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  async getFontSize() {
    const size = await AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE);
    return size ? parseInt(size, 10) : 16;
  },

  async setFontSize(size) {
    return AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
  },

  async get(key) {
    return AsyncStorage.getItem(key);
  },

  async set(key, value) {
    return AsyncStorage.setItem(key, value);
  },

  async remove(key) {
    return AsyncStorage.removeItem(key);
  },

  async getMultiple(keys) {
    return AsyncStorage.multiGet(keys);
  },

  async setMultiple(keyValuePairs) {
    return AsyncStorage.multiSet(keyValuePairs);
  },

  async clearUserData() {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USERNAME,
    ]);
  },

  async clearAll() {
    return AsyncStorage.clear();
  },
};

export default storage;
