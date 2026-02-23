# 实现遗漏需求 Spec

## Why
根据需求追溯文档分析，存在多个高优先级需求未实现，包括书籍选择步骤、书籍角色管理、关键词高亮、提示机制、尝试次数控制等。

## What Changes
- 实现书籍选择步骤（第一步选择书籍）
- 实现书籍角色管理页面
- 实现角色自定义名称唯一性检查
- 实现关键词高亮显示
- 实现提示机制（答错后给提示）
- 实现尝试次数控制（3次机会）
- 新增端到端测试用例
- 保持行覆盖率90%以上

## Impact
- Affected specs: 故事创建流程、书籍管理、解密互动
- Affected code: story-create.html, book.html, adventure.html, puzzle.js

## ADDED Requirements

### Requirement: 书籍选择步骤
系统 SHALL 在故事创建第一步要求用户选择或创建书籍。

#### Scenario: 选择已有书籍
- **WHEN** 用户开始创建故事
- **THEN** 显示已有书籍列表供选择

#### Scenario: 创建新书籍
- **WHEN** 用户选择创建新书籍
- **THEN** 显示书籍名称输入框

### Requirement: 书籍角色管理页面
系统 SHALL 提供书籍角色管理功能。

#### Scenario: 查看书籍角色
- **WHEN** 用户进入书籍详情页
- **THEN** 显示所有已定义的角色

#### Scenario: 管理角色
- **WHEN** 用户点击管理角色
- **THEN** 可以修改名称、删除角色、添加新角色

### Requirement: 角色名称唯一性
系统 SHALL 确保角色自定义名称在书籍内唯一。

#### Scenario: 检查唯一性
- **WHEN** 用户输入自定义名称
- **THEN** 系统检查名称是否重复

### Requirement: 关键词高亮
系统 SHALL 在故事展示时高亮关键词。

#### Scenario: 高亮显示
- **WHEN** 显示故事内容
- **THEN** 关键人物、动作、情感词、地点词高亮显示

### Requirement: 提示机制
系统 SHALL 在用户答错后提供提示。

#### Scenario: 提供提示
- **WHEN** 用户答错2次
- **THEN** 显示提示内容

### Requirement: 尝试次数控制
系统 SHALL 限制答题尝试次数。

#### Scenario: 限制次数
- **WHEN** 用户答题
- **THEN** 显示剩余机会，最多3次
