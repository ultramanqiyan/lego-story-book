import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../styles/colors';
import { Loading } from '../components';

export const LoadingScreen = ({ message = '加载中...' }) => {
  return (
    <View style={styles.container}>
      <Loading size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingScreen;
