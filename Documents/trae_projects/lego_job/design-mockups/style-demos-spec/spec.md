# 15套桌游风格Demo设计规格

## 项目概述
基于现有乐高故事书项目，设计15套不同桌游风格的UI Demo，不修改现有项目代码，仅创建独立演示文件供用户选择。

## 设计原则
1. 每套风格独立完整，包含首页、角色卡牌、故事详情等核心元素
2. 保持功能一致性，仅改变视觉风格
3. 所有Demo存放在 `design-mockups/style-demos/` 目录
4. 每个Demo文件命名格式：`style-[编号]-[风格名].html`

---

## 15套风格详细规格

### 风格1：狼人杀风格 (Werewolf Style)
**灵感来源**：《狼人杀》桌游
**核心特征**：
- 深紫/暗红色调，神秘夜晚氛围
- 月亮、狼影等元素装饰
- 角色卡牌带有身份隐藏效果（翻转动画）
- 投票/怀疑机制视觉化

**配色方案**：
```css
--primary: #4a0e4e (深紫)
--secondary: #8b0000 (暗红)
--accent: #c0c0c0 (银色月光)
--bg-dark: #1a0a1a
--bg-medium: #2d1a2d
--text-primary: #e8e8e8
--text-secondary: #a0a0a0
```

**特色元素**：
- 满月背景动画
- 卡牌背面神秘图案
- 昼夜切换效果
- 眼睛闪烁动画

---

### 风格2：行动代号风格 (Codenames Style)
**灵感来源**：《行动代号》桌游
**核心特征**：
- 简洁网格布局
- 红蓝对抗色调
- 间谍/特工主题图标
- 词卡翻转效果

**配色方案**：
```css
--red-team: #dc2626
--blue-team: #2563eb
--neutral: #f5f5dc
--assassin: #1a1a1a
--bg-dark: #2c2c2c
--text-primary: #ffffff
```

**特色元素**：
- 网格词卡布局
- 灯泡提示动画
- 队伍得分面板
- 特工图标装饰

---

### 风格3：谁是卧底风格 (Spyfall Style)
**灵感来源**：《谁是卧底》桌游
**核心特征**：
- 地点卡片轮转设计
- 问号/面具元素
- 悬疑计时器
- 玩家位置环形布局

**配色方案**：
```css
--primary: #1e3a5f (深蓝)
--accent: #ffd700 (金色)
--suspicious: #ff6b6b
--bg-dark: #0f1c2e
--bg-medium: #1a2d45
```

**特色元素**：
- 地点图标集合
- 倒计时圆环
- 怀疑度指示器
- 匿名投票界面

---

### 风格4：卡坦岛风格 (Catan Style)
**灵感来源**：《卡坦岛》桌游
**核心特征**：
- 六边形网格布局
- 资源色彩系统（木材、砖块、羊毛、小麦、矿石）
- 建筑图标（村庄、城市、道路）
- 港口交易视觉

**配色方案**：
```css
--wood: #8b4513
--brick: #cd5c5c
--wool: #f5f5dc
--wheat: #daa520
--ore: #708090
--bg-dark: #2e4a3f
--bg-medium: #3d5c4a
```

**特色元素**：
- 六边形地块
- 资源卡牌
- 骰子动画
- 建筑放置效果

---

### 风格5：璀璨宝石风格 (Splendor Style)
**灵感来源**：《璀璨宝石》桌游
**核心特征**：
- 宝石色彩系统（红宝石、蓝宝石、绿宝石、钻石、玛瑙）
- 贵族卡片设计
- 简洁优雅的排版
- 闪亮光泽效果

**配色方案**：
```css
--ruby: #e0115f
--sapphire: #0f52ba
--emerald: #50c878
--diamond: #b9f2ff
--onyx: #353839
--gold: #ffd700
--bg-dark: #1a1a2e
--bg-medium: #252542
```

**特色元素**：
- 宝石筹码动画
- 贵族肖像框
- 光泽渐变效果
- 筹码堆叠视觉

---

### 风格6：花砖物语风格 (Azul Style)
**灵感来源**：《花砖物语》桌游
**核心特征**：
- 葡萄牙瓷砖图案
- 蓝白配色为主
- 几何图案装饰
- 精致的瓷砖放置效果

**配色方案**：
```css
--azul-blue: #0066cc
--azul-white: #f0f8ff
--azul-yellow: #ffd700
--azul-dark: #003366
--bg-dark: #1a2a3a
--bg-medium: #2a3a4a
```

**特色元素**：
- 瓷砖图案背景
- 花砖放置网格
- 图案填充动画
- 得分轨道

---

### 风格7：血染钟楼风格 (Blood on the Clocktower Style)
**灵感来源**：《血染钟楼》桌游
**核心特征**：
- 哥特式暗黑风格
- 钟楼/时间元素
- 红黑配色
- 角色能力图标

**配色方案**：
```css
--blood-red: #8b0000
--gothic-black: #0a0a0a
--parchment: #f4e4bc
--gold-trim: #c9a227
--bg-dark: #0d0d0d
--bg-medium: #1a1a1a
```

**特色元素**：
- 钟楼指针动画
- 羊皮纸纹理
- 蜡封效果
- 烛光闪烁

---

### 风格8：幽港迷城风格 (Gloomhaven Style)
**灵感来源**：《幽港迷城》桌游
**核心特征**：
- 欧洲奇幻风格
- 角色技能卡设计
- 地图板块元素
- 战斗数值系统

**配色方案**：
```css
--parchment: #d4c4a8
--leather: #8b4513
--steel: #71797e
--magic-blue: #4169e1
--bg-dark: #1a1a1a
--bg-medium: #2d2d2d
```

**特色元素**：
- 技能卡布局
- 元素符号
- 地图板块
- 战斗骰子

---

### 风格9：七大奇迹风格 (7 Wonders Style)
**灵感来源**：《七大奇迹》桌游
**核心特征**：
- 古代文明主题
- 金色/青铜色调
- 奇迹建筑图标
- 时代进程视觉

**配色方案**：
```css
--gold-ancient: #d4af37
--bronze: #cd7f32
--marble: #f5f5f5
--papyrus: #f4e4bc
--bg-dark: #1a1510
--bg-medium: #2d2820
```

**特色元素**：
- 奇迹卡片
- 资源图标
- 时代标记
- 胜利点数

---

### 风格10：票务之旅风格 (Ticket to Ride Style)
**灵感来源**：《票务之旅》桌游
**核心特征**：
- 复古火车主题
- 彩色车票卡
- 地图路线设计
- 车站图标

**配色方案**：
```css
--train-red: #c41e3a
--train-blue: #0047ab
--train-green: #228b22
--train-yellow: #ffd700
--vintage-paper: #f5e6c8
--bg-dark: #2a2520
```

**特色元素**：
- 车票卡牌
- 路线地图
- 火车图标
- 得分轨道

---

### 风格11：农场主风格 (Agricola Style)
**灵感来源**：《农场主》桌游
**核心特征**：
- 农场田园主题
- 木质/泥土色调
- 资源圆盘设计
- 农田网格布局

**配色方案**：
```css
--wood-light: #deb887
--wood-dark: #8b4513
--soil: #654321
--grass: #228b22
--stone: #708090
--bg-dark: #2d2418
--bg-medium: #3d3428
```

**特色元素**：
- 农田网格
- 资源圆盘
- 动物图标
- 房屋建筑

---

### 风格12：星际拓荒风格 (Terraforming Mars Style)
**灵感来源**：《星际拓荒》桌游
**核心特征**：
- 科幻火星主题
- 红色星球色调
- 项目卡片设计
- 资源立方体

**配色方案**：
```css
--mars-red: #c1440e
--mars-orange: #e97451
--space-black: #0a0a0a
--steel-blue: #4682b4
--titanium: #878681
--bg-dark: #0d0d0d
--bg-medium: #1a1a1a
```

**特色元素**：
- 项目卡牌
- 资源立方体
- 地球化指标
- 科技图标

---

### 风格13：瘟疫危机风格 (Pandemic Style)
**灵感来源**：《瘟疫危机》桌游
**核心特征**：
- 全球地图视觉
- 疾病颜色系统
- 城市连接网络
- 研究站图标

**配色方案**：
```css
--disease-blue: #0066cc
--disease-yellow: #ffd700
--disease-black: #1a1a1a
--disease-red: #dc2626
--cure-green: #22c55e
--bg-dark: #1a2a3a
--bg-medium: #2a3a4a
```

**特色元素**：
- 世界地图
- 城市节点
- 疾病立方体
- 研究站

---

### 风格14：魔法风云会风格 (Magic: The Gathering Style)
**灵感来源**：《魔法风云会》卡牌游戏
**核心特征**：
- 五色魔法系统
- 奇幻插画风格
- 卡牌边框设计
- 法力符号

**配色方案**：
```css
--white-mana: #f8f6e3
--blue-mana: #0e68ab
--black-mana: #150b00
--red-mana: #d3202a
--green-mana: #00733e
--bg-dark: #1a1a1a
--bg-medium: #2d2d2d
```

**特色元素**：
- 法力符号
- 卡牌边框
- 能力图标
- 稀有度宝石

---

### 风格15：三国杀风格 (SanGuoSha Style)
**灵感来源**：《三国杀》桌游
**核心特征**：
- 中国古典风格
- 水墨画元素
- 武将卡牌设计
- 势力颜色系统

**配色方案**：
```css
--wei-blue: #1e90ff
--shu-red: #dc143c
--wu-green: #228b22
--qun-gray: #708090
--gold-chinese: #d4af37
--bg-dark: #1a1510
--bg-medium: #2d2820
```

**特色元素**：
- 武将卡牌
- 势力标志
- 技能图标
- 印章效果

---

## 技术实现要求

### 文件结构
```
design-mockups/
├── style-demos/
│   ├── style-01-werewolf.html
│   ├── style-02-codenames.html
│   ├── style-03-spyfall.html
│   ├── style-04-catan.html
│   ├── style-05-splendor.html
│   ├── style-06-azul.html
│   ├── style-07-blood-clocktower.html
│   ├── style-08-gloomhaven.html
│   ├── style-09-seven-wonders.html
│   ├── style-10-ticket-ride.html
│   ├── style-11-agricola.html
│   ├── style-12-terraforming-mars.html
│   ├── style-13-pandemic.html
│   ├── style-14-magic-the-gathering.html
│   ├── style-15-sanguosha.html
│   └── index.html (风格选择页面)
```

### 通用组件
每个Demo包含：
1. **首页展示区** - 标题、导航、热门角色
2. **角色卡牌区** - 4-6张示例角色卡
3. **故事预览区** - 章节内容展示
4. **交互元素** - 卡牌悬停、点击效果

### 动画要求
- 卡牌悬停：transform + box-shadow
- 页面加载：淡入动画
- 背景效果：粒子/光效动画
- 过渡效果：cubic-bezier 缓动

### 响应式设计
- 桌面端：1200px+ 完整布局
- 平板端：768px-1199px 自适应
- 移动端：<768px 简化布局

---

## 验收标准
1. 15个Demo文件全部创建完成
2. 每个Demo风格独特、辨识度高
3. 所有动画效果流畅
4. 响应式布局正常
5. 浏览器兼容性良好（Chrome、Firefox、Safari、Edge）
