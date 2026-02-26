import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button, Card, ParticleBackground } from '../../components/common';
import { COLORS } from '../../utils/constants';

const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const toast = useToast();

  const iconAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const blockAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(100)).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, { toValue: 1.05, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(buttonPulse, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) {
      toast.error('请输入你的名字');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(username.trim(), email.trim() || null);
      if (result.success) {
        toast.success(`欢迎，${username}！🎉`);
      } else {
        toast.error(`登录失败：${result.error}`);
      }
    } catch (error) {
      toast.error('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ParticleBackground />
      
      <View style={styles.debugLabel}>
        <Text style={styles.debugLabelText}>📱 当前页面: LoginScreen (登录页)</Text>
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Animated.Text 
            style={[
              styles.icon, 
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
              styles.title, 
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
              styles.subtitle, 
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
            styles.cardWrapper,
            {
              opacity: cardAnim,
              transform: [{ translateY: cardY }],
            }
          ]}
        >
          <Card style={styles.card}>
            <Text style={styles.cardTitle}>🎮 登录 / 注册</Text>
            
            <View style={styles.legoBlocks}>
              {blockAnims.map((anim, index) => {
                const colors = [styles.blockYellow, styles.blockBlue, styles.blockRed];
                const scales = anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] });
                const rotations = anim.interpolate({ inputRange: [0, 1], outputRange: ['-30deg', '0deg'] });
                return (
                  <Animated.View 
                    key={index}
                    style={[
                      styles.block, 
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
              <View style={styles.inputGroup}>
                <Text style={styles.label}>👤 你的名字</Text>
                <TextInput
                  style={styles.input}
                  placeholder="输入你的冒险者名字"
                  placeholderTextColor={COLORS.textMuted}
                  value={username}
                  onChangeText={setUsername}
                  maxLength={20}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>📧 邮箱（可选）</Text>
                <TextInput
                  style={styles.input}
                  placeholder="输入邮箱地址"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
                <Button
                  title="🚀 开始冒险"
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  size="lg"
                  style={styles.button}
                />
              </Animated.View>
            </View>

            <Text style={styles.hint}>💡 首次登录将自动创建账号</Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  debugLabel: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    zIndex: 10,
  },
  debugLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.textLight,
  },
  cardWrapper: {
    zIndex: 1,
  },
  card: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  legoBlocks: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  block: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  blockYellow: {
    backgroundColor: COLORS.legoYellow,
  },
  blockBlue: {
    backgroundColor: COLORS.legoBlue,
  },
  blockRed: {
    backgroundColor: COLORS.legoRed,
  },
  form: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 3,
    borderColor: COLORS.legoYellow,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  button: {
    marginTop: 8,
  },
  hint: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;
