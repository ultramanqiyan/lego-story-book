# UI配色统一设计文档

## 概述

本文档记录LEGO Story应用的UI配色统一设计方案，目标是实现按钮、背景等配色统一，卡牌样式、颜色、比例统一。

## 当前问题分析

### 问题1: 两套独立配色系统

| 系统 | 文件 | 用途 |
|------|------|------|
| `storyThemes` | `src/theme/storyThemes.ts` | 4种书籍类型主题 |
| `CARD_STYLES` | `src/types/styles.ts` | 10种卡牌风格 |

两套系统完全独立，导致：
- 书架页使用本地 `TYPE_COLORS`，与 `storyThemes` 不一致
- 书籍详情页颜色硬编码，未使用主题系统
- 故事导演页使用 `CARD_STYLES`，与书籍类型无关

### 问题2: 卡牌尺寸不统一

| 页面 | 当前尺寸 | 期望尺寸 |
|------|----------|----------|
| 故事导演页 | 80×100 | 80×100 (选择区) |
| 书籍详情页 | 80×100 | 160×200 (展示区，两倍) |

### 问题3: 配色不舒适

- 颜色饱和度过高，刺眼
- 对比度过强
- 缺乏渐变和磨玻璃效果

## 设计方案

### 1. 统一配色系统架构

**原则**: 以书籍类型为主，卡牌风格自动映射

```
书籍类型 (storyThemes)          映射卡牌风格 (CARD_STYLES)
├── children (儿童探险)    →    CARTOON (卡通)
├── magic (魔法世界)       →    CRYSTAL (水晶)
├── urban (都市职场)       →    CLASSIC (经典)
└── mechanical (机械帝国)  →    CYBERPUNK (赛博朋克)
```

### 2. 舒适配色方案

#### children (儿童探险) - 柔和暖阳

```typescript
{
  id: 'children',
  name: '儿童探险',
  colors: {
    primary: '#FB923C',
    secondary: '#FBBF24',
    cta: '#F87171',
    background: '#FFFDF7',
    backgroundGradient: ['#FFFDF7', '#FFFBEB', '#FEF7E6'],
    primaryGradient: ['#FB923C', '#FBBF24'],
    ctaGradient: ['#F87171', '#FB923C'],
    text: '#92400E',
    textSecondary: '#B45309',
    border: 'rgba(251, 191, 36, 0.25)',
    card: 'rgba(255, 255, 255, 0.9)',
    accent: '#FBBF24',
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderColor: 'rgba(251, 191, 36, 0.25)',
    blur: 12,
    shadowColor: 'rgba(251, 146, 60, 0.12)',
  },
  style: {
    borderRadius: 16,
    cardStyle: 'playful',
  },
}
```

#### magic (魔法世界) - 梦幻紫罗兰

```typescript
{
  id: 'magic',
  name: '魔法世界',
  colors: {
    primary: '#A78BFA',
    secondary: '#C4B5FD',
    cta: '#F9A8D4',
    background: '#1E1B4B',
    backgroundGradient: ['#1E1B4B', '#2D2867', '#3D3683'],
    primaryGradient: ['#A78BFA', '#C4B5FD'],
    ctaGradient: ['#F9A8D4', '#FBCFE8'],
    text: '#EDE9FE',
    textSecondary: '#C4B5FD',
    border: 'rgba(167, 139, 250, 0.35)',
    card: 'rgba(67, 56, 202, 0.6)',
    accent: '#C4B5FD',
  },
  glassEffect: {
    backgroundColor: 'rgba(67, 56, 202, 0.5)',
    borderColor: 'rgba(167, 139, 250, 0.35)',
    blur: 18,
    shadowColor: 'rgba(167, 139, 250, 0.2)',
  },
  style: {
    borderRadius: 12,
    cardStyle: 'mystical',
  },
}
```

#### urban (都市职场) - 清新天空

```typescript
{
  id: 'urban',
  name: '都市职场',
  colors: {
    primary: '#60A5FA',
    secondary: '#93C5FD',
    cta: '#6EE7B7',
    background: '#F8FAFC',
    backgroundGradient: ['#F8FAFC', '#F1F5F9', '#E8EEF4'],
    primaryGradient: ['#60A5FA', '#93C5FD'],
    ctaGradient: ['#6EE7B7', '#A7F3D0'],
    text: '#475569',
    textSecondary: '#64748B',
    border: 'rgba(148, 163, 184, 0.2)',
    card: 'rgba(255, 255, 255, 0.92)',
    accent: '#93C5FD',
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderColor: 'rgba(148, 163, 184, 0.2)',
    blur: 14,
    shadowColor: 'rgba(96, 165, 250, 0.1)',
  },
  style: {
    borderRadius: 8,
    cardStyle: 'professional',
  },
}
```

#### mechanical (机械帝国) - 星际蓝光

```typescript
{
  id: 'mechanical',
  name: '机械帝国',
  colors: {
    primary: '#67E8F9',
    secondary: '#A5F3FC',
    cta: '#A78BFA',
    background: '#0F172A',
    backgroundGradient: ['#0F172A', '#1E293B', '#283548'],
    primaryGradient: ['#67E8F9', '#A5F3FC'],
    ctaGradient: ['#A78BFA', '#C4B5FD'],
    text: '#E2E8F0',
    textSecondary: '#94A3B8',
    border: 'rgba(103, 232, 249, 0.3)',
    card: 'rgba(51, 65, 85, 0.65)',
    accent: '#A5F3FC',
  },
  glassEffect: {
    backgroundColor: 'rgba(51, 65, 85, 0.55)',
    borderColor: 'rgba(103, 232, 249, 0.3)',
    blur: 18,
    shadowColor: 'rgba(103, 232, 249, 0.15)',
  },
  style: {
    borderRadius: 4,
    cardStyle: 'tech',
  },
}
```

### 3. 卡牌尺寸规范

| 页面 | 宽度 | 高度 | 用途 |
|------|------|------|------|
| 故事导演页 | 80 | 100 | 选择区，便于点击 |
| 书籍详情页 | 160 | 200 | 展示区，两倍大小 |

### 4. 配色应用规范

| 元素 | 配色属性 | 说明 |
|------|----------|------|
| 页面背景 | `backgroundGradient` | 纵向渐变 |
| 导航栏 | `primaryGradient` | 横向渐变 + 磨玻璃 |
| 主按钮 | `primaryGradient` | 横向渐变 |
| CTA按钮 | `ctaGradient` | 横向渐变 |
| 卡牌背景 | `card` + `glassEffect` | 磨玻璃效果 |
| 主要文字 | `text` | 标题、重要信息 |
| 次要文字 | `textSecondary` | 描述、辅助信息 |
| 边框 | `border` | 半透明 |
| 强调色 | `accent` | 图标、高亮 |

### 5. 磨玻璃效果实现

```typescript
const getGlassStyle = (theme: Theme) => ({
  backgroundColor: theme.glassEffect.backgroundColor,
  borderWidth: 1,
  borderColor: theme.glassEffect.borderColor,
  shadowColor: theme.glassEffect.shadowColor,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 1,
  shadowRadius: theme.glassEffect.blur,
  elevation: 8,
});
```

## 实施计划

### 阶段1: 更新主题配置

1. 更新 `src/theme/storyThemes.ts` - 添加渐变和磨玻璃配置
2. 更新 `src/theme/index.ts` - 添加渐变和磨玻璃获取函数
3. 创建 `src/theme/cardStyleMapping.ts` - 书籍类型到卡牌风格的映射

### 阶段2: 更新各页面

1. **书架页 (BookshelfDemo.tsx)**
   - 移除本地 `TYPE_COLORS`
   - 使用 `getThemeColors()` 获取配色
   - 应用渐变背景

2. **书籍详情页 (BookDetailDemo.tsx)**
   - 使用主题系统配色
   - 卡牌尺寸调整为 160×200
   - 应用磨玻璃效果

3. **故事导演页 (StoryDirectorDemo.tsx)**
   - 根据书籍类型自动选择卡牌风格
   - 保持卡牌尺寸 80×100
   - 应用磨玻璃效果

### 阶段3: 统一按钮样式

1. 创建 `src/components/ThemedButton.tsx` - 统一按钮组件
2. 创建 `src/components/ThemedCard.tsx` - 统一卡牌组件
3. 各页面使用统一组件

## 验收标准

- [ ] 所有页面使用统一的主题配色
- [ ] 按钮颜色统一，符合书籍类型
- [ ] 卡牌样式统一，符合书籍类型
- [ ] 卡牌尺寸符合规范
- [ ] 渐变效果正确应用
- [ ] 磨玻璃效果正确应用
- [ ] 配色舒适，不刺眼
