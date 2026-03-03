# Tasks

## Phase 1: 项目初始化与基础架构

- [ ] Task 1: 创建Android项目结构
  - [ ] SubTask 1.1: 创建lego-mobile-android目录
  - [ ] SubTask 1.2: 初始化Gradle项目配置
  - [ ] SubTask 1.3: 配置Kotlin和Jetpack Compose
  - [ ] SubTask 1.4: 设置模块结构（app, core, data, domain, test-utils）
  - [ ] SubTask 1.5: 配置测试框架（JUnit, MockK, Compose Testing）

- [ ] Task 2: 实现Core模块
  - [ ] SubTask 2.1: 创建颜色常量（COLORS）
  - [ ] SubTask 2.2: 创建角色颜色常量（ROLE_COLORS）
  - [ ] SubTask 2.3: 创建情节图标常量（PLOT_ICONS）
  - [ ] SubTask 2.4: 创建角色表情常量（CHARACTER_EMOJIS）
  - [ ] SubTask 2.5: 创建情节类型常量（PLOT_TYPES）
  - [ ] SubTask 2.6: 创建角色类型常量（ROLE_TYPES）
  - [ ] SubTask 2.7: 创建主题常量（THEMES）
  - [ ] SubTask 2.8: 编写Core模块单元测试

- [ ] Task 3: 实现Data模块 - API客户端
  - [ ] SubTask 3.1: 创建APIClient类（缓存、超时、错误处理）
  - [ ] SubTask 3.2: 实现UsersAPI
  - [ ] SubTask 3.3: 实现BooksAPI
  - [ ] SubTask 3.4: 实现ChaptersAPI
  - [ ] SubTask 3.5: 实现CharactersAPI
  - [ ] SubTask 3.6: 实现BookCharactersAPI
  - [ ] SubTask 3.7: 实现StoryAPI
  - [ ] SubTask 3.8: 实现PuzzleAPI
  - [ ] SubTask 3.9: 实现PlotOptionsAPI
  - [ ] SubTask 3.10: 实现ShareAPI
  - [ ] SubTask 3.11: 编写API模块单元测试

- [ ] Task 4: 实现Data模块 - 存储层
  - [ ] SubTask 4.1: 创建StorageManager类
  - [ ] SubTask 4.2: 实现SharedPreferences存储
  - [ ] SubTask 4.3: 实现用户数据存储
  - [ ] SubTask 4.4: 实现主题设置存储
  - [ ] SubTask 4.5: 编写存储模块单元测试

## Phase 2: 主题系统和动画

- [ ] Task 5: 实现主题系统
  - [ ] SubTask 5.1: 创建ThemeManager
  - [ ] SubTask 5.2: 定义颜色主题（default, immersive, gamified）
  - [ ] SubTask 5.3: 定义卡牌2D风格（5种）
  - [ ] SubTask 5.4: 定义卡牌3D风格（5种）
  - [ ] SubTask 5.5: 定义粒子效果（5种）
  - [ ] SubTask 5.6: 定义天气效果（5种）
  - [ ] SubTask 5.7: 创建主题切换Composable
  - [ ] SubTask 5.8: 编写主题系统单元测试

- [ ] Task 6: 实现动画系统
  - [ ] SubTask 6.1: 创建动画工具类（Bounce Easing等）
  - [ ] SubTask 6.2: 实现弹跳动画
  - [ ] SubTask 6.3: 实现渐入渐出动画
  - [ ] SubTask 6.4: 实现缩放动画
  - [ ] SubTask 6.5: 实现旋转动画
  - [ ] SubTask 6.6: 实现浮动动画
  - [ ] SubTask 6.7: 编写动画系统单元测试

## Phase 3: 公共组件

- [ ] Task 7: 实现基础UI组件
  - [ ] SubTask 7.1: 创建Button组件（primary, secondary, success, danger, outline变体）
  - [ ] SubTask 7.2: 创建Card组件（default, primary, secondary, success, warning, error变体）
  - [ ] SubTask 7.3: 创建Loading组件
  - [ ] SubTask 7.4: 创建EmptyState组件
  - [ ] SubTask 7.5: 创建Modal组件
  - [ ] SubTask 7.6: 创建Header组件
  - [ ] SubTask 7.7: 创建Toast组件
  - [ ] SubTask 7.8: 创建StepIndicator组件
  - [ ] SubTask 7.9: 编写基础组件单元测试

- [ ] Task 8: 实现特效组件
  - [ ] SubTask 8.1: 创建ParticleBackground组件
  - [ ] SubTask 8.2: 创建GlowOrbBackground组件
  - [ ] SubTask 8.3: 创建WeatherEffect组件
  - [ ] SubTask 8.4: 创建MagicParticles组件
  - [ ] SubTask 8.5: 编写特效组件单元测试

- [ ] Task 9: 实现卡牌组件
  - [ ] SubTask 9.1: 创建Card2D组件
  - [ ] SubTask 9.2: 创建Card3D组件
  - [ ] SubTask 9.3: 创建CardDeck3D组件
  - [ ] SubTask 9.4: 创建CardSelector2D组件
  - [ ] SubTask 9.5: 编写卡牌组件单元测试

## Phase 4: Context和状态管理

- [ ] Task 10: 实现状态管理
  - [ ] SubTask 10.1: 创建AuthViewModel（用户认证状态）
  - [ ] SubTask 10.2: 创建ThemeViewModel（主题状态）
  - [ ] SubTask 10.3: 创建ToastViewModel（消息提示状态）
  - [ ] SubTask 10.4: 创建GameViewModel（游戏状态）
  - [ ] SubTask 10.5: 编写状态管理单元测试

## Phase 5: 页面实现

- [ ] Task 11: 实现登录页(LoginScreen)
  - [ ] SubTask 11.1: 创建LoginScreen Composable
  - [ ] SubTask 11.2: 实现用户名输入
  - [ ] SubTask 11.3: 实现邮箱输入
  - [ ] SubTask 11.4: 实现登录按钮和动画
  - [ ] SubTask 11.5: 实现粒子背景
  - [ ] SubTask 11.6: 实现乐高积木动画
  - [ ] SubTask 11.7: 编写LoginScreen单元测试

- [ ] Task 12: 实现首页(HomeScreen)
  - [ ] SubTask 12.1: 创建HomeScreen Composable
  - [ ] SubTask 12.2: 实现问候语和欢迎卡片
  - [ ] SubTask 12.3: 实现功能列表
  - [ ] SubTask 12.4: 实现开始冒险按钮
  - [ ] SubTask 12.5: 实现Demo按钮区域
  - [ ] SubTask 12.6: 实现热门人仔横向列表
  - [ ] SubTask 12.7: 实现最近故事横向列表
  - [ ] SubTask 12.8: 实现下拉刷新
  - [ ] SubTask 12.9: 实现所有动画效果
  - [ ] SubTask 12.10: 编写HomeScreen单元测试

- [ ] Task 13: 实现书架页(BookshelfScreen)
  - [ ] SubTask 13.1: 创建BookshelfScreen Composable
  - [ ] SubTask 13.2: 实现书籍网格列表
  - [ ] SubTask 13.3: 实现创建故事按钮
  - [ ] SubTask 13.4: 实现下拉刷新
  - [ ] SubTask 13.5: 实现空状态
  - [ ] SubTask 13.6: 编写BookshelfScreen单元测试

- [ ] Task 14: 实现角色页(CharactersScreen)
  - [ ] SubTask 14.1: 创建CharactersScreen Composable
  - [ ] SubTask 14.2: 实现角色卡片网格
  - [ ] SubTask 14.3: 实现创建角色功能
  - [ ] SubTask 14.4: 实现编辑/删除功能
  - [ ] SubTask 14.5: 编写CharactersScreen单元测试

- [ ] Task 15: 实现冒险页(AdventureScreen)
  - [ ] SubTask 15.1: 创建AdventureScreen Composable
  - [ ] SubTask 15.2: 实现冒险故事列表
  - [ ] SubTask 15.3: 实现继续阅读入口
  - [ ] SubTask 15.4: 编写AdventureScreen单元测试

- [ ] Task 16: 实现设置页(SettingsScreen)
  - [ ] SubTask 16.1: 创建SettingsScreen Composable
  - [ ] SubTask 16.2: 实现账户信息显示
  - [ ] SubTask 16.3: 实现家长控制入口
  - [ ] SubTask 16.4: 实现主题风格设置
  - [ ] SubTask 16.5: 实现数据管理（清除缓存）
  - [ ] SubTask 16.6: 实现关于信息
  - [ ] SubTask 16.7: 实现退出登录
  - [ ] SubTask 16.8: 编写SettingsScreen单元测试

- [ ] Task 17: 实现家长控制页(ParentControlScreen)
  - [ ] SubTask 17.1: 创建ParentControlScreen Composable
  - [ ] SubTask 17.2: 实现时间管理功能
  - [ ] SubTask 17.3: 实现阅读统计功能
  - [ ] SubTask 17.4: 编写ParentControlScreen单元测试

- [ ] Task 18: 实现主题设置页(ThemeSettingsScreen)
  - [ ] SubTask 18.1: 创建ThemeSettingsScreen Composable
  - [ ] SubTask 18.2: 实现卡牌风格选择
  - [ ] SubTask 18.3: 实现特效选择
  - [ ] SubTask 18.4: 实现天气效果选择
  - [ ] SubTask 18.5: 编写ThemeSettingsScreen单元测试

- [ ] Task 19: 实现创建故事页(StoryCreateScreen)
  - [ ] SubTask 19.1: 创建StoryCreateScreen Composable
  - [ ] SubTask 19.2: 实现步骤指示器
  - [ ] SubTask 19.3: 实现书籍选择/创建步骤
  - [ ] SubTask 19.4: 实现故事类型选择步骤
  - [ ] SubTask 19.5: 实现角色选择和角色类型设置
  - [ ] SubTask 19.6: 实现确认创建步骤
  - [ ] SubTask 19.7: 编写StoryCreateScreen单元测试

- [ ] Task 20: 实现书籍详情页(BookDetailScreen)
  - [ ] SubTask 20.1: 创建BookDetailScreen Composable
  - [ ] SubTask 20.2: 实现统计信息显示
  - [ ] SubTask 20.3: 实现章节列表Tab
  - [ ] SubTask 20.4: 实现角色列表Tab
  - [ ] SubTask 20.5: 实现添加章节功能
  - [ ] SubTask 20.6: 实现添加角色功能
  - [ ] SubTask 20.7: 实现编辑书籍功能
  - [ ] SubTask 20.8: 实现分享功能
  - [ ] SubTask 20.9: 编写BookDetailScreen单元测试

- [ ] Task 21: 实现章节阅读页(ChapterScreen)
  - [ ] SubTask 21.1: 创建ChapterScreen Composable
  - [ ] SubTask 21.2: 实现章节标题和内容显示
  - [ ] SubTask 21.3: 实现关键词高亮
  - [ ] SubTask 21.4: 实现互动谜题功能
  - [ ] SubTask 21.5: 实现上一章/下一章导航
  - [ ] SubTask 21.6: 实现继续生成故事功能
  - [ ] SubTask 21.7: 实现情节选择弹窗
  - [ ] SubTask 21.8: 编写ChapterScreen单元测试

- [ ] Task 22: 实现故事导演页(StoryDirectorScreen)
  - [ ] SubTask 22.1: 创建StoryDirectorScreen Composable
  - [ ] SubTask 22.2: 实现情节选择功能
  - [ ] SubTask 22.3: 实现角色选择功能
  - [ ] SubTask 22.4: 实现章节生成功能
  - [ ] SubTask 22.5: 编写StoryDirectorScreen单元测试

- [ ] Task 23: 实现分享页(ShareScreen)
  - [ ] SubTask 23.1: 创建ShareScreen Composable
  - [ ] SubTask 23.2: 实现分享码生成
  - [ ] SubTask 23.3: 实现分享功能
  - [ ] SubTask 23.4: 编写ShareScreen单元测试

- [ ] Task 24: 实现Demo页面
  - [ ] SubTask 24.1: 创建Demo6Grid2D（2D网格卡牌）
  - [ ] SubTask 24.2: 创建Demo7Flip3D（3D翻转卡牌）
  - [ ] SubTask 24.3: 创建Demo8FanSpread（扇形展开卡牌）
  - [ ] SubTask 24.4: 创建Demo9HorizontalStack（横向堆叠卡牌）
  - [ ] SubTask 24.5: 创建Demo10VerticalStack（纵向堆叠卡牌）
  - [ ] SubTask 24.6: 创建Card3DDemoScreen（3D卡牌演示）
  - [ ] SubTask 24.7: 编写Demo页面单元测试

## Phase 6: 导航系统

- [ ] Task 25: 实现导航系统
  - [ ] SubTask 25.1: 创建AppNavigation Composable
  - [ ] SubTask 25.2: 创建AuthNavigation（登录流程）
  - [ ] SubTask 25.3: 创建MainNavigation（底部Tab导航）
  - [ ] SubTask 25.4: 创建HomeStack导航
  - [ ] SubTask 25.5: 创建BookshelfStack导航
  - [ ] SubTask 25.6: 创建CharactersStack导航
  - [ ] SubTask 25.7: 创建AdventureStack导航
  - [ ] SubTask 25.8: 创建SettingsStack导航
  - [ ] SubTask 25.9: 编写导航系统单元测试

## Phase 7: 测试与验证

- [ ] Task 26: 单元测试覆盖率验证
  - [ ] SubTask 26.1: 运行所有单元测试
  - [ ] SubTask 26.2: 生成覆盖率报告
  - [ ] SubTask 26.3: 确保行覆盖率>90%
  - [ ] SubTask 26.4: 确保分支覆盖率>90%
  - [ ] SubTask 26.5: 确保函数覆盖率>90%
  - [ ] SubTask 26.6: 补充缺失的测试用例

- [ ] Task 27: 集成测试
  - [ ] SubTask 27.1: 创建集成测试配置
  - [ ] SubTask 27.2: 测试API端点连通性
  - [ ] SubTask 27.3: 测试用户登录流程
  - [ ] SubTask 27.4: 测试故事创建流程
  - [ ] SubTask 27.5: 测试章节阅读流程
  - [ ] SubTask 27.6: 测试谜题交互流程
  - [ ] SubTask 27.7: 生成集成测试报告

- [ ] Task 28: Android模拟器测试
  - [ ] SubTask 28.1: 配置Android模拟器
  - [ ] SubTask 28.2: 安装APK到模拟器
  - [ ] SubTask 28.3: 测试所有页面显示
  - [ ] SubTask 28.4: 测试所有按钮点击
  - [ ] SubTask 28.5: 测试所有导航流程
  - [ ] SubTask 28.6: 监控Crash日志
  - [ ] SubTask 28.7: 录制测试过程视频
  - [ ] SubTask 28.8: 生成测试报告

## Phase 8: 构建与发布

- [ ] Task 29: 构建配置
  - [ ] SubTask 29.1: 配置Debug构建
  - [ ] SubTask 29.2: 配置Release构建
  - [ ] SubTask 29.3: 配置签名
  - [ ] SubTask 29.4: 生成APK

- [ ] Task 30: 文档编写
  - [ ] SubTask 30.1: 编写README文档
  - [ ] SubTask 30.2: 编写构建指南
  - [ ] SubTask 30.3: 编写测试指南

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 1
- Task 5 depends on Task 2
- Task 6 depends on Task 2
- Task 7 depends on Task 5, Task 6
- Task 8 depends on Task 5, Task 6
- Task 9 depends on Task 5, Task 6
- Task 10 depends on Task 3, Task 4
- Task 11 depends on Task 7, Task 8, Task 10
- Task 12 depends on Task 7, Task 8, Task 9, Task 10
- Task 13 depends on Task 7, Task 10
- Task 14 depends on Task 7, Task 10
- Task 15 depends on Task 7, Task 10
- Task 16 depends on Task 7, Task 10
- Task 17 depends on Task 7, Task 10
- Task 18 depends on Task 7, Task 10
- Task 19 depends on Task 7, Task 9, Task 10
- Task 20 depends on Task 7, Task 9, Task 10
- Task 21 depends on Task 7, Task 8, Task 9, Task 10
- Task 22 depends on Task 7, Task 9, Task 10
- Task 23 depends on Task 7, Task 10
- Task 24 depends on Task 7, Task 9
- Task 25 depends on Task 11, Task 12, Task 13, Task 14, Task 15, Task 16
- Task 26 depends on Task 1 through Task 25
- Task 27 depends on Task 26
- Task 28 depends on Task 27, Task 29
- Task 29 depends on Task 1 through Task 25
- Task 30 depends on Task 28
