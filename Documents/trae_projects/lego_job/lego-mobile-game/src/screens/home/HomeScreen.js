import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, ParticleBackground, GlowEffect } from '../../components';

const MenuCard = ({ title, icon, onPress, color }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Card style={[styles.menuCard, { borderColor: color }]}>
      <GlowEffect color={color} radius={20} pulse>
        <Text style={styles.menuIcon}>{icon}</Text>
      </GlowEffect>
      <Text style={styles.menuTitle}>{title}</Text>
    </Card>
  </TouchableOpacity>
);

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { currentBook, score } = useGame();

  const menuItems = [
    { title: '书架', icon: '📚', route: 'Bookshelf', color: COLORS.magic.blue },
    { title: '角色', icon: '🎭', route: 'Characters', color: COLORS.magic.purple },
    { title: '冒险', icon: '🗺️', route: 'Adventure', color: COLORS.status.success },
    { title: '设置', icon: '⚙️', route: 'Settings', color: COLORS.text.secondary },
  ];

  return (
    <View style={styles.container}>
      <ParticleBackground count={20} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>LEGO 故事冒险</Text>
          <Text style={styles.subtitle}>选择你的冒险</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuCard
              key={item.route}
              title={item.title}
              icon={item.icon}
              color={item.color}
              onPress={() => navigation.navigate(item.route)}
            />
          ))}
        </View>

        {currentBook && (
          <Card style={styles.currentBookCard}>
            <Text style={styles.sectionTitle}>当前故事</Text>
            <Text style={styles.bookTitle}>{currentBook.title}</Text>
            <TouchableOpacity
              style={styles.continueCard}
              onPress={() => navigation.navigate('BookDetail', { bookId: currentBook.id })}
            >
              <Text style={styles.continueText}>继续阅读</Text>
            </TouchableOpacity>
          </Card>
        )}

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{score}</Text>
            <Text style={styles.statLabel}>积分</Text>
          </Card>
        </View>
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
    paddingTop: SPACING['4xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  title: {
    ...TYPOGRAPHY.styles.h1,
    color: COLORS.gold.primary,
    textShadowColor: COLORS.gold.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  menuCard: {
    width: '48%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  menuIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  menuTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
  },
  currentBookCard: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.gold.primary,
    marginBottom: SPACING.md,
  },
  bookTitle: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  continueCard: {
    backgroundColor: COLORS.gold.primary,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
  },
  continueText: {
    ...TYPOGRAPHY.styles.button,
    color: COLORS.background.primary,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statCard: {
    alignItems: 'center',
    paddingHorizontal: SPACING['3xl'],
  },
  statValue: {
    ...TYPOGRAPHY.styles.h2,
    color: COLORS.gold.primary,
  },
  statLabel: {
    ...TYPOGRAPHY.styles.caption,
    color: COLORS.text.secondary,
  },
});

export default HomeScreen;
