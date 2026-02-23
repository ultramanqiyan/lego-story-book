# 故事角色分配功能完善 Spec

## Why
当前故事创建页面只支持选择一个主角，但需求文档要求支持主角、配角、反派、路人四种角色类型，并且可以选择多个角色。

## What Changes
- 修改story-create.html页面，支持选择多个角色
- 为每个角色添加角色类型选择（主角、配角、反派、路人）
- 为每个角色添加自定义名称输入
- 主角必须有且仅有一个
- 配角、反派、路人可选

## Impact
- Affected specs: 故事创建流程
- Affected code: story-create.html, functions/api/book-characters.js

## ADDED Requirements

### Requirement: 多角色选择
系统 SHALL 允许用户选择多个角色。

#### Scenario: 选择多个角色
- **WHEN** 用户选择角色
- **THEN** 可以继续选择更多角色

### Requirement: 角色类型选择
系统 SHALL 允许用户为每个角色选择角色类型。

#### Scenario: 选择角色类型
- **WHEN** 用户选择一个角色
- **THEN** 可以选择角色类型（主角、配角、反派、路人）

### Requirement: 主角唯一性
系统 SHALL 确保主角有且仅有一个。

#### Scenario: 主角唯一
- **WHEN** 用户选择主角
- **THEN** 如果已有主角，原主角自动变为配角

### Requirement: 自定义名称
系统 SHALL 要求为每个角色设置自定义名称。

#### Scenario: 输入自定义名称
- **WHEN** 用户选择角色
- **THEN** 必须输入自定义名称（1-20个字符）
