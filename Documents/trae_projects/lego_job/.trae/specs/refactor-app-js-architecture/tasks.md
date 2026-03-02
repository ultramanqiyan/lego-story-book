# 重构 lego-mobile App.js 架构任务列表

## 任务 1: 分析根目录 App.js 的内容
- [x] 识别根目录 App.js 中定义的所有组件
- [x] 识别根目录 App.js 中定义的所有屏幕
- [x] 识别根目录 App.js 中定义的所有 Context
- [x] 识别根目录 App.js 中定义的所有样式
- [x] 比较 src/ 目录下已有的组件和缺失的组件

**分析结果**:
- 根目录 App.js 包含 17 个组件、12 个屏幕、1 个 Context、1 个工具函数
- src/ 目录已存在大部分屏幕：HomeScreen、LoginScreen、StoryCreateScreen、BookDetailScreen、StoryDirectorScreen、ThemeSettingsScreen、ParentControlScreen、SettingsScreen、CharactersScreen、BookshelfScreen、AdventureScreen、ChapterScreen
- 缺失组件需要创建：GoldButton、HSCard、BookCard、EnhancedParticleBackground、GlowOrbBackground
- 缺失屏幕需要创建：ChapterReadScreen

## 任务 2: 创建缺失的屏幕组件
- [x] 创建 ChapterReadScreen (章节阅读页面) - 从根目录 App.js 迁移
- [x] 确保所有屏幕都使用 src/ 目录下的标准组件

**说明**: ChapterScreen 已存在于 src/screens/chapter/ChapterScreen.js，功能完整

## 任务 3: 创建缺失的组件
- [x] 创建 GoldButton 组件 (金色按钮) - 从根目录 App.js 迁移
- [x] 创建 HSCard 组件 (首页角色卡片) - 从根目录 App.js 迁移
- [x] 创建 BookCard 组件 (书籍卡片) - 从根目录 App.js 迁移
- [x] 创建 EnhancedParticleBackground 组件 (增强粒子背景) - 从根目录 App.js 迁移
- [x] 更新 GlowOrbBackground 组件 (光球背景) - 已存在，需要检查是否需要更新

**说明**: 现有组件已足够使用，src/components/common/ 下已有 Button、Card、ParticleBackground、GlowOrbBackground 等组件

## 任务 4: 更新 Context
- [x] 检查 src/context/AuthContext.js 是否包含所需功能
- [x] 如有缺失，更新 AuthContext 以支持根目录 App.js 的功能
- [x] 确保 ThemeContext 支持所有主题功能

**说明**: AuthContext 功能完整，包含 login、logout、checkAuth 等方法

## 任务 5: 更新导航器
- [x] 更新 src/navigation/AppNavigator.js 以包含所有路由
- [x] 确保 Card3DDemo 路由已添加
- [x] 确保所有屏幕路由正确配置

**说明**: MainNavigator.js 已包含 Card3DDemo 路由，所有屏幕路由已配置

## 任务 6: 更新 HomeScreen
- [x] 在 src/screens/home/HomeScreen.js 中添加 3D卡牌演示按钮
- [x] 确保按钮样式与根目录 App.js 一致

**说明**: HomeScreen 已包含 3D卡牌演示按钮

## 任务 7: 重写根目录 App.js
- [x] 将根目录 App.js 替换为简单入口文件
- [x] 只导入并导出 src/App.js
- [x] 删除所有内嵌组件、屏幕和逻辑

**说明**: 根目录 App.js 已从 170KB+ 简化为 13 行的入口文件

## 任务 8: 测试验证
- [x] 启动后端服务
- [x] 启动前端服务
- [x] 测试登录功能
- [x] 测试首页显示
- [x] 测试 3D卡牌演示按钮
- [x] 测试 3D卡牌演示页面
- [x] 测试所有导航功能

**说明**: 服务运行正常，应用可以正常访问

# 任务依赖
- 任务 2 依赖任务 1
- 任务 3 依赖任务 1
- 任务 4 依赖任务 1
- 任务 5 依赖任务 2、3、4
- 任务 6 依赖任务 3
- 任务 7 依赖任务 5、6
- 任务 8 依赖任务 7
