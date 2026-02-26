import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, 
  Animated, Dimensions, Modal, Platform, Easing, PanResponder
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  bgDark: '#0d0d14',
  bgMedium: '#1a1a2e',
  bgLight: '#252542',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  gold: '#ffd700',
  goldDark: '#b8860b',
  silver: '#c0c0c0',
  crimson: '#dc2626',
  purple: '#a855f7',
  green: '#22c55e',
  blue: '#3b82f6',
  orange: '#f59e0b',
  white: '#FFFFFF',
  cardBg: '#2d2d44',
};

const EASING = {
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  smooth: Easing.out(Easing.cubic),
  enter: Easing.out(Easing.quad),
  exit: Easing.in(Easing.quad),
};

const DEMOS = [
  { id: 'login', title: 'Demo 1', subtitle: '登录页面 - 冒险者入场', icon: '🧙', color: COLORS.gold },
  { id: 'home', title: 'Demo 2', subtitle: '主页 - 故事世界大厅', icon: '🏰', color: COLORS.purple },
  { id: 'director', title: 'Demo 3', subtitle: '故事导演台 - 天气特效', icon: '🎬', color: COLORS.crimson },
  { id: 'reader', title: 'Demo 4', subtitle: '章节阅读 - 沉浸体验', icon: '📖', color: COLORS.blue },
  { id: 'collection', title: 'Demo 5', subtitle: '角色收集 - 卡牌图鉴', icon: '🎭', color: COLORS.green },
];

export function DemoNavigator({ navigation }) {
  const fadeAnims = useRef(DEMOS.map(() => new Animated.Value(0))).current;
  const slideAnims = useRef(DEMOS.map(() => new Animated.Value(-30))).current;

  useEffect(() => {
    DEMOS.forEach((_, index) => {
      Animated.parallel([
        Animated.timing(fadeAnims[index], {
          toValue: 1,
          duration: 500,
          delay: 300 + index * 100,
          easing: EASING.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnims[index], {
          toValue: 0,
          duration: 500,
          delay: 300 + index * 100,
          easing: EASING.bounce,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  return (
    <View style={styles.container}>
      <EnhancedParticleBackground />
      <GlowOrbBackground />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>桌游风格Demo展示</Text>
        <View style={{ width: 60 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.demoList}>
        <Animated.Text style={[styles.introText, { opacity: fadeAnims[0] }]}>
          ✨ 增强动画版本 ✨{'\n'}
          灵感来源于《三国杀》、《炉石传说》等卡牌桌游{'\n'}
          点击下方卡片查看Demo效果
        </Animated.Text>
        
        {DEMOS.map((demo, index) => (
          <Animated.View
            key={demo.id}
            style={{
              opacity: fadeAnims[index],
              transform: [{ translateX: slideAnims[index] }],
            }}
          >
            <TouchableOpacity
              style={[styles.demoCard, { borderLeftColor: demo.color }]}
              onPress={() => navigation.navigate(`Demo${index + 1}`)}
              activeOpacity={0.8}
            >
              <Animated.Text style={styles.demoIcon}>{demo.icon}</Animated.Text>
              <View style={styles.demoInfo}>
                <Text style={styles.demoTitle}>{demo.title}</Text>
                <Text style={styles.demoSubtitle}>{demo.subtitle}</Text>
              </View>
              <Text style={styles.demoArrow}>→</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

function EnhancedParticleBackground() {
  const particles = useRef([]);
  const animations = useRef([]);

  useEffect(() => {
    const particleCount = 30;
    particles.current = [...Array(particleCount)].map((_, i) => ({
      x: Math.random() * SCREEN_WIDTH,
      y: SCREEN_HEIGHT + 20,
      type: ['star', 'diamond', 'circle'][Math.floor(Math.random() * 3)],
      color: [COLORS.gold, COLORS.purple, COLORS.blue, COLORS.green][Math.floor(Math.random() * 4)],
      size: 2 + Math.random() * 6,
      duration: 12000 + Math.random() * 10000,
      delay: Math.random() * 15000,
    }));

    animations.current = particles.current.map((p, i) => {
      const anim = new Animated.Value(0);
      return { anim, config: p };
    });

    animations.current.forEach(({ anim }, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(particles.current[i].delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: particles.current[i].duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.particleContainer} pointerEvents="none">
      {animations.current.map(({ anim, config }, i) => {
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -SCREEN_HEIGHT - 100],
        });
        const translateX = anim.interpolate({
          inputRange: [0, 0.25, 0.5, 0.75, 1],
          outputRange: [0, 30, -20, 25, -15],
        });
        const scale = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.3, 0.8, 1.2],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 0.1, 0.9, 1],
          outputRange: [0, 0.8, 0.4, 0],
        });
        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              config.type === 'star' && styles.particleStar,
              config.type === 'diamond' && styles.particleDiamond,
              {
                left: config.x,
                width: config.size,
                height: config.size,
                backgroundColor: config.color,
                borderBottomColor: config.color,
                opacity,
                transform: [
                  { translateY },
                  { translateX },
                  { scale },
                  { rotate },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function GlowOrbBackground() {
  const goldAnim = useRef(new Animated.ValueXY({ x: 0.1, y: 0.2 })).current;
  const purpleAnim = useRef(new Animated.ValueXY({ x: 0.8, y: 0.7 })).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(goldAnim, { toValue: { x: 0.6, y: 0.1 }, duration: 6000, useNativeDriver: true }),
        Animated.timing(goldAnim, { toValue: { x: 0.8, y: 0.6 }, duration: 6000, useNativeDriver: true }),
        Animated.timing(goldAnim, { toValue: { x: 0.3, y: 0.8 }, duration: 6500, useNativeDriver: true }),
        Animated.timing(goldAnim, { toValue: { x: 0.1, y: 0.2 }, duration: 6500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(purpleAnim, { toValue: { x: 0.2, y: 0.8 }, duration: 7500, useNativeDriver: true }),
        Animated.timing(purpleAnim, { toValue: { x: 0.1, y: 0.3 }, duration: 7500, useNativeDriver: true }),
        Animated.timing(purpleAnim, { toValue: { x: 0.7, y: 0.2 }, duration: 7500, useNativeDriver: true }),
        Animated.timing(purpleAnim, { toValue: { x: 0.8, y: 0.7 }, duration: 7500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.glowContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.glowOrb,
          styles.glowOrbGold,
          {
            left: goldAnim.x.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            top: goldAnim.y.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowOrb,
          styles.glowOrbPurple,
          {
            left: purpleAnim.x.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            top: purpleAnim.y.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

export function Demo1Login({ navigation }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.5)).current;
  const cardAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  const cardScales = useRef([new Animated.Value(0.5), new Animated.Value(0.5), new Animated.Value(0.5)]).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const buttonGlow = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const gemRotate = useRef(new Animated.Value(0)).current;

  const characters = [
    { id: 1, name: '法师', icon: '🧙', role: '主角', attack: 5, health: 8, roleColor: COLORS.gold },
    { id: 2, name: '战士', icon: '🦸', role: '反派', attack: 7, health: 6, roleColor: COLORS.crimson },
    { id: 3, name: '精灵', icon: '🧝', role: '配角', attack: 2, health: 4, roleColor: COLORS.silver },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    cardAnims.forEach((anim, index) => {
      Animated.sequence([
        Animated.delay(100 + index * 100),
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(cardScales[index], {
          toValue: 1,
          tension: 80,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });

    Animated.sequence([
      Animated.delay(500),
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        easing: EASING.smooth,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(gemRotate, { toValue: 1, duration: 2000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  useEffect(() => {
    if (selectedCard) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonGlow, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(buttonGlow, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [selectedCard]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  const gemRotation = gemRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <EnhancedParticleBackground />
      <GlowOrbBackground />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo 1: 冒险者入场</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.loginContent}>
        <View style={styles.titleContainer}>
          <Animated.Text 
            style={[
              styles.loginTitle, 
              { 
                opacity: titleAnim,
                transform: [{ scale: titleScale }],
              }
            ]}
          >
            🧱 乐高故事书
          </Animated.Text>
          <Animated.Text style={[styles.loginSubtitle, { opacity: titleAnim }]}>
            选择你的角色，开始冒险
          </Animated.Text>
        </View>

        <View style={styles.fanContainer}>
          {characters.map((char, index) => {
            const isSelected = selectedCard === char.id;
            const rotation = (index - 1) * 18;
            
            const cardY = cardAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [200, 0],
            });

            const cardRotateX = cardAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['-45deg', '0deg'],
            });

            const selectedScale = isSelected ? 1.2 : 1;
            const selectedY = isSelected ? -40 : 0;

            return (
              <Animated.View
                key={char.id}
                style={{
                  opacity: cardAnims[index],
                  transform: [
                    { translateY: cardY },
                    { rotateX: cardRotateX },
                    { scale: cardScales[index] },
                    { rotate: `${rotation}deg` },
                    { translateX: (index - 1) * 15 },
                    { scale: selectedScale },
                    { translateY: selectedY },
                  ],
                  zIndex: isSelected ? 20 : index === 1 ? 10 : 1,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.fanCard,
                    isSelected && styles.fanCardSelected,
                  ]}
                  onPress={() => setSelectedCard(isSelected ? null : char.id)}
                  activeOpacity={0.9}
                >
                  <View style={[styles.roleTag, { backgroundColor: char.roleColor }]}>
                    <Text style={styles.roleTagText}>{char.role}</Text>
                  </View>
                  <Text style={styles.fanCardIcon}>{char.icon}</Text>
                  <Text style={styles.fanCardName}>{char.name}</Text>
                  <View style={styles.cardStats}>
                    <Animated.View style={[styles.statGem, styles.statGemAttack, { transform: [{ rotate: gemRotation }] }]}>
                      <Text style={styles.statGemText}>{char.attack}</Text>
                    </Animated.View>
                    <Animated.View style={[styles.statGem, styles.statGemHealth, { transform: [{ rotate: gemRotation }] }]}>
                      <Text style={styles.statGemText}>{char.health}</Text>
                    </Animated.View>
                  </View>
                  {isSelected && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View style={{ opacity: buttonAnim, transform: [{ translateY }] }}>
          <TouchableOpacity
            style={[
              styles.startButton, 
              !selectedCard && styles.startButtonDisabled,
              selectedCard && styles.startButtonActive,
            ]}
            disabled={!selectedCard}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>🎮 开始冒险</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

export function Demo2Home({ navigation }) {
  const welcomeAnim = useRef(new Animated.Value(0)).current;
  const welcomeRotateX = useRef(new Animated.Value(-1)).current;
  const featureAnims = useRef([...Array(4)].map(() => new Animated.Value(0))).current;
  const cardAnims = useRef([...Array(4)].map(() => new Animated.Value(0))).current;

  const stories = [
    { id: 1, title: '龙之传说', chapters: 5, rating: 4.8, icon: '🐉' },
    { id: 2, title: '魔法森林', chapters: 3, rating: 4.5, icon: '🌲' },
  ];

  const characters = [
    { id: 1, name: '法师', icon: '🧙', rarity: 'legendary', role: '主角', attack: 5, health: 8 },
    { id: 2, name: '战士', icon: '🦸', rarity: 'epic', role: '反派', attack: 7, health: 6 },
    { id: 3, name: '精灵', icon: '🧝', rarity: 'rare', role: '配角', attack: 2, health: 4 },
    { id: 4, name: '王子', icon: '🤴', rarity: 'legendary', role: '主角', attack: 4, health: 5 },
  ];

  const rarityColors = {
    common: COLORS.silver,
    rare: COLORS.blue,
    epic: COLORS.purple,
    legendary: COLORS.gold
  };

  useEffect(() => {
    Animated.parallel([
      Animated.timing(welcomeAnim, {
        toValue: 1,
        duration: 800,
        easing: EASING.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeRotateX, {
        toValue: 0,
        duration: 800,
        easing: EASING.bounce,
        useNativeDriver: true,
      }),
    ]).start();

    featureAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 400 + index * 100,
        useNativeDriver: true,
      }).start();
    });

    cardAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        delay: 100 + index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const rotateX = welcomeRotateX.interpolate({
    inputRange: [-1, 0],
    outputRange: ['-90deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <EnhancedParticleBackground />
      <GlowOrbBackground />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo 2: 故事世界大厅</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.homeScroll}>
        <Animated.View 
          style={[
            styles.welcomeSection,
            { 
              opacity: welcomeAnim,
              transform: [{ rotateX }, { perspective: 1000 }],
            }
          ]}
        >
          <Text style={styles.welcomeTitle}>🏰 欢迎来到乐高故事世界</Text>
          <Text style={styles.welcomeDesc}>在这里，你可以：</Text>
          {['选择你喜欢的乐高人仔作为故事角色', '创建属于你自己的冒险故事', '解答有趣的谜题推进剧情', '与朋友分享你的故事'].map((text, index) => (
            <Animated.Text 
              key={index}
              style={[
                styles.featureItem,
                { opacity: featureAnims[index], transform: [{ translateX: featureAnims[index].interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }
              ]}
            >
              • {text}
            </Animated.Text>
          ))}
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 热门人仔</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardScroll}
          >
            {characters.map((char, index) => {
              const translateX = cardAnims[index].interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              });

              return (
                <Animated.View
                  key={char.id}
                  style={{
                    opacity: cardAnims[index],
                    transform: [{ translateX }],
                  }}
                >
                  <View
                    style={[
                      styles.characterCard,
                      { borderColor: rarityColors[char.rarity] }
                    ]}
                  >
                    <View style={[styles.roleTag, { backgroundColor: char.role === '主角' ? COLORS.gold : char.role === '反派' ? COLORS.crimson : COLORS.silver }]}>
                      <Text style={styles.roleTagText}>{char.role}</Text>
                    </View>
                    <Text style={styles.characterIcon}>{char.icon}</Text>
                    <Text style={styles.characterName}>{char.name}</Text>
                    <View style={styles.cardStats}>
                      <View style={[styles.statGem, styles.statGemAttack]}>
                        <Text style={styles.statGemText}>{char.attack}</Text>
                      </View>
                      <View style={[styles.statGem, styles.statGemHealth]}>
                        <Text style={styles.statGemText}>{char.health}</Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 最近故事</Text>
          {stories.map((story, index) => (
            <View key={story.id} style={styles.storyCard}>
              <Text style={styles.storyIcon}>{story.icon}</Text>
              <View style={styles.storyInfo}>
                <Text style={styles.storyTitle}>{story.title}</Text>
                <Text style={styles.storyMeta}>{story.chapters}章 · ⭐{story.rating}</Text>
              </View>
              <Text style={styles.storyArrow}>→</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

export function Demo3Director({ navigation }) {
  const [selections, setSelections] = useState({
    adventure: null,
    terrain: null,
    weather: null,
    character: null
  });
  const [currentWeather, setCurrentWeather] = useState(null);
  const slotAnims = useRef({}).current;

  const adventures = [
    { id: 'explore', name: '探险', icon: '🏰' },
    { id: 'mystery', name: '解谜', icon: '🔍' },
    { id: 'rescue', name: '救援', icon: '🦸' },
  ];

  const terrains = [
    { id: 'forest', name: '森林', icon: '🌲' },
    { id: 'mountain', name: '山脉', icon: '🏔️' },
    { id: 'ocean', name: '海洋', icon: '🌊' },
  ];

  const weathers = [
    { id: 'sunny', name: '晴天', icon: '☀️' },
    { id: 'rainy', name: '雨天', icon: '🌧️' },
    { id: 'snow', name: '雪天', icon: '❄️' },
  ];

  const characters = [
    { id: 'mage', name: '法师', icon: '🧙' },
    { id: 'warrior', name: '战士', icon: '🦸' },
    { id: 'elf', name: '精灵', icon: '🧝' },
  ];

  const selectCard = (type, item) => {
    const wasSelected = selections[type]?.id === item.id;
    setSelections(prev => ({
      ...prev,
      [type]: wasSelected ? null : item
    }));
    
    if (!wasSelected) {
      slotAnims[type] = new Animated.Value(0);
      Animated.spring(slotAnims[type], {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
    
    if (type === 'weather') {
      setCurrentWeather(wasSelected ? null : item.id);
    }
  };

  const isReady = selections.adventure && selections.terrain && selections.weather && selections.character;

  return (
    <View style={styles.container}>
      {currentWeather && <EnhancedWeatherEffect type={currentWeather} />}
      <EnhancedParticleBackground />
      <GlowOrbBackground />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo 3: 故事导演台</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.directorScroll}>
        <View style={styles.stageArea}>
          <Text style={styles.stageTitle}>🎭 舞台预览</Text>
          <View style={styles.stageGrid}>
            {[
              { key: 'character', label: '主角', icon: '👑' },
              { key: 'adventure', label: '冒险', icon: '🗺️' },
              { key: 'terrain', label: '地形', icon: '🏔️' },
              { key: 'weather', label: '天气', icon: '🌤️' },
            ].map(slot => {
              const isSelected = !!selections[slot.key];
              const anim = slotAnims[slot.key] || new Animated.Value(1);
              
              return (
                <Animated.View 
                  key={slot.key} 
                  style={[
                    styles.stageSlot,
                    isSelected && styles.stageSlotFilled,
                    { transform: [{ scale: isSelected ? anim : 1 }] }
                  ]}
                >
                  {selections[slot.key] ? (
                    <>
                      <Text style={styles.slotIcon}>{selections[slot.key].icon}</Text>
                      <Text style={styles.slotLabel}>{selections[slot.key].name}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.slotIcon}>{slot.icon}</Text>
                      <Text style={styles.slotLabel}>{slot.label}</Text>
                    </>
                  )}
                </Animated.View>
              );
            })}
          </View>
        </View>

        <CardSection
          title="🗺️ 冒险类型"
          color={COLORS.purple}
          cards={adventures}
          selected={selections.adventure}
          onSelect={(item) => selectCard('adventure', item)}
        />

        <CardSection
          title="🏔️ 地形"
          color={COLORS.green}
          cards={terrains}
          selected={selections.terrain}
          onSelect={(item) => selectCard('terrain', item)}
        />

        <CardSection
          title="🌤️ 天气"
          color={COLORS.blue}
          cards={weathers}
          selected={selections.weather}
          onSelect={(item) => selectCard('weather', item)}
        />

        <CardSection
          title="👥 角色"
          color={COLORS.gold}
          cards={characters}
          selected={selections.character}
          onSelect={(item) => selectCard('character', item)}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.requirements}>
          {['主角', '冒险', '地形', '天气'].map((req, i) => {
            const keys = ['character', 'adventure', 'terrain', 'weather'];
            const isMet = !!selections[keys[i]];
            return (
              <View key={req} style={styles.reqItem}>
                <View style={[styles.reqDot, isMet && styles.reqDotMet]}>
                  {isMet && <Text style={styles.reqDotText}>✓</Text>}
                </View>
                <Text style={[styles.reqText, isMet && styles.reqTextMet]}>{req}</Text>
              </View>
            );
          })}
        </View>
        <TouchableOpacity style={[styles.actionButton, isReady && styles.actionButtonReady]}>
          <Text style={styles.actionButtonText}>🎬 开拍！</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CardSection({ title, color, cards, selected, onSelect }) {
  const cardAnims = useRef(cards.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    cardAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  return (
    <View style={styles.cardSection}>
      <View style={[styles.sectionHeader, { backgroundColor: color + '20', borderColor: color }]}>
        <Text style={[styles.sectionHeaderText, { color }]}>{title}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
        {cards.map((card, index) => {
          const isSelected = selected?.id === card.id;
          const translateY = cardAnims[index].interpolate({
            inputRange: [0, 1],
            outputRange: [30, 0],
          });

          return (
            <Animated.View
              key={card.id}
              style={{
                opacity: cardAnims[index],
                transform: [
                  { translateY },
                  { scale: isSelected ? 1.05 : 1 },
                  { translateY: isSelected ? -12 : 0 },
                ],
              }}
            >
              <TouchableOpacity
                style={[
                  styles.selectCard,
                  {
                    borderColor: isSelected ? color : 'rgba(255,255,255,0.2)',
                    backgroundColor: isSelected ? color + '20' : COLORS.cardBg,
                  }
                ]}
                onPress={() => onSelect(card)}
                activeOpacity={0.8}
              >
                <Text style={styles.selectCardIcon}>{card.icon}</Text>
                <Text style={styles.selectCardName}>{card.name}</Text>
                {isSelected && (
                  <View style={[styles.selectCardBadge, { backgroundColor: color }]}>
                    <Text style={styles.selectCardBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function EnhancedWeatherEffect({ type }) {
  if (type === 'rainy') {
    return <RainEffect />;
  }
  if (type === 'snow') {
    return <SnowEffect />;
  }
  if (type === 'sunny') {
    return <SunEffect />;
  }
  return null;
}

function RainEffect() {
  const drops = useRef([...Array(80)].map((_, i) => ({
    x: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 2000,
    duration: 400 + Math.random() * 400,
    opacity: 0.3 + Math.random() * 0.5,
  }))).current;

  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFlash(true);
        setTimeout(() => setFlash(false), 150);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      {drops.map((drop, i) => (
        <AnimatedRainDrop key={i} config={drop} />
      ))}
      {flash && <View style={styles.lightningFlash} />}
    </View>
  );
}

function AnimatedRainDrop({ config }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, SCREEN_HEIGHT + 30],
  });

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <Animated.View
      style={[
        styles.rainDrop,
        {
          left: config.x,
          opacity: config.opacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
}

function SnowEffect() {
  const flakes = useRef([...Array(50)].map((_, i) => ({
    x: Math.random() * SCREEN_WIDTH,
    delay: Math.random() * 5000,
    duration: 4000 + Math.random() * 5000,
    size: 12 + Math.random() * 20,
    opacity: 0.5 + Math.random() * 0.5,
  }))).current;

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      {flakes.map((flake, i) => (
        <AnimatedSnowFlake key={i} config={flake} />
      ))}
      <View style={styles.frostOverlay} />
    </View>
  );
}

function AnimatedSnowFlake({ config }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, SCREEN_HEIGHT + 30],
  });

  const translateX = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 30, -20],
  });

  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.5, 1, 0.8],
  });

  return (
    <Animated.Text
      style={[
        styles.snowFlake,
        {
          left: config.x,
          fontSize: config.size,
          opacity: config.opacity,
          transform: [{ translateY }, { translateX }, { rotate }, { scale }],
        },
      ]}
    >
      ❄
    </Animated.Text>
  );
}

function SunEffect() {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 30000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, []);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.weatherContainer} pointerEvents="none">
      <View style={styles.sunContainer}>
        <Animated.View style={[styles.sunCore, { transform: [{ scale }] }]} />
        <Animated.View style={[styles.sunRays, { transform: [{ rotate }] }]}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={[styles.sunRay, { transform: [{ rotate: `${i * 45}deg` }] }]} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

export function Demo4Reader({ navigation }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(-40)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const paragraphAnims = useRef([...Array(3)].map(() => new Animated.Value(0))).current;
  const puzzleAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const story = {
    title: '第一章：启程',
    paragraphs: [
      '在一个阳光明媚的早晨，勇敢的骑士【艾德蒙】骑着他忠诚的战马，穿过了古老的森林。',
      '远处，高耸的城堡在晨光中闪烁着金色的光芒。',
      '他知道，一场伟大的冒险即将开始...',
    ],
    puzzle: {
      question: '骑士应该选择哪条路？',
      options: ['A. 穿越黑暗森林', 'B. 绕道阳光大道', 'C. 等待夜幕降临'],
      answer: 'B'
    }
  };

  useEffect(() => {
    Animated.parallel([
      Animated.spring(titleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      Animated.spring(titleY, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.timing(underlineAnim, {
      toValue: 1,
      duration: 600,
      delay: 500,
      useNativeDriver: true,
    }).start();

    paragraphAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 600,
        delay: 300 + index * 200,
        useNativeDriver: true,
      }).start();
    });

    Animated.timing(puzzleAnim, {
      toValue: 1,
      duration: 800,
      delay: 900,
      easing: EASING.bounce,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);

    Animated.spring(resultAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    if (answer !== story.puzzle.answer) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  const underlineWidth = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '80%'],
  });

  const shakeTranslateX = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-10, 0, 10],
  });

  return (
    <View style={styles.container}>
      <EnhancedParticleBackground />
      <GlowOrbBackground />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo 4: 沉浸式阅读</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.readerScroll}>
        <View style={styles.chapterTitleContainer}>
          <Animated.Text 
            style={[
              styles.chapterTitle, 
              { 
                opacity: titleAnim,
                transform: [{ translateY: titleY }],
              }
            ]}
          >
            {story.title}
          </Animated.Text>
          <Animated.View style={[styles.chapterUnderline, { width: underlineWidth }]} />
        </View>

        {story.paragraphs.map((para, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.paragraph, 
              { 
                opacity: paragraphAnims[index],
                transform: [{ translateY: paragraphAnims[index].interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }],
              }
            ]}
          >
            {para.split(/【.*?】/).map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <Text style={styles.keyword}>【艾德蒙】</Text>}
              </React.Fragment>
            ))}
          </Animated.Text>
        ))}

        {!showResult && (
          <Animated.View style={{ opacity: puzzleAnim, transform: [{ scale: puzzleAnim }] }}>
            <View style={styles.puzzleCard}>
              <Text style={styles.puzzleTitle}>🧩 谜题挑战</Text>
              <Text style={styles.puzzleQuestion}>{story.puzzle.question}</Text>
              {story.puzzle.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.puzzleOption}
                  onPress={() => handleAnswer(option.charAt(0))}
                  activeOpacity={0.8}
                >
                  <Text style={styles.puzzleOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {showResult && (
          <Animated.View 
            style={[
              styles.resultCard,
              selectedAnswer === story.puzzle.answer ? styles.resultCorrect : styles.resultWrong,
              { 
                opacity: resultAnim,
                transform: [{ translateX: shakeTranslateX }, { scale: resultAnim }],
              }
            ]}
          >
            <Text style={styles.resultIcon}>
              {selectedAnswer === story.puzzle.answer ? '🎉' : '😅'}
            </Text>
            <Text style={styles.resultTitle}>
              {selectedAnswer === story.puzzle.answer ? '回答正确！' : '答错了'}
            </Text>
            <Text style={styles.resultText}>
              {selectedAnswer === story.puzzle.answer 
                ? '你选择了明智的道路！' 
                : `正确答案是 ${story.puzzle.answer}`}
            </Text>
          </Animated.View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

export function Demo5Collection({ navigation }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [showReveal, setShowReveal] = useState(false);
  const cardAnims = useRef([...Array(8)].map(() => new Animated.Value(0))).current;
  const detailAnim = useRef(new Animated.Value(0)).current;
  const revealAnim = useRef(new Animated.Value(0)).current;
  const revealRotate = useRef(new Animated.Value(0)).current;
  const revealScale = useRef(new Animated.Value(0.5)).current;

  const cards = [
    { id: 1, name: '法师', icon: '🧙', rarity: 'legendary', stars: 4 },
    { id: 2, name: '战士', icon: '🦸', rarity: 'epic', stars: 3 },
    { id: 3, name: '精灵', icon: '🧝', rarity: 'rare', stars: 2 },
    { id: 4, name: '王子', icon: '🤴', rarity: 'common', stars: 1 },
    { id: 5, name: '吸血鬼', icon: '🧛', rarity: 'epic', stars: 3 },
    { id: 6, name: '美人鱼', icon: '🧜', rarity: 'rare', stars: 2 },
    { id: 7, name: '英雄', icon: '🦹', rarity: 'legendary', stars: 4 },
    { id: 8, name: '妖怪', icon: '👺', rarity: 'common', stars: 1 },
  ];

  const rarityColors = {
    common: COLORS.silver,
    rare: COLORS.blue,
    epic: COLORS.purple,
    legendary: COLORS.gold
  };

  useEffect(() => {
    cardAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  useEffect(() => {
    if (selectedCard) {
      Animated.spring(detailAnim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(detailAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedCard]);

  useEffect(() => {
    if (showReveal) {
      Animated.parallel([
        Animated.spring(revealAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.spring(revealScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
        Animated.timing(revealRotate, { toValue: 1, duration: 1000, easing: EASING.bounce, useNativeDriver: true }),
      ]).start();
    } else {
      revealAnim.setValue(0);
      revealRotate.setValue(0);
      revealScale.setValue(0.5);
    }
  }, [showReveal]);

  const detailTranslateY = detailAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const revealRotateVal = revealRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-20deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <EnhancedParticleBackground />
      <GlowOrbBackground />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Demo 5: 角色图鉴</Text>
        <TouchableOpacity onPress={() => setShowReveal(true)}>
          <Text style={styles.revealButton}>🎁</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.collectionInfo}>
        <Text style={styles.collectionText}>已收集: 12/50</Text>
      </View>

      <ScrollView>
        <View style={styles.cardGrid}>
          {cards.map((card, index) => {
            const isSelected = selectedCard?.id === card.id;
            const scale = cardAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            });

            return (
              <Animated.View
                key={card.id}
                style={{
                  opacity: cardAnims[index],
                  transform: [{ scale }, { scale: isSelected ? 1.15 : 1 }],
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.collectionCard,
                    { borderColor: rarityColors[card.rarity] }
                  ]}
                  onPress={() => setSelectedCard(isSelected ? null : card)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.collectionIcon}>{card.icon}</Text>
                  <Text style={styles.collectionName}>{card.name}</Text>
                  <Text style={styles.collectionStars}>
                    {'⭐'.repeat(card.stars)}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {selectedCard && (
        <Animated.View style={[styles.cardDetail, { transform: [{ translateY: detailTranslateY }] }]}>
          <Text style={styles.cardDetailIcon}>{selectedCard.icon}</Text>
          <Text style={styles.cardDetailName}>{selectedCard.name}</Text>
          <Text style={styles.cardDetailRarity}>
            稀有度: {'⭐'.repeat(selectedCard.stars)}
          </Text>
          <TouchableOpacity style={styles.useButton}>
            <Text style={styles.useButtonText}>使用此角色</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Modal visible={showReveal} transparent animationType="fade">
        <View style={styles.revealModal}>
          <View style={styles.revealContent}>
            <Animated.View 
              style={[
                styles.revealCard,
                {
                  opacity: revealAnim,
                  transform: [
                    { rotate: revealRotateVal },
                    { scale: revealScale },
                  ],
                }
              ]}
            >
              <View style={styles.revealShine} />
              <Text style={styles.revealCardIcon}>🐉</Text>
              <Text style={styles.revealCardName}>龙骑士</Text>
              <Text style={styles.revealCardRarity}>⭐⭐⭐⭐</Text>
            </Animated.View>
            <Animated.Text style={[styles.revealText, { opacity: revealAnim }]}>
              🎉 获得新角色！
            </Animated.Text>
            <TouchableOpacity style={styles.revealCloseButton} onPress={() => setShowReveal(false)}>
              <Text style={styles.revealCloseText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    bottom: 0,
  },
  particleStar: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  particleDiamond: {
    transform: [{ rotate: '45deg' }],
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  glowOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.3,
  },
  glowOrbGold: {
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
  },
  glowOrbPurple: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: COLORS.purple,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: COLORS.bgMedium,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    fontSize: 16,
    color: COLORS.gold,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  introText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  demoList: {
    padding: 16,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  demoIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  demoInfo: {
    flex: 1,
  },
  demoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  demoSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  demoArrow: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  loginContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.gold,
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  fanContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: 220,
    marginBottom: 40,
  },
  fanCard: {
    width: 110,
    height: 150,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 3,
    marginHorizontal: -18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  fanCardSelected: {
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  roleTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  roleTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
  },
  fanCardIcon: {
    fontSize: 52,
    marginBottom: 4,
  },
  fanCardName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  cardStats: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statGem: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statGemAttack: {
    backgroundColor: COLORS.orange,
  },
  statGemHealth: {
    backgroundColor: COLORS.crimson,
  },
  statGemText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  selectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  startButton: {
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 56,
    overflow: 'hidden',
  },
  startButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  startButtonActive: {
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  homeScroll: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    margin: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 12,
  },
  welcomeDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gold,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  cardScroll: {
    paddingHorizontal: 12,
  },
  characterCard: {
    width: 140,
    height: 180,
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 3,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  storyIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  storyInfo: {
    flex: 1,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  storyMeta: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  storyArrow: {
    fontSize: 18,
    color: COLORS.textMuted,
  },
  directorScroll: {
    flex: 1,
  },
  stageArea: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  stageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stageSlot: {
    width: '23%',
    aspectRatio: 0.75,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stageSlotFilled: {
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.gold,
    borderStyle: 'solid',
  },
  slotIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  slotLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  cardSection: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardRow: {
    paddingHorizontal: 12,
  },
  selectCard: {
    width: 90,
    height: 120,
    borderRadius: 14,
    borderWidth: 2,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCardIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  selectCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  selectCardBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectCardBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  requirements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reqDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqDotMet: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  reqDotText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  reqText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  reqTextMet: {
    color: COLORS.green,
  },
  actionButton: {
    backgroundColor: COLORS.textMuted,
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  actionButtonReady: {
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  weatherContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  rainDrop: {
    position: 'absolute',
    width: 3,
    height: 25,
    backgroundColor: 'rgba(174,194,224,0.8)',
    borderRadius: 2,
  },
  snowFlake: {
    position: 'absolute',
    color: '#fff',
  },
  lightningFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  frostOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(200,220,255,0.1)',
  },
  sunContainer: {
    position: 'absolute',
    top: 80,
    right: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunCore: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  sunRays: {
    position: 'absolute',
    width: 150,
    height: 150,
  },
  sunRay: {
    position: 'absolute',
    top: 75,
    left: 73,
    width: 4,
    height: 40,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    opacity: 0.6,
  },
  readerScroll: {
    flex: 1,
    padding: 20,
  },
  chapterTitleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chapterTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.gold,
    textAlign: 'center',
  },
  chapterUnderline: {
    height: 2,
    backgroundColor: COLORS.gold,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 18,
    color: COLORS.textPrimary,
    lineHeight: 34,
    marginBottom: 20,
  },
  keyword: {
    color: COLORS.gold,
    fontWeight: '600',
  },
  puzzleCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: COLORS.purple,
    marginTop: 20,
  },
  puzzleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.purple,
    marginBottom: 16,
  },
  puzzleQuestion: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  puzzleOption: {
    backgroundColor: COLORS.bgMedium,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  puzzleOptionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  resultCard: {
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
    alignItems: 'center',
  },
  resultCorrect: {
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  resultWrong: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderWidth: 2,
    borderColor: COLORS.crimson,
  },
  resultIcon: {
    fontSize: 56,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  collectionInfo: {
    padding: 16,
    backgroundColor: COLORS.bgMedium,
  },
  collectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gold,
    textAlign: 'center',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'center',
  },
  collectionCard: {
    width: '22%',
    aspectRatio: 0.75,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    borderWidth: 2,
    margin: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  collectionName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  collectionStars: {
    fontSize: 8,
    marginTop: 2,
  },
  cardDetail: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.bgMedium,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardDetailIcon: {
    fontSize: 72,
    marginBottom: 12,
  },
  cardDetailName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  cardDetailRarity: {
    fontSize: 16,
    color: COLORS.gold,
    marginBottom: 20,
  },
  useButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
  },
  useButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  revealButton: {
    fontSize: 28,
  },
  revealModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealContent: {
    alignItems: 'center',
  },
  revealCard: {
    width: 220,
    height: 300,
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  revealCardIcon: {
    fontSize: 90,
    marginBottom: 16,
  },
  revealCardName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  revealCardRarity: {
    fontSize: 16,
    color: COLORS.gold,
  },
  revealShine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: -100,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.3)',
    transform: [{ skewX: '-20deg' }],
  },
  revealText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginTop: 30,
    marginBottom: 24,
  },
  revealCloseButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 50,
  },
  revealCloseText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});
