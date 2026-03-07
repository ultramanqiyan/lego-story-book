# UI配色统一实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** 统一LEGO Story应用的UI配色，实现按钮、背景、卡牌样式统一，添加渐变和磨玻璃效果。

**Architecture:** 以书籍类型为主，卡牌风格自动映射。更新主题配置文件，创建统一组件，更新各页面使用统一配色。

**Tech Stack:** React Native, TypeScript, Expo

---

## Task 1: 更新主题配置文件

**Files:**
- Modify: `src/theme/storyThemes.ts`

**Step 1: 更新 storyThemes.ts 配置**

添加渐变和磨玻璃效果配置：

```typescript
export const storyThemes = {
  children: {
    id: 'children',
    name: '儿童探险',
    description: '适合儿童的冒险故事',
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
      cardBorder: 'rgba(251, 191, 36, 0.3)',
      accent: '#FBBF24',
    },
    glassEffect: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderColor: 'rgba(251, 191, 36, 0.25)',
      blur: 12,
      shadowColor: 'rgba(251, 146, 60, 0.12)',
    },
    typography: {
      fontFamily: 'Fredoka',
      titleSize: 24,
      bodySize: 16,
    },
    style: {
      borderRadius: 16,
      cardStyle: 'playful',
    },
  },
  magic: {
    id: 'magic',
    name: '魔法世界',
    description: '魔法奇幻故事',
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
      cardBorder: 'rgba(167, 139, 250, 0.4)',
      accent: '#C4B5FD',
    },
    glassEffect: {
      backgroundColor: 'rgba(67, 56, 202, 0.5)',
      borderColor: 'rgba(167, 139, 250, 0.35)',
      blur: 18,
      shadowColor: 'rgba(167, 139, 250, 0.2)',
    },
    typography: {
      fontFamily: 'Cinzel',
      titleSize: 24,
      bodySize: 16,
    },
    style: {
      borderRadius: 12,
      cardStyle: 'mystical',
    },
  },
  urban: {
    id: 'urban',
    name: '都市职场',
    description: '现代都市故事',
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
      cardBorder: 'rgba(148, 163, 184, 0.25)',
      accent: '#93C5FD',
    },
    glassEffect: {
      backgroundColor: 'rgba(255, 255, 255, 0.88)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
      blur: 14,
      shadowColor: 'rgba(96, 165, 250, 0.1)',
    },
    typography: {
      fontFamily: 'Inter',
      titleSize: 22,
      bodySize: 16,
    },
    style: {
      borderRadius: 8,
      cardStyle: 'professional',
    },
  },
  mechanical: {
    id: 'mechanical',
    name: '机械帝国',
    description: '科幻机械故事',
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
      cardBorder: 'rgba(103, 232, 249, 0.35)',
      accent: '#A5F3FC',
    },
    glassEffect: {
      backgroundColor: 'rgba(51, 65, 85, 0.55)',
      borderColor: 'rgba(103, 232, 249, 0.3)',
      blur: 18,
      shadowColor: 'rgba(103, 232, 249, 0.15)',
    },
    typography: {
      fontFamily: 'Orbitron',
      titleSize: 22,
      bodySize: 15,
    },
    style: {
      borderRadius: 4,
      cardStyle: 'tech',
    },
  },
};

export const getTheme = (typeId: string) => {
  return storyThemes[typeId] || storyThemes.magic;
};

export const getThemeColors = (typeId: string) => {
  const theme = getTheme(typeId);
  return theme.colors;
};

export const getThemeStyle = (typeId: string) => {
  const theme = getTheme(typeId);
  return theme.style;
};

export const getGlassEffect = (typeId: string) => {
  const theme = getTheme(typeId);
  return theme.glassEffect;
};

export default storyThemes;
```

**Step 2: 验证TypeScript编译**

Run: `npx tsc --noEmit src/theme/storyThemes.ts`
Expected: No errors

**Step 3: Commit**

```bash
git add src/theme/storyThemes.ts
git commit -m "feat: 更新主题配置，添加渐变和磨玻璃效果"
```

---

## Task 2: 更新主题工具函数

**Files:**
- Modify: `src/theme/index.ts`

**Step 1: 添加新的工具函数**

```typescript
import storyThemes, { getTheme, getThemeColors, getThemeStyle, getGlassEffect } from './storyThemes';

export const getThemeTypography = (typeId: string) => {
  const theme = getTheme(typeId);
  return theme.typography;
};

export const getAllThemes = () => {
  return Object.values(storyThemes);
};

export const getThemeGradient = (typeId: string) => {
  const colors = getThemeColors(typeId);
  return colors.backgroundGradient;
};

export const getCardStyle = (typeId: string) => {
  const theme = getTheme(typeId);
  const { colors, style, glassEffect } = theme;
  
  return {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
    borderRadius: style.borderRadius,
    shadowColor: glassEffect.shadowColor,
    shadowOpacity: 1,
    shadowRadius: glassEffect.blur,
  };
};

export const getGlassStyle = (typeId: string) => {
  const theme = getTheme(typeId);
  const { glassEffect } = theme;
  
  return {
    backgroundColor: glassEffect.backgroundColor,
    borderWidth: 1,
    borderColor: glassEffect.borderColor,
    shadowColor: glassEffect.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: glassEffect.blur,
    elevation: 8,
  };
};

export const getButtonGradient = (typeId: string, variant: 'primary' | 'cta' = 'primary') => {
  const colors = getThemeColors(typeId);
  return variant === 'primary' ? colors.primaryGradient : colors.ctaGradient;
};

export default {
  getThemeColors,
  getTheme,
  getThemeStyle,
  getThemeTypography,
  getAllThemes,
  getThemeGradient,
  getCardStyle,
  getGlassEffect,
  getGlassStyle,
  getButtonGradient,
};
```

**Step 2: Commit**

```bash
git add src/theme/index.ts
git commit -m "feat: 添加渐变和磨玻璃工具函数"
```

---

## Task 3: 创建卡牌风格映射

**Files:**
- Create: `src/theme/cardStyleMapping.ts`

**Step 1: 创建映射文件**

```typescript
import { CardStyleType } from '../types/styles';

export const BOOK_TYPE_TO_CARD_STYLE: Record<string, CardStyleType> = {
  children: CardStyleType.CARTOON,
  magic: CardStyleType.CRYSTAL,
  urban: CardStyleType.CLASSIC,
  mechanical: CardStyleType.CYBERPUNK,
};

export const getCardStyleForBookType = (bookType: string): CardStyleType => {
  return BOOK_TYPE_TO_CARD_STYLE[bookType] || CardStyleType.CLASSIC;
};

export default BOOK_TYPE_TO_CARD_STYLE;
```

**Step 2: Commit**

```bash
git add src/theme/cardStyleMapping.ts
git commit -m "feat: 添加书籍类型到卡牌风格的映射"
```

---

## Task 4: 更新书架页配色

**Files:**
- Modify: `src/screens/BookshelfDemo.tsx`

**Step 1: 移除本地 TYPE_COLORS，使用主题系统**

找到 `TYPE_COLORS` 定义，替换为使用 `getThemeColors`：

```typescript
import { getThemeColors, getGlassStyle } from '../theme';

// 移除 TYPE_COLORS 本地定义

// 在组件中使用
const themeColors = getThemeColors(bookType);
const glassStyle = getGlassStyle(bookType);
```

**Step 2: 更新样式使用主题配色**

更新 StyleSheet 中的硬编码颜色，使用主题颜色。

**Step 3: Commit**

```bash
git add src/screens/BookshelfDemo.tsx
git commit -m "feat: 书架页使用统一主题配色"
```

---

## Task 5: 更新书籍详情页配色

**Files:**
- Modify: `src/screens/BookDetailDemo.tsx`

**Step 1: 导入主题工具函数**

```typescript
import { getThemeColors, getGlassStyle, getCardStyle } from '../theme';
```

**Step 2: 更新卡牌尺寸为 160×200**

找到卡牌样式定义，更新尺寸：

```typescript
const CARD_WIDTH = 160;
const CARD_HEIGHT = 200;
```

**Step 3: 应用磨玻璃效果**

使用 `getGlassStyle()` 获取磨玻璃样式。

**Step 4: Commit**

```bash
git add src/screens/BookDetailDemo.tsx
git commit -m "feat: 书籍详情页使用统一主题配色，卡牌尺寸调整为160×200"
```

---

## Task 6: 更新故事导演页配色

**Files:**
- Modify: `src/screens/StoryDirectorDemo.tsx`

**Step 1: 导入卡牌风格映射**

```typescript
import { getCardStyleForBookType } from '../theme/cardStyleMapping';
import { getThemeColors, getGlassStyle } from '../theme';
```

**Step 2: 根据书籍类型自动选择卡牌风格**

```typescript
const cardStyle = getCardStyleForBookType(bookType);
const styleConfig = CARD_STYLES[cardStyle];
```

**Step 3: 保持卡牌尺寸 80×100**

确保卡牌尺寸不变。

**Step 4: 应用磨玻璃效果**

使用 `getGlassStyle()` 获取磨玻璃样式。

**Step 5: Commit**

```bash
git add src/screens/StoryDirectorDemo.tsx
git commit -m "feat: 故事导演页根据书籍类型自动选择卡牌风格"
```

---

## Task 7: 验证和测试

**Step 1: 运行Metro热更新**

Run: `npx expo start`

**Step 2: 在模拟器中验证**

- 检查书架页配色是否正确
- 检查书籍详情页卡牌尺寸是否为两倍
- 检查故事导演页卡牌风格是否与书籍类型匹配
- 检查渐变效果是否正确
- 检查磨玻璃效果是否正确

**Step 3: 最终Commit**

```bash
git add -A
git commit -m "feat: UI配色统一完成"
git push origin main
```
