# 舞台风格实现设计文档

## 概述

本文档记录了故事导演台舞台预览风格的实现设计，包括像素艺术、玻璃拟态、转盘风格和横版过关四种新风格的实现方案。

## 实现方案

采用**渐进式实现**方案，从简单到复杂逐步实现：

1. **像素艺术风格** - 复古游戏感，实现相对简单
2. **玻璃拟态风格** - 现代UI趋势，视觉效果好
3. **转盘风格** - 需要手势交互，复杂度中等
4. **横版过关风格** - 需要视差滚动，复杂度最高

## 架构设计

### 组件结构

```
StoryDirectorDemo.tsx
├── StageStyleType (新增4种类型)
│   ├── 'pixel-art'           // 像素艺术风格
│   ├── 'glassmorphism'       // 玻璃拟态风格
│   ├── 'carousel-wheel'      // 转盘风格
│   └── 'side-scroller'       // 横版过关风格
├── renderStage() - 主渲染函数
│   ├── renderPixelArtStage()      - 像素艺术风格
│   ├── renderGlassmorphismStage() - 玻璃拟态风格
│   ├── renderCarouselWheel()      - 转盘风格
│   └── renderSideScroller()       - 横版过关风格
└── styles - 样式定义
```

### 状态管理

```typescript
type StageStyleType = 
  | '3d-perspective'      // 已实现
  | 'battle-arena'        // 已实现
  | 'immersive-scene'     // 已实现
  | 'pixel-art'           // 新增：像素艺术风格
  | 'glassmorphism'       // 新增：玻璃拟态风格
  | 'carousel-wheel'      // 新增：转盘风格
  | 'side-scroller';      // 新增：横版过关风格

const [stageStyle, setStageStyle] = useState<StageStyleType>('3d-perspective');
```

## 详细设计

### 1. 像素艺术风格 (Pixel Art)

#### 视觉效果

```
┌─────────────────────────────────────┐
│  👾 像素冒险                         │
├─────────────────────────────────────┤
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓│
│  ▓░░⚔️░░░░🔮░░░░🏹░░░░✨░░░░░░░░░▓│ <- 像素角色
│  ▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓│
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  ❤️❤️❤️♡♡  LV.5  EXP: 340/500     │
└─────────────────────────────────────┘
```

#### 技术实现

**像素化背景：**
```typescript
const pixelBackgroundStyle = {
  backgroundColor: '#87CEEB',  // 天空蓝
  borderWidth: 4,
  borderColor: '#000',
};
```

**像素化角色：**
```typescript
const pixelCharacterStyle = {
  fontSize: 40,
  textShadowColor: '#000',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 0,
};
```

**游戏UI元素：**
- 血条：使用红色像素心形 ❤️
- 等级：像素字体显示 LV.5
- 经验条：像素化进度条

#### 动画效果

1. **角色入场：** 像素闪烁出现
   ```typescript
   Animated.sequence([
     Animated.timing(opacity, { toValue: 0, duration: 100 }),
     Animated.timing(opacity, { toValue: 1, duration: 100 }),
     Animated.timing(opacity, { toValue: 0, duration: 100 }),
     Animated.timing(opacity, { toValue: 1, duration: 100 }),
   ])
   ```

2. **选中效果：** 像素闪烁 + 轻微震动
   ```typescript
   Animated.loop(
     Animated.sequence([
       Animated.timing(shake, { toValue: 1, duration: 50 }),
       Animated.timing(shake, { toValue: -1, duration: 50 }),
       Animated.timing(shake, { toValue: 0, duration: 50 }),
     ])
   )
   ```

3. **背景动画：** 像素云朵缓慢移动
   ```typescript
   Animated.loop(
     Animated.timing(cloudX, {
       toValue: -width,
       duration: 10000,
       useNativeDriver: true,
     })
   )
   ```

---

### 2. 玻璃拟态风格 (Glassmorphism)

#### 视觉效果

```
┌─────────────────────────────────────┐
│  💎 玻璃世界                         │
├─────────────────────────────────────┤
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  <- 模糊背景
│  ┌─────────────────────────────┐   │
│  │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │   │  <- 玻璃卡片
│  │ ▒  ⚔️    🔮    🏹    ✨   ▒ │   │  <- 角色在玻璃上
│  │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │   │
│  └─────────────────────────────┘   │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │ 天气 ☀️ │  │ 地形 🌲 │        │  <- 玻璃按钮
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

#### 技术实现

**玻璃效果：**
```typescript
const glassStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  shadowColor: 'rgba(255, 255, 255, 0.2)',
  shadowOpacity: 0.3,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 10 },
};
```

**渐变背景：**
```typescript
// 使用多层View模拟渐变
<View style={{ backgroundColor: '#667eea', flex: 1 }}>
  <View style={{ backgroundColor: '#764ba2', opacity: 0.5, flex: 1 }} />
</View>
```

#### 动画效果

1. **选中效果：** 玻璃卡片发光 + 轻微放大
   ```typescript
   Animated.parallel([
     Animated.spring(scale, { toValue: 1.1, tension: 100, friction: 3 }),
     Animated.timing(glow, { toValue: 1, duration: 300 }),
   ])
   ```

2. **入场动画：** 从透明渐显 + 上浮
   ```typescript
   Animated.parallel([
     Animated.timing(opacity, { toValue: 1, duration: 500 }),
     Animated.spring(translateY, { toValue: 0, tension: 50, friction: 5 }),
   ])
   ```

3. **切换动画：** 平滑的透明度过渡
   ```typescript
   Animated.timing(opacity, {
     toValue: 0,
     duration: 200,
     useNativeDriver: true,
   })
   ```

---

### 3. 转盘风格 (Carousel Wheel)

#### 视觉效果

```
┌─────────────────────────────────────┐
│  🎡 转盘选择                         │
├─────────────────────────────────────┤
│                                     │
│         ╭───────────────╮          │
│        ╱   ⚔️  🔮  🏹   ╲         │  <- 旋转转盘
│       │      ✨          │         │  <- 当前选中
│        ╲   地形 天气    ╱          │  <- 其他选项
│         ╰───────────────╯          │
│              ▼                      │  <- 选中指示器
│         [当前: 战士]                │
│                                     │
│  ◄ 滑动转盘选择 ►                   │
└─────────────────────────────────────┘
```

#### 技术实现

**转盘容器：**
```typescript
const wheelContainerStyle = {
  transform: [
    { perspective: 800 },
    { rotateX: '15deg' },
    { rotate: `${rotation}deg` }
  ]
};
```

**卡片位置计算：**
```typescript
const calculateCardPosition = (index: number, total: number, radius: number) => {
  const angle = (index / total) * 360;
  const x = Math.cos(angle * Math.PI / 180) * radius;
  const y = Math.sin(angle * Math.PI / 180) * radius;
  return { x, y };
};
```

**手势交互：**
```typescript
const panResponder = PanResponder.create({
  onMove: (evt, gestureState) => {
    const newRotation = rotation + gestureState.dx * 0.5;
    setRotation(newRotation);
  },
  onRelease: () => {
    // 吸附到最近的卡片
    const nearestIndex = Math.round(rotation / (360 / total));
    Animated.spring(rotation, {
      toValue: nearestIndex * (360 / total),
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  },
});
```

#### 动画效果

1. **旋转动画：** 弹性旋转
   ```typescript
   Animated.spring(rotation, {
     toValue: targetRotation,
     tension: 50,
     friction: 8,
     useNativeDriver: true,
   })
   ```

2. **选中效果：** 卡片放大 + 发光
   ```typescript
   Animated.parallel([
     Animated.spring(scale, { toValue: 1.3, tension: 100, friction: 3 }),
     Animated.timing(glow, { toValue: 1, duration: 200 }),
   ])
   ```

3. **入场动画：** 转盘从中心放大出现
   ```typescript
   Animated.spring(scale, {
     toValue: 1,
     tension: 50,
     friction: 5,
     useNativeDriver: true,
   })
   ```

---

### 4. 横版过关风格 (Side-Scroller)

#### 视觉效果

```
┌─────────────────────────────────────┐
│  🎮 横版冒险                         │
├─────────────────────────────────────┤
│  ☁️ ☁️      ☁️ ☁️                   │  <- 云朵背景
│                                     │
│  ⚔️ ──→  🔮 ──→  🏹 ──→  ✨        │  <- 角色横向排列
│  ═════════════════════════════════  │  <- 地面平台
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  <- 地面砖块
│                                     │
│  [◀] [▶] 滑动选择角色               │
│  ❤️❤️❤️♡♡  金币: 120  ⭐ 3         │
└─────────────────────────────────────┘
```

#### 技术实现

**视差背景：**
```typescript
// 云朵层 - 慢速
const cloudTranslateX = scrollX.interpolate({
  inputRange: [0, width],
  outputRange: [0, -width * 0.3],
});

// 山脉层 - 中速
const mountainTranslateX = scrollX.interpolate({
  inputRange: [0, width],
  outputRange: [0, -width * 0.5],
});

// 地面层 - 快速
const groundTranslateX = scrollX.interpolate({
  inputRange: [0, width],
  outputRange: [0, -width * 0.8],
});
```

**横向滚动：**
```typescript
<ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  )}
>
  {/* 角色卡片 */}
</ScrollView>
```

#### 动画效果

1. **角色行走：** 轻微上下浮动
   ```typescript
   Animated.loop(
     Animated.sequence([
       Animated.timing(translateY, { toValue: -5, duration: 500 }),
       Animated.timing(translateY, { toValue: 0, duration: 500 }),
     ])
   )
   ```

2. **跳跃选中：** 弹跳动画
   ```typescript
   Animated.sequence([
     Animated.parallel([
       Animated.spring(translateY, { toValue: -30, tension: 100, friction: 5 }),
       Animated.spring(scaleY, { toValue: 1.2, tension: 100, friction: 5 }),
     ]),
     Animated.parallel([
       Animated.spring(translateY, { toValue: 0, tension: 100, friction: 5 }),
       Animated.spring(scaleY, { toValue: 1, tension: 100, friction: 5 }),
     ]),
   ])
   ```

3. **云朵飘动：** 持续缓慢移动
   ```typescript
   Animated.loop(
     Animated.timing(cloudX, {
       toValue: -width,
       duration: 15000,
       useNativeDriver: true,
     })
   )
   ```

---

## 关键技术要点

### 1. 使用 `transform` 而非 `left/top`

根据文档经验，`useNativeDriver: true` 只支持 `opacity` 和 `transform` 属性。

```typescript
// ✅ 正确写法
<Animated.View 
  style={{
    transform: [
      { translateX: anim.x },
      { translateY: anim.y },
    ],
  }}
>

// ❌ 错误写法
<Animated.View 
  style={{
    left: anim.x,
    top: anim.y,
  }}
>
```

### 2. 动画循环必须能重置

所有循环动画必须在循环结束时重置到初始状态。

```typescript
// ✅ 正确写法
Animated.loop(
  Animated.sequence([
    Animated.timing(anim, { toValue: 1, duration: 1000 }),
    Animated.timing(anim, { toValue: 0, duration: 1000 }),  // 重置
  ])
).start();

// ❌ 错误写法
Animated.loop(
  Animated.timing(anim, {
    toValue: 1,
    duration: 1000,
    // 缺少重置，第二次循环时值已经是1
  })
).start();
```

### 3. 使用 `Animated.sequence` 管理复杂动画

```typescript
Animated.sequence([
  Animated.parallel([
    Animated.timing(anim1, { ... }),
    Animated.timing(anim2, { ... }),
  ]),
  Animated.parallel([
    Animated.timing(anim1, { ... }),
    Animated.timing(anim2, { ... }),
  ]),
]).start();
```

---

## TDD 实现计划

### 测试驱动开发流程

**重要：所有代码文件都必须严格遵循TDD流程，包括UI的screen文件。**

#### 阶段1：像素艺术风格

1. **编写测试用例**
   - 测试像素化背景渲染
   - 测试像素化角色显示
   - 测试游戏UI元素（血条、等级、经验条）
   - 测试动画效果（入场、选中、背景）

2. **实现功能代码**
   - 实现 `renderPixelArtStage()` 函数
   - 添加像素化样式
   - 添加动画效果

3. **运行测试验证**
   - 运行单元测试
   - 运行Appium端到端测试
   - 检查崩溃日志

#### 阶段2：玻璃拟态风格

1. **编写测试用例**
   - 测试玻璃效果渲染
   - 测试渐变背景
   - 测试动画效果（选中、入场、切换）

2. **实现功能代码**
   - 实现 `renderGlassmorphismStage()` 函数
   - 添加玻璃样式
   - 添加动画效果

3. **运行测试验证**
   - 运行单元测试
   - 运行Appium端到端测试
   - 检查崩溃日志

#### 阶段3：转盘风格

1. **编写测试用例**
   - 测试转盘布局
   - 测试卡片位置计算
   - 测试手势交互
   - 测试动画效果（旋转、选中、入场）

2. **实现功能代码**
   - 实现 `renderCarouselWheel()` 函数
   - 添加转盘样式
   - 添加手势交互
   - 添加动画效果

3. **运行测试验证**
   - 运行单元测试
   - 运行Appium端到端测试
   - 检查崩溃日志

#### 阶段4：横版过关风格

1. **编写测试用例**
   - 测试视差背景
   - 测试横向滚动
   - 测试动画效果（行走、跳跃、云朵）

2. **实现功能代码**
   - 实现 `renderSideScroller()` 函数
   - 添加视差背景
   - 添加横向滚动
   - 添加动画效果

3. **运行测试验证**
   - 运行单元测试
   - 运行Appium端到端测试
   - 检查崩溃日志

---

## Appium 测试用例

### 测试脚本：`appium-stage-style-extended-test.js`

```javascript
/**
 * 舞台风格扩展测试
 * 测试像素艺术、玻璃拟态、转盘风格、横版过关四种新风格
 */

const { remote } = require('webdriverio');
const { execSync } = require('child_process');

// 测试配置
const capabilities = {
  platformName: 'Android',
  'appium:deviceName': 'emulator-5554',
  'appium:automationName': 'UiAutomator2',
  'appium:appPackage': 'com.legostory.demo',
  'appium:appActivity': '.MainActivity',
  'appium:noReset': true,
  'appium:newCommandTimeout': 600,
  'appium:autoGrantPermissions': true,
  'appium:waitForIdleTimeout': 100,
  'appium:waitForQuiescence': false,
};

// 辅助函数
async function findAndTap(driver, selector, timeout = 2000) {
  try {
    const element = await driver.$(selector);
    await element.waitForDisplayed({ timeout });
    const location = await element.getLocation();
    const size = await element.getSize();
    const centerX = location.x + size.width / 2;
    const centerY = location.y + size.height / 2;
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 50 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
    return true;
  } catch (e) {
    return false;
  }
}

async function checkForErrors() {
  try {
    const result = execSync(
      'adb -s emulator-5554 logcat -d | findstr /i "ReactNativeJS Error FATAL"',
      { encoding: 'utf8', timeout: 5000 }
    );
    if (result && result.trim()) {
      console.log('🚨 检测到应用错误!');
      console.log(result);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// 主测试函数
async function runTest() {
  const startTime = Date.now();
  let driver;
  let hasErrors = false;

  try {
    console.log('⏳ 连接Appium服务器...');
    driver = await remote({
      capabilities,
      logLevel: 'error',
      hostname: '127.0.0.1',
      port: 4723,
      path: '/',
      waitforTimeout: 2000,
    });
    console.log('✅ 已连接\n');

    await driver.pause(1500);

    // 测试1：导航到导演台
    console.log('⏳ [1/9] 导航到导演台...');
    if (await findAndTap(driver, '//*[@text="导演台"]')) {
      await driver.pause(300);
      console.log('✅ 已进入导演台\n');
    }

    // 测试2：选择角色
    console.log('⏳ [2/9] 选择角色...');
    if (await findAndTap(driver, '//*[@text="勇士"]')) {
      await driver.pause(50);
      console.log('✅ 已选择角色: 勇士\n');
    }

    // 测试3：选择冒险类型
    console.log('⏳ [3/9] 选择冒险类型...');
    if (await findAndTap(driver, '//*[@text="战斗"]')) {
      await driver.pause(50);
      console.log('✅ 已选择冒险类型: 战斗\n');
    }

    // 测试4：测试像素艺术风格
    console.log('⏳ [4/9] 测试像素艺术风格...');
    if (await findAndTap(driver, '//*[@text="🎭"]', 1500)) {
      await driver.pause(400);
      if (await findAndTap(driver, '//*[contains(@text, "像素艺术")]', 1500)) {
        await driver.pause(200);
        console.log('✅ 已切换到像素艺术风格\n');
      }
    }

    // 测试5：测试玻璃拟态风格
    console.log('⏳ [5/9] 测试玻璃拟态风格...');
    if (await findAndTap(driver, '//*[@text="🎭"]', 1500)) {
      await driver.pause(400);
      if (await findAndTap(driver, '//*[contains(@text, "玻璃拟态")]', 1500)) {
        await driver.pause(200);
        console.log('✅ 已切换到玻璃拟态风格\n');
      }
    }

    // 测试6：测试转盘风格
    console.log('⏳ [6/9] 测试转盘风格...');
    if (await findAndTap(driver, '//*[@text="🎭"]', 1500)) {
      await driver.pause(400);
      if (await findAndTap(driver, '//*[contains(@text, "转盘")]', 1500)) {
        await driver.pause(200);
        console.log('✅ 已切换到转盘风格\n');
      }
    }

    // 测试7：测试横版过关风格
    console.log('⏳ [7/9] 测试横版过关风格...');
    if (await findAndTap(driver, '//*[@text="🎭"]', 1500)) {
      await driver.pause(400);
      if (await findAndTap(driver, '//*[contains(@text, "横版过关")]', 1500)) {
        await driver.pause(200);
        console.log('✅ 已切换到横版过关风格\n');
      }
    }

    // 测试8：选择天气和地形
    console.log('⏳ [8/9] 选择天气和地形...');
    if (await findAndTap(driver, '//*[@text="☀️"]')) {
      await driver.pause(50);
      console.log('✅ 已选择天气: 晴天\n');
    }
    if (await findAndTap(driver, '//*[@text="🌲"]')) {
      await driver.pause(50);
      console.log('✅ 已选择地形: 森林\n');
    }

    // 测试9：返回主页
    console.log('⏳ [9/9] 返回主页...');
    if (await findAndTap(driver, '//*[@text="← 返回"]')) {
      await driver.pause(300);
      console.log('✅ 已返回主页\n');
    }

    // 检查错误
    console.log('🔍 检查应用是否有错误...');
    hasErrors = await checkForErrors();
    if (!hasErrors) {
      console.log('✅ 应用运行正常\n');
    }

  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    hasErrors = await checkForErrors();
  } finally {
    if (driver) {
      await driver.deleteSession();
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⏱️ 总耗时: ${totalTime}秒`);

    if (hasErrors) {
      console.log('❌ 测试失败 - 检测到应用错误');
      process.exit(1);
    } else {
      console.log('✅ 所有测试通过');
      process.exit(0);
    }
  }
}

runTest();
```

---

## 风险与缓解措施

### 风险1：动画性能问题

**风险描述：** 复杂动画可能导致性能下降或卡顿。

**缓解措施：**
- 使用 `useNativeDriver: true` 提升性能
- 限制粒子数量（不超过20个）
- 避免同时运行过多循环动画

### 风险2：手势交互冲突

**风险描述：** 转盘风格的手势可能与ScrollView冲突。

**缓解措施：**
- 使用 `PanResponder` 拦截手势
- 设置合适的手势优先级
- 测试手势交互的流畅性

### 风险3：视差滚动性能

**风险描述：** 横版过关风格的多层视差可能影响性能。

**缓解措施：**
- 使用 `onScroll` 的 `useNativeDriver: true`
- 限制背景层数（不超过3层）
- 使用 `scrollEventThrottle={16}` 优化滚动性能

---

## 验收标准

### 功能验收

- [ ] 像素艺术风格正确渲染
- [ ] 玻璃拟态风格正确渲染
- [ ] 转盘风格正确渲染并支持手势交互
- [ ] 横版过关风格正确渲染并支持横向滚动
- [ ] 四种风格可以正常切换
- [ ] 角色在不同风格中正确显示
- [ ] 天气和地形变化影响背景显示

### 性能验收

- [ ] 应用启动时间 < 2秒
- [ ] 风格切换时间 < 500ms
- [ ] 动画帧率 > 30fps
- [ ] 内存占用 < 200MB

### 测试验收

- [ ] 所有单元测试通过
- [ ] Appium端到端测试通过
- [ ] 无崩溃日志
- [ ] 无React Native错误日志

---

## 文档更新计划

### 开发过程中

- 记录每个阶段遇到的问题和解决方案
- 更新经验反思文档
- 记录性能优化措施

### 开发完成后

- 更新舞台预览风格实验方案文档的实现状态
- 更新Appium测试文档
- 编写用户使用指南

---

*文档创建时间：2026-03-05*
*创建目的：记录舞台风格实现的详细设计，指导TDD开发流程*
