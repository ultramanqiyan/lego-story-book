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
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { CARD_3D_CONFIG, EASINGS, calculateTiltAngle } from '../utils/animations';

export const use3DCard = (options = {}) => {
  const {
    onFlip,
    onTilt,
    onPress, // 点击回调（新增）
    enableTilt = true,
    enableFlip = true,
  } = options;

  // 动画状态
  const flipProgress = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const scale = useSharedValue(1);
  const elevation = useSharedValue(3);
  const glowOpacity = useSharedValue(0);

  // 卡片尺寸引用
  const cardLayout = useRef({ width: 0, height: 0, x: 0, y: 0 });

  // 翻转卡片
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

  // 重置倾斜
  const resetTilt = useCallback(() => {
    tiltX.value = withSpring(0, { damping: 15, stiffness: 150 });
    tiltY.value = withSpring(0, { damping: 15, stiffness: 150 });
    scale.value = withTiming(1, { duration: 200 });
    elevation.value = withTiming(3, { duration: 200 });
    glowOpacity.value = withTiming(0, { duration: 200 });
  }, [tiltX, tiltY, scale, elevation, glowOpacity]);

  // 更新卡片布局
  const updateLayout = useCallback((event) => {
    const { width, height, x, y } = event.nativeEvent.layout;
    cardLayout.current = { width, height, x, y };
  }, []);

  // 正面动画样式
  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flipProgress.value,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP
    );

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

  // 背面动画样式
  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      flipProgress.value,
      [0, 1],
      [180, 360],
      Extrapolate.CLAMP
    );

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

  // 阴影动画样式
  const shadowAnimatedStyle = useAnimatedStyle(() => {
    const shadowOffset = interpolate(
      elevation.value,
      [0, 10],
      [2, 20],
      Extrapolate.CLAMP
    );

    const shadowOpacity = interpolate(
      elevation.value,
      [0, 10],
      [0.1, CARD_3D_CONFIG.shadowOpacity],
      Extrapolate.CLAMP
    );

    return {
      shadowOpacity,
      shadowRadius: interpolate(
        elevation.value,
        [0, 10],
        [4, CARD_3D_CONFIG.shadowBlur],
        Extrapolate.CLAMP
      ),
      elevation: elevation.value,
      transform: [{ scale: scale.value }],
    };
  });

  // 发光效果样式
  const glowAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // 手势处理器
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
      resetTilt();
    })
    .onFinalize(() => {
      resetTilt();
    });

  // 点击手势 - 根据enableFlip决定是否翻转，始终调用onPress
  const tapGesture = Gesture.Tap()
    .onEnd(() => {
      // 调用 onPress 回调
      if (onPress) {
        runOnJS(onPress)();
      }
      // 只有启用翻转时才翻转
      if (enableFlip && !onPress) {
        flipCard();
      }
    });

  // 组合手势
  const combinedGesture = Gesture.Simultaneous(gesture, tapGesture);

  // 选中状态动画 - 不再调用 onPress
  const animateSelect = useCallback((selected) => {
    if (selected) {
      scale.value = withSpring(1.1, { damping: 12, stiffness: 200 });
      elevation.value = withTiming(CARD_3D_CONFIG.selectElevation, { duration: 300 });
      glowOpacity.value = withTiming(0.6, { duration: 300 });
    } else {
      resetTilt();
    }
    // 注意：这里不再调用 onPress，避免重复触发
  }, [scale, elevation, glowOpacity, resetTilt]);

  return {
    // 动画样式
    frontAnimatedStyle,
    backAnimatedStyle,
    shadowAnimatedStyle,
    glowAnimatedStyle,
    // 手势
    gesture: combinedGesture,
    // 方法
    flipCard,
    resetTilt,
    updateLayout,
    animateSelect,
    // 状态值
    flipProgress,
    isFlipped: () => flipProgress.value > 0.5,
  };
};

export default use3DCard;
