# 炉石传说风格卡牌游戏实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 完全重写炉石传说风格卡牌对战游戏，使用React Three Fiber实现3D渲染，优先实现交互功能

**Architecture:** 
- 使用React Three Fiber实现3D卡牌和战场
- 使用React Context管理游戏状态
- 使用PanResponder实现拖拽交互
- 集成详细日志系统用于调试

**Tech Stack:** 
- React Native + Expo SDK 51
- React Three Fiber (@react-three/fiber, @react-three/drei)
- React Native Gesture Handler
- TypeScript

---

## Task 1: 安装依赖

**Files:**
- Modify: `package.json`

**Step 1: 安装React Three Fiber相关依赖**

```bash
cd c:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile\lego-demo
npx expo install @react-three/fiber @react-three/drei three
```

**Step 2: 安装类型定义**

```bash
npm install --save-dev @types/three
```

**Step 3: 验证安装**

```bash
npm list @react-three/fiber @react-three/drei three
```

---

## Task 2: 创建类型定义

**Files:**
- Create: `src/types/game.ts`

**Step 1: 创建游戏类型定义**

```typescript
export enum CardType {
  MINION = 'MINION',
  SPELL = 'SPELL',
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  cost: number;
  attack?: number;
  health?: number;
  description: string;
}

export interface Minion {
  id: string;
  cardId: string;
  name: string;
  attack: number;
  health: number;
  maxHealth: number;
  canAttack: boolean;
  position: number;
}

export interface Hero {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
}

export interface Player {
  id: string;
  hero: Hero;
  mana: number;
  maxMana: number;
  hand: Card[];
  minions: Minion[];
  deckCount: number;
}

export interface GameState {
  player: Player;
  opponent: Player;
  currentTurn: 'player' | 'opponent';
  turnNumber: number;
  phase: 'IDLE' | 'SELECTING_ATTACKER' | 'SELECTING_TARGET';
  selectedMinionId: string | null;
  gameOver: boolean;
  winner?: 'player' | 'opponent';
}

export interface Position {
  x: number;
  y: number;
}

export interface DragState {
  isDragging: boolean;
  cardId: string | null;
  position: Position;
}
```

---

## Task 3: 创建日志系统

**Files:**
- Create: `src/utils/GameLogger.ts`

**Step 1: 创建日志工具**

```typescript
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class GameLogger {
  private enabled: boolean = true;
  private prefix: string = '[Hearthstone]';

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `${this.prefix}[${timestamp}][${level.toUpperCase()}] ${message}${dataStr}`;
  }

  info(message: string, data?: any): void {
    if (!this.enabled) return;
    console.log(this.formatMessage('info', message, data));
  }

  warn(message: string, data?: any): void {
    if (!this.enabled) return;
    console.warn(this.formatMessage('warn', message, data));
  }

  error(message: string, data?: any): void {
    if (!this.enabled) return;
    console.error(this.formatMessage('error', message, data));
  }

  debug(message: string, data?: any): void {
    if (!this.enabled) return;
    console.debug(this.formatMessage('debug', message, data));
  }

  logInteraction(action: string, data?: any): void {
    this.info(`[交互] ${action}`, data);
  }

  logGameState(state: string, data?: any): void {
    this.info(`[状态] ${state}`, data);
  }

  logAnimation(type: string, target: string): void {
    this.debug(`[动画] ${type} -> ${target}`);
  }
}

export const logger = new GameLogger();
export default logger;
```

---

## Task 4: 创建游戏状态管理

**Files:**
- Create: `src/context/GameContext.tsx`

**Step 1: 创建游戏Context**

实现完整的游戏状态管理，包括：
- 初始状态
- 打出卡牌
- 随从攻击
- 回合切换
- 选择攻击者/目标

---

## Task 5: 创建3D卡牌组件

**Files:**
- Create: `src/components/three/Card3D.tsx`

**Step 1: 创建3D卡牌组件**

使用React Three Fiber创建3D卡牌：
- 卡牌几何体
- 材质和纹理
- 悬停效果
- 拖拽支持

---

## Task 6: 创建3D随从组件

**Files:**
- Create: `src/components/three/Minion3D.tsx`

**Step 1: 创建3D随从组件**

实现：
- 随从模型
- 攻击动画
- 受伤效果
- 可攻击状态发光

---

## Task 7: 创建战场场景

**Files:**
- Create: `src/components/three/Battlefield3D.tsx`

**Step 1: 创建3D战场场景**

实现：
- 战场布局
- 英雄位置
- 随从区域
- 手牌区域

---

## Task 8: 创建交互系统

**Files:**
- Create: `src/interaction/DragManager.ts`
- Create: `src/interaction/AttackManager.ts`

**Step 1: 创建拖拽管理器**

**Step 2: 创建攻击管理器**

---

## Task 9: 创建主应用

**Files:**
- Modify: `App.tsx`

**Step 1: 重写App.tsx**

整合所有组件，实现完整游戏流程。

---

## Task 10: 测试和调试

**Step 1: 启动开发服务器**

```bash
npx expo start
```

**Step 2: 测试Android**

```bash
npx expo start --android
```

**Step 3: 检查日志输出**

---

*计划创建时间: 2026-03-04*
