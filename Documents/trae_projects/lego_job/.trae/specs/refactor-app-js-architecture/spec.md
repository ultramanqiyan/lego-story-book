# 重构 lego-mobile App.js 架构规范

## Why

当前 lego-mobile 项目的根目录 App.js 文件过大（170KB+），包含了所有组件、屏幕、样式和逻辑，导致：
1. 代码难以维护和扩展
2. 违反了 React Native 的标准架构原则
3. 与 src/ 目录下的标准架构重复
4. 构建和加载性能受影响

## What Changes

- **BREAKING**: 将根目录 App.js 替换为简单的入口文件，指向 src/App.js
- **BREAKING**: 将根目录 App.js 中的所有组件迁移到 src/ 目录下的适当位置
- **BREAKING**: 统一使用 src/ 目录下的标准 React Native 架构
- 保留所有现有功能，包括 3D卡牌演示

## Impact

- Affected specs: 所有使用 lego-mobile 的功能
- Affected code: 
  - lego-mobile/App.js (重写)
  - lego-mobile/src/screens/ (可能需要添加缺失的屏幕)
  - lego-mobile/src/components/ (可能需要添加缺失的组件)
  - lego-mobile/src/context/ (可能需要添加缺失的 context)

## ADDED Requirements

### Requirement: 标准架构入口
The system SHALL 使用标准的 React Native 入口文件结构

#### Scenario: 应用启动
- **WHEN** 应用启动时
- **THEN** 根目录 App.js 只作为入口点，导入 src/App.js

### Requirement: 组件迁移
The system SHALL 将根目录 App.js 中的所有组件迁移到 src/ 目录

#### Scenario: 组件分离
- **WHEN** 重构完成时
- **THEN** 所有组件应该在 src/components/ 或 src/screens/ 中
- **AND** 每个组件应该有单一职责

### Requirement: Context 迁移
The system SHALL 将 AuthContext 等 context 迁移到 src/context/

#### Scenario: Context 分离
- **WHEN** 重构完成时
- **THEN** 所有 Context 应该在 src/context/ 目录下
- **AND** 使用标准的 Provider 模式

### Requirement: API 客户端统一
The system SHALL 使用 src/api/client.js 作为唯一的 API 客户端

#### Scenario: API 调用
- **WHEN** 应用需要调用 API 时
- **THEN** 使用 src/api/client.js
- **AND** 不再使用根目录 App.js 中内嵌的 apiRequest 函数

### Requirement: 保留 3D卡牌演示功能
The system SHALL 保留 3D卡牌演示按钮和功能

#### Scenario: 功能保留
- **WHEN** 用户登录后进入首页
- **THEN** 可以看到 "🎴 3D卡牌演示" 按钮
- **AND** 点击按钮可以跳转到 3D卡牌演示页面

## MODIFIED Requirements

### Requirement: 应用入口
**原**: 根目录 App.js 包含完整应用逻辑
**新**: 根目录 App.js 只作为入口，指向 src/App.js

### Requirement: 导航结构
**原**: 导航定义在根目录 App.js 中
**新**: 导航定义在 src/navigation/AppNavigator.js 中

## REMOVED Requirements

### Requirement: 单一文件架构
**Reason**: 违反了 React Native 标准架构原则
**Migration**: 所有功能已迁移到 src/ 目录下的标准位置
