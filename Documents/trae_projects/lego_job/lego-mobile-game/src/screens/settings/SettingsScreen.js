import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

const SettingItem = ({ title, icon, onPress, value }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Card style={styles.settingCard}>
      <View style={styles.settingContent}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <Text style={styles.settingTitle}>{title}</Text>
        {value && <Text style={styles.settingValue}>{value}</Text>}
      </View>
    </Card>
  </TouchableOpacity>
);

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { themeName, isDark } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <ParticleBackground count={15} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>设置</Text>

        <Card style={styles.userCard}>
          <Text style={styles.userIcon}>👤</Text>
          <Text style={styles.userName}>{user?.username || '玩家'}</Text>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>外观</Text>
          <SettingItem
            title="主题设置"
            icon="🎨"
            value={isDark ? '深色' : '浅色'}
            onPress={() => navigation.navigate('ThemeSettings')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>家长控制</Text>
          <SettingItem
            title="家长控制"
            icon="🔒"
            onPress={() => navigation.navigate('ParentControl')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>账户</Text>
          <SettingItem
            title="退出登录"
            icon="🚪"
            onPress={handleLogout}
          />
        </View>

        <Text style={styles.version}>版本 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING['3xl'],
  },
  pageTitle: {
    ...TYPOGRAPHY.styles.h2,
    color: COLORS.gold.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  userCard: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  userIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  userName: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
    marginLeft: SPACING.sm,
  },
  settingCard: {
    marginBottom: SPACING.sm,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  settingTitle: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.primary,
    flex: 1,
  },
  settingValue: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
  },
  version: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.disabled,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});

export default SettingsScreen;
