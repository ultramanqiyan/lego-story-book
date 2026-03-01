/**
 * 3D卡牌动画Hook - 提供3D翻转、倾斜等动画控制
 */

import { useCallback, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { CARD_3D_CONFIG, EASINGS, calculateTiltAngle } from '../utils/animations';

const clamp = (value, min, max) => {
  'worklet';
  return Math.min(Math.max(value, min), max);
};

export const use3DCard = (options = {}) => {
  const {
    onFlip,
    onTilt,
    onPress,
    enableTilt = true,
    enableFlip = true,
  } = options;

  const flipProgress = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const scale = useSharedValue(1);
  const elevation = useSharedValue(3);
  const glowOpacity = useSharedValue(0);

  const cardLayout = useRef({ width: 0, height: 0, x: 0, y: 0 });

  const flipCard = useCallback(() => {
    if (!enableFlip) return;

    const targetValue = flipProgress.value > 0.5 ? 0 : 1;
    flipProgress.value = withTiming(targetValue, {
      duration: CARD_3D_CONFIG.flipDuration,
      easing: EASINGS.standard,
    });

    if (onFlip) {
      runOnJS(onFlip)(targetValue === 1);
    }
  }, [enableFlip, flipProgress, onFlip]);

  const resetTilt = useCallback(() => {
    tiltX.value = withSpring(0, { damping: 15, stiffness: 150 });
    tiltY.value = withSpring(0, { damping: 15, stiffness: 150 });
    scale.value = withTiming(1, { duration: 200 });
    elevation.value = withTiming(3, { duration: 200 });
    glowOpacity.value = withTiming(0, { duration: 200 });
  }, [tiltX, tiltY, scale, elevation, glowOpacity]);

  const updateLayout = useCallback((event) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    cardLayout.current = { width, height, x, y };
  }, []);

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = clamp(interpolate(flipProgress.value, [0, 1], [0, 180]), 0, 180);
    const frontOpacity = flipProgress.value < 0.5 ? 1 : 0;

    return {
      transform: [
        { perspective: CARD_3D_CONFIG.perspective },
        { rotateX: `${tiltX.value}deg` },
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
      ],
      opacity: frontOpacity,
      zIndex: flipProgress.value > 0.5 ? 0 : 1,
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = clamp(interpolate(flipProgress.value, [0, 1], [180, 360]), 180, 360);
    const backOpacity = flipProgress.value > 0.5 ? 1 : 0;

    return {
      transform: [
        { perspective: CARD_3D_CONFIG.perspective },
        { rotateX: `${tiltX.value}deg` },
        { rotateY: `${rotateY}deg` },
        { scale: scale.value },
      ],
      opacity: backOpacity,
      zIndex: flipProgress.value > 0.5 ? 1 : 0,
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    const shadowOpacity = clamp(interpolate(elevation.value, [0, 10], [0.1, CARD_3D_CONFIG.shadowOpacity]), 0.1, CARD_3D_CONFIG.shadowOpacity);

    return {
      shadowOpacity,
      shadowRadius: clamp(interpolate(elevation.value, [0, 10], [4, CARD_3D_CONFIG.shadowBlur]), 4, CARD_3D_CONFIG.shadowBlur),
      elevation: elevation.value,
      transform: [{ scale: scale.value }],
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const gesture = Gesture.Pan()
    .onBegin(() => {
      if (!enableTilt) return;

      scale.value = withTiming(1.05, { duration: 150 });
      elevation.value = withTiming(8, { duration: 150 });
      glowOpacity.value = withTiming(0.3, { duration: 150 });
    })
    .onUpdate((event) => {
      if (!enableTilt) return;

      const { width, height } = cardLayout.current;
      if (width === 0 || height === 0) return;

      const centerX = width / 2;
      const centerY = height / 2;

      const angles = calculateTiltAngle(
        event.x,
        event.y,
        centerX,
        centerY,
        CARD_3D_CONFIG.tiltMaxAngle
      );

      tiltX.value = angles.rotateX;
      tiltY.value = angles.rotateY;

      if (onTilt) {
        runOnJS(onTilt)(angles);
      }
    })
    .onEnd(() => {
      'worklet';
      tiltX.value = withSpring(0, { damping: 15, stiffness: 150 });
      tiltY.value = withSpring(0, { damping: 15, stiffness: 150 });
      scale.value = withTiming(1, { duration: 200 });
      elevation.value = withTiming(3, { duration: 200 });
      glowOpacity.value = withTiming(0, { duration: 200 });
    })
    .onFinalize(() => {
      'worklet';
      tiltX.value = withSpring(0, { damping: 15, stiffness: 150 });
      tiltY.value = withSpring(0, { damping: 15, stiffness: 150 });
      scale.value = withTiming(1, { duration: 200 });
      elevation.value = withTiming(3, { duration: 200 });
      glowOpacity.value = withTiming(0, { duration: 200 });
    });

  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      if (onPress) {
        runOnJS(onPress)();
      }
      if (enableFlip && !onPress) {
        const targetValue = flipProgress.value > 0.5 ? 0 : 1;
        flipProgress.value = withTiming(targetValue, {
          duration: CARD_3D_CONFIG.flipDuration,
          easing: EASINGS.standard,
        });
        if (onFlip) {
          runOnJS(onFlip)(targetValue === 1);
        }
      }
    });

  const combinedGesture = Gesture.Simultaneous(gesture, tapGesture);

  const animateSelect = useCallback((selected) => {
    if (selected) {
      scale.value = withSpring(1.1, { damping: 12, stiffness: 200 });
      elevation.value = withTiming(CARD_3D_CONFIG.selectElevation, { duration: 300 });
      glowOpacity.value = withTiming(0.6, { duration: 300 });
    } else {
      resetTilt();
    }
  }, [scale, elevation, glowOpacity, resetTilt]);

  return {
    frontAnimatedStyle,
    backAnimatedStyle,
    shadowAnimatedStyle,
    glowAnimatedStyle,
    gesture: combinedGesture,
    flipCard,
    resetTilt,
    updateLayout,
    animateSelect,
    flipProgress,
    isFlipped: () => flipProgress.value > 0.5,
  };
};

export default use3DCard;
