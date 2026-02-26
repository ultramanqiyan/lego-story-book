# 桌游风格UI设计规范

## 1. 项目概述

### 1.1 目标
为乐高故事书项目的所有页面创建桌游风格（Tabletop Style）的UI设计Demo，参考《炉石传说》和《三国杀》的卡牌游戏视觉风格。

### 1.2 设计参考
- **参考文件**: `design-mockups/tabletop-book-demo.html`
- **设计灵感**: 炉石传说卡牌、三国杀游戏界面
- **核心风格**: 暗色主题 + 金色点缀 + 卡牌式布局

## 2. 设计系统

### 2.1 色彩系统

```css
:root {
    /* 主色调 */
    --gold: #ffd700;           /* 金色 - 主强调色 */
    --gold-dark: #b8860b;      /* 深金色 */
    --silver: #c0c0c0;         /* 银色 */
    --bronze: #cd7f32;         /* 铜色 */
    
    /* 功能色 */
    --crimson: #dc2626;        /* 红色 - 危险/反派 */
    --purple: #a855f7;         /* 紫色 - 魔法/冒险 */
    --green: #22c55e;          /* 绿色 - 成功/自然 */
    --blue: #3b82f6;           /* 蓝色 - 信息/水 */
    --orange: #f59e0b;         /* 橙色 - 警告/道具 */
    
    /* 背景色 */
    --bg-dark: #0d0d14;        /* 最深背景 */
    --bg-medium: #1a1a2e;      /* 中等背景 */
    --bg-light: #2d2d44;       /* 浅背景 */
    
    /* 文字色 */
    --text-primary: #f8fafc;   /* 主要文字 */
    --text-secondary: #94a3b8; /* 次要文字 */
}
```

### 2.2 字体系统

```css
:root {
    --font-title: 'Cinzel', serif;        /* 标题字体 - 古典感 */
    --font-body: 'Noto Sans SC', sans-serif; /* 正文字体 */
}
```

### 2.3 卡牌系统

#### 卡牌尺寸
- **标准卡牌**: 90px × 125px
- **小卡牌**: 70px × 100px
- **大卡牌**: 120px × 168px

#### 卡牌边框颜色（按角色类型）
| 类型 | 边框颜色 | 光晕效果 |
|------|----------|----------|
| 主角 | --gold | 金色光晕 |
| 反派 | --crimson | 红色光晕 |
| 配角 | --silver | 银色光晕 |
| 路人 | #6b7280 | 灰色光晕 |
| 冒险 | --purple | 紫色光晕 |
| 地形 | --green | 绿色光晕 |
| 天气 | --blue | 蓝色光晕 |
| 道具 | --orange | 橙色光晕 |

#### 卡牌悬停效果
```css
.hs-card:hover {
    transform: translateY(-10px) scale(1.1);
    z-index: 100;
    box-shadow: 0 15px 30px rgba(0,0,0,0.5), 0 0 20px rgba(255,215,0,0.3);
}
```

### 2.4 动画效果

#### 粒子效果
- 金色粒子漂浮动画
- 20秒循环，从下往上飘动

#### 卡牌动画
- **悬停**: 上浮 + 放大 + 光晕
- **选中**: 心跳动画 + 边框旋转
- **入场**: 卡牌弹出动画

#### 按钮动画
- **脉冲**: 金色光晕脉冲
- **悬停**: 缩放1.05倍

### 2.5 布局系统

#### 页面结构
```
┌─────────────────────────────────────────┐
│              Header (50px)              │
├──────────┬─────────────────┬────────────┤
│          │                 │            │
│  Left    │    Center       │   Right    │
│  Panel   │    Panel        │   Panel    │
│  (420px) │    (flex:1)     │   (420px)  │
│          │                 │            │
├──────────┴─────────────────┴────────────┤
│            Bottom Bar (50px)            │
└─────────────────────────────────────────┘
```

#### 响应式断点
- **桌面**: > 1200px - 三栏布局
- **平板**: 900px - 1200px - 侧边栏变窄
- **手机**: < 900px - 单栏堆叠布局

## 3. 页面设计规范

### 3.1 首页 (index.html → index-demo.html)

**设计要点**:
- 全屏暗色背景 + 粒子效果
- 中央大标题使用金色渐变
- 功能入口以卡牌形式展示
- 热门角色和最近故事使用卡牌网格

**组件**:
- 主标题: 金色渐变 + 光晕效果
- 导航卡牌: 3D翻转效果
- 角色卡牌: 炉石风格小卡
- 故事卡牌: 书籍封面样式

### 3.2 登录页 (login.html → login-demo.html)

**设计要点**:
- 居中登录卡片
- 魔法书/卷轴风格的表单
- 乐高积木加载动画
- 金色边框和装饰

**组件**:
- 登录表单卡片
- 输入框: 金色边框 + 光晕聚焦
- 提交按钮: 金色渐变 + 脉冲动画

### 3.3 书架页 (bookshelf.html → bookshelf-demo.html)

**设计要点**:
- 书籍以卡牌堆叠形式展示
- 悬停展开扇形效果
- 3D书籍封面
- 章节数和字数以宝石图标展示

**组件**:
- 书籍卡牌堆叠容器
- 单本书籍卡牌
- 添加新书按钮（虚线边框）

### 3.4 书籍详情页 (book.html → book-demo.html)

**设计要点**:
- 三栏布局：章节列表 | 故事内容 | 角色卡牌
- 章节以任务卡形式展示
- 角色以炉石卡牌形式展示
- 故事内容区域有关键词高亮

**组件**:
- 章节任务卡
- 角色炉石卡牌
- 故事内容面板
- 情节选择弹窗

### 3.5 冒险模式 (adventure.html → adventure-demo.html)

**设计要点**:
- 故事阅读区 + 谜题挑战区
- 时间显示以沙漏/宝石形式
- 谜题选项以卡牌形式
- 正确/错误反馈动画

**组件**:
- 时间显示面板
- 故事内容区
- 谜题选项卡牌
- 结果反馈动画

### 3.6 角色管理 (characters.html → characters-demo.html)

**设计要点**:
- 预设角色和用户角色分区
- 角色以炉石卡牌形式展示
- 创建/编辑弹窗以魔法书风格
- 角色属性以宝石图标展示

**组件**:
- 角色卡牌网格
- 创建角色弹窗
- 编辑角色弹窗
- 删除确认弹窗

### 3.7 创建故事 (story-create.html → story-create-demo.html)

**设计要点**:
- 步骤指示器以任务进度形式
- 书籍选择以卡牌形式
- 故事类型以冒险卡牌形式
- 角色选择以炉石卡牌形式

**组件**:
- 步骤进度指示器
- 书籍选择卡牌
- 故事类型卡牌
- 角色选择卡牌
- 已选角色列表

### 3.8 分享页 (share.html → share-demo.html)

**设计要点**:
- 分享链接生成以魔法卷轴形式
- 二维码以金色边框装饰
- 分享码以大号字体展示
- 访问分享以传送门风格

**组件**:
- 分享设置卡片
- 二维码展示
- 分享链接输入框
- 访问分享表单

### 3.9 家长控制 (parent.html → parent-demo.html)

**设计要点**:
- 时间设置以时钟/沙漏形式
- 阅读记录以图表形式
- 账号管理以设置面板形式

**组件**:
- 时间显示面板
- 时间限制设置
- 阅读记录图表
- 账号管理卡片

### 3.10 主题选择 (theme-selector.html → theme-selector-demo.html)

**设计要点**:
- 主题以大卡牌形式展示
- 悬停预览效果
- 选中状态以金色边框标识
- 实时预览区域

**组件**:
- 主题选择卡牌
- 预览区域
- 应用按钮

### 3.11 故事导演台 (story-director.html → story-director-demo.html)

**设计要点**:
- 已有桌游风格，保持现有设计
- 卡牌扇形展开
- 天气特效系统
- 舞台预览区域

**组件**:
- 角色卡牌扇形
- 冒险/地形/天气卡牌
- 舞台预览网格
- 生成按钮

## 4. 通用组件规范

### 4.1 按钮

```css
/* 主要按钮 */
.btn-primary {
    background: linear-gradient(135deg, var(--gold), #ff9800);
    color: #000;
    border-radius: 20px;
    box-shadow: 0 0 25px rgba(255,215,0,0.5);
}

/* 次要按钮 */
.btn-secondary {
    background: transparent;
    border: 2px solid var(--text-secondary);
    color: var(--text-secondary);
}

/* 危险按钮 */
.btn-danger {
    background: linear-gradient(135deg, var(--crimson), #dc2626);
    color: white;
}
```

### 4.2 输入框

```css
.input-glow {
    background: rgba(0,0,0,0.3);
    border: 2px solid rgba(255,215,0,0.3);
    border-radius: 10px;
    color: var(--text-primary);
}

.input-glow:focus {
    border-color: var(--gold);
    box-shadow: 0 0 15px rgba(255,215,0,0.3);
}
```

### 4.3 卡片

```css
.card {
    background: linear-gradient(180deg, #2d2d44, #1a1a2e);
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}
```

### 4.4 弹窗

```css
.modal {
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    background: linear-gradient(180deg, #2d2d44, #1a1a2e);
    border: 3px solid var(--gold);
    border-radius: 15px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}
```

### 4.5 Toast提示

```css
.toast {
    background: rgba(0,0,0,0.95);
    border: 1px solid var(--gold);
    border-radius: 8px;
    color: var(--text-primary);
}
```

## 5. 天气特效系统

### 5.1 晴天
- 太阳光晕
- 光线射束
- 温暖色调

### 5.2 下雨
- 雨滴下落动画
- 灰暗色调

### 5.3 雷暴
- 闪电闪烁
- 暴雨效果

### 5.4 下雪
- 雪花飘落
- 白色粒子

### 5.5 大雾
- 雾气弥漫
- 能见度降低

### 5.6 狂风
- 风粒子横向移动
- 动态模糊

### 5.7 彩虹
- 彩虹渐变
- 七色光晕

### 5.8 星夜
- 星星闪烁
- 深蓝背景

## 6. 文件输出位置

所有Demo文件将输出到: `design-mockups/` 目录

### 文件命名规范
- `index-demo.html` - 首页Demo
- `login-demo.html` - 登录页Demo
- `bookshelf-demo.html` - 书架页Demo
- `book-demo.html` - 书籍详情Demo
- `adventure-demo.html` - 冒险模式Demo
- `characters-demo.html` - 角色管理Demo
- `story-create-demo.html` - 创建故事Demo
- `share-demo.html` - 分享页Demo
- `parent-demo.html` - 家长控制Demo
- `theme-selector-demo.html` - 主题选择Demo
- `story-director-demo.html` - 故事导演Demo（已有，可优化）

## 7. 注意事项

1. **不修改现有项目文件** - 所有Demo都是独立文件
2. **保持功能一致性** - Demo应展示与原页面相同的功能结构
3. **静态数据** - Demo使用模拟数据，不连接真实API
4. **完整CSS** - 每个Demo文件包含完整的内联样式
5. **响应式设计** - 所有Demo支持移动端适配
