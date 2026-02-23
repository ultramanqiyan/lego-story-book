# 故事创建后自动生成第一章 Spec

## Why
用户创建故事后跳转到book.html，但章节列表为空，需要手动点击"添加章节"才能看到内容。这导致用户体验不佳，用户期望创建故事后立即看到生成的第一章内容。

## What Changes
- 在story-create.html完成角色设置后，自动调用/api/story生成第一章
- 自动保存章节到数据库
- 跳转到book.html时显示已生成的第一章

## Impact
- Affected specs: 故事创建流程
- Affected code: story-create.html

## ADDED Requirements

### Requirement: 故事创建后自动生成第一章
系统SHALL在用户完成故事创建流程后自动生成第一章内容。

#### Scenario: 成功创建故事并生成第一章
- **WHEN** 用户完成角色设置并点击"开始创作"
- **THEN** 系统自动调用/api/story生成第一章
- **THEN** 章节自动保存到数据库
- **THEN** 跳转到book.html显示已生成的章节

#### Scenario: 生成失败时提示用户
- **WHEN** 自动生成章节失败
- **THEN** 显示错误提示
- **THEN** 跳转到book.html，用户可手动添加章节

## MODIFIED Requirements
无

## REMOVED Requirements
无
