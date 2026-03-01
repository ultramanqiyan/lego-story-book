# 首页3D卡片展示优化与Crash修复 Spec

## Why
首页的3D卡片演示点击后会Crash，需要修复并增加更多卡片展示样式，提升用户体验。

## What Changes
- 修复首页3D卡片点击Crash问题
- 增加5种2D卡片展示样式
- 增加5种3D卡片展示样式
- 增加多张卡片展示样式（扇形展开、横向堆叠、纵向堆叠等）
- 为每种展示样式创建详细的安卓模拟器UI点击测试用例

## Impact
- Affected specs: 首页UI、卡片组件、动画系统
- Affected code: `lego-mobile/src/screens/home/`, `lego-mobile/src/components/cards/`

## ADDED Requirements

### Requirement: 修复3D卡片点击Crash
系统应修复首页3D卡片点击后Crash的问题，确保用户可以正常点击卡片进行交互。

#### Scenario: 点击3D卡片不Crash
- **WHEN** 用户点击首页的3D卡片
- **THEN** 系统应正常响应点击事件，不发生Crash

### Requirement: 2D卡片展示样式
系统应提供5种2D卡片展示样式，包括：
1. 翻转卡片（Flip Card）
2. 滑动卡片（Slide Card）
3. 缩放卡片（Scale Card）
4. 旋转卡片（Rotate Card）
5. 弹跳卡片（Bounce Card）

#### Scenario: 2D卡片样式切换
- **WHEN** 用户选择不同的2D卡片样式
- **THEN** 系统应展示对应的卡片动画效果

### Requirement: 3D卡片展示样式
系统应提供5种3D卡片展示样式，包括：
1. 3D翻转（3D Flip）
2. 3D旋转（3D Rotate）
3. 3D透视（3D Perspective）
4. 3D倾斜（3D Tilt）
5. 3D深度（3D Depth）

#### Scenario: 3D卡片样式切换
- **WHEN** 用户选择不同的3D卡片样式
- **THEN** 系统应展示对应的3D卡片动画效果

### Requirement: 多张卡片展示样式
系统应提供多张卡片在一起的展示样式，包括：
1. 扇形展开（Fan Spread）
2. 横向堆叠（Horizontal Stack）
3. 纵向堆叠（Vertical Stack）
4. 网格布局（Grid Layout）
5. 轮播展示（Carousel）

#### Scenario: 多张卡片展示
- **WHEN** 用户选择多张卡片展示样式
- **THEN** 系统应以对应布局展示多张卡片

### Requirement: UI点击测试用例
系统应为每种展示样式创建详细的安卓模拟器UI点击测试用例，逐个测试并观测Crash。

#### Scenario: 测试用例执行
- **WHEN** 执行UI点击测试用例
- **THEN** 系统应记录测试结果，发现Crash立即修复
