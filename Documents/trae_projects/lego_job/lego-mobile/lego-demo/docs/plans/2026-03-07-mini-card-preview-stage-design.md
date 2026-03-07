# 迷你卡牌预览舞台设计文档

## 一、概述

### 1.1 目标

在 StoryDirectorDemo 中新增一个 `mini-card-preview` 舞台风格，作为默认舞台风格，展示：
- 迷你卡牌布局（居中、大尺寸）
- 空槽位显示（虚线边框 + 必选标识）
- 故事预览文本
- 顶部颜色条区分元素类型

### 1.2 来源

参考 `lego-mobile/src/components/story/StagePreview.js` 的设计理念。

## 二、UI 布局设计

### 2.1 整体布局

```
┌─────────────────────────────────────────────────────────────┐
│  ← 故事导演台                              [舞台风格] 按钮   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  👤 角色（可滚动选择区，80×100 卡牌）                        │
│  🎯 冒险类型（可滚动选择区，80×100 卡牌）                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              🎭 舞台预览（迷你卡牌预览风格）           │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  👥 角色                                            │   │
│  │         ┌────────┐ ┌────────┐ ┌────────┐            │   │
│  │         │▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓│            │   │
│  │         │   🧙   │ │   🧝   │ │   👹   │            │   │
│  │         │  小明  │ │  小红  │ │  黑暗  │            │   │
│  │         │   ×    │ │   ×    │ │   ×    │            │   │
│  │         └────────┘ └────────┘ └────────┘            │   │
│  │          主角       配角       反派                  │   │
│  │                                                     │   │
│  │  🌍 场景                                            │   │
│  │         ┌────────┐ ┌────────┐ ┌────────┐            │   │
│  │         │▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓│ │▓▓▓▓▓▓▓▓│            │   │
│  │         │   🌲   │ │   ☀️   │ │   🗺️   │            │   │
│  │         │  森林  │ │  晴天  │ │  探索  │            │   │
│  │         │   ×    │ │        │ │        │            │   │
│  │         └────────┘ └────────┘ └────────┘            │   │
│  │          地形       天气       冒险                  │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ 📖 小明与小红，对抗黑暗魔王，在神秘森林中...  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🌤️ 天气（可滚动选择区）                                    │
│  🏔️ 地形（可滚动选择区）                                    │
│  🎒 装备（可滚动选择区）                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│           ┌─────────────────────────────────┐              │
│           │      🚀 开始导演故事             │              │
│           └─────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 卡牌尺寸

| 区域 | 卡牌尺寸 | 说明 |
|------|----------|------|
| 选择区 | 80×100 | 大卡牌，便于点击选择 |
| 舞台预览区 | 70×90 | 迷你卡牌，紧凑展示已选内容 |

### 2.3 颜色映射

| 元素类型 | 顶部颜色条 | 边框颜色 | 十六进制 |
|----------|------------|----------|----------|
| 主角 | 金色 | 金色 | #FFD700 |
| 配角 | 银色 | 银色 | #C0C0C0 |
| 反派 | 红色 | 红色 | #EF4444 |
| 地形 | 绿色 | 绿色 | #22C55E |
| 天气 | 蓝色 | 蓝色 | #3B82F6 |
| 冒险 | 紫色 | 紫色 | #8B5CF6 |
| 装备 | 橙色 | 橙色 | #F59E0B |

## 三、组件设计

### 3.1 新增舞台风格类型

```typescript
type StageStyleType = 
  | 'mini-card-preview'  // 新增：迷你卡牌预览（默认）
  | '3d-perspective' 
  | 'battle-arena' 
  | 'immersive-scene'
  | 'pixel-art'
  | 'glassmorphism'
  | 'carousel-wheel'
  | 'side-scroller';
```

### 3.2 迷你卡牌组件

```typescript
interface MiniCardProps {
  emoji: string;
  name: string;
  type: 'protagonist' | 'supporting' | 'antagonist' | 'terrain' | 'weather' | 'adventure' | 'equipment';
  onRemove?: () => void;
}

// 尺寸：70×90
// 顶部颜色条：根据 type 显示对应颜色
// 移除按钮：右上角 × 按钮
```

### 3.3 空槽位组件

```typescript
interface EmptySlotProps {
  icon: string;
  label: string;
  required?: boolean;
}

// 虚线边框
// 居中显示图标和标签
// 必选项显示"必选"标识
```

### 3.4 故事预览文本

```typescript
const getPreviewText = () => {
  // 根据选中的元素生成故事概要
  // 示例：「小明与小红，对抗黑暗魔王，在神秘森林中...」
};
```

## 四、实现步骤

### 4.1 修改 StoryDirectorDemo.tsx

1. 添加 `'mini-card-preview'` 到 `StageStyleType`
2. 添加 `renderMiniCardPreview()` 函数
3. 实现 `renderMiniCard()` - 迷你卡牌渲染
4. 实现 `renderEmptySlot()` - 空槽位渲染
5. 实现 `getPreviewText()` - 故事预览文本
6. 添加对应的样式定义
7. 将默认舞台风格改为 `'mini-card-preview'`

### 4.2 样式定义

```typescript
const styles = StyleSheet.create({
  // 舞台预览容器
  miniPreviewContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  
  // 迷你卡牌
  miniCard: {
    width: 70,
    height: 90,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 30, 50, 0.9)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // 顶部颜色条
  miniCardTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  
  // 空槽位
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
  
  // 故事预览文本
  previewTextContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
});
```

## 五、测试验证

### 5.1 手动测试

1. 启动 APP，进入故事导演台
2. 验证默认舞台风格为 `mini-card-preview`
3. 验证空槽位显示正确
4. 选择角色、冒险、天气、地形、装备
5. 验证迷你卡牌显示正确
6. 验证故事预览文本生成正确
7. 点击移除按钮，验证卡牌移除

### 5.2 Appium E2E 测试

参考 `appium-director-test.js` 进行端到端测试验证。

## 六、相关文件

| 文件 | 说明 |
|------|------|
| `src/screens/StoryDirectorDemo.tsx` | 主要修改文件 |
| `lego-mobile/src/components/story/StagePreview.js` | 参考设计来源 |

## 七、修改记录

| 日期 | 修改内容 |
|------|----------|
| 2026-03-07 | 初始设计文档 |
