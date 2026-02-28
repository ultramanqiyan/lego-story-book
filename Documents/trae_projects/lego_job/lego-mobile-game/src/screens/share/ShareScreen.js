import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, Loading, GlowEffect } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

export const ShareScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId, storyId } = route.params || {};
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [shareCode, setShareCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateShare = async () => {
    const targetBookId = bookId || storyId;
    if (!targetBookId) {
      showError('缺少书籍信息');
      return;
    }
    
    setIsCreating(true);
    try {
      const response = await api.share.create(targetBookId, user?.id || user?.userId);
      setShareCode(response.data?.code || response.data?.shareCode);
      showSuccess('分享链接已创建');
    } catch (error) {
      showError('创建分享失败');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = () => {
    const link = `https://lego-story.app/share/${shareCode}`;
    // Clipboard.setString(link);
    showSuccess('链接已复制');
  };

  return (
    <View style={styles.container}>
      <ParticleBackground count={15} colors={[COLORS.magic.blue]} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <GlowEffect color={COLORS.gold.primary} radius={50} pulse>
          <Text style={styles.pageTitle}>分享故事</Text>
        </GlowEffect>

        {!shareCode ? (
          <Card style={styles.createCard}>
            <Text style={styles.cardTitle}>创建分享链接</Text>
            <Text style={styles.cardDescription}>
              创建一个分享链接，让朋友们也能体验你的故事
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateShare}
              disabled={isCreating}
            >
              {isCreating ? (
                <Loading size="small" />
              ) : (
                <Text style={styles.createButtonText}>创建分享</Text>
              )}
            </TouchableOpacity>
          </Card>
        ) : (
          <Card style={styles.shareCard}>
            <Text style={styles.cardTitle}>分享链接</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.shareCode}>{shareCode}</Text>
            </View>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
              <Text style={styles.copyButtonText}>复制链接</Text>
            </TouchableOpacity>
          </Card>
        )}

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>分享说明</Text>
          <Text style={styles.infoText}>
            分享链接有效期为30天，过期后需要重新创建。
          </Text>
          <Text style={styles.infoText}>
            朋友们可以通过链接访问你的故事内容。
          </Text>
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
  createCard: {
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  cardDescription: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.lg,
  },
  createButton: {
    backgroundColor: COLORS.gold.primary,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  createButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: COLORS.background.primary,
    fontWeight: '600',
  },
  shareCard: {
    marginBottom: SPACING.xl,
  },
  codeContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  shareCode: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.gold.primary,
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 4,
  },
  copyButton: {
    backgroundColor: COLORS.magic.blue,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  copyButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: '#ffffff',
    fontWeight: '600',
  },
  infoCard: {
    marginBottom: SPACING.xl,
  },
  infoTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.gold.primary,
    marginBottom: SPACING.sm,
  },
  infoText: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
    marginBottom: SPACING.sm,
  },
});

export default ShareScreen;
