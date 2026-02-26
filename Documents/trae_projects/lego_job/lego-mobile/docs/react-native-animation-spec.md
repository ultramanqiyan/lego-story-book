# React Native移动端动画效果提升规格

## 项目概述
将demo.html中的增强动画效果应用到React Native移动端APP，保持功能完整，只修改移动端代码。

---

## 技术方案

### React Native动画API
- **Animated API** - 使用 `Animated` 组件实现流畅动画
- **LayoutAnimation** - 布局动画用于入场效果
- **Easing** - 使用 `Easing` 实现弹性、平滑缓动效果
- **useNativeDriver** - 启用原生驱动以获得更好性能

### 动画映射关系

| HTML/CSS动画 | React Native实现 |
|--------------|------------------|
| CSS Keyframes | Animated.timing / Animated.sequence |
| transform | Animated.transform |
| opacity | Animated.opacity |
| scale | Animated.scale |
| rotate | Animated.rotate |
| transition | Animated.spring / Animated.decay |

---

## 功能清单（保持完整）

### Demo 1: 登录页面
- ✅ 彩虹光泽流动标题
- ✅ 弹跳入场动画
- ✅ 扇形卡牌飞入+旋转
- ✅ 3D翻转选中效果
- ✅ 卡牌浮动动画
- ✅ 属性宝石旋转发光
- ✅ 开始按钮渐变边框+脉冲

### Demo 2: 主页
- ✅ 3D翻转入场欢迎卡片
- ✅ 功能列表逐行淡入
- ✅ 角色卡片弹性滑入
- ✅ 悬停上浮放大效果
- ✅ 故事卡片入场动画

### Demo 3: 导演台
- ✅ 舞台格子虚线流动
- ✅ 填充内容弹入
- ✅ 卡牌选择弹性入场
- ✅ 晴天：太阳光芒旋转+光束扩散
- ✅ 雨天：雨滴下落+闪电效果
- ✅ 雪天：雪花旋转飘落+霜冻
- ✅ 底部操作栏动画

### Demo 4: 阅读页面
- ✅ 章节标题弹跳入场+下划线展开
- ✅ 段落逐段淡入
- ✅ 关键词闪烁浮动
- ✅ 谜题卡片3D旋转入场
- ✅ 正确答案光芒爆发+星星
- ✅ 错误答案震动

### Demo 5: 收集页面
- ✅ 卡牌网格中心扩散入场
- ✅ 选中放大+发光脉冲
- ✅ 详情面板底部弹性滑入
- ✅ 新卡牌获得：飞入+旋转+弹跳+光芒爆发+闪光扫过+粒子庆祝

---

## 实现细节

### 缓动函数
```javascript
import { Easing } from 'react-native';

const bounceEasing = Easing.bezier(0.68, -0.55, 0.265, 1.55);
const smoothEasing = Easing.out(Easing.cubic);
const enterEasing = Easing.out(Easing.quad);
const exitEasing = Easing.in(Easing.quad);
```

### 动画组件结构
```javascript
// 带动画的卡牌组件
<AnimatedCard>
  - Animated.View (transform, opacity)
  - Animated.spring (弹性效果)
  - Animated.timing (时间控制)
</AnimatedCard>

// 粒子系统
<ParticleSystem>
  - Animated.View (位置、透明度)
  - Animated.timing (循环动画)
</ParticleSystem>

// 天气效果
<WeatherEffect>
  - 晴天：旋转太阳+光束
  - 雨天：下落雨滴+随机闪电
  - 雪天：旋转雪花+霜冻层
</WeatherEffect>
```

---

## 文件修改范围

### 只修改移动端代码
- ✅ `lego-mobile/src/screens/demo/DemoScreens.js` - 主要实现文件
- ✅ `lego-mobile/src/styles/animations.js` - 新增动画样式文件（可选）
- ✅ `lego-mobile/src/components/AnimatedCard.js` - 新增动画卡牌组件（可选）
- ✅ `lego-mobile/src/components/ParticleSystem.js` - 新增粒子系统组件（可选）
- ✅ `lego-mobile/src/components/WeatherEffect.js` - 新增天气效果组件（可选）

### 不修改的文件
- ❌ `lego-mobile/demo.html` - 保持不变
- ❌ `lego-web/` - web端代码不修改
- ❌ 其他非demo相关文件

---

## 性能优化

1. **useNativeDriver: true** - 使用原生驱动
2. **避免在动画中测量布局** - 提前计算好尺寸
3. **减少同时运行的动画数量** - 控制粒子数量
4. **使用InteractionManager** - 处理触摸和动画冲突
5. **卸载时清理动画** - 防止内存泄漏

---

## 测试清单

- [ ] 所有5个Demo页面动画流畅
- [ ] 60fps帧率稳定
- [ ] 触摸响应及时
- [ ] 无内存泄漏
- [ ] Android和iOS表现一致
