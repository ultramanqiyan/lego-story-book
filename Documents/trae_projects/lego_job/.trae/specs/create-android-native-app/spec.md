# Android原生应用复刻规范

## Why
用户需要一个使用Android原生开发完全复刻lego-mobile React Native应用的版本，要求所有页面、功能、效果完全一致，并且代码质量和测试覆盖率要达到高标准。

## What Changes
- 创建全新的 `lego-mobile-android` 目录
- 使用 Kotlin + Jetpack Compose 开发Android原生应用
- 完全复刻所有页面、功能、动画效果
- 实现完整的单元测试（行覆盖率>90%）
- 完成集成测试和模拟器点击测试

## Impact
- 新增目录: `lego-mobile-android/`
- 不影响现有 `lego-mobile/` 目录的任何内容
- 独立的构建环境和依赖管理

## ADDED Requirements

### Requirement: 项目结构
系统应创建独立的Android项目结构，包含以下模块：

#### Scenario: 项目初始化
- **WHEN** 创建新项目
- **THEN** 项目结构应包含：
  - app模块（主应用）
  - core模块（公共组件、工具类）
  - data模块（API、数据层）
  - domain模块（业务逻辑）
  - test-utils模块（测试工具）

### Requirement: 页面复刻
系统应完全复刻以下页面：

#### Scenario: 首页(HomeScreen)
- **WHEN** 用户进入首页
- **THEN** 应显示：
  - 问候语和欢迎卡片
  - 功能列表
  - 开始冒险按钮
  - Demo按钮区域
  - 热门人仔横向列表
  - 最近故事横向列表
  - 下拉刷新功能
  - 动画效果（弹跳、渐入、浮动）

#### Scenario: 登录页(LoginScreen)
- **WHEN** 用户未登录
- **THEN** 应显示：
  - 乐高图标和标题
  - 用户名输入框
  - 邮箱输入框（可选）
  - 开始冒险按钮
  - 粒子背景效果
  - 乐高积木动画

#### Scenario: 书架页(BookshelfScreen)
- **WHEN** 用户进入书架
- **THEN** 应显示：
  - 书籍网格列表（2列）
  - 创建故事按钮
  - 下拉刷新
  - 空状态提示

#### Scenario: 角色页(CharactersScreen)
- **WHEN** 用户进入角色页
- **THEN** 应显示：
  - 角色卡片网格
  - 创建角色按钮
  - 编辑/删除功能

#### Scenario: 冒险页(AdventureScreen)
- **WHEN** 用户进入冒险页
- **THEN** 应显示：
  - 冒险故事列表
  - 继续阅读入口

#### Scenario: 设置页(SettingsScreen)
- **WHEN** 用户进入设置
- **THEN** 应显示：
  - 账户信息
  - 家长控制入口
  - 主题风格设置
  - 数据管理
  - 关于信息
  - 退出登录

#### Scenario: 创建故事页(StoryCreateScreen)
- **WHEN** 用户创建故事
- **THEN** 应显示：
  - 步骤指示器
  - 书籍选择/创建
  - 故事类型选择
  - 角色选择和角色类型设置
  - 确认创建

#### Scenario: 书籍详情页(BookDetailScreen)
- **WHEN** 用户查看书籍详情
- **THEN** 应显示：
  - 统计信息（章节数、角色数、字数）
  - 章节列表Tab
  - 角色列表Tab
  - 添加章节/角色按钮
  - 编辑书籍、分享功能

#### Scenario: 章节阅读页(ChapterScreen)
- **WHEN** 用户阅读章节
- **THEN** 应显示：
  - 章节标题和内容
  - 关键词高亮
  - 互动谜题
  - 上一章/下一章导航
  - 继续生成故事按钮
  - 情节选择弹窗

#### Scenario: Demo页面
- **WHEN** 用户查看Demo
- **THEN** 应显示：
  - Demo6: 2D网格卡牌
  - Demo7: 3D翻转卡牌
  - Demo8: 扇形展开卡牌
  - Demo9: 横向堆叠卡牌
  - Demo10: 纵向堆叠卡牌
  - Card3DDemo: 3D卡牌演示

### Requirement: API集成
系统应实现完整的API客户端：

#### Scenario: API调用
- **WHEN** 应用需要获取数据
- **THEN** 应支持：
  - 用户创建/登录
  - 书籍CRUD操作
  - 章节CRUD和生成
  - 角色管理
  - 谜题提交
  - 分享功能
  - 缓存机制
  - 超时处理
  - 错误处理

### Requirement: 主题系统
系统应实现完整的主题系统：

#### Scenario: 主题切换
- **WHEN** 用户切换主题
- **THEN** 应支持：
  - 经典乐高主题
  - 沉浸故事主题
  - 游戏冒险主题
  - 卡牌2D风格（5种）
  - 卡牌3D风格（5种）
  - 粒子效果（5种）
  - 天气效果（5种）

### Requirement: 动画效果
系统应实现所有动画效果：

#### Scenario: UI动画
- **WHEN** 页面加载或交互
- **THEN** 应包含：
  - 弹跳动画（Bounce Easing）
  - 渐入渐出动画
  - 缩放动画
  - 旋转动画
  - 浮动动画
  - 粒子背景
  - 天气效果
  - 3D卡牌翻转

### Requirement: 单元测试
系统应实现完整的单元测试：

#### Scenario: 测试覆盖率
- **WHEN** 运行测试
- **THEN** 应满足：
  - 行覆盖率 > 90%
  - 分支覆盖率 > 90%
  - 函数覆盖率 > 90%
  - 所有Screen UI代码有测试
  - 所有API模块有测试
  - 所有组件有测试
  - 测试验证实际内容，不仅是调用

### Requirement: 集成测试
系统应完成完整的集成测试：

#### Scenario: 集成测试执行
- **WHEN** 完成开发
- **THEN** 应验证：
  - 所有API端点连通性
  - 用户登录流程
  - 故事创建流程
  - 章节阅读流程
  - 谜题交互流程

### Requirement: 模拟器测试
系统应在Android模拟器上完成点击测试：

#### Scenario: 模拟器测试
- **WHEN** 在模拟器上测试
- **THEN** 应验证：
  - 所有页面可正常显示
  - 所有按钮可点击
  - 所有导航正常工作
  - 无Crash发生
  - 测试过程可视化

## MODIFIED Requirements
无修改的需求

## REMOVED Requirements
无移除的需求
