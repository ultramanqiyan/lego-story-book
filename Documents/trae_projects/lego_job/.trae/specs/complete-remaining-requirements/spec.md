# 完善剩余需求 Spec

## Why
根据需求文档检查，发现以下需求尚未完全实现：
1. 音效功能 - 答题正确/错误时需要音效反馈
2. 温和惩罚剧情 - 第3次错误后触发温和惩罚，而非直接显示答案
3. 关键词高亮扩展 - 需要高亮关键动作、情感词、地点词
4. 章节数量限制 - 单本书籍最多100章
5. 分享二维码功能 - 生成二维码分享链接

## What Changes
- 添加答题音效（正确/错误）
- 实现温和惩罚剧情逻辑
- 扩展关键词高亮规则
- 添加章节数量限制检查
- 添加二维码分享功能

## Impact
- Affected specs: 谜题系统、故事展示、书籍管理、分享功能
- Affected code: adventure.html, book.html, share.html

## ADDED Requirements

### Requirement: 答题音效
系统SHALL在答题时播放音效反馈。

#### Scenario: 正确答案音效
- **WHEN** 用户点击正确选项
- **THEN** 播放欢快音效
- **THEN** 显示绿色高亮

#### Scenario: 错误答案音效
- **WHEN** 用户点击错误选项
- **THEN** 播放错误提示音
- **THEN** 显示红色闪烁

### Requirement: 温和惩罚剧情
系统SHALL在第3次错误后触发温和惩罚剧情。

#### Scenario: 触发温和惩罚
- **WHEN** 用户第3次答错
- **THEN** 显示温和惩罚剧情（如"门没打开，再想想办法"）
- **THEN** 不直接显示正确答案
- **THEN** 允许用户继续阅读

### Requirement: 关键词高亮扩展
系统SHALL高亮多种类型的关键词。

#### Scenario: 高亮关键动作
- **WHEN** 故事内容包含关键动作词（飞向、跳跃、奔跑等）
- **THEN** 以紫色高亮显示

#### Scenario: 高亮情感词
- **WHEN** 故事内容包含情感词（开心、快乐、勇敢等）
- **THEN** 以绿色高亮显示

#### Scenario: 高亮地点词
- **WHEN** 故事内容包含地点词（城堡、森林、太空等）
- **THEN** 以黄色高亮显示

### Requirement: 章节数量限制
系统SHALL限制单本书籍最多100章。

#### Scenario: 达到章节上限
- **WHEN** 书籍章节数达到100章
- **THEN** 提示"本书籍已达章节上限，请创建新书籍"
- **THEN** 禁用"添加章节"按钮

### Requirement: 二维码分享
系统SHALL支持二维码分享功能。

#### Scenario: 生成二维码
- **WHEN** 用户点击"分享"按钮
- **THEN** 生成分享链接二维码
- **THEN** 显示二维码图片

## MODIFIED Requirements
无

## REMOVED Requirements
无
