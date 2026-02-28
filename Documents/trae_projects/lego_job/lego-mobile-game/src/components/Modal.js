import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { COLORS } from '../styles/colors';
import { SPACING } from '../styles/spacing';
import { TYPOGRAPHY } from '../styles/typography';
import { ANIMATIONS } from '../styles/animations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Modal = ({
  visible,
  children,
  title,
  onClose,
  showCloseButton = true,
  animationType = 'fade',
  overlayColor = 'rgba(0, 0, 0, 0.8)',
  style,
  contentStyle,
  testID,
}) => {
  const scale = React.useRef(new Animated.Value(0.9)).current;
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATIONS.duration.normal,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          ...ANIMATIONS.spring.gentle,
        }),
      ]).start();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIMATIONS.duration.fast,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: ANIMATIONS.duration.fast,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose && onClose();
    });
  };

  if (!visible) return null;

  return (
    <View style={styles.overlayContainer} testID={testID}>
      <Animated.View
        style={[
          styles.overlay,
          { opacity, backgroundColor: overlayColor },
        ]}
      >
        <TouchableOpacity style={styles.overlayTouch} onPress={closeModal} />
      </Animated.View>
      <Animated.View
        style={[
          styles.modalContainer,
          { transform: [{ scale }] },
          style,
        ]}
      >
        {title && (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {showCloseButton && (
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={[styles.content, contentStyle]}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayTouch: {
    flex: 1,
  },
  modalContainer: {
    width: SCREEN_WIDTH - SPACING['4xl'],
    maxWidth: 400,
    backgroundColor: COLORS.background.card,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.gold.primary,
    overflow: 'hidden',
    shadowColor: COLORS.gold.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border.gold,
  },
  title: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.gold.primary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  closeText: {
    fontSize: 18,
    color: COLORS.text.secondary,
  },
  content: {
    padding: SPACING.lg,
  },
});

export default Modal;
