/**
 * WeatherEffectV2组件 - 升级的天气特效系统
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  withSequence,
  interpolate,
  Extrapolate,
  Easing,
} from 'react-native-reanimated';
import { COLORS } from '../../utils/constants';
import { WEATHER_CONFIG, EASINGS, random, randomInt } from '../../utils/animations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============ 雨天效果 ============
const RainEffectV2 = ({ isThunder = false }) => {
  const config = WEATHER_CONFIG.rain;
  const [lightning, setLightning] = useState(false);

  // 生成雨滴配置
  const drops = useMemo(() => {
    return Array.from({ length: config.dropCount }, (_, i) => ({
      id: `rain_${i}`,
      x: random(0, SCREEN_WIDTH + 100),
      delay: random(0, 1500),
      duration: random(config.fallSpeed[0], config.fallSpeed[1]),
      length: random(config.dropLength[0], config.dropLength[1]),
      opacity: random(0.3, 0.8),
    }));
  }, []);

  // 闪电效果
  useEffect(() => {
    if (!isThunder) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setLightning(true);
        setTimeout(() => setLightning(false), 150);
      }
    }, config.lightningInterval);

    return () => clearInterval(interval);
  }, [isThunder]);

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      {/* 雨滴 */}
      {drops.map((drop) => (
        <RainDrop key={drop.id} config={drop} />
      ))}

      {/* 雾气层 */}
      <View style={styles.fogOverlay} />

      {/* 闪电 */}
      {lightning && <View style={styles.lightningFlash} />}
    </View>
  );
};

// 单个雨滴组件
const RainDrop = ({ config }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(SCREEN_HEIGHT + 50, {
          duration: config.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // 风向偏移
    translateX.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(-20, { duration: config.duration, easing: Easing.linear }),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
    ],
  }));

  return (
    <View
      style={[
        styles.rainDrop,
        {
          left: config.x,
          height: config.length,
          opacity: config.opacity,
        },
      ]}
    >
      <Animated.View style={[styles.rainDropInner, animatedStyle]} />
    </View>
  );
};

// ============ 雪天效果 ============
const SnowEffectV2 = () => {
  const config = WEATHER_CONFIG.snow;

  const flakes = useMemo(() => {
    return Array.from({ length: config.flakeCount }, (_, i) => ({
      id: `snow_${i}`,
      x: random(0, SCREEN_WIDTH),
      delay: random(0, 4000),
      duration: random(config.fallDuration[0], config.fallDuration[1]),
      size: random(10, 26),
      type: config.flakeTypes[randomInt(0, config.flakeTypes.length - 1)],
      opacity: random(0.5, 1),
      swayOffset: random(0, Math.PI * 2),
      swaySpeed: random(0.5, 1.5),
    }));
  }, []);

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      {/* 雪花 */}
      {flakes.map((flake) => (
        <SnowFlake key={flake.id} config={flake} />
      ))}

      {/* 积雪效果 */}
      <View style={styles.snowAccumulation} />

      {/* 冰霜边框 */}
      <View style={styles.frostBorder} />
    </View>
  );
};

// 单个雪花组件
const SnowFlake = ({ config }) => {
  const translateY = useSharedValue(-30);
  const sway = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    // 下落动画
    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(SCREEN_HEIGHT + 30, {
          duration: config.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );

    // 摆动动画
    sway.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(Math.PI * 2, {
          duration: 3000 / config.swaySpeed,
          easing: Easing.sin,
        }),
        -1,
        false
      )
    );

    // 旋转动画
    rotate.value = withDelay(
      config.delay,
      withRepeat(
        withTiming(360, { duration: config.duration, easing: Easing.linear }),
        -1,
        false
      )
    );

    // 缩放动画
    scale.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: config.duration / 2 }),
          withTiming(0.5, { duration: config.duration / 2 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const swayX = Math.sin(sway.value + config.swayOffset) * 30;

    return {
      transform: [
        { translateY: translateY.value },
        { translateX: swayX },
        { rotate: `${rotate.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <Animated.Text
      style={[
        styles.snowFlake,
        {
          left: config.x,
          fontSize: config.size,
          opacity: config.opacity,
        },
        animatedStyle,
      ]}
    >
      {config.type}
    </Animated.Text>
  );
};

// ============ 晴天效果 ============
const SunEffectV2 = () => {
  const config = WEATHER_CONFIG.sun;
  const rotate = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    // 旋转动画
    rotate.value = withRepeat(
      withTiming(360, { duration: config.rotationSpeed, easing: Easing.linear }),
      -1,
      false
    );

    // 脉冲动画
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: EASINGS.sine }),
        withTiming(0, { duration: 2500, easing: EASINGS.sine })
      ),
      -1,
      true
    );
  }, []);

  const raysAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  const coreAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pulse.value, [0, 1], [1, 1.15]),
      },
    ],
  }));

  // 生成尘埃粒子
  const dustParticles = useMemo(() => {
    return Array.from({ length: config.dustParticles }, (_, i) => ({
      id: `dust_${i}`,
      x: random(0, SCREEN_WIDTH),
      y: random(0, SCREEN_HEIGHT),
      size: random(2, 5),
      delay: random(0, 3000),
      duration: random(4000, 8000),
    }));
  }, []);

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      {/* 太阳光 */}
      <View style={styles.sunContainer}>
        {/* 光晕层 */}
        {[...Array(config.glowLayers)].map((_, i) => (
          <View
            key={`glow_${i}`}
            style={[
              styles.sunGlow,
              {
                width: 100 + i * 40,
                height: 100 + i * 40,
                opacity: 0.3 - i * 0.1,
              },
            ]}
          />
        ))}

        {/* 太阳核心 */}
        <Animated.View style={[styles.sunCore, coreAnimatedStyle]} />

        {/* 光线 */}
        <Animated.View style={[styles.sunRays, raysAnimatedStyle]}>
          {[...Array(config.rayCount)].map((_, i) => (
            <View
              key={`ray_${i}`}
              style={[
                styles.sunRay,
                {
                  transform: [{ rotate: `${i * (360 / config.rayCount)}deg` }],
                  height: random(config.rayLength[0], config.rayLength[1]),
                  opacity: 0.4 + Math.random() * 0.3,
                },
              ]}
            />
          ))}
        </Animated.View>
      </View>

      {/* 尘埃粒子 */}
      {dustParticles.map((dust) => (
        <DustParticle key={dust.id} config={dust} />
      ))}
    </View>
  );
};

// 尘埃粒子
const DustParticle = ({ config }) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: config.duration / 2 }),
          withTiming(0, { duration: config.duration / 2 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.dustParticle,
        {
          left: config.x,
          top: config.y,
        },
        animatedStyle,
      ]}
    />
  );
};

// ============ 雾天效果 ============
const FogEffect = () => {
  const config = WEATHER_CONFIG.fog;

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      {/* 多层雾 */}
      {[...Array(config.layerCount)].map((_, i) => (
        <FogLayer
          key={`fog_${i}`}
          index={i}
          speed={config.moveSpeed[i]}
          opacity={config.opacity[i]}
        />
      ))}
    </View>
  );
};

// 单层雾
const FogLayer = ({ index, speed, opacity }) => {
  const translateX = useSharedValue(-SCREEN_WIDTH);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(SCREEN_WIDTH, { duration: speed, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.fogLayer,
        {
          opacity,
          top: index * 100,
        },
        animatedStyle,
      ]}
    />
  );
};

// ============ 主组件 ============
const WeatherEffectV2 = ({ weather, intensity = 1 }) => {
  if (!weather) return null;

  switch (weather) {
    case 'sunny':
      return <SunEffectV2 />;
    case 'rainy':
      return <RainEffectV2 isThunder={false} />;
    case 'thunder':
      return <RainEffectV2 isThunder={true} />;
    case 'snow':
      return <SnowEffectV2 />;
    case 'fog':
      return <FogEffect />;
    default:
      return null;
  }
};

const styles = StyleSheet.create({
  weatherContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 5,
  },
  // 雨天样式
  rainDrop: {
    position: 'absolute',
    width: 2,
    backgroundColor: 'rgba(174, 194, 224, 0.8)',
    borderRadius: 1,
  },
  rainDropInner: {
    width: 2,
    height: 20,
    backgroundColor: 'rgba(174, 194, 224, 0.8)',
    borderRadius: 1,
  },
  fogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(200, 210, 230, 0.15)',
  },
  lightningFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  // 雪天样式
  snowFlake: {
    position: 'absolute',
    color: '#fff',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  snowAccumulation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
  },
  frostBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 8,
    borderColor: 'rgba(200, 220, 255, 0.15)',
    borderRadius: 20,
  },
  // 晴天样式
  sunContainer: {
    position: 'absolute',
    top: 60,
    right: 30,
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunCore: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.legoYellow,
    shadowColor: COLORS.legoYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  sunGlow: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: COLORS.legoYellow,
  },
  sunRays: {
    position: 'absolute',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunRay: {
    position: 'absolute',
    width: 3,
    backgroundColor: COLORS.legoYellow,
    borderRadius: 2,
    top: '50%',
    marginTop: -60,
    transformOrigin: 'center bottom',
  },
  dustParticle: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: COLORS.legoYellow,
    width: 5,
    height: 5,
  },
  // 雾天样式
  fogLayer: {
    position: 'absolute',
    left: -SCREEN_WIDTH,
    width: SCREEN_WIDTH * 3,
    height: 150,
    backgroundColor: 'rgba(220, 220, 230, 0.5)',
    borderRadius: 100,
  },
});

export default WeatherEffectV2;
