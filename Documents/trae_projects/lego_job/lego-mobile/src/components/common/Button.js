import React, { useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { COLORS } from '../../utils/constants';
import { MICRO_INTERACTION_CONFIG } from '../../utils/animations';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);
  const elevation = useSharedValue(3);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.legoYellow,
          borderColor: COLORS.legoOrange,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.legoBlue,
          borderColor: COLORS.legoBlue,
        };
      case 'success':
        return {
          backgroundColor: COLORS.legoGreen,
          borderColor: COLORS.legoGreen,
        };
      case 'danger':
        return {
          backgroundColor: COLORS.error,
          borderColor: COLORS.error,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: COLORS.legoBlue,
          borderWidth: 2,
        };
      default:
        return {
          backgroundColor: COLORS.legoYellow,
          borderColor: COLORS.legoOrange,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'md':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      case 'lg':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return COLORS.legoBlue;
    if (variant === 'primary') return COLORS.text;
    return COLORS.white;
  };

  // 微交互动画
  const handlePressIn = () => {
    scale.value = withTiming(MICRO_INTERACTION_CONFIG.button.pressScale, {
      duration: MICRO_INTERACTION_CONFIG.button.pressDuration,
    });
    elevation.value = withTiming(1, {
      duration: MICRO_INTERACTION_CONFIG.button.pressDuration,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(MICRO_INTERACTION_CONFIG.button.releaseScale, {
      damping: 15,
      stiffness: 150,
    });
    elevation.value = withTiming(3, {
      duration: MICRO_INTERACTION_CONFIG.button.releaseDuration,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    elevation: elevation.value,
    shadowOpacity: elevation.value / 10,
  }));

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        disabled && styles.disabled,
        animatedStyle,
        style,
      ]}
      activeOpacity={0.9}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              size === 'lg' && styles.textLarge,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textLarge: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;
