# 书籍详情页桌游风格改造规格

## 概述
将 `book.html` 改造为桌游/炉石传说风格，与 `tabletop-book-demo.html` 保持一致的设计语言。

## 设计目标
1. 三栏布局：左侧章节浏览、中间故事内容、右侧角色管理
2. 深色主题 + 金色边框
3. 章节只读浏览，角色可编辑删除
4. 提示词展示改为按钮触发模态框

## 改造范围

### 1. 整体布局
- **原设计**：垂直堆叠的卡片布局
- **新设计**：三栏横向布局，固定高度100vh

### 2. Header导航栏
- 保持现有导航项：我的书架、主题风格、分享故事
- 添加书籍标题和统计数据（章节数、角色数、字数）
- 样式改为深色背景 + 金色边框

### 3. 左侧面板 - 章节浏览
- 章节卡片列表，只读模式
- 点击章节切换中间内容
- 显示章节状态（草稿/已完成）
- 移除"添加章节"按钮（改为底部按钮）

### 4. 中间面板 - 故事内容
- 显示当前选中章节内容
- 关键字高亮（角色名、动作、情绪、地点、天气、物品）
- 章节导航（上一章/下一章）
- 底部：生成下一章按钮 + 提示词按钮

### 5. 右侧面板 - 角色管理
- 角色卡片网格展示
- 悬停显示编辑/删除按钮
- 底部：添加角色按钮
- 角色卡片边框颜色区分类型（金色主角、紫色反派、银色配角、灰色路人）

### 6. 提示词展示
- **原设计**：页面内折叠卡片
- **新设计**：底部按钮触发模态框
  - 在"生成下一章"按钮旁边添加"📝 查看提示词"按钮
  - 点击后弹出模态框显示提示词内容

## 技术实现

### CSS变量
```css
:root {
    --gold: #ffd700;
    --gold-dark: #b8860b;
    --silver: #c0c0c0;
    --purple: #a855f7;
    --bg-dark: #0d0d14;
    --bg-medium: #1a1a2e;
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
}
```

### 关键字高亮颜色
```css
.char-name { color: #f87171; font-weight: 600; }      /* 角色名 - 红色 */
.action-word { color: #a78bfa; font-weight: 600; }    /* 动作 - 紫色 */
.emotion-word { color: #4ade80; font-weight: 600; }   /* 情绪 - 绿色 */
.location-word { color: #fbbf24; font-weight: 600; }  /* 地点 - 黄色 */
.weather-word { color: #60a5fa; font-weight: 600; }   /* 天气 - 蓝色 */
.item-word { color: #f472b6; font-weight: 600; }      /* 物品 - 粉色 */
```

### 角色卡片边框
- 主角(protagonist): `border-color: var(--gold)`
- 反派(antagonist): `border-color: var(--purple)`
- 配角(supporting): `border-color: var(--silver)`
- 路人(bystander): `border-color: #6b7280`

## 文件修改清单
1. `book.html` - 主要改造文件
2. `css/styles.css` - 可能需要添加新样式（或直接在页面内添加）

## 保留功能
- 所有现有API调用
- 角色添加/编辑/删除功能
- 章节生成功能
- 提示词存储和显示
- 主题切换支持
