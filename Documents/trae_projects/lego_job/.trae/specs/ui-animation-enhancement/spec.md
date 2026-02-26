# UI动画特效增强规范

## 项目概述
作为专业APP UI动画特效设计师，对lego-mobile应用进行全面视觉升级，打造炫酷的3D卡牌效果、沉浸式天气特效和流畅的交互动画。

## 现状分析

### 当前问题
1. **卡牌效果**: 仅有简单的2D旋转，缺乏3D立体感和交互反馈
2. **天气效果**: 基础粒子效果，视觉冲击力不足
3. **动画系统**: 使用传统Animated API，缺乏流畅的物理动画
4. **交互反馈**: 缺少按压、悬浮等微交互效果

### 技术栈
- React Native + Expo
- react-native-reanimated (v3.10.1)
- react-native-gesture-handler (v2.16.1)

---

## 1. 3D卡牌系统重构

### 1.1 3D翻转卡牌组件 (Card3D)

#### 视觉效果
- **正面**: 卡牌正面展示内容，带动态阴影
- **背面**: 卡牌背面设计（如乐高积木纹理）
- **翻转动画**: 流畅的Y轴180度翻转，带透视效果
- **悬浮效果**: 手指悬浮时卡片轻微倾斜（3D tilt效果）

#### 技术规格
```javascript
// 3D变换参数
const CARD_3D_CONFIG = {
  perspective: 1000,        // 透视深度
  flipDuration: 600,        // 翻转动画时长
  tiltMaxAngle: 15,         // 最大倾斜角度
  shadowOpacity: 0.3,       // 阴影透明度
  shadowBlur: 20,           // 阴影模糊度
  elevation: 8,             // 海拔高度
};

// 缓动函数
const EASING = {
  flip: Easing.bezier(0.4, 0, 0.2, 1),  // 标准Material缓动
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),  // 弹性缓动
};
```

#### 交互设计
1. **点击翻转**: 单击卡片进行正反面翻转
2. **悬浮倾斜**: 手指在卡片上移动时，卡片跟随倾斜
3. **选中状态**: 选中时卡片上浮并发光
4. **堆叠展开**: 多张卡片堆叠时的扇形展开动画

### 1.2 卡牌组组件 (CardDeck3D)

#### 视觉效果
- **扇形展开**: 卡牌呈扇形排列，有层次感
- **3D堆叠**: 未展开的卡牌有3D堆叠效果
- **选中动画**: 选中卡牌从堆叠中抽出并放大
- **洗牌动画**: 卡牌重新排列时的洗牌效果

#### 技术规格
```javascript
const DECK_CONFIG = {
  cardWidth: 80,
  cardHeight: 110,
  fanAngle: 60,           // 扇形角度
  stackOffset: 2,         // 堆叠偏移量
  spreadDuration: 400,    // 展开动画时长
  selectElevation: 20,    // 选中时提升高度
};
```

---

## 2. 天气特效系统升级

### 2.1 雨天效果 (RainEffectV2)

#### 视觉效果
- **雨滴粒子**: 更真实的雨滴形状和下落轨迹
- **溅落效果**: 雨滴落地时的涟漪动画
- **闪电效果**: 雷电天气时的闪光和屏幕震动
- **雾气层**: 雨天的朦胧雾气效果
- **玻璃水滴**: 屏幕上的水滴滑落效果

#### 技术规格
```javascript
const RAIN_CONFIG = {
  dropCount: 80,          // 雨滴数量
  dropLength: [15, 35],   // 雨滴长度范围
  fallSpeed: [300, 600],  // 下落速度范围 (ms)
  windAngle: -15,         // 风向角度
  splashEnabled: true,    // 开启溅落效果
  lightningInterval: 3000,// 闪电间隔
};
```

### 2.2 雪天效果 (SnowEffectV2)

#### 视觉效果
- **雪花多样性**: 不同形状和大小的雪花（❄️❅❆）
- **飘动轨迹**: 雪花左右飘落的自然轨迹
- **积雪效果**: 屏幕底部积雪堆积
- **呼出白气**: 模拟寒冷天气的呼吸效果
- **冰霜边框**: 屏幕边缘的冰霜结晶效果

#### 技术规格
```javascript
const SNOW_CONFIG = {
  flakeCount: 50,
  flakeTypes: ['❄', '❅', '❆', '✦'],
  fallDuration: [4000, 8000],
  swayAmplitude: 30,      // 摆动幅度
  accumulation: true,     // 积雪效果
};
```

### 2.3 晴天效果 (SunEffectV2)

#### 视觉效果
- **太阳光晕**: 多层光晕的太阳光
- **光线射线**: 动态旋转的阳光射线
- **镜头光斑**: 模拟相机镜头的光斑效果
- **热浪扭曲**: 炎热天气的空气扭曲效果
- **粒子尘埃**: 阳光中的浮动尘埃粒子

#### 技术规格
```javascript
const SUN_CONFIG = {
  rayCount: 12,
  rayLength: [60, 100],
  glowLayers: 3,
  rotationSpeed: 20000,   // 射线旋转周期
  dustParticles: 30,      // 尘埃粒子数
};
```

### 2.4 雾天效果 (FogEffect) - 新增

#### 视觉效果
- **多层雾层**: 不同透明度的雾层移动
- **能见度渐变**: 屏幕边缘更清晰的效果
- **神秘光点**: 雾中若隐若现的光点

---

## 3. 粒子动画系统

### 3.1 魔法粒子背景 (MagicParticles)

#### 视觉效果
- **浮动光点**: 缓慢上下浮动的发光粒子
- **闪烁效果**: 粒子随机闪烁
- **轨迹连接**: 粒子间的细线连接（星座效果）
- **色彩渐变**: 粒子颜色随时间渐变

#### 技术规格
```javascript
const MAGIC_CONFIG = {
  particleCount: 25,
  colors: ['#FFD100', '#FF6B35', '#4ECDC4', '#95E1D3'],
  floatSpeed: [3000, 6000],
  blinkInterval: [1000, 3000],
  connectionDistance: 100, // 连线距离阈值
};
```

### 3.2 交互粒子效果 (InteractiveParticles)

#### 触发场景
- **点击爆发**: 点击屏幕时的粒子爆发
- **拖拽轨迹**: 拖拽时的粒子拖尾
- **成功庆祝**: 任务完成时的彩花效果

#### 技术规格
```javascript
const INTERACTIVE_CONFIG = {
  burstParticleCount: 20,
  trailDensity: 5,        // 轨迹密度
  colors: ['#FFD100', '#FF6B35', '#4ECDC4', '#F7FFF7'],
  gravity: 0.5,           // 重力效果
  decay: 0.98,            // 衰减系数
};
```

---

## 4. 转场动画系统

### 4.1 页面转场 (PageTransitions)

#### 动画类型
- **滑动进入**: 从右侧滑入新页面
- **缩放过渡**: 页面间的缩放切换
- **共享元素**: 元素在页面间的平滑过渡
- **3D翻转**: 页面3D翻转切换

#### 技术规格
```javascript
const TRANSITION_CONFIG = {
  slideDuration: 300,
  scaleDuration: 400,
  sharedElementDuration: 500,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
};
```

### 4.2 列表动画 (ListAnimations)

#### 动画效果
- **交错进入**: 列表项依次进入的动画
- **删除动画**: 项删除时的滑出效果
- **重排动画**: 列表重排时的平滑过渡

---

## 5. 微交互设计

### 5.1 按钮动画 (ButtonAnimations)

#### 交互效果
- **按压缩放**: 按下时缩小，释放时弹性恢复
- **涟漪效果**: 点击时的水波纹扩散
- **加载状态**: 加载时的旋转动画
- **成功反馈**: 成功时的勾选动画

### 5.2 输入框动画 (InputAnimations)

#### 交互效果
- **聚焦放大**: 聚焦时轻微放大
- **标签上浮**: 占位符标签上浮成为标题
- **下划线动画**: 下划线从中心向两边展开

---

## 6. 性能优化规范

### 6.1 动画性能
- 所有动画使用 `useNativeDriver: true`
- 粒子数量控制在合理范围（最多100个）
- 使用 `React.memo` 避免不必要的重渲染
- 复杂动画使用 `worklet` 在UI线程执行

### 6.2 内存管理
- 组件卸载时清理动画
- 使用 `useSharedValue` 而非 `useState` 存储动画值
- 粒子池复用，避免频繁创建销毁

### 6.3 可访问性
- 支持 `prefers-reduced-motion` 设置
- 提供动画开关选项
- 确保动画不影响内容可读性

---

## 7. 文件结构

```
lego-mobile/src/
├── components/
│   ├── card3d/
│   │   ├── Card3D.js           # 3D翻转卡牌
│   │   ├── CardDeck3D.js       # 3D卡牌组
│   │   └── Card3D.styles.js    # 样式配置
│   ├── weather/
│   │   ├── WeatherEffectV2.js  # 天气效果容器
│   │   ├── RainEffectV2.js     # 雨天效果
│   │   ├── SnowEffectV2.js     # 雪天效果
│   │   ├── SunEffectV2.js      # 晴天效果
│   │   ├── FogEffect.js        # 雾天效果
│   │   └── Weather.styles.js   # 天气样式
│   ├── particles/
│   │   ├── MagicParticles.js   # 魔法粒子背景
│   │   ├── BurstParticles.js   # 爆发粒子效果
│   │   └── TrailParticles.js   # 轨迹粒子
│   └── transitions/
│       ├── FadeTransition.js   # 淡入淡出
│       ├── SlideTransition.js  # 滑动过渡
│       └── ScaleTransition.js  # 缩放过渡
├── hooks/
│   ├── use3DCard.js            # 3D卡片动画hook
│   ├── useParticles.js         # 粒子系统hook
│   └── useWeather.js           # 天气效果hook
└── utils/
    └── animations.js           # 动画工具函数
```

---

## 8. 设计原则

### 8.1 视觉层次
1. **前景层**: 主要交互元素，最突出的动画
2. **中景层**: 内容展示区域，适度的动态效果
3. **背景层**: 氛围效果，不干扰主要内容

### 8.2 动画节奏
- **即时反馈**: 0.1-0.2s 的微交互
- **标准过渡**: 0.3-0.5s 的页面切换
- **氛围动画**: 2-8s 的循环背景效果

### 8.3 品牌一致性
- 使用乐高品牌色（黄、红、蓝、绿）
- 保持积木风格的圆角和边框
- 动画风格活泼有趣，符合儿童应用定位

---

## 9. 验收标准

### 9.1 功能验收
- [ ] 3D卡牌可以流畅翻转，无明显卡顿
- [ ] 卡牌悬浮倾斜效果响应灵敏
- [ ] 天气效果在60fps下运行流畅
- [ ] 粒子系统不影响页面性能
- [ ] 所有动画支持减少动画偏好

### 9.2 视觉验收
- [ ] 3D效果有适当的透视和阴影
- [ ] 天气效果视觉冲击力明显增强
- [ ] 粒子动画增添氛围但不喧宾夺主
- [ ] 整体动画风格统一协调

### 9.3 性能验收
- [ ] 低端设备上动画仍保持流畅
- [ ] 内存占用在合理范围内
- [ ] 电池消耗无明显增加
