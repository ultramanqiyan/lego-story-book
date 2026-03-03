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
import StagePreview from '../../components/story/StagePreview';
import CardSelector2D from '../../components/card2d/CardSelector2D';
import { WeatherEffectV2 } from '../../components/weather';
import { MagicParticles } from '../../components/particles';
import { COLORS, CHARACTER_EMOJIS } from '../../utils/constants';
import logger from '../../utils/logger';

const BOUNCE_EASING = Easing.bezier(0.68, -0.55, 0.265, 1.55);

const ROLE_TYPES = [
  { value: 'protagonist', label: '主角', icon: '👑', color: COLORS.legoYellow },
  { value: 'antagonist', label: '反派', icon: '😈', color: COLORS.legoRed },
  { value: 'supporting', label: '配角', icon: '⭐', color: COLORS.legoBlue },
  { value: 'extra', label: '路人', icon: '👤', color: COLORS.textLight },
];

const StoryDirectorScreen = ({ route, navigation }) => {
  const { bookId } = route.params || {};
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
  const buttonPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    logger.screen.mount('StoryDirectorScreen', { bookId, userId: user?.userId });
    return () => logger.screen.unmount('StoryDirectorScreen');
  }, []);

  useEffect(() => {
    if (!bookId) {
      logger.screen.error('StoryDirectorScreen', 'invalid_bookId', { bookId });
      toast.error('书籍ID无效');
      navigation.goBack();
      return;
    }
    loadData();
  }, [bookId]);

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
      // 处理 plotOptions 数据格式，支持两种格式：{ plotOptions: {...} } 或 { weather: [...], ... }
      const options = plotData.plotOptions || plotData || {};
      setPlotOptions(options);
      
      charsData.characters?.forEach((_, i) => {
        charCardAnims[i] = new Animated.Value(0);
      });
    } catch (error) {
      toast.error('加载数据失败');
      console.error('加载数据错误:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCharacterId = (character) => {
    return character.character_id || character.id || character.characterId;
  };

  const getRoleCount = (roleType) => {
    return selectedCharacters.filter(c => c.roleType === roleType).length;
  };

  const toggleCharacter = (character) => {
    const charId = getCharacterId(character);
    const existingIndex = selectedCharacters.findIndex(
      (c) => getCharacterId(c) === charId
    );
    
    if (existingIndex !== -1) {
      setSelectedCharacters(
        selectedCharacters.filter((c) => getCharacterId(c) !== charId)
      );
    } else {
      if (selectedCharacters.length >= 5) {
        toast.warning('最多选择5个角色');
        return;
      }
      
      const hasProtagonist = getRoleCount('protagonist') > 0;
      const newCharacter = {
        ...character,
        characterId: charId,
        roleType: hasProtagonist ? 'supporting' : 'protagonist',
      };
      setSelectedCharacters([...selectedCharacters, newCharacter]);
    }
  };

  const updateCharacterRole = (characterId, newRoleType) => {
    if (newRoleType === 'protagonist') {
      const currentProtagonist = selectedCharacters.find(c => c.roleType === 'protagonist');
      if (currentProtagonist && getCharacterId(currentProtagonist) !== characterId) {
        setSelectedCharacters(selectedCharacters.map(c => {
          if (getCharacterId(c) === characterId) {
            return { ...c, roleType: newRoleType };
          }
          if (c.roleType === 'protagonist') {
            return { ...c, roleType: 'supporting' };
          }
          return c;
        }));
        return;
      }
    }

    if (newRoleType === 'supporting' && getRoleCount('supporting') >= 2) {
      const currentChar = selectedCharacters.find(c => getCharacterId(c) === characterId);
      if (currentChar && currentChar.roleType !== 'supporting') {
        toast.warning('配角最多只能选2个');
        return;
      }
    }

    setSelectedCharacters(selectedCharacters.map(c => 
      getCharacterId(c) === characterId ? { ...c, roleType: newRoleType } : c
    ));
  };

  const handleGenerate = async () => {
    if (selectedCharacters.length === 0) {
      toast.error('请至少选择一个角色');
      return;
    }

    const hasProtagonist = getRoleCount('protagonist') > 0;
    if (!hasProtagonist) {
      toast.error('请至少选择一个主角');
      return;
    }

    const { weather, adventureType, terrain, equipment } = plotSelection;
    if (!weather || !adventureType || !terrain || !equipment) {
      toast.error('请选择所有情节选项');
      return;
    }

    setIsGenerating(true);
    try {
      const characterIds = selectedCharacters.map(c => getCharacterId(c));
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

  const getRoleInfo = (roleType) => {
    return ROLE_TYPES.find(r => r.value === roleType) || ROLE_TYPES[2];
  };

  const isReady = selectedCharacters.length > 0 && 
    getRoleCount('protagonist') > 0 &&
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
      <MagicParticles count={15} enabled={true} />
      <WeatherEffectV2 weather={plotSelection.weather} />
      
      <View style={styles.debugLabel}>
        <Text style={styles.debugLabelText}>📱 当前页面: StoryDirectorScreen (故事导演台)</Text>
      </View>
      
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
          adventureType={plotSelection.adventureType}
          items={plotSelection.equipment ? [plotSelection.equipment] : []}
          onRemoveCharacter={toggleCharacter}
          onRemoveTerrain={() => setPlotSelection({ ...plotSelection, terrain: null })}
          onRemoveWeather={() => setPlotSelection({ ...plotSelection, weather: null })}
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
                const selectedChar = selectedCharacters.find(
                  (c) => c.character_id === char.character_id
                );
                const isSelected = !!selectedChar;
                const anim = charCardAnims[index] || new Animated.Value(1);
                const roleInfo = selectedChar ? getRoleInfo(selectedChar.roleType) : null;
                
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
                        isSelected && roleInfo && { borderColor: roleInfo.color, backgroundColor: roleInfo.color + '20' },
                      ]}
                      onPress={() => toggleCharacter(char)}
                      activeOpacity={0.85}
                    >
                      {isSelected && roleInfo && (
                        <View style={[styles.roleBadge, { backgroundColor: roleInfo.color }]}>
                          <Text style={styles.roleBadgeIcon}>{roleInfo.icon}</Text>
                        </View>
                      )}
                      <Text style={styles.characterEmoji}>
                        {CHARACTER_EMOJIS[index % CHARACTER_EMOJIS.length]}
                      </Text>
                      <Text style={styles.characterName} numberOfLines={1}>
                        {char.name}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {selectedCharacters.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎭 设置角色类型</Text>
            <Text style={styles.sectionHint}>主角只能1个，配角最多2个</Text>
            
            {selectedCharacters.map((char, index) => {
              const roleInfo = getRoleInfo(char.roleType);
              return (
                <View key={char.character_id} style={styles.roleSettingCard}>
                  <View style={styles.roleSettingHeader}>
                    <Text style={styles.roleSettingEmoji}>
                      {CHARACTER_EMOJIS[characters.findIndex(c => c.character_id === char.character_id) % CHARACTER_EMOJIS.length]}
                    </Text>
                    <Text style={styles.roleSettingName}>{char.name}</Text>
                    <View style={[styles.currentRoleBadge, { backgroundColor: roleInfo.color }]}>
                      <Text style={styles.currentRoleText}>{roleInfo.icon} {roleInfo.label}</Text>
                    </View>
                  </View>
                  <View style={styles.roleSelector}>
                    {ROLE_TYPES.map((role) => {
                      const isSelected = char.roleType === role.value;
                      const isDisabled = role.value === 'protagonist' && 
                        getRoleCount('protagonist') > 0 && 
                        char.roleType !== 'protagonist';
                      const isSupportingDisabled = role.value === 'supporting' && 
                        getRoleCount('supporting') >= 2 && 
                        char.roleType !== 'supporting';
                      
                      return (
                        <TouchableOpacity
                          key={role.value}
                          style={[
                            styles.roleOption,
                            isSelected && { backgroundColor: role.color, borderColor: role.color },
                            (isDisabled || isSupportingDisabled) && styles.roleOptionDisabled,
                          ]}
                          onPress={() => !isDisabled && !isSupportingDisabled && updateCharacterRole(char.character_id, role.value)}
                          disabled={isDisabled || isSupportingDisabled}
                        >
                          <Text style={[styles.roleOptionText, isSelected && styles.roleOptionTextSelected]}>
                            {role.icon}
                          </Text>
                          <Text style={[styles.roleOptionLabel, isSelected && styles.roleOptionTextSelected]}>
                            {role.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {plotOptions && (
          <>
            <CardSelector2D
              title="☀️ 选择天气"
              items={plotOptions.weather}
              selectedId={plotSelection.weather}
              onPress={(id) =>
                setPlotSelection({ ...plotSelection, weather: id })
              }
            />

            <CardSelector2D
              title="🗺️ 选择冒险类型"
              items={plotOptions.adventureType}
              selectedId={plotSelection.adventureType}
              onPress={(id) =>
                setPlotSelection({ ...plotSelection, adventureType: id })
              }
            />

            <CardSelector2D
              title="🌲 选择地形"
              items={plotOptions.terrain}
              selectedId={plotSelection.terrain}
              onPress={(id) =>
                setPlotSelection({ ...plotSelection, terrain: id })
              }
            />

            <CardSelector2D
              title="🪄 选择装备"
              items={plotOptions.equipment}
              selectedId={plotSelection.equipment}
              onPress={(id) =>
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
    marginBottom: 4,
  },
  sectionHint: {
    fontSize: 12,
    color: COLORS.textLight,
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
    position: 'relative',
  },
  characterCardSelected: {
    borderWidth: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  roleBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadgeIcon: {
    fontSize: 12,
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
  roleSettingCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleSettingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  roleSettingEmoji: {
    fontSize: 28,
    marginRight: 8,
  },
  roleSettingName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  currentRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentRoleText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  roleOptionDisabled: {
    opacity: 0.4,
  },
  roleOptionText: {
    fontSize: 18,
    marginBottom: 2,
  },
  roleOptionLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  roleOptionTextSelected: {
    color: COLORS.white,
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
