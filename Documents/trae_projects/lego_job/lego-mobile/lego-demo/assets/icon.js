import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const createIcon = () => (
  <View style={styles.container}>
    <Text style={styles.icon}>🃏</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: 1024,
    height: 1024,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 500,
  },
});
