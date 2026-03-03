import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { storage } from '../utils/storage';
import { usersAPI } from '../api/users';
import logger from '../utils/logger';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    logger.context.init('AuthProvider');
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    logger.auth.checkAuth('checking...');
    try {
      const userId = await storage.getUserId();
      const username = await storage.getUsername();
      
      if (userId && username) {
        logger.auth.sessionRestore(userId, username);
        setUser({ userId, username });
        setIsAuthenticated(true);
      } else {
        logger.auth.checkAuth(false);
      }
    } catch (error) {
      logger.error('AUTH', 'Auth check failed:', error?.message || error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username, email = null) => {
    logger.auth.loginStart(username);
    try {
      const data = await usersAPI.createOrLogin(username, email);
      logger.debug('AUTH', 'Login API response:', { userId: data.userId, isNewUser: data.isNewUser });
      
      await storage.setUserId(data.userId);
      await storage.setUsername(username);
      
      setUser({ userId: data.userId, username });
      setIsAuthenticated(true);
      
      logger.auth.loginSuccess(data.userId, username);
      return { success: true, userId: data.userId };
    } catch (error) {
      logger.auth.loginError(error);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    logger.auth.logout();
    try {
      await storage.clearUserData();
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      logger.error('AUTH', 'Logout failed:', error?.message || error);
      return { success: false, error: error.message };
    }
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }), [user, isLoading, isAuthenticated, login, logout, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
