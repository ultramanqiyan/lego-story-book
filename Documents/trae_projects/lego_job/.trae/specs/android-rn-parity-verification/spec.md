# Android 与 React Native 一致性验证规范

## Why

当前 Android 原生 APP (lego-mobile-android) 与 React Native 版本 (lego-mobile) 存在显著差异：
- 核心屏幕完成率仅 78.6%
- 3D卡牌组件完全缺失 (0%)
- 主题配置完成率仅 40%
- 关键功能如故事导演台、分享功能缺失

需要通过多种验证手段确保 Android 原生版本与 React Native 版本的页面、动画、布局、样式完全一致。

## What Changes

### 1. 静态代码检查
- 创建 UI 对比检查工具，自动对比 RN 和 Android 的布局代码
- 建立样式一致性检查规则
- 实现动画参数对比验证

### 2. 测试体系建设
- 单元测试：验证主题、动画、样式配置的一致性
- 集成测试：验证组件交互行为一致性
- UI测试：验证视觉效果一致性
- 快照测试：对比 RN 和 Android 的渲染结果

### 3. PM验收流程
- 建立基于需求文档的验收标准
- 创建功能对比检查清单
- 实现自动化验收报告生成

## Impact

- Affected specs: android-ui-e2e-testing, mobile-feature-parity
- Affected code: lego-mobile-android 整个项目

---

## 缺失功能详细分析

### 一、缺失屏幕 (高优先级)

| 屏幕 | 描述 | 优先级 |
|------|------|--------|
| LoadingScreen | 应用启动加载页面 | P0 |
| StoryDirectorScreen | 故事导演台 - 核心创作功能 | P0 |
| ShareScreen | 分享功能页面 | P1 |

### 二、缺失组件 (高优先级)

| 组件 | 描述 | 优先级 |
|------|------|--------|
| Card3D | 3D卡牌组件 | P0 |
| Card3DVariant | 3D卡牌变体 | P0 |
| CardDeck3D | 3D卡组 | P0 |
| CardDeckVariants | 卡组变体 | P0 |
| Card2D | 2D卡牌 | P0 |
| CardSelector2D | 2D卡牌选择器 | P0 |
| StagePreview | 舞台预览 | P1 |
| CardDeck | 卡组 | P1 |
| WeatherEffect | 天气特效组件 | P1 |
| KeywordHighlight | 关键词高亮 | P1 |
| PromptPanel | 提示面板 | P1 |
| CharacterForm | 角色表单 | P1 |
| Header | 通用头部 | P2 |
| StepIndicator | 步骤指示器 | P2 |

### 三、缺失动画功能

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 3D卡牌倾斜 | calculateTiltAngle | P0 |
| 扇形卡牌布局 | calculateFanPosition | P0 |
| 完整粒子系统 | PARTICLES_CONFIG | P1 |
| 微交互配置 | MICRO_INTERACTION_CONFIG | P2 |

### 四、缺失主题配置

| 配置 | 描述 | 优先级 |
|------|------|--------|
| typography | 排版系统 | P0 |
| spacing | 间距系统 | P0 |
| shadows | 阴影配置 | P1 |
| rarity colors | 稀有度颜色 | P1 |
| character type colors | 角色类型颜色 | P1 |
| gradient presets | 渐变预设 | P2 |

---

## 验证方法

### 方法一：静态代码检查

#### 1.1 布局结构对比
- 解析 RN 的 JSX 布局结构
- 解析 Android 的 Compose 布局结构
- 对比层级、属性、样式

#### 1.2 样式值对比
- 提取 RN 的 StyleSheet 定义
- 提取 Android 的 Modifier 定义
- 对比颜色、尺寸、间距、圆角等值

#### 1.3 动画参数对比
- 提取 RN 的 Animated 配置
- 提取 Android 的 AnimationSpec
- 对比时长、缓动曲线、关键帧

### 方法二：测试验证

#### 2.1 单元测试
- 主题配置值测试
- 动画参数测试
- 颜色常量测试

#### 2.2 集成测试
- 组件渲染测试
- 导航流程测试
- 状态管理测试

#### 2.3 UI测试
- 截图对比测试
- 交互行为测试
- 动画效果测试

#### 2.4 快照测试
- 组件树快照
- 渲染输出快照
- 样式快照

### 方法三：PM验收

#### 3.1 功能验收
- 基于需求文档逐项验收
- 功能完整性检查
- 用户流程验证

#### 3.2 视觉验收
- 设计稿对比
- RN版本对比
- 动画效果对比

#### 3.3 体验验收
- 性能指标
- 流畅度评估
- 易用性评估

---

## 验收标准

### 屏幕一致性标准
- [ ] 所有屏幕布局结构一致
- [ ] 所有屏幕样式值误差 < 1px
- [ ] 所有屏幕颜色值完全一致
- [ ] 所有屏幕文字内容一致

### 动画一致性标准
- [ ] 动画时长误差 < 50ms
- [ ] 缓动曲线视觉效果一致
- [ ] 动画触发时机一致
- [ ] 动画结束状态一致

### 交互一致性标准
- [ ] 点击响应区域一致
- [ ] 手势操作一致
- [ ] 反馈效果一致
- [ ] 状态变化一致

### 性能标准
- [ ] 页面加载时间 < 1s
- [ ] 动画帧率 >= 60fps
- [ ] 内存占用 < 200MB
- [ ] 无明显卡顿

---

## 约束条件

1. **代码限制**：所有开发、测试、工具代码只能在 lego-mobile-android 目录下
2. **对比基准**：以 lego-mobile 的 React Native 实现为基准
3. **测试覆盖**：核心功能测试覆盖率 >= 80%
4. **验收通过率**：PM验收通过率 >= 95%
