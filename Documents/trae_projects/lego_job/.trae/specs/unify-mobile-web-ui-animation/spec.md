# 统一移动端与网页端UI动画效果规范

## Why

当前 lego-mobile 项目的移动端（React Native）和网页端在UI展示和动画特效上存在不一致的问题：
1. 移动端缺少网页端的部分动画效果（3D卡牌翻转、天气特效、粒子背景等）
2. 移动端组件样式与网页端不统一
3. 用户体验在不同平台间存在差异

需要统一两端UI，确保用户在任何平台都能获得一致的视觉体验。

## What Changes

- **BREAKING**: 重构移动端3D卡牌组件，与网页端效果保持一致
- **BREAKING**: 统一天气特效系统在移动端的实现
- **BREAKING**: 统一粒子背景动画效果
- **BREAKING**: 统一页面转场动画
- **BREAKING**: 统一按钮、卡片等基础组件样式
- 更新 Playwright 端到端测试，确保测试用例通过

## Impact

- Affected specs: UI动画、3D卡牌、天气特效、粒子系统
- Affected code:
  - lego-mobile/src/components/card3d/
  - lego-mobile/src/components/weather/
  - lego-mobile/src/components/particles/
  - lego-mobile/src/components/common/
  - lego-mobile/src/screens/
  - lego-mobile/tests/playwright/

## ADDED Requirements

### Requirement: 3D卡牌效果统一
The system SHALL 确保移动端的3D卡牌效果与网页端完全一致

#### Scenario: 卡牌展示
- **WHEN** 用户查看卡牌时
- **THEN** 卡牌应具有与网页端相同的3D透视效果
- **AND** 支持翻转动画
- **AND** 支持悬停/触摸倾斜效果

#### Scenario: 卡牌扇形展开
- **WHEN** 用户查看卡牌组时
- **THEN** 卡牌应以扇形展开
- **AND** 展开动画与网页端一致

### Requirement: 天气特效统一
The system SHALL 确保移动端的天气特效与网页端完全一致

#### Scenario: 晴天效果
- **WHEN** 故事场景为晴天时
- **THEN** 显示太阳动画、光晕效果
- **AND** 效果与网页端一致

#### Scenario: 雨天效果
- **WHEN** 故事场景为雨天时
- **THEN** 显示雨滴下落动画
- **AND** 支持雷电闪光效果
- **AND** 效果与网页端一致

#### Scenario: 雪天效果
- **WHEN** 故事场景为雪天时
- **THEN** 显示雪花飘落动画
- **AND** 效果与网页端一致

### Requirement: 粒子背景统一
The system SHALL 确保移动端的粒子背景与网页端完全一致

#### Scenario: 魔法粒子
- **WHEN** 页面需要氛围效果时
- **THEN** 显示浮动魔法粒子
- **AND** 粒子运动轨迹与网页端一致

### Requirement: 页面转场动画统一
The system SHALL 确保移动端的页面转场动画与网页端一致

#### Scenario: 页面切换
- **WHEN** 用户切换页面时
- **THEN** 显示流畅的转场动画
- **AND** 动画效果与网页端一致

### Requirement: 基础组件样式统一
The system SHALL 确保移动端的基础组件样式与网页端一致

#### Scenario: 按钮样式
- **WHEN** 显示按钮时
- **THEN** 按钮样式（颜色、圆角、阴影）与网页端一致

#### Scenario: 卡片样式
- **WHEN** 显示卡片时
- **THEN** 卡片样式（边框、阴影、圆角）与网页端一致

## MODIFIED Requirements

### Requirement: Web端兼容性处理
**原**: 移动端使用简化效果
**新**: 移动端使用与网页端完全相同的动画效果，通过平台适配实现

## REMOVED Requirements

### Requirement: 移动端简化效果
**Reason**: 需要与网页端保持一致
**Migration**: 使用统一的动画实现，通过平台检测做必要适配
