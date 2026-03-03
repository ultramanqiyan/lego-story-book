import React, { useRef, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import logger from '../utils/logger';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const routeNameRef = useRef();

  const onReady = useCallback(() => {
    logger.nav.navigate('App', 'Navigation Ready');
  }, []);

  const onStateChange = useCallback(() => {
    logger.debug('NAV', 'Navigation state changed');
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  logger.debug('NAV', `Rendering ${isAuthenticated ? 'Main' : 'Auth'} navigator`);

  return (
    <NavigationContainer
      onReady={onReady}
      onStateChange={onStateChange}
      theme={{
        dark: false,
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border || '#E0E0E0',
          notification: theme.colors.error,
        },
      }}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
