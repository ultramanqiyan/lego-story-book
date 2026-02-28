import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME } from '../styles/theme';

const ThemeContext = createContext(null);

const THEME_STORAGE_KEY = '@lego_game_theme';

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('dark');
  const [theme, setTheme] = useState(THEME.dark);

  useEffect(() => {
    loadStoredTheme();
  }, []);

  useEffect(() => {
    setTheme(THEME[themeName] || THEME.dark);
  }, [themeName]);

  const loadStoredTheme = async () => {
    try {
      const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme && THEME[storedTheme]) {
        setThemeName(storedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const changeTheme = async (newThemeName) => {
    try {
      if (THEME[newThemeName]) {
        setThemeName(newThemeName);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeName);
        return { success: true };
      }
      return { success: false, error: 'Invalid theme name' };
    } catch (error) {
      console.error('Change theme failed:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleTheme = async () => {
    const newThemeName = themeName === 'dark' ? 'light' : 'dark';
    return changeTheme(newThemeName);
  };

  const value = {
    themeName,
    theme,
    changeTheme,
    toggleTheme,
    isDark: themeName === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
