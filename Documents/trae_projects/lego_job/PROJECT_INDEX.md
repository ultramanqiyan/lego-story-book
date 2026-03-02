# 乐高故事书项目文件索引

## 文档信息

| 项目名称 | 乐高故事书 |
|----------|------------|
| 文档版本 | V1.0 |
| 编写日期 | 2026年2月27日 |
| 文档状态 | 正式发布 |

---

## 一、项目概述

乐高故事书是一个让10-12岁儿童创作并阅读自己专属冒险故事的互动平台。项目采用无服务器架构，部署在Cloudflare Pages上，使用D1数据库存储数据，集成豆包AI生成故事内容。

---

## 二、项目目录结构

```
lego_job/
├── css/                    # 样式文件目录
├── design-mockups/         # UI设计原型目录
├── doc/                    # 文档目录
├── e2e-test-report/        # 端到端测试报告
├── functions/              # 后端API函数
├── js/                     # 前端JavaScript文件
├── lego-mobile/            # React Native移动端项目
├── migrations/             # 数据库迁移文件
├── public/                 # 静态资源文件
├── scripts/                # 工具脚本
├── spec/                   # 规格说明文档
├── summary/                # 项目总结文档
├── *.html                  # 前端页面文件
├── deploy.bat              # Windows一键部署脚本
├── deploy.ps1              # PowerShell部署脚本
├── package.json            # 项目依赖配置
└── wrangler.toml           # Cloudflare配置文件
```

---

## 三、核心文件说明

### 3.1 前端页面文件（根目录）

| 文件名 | 功能说明 |
|--------|----------|
| index.html | 项目首页，展示热门内容和快速入口 |
| login.html | 登录页面，用户输入用户名即可登录 |
| bookshelf.html | 我的书架页面，管理书籍列表 |
| book.html | 书籍详情页面，阅读和管理章节 |
| adventure.html | 冒险模式页面，沉浸式阅读解谜体验 |
| characters.html | 人仔角色页面，管理角色人仔 |
| chapter.html | 章节阅读页面 |
| parent.html | 家长控制页面，设置阅读时间限制 |
| share.html | 分享页面，查看分享内容 |
| shares.html | 分享列表页面 |
| story-create.html | 故事创建页面 |
| story-director.html | 故事导演页面，选择情节走向 |

### 3.2 样式文件目录（css/）

| 文件名 | 功能说明 |
|--------|----------|
| style.css | 主样式文件，全局样式定义 |
| styles.css | 附加样式文件 |
| lego-theme.css | 乐高主题样式 |
| animations.css | 动画效果样式 |
| loading.css | 加载状态样式 |
| theme-lego.css | 经典乐高主题 |
| theme-fairy.css | 童话魔法主题 |
| theme-immersive.css | 沉浸故事主题 |
| theme-gamified.css | 游戏冒险主题 |
| theme-nature.css | 自然森林主题 |
| theme-scifi.css | 科幻未来主题 |

### 3.3 JavaScript文件目录（js/）

| 文件名 | 功能说明 |
|--------|----------|
| utils.js | 工具函数，包含ID生成、数据格式化等 |
| animations.js | 动画效果控制 |
| theme-manager.js | 主题切换管理 |
| loading-manager.js | 加载状态管理 |

### 3.4 后端API函数目录（functions/api/）

| 文件名 | 功能说明 |
|--------|----------|
| users.js | 用户管理API：登录、查询用户信息 |
| books.js | 书籍管理API：创建、查询、删除书籍 |
| chapters.js | 章节管理API：查询章节列表和详情 |
| chapters-generate.js | 章节生成API：AI生成新章节 |
| chapters-complete.js | 章节完成API：标记章节完成 |
| characters.js | 角色管理API：创建、查询、更新、删除角色 |
| book-characters.js | 书籍角色关联API |
| puzzle.js | 谜题管理API：获取谜题、验证答案 |
| story.js | 故事生成API |
| generate.js | 内容生成API |
| plot-options.js | 情节选项API：获取故事走向选择 |
| share.js | 分享功能API：创建、获取、删除分享 |
| speech.js | 语音识别API：调用SiliconFlow语音服务 |
| utils.js | API工具函数 |

### 3.5 数据库迁移文件目录（migrations/）

| 文件名 | 功能说明 |
|--------|----------|
| 0001_initial_schema.sql | 初始数据库结构：用户表、书籍表、章节表、角色表等 |
| 0002_add_plot_selection.sql | 添加情节选择功能相关表结构 |
| 0002_seed_data.sql | 初始种子数据 |
| 0004_reset_database.sql | 数据库重置脚本 |

### 3.6 静态资源目录（public/）

| 目录/文件 | 功能说明 |
|-----------|----------|
| minifigures/ | 人仔头像图片目录 |
| astronaut.png | 宇航员头像 |
| batman.webp | 蝙蝠侠头像 |
| dinosaur.png | 恐龙头像 |
| elf.png | 精灵头像 |
| knight.png | 骑士头像 |
| naruto.png | 火影忍者头像 |
| pirate.png | 海盗头像 |
| princess.png | 公主头像 |
| robot.png | 机器人头像 |
| spiderman.png | 蜘蛛侠头像 |
| superman.jpg | 超人头像 |
| wizard.png | 巫师头像 |

---

## 四、移动端项目目录（lego-mobile/）

### 4.1 项目配置文件

| 文件名 | 功能说明 |
|--------|----------|
| package.json | 移动端项目依赖配置 |
| app.json | Expo应用配置 |
| App.js | 应用入口文件 |
| index.js | 注册入口 |
| babel.config.js | Babel编译配置 |
| metro.config.js | Metro打包配置 |
| eas.json | EAS构建配置 |
| playwright.config.js | Playwright测试配置 |
| jest.config.js | Jest单元测试配置 |

### 4.2 源代码目录（src/）

#### API层（src/api/）

| 文件名 | 功能说明 |
|--------|----------|
| client.js | API客户端，处理请求和响应 |
| index.js | API导出入口 |
| types.js | API类型定义 |
| users.js | 用户相关API |
| books.js | 书籍相关API |
| chapters.js | 章节相关API |
| characters.js | 角色相关API |
| puzzle.js | 谜题相关API |
| share.js | 分享相关API |
| story.js | 故事相关API |

#### 组件目录（src/components/）

| 目录/文件 | 功能说明 |
|-----------|----------|
| common/ | 通用组件：按钮、卡片、加载、弹窗、提示等 |
| card3d/ | 3D卡牌组件：Card3D、CardDeck3D |
| chapter/ | 章节组件：关键词高亮、提示面板 |
| characters/ | 角色组件：角色表单 |
| particles/ | 粒子效果组件 |
| story/ | 故事组件：卡牌组、舞台预览、天气效果 |
| weather/ | 天气效果组件V2 |

#### 页面目录（src/screens/）

| 目录/文件 | 功能说明 |
|-----------|----------|
| auth/LoginScreen.js | 登录页面 |
| home/HomeScreen.js | 首页 |
| bookshelf/BookshelfScreen.js | 书架页面 |
| story/BookDetailScreen.js | 书籍详情页面 |
| story/StoryCreateScreen.js | 故事创建页面 |
| story/StoryDirectorScreen.js | 故事导演页面 |
| chapter/ChapterScreen.js | 章节阅读页面 |
| adventure/AdventureScreen.js | 冒险模式页面 |
| characters/CharactersScreen.js | 角色管理页面 |
| settings/SettingsScreen.js | 设置页面 |
| settings/ThemeSettingsScreen.js | 主题设置页面 |
| settings/ParentControlScreen.js | 家长控制页面 |
| share/ShareScreen.js | 分享页面 |
| demo/DemoScreens.js | 演示页面 |
| LoadingScreen.js | 加载页面 |

#### 导航目录（src/navigation/）

| 文件名 | 功能说明 |
|--------|----------|
| AppNavigator.js | 应用主导航 |
| AuthNavigator.js | 认证导航 |
| MainNavigator.js | 主页面导航 |
| index.js | 导航导出入口 |

#### 上下文目录（src/context/）

| 文件名 | 功能说明 |
|--------|----------|
| AuthContext.js | 认证状态管理 |
| ThemeContext.js | 主题状态管理 |
| ToastContext.js | 提示消息管理 |

#### Hooks目录（src/hooks/）

| 文件名 | 功能说明 |
|--------|----------|
| use3DCard.js | 3D卡牌效果Hook |
| useParticles.js | 粒子效果Hook |

#### 样式目录（src/styles/）

| 文件名 | 功能说明 |
|--------|----------|
| colors.js | 颜色定义 |
| theme.js | 主题样式 |
| typography.js | 字体样式 |

#### 工具目录（src/utils/）

| 文件名 | 功能说明 |
|--------|----------|
| animations.js | 动画工具函数 |
| constants.js | 常量定义 |
| helpers.js | 辅助函数 |
| storage.js | 本地存储工具 |

### 4.3 测试目录（tests/）

| 目录/文件 | 功能说明 |
|-----------|----------|
| playwright/core-functions.spec.js | 核心功能端到端测试 |
| playwright/e2e.spec.js | 端到端测试 |
| e2e/api.e2e.test.js | API端到端测试 |
| unit/ | 单元测试目录 |

### 4.4 文档目录（docs/）

| 文件名 | 功能说明 |
|--------|----------|
| spec.md | 移动端规格说明 |
| task_list.md | 任务列表 |
| checklist.md | 检查清单 |
| animation-spec.md | 动画规格说明 |
| react-native-animation-spec.md | React Native动画规格 |
| ui-sync-spec.md | UI同步规格 |

---

## 五、设计原型目录（design-mockups/）

### 5.1 页面原型文件

| 文件名 | 功能说明 |
|--------|----------|
| login-demo.html | 登录页面原型 |
| index-demo.html | 首页原型 |
| bookshelf-demo.html | 书架页面原型 |
| book-demo.html | 书籍详情原型 |
| adventure-demo.html | 冒险模式原型 |
| characters-demo.html | 角色管理原型 |
| share-demo.html | 分享页面原型 |
| parent-demo.html | 家长控制原型 |
| story-create-demo.html | 故事创建原型 |
| card-ui-demo.html | 卡牌UI原型 |
| tabletop-book-demo.html | 桌面风格书籍原型 |
| tabletop-card-demo.html | 桌面风格卡牌原型 |
| theme-selector-demo.html | 主题选择器原型 |
| threejs-card-demo.html | Three.js卡牌效果原型 |

### 5.2 导演桌面原型

| 文件名 | 功能说明 |
|--------|----------|
| director-desk-demo.html | 导演桌面演示 |
| director-desk-v2.html | 导演桌面V2 |
| director-desk-final.html | 导演桌面最终版 |
| director-desk-dark.html | 深色主题版本 |
| director-desk-light.html | 浅色主题版本 |
| director-desk-compact.html | 紧凑版本 |
| director-desk-wide.html | 宽屏版本 |
| director-desk-merged.html | 合并版本 |

### 5.3 风格演示（style-demos/）

| 文件名 | 功能说明 |
|--------|----------|
| style-01-werewolf.html | 狼人杀风格 |
| style-02-codenames.html | 行动代号风格 |
| style-03-spyfall.html | 间谍危机风格 |
| style-04-catan.html | 卡坦岛风格 |
| style-05-splendor.html | 璀璨宝石风格 |
| style-06-azul.html | 花砖物语风格 |
| style-07-blood-clocktower.html | 血染钟楼风格 |
| style-08-gloomhaven.html | 幽港迷城风格 |
| style-09-seven-wonders.html | 七大奇迹风格 |
| style-10-ticket-ride.html | 铁路环游风格 |
| style-11-agricola.html | 农场主风格 |
| style-12-terraforming-mars.html | 火星改造风格 |
| style-13-pandemic.html | 瘟疫危机风格 |
| style-14-magic-the-gathering.html | 万智牌风格 |
| style-15-sanguosha.html | 三国杀风格 |

### 5.4 3D效果演示

| 文件名 | 功能说明 |
|--------|----------|
| 3d-01-card-flip.html | 卡牌翻转效果 |
| 3d-01-flip-cards.html | 翻转卡牌组 |
| 3d-02-floating-island.html | 漂浮岛屿效果 |
| 3d-03-perspective-hall.html | 透视大厅效果 |
| 3d-04-rotating-stage.html | 旋转舞台效果 |
| 3d-05-tilt-interaction.html | 倾斜交互效果 |
| 3d-06-cube-box.html | 立方体盒子效果 |
| 3d-19-ring-menu.html | 环形菜单效果 |
| 3d-20-fractal-tree.html | 分形树效果 |
| 3d-21-particle-explosion.html | 粒子爆炸效果 |
| 3d-22-mirror.html | 镜面效果 |
| 3d-23-tornado.html | 龙卷风效果 |
| 3d-24-domino.html | 多米诺效果 |
| 3d-25-spring.html | 弹簧效果 |

---

## 六、文档目录

### 6.1 项目总结文档（summary/）

| 文件名 | 功能说明 |
|--------|----------|
| index.md | 文档索引 |
| requirements.md | 需求文档 |
| api-documentation.md | 接口文档 |
| overall-design.md | 总体设计文档 |
| subsystem-design.md | 子系统详细设计文档 |
| frontend-design.md | 前端设计文档 |
| deployment-guide.md | 部署文档 |
| test-requirements.md | 测试需求文档 |
| test-cases.md | 测试用例文档 |
| project-reflection.md | 项目实施反思文档 |
| requirement-traceability.md | 需求追溯矩阵文档 |
| ai-programming-token-optimization.md | AI编程Token优化策略反思 |
| tencent-cloud-migration.md | 腾讯云迁移指南 |
| deploy.bat | Windows一键部署脚本 |
| deploy.sh | Linux/Mac一键部署脚本 |

### 6.2 技术文档（doc/）

| 文件名 | 功能说明 |
|--------|----------|
| requirements.md | 需求文档 |
| REQUIREMENT_TRACEABILITY.md | 需求追溯矩阵 |
| REQUIREMENT_TRACEABILITY_FULL.md | 完整需求追溯矩阵 |
| TEST_CASES.md | 测试用例 |
| TEST_COVERAGE_ANALYSIS.md | 测试覆盖分析 |
| TEST_REPORT.md | 测试报告 |
| UI-DESIGN-PROPOSALS.md | UI设计提案 |
| bug-reflection-report.md | Bug反思报告 |
| test-reflection-report.md | 测试反思报告 |
| api-validation-spec.md | API验证规格 |

### 6.3 规格说明文档（spec/）

| 文件名 | 功能说明 |
|--------|----------|
| spec.md | 主规格说明 |
| task_list.md | 任务列表 |
| check_list.md | 检查清单 |
| requirement_traceability.md | 需求追溯 |
| ui_design_spec.md | UI设计规格 |
| acceptance_spec.md | 验收规格 |
| e2e_test_spec.md | 端到端测试规格 |
| e2e_crud_spec.md | CRUD测试规格 |
| phase0_reflection.md | 阶段0反思 |
| phase2_reflection.md | 阶段2反思 |
| bug_records.md | Bug记录 |

### 6.4 Trae规格目录（.trae/specs/）

包含多个开发任务的规格文档，每个子目录包含：
- spec.md：规格说明
- tasks.md / task_list.md：任务列表
- checklist.md：检查清单

主要任务包括：
- UI动画增强
- 主题系统
- 卡牌UI重设计
- 桌面风格迁移
- 端到端测试
- 移动端功能对齐
- 文档优化等

---

## 七、配置文件说明

| 文件名 | 功能说明 |
|--------|----------|
| package.json | 项目依赖配置，定义npm脚本 |
| package-lock.json | 依赖版本锁定文件 |
| wrangler.toml | Cloudflare Workers配置 |
| .env.example | 环境变量示例文件 |
| .gitignore | Git忽略文件配置 |
| .eslintrc.cjs | ESLint代码检查配置 |
| _routes.json | Cloudflare路由配置 |
| playwright.config.js | Playwright测试配置 |

---

## 八、部署脚本说明

| 文件名 | 功能说明 |
|--------|----------|
| deploy.bat | Windows批处理一键部署脚本 |
| deploy.ps1 | PowerShell一键部署脚本 |
| summary/deploy.bat | summary目录下的Windows部署脚本 |
| summary/deploy.sh | Linux/Mac Bash部署脚本 |
| scripts/check-deployment.js | 部署状态检查脚本 |

---

## 九、测试报告目录

| 目录/文件 | 功能说明 |
|-----------|----------|
| e2e-test-report/ | 端到端测试报告目录 |
| e2e-test-report/index.html | 测试报告HTML |
| e2e-test-results.json | 测试结果JSON |
| lego-mobile/playwright-report/ | 移动端测试报告 |
| lego-mobile/test-results/ | 移动端测试结果 |

---

## 十、快速导航

### 按角色导航

**新加入开发者**：
1. 阅读 `summary/requirements.md` 了解项目需求
2. 阅读 `summary/overall-design.md` 了解系统架构
3. 阅读 `summary/deployment-guide.md` 了解部署方式
4. 查看 `functions/api/` 了解后端API
5. 查看各个 `.html` 文件了解前端页面

**前端开发人员**：
1. 查看 `css/` 目录了解样式
2. 查看 `js/` 目录了解前端逻辑
3. 查看 `design-mockups/` 了解UI设计
4. 阅读 `summary/frontend-design.md` 了解设计规范

**后端开发人员**：
1. 查看 `functions/api/` 了解API实现
2. 查看 `migrations/` 了解数据库结构
3. 阅读 `summary/api-documentation.md` 了解接口规范
4. 阅读 `summary/subsystem-design.md` 了解子系统设计

**测试人员**：
1. 阅读 `summary/test-requirements.md` 了解测试需求
2. 阅读 `summary/test-cases.md` 了解测试用例
3. 查看 `lego-mobile/tests/` 了解测试代码
4. 查看 `e2e-test-report/` 了解测试报告

**运维人员**：
1. 阅读 `summary/deployment-guide.md` 了解部署流程
2. 使用 `deploy.bat` 或 `deploy.ps1` 一键部署
3. 阅读 `summary/tencent-cloud-migration.md` 了解迁移方案

---

## 十一、版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| V1.0 | 2026-02-27 | 初始版本创建 |

---

**文档结束**
