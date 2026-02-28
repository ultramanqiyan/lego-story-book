import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useToast } from '../../context/ToastContext';
import api from '../../api';
import { COLORS } from '../../styles/colors';
import { SPACING } from '../../styles/spacing';
import { TYPOGRAPHY } from '../../styles/typography';
import { Card, EmptyState, Loading } from '../../components';
import { ParticleBackground } from '../../components/ParticleBackground';

export const StoryDirectorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { bookId } = route.params || {};
  const { showSuccess, showError } = useToast();
  const [plots, setPlots] = useState([]);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlots();
  }, []);

  const loadPlots = async () => {
    try {
      setIsLoading(true);
      const response = await api.story.getPlots(bookId);
      setPlots(response.data || []);
    } catch (error) {
      setPlots([
        { id: '1', title: '冒险开始', description: '主角踏上冒险之旅' },
        { id: '2', title: '遭遇挑战', description: '遇到第一个挑战' },
        { id: '3', title: '转折点', description: '故事发生转折' },
        { id: '4', title: '最终决战', description: '面对最终敌人' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlot = (plot) => {
    setSelectedPlot(plot);
  };

  const handleApplyPlot = async () => {
    if (!selectedPlot) return;
    try {
      await api.story.applyPlot(bookId, selectedPlot.id);
      showSuccess('情节应用成功');
    } catch (error) {
      showError('应用情节失败');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Loading size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ParticleBackground count={15} colors={[COLORS.magic.purple]} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.pageTitle}>导演模式</Text>
        <Text style={styles.pageSubtitle}>选择故事走向</Text>

        {plots.map(plot => (
          <TouchableOpacity key={plot.id} onPress={() => handleSelectPlot(plot)}>
            <Card
              rarity={selectedPlot?.id === plot.id ? 'epic' : 'common'}
              selected={selectedPlot?.id === plot.id}
              style={styles.plotCard}
            >
              <Text style={styles.plotTitle}>{plot.title}</Text>
              <Text style={styles.plotDescription}>{plot.description}</Text>
            </Card>
          </TouchableOpacity>
        ))}

        {selectedPlot && (
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyPlot}>
            <Text style={styles.applyButtonText}>应用此情节</Text>
          </TouchableOpacity>
        )}
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
  },
  pageSubtitle: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  plotCard: {
    marginBottom: SPACING.md,
  },
  plotTitle: {
    ...TYPOGRAPHY.styles.h4,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  plotDescription: {
    ...TYPOGRAPHY.styles.body,
    color: COLORS.text.secondary,
  },
  applyButton: {
    backgroundColor: COLORS.magic.purple,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  applyButtonText: {
    ...TYPOGRAPHY.styles.button,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default StoryDirectorScreen;
