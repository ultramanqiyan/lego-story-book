import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { usersAPI } from '../../api';
import { Card, Button, Header } from '../../components/common';
import { COLORS } from '../../utils/constants';
import { formatTime } from '../../utils/helpers';

const ParentControlScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { theme, themes, themeId, changeTheme } = useTheme();
  const toast = useToast();

  const [timeLimit, setTimeLimit] = useState(120);
  const [timeUsed, setTimeUsed] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]);
  const [stats, setStats] = useState({
    storiesCompleted: 0,
    chaptersCompleted: 0,
    puzzlesSolved: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await usersAPI.getUser(user?.userId);
      if (data?.user) {
        const u = data.user;
        setTimeLimit(u.daily_time_limit || u.dailyTimeLimit || 120);
        setTimeUsed(u.time_used_today || u.timeUsedToday || 0);
        setWeeklyData(u.weekly_data || u.weeklyData || []);
        setStats({
          storiesCompleted: u.stories_completed || u.storiesCompleted || 0,
          chaptersCompleted: u.chapters_completed || u.chaptersCompleted || 0,
          puzzlesSolved: u.puzzles_solved || u.puzzlesSolved || 0,
        });
      }
    } catch (error) {
      toast.error('加载数据失败');
    }
  };

  const handleTimeLimitChange = async (newLimit) => {
    if (newLimit < 15 || newLimit > 480) return;
    
    setTimeLimit(newLimit);
    try {
      await usersAPI.updateUser(user?.userId, { dailyTimeLimit: newLimit });
      toast.success('时间限制已更新');
    } catch (error) {
      toast.error('更新失败');
    }
  };

  const progress = Math.min((timeUsed / timeLimit) * 100, 100);

  return (
    <View style={styles.container}>
      <Header
        title="👨‍👩‍👧 家长控制"
        leftButton={<Header.BackButton onPress={() => navigation.goBack()} />}
      />

      <ScrollView style={styles.content}>
        <Card style={styles.timeCard}>
          <Text style={styles.cardTitle}>📊 今日阅读时间</Text>
          <Text style={styles.timeValue}>{formatTime(timeUsed)}</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.timeLimit}>
            每日限额：{formatTime(timeLimit)}
          </Text>
        </Card>

        <Card style={styles.limitCard}>
          <Text style={styles.cardTitle}>⏰ 每日时间限制</Text>
          <View style={styles.limitControl}>
            <TouchableOpacity
              style={styles.limitBtn}
              onPress={() => handleTimeLimitChange(timeLimit - 15)}
            >
              <Text style={styles.limitBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.limitValue}>{formatTime(timeLimit)}</Text>
            <TouchableOpacity
              style={styles.limitBtn}
              onPress={() => handleTimeLimitChange(timeLimit + 15)}
            >
              <Text style={styles.limitBtnText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.limitHint}>范围：15分钟 - 8小时</Text>
        </Card>

        <Card style={styles.themeCard}>
          <Text style={styles.cardTitle}>🎨 主题风格</Text>
          <View style={styles.themeGrid}>
            {themes.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[
                  styles.themeOption,
                  themeId === t.id && styles.themeOptionActive,
                  { borderColor: t.colors.primary },
                ]}
                onPress={() => changeTheme(t.id)}
              >
                <View
                  style={[styles.themeColor, { backgroundColor: t.colors.primary }]}
                />
                <Text style={styles.themeName}>{t.name}</Text>
                {themeId === t.id && <Text style={styles.themeCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.cardTitle}>📚 阅读统计</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.storiesCompleted}</Text>
              <Text style={styles.statLabel}>完成故事</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.chaptersCompleted}</Text>
              <Text style={styles.statLabel}>完成章节</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.puzzlesSolved}</Text>
              <Text style={styles.statLabel}>解答谜题</Text>
            </View>
          </View>
        </Card>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  timeCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  timeValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.legoBlue,
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: COLORS.borderLight,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.legoGreen,
    borderRadius: 6,
  },
  timeLimit: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  limitCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  limitControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.legoYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  limitBtnText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  limitValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginHorizontal: 32,
  },
  limitHint: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  themeCard: {
    padding: 20,
    marginBottom: 16,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeOption: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
  },
  themeOptionActive: {
    borderWidth: 3,
  },
  themeColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  themeName: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  themeCheck: {
    fontSize: 16,
    color: COLORS.legoGreen,
    fontWeight: 'bold',
  },
  statsCard: {
    padding: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.legoOrange,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  bottomSpace: {
    height: 40,
  },
});

export default ParentControlScreen;
