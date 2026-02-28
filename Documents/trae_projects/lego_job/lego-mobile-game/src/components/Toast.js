import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { TYPOGRAPHY } from '../styles/typography';
import { ANIMATIONS } from '../styles/animations';

export const TOAST_TYPES = {
  success: {
    backgroundColor: COLORS.status.success,
    iconColor: '#ffffff',
  },
  error: {
    backgroundColor: COLORS.status.error,
    iconColor: '#ffffff',
  },
  warning: {
    backgroundColor: COLORS.status.warning,
    iconColor: '#000000',
  },
  info: {
    backgroundColor: COLORS.status.info,
    iconColor: '#ffffff',
  },
};

export const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  visible,
  onClose,
  position = 'top',
  style,
  testID,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATIONS.duration.fast,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: ANIMATIONS.duration.fast,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(() => {
          hideToast();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATIONS.duration.fast,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: ANIMATIONS.duration.fast,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose && onClose();
    });
  };

  if (!visible) return null;

  const typeStyle = TOAST_TYPES[type] || TOAST_TYPES.info;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }] },
        position === 'top' ? styles.top : styles.bottom,
        { backgroundColor: typeStyle.backgroundColor },
        style,
      ]}
      testID={testID}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  top: {
    top: SPACING.xl,
  },
  bottom: {
    bottom: SPACING.xl,
  },
  message: {
    ...TYPOGRAPHY.styles.body,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default Toast;
