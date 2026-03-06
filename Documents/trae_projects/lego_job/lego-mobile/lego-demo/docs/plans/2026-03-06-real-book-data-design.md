# 真实书籍数据系统设计方案

## 一、概述

### 1.1 背景
当前书架页、书籍详情页、故事导演页都使用假数据，需要构建真实的书籍数据系统，包含完整的书籍类型、角色、章节、解谜等内容。

### 1.2 目标
- 构建4种书籍类型，每种类型配套完整的角色、天气、地形、装备、冒险类型
- 每种类型生成2本书籍，每本书10个章节
- 使用SQLite本地存储数据
- 改造现有页面接入真实数据

### 1.3 设计原则
- 预留扩展性：书籍类型、角色类型、性格标签等均可后续扩展
- 自动关联：卡牌风格根据书籍类型自动匹配
- 混合存储：预置数据JSON + SQLite动态存储

---

## 二、书籍类型设计

### 2.1 类型概览

| 类型ID | 类型名称 | 类型Emoji | 卡牌风格 | 主色调 | 次色调 | 强调色 |
|--------|----------|-----------|----------|--------|--------|--------|
| `children` | 儿童探险 | 🧒 | 卡通圆润 | #FF9800 | #FFEB3B | #8BC34A |
| `magic` | 魔法世界 | 🧙 | 神秘奇幻 | #7B1FA2 | #FFD700 | #1A237E |
| `urban` | 都市职场 | 💼 | 简约扁平 | #1976D2 | #607D8B | #FFFFFF |
| `mechanical` | 机械帝国 | 🤖 | 科技未来 | #00BCD4 | #9C27B0 | #000000 |

### 2.2 卡牌风格差异

| 页面 | 风格差异程度 |
|------|--------------|
| 书架页 | 轻微差异（配色不同，特效统一） |
| 书籍详情页 | 明显差异（配色、边框样式不同） |
| 故事导演页 | 明显差异（配色、边框样式不同） |

---

## 三、数据库设计

### 3.1 表结构

#### 3.1.1 书籍类型配置表
```sql
CREATE TABLE book_types (
  type_id TEXT PRIMARY KEY,        -- 'children', 'magic', 'urban', 'mechanical'
  type_name TEXT NOT NULL,         -- '儿童探险', '魔法世界', '都市职场', '机械帝国'
  type_emoji TEXT,                 -- '🧒', '🧙', '💼', '🤖'
  card_style TEXT,                 -- 'cartoon', 'fantasy', 'minimal', 'tech'
  primary_color TEXT,              -- 主色调
  secondary_color TEXT,            -- 次色调
  accent_color TEXT,               -- 强调色
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 3.1.2 书籍表
```sql
CREATE TABLE books (
  book_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type_id TEXT NOT NULL,
  cover_emoji TEXT,
  description TEXT,
  chapter_count INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  last_read_time DATETIME,
  is_user_created INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES book_types(type_id)
);
```

#### 3.1.3 章节表
```sql
CREATE TABLE chapters (
  chapter_id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER,
  has_puzzle INTEGER DEFAULT 0,
  puzzle_question TEXT,
  puzzle_options TEXT,            -- JSON数组: ["选项1", "选项2", "选项3", "选项4"]
  puzzle_correct_index INTEGER,
  puzzle_attempts INTEGER DEFAULT 0,
  puzzle_max_attempts INTEGER DEFAULT 3,
  puzzle_result INTEGER,          -- 0=错误, 1=正确, NULL=未作答
  character_ids TEXT,             -- JSON数组: ["char-1", "char-2"]
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(book_id)
);
```

#### 3.1.4 角色表
```sql
CREATE TABLE characters (
  character_id TEXT PRIMARY KEY,
  type_id TEXT NOT NULL,          -- 所属书籍类型
  name TEXT NOT NULL,
  custom_name TEXT,               -- 用户自定义名称
  role_type TEXT NOT NULL,        -- 角色类型（预留扩展）
  emoji TEXT,
  description TEXT,
  
  -- 数值属性
  health INTEGER DEFAULT 100,     -- 血量 (0-100)
  intimacy INTEGER DEFAULT 100,   -- 与主角的亲密度 (0-100)
  
  -- 性格属性
  personality TEXT,               -- JSON数组: ["勇敢", "忠诚"]
  
  -- 扩展属性 (JSON格式，预留后续扩展)
  extra_attributes TEXT,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES book_types(type_id)
);
```

#### 3.1.5 书籍角色关联表
```sql
CREATE TABLE book_characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  book_id TEXT NOT NULL,
  character_id TEXT NOT NULL,
  is_protagonist INTEGER DEFAULT 0,  -- 是否为该书主角 (1=是, 0=否)
  custom_name TEXT,                  -- 该书中角色的自定义名称
  current_health INTEGER,            -- 该书中角色当前血量
  current_intimacy INTEGER,          -- 该书中角色当前亲密度
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(book_id),
  FOREIGN KEY (character_id) REFERENCES characters(character_id),
  UNIQUE(book_id, character_id)
);
```

#### 3.1.6 情节元素表
```sql
CREATE TABLE plot_elements (
  element_id TEXT PRIMARY KEY,
  type_id TEXT NOT NULL,
  category TEXT NOT NULL,         -- 'weather', 'terrain', 'equipment', 'adventure'
  name TEXT NOT NULL,
  emoji TEXT,
  description TEXT,
  extra_config TEXT,              -- JSON: 额外配置如背景色等
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES book_types(type_id)
);
```

---

## 四、角色属性设计

### 4.1 数值属性

| 属性 | 默认值 | 范围 | 说明 |
|------|--------|------|------|
| 血量 | 100 | 0-100 | 角色生命值 |
| 亲密度 | 100 | 0-100 | 与主角的关系程度 |

### 4.2 性格标签

| 类型 | 性格标签 | 描述 |
|------|----------|------|
| **正面** | 勇敢 | 无畏、敢于冒险 |
| | 谨慎 | 小心、深思熟虑 |
| | 开朗 | 热情、乐观 |
| | 冷静 | 理性、沉稳 |
| | 善良 | 仁慈、乐于助人 |
| | 忠诚 | 坚定、可靠 |
| | 智慧 | 聪明、有远见 |
| **中性** | 神秘 | 难以捉摸、深邃 |
| | 顽皮 | 活泼、爱恶作剧 |
| | 孤僻 | 独来独往、不合群 |
| **负面** | 傲慢 | 自大、轻视他人 |
| | 贪婪 | 贪财、不知足 |
| | 狡诈 | 阴险、善于欺骗 |
| | 懦弱 | 胆小、逃避 |
| | 冷酷 | 无情、残忍 |
| | 自私 | 只顾自己、不顾他人 |

**约束：每个角色可以有1-2个性格标签，所有书籍类型都可使用全部性格标签**

---

## 五、每种书籍类型详细内容

### 5.1 儿童探险 🧒

#### 基本信息
| 属性 | 值 |
|------|-----|
| 类型ID | `children` |
| 类型名称 | 儿童探险 |
| 类型Emoji | 🧒 |
| 卡牌风格 | 卡通圆润 |
| 主色调 | #FF9800 (橙色) |
| 次色调 | #FFEB3B (黄色) |
| 强调色 | #8BC34A (绿色) |

#### 角色配置（4个）
| Emoji | 名称 | 角色类型 | 性格 | 血量 | 亲密度 |
|-------|------|----------|------|------|--------|
| 👦 | 小勇者 | 主角 | 勇敢、开朗 | 100 | 100 |
| 🐰 | 魔法兔子 | 伙伴 | 顽皮、善良 | 80 | 80 |
| 🦉 | 智慧猫头鹰 | 导师 | 智慧、冷静 | 60 | 70 |
| 🦊 | 小狐狸 | 小怪兽 | 神秘、顽皮 | 50 | 30 |

#### 天气配置（4个）
| Emoji | 名称 | 背景色 |
|-------|------|--------|
| ☀️ | 晴天 | #FFD54F |
| 🌈 | 彩虹 | #CE93D8 |
| 🌸 | 微风 | #F8BBD9 |
| ⭐ | 星空 | #7986CB |

#### 地形配置（4个）
| Emoji | 名称 | 装饰元素 |
|-------|------|----------|
| 🌲 | 森林 | 🌲🌳🌿 |
| 🌼 | 草地 | 🌼🌸🦋 |
| 💧 | 小溪 | 💧🌊🐟 |
| 🏡 | 花园 | 🏡🌷🌹 |

#### 装备配置（4个）
| Emoji | 名称 |
|-------|------|
| 🪄 | 魔法棒 |
| 🎒 | 小背包 |
| 🧭 | 指南针 |
| 🔍 | 放大镜 |

#### 冒险类型配置（4个）
| Emoji | 名称 |
|-------|------|
| 💎 | 寻宝 |
| 🗺️ | 探险 |
| 🧩 | 解谜 |
| 🌟 | 收集 |

#### 预置书籍（2本）
| 书名 | 章节数 | 解谜数 | 简介 |
|------|--------|--------|------|
| 《小勇者的森林奇遇》 | 10 | 5-6 | 小勇者小明和魔法兔子一起探索神秘森林... |
| 《魔法兔子的寻宝记》 | 10 | 5-6 | 魔法兔子带领小伙伴们寻找传说中的宝藏... |

---

### 5.2 魔法世界 🧙

#### 基本信息
| 属性 | 值 |
|------|-----|
| 类型ID | `magic` |
| 类型名称 | 魔法世界 |
| 类型Emoji | 🧙 |
| 卡牌风格 | 神秘奇幻 |
| 主色调 | #7B1FA2 (紫色) |
| 次色调 | #FFD700 (金色) |
| 强调色 | #1A237E (深蓝) |

#### 角色配置（4个）
| Emoji | 名称 | 角色类型 | 性格 | 血量 | 亲密度 |
|-------|------|----------|------|------|--------|
| 🧙‍♂️ | 法师 | 主角 | 智慧、冷静 | 100 | 100 |
| 🧝 | 精灵 | 伙伴 | 开朗、忠诚 | 90 | 85 |
| 🐉 | 巨龙 | 守护者 | 神秘、傲慢 | 150 | 40 |
| 🦄 | 独角兽 | 灵兽 | 善良、神秘 | 80 | 70 |

#### 天气配置（4个）
| Emoji | 名称 | 背景色 |
|-------|------|--------|
| 🌙 | 月夜 | #311B92 |
| 🌫️ | 迷雾 | #78909C |
| ⛈️ | 雷暴 | #37474F |
| 🌌 | 极光 | #4A148C |

#### 地形配置（4个）
| Emoji | 名称 | 装饰元素 |
|-------|------|----------|
| 🏰 | 魔法塔 | 🏰✨🔮 |
| 🌳 | 禁林 | 🌳🌲🌑 |
| 🏔️ | 龙巢 | 🏔️🐉🔥 |
| 💎 | 水晶洞 | 💎🔮✨ |

#### 装备配置（4个）
| Emoji | 名称 |
|-------|------|
| 🪄 | 法杖 |
| 💍 | 魔戒 |
| 📖 | 魔法书 |
| 🔮 | 水晶球 |

#### 冒险类型配置（4个）
| Emoji | 名称 |
|-------|------|
| ✨ | 施法 |
| 👻 | 召唤 |
| ⚗️ | 炼金 |
| 🦋 | 飞行 |

#### 预置书籍（2本）
| 书名 | 章节数 | 解谜数 | 简介 |
|------|--------|--------|------|
| 《龙之谷的召唤》 | 10 | 5-6 | 年轻法师被神秘力量召唤到龙之谷... |
| 《魔法学院的秘密》 | 10 | 5-6 | 魔法学院深处隐藏着古老的秘密... |

---

### 5.3 都市职场 💼

#### 基本信息
| 属性 | 值 |
|------|-----|
| 类型ID | `urban` |
| 类型名称 | 都市职场 |
| 类型Emoji | 💼 |
| 卡牌风格 | 简约扁平 |
| 主色调 | #1976D2 (蓝色) |
| 次色调 | #607D8B (蓝灰) |
| 强调色 | #FFFFFF (白色) |

#### 角色配置（4个）
| Emoji | 名称 | 角色类型 | 性格 | 血量 | 亲密度 |
|-------|------|----------|------|------|--------|
| 👨‍💼 | 创业者 | 主角 | 勇敢、冷静 | 100 | 100 |
| 👩‍💻 | 程序员 | 同事 | 谨慎、智慧 | 80 | 75 |
| 👨‍🎨 | 设计师 | 同事 | 开朗、顽皮 | 70 | 80 |
| 👨‍💼 | 投资人 | 合作伙伴 | 冷静、狡诈 | 90 | 50 |

#### 天气配置（4个）
| Emoji | 名称 | 背景色 |
|-------|------|--------|
| ☀️ | 晴朗 | #64B5F6 |
| ☁️ | 阴天 | #90A4AE |
| 🌧️ | 雨天 | #546E7A |
| 🌫️ | 雾霾 | #78909C |

#### 地形配置（4个）
| Emoji | 名称 | 装饰元素 |
|-------|------|----------|
| 🏢 | 办公室 | 🏢💻📊 |
| ☕ | 咖啡厅 | ☕🍰🎵 |
| 📋 | 会议室 | 📋📊💼 |
| 🏗️ | 科技园 | 🏗️🏢🚀 |

#### 装备配置（4个）
| Emoji | 名称 |
|-------|------|
| 💻 | 笔记本 |
| 💳 | 名片 |
| ☕ | 咖啡 |
| ⌚ | 手表 |

#### 冒险类型配置（4个）
| Emoji | 名称 |
|-------|------|
| 🤝 | 谈判 |
| 📊 | 策划 |
| 🔬 | 研发 |
| 💰 | 投资 |

#### 预置书籍（2本）
| 书名 | 章节数 | 解谜数 | 简介 |
|------|--------|--------|------|
| 《创业之路》 | 10 | 5-6 | 一个年轻人从零开始创业的故事... |
| 《职场风云》 | 10 | 5-6 | 职场新人如何在竞争中获得成功... |

---

### 5.4 机械帝国 🤖

#### 基本信息
| 属性 | 值 |
|------|-----|
| 类型ID | `mechanical` |
| 类型名称 | 机械帝国 |
| 类型Emoji | 🤖 |
| 卡牌风格 | 科技未来 |
| 主色调 | #00BCD4 (青色) |
| 次色调 | #9C27B0 (紫色) |
| 强调色 | #000000 (黑色) |

#### 角色配置（4个）
| Emoji | 名称 | 角色类型 | 性格 | 血量 | 亲密度 |
|-------|------|----------|------|------|--------|
| 🦾 | 机甲战士 | 主角 | 勇敢、冷静 | 150 | 100 |
| 🤖 | AI助手 | 伙伴 | 智慧、忠诚 | 100 | 90 |
| 👷 | 工程师 | 支援 | 谨慎、善良 | 80 | 70 |
| 👨‍✈️ | 指挥官 | 领导 | 冷静、傲慢 | 120 | 60 |

#### 天气配置（4个）
| Emoji | 名称 | 背景色 |
|-------|------|--------|
| ⚡ | 辐射风暴 | #00E676 |
| 💫 | 能量雨 | #E040FB |
| 📡 | 数据流 | #00BCD4 |
| 🌌 | 量子云 | #651FFF |

#### 地形配置（4个）
| Emoji | 名称 | 装饰元素 |
|-------|------|----------|
| 🏚️ | 废墟城市 | 🏚️⚙️🔧 |
| 🛸 | 太空站 | 🛸🌟🪐 |
| 🔩 | 地下基地 | 🔩⚙️💡 |
| 🏙️ | 机械城 | 🏙️🤖⚡ |

#### 装备配置（4个）
| Emoji | 名称 |
|-------|------|
| 🔫 | 激光枪 |
| 🛡️ | 能量盾 |
| 💾 | 芯片 |
| 🚀 | 推进器 |

#### 冒险类型配置（4个）
| Emoji | 名称 |
|-------|------|
| ⚔️ | 战斗 |
| 🔧 | 修复 |
| ⬆️ | 升级 |
| 🔭 | 探索 |

#### 预置书籍（2本）
| 书名 | 章节数 | 解谜数 | 简介 |
|------|--------|--------|------|
| 《机甲觉醒》 | 10 | 5-6 | 机甲战士在废墟中觉醒，开始寻找真相... |
| 《星际征途》 | 10 | 5-6 | 人类踏上星际征途，探索未知宇宙... |

---

## 六、Emoji显示方案

### 6.1 当前方案
- 使用系统原生Emoji
- 简单快速，无需额外资源

### 6.2 预留扩展
- 数据库中预留 `image_url` 字段
- 后续可替换为自定义图片资源
- 支持卡片小图 + 详情大图的混合方案

---

## 七、数据流设计

### 7.1 书架页数据流
```
应用启动 → 检查SQLite初始化 → 查询books表 → 显示书籍列表
```

### 7.2 书籍详情页数据流
```
点击书籍 → 传递bookId → 查询books表获取type_id
                            ↓
                    查询chapters表（章节列表）
                    查询book_characters表（角色列表）
                    查询plot_elements表（情节元素）
                    应用对应卡牌风格
```

### 7.3 故事导演页数据流
```
书籍详情页 → 点击"导演台"按钮 → 传递bookId
                                    ↓
                            查询books表获取type_id
                                    ↓
                            根据type_id过滤：
                            - characters (该类型的角色)
                            - plot_elements (该类型的天气、地形、装备、冒险类型)
                            应用对应卡牌风格
```

---

## 八、文件结构

```
lego-demo/
├── src/
│   ├── data/
│   │   ├── preset/
│   │   │   ├── bookTypes.json          # 书籍类型配置
│   │   │   ├── characters.json          # 角色数据
│   │   │   ├── plotElements.json        # 情节元素数据
│   │   │   └── books/                   # 预置书籍内容
│   │   │       ├── children_book1.json
│   │   │       ├── children_book2.json
│   │   │       ├── magic_book1.json
│   │   │       ├── magic_book2.json
│   │   │       ├── urban_book1.json
│   │   │       ├── urban_book2.json
│   │   │       ├── mechanical_book1.json
│   │   │       └── mechanical_book2.json
│   │   └── index.ts
│   ├── database/
│   │   ├── DatabaseService.ts           # SQLite服务
│   │   ├── migrations/
│   │   │   └── init.sql
│   │   └── queries/
│   │       ├── books.ts
│   │       ├── chapters.ts
│   │       └── characters.ts
│   ├── context/
│   │   └── DataContext.tsx
│   └── screens/
│       ├── BookshelfDemo.tsx
│       ├── BookDetailDemo.tsx
│       └── StoryDirectorDemo.tsx
```

---

## 九、实现步骤

| 阶段 | 内容 | 详细说明 |
|------|------|----------|
| **阶段1** | 数据库服务层搭建 | 创建SQLite服务、表结构、基础查询方法 |
| **阶段2** | 预置数据生成 | 编写8本书的完整内容（80章节、48个解谜） |
| **阶段3** | 书架页改造 | BookshelfDemo.tsx接入SQLite，显示真实书籍列表 |
| **阶段4** | 书籍详情页改造 | BookDetailDemo.tsx接入SQLite，显示真实章节、角色、情节 |
| **阶段5** | 故事导演页改造 | StoryDirectorDemo.tsx接入SQLite，显示真实角色、天气、地形、装备 |
| **阶段6** | 测试验证 | 构建APK、端到端测试 |

---

## 十、数据量统计

| 数据类型 | 数量 |
|----------|------|
| 书籍类型 | 4种 |
| 预置书籍 | 8本 |
| 章节总数 | 80章（每本10章） |
| 解谜总数 | 约48个（每本5-6个） |
| 角色总数 | 16个（每类型4个） |
| 情节元素 | 64个（每类型16个：天气4+地形4+装备4+冒险类型4） |

---

## 十一、预留扩展设计

### 11.1 书籍类型扩展
- 数据库表 `book_types` 支持新增类型
- 预置JSON文件可新增类型配置

### 11.2 角色类型扩展
- `role_type` 字段为文本类型，支持自定义值
- 不同书籍类型可定义不同的角色类型

### 11.3 性格标签扩展
- 性格标签存储为JSON数组
- 可随时新增性格标签

### 11.4 Emoji扩展
- 预留 `image_url` 字段
- 后续可替换为自定义图片资源

### 11.5 角色属性扩展
- `extra_attributes` 字段存储JSON
- 支持新增任意属性

---

## 十二、技术选型

| 技术 | 选择 | 说明 |
|------|------|------|
| SQLite库 | react-native-quick-sqlite | 高性能，支持React Native新架构 |
| 数据初始化 | 应用启动时检查并导入 | 首次启动导入预置数据 |
| 状态管理 | React Context | 数据上下文管理 |
