# Mini Card Preview Stage Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Add a new `mini-card-preview` stage style to StoryDirectorDemo as the default stage style.

**Architecture:** Add a new render function `renderMiniCardPreview()` that displays mini cards (70x90) with top color bars, empty slots with dashed borders, and a story preview text at the bottom.

**Tech Stack:** React Native, TypeScript

---

## Task 1: Add Stage Style Type

**Files:**
- Modify: `src/screens/StoryDirectorDemo.tsx`

**Step 1: Add 'mini-card-preview' to StageStyleType**

Find the `StageStyleType` type definition and add the new type:

```typescript
type StageStyleType = 
  | 'mini-card-preview'  // Add this line first
  | '3d-perspective' 
  | 'battle-arena' 
  | 'immersive-scene'
  | 'pixel-art'
  | 'glassmorphism'
  | 'carousel-wheel'
  | 'side-scroller';
```

**Step 2: Add to STAGE_STYLE_NAMES**

```typescript
const STAGE_STYLE_NAMES: Record<StageStyleType, string> = {
  'mini-card-preview': '🎴 迷你卡牌预览',  // Add this line first
  '3d-perspective': '🎭 3D透视舞台',
  // ... rest unchanged
};
```

**Step 3: Change default stage style**

Find and change:
```typescript
const [stageStyle, setStageStyle] = useState<StageStyleType>('mini-card-preview');
```

---

## Task 2: Add Color Mapping Constants

**Files:**
- Modify: `src/screens/StoryDirectorDemo.tsx`

**Step 1: Add after DEFAULT_THEME definition**

```typescript
const ELEMENT_COLORS = {
  protagonist: '#FFD700',
  supporting: '#C0C0C0',
  antagonist: '#EF4444',
  terrain: '#22C55E',
  weather: '#3B82F6',
  adventure: '#8B5CF6',
  equipment: '#F59E0B',
};

const ROLE_LABELS: Record<string, string> = {
  protagonist: '主角',
  supporting: '配角',
  bystander: '路人',
  antagonist: '反派',
};
```

---

## Task 3: Implement renderMiniCard Function

**Files:**
- Modify: `src/screens/StoryDirectorDemo.tsx`

**Step 1: Add renderMiniCard function before render3DStage**

```typescript
const renderMiniCard = (
  emoji: string,
  name: string,
  type: keyof typeof ELEMENT_COLORS,
  onRemove?: () => void
) => {
  const color = ELEMENT_COLORS[type];
  
  return (
    <View style={[styles.miniCard, { borderColor: color }]}>
      <View style={[styles.miniCardTopBar, { backgroundColor: color }]} />
      <Text style={styles.miniCardEmoji}>{emoji}</Text>
      <Text style={styles.miniCardName} numberOfLines={1}>{name}</Text>
      {onRemove && (
        <TouchableOpacity style={styles.miniCardRemove} onPress={onRemove}>
          <Text style={styles.miniCardRemoveText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

---

## Task 4: Implement renderEmptySlot Function

**Files:**
- Modify: `src/screens/StoryDirectorDemo.tsx`

**Step 1: Add renderEmptySlot function after renderMiniCard**

```typescript
const renderEmptySlot = (
  icon: string,
  label: string,
  required: boolean = false
) => {
  return (
    <View style={[styles.emptySlot, required && styles.emptySlotRequired]}>
      <Text style={styles.emptySlotIcon}>{icon}</Text>
      <Text style={styles.emptySlotLabel}>{label}</Text>
      {required && <Text style={styles.emptySlotRequiredLabel}>必选</Text>}
    </View>
  );
};
```

---

## Task 5: Implement getPreviewText Function

**Files:**
- Modify: `src/screens/StoryDirectorDemo.tsx`

**Step 1: Add getPreviewText function**

```typescript
const getPreviewText = () => {
  const parts: string[] = [];
  
  const selectedCharData = characters.filter((c) =>
    selectedCharacters.includes(c.characterId)
  );
  
  const protagonist = selectedCharData.find(c => c.roleType === 'protagonist');
  const supporting = selectedCharData.filter(c => c.roleType === 'supporting');
  const antagonist = selectedCharData.find(c => c.roleType === 'antagonist');
  
  if (protagonist) {
    parts.push(protagonist.name);
  }
  
  if (supporting.length > 0) {
    parts.push('与' + supporting.map(c => c.name).join('、'));
  }
  
  if (antagonist) {
    parts.push('对抗' + antagonist.name);
  }
  
  const selectedTerrainData = terrains.find(t => t.elementId === selectedTerrain);
  if (selectedTerrainData) {
    parts.push('在' + selectedTerrainData.name);
  }
  
  const selectedWeatherData = weathers.find(w => w.elementId === selectedWeather);
  if (selectedWeatherData && selectedWeatherData.name !== '晴天') {
    parts.push(selectedWeatherData.name + '中');
  }
  
  const selectedAdventureData = adventures.find(a => a.elementId === selectedAdventure);
  if (selectedAdventureData) {
    parts.push('展开' + selectedAdventureData.name);
  }
  
  const selectedEquipmentData = equipments.find(e => e.elementId === selectedEquipment);
  if (selectedEquipmentData) {
    parts.push('手持' + selectedEquipmentData.name);
  }

  if (parts.length > 0) {
    return parts.join('，') + '...';
  }
  return '选择卡牌来构建你的故事...';
};
```

---

## Task 6: Implement renderMiniCardPreview Function

**Files:**
- Modify: `src/screens/StoryDirectorDemo.tsx`

**Step 1: Add renderMiniCardPreview function**

```typescript
const renderMiniCardPreview = () => {
  const selectedCharData = characters.filter((c) =>
    selectedCharacters.includes(c.characterId)
  );
  
  const protagonist = selectedCharData.find(c => c.roleType === 'protagonist');
  const supporting = selectedCharData.filter(c => c.roleType === 'supporting');
  const antagonist = selectedCharData.find(c => c.roleType === 'antagonist');
  
  const selectedTerrainData = terrains.find(t => t.elementId === selectedTerrain);
  const selectedWeatherData = weathers.find(w => w.elementId === selectedWeather);
  const selectedAdventureData = adventures.find(a => a.elementId === selectedAdventure);
  const selectedEquipmentData = equipments.find(e => e.elementId === selectedEquipment);

  return (
    <Animated.View style={[styles.miniPreviewContainer, { opacity: stageAnim, transform: [{ scale: stageAnim }] }]}>
      <View style={styles.miniPreviewHeader}>
        <Text style={styles.miniPreviewTitle}>🎭 舞台预览</Text>
      </View>
      
      <View style={styles.miniPreviewContent}>
        <View style={styles.miniPreviewRow}>
          <Text style={styles.miniPreviewRowTitle}>👥 角色</Text>
          <View style={styles.miniCardsRow}>
            {protagonist 
              ? renderMiniCard(protagonist.emoji, protagonist.name, 'protagonist', () => toggleCharacter(protagonist.characterId))
              : renderEmptySlot('👑', '主角', true)
            }
            {supporting[0] 
              ? renderMiniCard(supporting[0].emoji, supporting[0].name, 'supporting', () => toggleCharacter(supporting[0].characterId))
              : renderEmptySlot('🎭', '配角')
            }
            {supporting[1] 
              ? renderMiniCard(supporting[1].emoji, supporting[1].name, 'supporting', () => toggleCharacter(supporting[1].characterId))
              : renderEmptySlot('🎭', '配角')
            }
            {antagonist 
              ? renderMiniCard(antagonist.emoji, antagonist.name, 'antagonist', () => toggleCharacter(antagonist.characterId))
              : renderEmptySlot('👿', '反派', true)
            }
          </View>
        </View>
        
        <View style={styles.miniPreviewRow}>
          <Text style={styles.miniPreviewRowTitle}>🌍 场景</Text>
          <View style={styles.miniCardsRow}>
            {selectedTerrainData 
              ? renderMiniCard(selectedTerrainData.emoji, selectedTerrainData.name, 'terrain', () => setSelectedTerrain(null))
              : renderEmptySlot('🏔️', '地形', true)
            }
            {selectedWeatherData 
              ? renderMiniCard(selectedWeatherData.emoji, selectedWeatherData.name, 'weather')
              : renderEmptySlot('☀️', '天气')
            }
            {selectedAdventureData 
              ? renderMiniCard(selectedAdventureData.emoji, selectedAdventureData.name, 'adventure', () => setSelectedAdventure(null))
              : renderEmptySlot('🎯', '冒险')
            }
            {selectedEquipmentData 
              ? renderMiniCard(selectedEquipmentData.emoji, selectedEquipmentData.name, 'equipment', () => setSelectedEquipment(null))
              : renderEmptySlot('🎒', '装备')
            }
          </View>
        </View>
        
        <View style={styles.previewTextContainer}>
          <Text style={styles.previewText} numberOfLines={2}>
            {getPreviewText()}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
```

---

## Task 7: Update renderStage Function

**Files:**
- Modify: `src/screens/StoryDirectorDemo.tsx`

**Step 1: Add case for 'mini-card-preview'**

Find the `renderStage` function and add:

```typescript
const renderStage = () => {
  switch (stageStyle) {
    case 'mini-card-preview':
      return renderMiniCardPreview();
    case '3d-perspective':
      return render3DStage();
    // ... rest unchanged
  }
};
```

---

## Task 8: Add Styles

**Files:**
- Modify: `src/screens/StoryDirectorDemo.tsx`

**Step 1: Add new styles to StyleSheet.create**

```typescript
  miniPreviewContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  miniPreviewHeader: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  miniPreviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
  },
  miniPreviewContent: {
    padding: 10,
  },
  miniPreviewRow: {
    marginBottom: 10,
  },
  miniPreviewRowTitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  miniCardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  miniCard: {
    width: 70,
    height: 90,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 30, 50, 0.9)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  miniCardTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  miniCardEmoji: {
    fontSize: 24,
    marginTop: 8,
  },
  miniCardName: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  miniCardRemove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCardRemoveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: -1,
  },
  emptySlot: {
    width: 70,
    height: 90,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySlotRequired: {
    borderColor: 'rgba(255, 215, 0, 0.5)',
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  emptySlotIcon: {
    fontSize: 20,
    opacity: 0.5,
  },
  emptySlotLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  emptySlotRequiredLabel: {
    position: 'absolute',
    bottom: -12,
    fontSize: 8,
    color: '#ffd700',
  },
  previewTextContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  previewText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    lineHeight: 18,
  },
```

---

## Task 9: Build and Test

**Step 1: Clear cache and build**

```bash
cd c:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile\lego-demo
powershell -ExecutionPolicy Bypass -File build-apk.ps1
```

**Step 2: Install to emulator**

```bash
powershell -ExecutionPolicy Bypass -File install-apk.ps1
```

**Step 3: Run Appium E2E test**

```bash
node appium-director-test.js
```

---

## Task 10: Commit Changes

```bash
git add src/screens/StoryDirectorDemo.tsx docs/plans/2026-03-07-mini-card-preview-stage-design.md docs/plans/2026-03-07-mini-card-preview-stage-implementation.md
git commit -m "feat: 添加迷你卡牌预览舞台风格

- 新增 mini-card-preview 舞台风格作为默认
- 实现 70x90 迷你卡牌布局
- 添加顶部颜色条区分元素类型
- 实现空槽位显示（虚线边框 + 必选标识）
- 添加故事预览文本生成
- 支持点击移除已选卡牌"
```
