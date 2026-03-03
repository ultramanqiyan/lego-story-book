import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/constants';
import logger from '../utils/logger';

const LoadingScreen = () => {
  useEffect(() => {
    logger.screen.mount('LoadingScreen');
    return () => logger.screen.unmount('LoadingScreen');
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🧱</Text>
        <Text style={styles.title}>乐高故事书</Text>
        <ActivityIndicator 
          size="large" 
          color={COLORS.legoYellow} 
          style={styles.spinner}
        />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 32,
  },
  spinner: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
});

export default LoadingScreen;
