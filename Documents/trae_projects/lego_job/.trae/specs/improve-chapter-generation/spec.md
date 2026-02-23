# 章节生成功能改进 Spec

## Why
当前章节添加功能使用 `prompt()` 人工输入标题和内容，不符合需求文档中"AI自动生成章节名称和内容"的要求。需求文档明确要求：
1. 章节名称由AI生成，从故事内容中提取
2. 章节名称格式：简短有力，4-10个字
3. AI返回包含title和content的JSON格式
4. 故事生成后自动保存为章节，无需手动点击保存

## What Changes
- 修改 `/api/story` 接口，返回符合需求格式的JSON（包含title、content、puzzle）
- 修改 `book.html`，移除 `prompt()` 人工输入，改为调用AI生成接口
- 实现章节自动保存功能
- 章节名称从AI生成的内容中提取

## Impact
- Affected specs: 故事生成、章节管理
- Affected code: functions/api/story.js, book.html

## ADDED Requirements

### Requirement: AI生成章节名称和内容
系统SHALL通过AI接口自动生成章节名称和内容，而非人工输入。

#### Scenario: 成功生成章节
- **WHEN** 用户点击"添加章节"按钮
- **THEN** 系统调用AI接口生成章节，返回包含title和content的JSON
- **THEN** 章节自动保存到数据库
- **THEN** 页面显示新生成的章节

### Requirement: 章节名称自动提取
系统SHALL从AI生成的故事内容中提取关键元素作为章节名称。

#### Scenario: 提取章节名称
- **WHEN** AI返回故事内容
- **THEN** 系统从内容中提取4-10个字的简短标题
- **THEN** 标题格式简短有力

## MODIFIED Requirements

### Requirement: 章节添加功能
将人工输入章节标题和内容改为AI自动生成。

**Breaking**: 移除 `prompt()` 人工输入方式
**Migration**: 用户点击"添加章节"将直接调用AI生成

## REMOVED Requirements
无
