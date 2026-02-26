# 桌游风格Demo设计规范

## 概述

本文档定义了5个桌游风格的Demo设计，灵感来源于《三国杀》、《炉石传说》等卡牌桌游。设计将应用于乐高故事书移动端应用，包含丰富的动画效果和交互体验。

---

## 设计原则

### 核心设计理念
1. **卡牌为核心** - 所有元素以卡牌形式呈现
2. **扇形展开** - 卡牌选择采用扇形展开动画
3. **天气特效** - 动态天气背景增强沉浸感
4. **角色扮演** - 用户作为"导演"参与故事创作

### 色彩体系
```
主色调:
- 金色(Gold): #FFD700 - 主角、重要元素
- 紫色(Purple): #A855F7 - 冒险、魔法
- 红色(Crimson): #DC2626 - 反派、危险
- 银色(Silver): #C0C0C0 - 配角、普通
- 绿色(Green): #22C55E - 地形、自然
- 蓝色(Blue): #3B82F6 - 天气、水元素
- 橙色(Orange): #F59E0B - 道具、装备

背景色:
- 深黑: #0D0D14
- 中黑: #1A1A2E
- 浅黑: #252542
- 卡片: #2D2D44
```

### 动画时长标准
```
快速: 150-200ms (按钮反馈)
正常: 300-400ms (卡牌翻转)
慢速: 800-1000ms (扇形展开)
循环: 2000-3000ms (发光脉冲)
```

---

## Demo 1: 登录页面 - 冒险者入场

### 设计概念
用户作为冒险者进入故事世界，登录界面模拟卡牌选择仪式。

### 视觉设计

#### 背景层
```
1. 深色渐变背景 (180deg, #1A1A2E → #0D0D14)
2. 粒子效果层 - 金色粒子缓慢上升
3. 光晕效果 - 中心金色光晕脉冲
```

#### 主视觉元素
```
┌─────────────────────────────────────┐
│                                     │
│         ✨ 粒子背景动画 ✨           │
│                                     │
│    ┌─────────────────────────┐      │
│    │      🧱 乐高故事书       │      │
│    │    (金色闪烁标题)        │      │
│    └─────────────────────────┘      │
│                                     │
│    ┌─────┐  ┌─────┐  ┌─────┐       │
│    │ 🧙 │  │ 🦸 │  │ 🧝 │       │
│    │法师 │  │战士 │  │精灵 │       │
│    └─────┘  └─────┘  └─────┘       │
│         (扇形展开的角色卡)           │
│                                     │
│    ┌─────────────────────────┐      │
│    │    输入你的冒险者名字    │      │
│    └─────────────────────────┘      │
│                                     │
│    ┌─────────────────────────┐      │
│    │   🎮 开始冒险 (脉冲按钮)  │      │
│    └─────────────────────────┘      │
│                                     │
└─────────────────────────────────────┘
```

#### 动画效果

##### 1. 粒子上升动画
```javascript
// 粒子配置
const particleConfig = {
  count: 20,
  size: 2,
  color: '#FFD700',
  duration: '15-25s',
  animation: 'float-up',
  opacity: '0.2-0.4'
};

// CSS动画
@keyframes float-up {
  0% { 
    transform: translateY(100vh) scale(0.5); 
    opacity: 0; 
  }
  10% { opacity: 0.3; }
  90% { opacity: 0.3; }
  100% { 
    transform: translateY(-100vh) scale(1); 
    opacity: 0; 
  }
}
```

##### 2. 标题闪烁动画
```javascript
// 金色渐变闪烁
@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

// 配置
const shimmerConfig = {
  gradient: 'linear-gradient(135deg, #FFD700, #FF9800, #FFD700)',
  backgroundSize: '200% auto',
  duration: '3s',
  textShadow: '0 0 40px rgba(255,215,0,0.5)'
};
```

##### 3. 角色卡扇形展开
```javascript
// 扇形展开参数
const fanConfig = {
  cardCount: 3,
  cardWidth: 100,
  cardHeight: 140,
  fanAngle: 60,        // 总展开角度
  radius: 200,         // 展开半径
  animationDuration: 800,
  easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

// 每张卡的角度计算
const getCardAngle = (index, total) => {
  const startAngle = -fanAngle / 2;
  const step = fanAngle / (total - 1);
  return startAngle + step * index;
};

// 展开动画
@keyframes fan-expand {
  0% {
    transform: rotate(0deg) translateY(0) scale(0.8);
    opacity: 0;
  }
  100% {
    transform: rotate(${angle}deg) translateY(-20px) scale(1);
    opacity: 1;
  }
}
```

##### 4. 卡牌悬停效果
```javascript
// 悬停动画
const hoverConfig = {
  liftY: -30,          // 上移距离
  scale: 1.15,         // 放大比例
  shadowBlur: 30,      // 阴影模糊
  shadowColor: 'rgba(255,215,0,0.5)',
  duration: 300
};

// React Native实现
const handleHover = (cardRef) => {
  Animated.parallel([
    Animated.spring(cardRef.scale, {
      toValue: 1.15,
      friction: 5,
      useNativeDriver: true
    }),
    Animated.spring(cardRef.translateY, {
      toValue: -30,
      friction: 5,
      useNativeDriver: true
    })
  ]).start();
};
```

##### 5. 按钮脉冲动画
```javascript
// 脉冲配置
const pulseConfig = {
  shadowOpacity: [0.3, 0.8, 0.3],
  duration: 2000,
  infinite: true
};

// React Native实现
useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false
      }),
      Animated.timing(glowAnim, {
        toValue: 0.5,
        duration: 1000,
        useNativeDriver: false
      })
    ])
  ).start();
}, []);
```

### 交互流程
```
1. 页面加载
   - 粒子背景开始动画
   - 标题淡入 + 闪烁效果
   - 角色卡从中心展开(延迟200ms逐张)

2. 用户悬停角色卡
   - 卡牌上浮 + 放大
   - 边框发光
   - 显示角色描述tooltip

3. 点击角色卡
   - 卡牌选中动画(心跳效果)
   - 其他卡牌淡化

4. 输入名字
   - 输入框边框发光

5. 点击开始
   - 按钮缩放反馈
   - 全屏过渡动画
   - 进入主页
```

---

## Demo 2: 主页 - 故事世界大厅

### 设计概念
主页作为故事世界的中央大厅，展示各种故事入口卡牌。

### 视觉设计

#### 布局结构
```
┌─────────────────────────────────────┐
│  👤 你好，冒险者！                    │
│     今天想听什么故事？                │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐    │
│  │   🏰 欢迎来到乐高故事世界    │    │
│  │                             │    │
│  │   选择你的冒险...           │    │
│  │                             │    │
│  │   [🎮 开始冒险] (脉冲)      │    │
│  └─────────────────────────────┘    │
│                                     │
├─────────────────────────────────────┤
│  🔥 热门人仔                         │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐           │
│  │🧙│ │🦸│ │🧝│ │🤴│  (扇形)      │
│  │法师│ │战士│ │精灵│ │王子│           │
│  └───┘ └───┘ └───┘ └───┘           │
├─────────────────────────────────────┤
│  📚 最近故事                         │
│  ┌─────────┐ ┌─────────┐           │
│  │📖       │ │📖       │           │
│  │龙之传说 │ │魔法森林 │           │
│  │3章 ⭐4.5│ │5章 ⭐4.8│           │
│  └─────────┘ └─────────┘           │
│                                     │
└─────────────────────────────────────┘
```

#### 动画效果

##### 1. 人仔卡牌扇形展示
```javascript
// 扇形配置
const characterFanConfig = {
  cardWidth: 120,
  cardHeight: 160,
  fanAngle: 45,
  overlap: 0.6,        // 卡牌重叠比例
  perspective: 1000,
  animation: {
    type: 'stagger',   // 交错动画
    delay: 100,        // 每张卡延迟
    duration: 600
  }
};

// 3D变换
const getCardTransform = (index, total, isHovered) => {
  const centerIndex = (total - 1) / 2;
  const offset = index - centerIndex;
  
  return {
    rotateY: `${offset * 15}deg`,
    rotateZ: `${offset * 5}deg`,
    translateX: offset * 30,
    translateZ: isHovered ? 50 : 0,
    scale: isHovered ? 1.2 : 1
  };
};
```

##### 2. 故事卡牌翻转效果
```javascript
// 翻转配置
const flipConfig = {
  duration: 600,
  perspective: 1000,
  flipDirection: 'horizontal'
};

// 正面 → 背面动画
const flipCard = (cardRef) => {
  Animated.sequence([
    Animated.timing(cardRef.rotateY, {
      toValue: 90,
      duration: 300,
      useNativeDriver: true
    }),
    // 切换内容
    Animated.timing(cardRef.rotateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    })
  ]).start();
};
```

##### 3. 拖拽滑动效果
```javascript
// 横向滑动配置
const swipeConfig = {
  sensitivity: 0.5,
  snapToCard: true,
  snapThreshold: 0.3,
  overshoot: 50,
  deceleration: 0.997
};

// 滑动时的卡牌倾斜
const getSwipeTilt = (offset, maxOffset) => {
  const progress = offset / maxOffset;
  return progress * 15; // 最大倾斜15度
};
```

##### 4. 入场动画序列
```javascript
// 入场时间线
const entranceTimeline = [
  { element: 'header', delay: 0, animation: 'fadeInDown', duration: 400 },
  { element: 'welcomeCard', delay: 200, animation: 'scaleIn', duration: 500 },
  { element: 'characterSection', delay: 400, animation: 'fadeIn', duration: 300 },
  { element: 'characterCards', delay: 500, animation: 'fanExpand', duration: 600, stagger: 100 },
  { element: 'storySection', delay: 800, animation: 'fadeIn', duration: 300 },
  { element: 'storyCards', delay: 900, animation: 'slideInUp', duration: 400, stagger: 150 }
];
```

##### 5. 卡牌发光边框
```javascript
// 边框发光动画
@keyframes border-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(255,215,0,0.3),
                0 0 10px rgba(255,215,0,0.2);
  }
  50% {
    box-shadow: 0 0 15px rgba(255,215,0,0.5),
                0 0 30px rgba(255,215,0,0.3);
  }
}

// React Native实现
const BorderGlow = () => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false
        })
      ])
    ).start();
  }, []);

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8]
  });

  return (
    <Animated.View style={[styles.card, { shadowOpacity }]}>
      {/* 卡牌内容 */}
    </Animated.View>
  );
};
```

### 交互设计

#### 卡牌选择流程
```
1. 用户滑动浏览卡牌
   - 卡牌跟随手指移动
   - 相邻卡牌产生视差效果
   - 边缘卡牌淡出

2. 用户点击卡牌
   - 卡牌放大居中
   - 显示详细信息弹窗
   - 背景模糊

3. 确认选择
   - 卡牌飞向目标位置
   - 触发页面跳转
```

---

## Demo 3: 故事导演台 - 完整版

### 设计概念
模拟卡牌游戏的对战桌面，用户通过选择卡牌来"导演"故事发展。

### 视觉设计

#### 布局结构
```
┌─────────────────────────────────────────────────────────────────┐
│  ← 返回    │    📖 龙之传说    │              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    🎭 舞台预览                           │   │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                           │   │
│  │  │👑 │ │🎭 │ │🎭 │ │👿 │  (角色槽位)                   │   │
│  │  │主角│ │配角│ │配角│ │反派│                           │   │
│  │  └────┘ └────┘ └────┘ └────┘                           │   │
│  │  ┌────┐ ┌────┐ ┌────┐ ┌────┐                           │   │
│  │  │🗺️ │ │🏔️ │ │🌤️ │ │🎒 │  (场景槽位)                 │   │
│  │  │冒险│ │地形│ │天气│ │道具│                           │   │
│  │  └────┘ └────┘ └────┘ └────┘                           │   │
│  │                                                         │   │
│  │  "勇敢的骑士在暴风雨的山谷中..." (故事预览)              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🗺️ 冒险类型 (必选1)                                       │  │
│  │    ╱╲    ╱╲    ╱╲    ╱╲    ╱╲                           │  │
│  │   │🏰│  │🔍│  │🤝│  │🦸│  │💎│  (扇形展开)              │  │
│  │   │探险│  │解谜│  │友情│  │救援│  │寻宝│                           │  │
│  │    ╲╱    ╲╱    ╲╱    ╲╱    ╲╱                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 👥 角色选择 (主角必选1)                                    │  │
│  │    ╱╲    ╱╲    ╱╲    ╱╲    ╱╲                           │  │
│  │   │🧙│  │🦸│  │🧝│  │🤴│  │🧛│  (带角色标签)            │  │
│  │   │法师│  │战士│  │精灵│  │王子│  │吸血鬼│                         │  │
│  │    ╲╱    ╲╱    ╲╱    ╲╱    ╲╱                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🏔️ 地形 (必选1)    │    🌤️ 天气 (必选1)    │    🎒 道具   │  │
│  │  (扇形展开)        │    (扇形展开)        │  (可选)      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ○主角 ○冒险 ○地形 ○天气          [🎬 开拍！] (脉冲发光)        │
└─────────────────────────────────────────────────────────────────┘
```

#### 动画效果

##### 1. 卡牌扇形展开（核心动画）
```javascript
// 高级扇形展开配置
const advancedFanConfig = {
  // 基础参数
  cardWidth: 85,
  cardHeight: 125,
  cardSpacing: 22,      // 卡牌间距
  fanAngle: 80,         // 总展开角度
  curveRadius: 300,     // 曲线半径
  
  // 动画参数
  animation: {
    type: 'spring',
    damping: 15,
    stiffness: 100,
    mass: 1
  },
  
  // 交互参数
  hover: {
    liftY: -50,
    scale: 1.25,
    rotateCorrection: true  // 悬停时纠正旋转
  },
  
  // 选中参数
  selected: {
    liftY: -25,
    heartbeat: true,        // 心跳动画
    glowIntensity: 0.8
  }
};

// 计算每张卡的位置和旋转
const calculateFanPosition = (index, total, config) => {
  const { cardWidth, cardSpacing, fanAngle, curveRadius } = config;
  
  // 角度计算
  const startAngle = -fanAngle / 2;
  const angleStep = fanAngle / (total - 1);
  const angle = startAngle + angleStep * index;
  const radian = (angle * Math.PI) / 180;
  
  // 位置计算（弧线）
  const totalWidth = (total - 1) * cardSpacing;
  const offsetX = (index - (total - 1) / 2) * cardSpacing;
  
  // Y偏移（弧形）
  const offsetY = Math.sin(Math.abs(angle) * Math.PI / 180) * 20;
  
  return {
    x: offsetX,
    y: offsetY,
    rotate: angle,
    zIndex: Math.floor(100 - Math.abs(angle))
  };
};

// React Native实现
const FanCard = ({ card, index, total, isSelected, onSelect }) => {
  const position = calculateFanPosition(index, total, advancedFanConfig);
  
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  
  // 入场动画
  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      delay: index * 50,
      friction: 8,
      tension: 40,
      useNativeDriver: true
    }).start();
  }, []);
  
  // 选中动画
  useEffect(() => {
    if (isSelected) {
      // 心跳动画
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.08,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: true
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true
          })
        ])
      ).start();
    } else {
      scaleAnim.setValue(1);
    }
  }, [isSelected]);
  
  const transform = [
    { translateX: animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, position.x]
      })
    },
    { translateY: Animated.add(
        animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, position.y]
        }),
        translateYAnim
      )
    },
    { rotate: `${position.rotate}deg` },
    { scale: scaleAnim }
  ];
  
  return (
    <Animated.View style={[styles.fanCard, { transform }]}>
      {/* 卡牌内容 */}
    </Animated.View>
  );
};
```

##### 2. 舞台槽位动画
```javascript
// 槽位配置
const slotConfig = {
  gridSize: '4x2',
  slotSize: { width: 70, height: 90 },
  gap: 8,
  
  // 必填槽位发光
  requiredGlow: {
    color: 'rgba(255,215,0,0.4)',
    animation: 'pulse',
    duration: 2000
  },
  
  // 填充动画
  fillAnimation: {
    type: 'scale-bounce',
    duration: 300
  }
};

// 槽位填充动画
const fillSlot = (slotRef, card) => {
  Animated.sequence([
    // 缩放进入
    Animated.spring(slotRef.scale, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true
    }),
    Animated.spring(slotRef.scale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true
    })
  ]).start();
};
```

##### 3. 天气特效系统
```javascript
// 天气效果配置
const weatherEffects = {
  // 晴天
  sunny: {
    layers: [
      { type: 'sun-orb', position: 'top-right', size: 80 },
      { type: 'sun-rays', animation: 'rotate', duration: 20000 },
      { type: 'light-gradient', opacity: 0.3 }
    ],
    particles: null
  },
  
  // 雨天
  rainy: {
    layers: [
      { type: 'rain-drops', count: 80, speed: 'fast' }
    ],
    particles: {
      type: 'drop',
      count: 80,
      speed: [0.4, 0.7],
      size: [2, 20],
      color: 'rgba(174,194,224,0.5)'
    }
  },
  
  // 雷暴
  thunder: {
    layers: [
      { type: 'rain-drops', count: 100, speed: 'very-fast' },
      { type: 'lightning-flash', interval: [2000, 5000] }
    ],
    flash: {
      color: 'white',
      opacity: [0, 0.9, 0.2, 0.9, 0],
      duration: 500
    }
  },
  
  // 雪天
  snow: {
    particles: {
      type: 'snowflake',
      count: 50,
      speed: [2, 4],
      size: [0.5, 1.3],
      emoji: '❄',
      rotate: true
    }
  },
  
  // 雾天
  fog: {
    layers: [
      { type: 'radial-gradient', color: 'rgba(200,200,200,0.3)' }
    ],
    animation: {
      type: 'scale-pulse',
      range: [1, 1.1],
      duration: 5000
    }
  },
  
  // 大风
  wind: {
    particles: {
      type: 'horizontal-line',
      count: 25,
      speed: [0.6, 1],
      length: 40,
      color: 'rgba(200,200,200,0.7)'
    }
  },
  
  // 彩虹
  rainbow: {
    layers: [
      { type: 'arc-gradient', colors: ['red','orange','yellow','green','blue','indigo','violet'] }
    ],
    animation: {
      type: 'opacity-pulse',
      range: [0.7, 1],
      duration: 3000
    }
  },
  
  // 星空
  starry: {
    background: 'linear-gradient(180deg, rgba(25,25,112,0.4), transparent 60%)',
    particles: {
      type: 'star',
      count: 60,
      size: [2, 5],
      animation: 'twinkle',
      duration: 2000
    }
  }
};

// 天气效果渲染器
const WeatherRenderer = ({ weather }) => {
  const config = weatherEffects[weather];
  
  if (!config) return null;
  
  return (
    <View style={styles.weatherContainer}>
      {/* 背景层 */}
      {config.background && (
        <View style={[styles.weatherBackground, { background: config.background }]} />
      )}
      
      {/* 图层 */}
      {config.layers?.map((layer, index) => (
        <WeatherLayer key={index} config={layer} />
      ))}
      
      {/* 粒子 */}
      {config.particles && (
        <ParticleSystem config={config.particles} />
      )}
    </View>
  );
};

// 粒子系统
const ParticleSystem = ({ config }) => {
  const particles = useMemo(() => 
    Array(config.count).fill(null).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * config.duration,
      size: config.size[0] + Math.random() * (config.size[1] - config.size[0])
    }))
  , [config]);
  
  return (
    <View style={styles.particleContainer}>
      {particles.map(p => (
        <AnimatedParticle key={p.id} config={config} particle={p} />
      ))}
    </View>
  );
};
```

##### 4. 故事预览打字机效果
```javascript
// 打字机效果
const TypewriterText = ({ text, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);
  
  return (
    <Text style={styles.previewText}>
      {displayText}
      <Text style={styles.cursor}>|</Text>
    </Text>
  );
};
```

##### 5. 生成按钮充能动画
```javascript
// 充能按钮
const ChargeButton = ({ isReady, onPress }) => {
  const chargeAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  
  useEffect(() => {
    if (isReady) {
      // 充能完成，开始脉冲
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false
          }),
          Animated.timing(glowAnim, {
            toValue: 0.5,
            duration: 1000,
            useNativeDriver: false
          })
        ])
      ).start();
    } else {
      // 充能中
      Animated.timing(chargeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start();
    }
  }, [isReady]);
  
  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0.5, 1],
    outputRange: [0.3, 0.8]
  });
  
  return (
    <TouchableOpacity
      style={[
        styles.chargeButton,
        isReady ? styles.chargeButtonReady : styles.chargeButtonDisabled
      ]}
      onPress={onPress}
      disabled={!isReady}
    >
      <Animated.View style={[styles.buttonGlow, { opacity: shadowOpacity }]} />
      <Text style={styles.buttonText}>🎬 开拍！</Text>
    </TouchableOpacity>
  );
};
```

### 交互流程
```
1. 进入导演台
   - 舞台区域淡入
   - 卡牌区域依次扇形展开
   - 必填槽位开始发光提示

2. 选择卡牌
   - 点击卡牌 → 卡牌上浮 + 心跳动画
   - 舞台槽位填充动画
   - 故事预览更新（打字机效果）
   - 天气特效触发

3. 取消选择
   - 点击已选卡牌 → 取消选中
   - 槽位清空动画
   - 天气特效清除

4. 生成故事
   - 所有必填项完成 → 按钮充能完成
   - 点击按钮 → 加载动画
   - 生成成功 → 跳转阅读页
```

---

## Demo 4: 章节阅读 - 沉浸式故事体验

### 设计概念
阅读页面结合天气特效和故事氛围，打造沉浸式阅读体验。

### 视觉设计

#### 布局结构
```
┌─────────────────────────────────────┐
│  ← 返回    │    第一章：启程    │              │
├─────────────────────────────────────┤
│  ☀️ 晴天特效背景                     │
│  (根据故事天气动态变化)               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │   在一个阳光明媚的早晨...    │    │
│  │                             │    │
│  │   勇敢的骑士【艾德蒙】       │    │
│  │   骑着他忠诚的战马           │    │
│  │   穿过了古老的森林...        │    │
│  │                             │    │
│  │   (文字随滚动淡入)           │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  🧩 谜题挑战                 │    │
│  │                             │    │
│  │  骑士应该选择哪条路？        │    │
│  │                             │    │
│  │  ┌─────────────────────┐    │    │
│  │  │ A. 穿越黑暗森林      │    │    │
│  │  └─────────────────────┘    │    │
│  │  ┌─────────────────────┐    │    │
│  │  │ B. 绕道阳光大道      │    │    │
│  │  └─────────────────────┘    │    │
│  │  ┌─────────────────────┐    │    │
│  │  │ C. 等待夜幕降临      │    │    │
│  │  └─────────────────────┘    │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  ✅ 回答正确！              │    │
│  │  你选择了明智的道路...       │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

#### 动画效果

##### 1. 天气背景特效
```javascript
// 动态天气背景
const DynamicWeatherBackground = ({ weather }) => {
  // 根据天气类型渲染不同效果
  const renderWeather = () => {
    switch (weather) {
      case 'sunny':
        return <SunnyEffect />;
      case 'rainy':
        return <RainyEffect />;
      case 'snow':
        return <SnowEffect />;
      case 'thunder':
        return <ThunderEffect />;
      case 'fog':
        return <FogEffect />;
      case 'starry':
        return <StarryEffect />;
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.weatherContainer}>
      {renderWeather()}
    </View>
  );
};

// 雨滴效果组件
const RainyEffect = () => {
  const drops = useRef([...Array(80)].map(() => ({
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 0.4 + Math.random() * 0.3
  }))).current;
  
  return (
    <View style={styles.rainContainer}>
      {drops.map((drop, i) => (
        <Animated.View
          key={i}
          style={[
            styles.rainDrop,
            {
              left: `${drop.x}%`,
              animationDelay: `${drop.delay}s`,
              animationDuration: `${drop.duration}s`
            }
          ]}
        />
      ))}
    </View>
  );
};

// 雪花效果组件
const SnowEffect = () => {
  const flakes = useRef([...Array(50)].map(() => ({
    x: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2,
    size: 0.5 + Math.random() * 0.8
  }))).current;
  
  return (
    <View style={styles.snowContainer}>
      {flakes.map((flake, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.snowflake,
            {
              left: `${flake.x}%`,
              fontSize: flake.size,
              animationDelay: `${flake.delay}s`,
              animationDuration: `${flake.duration}s`
            }
          ]}
        >
          ❄
        </Animated.Text>
      ))}
    </View>
  );
};
```

##### 2. 文字淡入动画
```javascript
// 段落淡入动画
const FadeInParagraph = ({ text, delay = 0 }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        delay,
        duration: 600,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        delay,
        duration: 600,
        useNativeDriver: true
      })
    ]).start();
  }, [delay]);
  
  return (
    <Animated.Text style={[styles.paragraph, { opacity, transform: [{ translateY }] }]}>
      {text}
    </Animated.Text>
  );
};

// 滚动触发淡入
const ScrollFadeInText = ({ content }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  
  const paragraphs = content.split('\n\n');
  
  return (
    <Animated.ScrollView
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
    >
      {paragraphs.map((text, index) => {
        const inputRange = [
          (index - 1) * 200,
          index * 200,
          (index + 1) * 200
        ];
        
        const opacity = scrollY.interpolate({
          inputRange,
          outputRange: [0, 1, 1],
          extrapolate: 'clamp'
        });
        
        const translateY = scrollY.interpolate({
          inputRange,
          outputRange: [50, 0, 0],
          extrapolate: 'clamp'
        });
        
        return (
          <Animated.Text
            key={index}
            style={[styles.paragraph, { opacity, transform: [{ translateY }] }]}
          >
            {text}
          </Animated.Text>
        );
      })}
    </Animated.ScrollView>
  );
};
```

##### 3. 关键词高亮动画
```javascript
// 关键词高亮
const HighlightedText = ({ text, keywords }) => {
  // 解析文本，高亮关键词
  const parts = useMemo(() => {
    const regex = new RegExp(`(${keywords.join('|')})`, 'g');
    return text.split(regex);
  }, [text, keywords]);
  
  return (
    <Text style={styles.paragraph}>
      {parts.map((part, index) => {
        const isKeyword = keywords.includes(part);
        return (
          <Text
            key={index}
            style={isKeyword ? styles.highlightedKeyword : null}
          >
            {part}
          </Text>
        );
      })}
    </Text>
  );
};

// 高亮样式
const styles = StyleSheet.create({
  highlightedKeyword: {
    color: COLORS.gold,
    fontWeight: '600',
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10
  }
});
```

##### 4. 谜题选项动画
```javascript
// 选项卡片动画
const PuzzleOption = ({ option, index, onSelect, isSelected, isCorrect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  
  const handlePress = () => {
    // 按压动画
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();
    
    onSelect();
  };
  
  // 错误时抖动
  useEffect(() => {
    if (isSelected && !isCorrect) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    }
  }, [isSelected, isCorrect]);
  
  return (
    <Animated.View
      style={[
        styles.optionCard,
        {
          transform: [
            { scale: scaleAnim },
            { translateX: shakeAnim }
          ]
        },
        isSelected && (isCorrect ? styles.correctOption : styles.wrongOption)
      ]}
    >
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
```

##### 5. 结果展示动画
```javascript
// 结果弹窗动画
const ResultModal = ({ isVisible, isCorrect, message }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
    }
  }, [isVisible]);
  
  return (
    <Animated.View
      style={[
        styles.resultModal,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }]
        },
        isCorrect ? styles.correctModal : styles.wrongModal
      ]}
    >
      <Text style={styles.resultIcon}>{isCorrect ? '🎉' : '😅'}</Text>
      <Text style={styles.resultTitle}>{isCorrect ? '回答正确！' : '答错了'}</Text>
      <Text style={styles.resultMessage}>{message}</Text>
    </Animated.View>
  );
};
```

### 交互流程
```
1. 进入阅读页
   - 天气特效开始播放
   - 标题淡入
   - 文字依次淡入

2. 滚动阅读
   - 新段落淡入
   - 关键词高亮闪烁
   - 天气特效持续

3. 遇到谜题
   - 谜题卡片弹出动画
   - 选项依次滑入

4. 选择答案
   - 选项按压反馈
   - 正确：绿色边框 + 庆祝动画
   - 错误：红色边框 + 抖动

5. 继续阅读
   - 结果淡出
   - 下一段落淡入
```

---

## Demo 5: 角色收集 - 卡牌图鉴系统

### 设计概念
类似卡牌游戏的收集系统，用户可以收集、查看、升级角色卡牌。

### 视觉设计

#### 布局结构
```
┌─────────────────────────────────────┐
│  🎭 角色图鉴                    🔍   │
│  已收集: 12/50                       │
├─────────────────────────────────────┤
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 🧙  │ │ 🦸  │ │ 🧝  │ │ 🤴  │   │
│  │法师 │ │战士 │ │精灵 │ │王子 │   │
│  │ ⭐⭐ │ │ ⭐⭐⭐│ │ ⭐   │ │ ⭐⭐ │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│                                     │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 🧛  │ │ 🧜  │ │ 🦹  │ │ 👺  │   │
│  │吸血鬼│ │美人鱼│ │英雄 │ │妖怪 │   │
│  │ ⭐⭐⭐│ │ ⭐   │ │ ⭐⭐ │ │ ??? │   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│                                     │
│  ┌─────────────────────────────┐    │
│  │         🧙 大法师            │    │
│  │    ┌───────────────────┐    │    │
│  │    │                   │    │    │
│  │    │   (卡牌详情)       │    │    │
│  │    │                   │    │    │
│  │    │   稀有度: ⭐⭐⭐    │    │    │
│  │    │   属性: 魔法       │    │    │
│  │    │   技能: 火球术     │    │    │
│  │    │                   │    │    │
│  │    │   [使用此角色]     │    │    │
│  │    └───────────────────┘    │    │
│  └─────────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘
```

#### 动画效果

##### 1. 卡牌网格入场
```javascript
// 网格入场动画
const CardGrid = ({ cards }) => {
  return (
    <View style={styles.grid}>
      {cards.map((card, index) => (
        <AnimatedCard
          key={card.id}
          card={card}
          delay={index * 50}
        />
      ))}
    </View>
  );
};

const AnimatedCard = ({ card, delay }) => {
  const animValue = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.spring(animValue, {
      toValue: 1,
      delay,
      friction: 6,
      tension: 40,
      useNativeDriver: true
    }).start();
  }, [delay]);
  
  const scale = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1.1, 1]
  });
  
  const opacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1]
  });
  
  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <CardItem card={card} />
    </Animated.View>
  );
};
```

##### 2. 卡牌稀有度发光
```javascript
// 稀有度配置
const rarityConfig = {
  common: {
    color: '#9CA3AF',
    glow: false,
    stars: 1
  },
  rare: {
    color: '#3B82F6',
    glow: true,
    glowIntensity: 0.3,
    stars: 2
  },
  epic: {
    color: '#A855F7',
    glow: true,
    glowIntensity: 0.5,
    stars: 3
  },
  legendary: {
    color: '#FFD700',
    glow: true,
    glowIntensity: 0.8,
    stars: 4,
    special: 'rainbow-border'
  }
};

// 稀有度发光组件
const RarityGlow = ({ rarity }) => {
  const config = rarityConfig[rarity];
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (config.glow) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false
          })
        ])
      ).start();
    }
  }, [config.glow]);
  
  if (!config.glow) return null;
  
  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [config.glowIntensity * 0.5, config.glowIntensity]
  });
  
  return (
    <Animated.View
      style={[
        styles.rarityGlow,
        {
          shadowColor: config.color,
          shadowOpacity,
          shadowRadius: 15
        }
      ]}
    />
  );
};
```

##### 3. 卡牌翻转查看详情
```javascript
// 3D翻转效果
const FlipCard = ({ card, isFlipped, onFlip }) => {
  const rotateY = useRef(new Animated.Value(0)).current;
  
  const flipToFront = () => {
    Animated.timing(rotateY, {
      toValue: 180,
      duration: 600,
      useNativeDriver: true
    }).start();
  };
  
  const flipToBack = () => {
    Animated.timing(rotateY, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true
    }).start();
  };
  
  const frontOpacity = rotateY.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [1, 0, 0]
  });
  
  const backOpacity = rotateY.interpolate({
    inputRange: [0, 90, 180],
    outputRange: [0, 0, 1]
  });
  
  const frontRotateY = rotateY.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg']
  });
  
  const backRotateY = rotateY.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg']
  });
  
  return (
    <TouchableOpacity onPress={isFlipped ? flipToBack : flipToFront}>
      <View style={styles.flipContainer}>
        {/* 正面 */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            {
              opacity: frontOpacity,
              transform: [{ rotateY: frontRotateY }]
            }
          ]}
        >
          <CardFront card={card} />
        </Animated.View>
        
        {/* 背面 */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            {
              opacity: backOpacity,
              transform: [{ rotateY: backRotateY }]
            }
          ]}
        >
          <CardBack card={card} />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};
```

##### 4. 新卡牌获得动画
```javascript
// 新卡牌获得动画
const NewCardReveal = ({ card, onClose }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(-30)).current;
  const shineAnim = useRef(new Animated.Value(-1)).current;
  
  useEffect(() => {
    // 入场动画序列
    Animated.sequence([
      // 卡牌飞入
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true
        }),
        Animated.spring(rotateAnim, {
          toValue: 0,
          friction: 5,
          tension: 40,
          useNativeDriver: true
        })
      ]),
      // 延迟后闪光
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true
      })
    ]).start();
  }, []);
  
  const shineTranslate = shineAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200]
  });
  
  return (
    <Modal visible transparent>
      <View style={styles.revealContainer}>
        <Animated.View
          style={[
            styles.revealCard,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: rotateAnim.interpolate({
                    inputRange: [-30, 0],
                    outputRange: ['-30deg', '0deg']
                  })
                }
              ]
            }
          ]}
        >
          <CardItem card={card} large />
          
          {/* 闪光效果 */}
          <Animated.View
            style={[
              styles.shineOverlay,
              { transform: [{ translateX: shineTranslate }] }
            ]}
          />
        </Animated.View>
        
        <Text style={styles.revealText}>获得新角色！</Text>
        
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>确定</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
```

##### 5. 卡牌升级动画
```javascript
// 升级动画
const UpgradeAnimation = ({ onComplete }) => {
  const particles = useRef([...Array(20)].map(() => ({
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    delay: Math.random() * 500,
    scale: 0.5 + Math.random() * 0.5
  }))).current;
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.sequence([
      // 蓄力
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 300,
        useNativeDriver: true
      }),
      // 爆发
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          friction: 3,
          tension: 100,
          useNativeDriver: true
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false
        })
      ]),
      // 回归
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true
      })
    ]).start();
    
    setTimeout(onComplete, 1500);
  }, []);
  
  return (
    <View style={styles.upgradeContainer}>
      {/* 粒子爆发 */}
      {particles.map((p, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              transform: [
                { translateX: p.x },
                { translateY: p.y },
                { scale: p.scale }
              ]
            }
          ]}
        />
      ))}
      
      {/* 发光效果 */}
      <Animated.View
        style={[
          styles.upgradeGlow,
          { opacity: glowAnim }
        ]}
      />
    </View>
  );
};
```

### 交互流程
```
1. 进入图鉴
   - 卡牌网格依次弹入
   - 稀有卡牌发光效果

2. 浏览卡牌
   - 滑动查看
   - 悬停放大预览

3. 查看详情
   - 点击卡牌翻转
   - 显示详细属性

4. 选择使用
   - 点击"使用此角色"
   - 卡牌飞向故事创建页

5. 获得新卡牌
   - 卡牌飞入动画
   - 闪光效果
   - 稀有度展示
```

---

## 技术实现指南

### React Native动画库选择
```javascript
// 推荐使用的动画库
import { Animated, Easing } from 'react-native';
import Animated, { Easing } from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
```

### 性能优化建议
```javascript
// 1. 使用useNativeDriver
Animated.timing(animValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true  // 启用原生驱动
});

// 2. 避免在动画中修改布局属性
// 好: transform, opacity
// 差: width, height, margin, padding

// 3. 使用InteractionManager
InteractionManager.runAfterInteractions(() => {
  // 在动画完成后执行重操作
});

// 4. 缓存动画值
const cachedAnim = useMemo(() => new Animated.Value(0), []);
```

### 通用动画工具函数
```javascript
// 弹性动画
export const spring = (value, toValue, config = {}) => {
  return Animated.spring(value, {
    toValue,
    friction: config.friction || 8,
    tension: config.tension || 40,
    useNativeDriver: true
  });
};

// 淡入淡出
export const fadeIn = (value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    useNativeDriver: true
  });
};

// 序列动画
export const sequence = (animations) => {
  return Animated.sequence(animations);
};

// 并行动画
export const parallel = (animations) => {
  return Animated.parallel(animations);
};

// 循环动画
export const loop = (animation) => {
  return Animated.loop(animation);
};

// 延迟动画
export const delay = (ms) => {
  return Animated.delay(ms);
};
```

---

## 文件结构建议

```
lego-mobile/
├── src/
│   ├── components/
│   │   ├── cards/
│   │   │   ├── FanCard.js          # 扇形卡牌
│   │   │   ├── FlipCard.js         # 翻转卡牌
│   │   │   ├── CardItem.js         # 卡牌项
│   │   │   └── index.js
│   │   ├── effects/
│   │   │   ├── WeatherEffect.js    # 天气特效
│   │   │   ├── ParticleSystem.js   # 粒子系统
│   │   │   ├── GlowEffect.js       # 发光效果
│   │   │   └── index.js
│   │   └── animations/
│   │       ├── useFanAnimation.js  # 扇形动画Hook
│   │       ├── useFlipAnimation.js # 翻转动画Hook
│   │       ├── useGlowAnimation.js # 发光动画Hook
│   │       └── index.js
│   ├── screens/
│   │   ├── demo/
│   │   │   ├── Demo1Login.js       # Demo1: 登录页
│   │   │   ├── Demo2Home.js        # Demo2: 主页
│   │   │   ├── Demo3Director.js    # Demo3: 导演台
│   │   │   ├── Demo4Reader.js      # Demo4: 阅读页
│   │   │   ├── Demo5Collection.js  # Demo5: 收集页
│   │   │   └── index.js
│   │   └── ...
│   └── utils/
│       ├── animations.js           # 动画工具函数
│       └── weatherConfig.js        # 天气配置
```

---

## 总结

本设计规范定义了5个桌游风格的Demo，每个Demo都包含：

1. **详细的视觉设计** - 布局结构、色彩方案
2. **完整的动画效果** - 入场、交互、反馈动画
3. **清晰的交互流程** - 用户操作路径
4. **技术实现指南** - React Native代码示例

这些Demo将帮助开发团队快速实现高质量的桌游风格UI，提升用户体验和产品竞争力。
