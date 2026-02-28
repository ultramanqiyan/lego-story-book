import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, GlowEffect } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

const ThemeOption = ({ name, label, icon, isSelected, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Card
      rarity={isSelected ? 'legendary' : 'common'}
      selected={isSelected}
      style={styles.themeCard}
    >
      <GlowEffect color={COLORS.gold.primary} radius={20} pulse={isSelected}>
        <Text style={styles.themeIcon}>{icon}</Text>
      </GlowEffect>
      <Text style={styles.themeLabel}>{label}</Text>
      {isSelected && (
        <Text style={styles.selectedBadge}>✓</Text>
      )}
    </Card>
  </TouchableOpacity>
);

export const ThemeSettingsScreen = () => {
  const { themeName, changeTheme } = useTheme();
  const { showSuccess, showError } = useToast();

  const handleThemeChange = async (newThemeName) => {
    const result = await changeTheme(newThemeName);
    if (result.success) {
      showSuccess(`已切换到${newThemeName === 'dark' ? '深色' : '浅色'}主题`);
    } else {
      showError('切换主题失败');
    }
  };

  const themes = [
    { name: 'dark', label: '深色主题', icon: '🌙' },
    { name: 'light', label: '浅色主题', icon: '☀️' },
  ];

  return (
    <View style={styles.container}>
      <ParticleBackground count={15} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>主题设置</Text>

        <View style={styles.themeGrid}>
          {themes.map(theme => (
            <ThemeOption
              key={theme.name}
              name={theme.name}
              label={theme.label}
              icon={theme.icon}
              isSelected={themeName === theme.name}
              onPress={() => handleThemeChange(theme.name)}
            />
          ))}
        </View>

        <Card style={styles.previewCard}>
          <Text style={styles.previewTitle}>主题预览</Text>
          <View style={styles.previewContent}>
            <View style={styles.colorPreview}>
              <View style={[styles.colorBox, { backgroundColor: COLORS.gold.primary }]} />
              <View style={[styles.colorBox, { backgroundColor: COLORS.magic.blue }]} />
              <View style={[styles.colorBox, { backgroundColor: COLORS.magic.purple }]} />
            </View>
            <Text style={styles.previewText}>
              当前主题：{themeName === 'dark' ? '深色' : '浅色'}
            </Text>
          </View>
        </Card>
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
  themeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  themeCard: {
    width: '48%',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  themeLabel: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
  },
  selectedBadge: {
    ...TYPOGRAPHY.styles.h3,
    color: COLORS.gold.primary,
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
  },
  previewCard: {
    marginBottom: SPACING.xl,
  },
  previewTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  previewContent: {
    alignItems: 'center',
  },
  colorPreview: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  previewText: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
  },
});

export default ThemeSettingsScreen;
