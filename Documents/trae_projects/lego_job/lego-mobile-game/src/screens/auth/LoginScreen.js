import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, GlowEffect, Loading } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';
import api from '../../api';

export const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showError, showSuccess } = useToast();

  const handleLogin = async () => {
    if (!username.trim()) {
      showError('请输入用户名');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.users.createOrLogin(username.trim(), `${username.trim()}@lego.game`);
      if (response.data && response.data.id) {
        await login({ 
          username: username.trim(), 
          id: response.data.id,
          userId: response.data.id,
          isNewUser: response.data.isNewUser
        });
        showSuccess(response.data.isNewUser ? '欢迎新玩家!' : '欢迎回来!');
      } else {
        showError('登录失败，请重试');
      }
    } catch (error) {
      showError('登录失败，请重试');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ParticleBackground count={30} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <GlowEffect color={COLORS.gold.primary} radius={60} pulse>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>LEGO</Text>
            <Text style={styles.subtitle}>故事冒险</Text>
          </View>
        </GlowEffect>

        <Card style={styles.formCard}>
          <Text style={styles.formTitle}>开始冒险</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="用户名"
              placeholderTextColor={COLORS.text.disabled}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={20}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginCard, isLoading && styles.loginCardDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loading size="small" />
            ) : (
              <Text style={styles.loginText}>进入游戏</Text>
            )}
          </TouchableOpacity>
        </Card>

        <Text style={styles.hint}>输入用户名即可开始冒险</Text>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  title: {
    ...TYPOGRAPHY.styles.h1,
    color: COLORS.gold.primary,
    fontSize: 48,
    textShadowColor: COLORS.gold.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    ...TYPOGRAPHY.styles.h3,
    color: COLORS.text.primary,
    marginTop: SPACING.sm,
  },
  formCard: {
    width: '100%',
    maxWidth: 320,
    padding: SPACING.xl,
  },
  formTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.gold.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 2,
    borderColor: COLORS.border.gold,
    borderRadius: 12,
    padding: SPACING.md,
    color: COLORS.text.primary,
    ...TYPOGRAPHY.styles.body,
  },
  loginCard: {
    backgroundColor: COLORS.gold.primary,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  loginCardDisabled: {
    opacity: 0.6,
  },
  loginText: {
    ...TYPOGRAPHY.styles.button,
    color: COLORS.background.primary,
    fontWeight: '700',
  },
  hint: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.disabled,
    marginTop: SPACING.xl,
  },
});

export default LoginScreen;
