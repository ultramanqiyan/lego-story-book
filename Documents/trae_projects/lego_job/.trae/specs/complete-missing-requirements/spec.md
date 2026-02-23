# 完善缺失需求 Spec

## Why
根据需求文档检查，发现以下核心需求尚未完全实现：
1. AI提示词不完整 - 缺少【前情提要】、【本章角色】、【本章情节】、【解谜要求】参数
2. 谜题自动生成功能未实现 - 需求要求故事生成时自动生成谜题
3. 谜题展示和交互界面未实现 - 需求要求在关键节点显示选择题
4. AI模型版本不一致 - 需求要求doubao-1-5-pro-32k-250115，当前使用doubao-pro-32k
5. 提示词展示功能未实现 - 需求要求在故事内容下方展示提示词
6. 故事长度要求不统一 - 提示词要求300-500字，实际要求100-200字

## What Changes
- 修改 `/api/story` 接口，完善AI提示词参数
- 实现谜题自动生成逻辑
- 修改 `adventure.html`，实现谜题展示和交互界面
- 修正AI模型版本为doubao-1-5-pro-32k-250115
- 在 `adventure.html` 添加提示词展示功能
- 统一故事长度要求

## Impact
- Affected specs: 故事生成、谜题系统、提示词展示
- Affected code: functions/api/story.js, adventure.html

## ADDED Requirements

### Requirement: 完善AI提示词参数
系统SHALL在故事生成时提供完整的上下文信息，包括前情提要、本章角色、本章情节、解谜要求。

#### Scenario: 成功生成带完整上下文的故事
- **WHEN** 用户点击"添加章节"按钮
- **THEN** 系统调用AI接口，传递完整提示词
- **THEN** AI返回包含完整上下文的故事

### Requirement: 谜题自动生成
系统SHALL在故事生成时随机生成谜题，50%概率生成谜题。

#### Scenario: 成功生成带谜题的章节
- **WHEN** AI生成故事时随机触发
- **THEN** 返回包含puzzle字段的JSON
- **THEN** puzzle包含question、options、answer、hint、type

### Requirement: 谜题展示和交互
系统SHALL在故事阅读界面显示谜题，用户通过点击选项答题。

#### Scenario: 显示谜题界面
- **WHEN** 用户阅读到包含谜题的章节
- **THEN** 显示4个选项按钮（A/B/C/D）
- **THEN** 用户点击选项后立即验证答案

### Requirement: 提示词展示
系统SHALL在故事内容下方展示提交给AI的提示词，支持折叠/展开。

#### Scenario: 展开提示词
- **WHEN** 用户点击"查看提示词"按钮
- **THEN** 显示包含书籍角色、前情提要、本章角色、本章情节、解谜要求的提示词
- **THEN** 用户可以折叠/展开查看

## MODIFIED Requirements

### Requirement: AI提示词
将提示词扩展为包含所有必需参数。

**Breaking**: 提示词格式变更
**Migration**: 更新所有调用story接口的地方，传递完整参数

### Requirement: AI模型版本
修正模型版本为doubao-1-5-pro-32k-250115。

**Breaking**: 模型名称变更
**Migration**: 更新story.js中的模型配置

## REMOVED Requirements
无
