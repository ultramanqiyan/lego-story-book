# React Native 动画增强规格说明 - 真实项目

## 概述
将 `demo.html` 中的增强动画效果应用到 React Native 移动端真实项目页面，保持所有功能不变，仅修改移动端代码。

## 目标文件映射

| Demo页面 | 真实项目页面 | 文件路径 |
|---------|------------|---------|
| Demo 1 登录 | LoginScreen | `src/screens/auth/LoginScreen.js` |
| Demo 2 主页 | HomeScreen | `src/screens/home/HomeScreen.js` |
| Demo 3 导演台 | StoryDirectorScreen | `src/screens/story/StoryDirectorScreen.js` |
| Demo 4 阅读 | ChapterScreen | `src/screens/chapter/ChapterScreen.js` |
| Demo 5 收集 | CharactersScreen | `src/screens/characters/CharactersScreen.js` |

## 全局组件
- **粒子背景**: 创建 `src/components/common/ParticleBackground.js`
- **光晕背景**: 创建 `src/components/common/GlowOrbBackground.js`
- **触摸涟漪**: 创建 `src/components/common/TouchRipple.js`

---

## 1. LoginScreen 增强动画

### 现有功能
- 用户名输入
- 邮箱输入（可选）
- 登录按钮
- 乐高积木块装饰

### 新增动画效果
| 效果 | 描述 | 实现方式 |
|-----|------|---------|
| 标题弹跳入场 | 🧱 图标和标题弹跳缩放入场 | Animated.spring + scale |
| 副标题淡入 | 副标题从下方淡入 | Animated.timing + translateY |
| 积木块动画 | 三个积木块交错弹跳 | Animated.stagger + scale |
| 卡片飞入 | 登录卡片从下方飞入 | Animated.spring + translateY |
| 输入框聚焦发光 | 输入框聚焦时边框发光 | Animated shadow |
| 按钮脉动 | 登录按钮持续脉动效果 | Animated.loop + scale |
| 粒子背景 | 全局粒子上升效果 | ParticleBackground组件 |

---

## 2. HomeScreen 增强动画

### 现有功能
- 问候语
- 欢迎卡片
- 热门人仔横向滚动
- 最近故事横向滚动

### 新增动画效果
| 效果 | 描述 | 实现方式 |
|-----|------|---------|
| 问候语滑入 | 问候语从右侧滑入 | Animated.timing + translateX |
| 欢迎卡片3D翻转 | 卡片从顶部翻转进入 | Animated.timing + rotateX |
| 功能列表交错 | 功能项交错淡入 | Animated.stagger + opacity |
| 人仔卡片滑入 | 横向滚动卡片从右侧滑入 | Animated.timing + translateX |
| 人仔卡片悬停 | 卡片悬停时上浮 | translateY + scale |
| 故事卡片淡入 | 故事卡片淡入上移 | Animated.timing + opacity |
| 开始按钮浮动 | 按钮持续浮动 | Animated.loop + translateY |
| 光晕背景 | 金色/紫色光晕移动 | GlowOrbBackground组件 |

---

## 3. StoryDirectorScreen 增强动画

### 现有功能
- 舞台预览
- 角色选择
- 天气/冒险/地形/装备选择
- 生成按钮

### 新增动画效果
| 效果 | 描述 | 实现方式 |
|-----|------|---------|
| 舞台槽位填充 | 槽位选中时弹跳填充 | Animated.spring + scale |
| 角色卡片弹跳 | 角色卡片入场弹跳 | Animated.spring |
| 角色选中效果 | 选中时放大发光 | scale + shadow |
| 天气效果 | 晴天/雨天/雪天动画 | WeatherEffect组件增强 |
| 雨滴下落 | 80个雨滴 + 闪电 | Animated.loop |
| 雪花飘落 | 50个雪花 + 霜冻 | Animated.loop + rotate |
| 太阳脉动 | 太阳核心脉动 + 光芒旋转 | Animated.loop + scale |
| 开拍按钮脉动 | 按钮就绪时脉动发光 | Animated.loop |

---

## 4. ChapterScreen 增强动画

### 现有功能
- 章节标题
- 故事内容
- 谜题问答
- 结果显示

### 新增动画效果
| 效果 | 描述 | 实现方式 |
|-----|------|---------|
| 标题下落弹跳 | 章节标题弹跳入场 | Animated.spring + translateY |
| 下划线展开 | 标题下方金线展开 | Animated.timing + width |
| 段落淡入 | 段落交错淡入上移 | Animated.stagger |
| 关键词发光 | 关键词高亮发光效果 | textShadow + 动画 |
| 谜题卡片滑入 | 谜题卡片3D滑入 | rotateY + translateX |
| 选项悬停 | 选项悬停时放大 | scale |
| 正确结果弹入 | 正确结果弹跳 + 发光 | Animated.spring + shadow |
| 错误结果抖动 | 错误结果抖动效果 | Animated.sequence + translateX |
| 庆祝星星 | 正确时星星爆发 | 多个Animated.View |

---

## 5. CharactersScreen 增强动画

### 现有功能
- 预设人仔列表
- 用户创建的人仔列表
- 创建/编辑/删除人仔

### 新增动画效果
| 效果 | 描述 | 实现方式 |
|-----|------|---------|
| 标题滑入 | 标题从左侧滑入 | Animated.timing + translateX |
| 卡片网格入场 | 卡片交错缩放入场 | Animated.stagger + scale |
| 卡片悬停 | 卡片悬停时上浮发光 | translateY + shadow |
| 预设徽章脉动 | 系统预设徽章脉动 | Animated.loop |
| 弹窗滑入 | 创建弹窗从底部滑入 | Animated.timing + translateY |
| 揭示动画 | 新建角色揭示动画 | rotate + scale |
| 庆祝粒子 | 创建成功时粒子爆发 | 多个Animated.View |

---

## 技术实现

### 动画配置常量
```javascript
const EASING = {
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),
  smooth: Easing.out(Easing.cubic),
  enter: Easing.out(Easing.quad),
  exit: Easing.in(Easing.quad),
};
```

### 性能优化
- 所有动画使用 `useNativeDriver: true`
- 使用 `useRef` 存储动画值
- 复杂动画拆分为独立 Animated.Value

### 文件修改清单
1. `src/screens/auth/LoginScreen.js` - 添加入场动画
2. `src/screens/home/HomeScreen.js` - 添加卡片动画
3. `src/screens/story/StoryDirectorScreen.js` - 增强天气效果
4. `src/screens/chapter/ChapterScreen.js` - 添加阅读动画
5. `src/screens/characters/CharactersScreen.js` - 添加收集动画
6. `src/components/common/ParticleBackground.js` - 新建
7. `src/components/common/GlowOrbBackground.js` - 新建
8. `src/components/story/WeatherEffect.js` - 增强
