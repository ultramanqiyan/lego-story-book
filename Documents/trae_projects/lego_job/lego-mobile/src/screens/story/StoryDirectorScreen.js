import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { charactersAPI, chaptersAPI, plotOptionsAPI } from '../../api';
import { Card, Button, Loading, Header, Modal, GlowOrbBackground } from '../../components/common';
import CardDeck from '../../components/story/CardDeck';
import StagePreview from '../../components/story/StagePreview';
import WeatherEffect from '../../components/story/WeatherEffect';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';

const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const StoryDirectorScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { user } = useAuth();
  const toast = useToast();

  const [characters, setCharacters] = useState([]);
  const [plotOptions, setPlotOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [plotSelection, setPlotSelection] = useState({
    weather: null,
    adventureType: null,
    terrain: null,
    equipment: null,
  });

  const titleAnim = useRef(new Animated.Value(0)).current;
  const charCardAnims = useRef([]).current;
  const slotAnims = useRef({}).current;
  const buttonPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 600,
        easing: BOUNCE_EASING,
        useNativeDriver: true,
      }).start();

      charCardAnims.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          tension: 80,
          friction: 7,
          delay: index * 60,
          useNativeDriver: true,
        }).start();
      });

      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonPulse, { toValue: 1.05, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(buttonPulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isLoading]);

  const loadData = async () => {
    try {
      const [charsData, plotData] = await Promise.all([
        charactersAPI.getList(user?.userId),
        plotOptionsAPI.get(),
      ]);
      setCharacters(charsData.characters || []);
      setPlotOptions(plotData.plotOptions);
      
      charsData.characters?.forEach((_, i) => {
        charCardAnims[i] = new Animated.Value(0);
      });
    } catch (error) {
      toast.error('加载数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCharacter = (character) => {
    const isSelected = selectedCharacters.some(
      (c) => c.character_id === character.character_id
    );
    if (isSelected) {
      setSelectedCharacters(
        selectedCharacters.filter((c) => c.character_id !== character.character_id)
      );
    } else {
      if (selectedCharacters.length >= 5) {
        toast.warning('最多选择5个角色');
        return;
      }
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  const handleGenerate = async () => {
    if (selectedCharacters.length === 0) {
      toast.error('请至少选择一个角色');
      return;
    }

    const { weather, adventureType, terrain, equipment } = plotSelection;
    if (!weather || !adventureType || !terrain || !equipment) {
      toast.error('请选择所有情节选项');
      return;
    }

    setIsGenerating(true);
    try {
      const characterIds = selectedCharacters.map((c) => c.character_id);
      await chaptersAPI.generate(bookId, user?.userId, plotSelection, characterIds);
      toast.success('章节生成成功！🎬');
      navigation.goBack();
    } catch (error) {
      toast.error(`生成失败：${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const randomSelect = () => {
    if (!plotOptions) return;

    const randomItem = (items) => items[Math.floor(Math.random() * items.length)];

    setPlotSelection({
      weather: randomItem(plotOptions.weather).id,
      adventureType: randomItem(plotOptions.adventureType).id,
      terrain: randomItem(plotOptions.terrain).id,
      equipment: randomItem(plotOptions.equipment).id,
    });

    toast.success('🎲 随机选择完成！');
  };

  const isReady = selectedCharacters.length > 0 && 
    plotSelection.weather && 
    plotSelection.adventureType && 
    plotSelection.terrain && 
    plotSelection.equipment;

  if (isLoading) {
    return <Loading fullScreen message="加载导演台..." />;
  }

  return (
    <View style={styles.container}>
      <GlowOrbBackground />
      <WeatherEffect weather={plotSelection.weather} />
      
      <Header
        title="🎬 故事导演台"
        leftButton={<Header.BackButton onPress={() => navigation.goBack()} />}
        rightButton={
          <TouchableOpacity onPress={randomSelect}>
            <Text style={styles.randomBtn}>🎲 随机</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView style={styles.content}>
        <StagePreview
          characters={selectedCharacters}
          weather={plotSelection.weather}
          terrain={plotSelection.terrain}
        />

        <View style={styles.section}>
          <Animated.Text 
            style={[
              styles.sectionTitle,
              { opacity: titleAnim, transform: [{ translateX: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }
            ]}
          >
            👥 选择角色 ({selectedCharacters.length}/5)
          </Animated.Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.characterGrid}>
              {characters.map((char, index) => {
                const isSelected = selectedCharacters.some(
                  (c) => c.character_id === char.character_id
                );
                const anim = charCardAnims[index] || new Animated.Value(1);
                const scale = isSelected ? 1.08 : 1;
                const translateY = isSelected ? -8 : 0;
                
                return (
                  <Animated.View
                    key={char.character_id}
                    style={{
                      opacity: anim,
                      transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }],
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.characterCard,
                        isSelected && styles.characterCardSelected,
                      ]}
                      onPress={() => toggleCharacter(char)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.characterEmoji}>
                        {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
                      </Text>
                      <Text style={styles.characterName} numberOfLines={1}>
                        {char.name}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkMark}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {plotOptions && (
          <>
            <CardDeck
              title="☀️ 选择天气"
              items={plotOptions.weather}
              selectedId={plotSelection.weather}
              onSelect={(id) =>
                setPlotSelection({ ...plotSelection, weather: id })
              }
            />

            <CardDeck
              title="🗺️ 选择冒险类型"
              items={plotOptions.adventureType}
              selectedId={plotSelection.adventureType}
              onSelect={(id) =>
                setPlotSelection({ ...plotSelection, adventureType: id })
              }
            />

            <CardDeck
              title="🌲 选择地形"
              items={plotOptions.terrain}
              selectedId={plotSelection.terrain}
              onSelect={(id) =>
                setPlotSelection({ ...plotSelection, terrain: id })
              }
            />

            <CardDeck
              title="🪄 选择装备"
              items={plotOptions.equipment}
              selectedId={plotSelection.equipment}
              onSelect={(id) =>
                setPlotSelection({ ...plotSelection, equipment: id })
              }
            />
          </>
        )}

        <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
          <Button
            title={isGenerating ? '🎬 拍摄中...' : '🎬 开始拍摄！'}
            onPress={handleGenerate}
            loading={isGenerating}
            disabled={isGenerating || !isReady}
            size="lg"
            style={[styles.generateButton, isReady && styles.generateButtonReady]}
          />
        </Animated.View>

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
  randomBtn: {
    fontSize: 16,
    color: COLORS.legoBlue,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  characterGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 16,
  },
  characterCard: {
    width: 80,
    height: 100,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  characterCardSelected: {
    borderColor: COLORS.legoYellow,
    borderWidth: 3,
    backgroundColor: COLORS.legoYellow,
    shadowColor: COLORS.legoYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  characterEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  characterName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  checkMark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.legoGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  generateButton: {
    margin: 20,
    marginTop: 16,
  },
  generateButtonReady: {
    shadowColor: COLORS.legoYellow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  bottomSpace: {
    height: 40,
  },
});

export default StoryDirectorScreen;
