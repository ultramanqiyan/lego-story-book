import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  Animated,
  Easing,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { charactersAPI, booksAPI } from '../../api';
import { Card, Button, Loading, EmptyState, GlowOrbBackground } from '../../components/common';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';

const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const toast = useToast();
  
  const [popularCharacters, setPopularCharacters] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
      startAnimations();
    }
  }, [isLoading]);

  const startAnimations = () => {
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
  };

  const loadData = async () => {
    try {
      const [charsData, booksData] = await Promise.all([
        charactersAPI.getList(user?.userId),
        user?.userId ? booksAPI.getList(user.userId) : Promise.resolve({ books: [] }),
      ]);

      const presetChars = (charsData.characters || [])
        .filter((c) => c.creator_id === 'system')
        .slice(0, 4);
      setPopularCharacters(presetChars);

      const recent = (booksData.books || []).slice(0, 4);
      setRecentBooks(recent);
    } catch (error) {
      toast.error('加载失败，请下拉刷新');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const renderCharacterItem = ({ item, index }) => {
    const translateX = charCardAnims[index]?.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 0],
    }) || 0;

    return (
      <Animated.View
        style={{
          opacity: charCardAnims[index] || 1,
          transform: [{ translateX }],
        }}
      >
        <Card
          style={styles.characterCard}
          onPress={() => navigation.navigate('Characters')}
        >
          <Text style={styles.characterEmoji}>
            {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
          </Text>
          <Text style={styles.characterName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.characterDesc} numberOfLines={2}>
            {item.description || '神秘角色'}
          </Text>
        </Card>
      </Animated.View>
    );
  };

  const renderBookItem = ({ item, index }) => {
    const colors = [COLORS.legoBlue, COLORS.legoPurple, COLORS.legoGreen, COLORS.legoOrange];
    const color = colors[index % colors.length];
    
    const translateY = bookCardAnims[index]?.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    }) || 0;

    return (
      <Animated.View
        style={{
          opacity: bookCardAnims[index] || 1,
          transform: [{ translateY }],
        }}
      >
        <Card
          style={[styles.bookCard, { borderLeftColor: color, borderLeftWidth: 4 }]}
          onPress={() => navigation.navigate('BookDetail', { bookId: item.book_id })}
        >
          <Text style={styles.bookIcon}>📖</Text>
          <Text style={styles.bookTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.bookChapters}>📚 {item.chapter_count}章</Text>
        </Card>
      </Animated.View>
    );
  };

  if (isLoading) {
    return <Loading fullScreen message="加载中..." />;
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
      
      <View style={styles.debugLabel}>
        <Text style={styles.debugLabelText}>📱 当前页面: HomeScreen (首页)</Text>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
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
          <Card variant="primary" style={styles.welcomeCard}>
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
              <Button
                title="🎮 开始冒险"
                onPress={() => navigation.navigate('StoryCreate')}
                size="lg"
                style={styles.startButton}
              />
            </Animated.View>
          </Card>
        </Animated.View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 热门人仔</Text>
            <Button
              title="查看全部"
              variant="outline"
              size="sm"
              onPress={() => navigation.navigate('Characters')}
            />
          </View>
          {popularCharacters.length > 0 ? (
            <FlatList
              data={popularCharacters}
              renderItem={renderCharacterItem}
              keyExtractor={(item) => item.character_id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <EmptyState
              icon="🎭"
              title="暂无热门人仔"
              description="快去创建你的第一个角色吧"
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 最近故事</Text>
            <Button
              title="查看全部"
              variant="outline"
              size="sm"
              onPress={() => navigation.navigate('Bookshelf')}
            />
          </View>
          {recentBooks.length > 0 ? (
            <FlatList
              data={recentBooks}
              renderItem={renderBookItem}
              keyExtractor={(item) => item.book_id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <EmptyState
              icon="📚"
              title="还没有故事"
              description="创建你的第一个冒险故事吧"
              action={
                <Button
                  title="✨ 创建故事"
                  onPress={() => navigation.navigate('StoryCreate')}
                />
              }
            />
          )}
        </View>

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
  debugLabel: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 50,
    alignItems: 'center',
    zIndex: 10,
  },
  debugLabelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
  },
  welcomeCardWrapper: {
    zIndex: 1,
  },
  welcomeCard: {
    margin: 20,
    marginTop: 0,
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  welcomeDesc: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  featureList: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 28,
  },
  startButton: {
    marginTop: 8,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  horizontalList: {
    paddingRight: 20,
  },
  characterCard: {
    width: 140,
    marginRight: 12,
    alignItems: 'center',
    padding: 16,
  },
  characterEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  characterDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  bookCard: {
    width: 160,
    marginRight: 12,
    padding: 16,
  },
  bookIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  bottomSpace: {
    height: 100,
  },
});

export default HomeScreen;
