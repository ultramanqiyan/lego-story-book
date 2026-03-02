# 乐高故事书桌游风格APP UI规格

## Why

现有的 lego-mobile APP 使用传统的移动端UI组件（按钮、Tab导航等），缺乏游戏化体验和沉浸感。为了提升用户（尤其是儿童用户）的参与度和趣味性，需要将整个APP界面重新设计为类似三国杀、炉石传说等桌游风格的卡牌化UI，让用户仿佛置身于一个魔法桌游世界。

## What Changes

### 核心变化
- **全新项目结构**：在 `lego-mobile-game` 目录下创建全新的 React Native 项目
- **API层复用**：直接拷贝 lego-mobile 的 API 层代码，保持接口不变
- **UI完全重构**：移除所有按钮、Tab等传统元素，采用卡牌、手势、动画等桌游交互方式
- **TDD开发**：每个文件单元测试覆盖率必须 >90%

### 功能保留（不变）
- 书籍管理：创建、查看、编辑、删除书籍
- 角色管理：创建、查看、编辑、删除人仔角色
- 故事管理：创建故事、导演模式
- 章节管理：查看章节、生成新章节
- 冒险模式：答题冒险、谜题互动
- 分享功能：故事分享

### UI改造要点
- **移除底部Tab导航**：改为手势滑动+卡牌菜单
- **移除传统按钮**：改为卡牌点击、手势操作
- **卡牌化展示**：书籍、角色、章节都以卡牌形式呈现
- **3D动画效果**：卡牌翻转、悬浮、粒子特效
- **游戏化交互**：拖拽选择、滑动切换、长按操作

## Impact

- Affected specs: 全新项目，不影响现有 lego-mobile
- Affected code: lego-mobile-game（新建目录）

## ADDED Requirements

### Requirement: 项目结构

系统SHALL在 `lego-mobile-game` 目录下创建完整的 React Native 项目结构。

#### Scenario: 项目初始化
- **WHEN** 开发者创建项目
- **THEN** 系统创建包含以下结构的项目：
  - `src/api/` - API层（从lego-mobile拷贝）
  - `src/components/` - UI组件
  - `src/screens/` - 页面屏幕
  - `src/navigation/` - 导航系统
  - `src/context/` - 状态管理
  - `src/hooks/` - 自定义Hooks
  - `src/styles/` - 样式系统
  - `src/utils/` - 工具函数
  - `__tests__/` - 测试文件

### Requirement: API层复用

系统SHALL完整复用 lego-mobile 的 API 层代码。

#### Scenario: API拷贝
- **WHEN** 创建新项目
- **THEN** 系统拷贝以下API模块：
  - `client.js` - API客户端
  - `books.js` - 书籍API
  - `characters.js` - 角色API
  - `chapters.js` - 章节API
  - `story.js` - 故事API
  - `puzzle.js` - 谜题API
  - `share.js` - 分享API
  - `users.js` - 用户API
  - `types.js` - 类型定义

### Requirement: 桌游风格主题系统

系统SHALL提供完整的桌游风格主题系统。

#### Scenario: 主题色彩
- **WHEN** 应用启动
- **THEN** 系统应用以下主题色彩：
  - 主背景：深蓝紫渐变 `#1a1a2e` → `#16213e`
  - 卡牌背景：羊皮纸质感 `#f4e4ba`
  - 金色装饰：`#ffd700`
  - 魔法蓝：`#4fc3f7`
  - 魔法紫：`#ba68c8`

#### Scenario: 稀有度色系
- **WHEN** 显示卡牌
- **THEN** 系统根据稀有度显示对应颜色：
  - 普通（白色）：`#ffffff` 边框
  - 稀有（蓝色）：`#4fc3f7` 边框 + 轻微发光
  - 史诗（紫色）：`#ba68c8` 边框 + 中等发光
  - 传说（橙色）：`#ff9800` 边框 + 强烈发光

### Requirement: 卡牌组件系统

系统SHALL提供完整的卡牌组件系统。

#### Scenario: 基础卡牌
- **WHEN** 渲染卡牌组件
- **THEN** 卡牌具有以下特性：
  - 3D翻转效果（rotateY动画）
  - 悬停上浮效果（translateY: -15px）
  - 金色边框光晕
  - 稀有度发光效果

#### Scenario: 角色卡牌
- **WHEN** 显示角色
- **THEN** 卡牌包含：
  - 角色图像区域
  - 名称区域
  - 属性标签（性格、说话风格）
  - 角色类型边框（主角金色、反派红色、配角银色）

#### Scenario: 书籍卡牌
- **WHEN** 显示书籍
- **THEN** 卡牌包含：
  - 书籍封面图像
  - 标题区域
  - 章节数/字数统计
  - 进度指示器

### Requirement: 手势导航系统

系统SHALL提供手势驱动的导航系统，替代传统Tab导航。

#### Scenario: 主菜单访问
- **WHEN** 用户从屏幕左侧边缘向右滑动
- **THEN** 系统显示主菜单卡牌扇形展开

#### Scenario: 返回操作
- **WHEN** 用户从屏幕左侧边缘向右滑动（非菜单状态）
- **THEN** 系统返回上一页

#### Scenario: 页面切换
- **WHEN** 用户左右滑动
- **THEN** 系统切换到相邻页面（卡牌堆叠切换效果）

### Requirement: 首页屏幕

系统SHALL提供桌游风格的首页。

#### Scenario: 首页布局
- **WHEN** 用户进入首页
- **THEN** 显示：
  - 粒子漂浮背景动画
  - 金色渐变标题
  - 功能入口卡牌（书架、角色、冒险、设置）
  - 最近故事卡牌列表
  - 热门角色卡牌展示

#### Scenario: 功能入口交互
- **WHEN** 用户点击功能卡牌
- **THEN** 卡牌执行3D翻转动画并导航到对应页面

### Requirement: 书架屏幕

系统SHALL提供桌游风格的书架页面。

#### Scenario: 书籍展示
- **WHEN** 用户进入书架
- **THEN** 书籍以卡牌堆叠形式展示

#### Scenario: 书籍选择
- **WHEN** 用户悬停/触摸书籍卡牌
- **THEN** 卡牌扇形展开，显示详细信息

#### Scenario: 创建书籍
- **WHEN** 用户长按空白区域
- **THEN** 显示创建书籍的魔法书弹窗

### Requirement: 角色屏幕

系统SHALL提供桌游风格的角色管理页面。

#### Scenario: 角色展示
- **WHEN** 用户进入角色页面
- **THEN** 角色以炉石风格卡牌网格展示

#### Scenario: 角色筛选
- **WHEN** 用户滑动角色类型选择器
- **THEN** 筛选显示对应类型的角色

#### Scenario: 角色创建
- **WHEN** 用户双指捏合
- **THEN** 显示角色创建魔法书

### Requirement: 故事创建屏幕

系统SHALL提供桌游风格的故事创建流程。

#### Scenario: 步骤指示
- **WHEN** 用户创建故事
- **THEN** 显示卡牌步骤指示器（选择书籍→选择情节→选择角色→确认）

#### Scenario: 书籍选择
- **WHEN** 选择书籍步骤
- **THEN** 书籍以卡牌扇形展开供选择

#### Scenario: 角色选择
- **WHEN** 选择角色步骤
- **THEN** 角色以炉石卡牌形式展示，支持拖拽到已选区域

### Requirement: 章节屏幕

系统SHALL提供桌游风格的章节阅读页面。

#### Scenario: 章节展示
- **WHEN** 用户查看章节
- **THEN** 内容以故事卡形式展示，关键字高亮

#### Scenario: 谜题交互
- **WHEN** 章节包含谜题
- **THEN** 谜题选项以卡牌形式展示，选择后显示正确/错误动画

### Requirement: 冒险屏幕

系统SHALL提供桌游风格的冒险模式页面。

#### Scenario: 冒险界面
- **WHEN** 用户进入冒险模式
- **THEN** 显示：
  - 时间沙漏动画
  - 故事内容卡牌
  - 谜题选项卡牌

#### Scenario: 答题交互
- **WHEN** 用户选择答案
- **THEN** 显示正确（金色粒子爆发）或错误（红色闪烁）动画

### Requirement: 设置屏幕

系统SHALL提供桌游风格的设置页面。

#### Scenario: 设置展示
- **WHEN** 用户进入设置
- **THEN** 设置选项以卡牌列表形式展示

#### Scenario: 家长控制
- **WHEN** 用户访问家长控制
- **THEN** 显示时间统计卡牌和控制开关

### Requirement: 动画效果系统

系统SHALL提供完整的动画效果系统。

#### Scenario: 卡牌入场
- **WHEN** 卡牌首次显示
- **THEN** 执行入场动画序列：
  - 从牌堆飞出（0.5s）
  - 3D翻转展示（0.3s）
  - 落位弹跳（0.2s）

#### Scenario: 选择动画
- **WHEN** 用户选择卡牌
- **THEN** 执行选择动画：
  - 金色光环环绕
  - 卡牌飞向已选区域
  - 落位确认动画

#### Scenario: 粒子效果
- **WHEN** 显示传说级卡牌
- **THEN** 显示粒子环绕效果

### Requirement: 测试覆盖

系统SHALL满足严格的测试覆盖要求。

#### Scenario: 单元测试
- **WHEN** 开发任何代码文件
- **THEN** 对应测试文件覆盖率 >90%

#### Scenario: 集成测试
- **WHEN** 完成功能模块
- **THEN** 执行集成测试验证模块间交互

#### Scenario: E2E测试
- **WHEN** 完成全部开发
- **THEN** Playwright测试覆盖所有页面和功能

## MODIFIED Requirements

无（全新项目）

## REMOVED Requirements

无（全新项目）
