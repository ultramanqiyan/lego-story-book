import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, FlatList, RefreshControl, Image, Modal, Alert, Animated, Easing, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DemoNavigator, Demo1Login, Demo2Home, Demo3Director, Demo4Reader, Demo5Collection } from './src/screens/demo/DemoScreens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
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
  border: 'rgba(255,255,255,0.1)',
  error: '#ef4444',
  success: '#22c55e',
  cardBg: '#2d2d44',
};

const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const ROLE_TYPES = ['protagonist', 'antagonist', 'supporting', 'adventure'];
const ROLE_NAMES = { protagonist: '主角', antagonist: '反派', supporting: '配角', adventure: '冒险' };
const ROLE_COLORS = {
  protagonist: COLORS.gold,
  antagonist: COLORS.crimson,
  supporting: COLORS.silver,
  adventure: COLORS.purple,
};

const API_BASE = 'http://localhost:8788/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const response = await fetch(url, config);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || '请求失败');
  }
  return data;
}

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (username, email = null) => {
    try {
      const data = await apiRequest('/users', { method: 'POST', body: { username, email } });
      setUser({ userId: data.userId, username });
      return { success: true, userId: data.userId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setUser(null);
    return { success: true };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

function EnhancedParticleBackground() {
  const particles = useRef([]);
  const animations = useRef([]);

  useEffect(() => {
    const particleCount = 30;
    const particleColors = [COLORS.gold, COLORS.purple, COLORS.blue, COLORS.green];
    
    particles.current = [...Array(particleCount)].map(() => ({
      x: Math.random() * SCREEN_WIDTH,
      type: ['star', 'diamond', 'circle'][Math.floor(Math.random() * 3)],
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      size: 3 + Math.random() * 5,
      duration: 10000 + Math.random() * 8000,
      delay: Math.random() * 12000,
    }));

    animations.current = particles.current.map((p, i) => {
      const anim = new Animated.Value(0);
      Animated.loop(
        Animated.sequence([
          Animated.delay(p.delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: p.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
      return { anim, config: p };
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
          outputRange: [0, 20, -15, 18, -10],
        });
        const scale = anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.3, 0.7, 1],
        });
        const opacity = anim.interpolate({
          inputRange: [0, 0.1, 0.9, 1],
          outputRange: [0, 0.6, 0.3, 0],
        });
        const rotate = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.enhancedParticle,
              {
                left: config.x,
                width: config.size,
                height: config.size,
                backgroundColor: config.type !== 'star' ? config.color : 'transparent',
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
  const goldAnim = useRef(new Animated.ValueXY({ x: 0.1, y: 0.15 })).current;
  const purpleAnim = useRef(new Animated.ValueXY({ x: 0.85, y: 0.75 })).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(goldAnim, { toValue: { x: 0.6, y: 0.1 }, duration: 5000, useNativeDriver: true }),
        Animated.timing(goldAnim, { toValue: { x: 0.8, y: 0.5 }, duration: 5000, useNativeDriver: true }),
        Animated.timing(goldAnim, { toValue: { x: 0.3, y: 0.7 }, duration: 5500, useNativeDriver: true }),
        Animated.timing(goldAnim, { toValue: { x: 0.1, y: 0.15 }, duration: 5500, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(purpleAnim, { toValue: { x: 0.2, y: 0.8 }, duration: 6000, useNativeDriver: true }),
        Animated.timing(purpleAnim, { toValue: { x: 0.1, y: 0.25 }, duration: 6000, useNativeDriver: true }),
        Animated.timing(purpleAnim, { toValue: { x: 0.7, y: 0.15 }, duration: 6000, useNativeDriver: true }),
        Animated.timing(purpleAnim, { toValue: { x: 0.85, y: 0.75 }, duration: 6000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.glowContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.goldOrb,
          {
            left: goldAnim.x.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            top: goldAnim.y.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.purpleOrb,
          {
            left: purpleAnim.x.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            top: purpleAnim.y.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
    </View>
  );
}

function ShimmerText({ children, style }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const color = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [COLORS.gold, COLORS.orange, COLORS.gold],
  });

  return (
    <Animated.Text style={[style, { color }]}>
      {children}
    </Animated.Text>
  );
}

function HSCard({ character, index, onPress, selected }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const roleType = ROLE_TYPES[index % ROLE_TYPES.length];
  const roleName = ROLE_NAMES[roleType];
  const roleColor = ROLE_COLORS[roleType];
  const attack = [5, 7, 2, 4][index % 4];
  const health = [8, 6, 4, 5][index % 4];

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 80,
      friction: 7,
      delay: index * 80,
      useNativeDriver: true,
    }).start();

    if (selected) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(floatAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [selected]);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={{
        transform: [
          { scale: scaleAnim },
          { translateY: selected ? translateY : 0 },
        ],
      }}
    >
      <TouchableOpacity
        style={[
          styles.hsCard,
          { borderColor: roleColor },
          selected && styles.hsCardSelected,
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[styles.roleTag, { backgroundColor: roleColor }]}>
          <Text style={styles.roleTagText}>{roleName}</Text>
        </View>
        <View style={styles.hsPortrait}>
          <Text style={styles.hsAvatar}>🎭</Text>
        </View>
        <View style={styles.hsNameBanner}>
          <Text style={styles.hsName} numberOfLines={1}>{character.name}</Text>
        </View>
        <View style={styles.hsStats}>
          <View style={[styles.hsGem, styles.hsGemAttack]}>
            <Text style={styles.hsGemText}>{attack}</Text>
          </View>
          <View style={[styles.hsGem, styles.hsGemHealth]}>
            <Text style={styles.hsGemText}>{health}</Text>
          </View>
        </View>
        {selected && (
          <View style={styles.checkMarkContainer}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function BookCard({ book, index, onPress }) {
  const anim = useRef(new Animated.Value(0)).current;
  const gradients = [
    ['#a855f7', '#3b82f6'],
    ['#22c55e', '#3b82f6'],
    ['#f59e0b', '#dc2626'],
    ['#3b82f6', '#a855f7'],
  ];
  const gradient = gradients[index % gradients.length];

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] }}>
      <TouchableOpacity style={styles.bookCard} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.bookCover, { backgroundColor: gradient[0] }]}>
          <Text style={styles.bookCoverIcon}>📖</Text>
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitleText} numberOfLines={2}>{book.title}</Text>
          <View style={styles.bookStats}>
            <View style={[styles.statGem, { backgroundColor: COLORS.blue }]} />
            <Text style={styles.bookStatText}>{book.chapter_count || 0}章</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function GoldButton({ title, onPress, disabled, loading, icon }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }, { scale: pulseAnim }] }}>
      <TouchableOpacity
        style={[styles.goldButton, disabled && styles.goldButtonDisabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
      >
        <Animated.View style={[styles.goldButtonGlow, { opacity: shadowOpacity }]} />
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.goldButtonText}>{icon ? `${icon} ` : ''}{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const iconAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const blockAnims = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(iconAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      Animated.spring(iconScale, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      Animated.timing(titleAnim, { toValue: 1, duration: 600, delay: 200, easing: BOUNCE_EASING, useNativeDriver: true }),
      Animated.timing(subtitleAnim, { toValue: 1, duration: 500, delay: 400, useNativeDriver: true }),
    ]).start();

    blockAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        delay: 300 + index * 100,
        useNativeDriver: true,
      }).start();
    });

    Animated.parallel([
      Animated.timing(cardAnim, { toValue: 1, duration: 600, delay: 500, useNativeDriver: true }),
      Animated.spring(cardY, { toValue: 0, tension: 80, friction: 8, delay: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) return;
    setIsLoading(true);
    const result = await login(username.trim());
    setIsLoading(false);
    if (!result.success) {
      Alert.alert('登录失败', result.error);
    }
  };

  return (
    <View style={styles.container}>
      <EnhancedParticleBackground />
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.loginHeader}>
            <Animated.Text 
              style={[
                styles.loginIcon, 
                { 
                  opacity: iconAnim,
                  transform: [{ scale: iconScale }],
                }
              ]}
            >
              🧱
            </Animated.Text>
            <Animated.Text 
              style={[
                styles.loginTitle, 
                { 
                  opacity: titleAnim,
                  transform: [{ translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
                }
              ]}
            >
              乐高故事书
            </Animated.Text>
            <Animated.Text 
              style={[
                styles.loginSubtitle, 
                { 
                  opacity: subtitleAnim,
                  transform: [{ translateY: subtitleAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                }
              ]}
            >
              🎮 登录开始你的冒险！
            </Animated.Text>
          </View>

          <Animated.View 
            style={[
              styles.loginCardWrapper,
              {
                opacity: cardAnim,
                transform: [{ translateY: cardY }],
              }
            ]}
          >
            <View style={styles.loginCard}>
              <Text style={styles.loginCardTitle}>🎮 登录 / 注册</Text>
              <View style={styles.legoBlocks}>
                {blockAnims.map((anim, index) => {
                  const colors = [styles.blockYellow, styles.blockBlue, styles.blockRed];
                  const scales = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
                  const rotations = anim.interpolate({ inputRange: [0, 1], outputRange: ['-30deg', '0deg'] });
                  return (
                    <Animated.View 
                      key={index}
                      style={[
                        styles.legoBlock, 
                        colors[index],
                        {
                          transform: [{ scale: scales }, { rotate: rotations }],
                        }
                      ]} 
                    />
                  );
                })}
              </View>
              <View style={styles.form}>
                <Text style={styles.inputLabel}>👤 你的名字</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="输入你的冒险者名字"
                  placeholderTextColor={COLORS.textMuted}
                  value={username}
                  onChangeText={setUsername}
                  maxLength={20}
                />
                <GoldButton
                  title="开始冒险"
                  icon="🚀"
                  onPress={handleLogin}
                  disabled={isLoading}
                  loading={isLoading}
                />
              </View>
              <Text style={styles.loginHint}>💡 首次登录将自动创建账号</Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const greetingAnim = useRef(new Animated.Value(0)).current;
  const subGreetingAnim = useRef(new Animated.Value(0)).current;
  const cardRotateX = useRef(new Animated.Value(-1)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const featureAnims = useRef([...Array(4)].map(() => new Animated.Value(0))).current;
  const charCardAnims = useRef([...Array(4)].map(() => new Animated.Value(0))).current;
  const bookCardAnims = useRef([...Array(4)].map(() => new Animated.Value(0))).current;
  const buttonFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.parallel([
        Animated.timing(greetingAnim, { toValue: 1, duration: 500, easing: BOUNCE_EASING, useNativeDriver: true }),
        Animated.timing(subGreetingAnim, { toValue: 1, duration: 500, delay: 100, easing: BOUNCE_EASING, useNativeDriver: true }),
      ]).start();

      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
        Animated.timing(cardRotateX, { toValue: 0, duration: 800, delay: 200, easing: BOUNCE_EASING, useNativeDriver: true }),
      ]).start();

      featureAnims.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: 400 + index * 100,
          useNativeDriver: true,
        }).start();
      });

      charCardAnims.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 7,
          delay: 100 + index * 80,
          useNativeDriver: true,
        }).start();
      });

      bookCardAnims.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: 200 + index * 100,
          useNativeDriver: true,
        }).start();
      });

      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonFloat, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(buttonFloat, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isLoading]);

  const loadData = async () => {
    try {
      const [charsData, booksData] = await Promise.all([
        apiRequest('/characters'),
        user?.userId ? apiRequest(`/books?userId=${user.userId}`) : { books: [] },
      ]);
      setCharacters((charsData.characters || []).slice(0, 4));
      setBooks((booksData.books || []).slice(0, 4));
    } catch (error) {
      console.error('Load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  const rotateX = cardRotateX.interpolate({
    inputRange: [-1, 0],
    outputRange: ['-90deg', '0deg'],
  });

  const buttonTranslateY = buttonFloat.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  return (
    <View style={styles.container}>
      <GlowOrbBackground />
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={false} onRefresh={loadData} tintColor={COLORS.gold} />}
      >
        <View style={styles.homeHeader}>
          <Animated.Text 
            style={[
              styles.greeting, 
              { 
                opacity: greetingAnim,
                transform: [{ translateX: greetingAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
              }
            ]}
          >
            你好，{user?.username || '冒险者'}！
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.subGreeting, 
              { 
                opacity: subGreetingAnim,
                transform: [{ translateX: subGreetingAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
              }
            ]}
          >
            今天想听什么故事？
          </Animated.Text>
        </View>

        <Animated.View 
          style={[
            styles.welcomeCardWrapper,
            { 
              opacity: cardOpacity,
              transform: [{ rotateX }, { perspective: 1000 }],
            }
          ]}
        >
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>欢迎来到乐高故事世界</Text>
            <Text style={styles.welcomeDesc}>在这里，你可以：</Text>
            <View style={styles.featureList}>
              {['🎭 选择你喜欢的乐高人仔作为故事角色', '📖 创建属于你自己的冒险故事', '🧩 解答有趣的谜题推进剧情', '📤 与朋友分享你的故事'].map((text, index) => (
                <Animated.Text 
                  key={index}
                  style={[
                    styles.featureItem,
                    { 
                      opacity: featureAnims[index],
                      transform: [{ translateX: featureAnims[index].interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
                    }
                  ]}
                >
                  {text}
                </Animated.Text>
              ))}
            </View>
            <Animated.View style={{ transform: [{ translateY: buttonTranslateY }] }}>
              <GoldButton title="开始冒险" icon="🎮" onPress={() => navigation.navigate('StoryCreate')} />
            </Animated.View>
          </View>
        </Animated.View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>🔥</Text>
            <Text style={styles.sectionTitle}>热门人仔</Text>
          </View>
          {characters.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardScroll}>
              {characters.map((item, index) => (
                <Animated.View key={item.character_id} style={{ opacity: charCardAnims[index], transform: [{ translateX: charCardAnims[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) }] }}>
                  <HSCard
                    character={item}
                    index={index}
                    onPress={() => navigation.navigate('StoryCreate')}
                  />
                </Animated.View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.emptyText}>暂无人仔</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionIcon}>📚</Text>
            <Text style={styles.sectionTitle}>最近故事</Text>
          </View>
          {books.length > 0 ? (
            books.map((item, index) => (
              <BookCard
                key={item.book_id}
                book={item}
                index={index}
                onPress={() => navigation.navigate('BookDetail', { bookId: item.book_id })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>还没有故事，快去创建吧！</Text>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function BookshelfScreen({ navigation }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const titleAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef([]).current;

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 500,
        easing: BOUNCE_EASING,
        useNativeDriver: true,
      }).start();

      cardAnims.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 7,
          delay: index * 60,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isLoading]);

  const loadBooks = async () => {
    try {
      if (user?.userId) {
        const data = await apiRequest(`/books?userId=${user.userId}`);
        setBooks(data.books || []);
        data.books?.forEach((_, i) => {
          if (!cardAnims[i]) cardAnims[i] = new Animated.Value(0);
        });
      }
    } catch (error) {
      console.error('Load books error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlowOrbBackground />
      <Animated.View style={[styles.pageHeader, { opacity: titleAnim, transform: [{ translateX: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        <Text style={styles.pageTitle}>📚 我的故事书架</Text>
      </Animated.View>
      <FlatList
        data={books}
        keyExtractor={(item) => item.book_id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item, index }) => {
          const anim = cardAnims[index] || new Animated.Value(1);
          return (
            <Animated.View style={{ opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] }}>
              <TouchableOpacity
                style={styles.bookshelfItem}
                onPress={() => navigation.navigate('BookDetail', { bookId: item.book_id })}
              >
                <View style={[styles.bookshelfCover, { backgroundColor: COLORS.purple }]}>
                  <Text style={styles.bookshelfIcon}>📖</Text>
                </View>
                <Text style={styles.bookshelfTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.bookshelfChapters}>{item.chapter_count || 0} 章</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>还没有故事书</Text>}
      />
    </View>
  );
}

function CharactersScreen({ navigation }) {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const titleAnim = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef([]).current;

  useEffect(() => {
    loadCharacters();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 500,
        easing: BOUNCE_EASING,
        useNativeDriver: true,
      }).start();

      cardAnims.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 7,
          delay: index * 60,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isLoading]);

  const loadCharacters = async () => {
    try {
      const data = await apiRequest('/characters');
      setCharacters(data.characters || []);
      data.characters?.forEach((_, i) => {
        if (!cardAnims[i]) cardAnims[i] = new Animated.Value(0);
      });
    } catch (error) {
      console.error('Load characters error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GlowOrbBackground />
      <Animated.View style={[styles.pageHeader, { opacity: titleAnim, transform: [{ translateX: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        <Text style={styles.pageTitle}>🎭 角色列表</Text>
      </Animated.View>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.character_id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        renderItem={({ item, index }) => {
          const anim = cardAnims[index] || new Animated.Value(1);
          return (
            <Animated.View style={{ opacity: anim, transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }] }}>
              <HSCard
                character={item}
                index={index}
                onPress={() => navigation.navigate('StoryCreate', { selectedCharacter: item })}
              />
            </Animated.View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>暂无角色</Text>}
      />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  const { user, logout } = useAuth();
  const titleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 500,
      easing: BOUNCE_EASING,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <GlowOrbBackground />
      <Animated.View style={[styles.pageHeader, { opacity: titleAnim, transform: [{ translateX: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
        <Text style={styles.pageTitle}>⚙️ 设置</Text>
      </Animated.View>
      <View style={styles.settingsContent}>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>当前用户</Text>
          <Text style={styles.settingValue}>{user?.username || '未登录'}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.demoEntryButton}
          onPress={() => navigation.navigate('DemoHub')}
        >
          <Text style={styles.demoEntryIcon}>🎮</Text>
          <View style={styles.demoEntryInfo}>
            <Text style={styles.demoEntryTitle}>桌游风格Demo</Text>
            <Text style={styles.demoEntryDesc}>查看5个桌游风格UI演示</Text>
          </View>
          <Text style={styles.demoEntryArrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>退出登录</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PLOT_OPTIONS = [
  { id: 'adventure', name: '🏰 冒险探险', desc: '探索神秘世界' },
  { id: 'mystery', name: '🔍 神秘解谜', desc: '解开谜团' },
  { id: 'friendship', name: '🤝 友情故事', desc: '友谊的力量' },
  { id: 'rescue', name: '🦸 英雄救援', desc: '拯救世界' },
];

function StoryCreateScreen({ navigation, route }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [plot, setPlot] = useState(null);
  const [bookTitle, setBookTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const preselectedCharacter = route?.params?.selectedCharacter;
  const stepAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadCharacters();
  }, []);

  useEffect(() => {
    if (preselectedCharacter && !selectedCharacters.find(c => c.character_id === preselectedCharacter.character_id)) {
      setSelectedCharacters([preselectedCharacter]);
    }
  }, [preselectedCharacter]);

  useEffect(() => {
    Animated.spring(stepAnim, {
      toValue: step,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [step]);

  const loadCharacters = async () => {
    try {
      const data = await apiRequest('/characters');
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Load characters error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCharacter = (char) => {
    const exists = selectedCharacters.find(c => c.character_id === char.character_id);
    if (exists) {
      setSelectedCharacters(selectedCharacters.filter(c => c.character_id !== char.character_id));
    } else if (selectedCharacters.length < 3) {
      setSelectedCharacters([...selectedCharacters, char]);
    }
  };

  const handleCreateStory = async () => {
    if (selectedCharacters.length === 0 || !plot || !bookTitle.trim()) return;

    setIsCreating(true);
    try {
      const storyCharacters = selectedCharacters.map(c => ({
        original_id: c.character_id,
        original_name: c.name,
        custom_name: c.name,
        personality: c.personality,
        speaking_style: c.speaking_style
      }));

      const storyData = await apiRequest('/story', {
        method: 'POST',
        body: {
          characters: storyCharacters,
          plot: plot.desc
        }
      });

      if (storyData.success) {
        const bookData = await apiRequest('/books', {
          method: 'POST',
          body: {
            userId: user.userId,
            title: bookTitle.trim(),
            characterIds: selectedCharacters.map(c => c.character_id)
          }
        });

        if (bookData.success) {
          const chapterData = await apiRequest('/chapters', {
            method: 'POST',
            body: {
              bookId: bookData.bookId,
              chapterNumber: 1,
              title: storyData.title,
              content: storyData.content,
              puzzle: storyData.puzzle
            }
          });

          navigation.replace('BookDetail', { bookId: bookData.bookId, newChapter: chapterData });
        }
      }
    } catch (error) {
      Alert.alert('创建失败', error.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EnhancedParticleBackground />
      <View style={styles.createHeader}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.createTitle}>创建故事</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.progressBar}>
        {[1, 2, 3].map((s) => (
          <Animated.View key={s} style={[styles.progressStep, step >= s && styles.progressStepActive, { transform: [{ scale: step === s ? 1.1 : 1 }] }]}>
            <Text style={[styles.progressText, step >= s && styles.progressTextActive]}>{s}</Text>
          </Animated.View>
        ))}
        <View style={styles.progressLine} />
      </View>

      {step === 1 && (
        <ScrollView style={styles.createContent}>
          <Text style={styles.stepTitle}>选择角色 ({selectedCharacters.length}/3)</Text>
          <Text style={styles.stepDesc}>选择1-3个角色来开始你的故事</Text>
          <View style={styles.characterGrid}>
            {characters.map((char, index) => {
              const isSelected = selectedCharacters.find(c => c.character_id === char.character_id);
              return (
                <HSCard
                  key={char.character_id}
                  character={char}
                  index={index}
                  selected={isSelected}
                  onPress={() => toggleCharacter(char)}
                />
              );
            })}
          </View>
          <GoldButton
            title="下一步"
            onPress={() => selectedCharacters.length > 0 && setStep(2)}
            disabled={selectedCharacters.length === 0}
          />
        </ScrollView>
      )}

      {step === 2 && (
        <ScrollView style={styles.createContent}>
          <Text style={styles.stepTitle}>选择故事类型</Text>
          <Text style={styles.stepDesc}>选择一个你喜欢的冒险类型</Text>
          <View style={styles.plotGrid}>
            {PLOT_OPTIONS.map((p, idx) => {
              const anim = useRef(new Animated.Value(0)).current;
              useEffect(() => {
                Animated.spring(anim, {
                  toValue: 1,
                  tension: 80,
                  friction: 7,
                  delay: idx * 80,
                  useNativeDriver: true,
                }).start();
              }, []);
              return (
                <Animated.View key={p.id} style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
                  <TouchableOpacity
                    style={[styles.plotCard, plot?.id === p.id && styles.plotCardActive]}
                    onPress={() => setPlot(p)}
                  >
                    <Text style={styles.plotName}>{p.name}</Text>
                    <Text style={styles.plotDesc}>{p.desc}</Text>
                    {plot?.id === p.id && <Text style={styles.plotCheck}>✓</Text>}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
          <GoldButton
            title="下一步"
            onPress={() => plot && setStep(3)}
            disabled={!plot}
          />
        </ScrollView>
      )}

      {step === 3 && (
        <KeyboardAvoidingView style={styles.createContent} behavior="padding">
          <Text style={styles.stepTitle}>给故事起个名字</Text>
          <Text style={styles.stepDesc}>为你的冒险故事取一个独特的名字</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="输入故事名称..."
            placeholderTextColor={COLORS.textMuted}
            value={bookTitle}
            onChangeText={setBookTitle}
            maxLength={30}
          />
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>故事预览</Text>
            <Text style={styles.summaryItem}>角色: {selectedCharacters.map(c => c.name).join('、')}</Text>
            <Text style={styles.summaryItem}>类型: {plot?.name}</Text>
          </View>
          <GoldButton
            title="开始创作"
            icon="🚀"
            onPress={handleCreateStory}
            disabled={!bookTitle.trim() || isCreating}
            loading={isCreating}
          />
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

function BookDetailScreen({ navigation, route }) {
  const { bookId, newChapter } = route.params || {};
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const titleAnim = useRef(new Animated.Value(0)).current;
  const chapterAnims = useRef([]).current;

  useEffect(() => {
    loadBookData();
  }, [bookId]);

  useEffect(() => {
    if (!isLoading) {
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 80,
        friction: 7,
        useNativeDriver: true,
      }).start();

      chapterAnims.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [isLoading]);

  const loadBookData = async () => {
    try {
      const bookData = await apiRequest(`/books?bookId=${bookId}`);
      setBook(bookData.book);
      setChapters(bookData.chapters || []);
      bookData.chapters?.forEach((_, i) => {
        if (!chapterAnims[i]) chapterAnims[i] = new Animated.Value(0);
      });
    } catch (error) {
      console.error('Load book error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateChapter = async () => {
    setIsGenerating(true);
    try {
      const lastChapter = chapters[chapters.length - 1];

      const bookCharsData = await apiRequest(`/book-characters?bookId=${bookId}`);
      const storyCharacters = (bookCharsData.characters || []).map(c => ({
        original_id: c.character_id,
        original_name: c.original_name,
        custom_name: c.custom_name || c.original_name,
        personality: c.personality,
        speaking_style: c.speaking_style
      }));

      const storyData = await apiRequest('/story', {
        method: 'POST',
        body: {
          characters: storyCharacters,
          plot: '继续冒险',
          previousSummary: lastChapter?.content?.substring(0, 200),
          previousPuzzle: lastChapter?.puzzle
        }
      });

      if (storyData.success) {
        const chapterData = await apiRequest('/chapters', {
          method: 'POST',
          body: {
            bookId: bookId,
            chapterNumber: chapters.length + 1,
            title: storyData.title,
            content: storyData.content,
            puzzle: storyData.puzzle
          }
        });

        loadBookData();
      }
    } catch (error) {
      Alert.alert('生成失败', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EnhancedParticleBackground />
      <View style={styles.createHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.createTitle} numberOfLines={1}>{book?.title || '故事详情'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.createContent}>
        <Animated.View style={[styles.bookInfoCard, { opacity: titleAnim, transform: [{ scale: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }]}>
          <Text style={styles.bookInfoTitle}>{book?.title}</Text>
          <Text style={styles.bookInfoMeta}>共 {chapters.length} 章</Text>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📖</Text>
          <Text style={styles.sectionTitle}>章节列表</Text>
        </View>
        {chapters.map((chapter, index) => {
          const anim = chapterAnims[index] || new Animated.Value(1);
          return (
            <Animated.View key={chapter.chapter_id} style={{ opacity: anim, transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }}>
              <TouchableOpacity
                style={styles.chapterItem}
                onPress={() => navigation.navigate('ChapterRead', { chapter, bookTitle: book?.title })}
              >
                <View style={styles.chapterNumber}>
                  <Text style={styles.chapterNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  {chapter.puzzle && <Text style={styles.puzzleBadge}>有谜题</Text>}
                </View>
                <Text style={styles.chapterArrow}>→</Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        <GoldButton
          title="生成下一章"
          icon="✨"
          onPress={handleGenerateChapter}
          disabled={isGenerating}
          loading={isGenerating}
        />
        
        <View style={{ height: 16 }} />
        
        <TouchableOpacity 
          style={styles.directorButton}
          onPress={() => navigation.navigate('StoryDirector', { bookId })}
        >
          <Text style={styles.directorButtonText}>🎬 故事导演台</Text>
          <Text style={styles.directorButtonDesc}>选择角色、地形、天气来创作新章节</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function ChapterReadScreen({ navigation, route }) {
  const { chapter, bookTitle } = route.params || {};
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const titleAnim = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(-40)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const contentAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  const puzzleAnim = useRef(new Animated.Value(0)).current;
  const resultAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const celebrationAnims = useRef([...Array(8)].map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(titleAnim, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
      Animated.spring(titleY, { toValue: 0, tension: 100, friction: 8, useNativeDriver: true }),
    ]).start();

    Animated.timing(underlineAnim, {
      toValue: 1,
      duration: 600,
      delay: 400,
      useNativeDriver: true,
    }).start();

    contentAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 300 + index * 150,
        useNativeDriver: true,
      }).start();
    });

    if (chapter?.puzzle) {
      Animated.timing(puzzleAnim, {
        toValue: 1,
        duration: 700,
        delay: 800,
        easing: BOUNCE_EASING,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === chapter.puzzle?.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      Animated.spring(resultAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();

      celebrationAnims.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          delay: index * 80,
          easing: BOUNCE_EASING,
          useNativeDriver: true,
        }).start();
      });
    } else {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0.5, duration: 80, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
      ]).start();
    }
  };

  const underlineWidth = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '70%'],
  });

  const shakeTranslateX = shakeAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-8, 0, 8],
  });

  return (
    <View style={styles.container}>
      <EnhancedParticleBackground />
      <View style={styles.createHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.createTitle} numberOfLines={1}>{chapter?.title}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.readContent}>
        <View style={styles.titleContainer}>
          <Animated.Text 
            style={[
              styles.chapterContentTitle, 
              { 
                opacity: titleAnim,
                transform: [{ translateY: titleY }],
              }
            ]}
          >
            {chapter?.title}
          </Animated.Text>
          <Animated.View style={[styles.titleUnderline, { width: underlineWidth }]} />
        </View>

        {chapter?.content?.split('\n\n').map((para, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.chapterContentText, 
              { 
                opacity: contentAnims[index] || 1,
                transform: [{ 
                  translateY: (contentAnims[index] || new Animated.Value(1)).interpolate({ 
                    inputRange: [0, 1], 
                    outputRange: [15, 0] 
                  }) 
                }],
              }
            ]}
          >
            {para}
          </Animated.Text>
        ))}

        {chapter?.puzzle && !showResult && (
          <Animated.View 
            style={[
              styles.puzzleCard,
              {
                opacity: puzzleAnim,
                transform: [
                  { translateX: puzzleAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                  { rotateY: puzzleAnim.interpolate({ inputRange: [0, 1], outputRange: ['-10deg', '0deg'] }) },
                ],
              }
            ]}
          >
            <Text style={styles.puzzleTitle}>❓ 谜题挑战</Text>
            <Text style={styles.puzzleQuestion}>{chapter.puzzle.question}</Text>
            {chapter.puzzle.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.puzzleOption}
                onPress={() => handleAnswer(option.charAt(0))}
              >
                <Text style={styles.puzzleOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {showResult && (
          <Animated.View 
            style={[
              styles.resultCard,
              isCorrect ? styles.resultCorrect : styles.resultWrong,
              { 
                opacity: resultAnim,
                transform: [{ scale: resultAnim }, { translateX: shakeTranslateX }],
              }
            ]}
          >
            {isCorrect && (
              <View style={styles.celebrationContainer}>
                {['⭐', '✨', '🌟', '💫', '🎉', '🎊', '⭐', '✨'].map((emoji, index) => {
                  const translateX = celebrationAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (Math.random() - 0.5) * 150],
                  });
                  const translateY = celebrationAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, (Math.random() - 0.5) * 150],
                  });
                  const scale = celebrationAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1.5],
                  });
                  
                  return (
                    <Animated.Text
                      key={index}
                      style={[
                        styles.celebrationStar,
                        { transform: [{ translateX }, { translateY }, { scale }] },
                      ]}
                    >
                      {emoji}
                    </Animated.Text>
                  );
                })}
              </View>
            )}
            <Text style={styles.resultTitle}>{isCorrect ? '回答正确！' : '答错了'}</Text>
            <Text style={styles.resultText}>
              {isCorrect ? '太棒了！你成功解开了谜题！' : `正确答案是 ${chapter.puzzle.answer}，继续加油！`}
            </Text>
            {chapter.puzzle.hint && <Text style={styles.hintText}>提示: {chapter.puzzle.hint}</Text>}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

function WeatherEffect({ weather }) {
  if (!weather) return null;

  if (weather === 'sunny') {
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();

      Animated.loop(
        Animated.timing(rotateAnim, { toValue: 1, duration: 25000, easing: Easing.linear, useNativeDriver: true })
      ).start();
    }, []);

    const scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] });
    const rotate = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

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

  if (weather === 'rainy' || weather === 'thunder') {
    const drops = useRef([...Array(60)].map(() => ({
      x: Math.random() * SCREEN_WIDTH,
      delay: Math.random() * 1500,
      duration: 350 + Math.random() * 350,
      opacity: 0.3 + Math.random() * 0.5,
    }))).current;

    const [flash, setFlash] = useState(false);

    useEffect(() => {
      if (weather === 'thunder') {
        const interval = setInterval(() => {
          if (Math.random() > 0.65) {
            setFlash(true);
            setTimeout(() => setFlash(false), 120);
          }
        }, 2500);
        return () => clearInterval(interval);
      }
    }, [weather]);

    return (
      <View style={styles.weatherContainer} pointerEvents="none">
        {drops.map((drop, i) => (
          <AnimatedRainDrop key={i} config={drop} />
        ))}
        {flash && <View style={styles.lightningFlash} />}
      </View>
    );
  }

  if (weather === 'snow') {
    const flakes = useRef([...Array(40)].map(() => ({
      x: Math.random() * SCREEN_WIDTH,
      delay: Math.random() * 4000,
      duration: 3500 + Math.random() * 4000,
      size: 10 + Math.random() * 16,
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

  if (weather === 'fog') {
    const fogLayers = useRef([...Array(5)].map((_, i) => ({
      y: 100 + i * 150,
      duration: 15000 + i * 3000,
      delay: i * 2000,
      opacity: 0.15 + i * 0.08,
    }))).current;

    return (
      <View style={styles.weatherContainer} pointerEvents="none">
        {fogLayers.map((layer, i) => (
          <AnimatedFogLayer key={i} config={layer} index={i} />
        ))}
        <View style={styles.fogOverlay} />
      </View>
    );
  }

  if (weather === 'wind') {
    const windLines = useRef([...Array(25)].map(() => ({
      y: Math.random() * SCREEN_HEIGHT,
      duration: 600 + Math.random() * 400,
      delay: Math.random() * 2000,
      length: 80 + Math.random() * 120,
      opacity: 0.2 + Math.random() * 0.3,
    }))).current;

    const leaves = useRef([...Array(15)].map(() => ({
      x: -30,
      y: Math.random() * SCREEN_HEIGHT,
      duration: 2000 + Math.random() * 1500,
      delay: Math.random() * 3000,
      rotation: Math.random() * 360,
      size: 12 + Math.random() * 8,
    }))).current;

    return (
      <View style={styles.weatherContainer} pointerEvents="none">
        {windLines.map((line, i) => (
          <AnimatedWindLine key={i} config={line} />
        ))}
        {leaves.map((leaf, i) => (
          <AnimatedLeaf key={i} config={leaf} />
        ))}
      </View>
    );
  }

  if (weather === 'rainbow') {
    const shimmerAnim = useRef(new Animated.Value(0)).current;
    const sparkleAnims = useRef([...Array(20)].map(() => new Animated.Value(0))).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          Animated.timing(shimmerAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        ])
      ).start();

      sparkleAnims.forEach((anim, i) => {
        Animated.loop(
          Animated.sequence([
            Animated.delay(i * 200 + Math.random() * 1000),
            Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 0, duration: 800, useNativeDriver: true }),
          ])
        ).start();
      });
    }, []);

    const opacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0.8] });

    return (
      <View style={styles.weatherContainer} pointerEvents="none">
        <Animated.View style={[styles.rainbowContainer, { opacity }]}>
          <View style={[styles.rainbowArc, styles.rainbowRed]} />
          <View style={[styles.rainbowArc, styles.rainbowOrange]} />
          <View style={[styles.rainbowArc, styles.rainbowYellow]} />
          <View style={[styles.rainbowArc, styles.rainbowGreen]} />
          <View style={[styles.rainbowArc, styles.rainbowBlue]} />
          <View style={[styles.rainbowArc, styles.rainbowIndigo]} />
          <View style={[styles.rainbowArc, styles.rainbowViolet]} />
        </Animated.View>
        {sparkleAnims.map((anim, i) => {
          const x = 50 + Math.random() * (SCREEN_WIDTH - 100);
          const y = 80 + Math.random() * 200;
          const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1.5] });
          return (
            <Animated.Text
              key={i}
              style={[styles.sparkle, { left: x, top: y, opacity: anim, transform: [{ scale }] }]}
            >
              ✨
            </Animated.Text>
          );
        })}
      </View>
    );
  }

  if (weather === 'starry') {
    const stars = useRef([...Array(80)].map(() => ({
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT * 0.6,
      size: 2 + Math.random() * 4,
      twinkleDuration: 1000 + Math.random() * 2000,
      delay: Math.random() * 2000,
    }))).current;

    const shootingStars = useRef([...Array(3)].map(() => ({
      startX: Math.random() * SCREEN_WIDTH,
      startY: Math.random() * 200,
      duration: 800,
      delay: 5000 + Math.random() * 10000,
    }))).current;

    return (
      <View style={styles.weatherContainer} pointerEvents="none">
        <View style={styles.nightSkyOverlay} />
        {stars.map((star, i) => (
          <AnimatedStar key={i} config={star} />
        ))}
        {shootingStars.map((s, i) => (
          <AnimatedShootingStar key={i} config={s} />
        ))}
        <View style={styles.moonContainer}>
          <Text style={styles.moonEmoji}>🌙</Text>
        </View>
      </View>
    );
  }

  return null;
}

const AnimatedRainDrop = ({ config }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-25, SCREEN_HEIGHT + 25] });
  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -15] });

  return (
    <Animated.View
      style={[
        styles.rainDrop,
        { left: config.x, opacity: config.opacity, transform: [{ translateY }, { translateX }] },
      ]}
    />
  );
};

const AnimatedSnowFlake = ({ config }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [-25, SCREEN_HEIGHT + 25] });
  const translateX = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 25, -15] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scale = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.5, 1, 0.8] });

  return (
    <Animated.Text
      style={[
        styles.snowFlake,
        { left: config.x, fontSize: config.size, opacity: config.opacity, transform: [{ translateY }, { translateX }, { rotate }, { scale }] },
      ]}
    >
      ❄
    </Animated.Text>
  );
};

const AnimatedFogLayer = ({ config, index }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH] });

  return (
    <Animated.View
      style={[
        styles.fogLayer,
        {
          top: config.y,
          opacity: config.opacity,
          transform: [{ translateX }],
        },
      ]}
    />
  );
};

const AnimatedWindLine = ({ config }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-config.length, SCREEN_WIDTH + 50] });
  const opacity = anim.interpolate({ inputRange: [0, 0.1, 0.9, 1], outputRange: [0, config.opacity, config.opacity, 0] });

  return (
    <Animated.View
      style={[
        styles.windLine,
        {
          top: config.y,
          width: config.length,
          opacity,
          transform: [{ translateX }],
        },
      ]}
    />
  );
};

const AnimatedLeaf = ({ config }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, {
          toValue: 1,
          duration: config.duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [-30, SCREEN_WIDTH + 50] });
  const translateY = anim.interpolate({ inputRange: [0, 0.3, 0.6, 1], outputRange: [config.y, config.y - 50, config.y + 30, config.y - 20] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: [`${config.rotation}deg`, `${config.rotation + 720}deg`] });

  return (
    <Animated.Text
      style={[
        styles.leaf,
        {
          fontSize: config.size,
          opacity: 0.8,
          transform: [{ translateX }, { translateY }, { rotate }],
        },
      ]}
    >
      🍂
    </Animated.Text>
  );
};

const AnimatedStar = ({ config }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, { toValue: 1, duration: config.twinkleDuration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: config.twinkleDuration, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.2] });

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: config.x,
          top: config.y,
          width: config.size,
          height: config.size,
          opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
          transform: [{ scale }],
        },
      ]}
    />
  );
};

const AnimatedShootingStar = ({ config }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(config.delay),
        Animated.timing(anim, { toValue: 1, duration: config.duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.delay(10000),
      ])
    ).start();
  }, []);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 150] });
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 100] });
  const opacity = anim.interpolate({ inputRange: [0, 0.1, 0.8, 1], outputRange: [0, 1, 1, 0] });
  const rotate = anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  return (
    <Animated.View
      style={[
        styles.shootingStar,
        {
          left: config.startX,
          top: config.startY,
          opacity,
          transform: [{ translateX }, { translateY }, { rotate }],
        },
      ]}
    />
  );
};

function StoryDirectorScreen({ navigation, route }) {
  const { bookId } = route.params || {};
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [plotOptions, setPlotOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selections, setSelections] = useState({
    protagonist: null,
    antagonist: null,
    supporting: [],
    adventure: null,
    terrain: null,
    weather: null,
    items: []
  });

  const titleAnim = useRef(new Animated.Value(0)).current;
  const charCardAnims = useRef([]).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadData();
  }, [bookId]);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 600,
        easing: BOUNCE_EASING,
        useNativeDriver: true,
      }).start();

      charCardAnims.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 7,
          delay: index * 60,
          useNativeDriver: true,
        }).start();
      });

      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulse, { toValue: 1.05, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(buttonPulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isLoading]);

  const loadData = async () => {
    try {
      const [bookData, plotData] = await Promise.all([
        apiRequest(`/books?bookId=${bookId}`),
        apiRequest('/plot-options')
      ]);
      setBook(bookData.book);
      setCharacters(bookData.characters || []);
      setPlotOptions(plotData.plotOptions);
      bookData.characters?.forEach((_, i) => {
        if (!charCardAnims[i]) charCardAnims[i] = new Animated.Value(0);
      });
    } catch (error) {
      console.error('Load error:', error);
      Alert.alert('加载失败', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const selectCard = (card, type) => {
    setSelections(prev => {
      const newSel = { ...prev };
      if (type === 'protagonist' || type === 'antagonist' || type === 'adventure' || type === 'terrain' || type === 'weather') {
        if (newSel[type]?.id === card.id) {
          newSel[type] = null;
        } else {
          newSel[type] = card;
        }
      } else if (type === 'supporting') {
        const idx = newSel.supporting.findIndex(c => c.id === card.id);
        if (idx > -1) {
          newSel.supporting = newSel.supporting.filter((_, i) => i !== idx);
        } else if (newSel.supporting.length < 2) {
          newSel.supporting = [...newSel.supporting, card];
        }
      } else if (type === 'item') {
        const idx = newSel.items.findIndex(c => c.id === card.id);
        if (idx > -1) {
          newSel.items = newSel.items.filter((_, i) => i !== idx);
        } else if (newSel.items.length < 1) {
          newSel.items = [...newSel.items, card];
        }
      }
      return newSel;
    });
  };

  const isCardSelected = (card, type) => {
    if (type === 'protagonist' || type === 'antagonist' || type === 'adventure' || type === 'terrain' || type === 'weather') {
      return selections[type]?.id === card.id;
    } else if (type === 'supporting') {
      return selections.supporting.some(c => c.id === card.id);
    } else if (type === 'item') {
      return selections.items.some(c => c.id === card.id);
    }
    return false;
  };

  const isReady = selections.protagonist && selections.adventure && selections.terrain && selections.weather;

  const handleGenerate = async () => {
    if (!isReady || isGenerating) return;
    setIsGenerating(true);
    try {
      const plotSelection = {
        weather: selections.weather?.id,
        adventureType: selections.adventure?.id,
        terrain: selections.terrain?.id,
        equipment: selections.items[0]?.id
      };
      const selectedCharIds = [];
      if (selections.protagonist) selectedCharIds.push(selections.protagonist.id);
      if (selections.antagonist) selectedCharIds.push(selections.antagonist.id);
      selections.supporting.forEach(c => selectedCharIds.push(c.id));

      const result = await apiRequest(`/chapters-generate?bookId=${bookId}`, {
        method: 'POST',
        body: {
          userId: user?.userId || '',
          plotSelection,
          characterIds: selectedCharIds
        }
      });

      Alert.alert('成功', '章节生成成功！', [
        { text: '确定', onPress: () => navigation.replace('BookDetail', { bookId }) }
      ]);
    } catch (error) {
      Alert.alert('生成失败', error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPreviewText = () => {
    const parts = [];
    if (selections.protagonist) parts.push(selections.protagonist.name);
    if (selections.supporting.length) parts.push(`与${selections.supporting.map(c => c.name).join('、')}`);
    if (selections.antagonist) parts.push(`对抗${selections.antagonist.name}`);
    if (selections.adventure) parts.push(`开启${selections.adventure.name}`);
    if (selections.terrain) parts.push(`在${selections.terrain.name}`);
    if (selections.weather) parts.push(`${selections.weather.name}中`);
    if (selections.items.length) parts.push(`手持${selections.items.map(c => c.name).join('、')}`);
    return parts.length ? parts.join('，') + '...' : '选择卡牌来构建你的故事...';
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  const characterCards = characters.map(c => ({
    id: c.character_id,
    name: c.custom_name || c.character_name || '未知',
    avatar: c.emoji || '🎭',
    role: c.role_type || 'supporting'
  }));

  const weatherId = selections.weather?.id;

  return (
    <View style={styles.container}>
      <GlowOrbBackground />
      <WeatherEffect weather={weatherId} />
      <View style={styles.createHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← 返回</Text>
        </TouchableOpacity>
        <Text style={styles.createTitle} numberOfLines={1}>{book?.title || '故事导演'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.directorContent}>
        <View style={styles.stageArea}>
          <Text style={styles.stageTitle}>舞台预览</Text>
          <View style={styles.stageGrid}>
            {[
              { slot: 'protagonist', icon: '👑', label: '主角', required: true },
              { slot: 'supporting1', icon: '🎭', label: '配角', required: false },
              { slot: 'supporting2', icon: '🎭', label: '配角', required: false },
              { slot: 'antagonist', icon: '👿', label: '反派', required: false },
              { slot: 'adventure', icon: '🗺️', label: '冒险', required: true },
              { slot: 'terrain', icon: '🏔️', label: '地形', required: true },
              { slot: 'weather', icon: '🌤️', label: '天气', required: true },
              { slot: 'item1', icon: '🎒', label: '道具', required: false },
            ].map(({ slot, icon, label, required }) => {
              let card = null;
              if (slot === 'protagonist') card = selections.protagonist;
              else if (slot === 'antagonist') card = selections.antagonist;
              else if (slot === 'adventure') card = selections.adventure;
              else if (slot === 'terrain') card = selections.terrain;
              else if (slot === 'weather') card = selections.weather;
              else if (slot === 'supporting1') card = selections.supporting[0];
              else if (slot === 'supporting2') card = selections.supporting[1];
              else if (slot === 'item1') card = selections.items[0];

              return (
                <View key={slot} style={[styles.stageSlot, required && !card && styles.stageSlotRequired, card && styles.stageSlotFilled]}>
                  {card ? (
                    <View style={styles.miniCard}>
                      <Text style={styles.miniAvatar}>{card.avatar}</Text>
                      <Text style={styles.miniName} numberOfLines={1}>{card.name}</Text>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.slotIcon}>{icon}</Text>
                      <Text style={styles.slotLabel}>{label}</Text>
                    </>
                  )}
                </View>
              );
            })}
          </View>
          <View style={styles.storyPreview}>
            <Text style={styles.previewText}>{getPreviewText()}</Text>
          </View>
        </View>

        <View style={styles.cardSection}>
          <View style={[styles.sectionHeader, { backgroundColor: 'rgba(168,85,247,0.15)', borderColor: COLORS.purple }]}>
            <Text style={[styles.sectionHeaderText, { color: COLORS.purple }]}>🗺️ 冒险类型 (必选1)</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
            {plotOptions?.adventureType?.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.directorCard, { borderColor: COLORS.purple }, isCardSelected(item, 'adventure') && styles.directorCardSelected]}
                onPress={() => selectCard(item, 'adventure')}
              >
                <Text style={styles.directorAvatar}>{item.icon}</Text>
                <Text style={styles.directorName} numberOfLines={1}>{item.name}</Text>
                {isCardSelected(item, 'adventure') && <Text style={styles.cardCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.cardSection}>
          <View style={[styles.sectionHeader, { backgroundColor: 'rgba(255,215,0,0.15)', borderColor: COLORS.gold }]}>
            <Text style={[styles.sectionHeaderText, { color: COLORS.gold }]}>👥 角色 (主角必选1)</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
            {characterCards.map((item, idx) => {
              const roleColor = item.role === 'protagonist' ? COLORS.gold : item.role === 'antagonist' ? COLORS.crimson : COLORS.silver;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.directorCard, { borderColor: roleColor }, isCardSelected(item, item.role) && styles.directorCardSelected]}
                  onPress={() => selectCard(item, item.role)}
                >
                  <View style={[styles.roleTagSmall, { backgroundColor: roleColor }]}>
                    <Text style={styles.roleTagSmallText}>{ROLE_NAMES[item.role] || '配角'}</Text>
                  </View>
                  <Text style={styles.directorAvatar}>{item.avatar}</Text>
                  <Text style={styles.directorName} numberOfLines={1}>{item.name}</Text>
                  {isCardSelected(item, item.role) && <Text style={styles.cardCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.cardSection}>
          <View style={[styles.sectionHeader, { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: COLORS.green }]}>
            <Text style={[styles.sectionHeaderText, { color: COLORS.green }]}>🏔️ 地形 (必选1)</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
            {plotOptions?.terrain?.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.directorCard, { borderColor: COLORS.green }, isCardSelected(item, 'terrain') && styles.directorCardSelected]}
                onPress={() => selectCard(item, 'terrain')}
              >
                <Text style={styles.directorAvatar}>{item.icon}</Text>
                <Text style={styles.directorName} numberOfLines={1}>{item.name}</Text>
                {isCardSelected(item, 'terrain') && <Text style={styles.cardCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.cardSection}>
          <View style={[styles.sectionHeader, { backgroundColor: 'rgba(59,130,246,0.15)', borderColor: COLORS.blue }]}>
            <Text style={[styles.sectionHeaderText, { color: COLORS.blue }]}>🌤️ 天气 (必选1)</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
            {plotOptions?.weather?.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.directorCard, { borderColor: COLORS.blue }, isCardSelected(item, 'weather') && styles.directorCardSelected]}
                onPress={() => selectCard(item, 'weather')}
              >
                <Text style={styles.directorAvatar}>{item.icon}</Text>
                <Text style={styles.directorName} numberOfLines={1}>{item.name}</Text>
                {isCardSelected(item, 'weather') && <Text style={styles.cardCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.cardSection}>
          <View style={[styles.sectionHeader, { backgroundColor: 'rgba(245,158,11,0.15)', borderColor: COLORS.orange }]}>
            <Text style={[styles.sectionHeaderText, { color: COLORS.orange }]}>🎒 道具 (可选0-1)</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardRow}>
            {plotOptions?.equipment?.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.directorCard, { borderColor: COLORS.orange }, isCardSelected(item, 'item') && styles.directorCardSelected]}
                onPress={() => selectCard(item, 'item')}
              >
                <Text style={styles.directorAvatar}>{item.icon}</Text>
                <Text style={styles.directorName} numberOfLines={1}>{item.name}</Text>
                {isCardSelected(item, 'item') && <Text style={styles.cardCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.directorBottomBar}>
        <View style={styles.requirements}>
          <View style={[styles.reqItem, selections.protagonist && styles.reqItemMet]}>
            <View style={[styles.reqIcon, selections.protagonist && styles.reqIconMet]}>
              {selections.protagonist && <Text style={styles.reqIconText}>✓</Text>}
            </View>
            <Text style={[styles.reqText, selections.protagonist && styles.reqTextMet]}>主角</Text>
          </View>
          <View style={[styles.reqItem, selections.adventure && styles.reqItemMet]}>
            <View style={[styles.reqIcon, selections.adventure && styles.reqIconMet]}>
              {selections.adventure && <Text style={styles.reqIconText}>✓</Text>}
            </View>
            <Text style={[styles.reqText, selections.adventure && styles.reqTextMet]}>冒险</Text>
          </View>
          <View style={[styles.reqItem, selections.terrain && styles.reqItemMet]}>
            <View style={[styles.reqIcon, selections.terrain && styles.reqIconMet]}>
              {selections.terrain && <Text style={styles.reqIconText}>✓</Text>}
            </View>
            <Text style={[styles.reqText, selections.terrain && styles.reqTextMet]}>地形</Text>
          </View>
          <View style={[styles.reqItem, selections.weather && styles.reqItemMet]}>
            <View style={[styles.reqIcon, selections.weather && styles.reqIconMet]}>
              {selections.weather && <Text style={styles.reqIconText}>✓</Text>}
            </View>
            <Text style={[styles.reqText, selections.weather && styles.reqTextMet]}>天气</Text>
          </View>
        </View>
        <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
          <GoldButton
            title="开拍！"
            icon="🎬"
            onPress={handleGenerate}
            disabled={!isReady || isGenerating}
            loading={isGenerating}
          />
        </Animated.View>
      </View>
    </View>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color }) => {
          const icons = { Home: '🏠', Bookshelf: '📚', Characters: '🎭', Settings: '⚙️' };
          return <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icons[route.name]}</Text>;
        },
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '首页' }} />
      <Tab.Screen name="Bookshelf" component={BookshelfScreen} options={{ tabBarLabel: '书架' }} />
      <Tab.Screen name="Characters" component={CharactersScreen} options={{ tabBarLabel: '角色' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: '设置' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Main" component={MainNavigator} />
            <Stack.Screen name="StoryCreate" component={StoryCreateScreen} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen name="ChapterRead" component={ChapterReadScreen} />
            <Stack.Screen name="StoryDirector" component={StoryDirectorScreen} />
            <Stack.Screen name="DemoHub" component={DemoNavigator} />
            <Stack.Screen name="Demo1" component={Demo1Login} />
            <Stack.Screen name="Demo2" component={Demo2Home} />
            <Stack.Screen name="Demo3" component={Demo3Director} />
            <Stack.Screen name="Demo4" component={Demo4Reader} />
            <Stack.Screen name="Demo5" component={Demo5Collection} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  enhancedParticle: {
    position: 'absolute',
    bottom: -20,
    borderRadius: 50,
  },
  glowContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  goldOrb: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.gold,
    opacity: 0.25,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 10,
  },
  purpleOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: COLORS.purple,
    opacity: 0.25,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 50,
    elevation: 10,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  loginIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  loginTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
    textShadowColor: 'rgba(255,215,0,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  loginSubtitle: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  loginCardWrapper: {
    zIndex: 1,
  },
  loginCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: 24,
  },
  loginCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: 24,
  },
  legoBlocks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  legoBlock: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  blockYellow: { backgroundColor: COLORS.gold },
  blockBlue: { backgroundColor: COLORS.blue },
  blockRed: { backgroundColor: COLORS.crimson },
  form: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: COLORS.bgMedium,
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  loginHint: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
  goldButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    overflow: 'hidden',
  },
  goldButtonDisabled: {
    backgroundColor: COLORS.textMuted,
  },
  goldButtonGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: COLORS.gold,
    borderRadius: 35,
  },
  goldButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  homeHeader: {
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  welcomeCardWrapper: {
    zIndex: 1,
  },
  welcomeCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    margin: 20,
    marginTop: 0,
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 12,
  },
  welcomeDesc: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 28,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,215,0,0.2)',
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gold,
  },
  cardScroll: {
    paddingBottom: 10,
  },
  hsCard: {
    width: 140,
    aspectRatio: 3 / 4,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: COLORS.bgLight,
    borderWidth: 3,
    overflow: 'hidden',
  },
  hsCardSelected: {
    borderWidth: 4,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  roleTag: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#000',
  },
  hsPortrait: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3a3a3a',
  },
  hsAvatar: {
    fontSize: 48,
  },
  hsNameBanner: {
    padding: 8,
    backgroundColor: '#3a2a1a',
    alignItems: 'center',
  },
  hsName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff8e1',
  },
  hsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: COLORS.bgDark,
  },
  hsGem: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hsGemAttack: {
    backgroundColor: COLORS.orange,
  },
  hsGemHealth: {
    backgroundColor: COLORS.crimson,
  },
  hsGemText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  checkMarkContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  bookCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookCover: {
    width: 50,
    height: 65,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookCoverIcon: {
    fontSize: 24,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 15,
  },
  bookTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  bookStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statGem: {
    width: 12,
    height: 16,
    borderRadius: 6,
    marginRight: 6,
  },
  bookStatText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    textAlign: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  pageHeader: {
    padding: 20,
    paddingTop: 60,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  gridContent: {
    padding: 16,
    zIndex: 1,
  },
  bookshelfItem: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bookshelfCover: {
    width: 60,
    height: 80,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bookshelfIcon: {
    fontSize: 28,
  },
  bookshelfTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  bookshelfChapters: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  settingsContent: {
    padding: 20,
    zIndex: 1,
  },
  settingItem: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  settingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  demoEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168,85,247,0.2)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  demoEntryIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  demoEntryInfo: {
    flex: 1,
  },
  demoEntryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.purple,
    marginBottom: 4,
  },
  demoEntryDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  demoEntryArrow: {
    fontSize: 20,
    color: COLORS.purple,
  },
  logoutButton: {
    backgroundColor: COLORS.crimson,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  createHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: COLORS.bgMedium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  backButton: {
    fontSize: 16,
    color: COLORS.gold,
    fontWeight: '600',
  },
  createTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.bgMedium,
    position: 'relative',
  },
  progressStep: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.bgLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
    zIndex: 2,
  },
  progressStepActive: {
    backgroundColor: COLORS.gold,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  progressTextActive: {
    color: '#000',
  },
  progressLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: COLORS.bgLight,
    left: 60,
    right: 60,
    top: '50%',
    zIndex: 1,
  },
  createContent: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  characterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'center',
  },
  plotGrid: {
    marginBottom: 20,
  },
  plotCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  plotCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(255,215,0,0.1)',
  },
  plotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  plotDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  plotCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 20,
    color: COLORS.success,
  },
  titleInput: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 12,
    padding: 20,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  bookInfoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  bookInfoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 8,
  },
  bookInfoMeta: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chapterNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chapterNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  puzzleBadge: {
    fontSize: 12,
    color: COLORS.purple,
    marginTop: 4,
  },
  chapterArrow: {
    fontSize: 20,
    color: COLORS.textMuted,
  },
  readContent: {
    flex: 1,
    padding: 20,
    zIndex: 1,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleUnderline: {
    height: 3,
    backgroundColor: COLORS.gold,
    marginTop: 8,
    borderRadius: 2,
  },
  chapterContentTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  chapterContentText: {
    fontSize: 18,
    color: COLORS.textPrimary,
    lineHeight: 32,
    marginBottom: 16,
  },
  puzzleCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: COLORS.purple,
  },
  puzzleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.purple,
    marginBottom: 16,
  },
  puzzleQuestion: {
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 20,
  },
  puzzleOption: {
    backgroundColor: COLORS.bgMedium,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  puzzleOptionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  resultCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    overflow: 'hidden',
  },
  resultCorrect: {
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  resultWrong: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: COLORS.textPrimary,
  },
  resultText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 12,
    fontStyle: 'italic',
  },
  celebrationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationStar: {
    position: 'absolute',
    fontSize: 24,
  },
  tabBar: {
    backgroundColor: COLORS.bgMedium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 8,
    height: 65,
  },
  tabIcon: {
    fontSize: 24,
  },
  tabIconActive: {
    transform: [{ scale: 1.2 }],
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  directorContent: {
    flex: 1,
    padding: 12,
    zIndex: 1,
  },
  stageArea: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)',
    padding: 12,
    marginBottom: 16,
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gold,
    textAlign: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  stageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  stageSlot: {
    width: '23%',
    aspectRatio: 0.75,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stageSlotRequired: {
    borderColor: 'rgba(255,215,0,0.4)',
  },
  stageSlotFilled: {
    borderStyle: 'solid',
    backgroundColor: COLORS.cardBg,
    borderColor: COLORS.gold,
  },
  slotIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  slotLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  miniCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatar: {
    fontSize: 18,
  },
  miniName: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 2,
    textAlign: 'center',
  },
  storyPreview: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    padding: 10,
  },
  previewText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  cardSection: {
    marginBottom: 16,
    zIndex: 1,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardRow: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  directorCard: {
    width: 80,
    height: 110,
    borderRadius: 10,
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  directorCardSelected: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  directorAvatar: {
    fontSize: 32,
  },
  directorName: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  roleTagSmall: {
    position: 'absolute',
    top: 4,
    left: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  roleTagSmallText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#000',
  },
  cardCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.success,
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 18,
  },
  directorBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  requirements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reqItemMet: {},
  reqIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reqIconMet: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  reqIconText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  reqText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  reqTextMet: {
    color: COLORS.success,
  },
  directorButton: {
    backgroundColor: 'rgba(168,85,247,0.2)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.purple,
    alignItems: 'center',
  },
  directorButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.purple,
    marginBottom: 4,
  },
  directorButtonDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  weatherContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    zIndex: 5,
  },
  sunContainer: {
    position: 'absolute',
    top: 70,
    right: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 25,
    elevation: 15,
  },
  sunRays: {
    position: 'absolute',
    width: 130,
    height: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sunRay: {
    position: 'absolute',
    top: 65,
    left: 63,
    width: 4,
    height: 35,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
    opacity: 0.55,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(174,194,224,0.75)',
    borderRadius: 1,
  },
  lightningFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  snowFlake: {
    position: 'absolute',
    color: '#fff',
  },
  frostOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(200,220,255,0.12)',
  },
  fogLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(180,180,200,0.4)',
    borderRadius: 100,
  },
  fogOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(150,150,170,0.3)',
  },
  windLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 1,
  },
  leaf: {
    position: 'absolute',
  },
  rainbowContainer: {
    position: 'absolute',
    top: 50,
    left: -SCREEN_WIDTH * 0.5,
    right: -SCREEN_WIDTH * 0.5,
    height: 300,
    overflow: 'hidden',
  },
  rainbowArc: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 300,
    borderRadius: 300,
    borderTopLeftRadius: 300,
    borderTopRightRadius: 300,
    borderBottomWidth: 0,
  },
  rainbowRed: {
    top: 0,
    backgroundColor: 'rgba(255,0,0,0.5)',
  },
  rainbowOrange: {
    top: 15,
    backgroundColor: 'rgba(255,165,0,0.5)',
  },
  rainbowYellow: {
    top: 30,
    backgroundColor: 'rgba(255,255,0,0.5)',
  },
  rainbowGreen: {
    top: 45,
    backgroundColor: 'rgba(0,255,0,0.5)',
  },
  rainbowBlue: {
    top: 60,
    backgroundColor: 'rgba(0,0,255,0.5)',
  },
  rainbowIndigo: {
    top: 75,
    backgroundColor: 'rgba(75,0,130,0.5)',
  },
  rainbowViolet: {
    top: 90,
    backgroundColor: 'rgba(238,130,238,0.5)',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 16,
  },
  nightSkyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,30,0.7)',
  },
  star: {
    position: 'absolute',
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  shootingStar: {
    position: 'absolute',
    width: 3,
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  moonContainer: {
    position: 'absolute',
    top: 60,
    right: 30,
  },
  moonEmoji: {
    fontSize: 48,
    textShadowColor: 'rgba(255,255,200,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
});
