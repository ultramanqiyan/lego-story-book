# 故事导演页UI风格设计方案

## 概述

为故事导演台设计4种明显不同的UI风格，每种风格都突出其核心特色元素，让人一眼就能看出是什么风格。所有风格都包含相同的交互元素：角色、冒险类型、天气、地形、装备。

## 设计目标

- ✅ 提升视觉冲击力
- ✅ 每种风格都突出其核心特色元素
- ✅ 不使用卡片形式，而是结合风格本身进行设计
- ✅ 所有交互元素整合到一个页面里

---

## 风格1：横版游戏风格

### 核心特色元素

- 🎮 **游戏手柄图标** - 左上角显示游戏手柄
- 📊 **分数和生命值** - 顶部显示分数、生命、金币
- 🏃 **横向滚动** - 角色在平台上横向排列
- 🧱 **砖块平台** - 底部有砖块平台
- 💰 **金币动画** - 选择时有金币飞出动画

### 页面布局

```
┌─────────────────────────────────────┐
│ 🎮 SCORE: 9999  ❤️❤️❤️  💰120      │  <- 游戏UI
├─────────────────────────────────────┤
│                                     │
│  ☁️ ☁️ ☁️                           │  <- 云朵背景
│                                     │
│      ⚔️      🔮      🏹             │  <- 角色在平台上
│     ══════════════════════════      │  <- 砖块平台
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  <- 分割线
│                                     │
│ 🎯 关卡选择                          │
│ [⚔️ BOSS战] [🔍 探索] [💎 寻宝]     │  <- 关卡按钮
│                                     │
│ 🌤️ 天气效果                          │
│ [☀️ 晴天] [🌧️ 雨天] [❄️ 雪天]      │  <- 天气按钮
│                                     │
│ 🗺️ 地图选择                          │
│ [🌲 森林] [⛰️ 山地] [🏖️ 沙滩]      │  <- 地图按钮
│                                     │
│ 🎁 道具栏                            │
│ [🗡️] [🛡️] [💍] [📜]               │  <- 道具格子
│                                     │
│ [▶️ START GAME]                     │  <- 开始按钮
└─────────────────────────────────────┘
```

### 技术实现

#### 1. 游戏UI（顶部）

```typescript
<View style={styles.gameUI}>
  <Text style={styles.scoreText}>🎮 SCORE: 9999</Text>
  <Text style={styles.lifeText}>❤️❤️❤️</Text>
  <Text style={styles.coinText}>💰120</Text>
</View>
```

#### 2. 云朵背景

```typescript
<View style={styles.cloudContainer}>
  <Text style={styles.cloud}>☁️</Text>
  <Text style={[styles.cloud, { left: 100 }]}>☁️</Text>
  <Text style={[styles.cloud, { left: 200 }]}>☁️</Text>
</View>
```

#### 3. 砖块平台

```typescript
<View style={styles.platform}>
  {Array(20).fill(null).map((_, index) => (
    <View key={index} style={styles.brick} />
  ))}
</View>
```

#### 4. 关卡按钮

```typescript
<TouchableOpacity style={styles.levelButton}>
  <Text style={styles.levelText}>⚔️ BOSS战</Text>
</TouchableOpacity>
```

### 动画效果

- **角色跳跃**：选择角色时，角色向上跳跃
- **金币飞出**：选择道具时，金币从按钮飞出
- **云朵移动**：云朵缓慢从左向右移动

### 视觉冲击力

⭐⭐⭐⭐⭐ (5/5) - 一眼就能看出是横版游戏

---

## 风格2：像素风格（像我的世界）

### 核心特色元素

- 🧱 **方块网格** - 所有元素都是方块
- 🎨 **像素化配色** - 使用我的世界的配色方案
- ⛏️ **工具图标** - 使用镐子、剑等工具图标
- 📦 **物品栏格子** - 像我的世界物品栏一样的格子
- 🌍 **方块世界** - 背景是方块构成的世界

### 页面布局

```
┌─────────────────────────────────────┐
│ ⛏️ MINECRAFT MODE  ❤️❤️❤️  🍖🍖🍖  │  <- 像素UI
├─────────────────────────────────────┤
│                                     │
│  ┌─┬─┬─┬─┬─┬─┬─┬─┐               │
│  │🟫│🟫│🟫│🟫│🟫│🟫│🟫│🟫│               │  <- 方块背景
│  ├─┼─┼─┼─┼─┼─┼─┼─┤               │
│  │🟫│⚔️│🟫│🔮│🟫│🏹│🟫│               │  <- 方块中的角色
│  ├─┼─┼─┼─┼─┼─┼─┼─┤               │
│  │🟫│🟫│🟫│🟫│🟫│🟫│🟫│🟫│               │
│  └─┴─┴─┴─┴─┴─┴─┴─┘               │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  <- 分割线
│                                     │
│ ⚔️ 游戏模式                          │
│ [⚔️ 生存] [🔍 冒险] [💎 创造]       │  <- 模式按钮
│                                     │
│ 🌤️ 世界类型                          │
│ [☀️ 普通] [🌧️ 雨林] [❄️ 雪原]      │  <- 世界按钮
│                                     │
│ 🗺️ 生物群系                          │
│ [🌲 森林] [⛰️ 山地] [🏖️ 沙滩]      │  <- 群系按钮
│                                     │
│ 📦 物品栏                            │
│ ┌─┬─┬─┬─┐                         │
│ │🗡️│🛡️│💍│📜│                         │  <- 物品格子
│ └─┴─┴─┴─┘                         │
│                                     │
│ [▶️ 开始游戏]                       │  <- 开始按钮
└─────────────────────────────────────┘
```

### 技术实现

#### 1. 方块网格背景

```typescript
<View style={styles.blockGrid}>
  {Array(3).fill(null).map((_, row) => (
    <View key={row} style={styles.blockRow}>
      {Array(8).fill(null).map((_, col) => (
        <View key={col} style={styles.block} />
      ))}
    </View>
  ))}
</View>
```

#### 2. 像素UI（顶部）

```typescript
<View style={styles.pixelUI}>
  <Text style={styles.pixelText}>⛏️ MINECRAFT MODE</Text>
  <Text style={styles.pixelText}>❤️❤️❤️</Text>
  <Text style={styles.pixelText}>🍖🍖🍖</Text>
</View>
```

#### 3. 物品栏格子

```typescript
<View style={styles.inventory}>
  {items.map((item, index) => (
    <View key={index} style={styles.inventorySlot}>
      <Text style={styles.itemText}>{item.emoji}</Text>
    </View>
  ))}
</View>
```

#### 4. 像素风格按钮

```typescript
<TouchableOpacity style={styles.pixelButton}>
  <Text style={styles.pixelButtonText}>⚔️ 生存</Text>
</TouchableOpacity>
```

### 动画效果

- **方块破碎**：选择方块时，方块破碎动画
- **物品掉落**：选择物品时，物品掉落动画
- **像素闪烁**：背景方块随机闪烁

### 视觉冲击力

⭐⭐⭐⭐⭐ (5/5) - 一眼就能看出是像素方块风格

---

## 风格3：电影风格

### 核心特色元素

- 🎬 **场记板** - 左上角显示场记板
- 🎥 **摄像机图标** - 显示摄像机
- 🎞️ **胶片边框** - 页面有胶片边框
- 🎭 **导演椅** - 角色坐在导演椅上
- 📽️ **放映机** - 底部有放映机图标

### 页面布局

```
┌─────────────────────────────────────┐
│ 🎬 SCENE 01  🎥 TAKE 1  📽️         │  <- 电影UI
├─────────────────────────────────────┤
│                                     │
│  🎞️ ━━━━━━━━━━━━━━━━━━━━━ 🎞️      │  <- 胶片边框
│  │                                 │
│  │      ⚔️    🔮    🏹            │  <- 角色在场景中
│  │                                 │
│  🎞️ ━━━━━━━━━━━━━━━━━━━━━ 🎞️      │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  <- 分割线
│                                     │
│ 🎬 场景类型                          │
│ [⚔️ 动作片] [🔍 悬疑片] [💎 冒险片] │  <- 场景按钮
│                                     │
│ 🌤️ 拍摄天气                          │
│ [☀️ 晴天] [🌧️ 雨天] [❄️ 雪天]      │  <- 天气按钮
│                                     │
│ 🎬 拍摄地点                          │
│ [🌲 森林] [⛰️ 山地] [🏖️ 沙滩]      │  <- 地点按钮
│                                     │
│ 🎭 道具                              │
│ [🗡️] [🛡️] [💍] [📜]               │  <- 道具格子
│                                     │
│ [▶️ 开始拍摄]                       │  <- 开始按钮
└─────────────────────────────────────┘
```

### 技术实现

#### 1. 电影UI（顶部）

```typescript
<View style={styles.movieUI}>
  <Text style={styles.movieText}>🎬 SCENE 01</Text>
  <Text style={styles.movieText}>🎥 TAKE 1</Text>
  <Text style={styles.movieText}>📽️</Text>
</View>
```

#### 2. 胶片边框

```typescript
<View style={styles.filmBorder}>
  <View style={styles.filmLeft}>🎞️</View>
  <View style={styles.filmContent}>
    {/* 场景内容 */}
  </View>
  <View style={styles.filmRight}>🎞️</View>
</View>
```

#### 3. 场景按钮

```typescript
<TouchableOpacity style={styles.sceneButton}>
  <Text style={styles.sceneText}>⚔️ 动作片</Text>
</TouchableOpacity>
```

#### 4. 道具格子

```typescript
<View style={styles.propGrid}>
  {props.map((prop, index) => (
    <View key={index} style={styles.propSlot}>
      <Text style={styles.propText}>{prop.emoji}</Text>
    </View>
  ))}
</View>
```

### 动画效果

- **胶片滚动**：胶片边框缓慢滚动
- **镜头切换**：选择场景时，镜头切换效果
- **放映机转动**：底部放映机图标转动

### 视觉冲击力

⭐⭐⭐⭐⭐ (5/5) - 一眼就能看出是电影风格

---

## 风格4：手绘风格

### 核心特色元素

- 🖌️ **画笔图标** - 左上角显示画笔
- 🎨 **调色板** - 显示调色板
- 📝 **画布边框** - 页面有画布边框
- ✏️ **铅笔装饰** - 有铅笔装饰元素
- 🖼️ **画框** - 角色在画框中

### 页面布局

```
┌─────────────────────────────────────┐
│ 🖌️ 手绘工作室  🎨 调色板  ✏️        │  <- 手绘UI
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🖼️                          │   │  <- 画框
│  │                             │   │
│  │  ⚔️  ────  🔮  ────  🏹     │   │  <- 手绘角色
│  │   ╲    ╱     ╲    ╱         │   │  <- 手绘线条
│  │    ╲  ╱       ╲  ╱          │   │
│  │     ╲╱         ╲╱           │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  <- 分割线
│                                     │
│ 📝 故事类型                          │
│ [⚔️ 冒险] [🔍 探索] [💎 寻宝]       │  <- 故事按钮
│                                     │
│ 🌤️ 天气氛围                          │
│ [☀️ 晴天] [🌧️ 雨天] [❄️ 雪天]      │  <- 天气按钮
│                                     │
│ 🎨 场景背景                          │
│ [🌲 森林] [⛰️ 山地] [🏖️ 沙滩]      │  <- 场景按钮
│                                     │
│ ✏️ 绘画工具                          │
│ [🗡️] [🛡️] [💍] [📜]               │  <- 工具格子
│                                     │
│ [▶️ 开始创作]                       │  <- 开始按钮
└─────────────────────────────────────┘
```

### 技术实现

#### 1. 手绘UI（顶部）

```typescript
<View style={styles.handDrawnUI}>
  <Text style={styles.handDrawnText}>🖌️ 手绘工作室</Text>
  <Text style={styles.handDrawnText}>🎨 调色板</Text>
  <Text style={styles.handDrawnText}>✏️</Text>
</View>
```

#### 2. 画框

```typescript
<View style={styles.canvasFrame}>
  <View style={styles.frameBorder}>
    <Text style={styles.frameIcon}>🖼️</Text>
    {/* 画布内容 */}
  </View>
</View>
```

#### 3. 手绘线条

```typescript
<View style={styles.handDrawnLines}>
  <View style={styles.line1} />
  <View style={styles.line2} />
  <View style={styles.line3} />
</View>
```

#### 4. 故事按钮

```typescript
<TouchableOpacity style={styles.storyButton}>
  <Text style={styles.storyText}>⚔️ 冒险</Text>
</TouchableOpacity>
```

### 动画效果

- **画笔绘制**：选择元素时，画笔绘制动画
- **水彩晕染**：背景水彩颜色缓慢晕染
- **铅笔素描**：角色周围有铅笔素描动画

### 视觉冲击力

⭐⭐⭐⭐ (4/5) - 一眼就能看出是手绘风格

---

## 技术实现总结

### 共同组件

1. **顶部UI组件** - 每种风格都有独特的顶部UI
2. **场景区域** - 角色展示区域
3. **选择按钮** - 冒险类型、天气、地形、装备选择
4. **开始按钮** - 主操作按钮

### 样式定义

```typescript
const styles = StyleSheet.create({
  // 横版游戏风格
  gameUI: { flexDirection: 'row', justifyContent: 'space-between' },
  platform: { flexDirection: 'row', backgroundColor: '#8B4513' },
  brick: { width: 32, height: 20, backgroundColor: '#A0522D' },
  
  // 像素风格
  blockGrid: { flexDirection: 'column' },
  block: { width: 32, height: 32, backgroundColor: '#8B7355' },
  inventorySlot: { width: 40, height: 40, borderWidth: 2 },
  
  // 电影风格
  filmBorder: { flexDirection: 'row', backgroundColor: '#000' },
  sceneButton: { backgroundColor: '#2C3E50' },
  
  // 手绘风格
  canvasFrame: { borderWidth: 4, borderColor: '#8B4513' },
  handDrawnLines: { position: 'absolute' },
});
```

### 动画实现

```typescript
// 横版游戏风格 - 角色跳跃
const jumpAnim = useRef(new Animated.Value(0)).current;

Animated.sequence([
  Animated.timing(jumpAnim, { toValue: -30, duration: 200 }),
  Animated.timing(jumpAnim, { toValue: 0, duration: 200 }),
]).start();

// 像素风格 - 方块破碎
const breakAnim = useRef(new Animated.Value(1)).current;

Animated.sequence([
  Animated.timing(breakAnim, { toValue: 0, duration: 300 }),
]).start();

// 电影风格 - 胶片滚动
const filmAnim = useRef(new Animated.Value(0)).current;

Animated.loop(
  Animated.timing(filmAnim, { toValue: 1, duration: 3000 })
).start();

// 手绘风格 - 画笔绘制
const drawAnim = useRef(new Animated.Value(0)).current;

Animated.timing(drawAnim, { toValue: 1, duration: 500 }).start();
```

---

## 实施计划

### 阶段1：基础架构（1天）

- 创建风格选择器
- 实现基础布局
- 添加样式定义

### 阶段2：横版游戏风格（1天）

- 实现游戏UI
- 实现砖块平台
- 添加云朵背景
- 实现金币动画

### 阶段3：像素风格（1天）

- 实现方块网格
- 实现物品栏
- 添加像素化配色
- 实现方块破碎动画

### 阶段4：电影风格（1天）

- 实现胶片边框
- 实现场记板UI
- 添加镜头切换效果
- 实现放映机动画

### 阶段5：手绘风格（1天）

- 实现画布边框
- 实现手绘线条
- 添加水彩背景
- 实现画笔绘制动画

### 阶段6：测试和优化（1天）

- 运行Appium测试
- 修复可能的问题
- 优化性能

---

## 预期效果

- ✅ 4种风格视觉冲击力强，一眼就能看出
- ✅ 所有交互元素整合到一个页面
- ✅ 不使用卡片形式，结合风格本身设计
- ✅ 动画效果丰富，交互性强
- ✅ 用户体验流畅

---

*创建时间：2026-03-05*
