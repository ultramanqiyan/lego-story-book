import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

export const ParentControlScreen = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [timeLimit, setTimeLimit] = useState(60);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setTimeLimit(user.settings.timeLimit || 60);
      setIsLocked(user.settings.isLocked || false);
    }
  }, [user]);

  const handleSaveSettings = async () => {
    try {
      await updateUser({
        settings: {
          ...user?.settings,
          timeLimit,
          isLocked,
        },
      });
      showSuccess('设置已保存');
    } catch (error) {
      showError('保存失败');
    }
  };

  return (
    <View style={styles.container}>
      <ParticleBackground count={15} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>家长控制</Text>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>使用时间限制</Text>
          <Text style={styles.cardDescription}>
            设置每天的最大使用时间（分钟）
          </Text>
          <View style={styles.timeSelector}>
            {[30, 60, 90, 120].map(minutes => (
              <TouchableOpacity
                key={minutes}
                style={[
                  styles.timeOption,
                  timeLimit === minutes && styles.timeOptionActive,
                ]}
                onPress={() => setTimeLimit(minutes)}
              >
                <Text
                  style={[
                    styles.timeText,
                    timeLimit === minutes && styles.timeTextActive,
                  ]}
                >
                  {minutes}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>锁定应用</Text>
          <Text style={styles.cardDescription}>
            锁定后需要家长密码才能解锁
          </Text>
          <TouchableOpacity
            style={[styles.lockButton, isLocked && styles.lockButtonLocked]}
            onPress={() => setIsLocked(!isLocked)}
          >
            <Text style={styles.lockButtonText}>
              {isLocked ? '🔒 已锁定' : '🔓 未锁定'}
            </Text>
          </TouchableOpacity>
        </Card>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings}>
          <Text style={styles.saveButtonText}>保存设置</Text>
        </TouchableOpacity>
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
  card: {
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
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SPACING.md,
    minWidth: 60,
    alignItems: 'center',
  },
  timeOptionActive: {
    backgroundColor: COLORS.gold.primary,
  },
  timeText: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.primary,
  },
  timeTextActive: {
    color: COLORS.background.primary,
    fontWeight: '600',
  },
  lockButton: {
    backgroundColor: COLORS.status.warning,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
  },
  lockButtonLocked: {
    backgroundColor: COLORS.status.error,
  },
  lockButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: '#ffffff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: COLORS.status.success,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  saveButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default ParentControlScreen;
