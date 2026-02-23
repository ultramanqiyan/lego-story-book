# 端到端验收测试覆盖率优化 Spec

## Why
之前的端到端测试没有生成代码覆盖率报告，需要重新运行测试并确保每个实现文件的行覆盖率都大于90%。

## What Changes
- 配置Playwright生成代码覆盖率报告
- 补充测试用例以达到90%行覆盖率
- 生成详细的测试报告和覆盖率报告

## Impact
- Affected specs: 端到端测试
- Affected code: e2e-tests/app.spec.js, playwright.config.js

## ADDED Requirements

### Requirement: 代码覆盖率收集
系统 SHALL 在端到端测试运行时收集代码覆盖率数据。

#### Scenario: 成功收集覆盖率
- **WHEN** 运行端到端测试
- **THEN** 系统生成覆盖率报告

### Requirement: 覆盖率阈值
每个实现文件的行覆盖率 SHALL 大于90%。

#### Scenario: 覆盖率达标
- **WHEN** 测试完成
- **THEN** 每个文件行覆盖率 >= 90%

### Requirement: CRUD测试覆盖
所有功能模块 SHALL 测试增删改查操作。

#### Scenario: 用户管理CRUD
- **WHEN** 测试用户管理
- **THEN** 覆盖创建、读取、更新操作

#### Scenario: 书籍管理CRUD
- **WHEN** 测试书籍管理
- **THEN** 覆盖创建、读取、更新、删除操作

#### Scenario: 章节管理CRUD
- **WHEN** 测试章节管理
- **THEN** 覆盖创建、读取、删除操作

#### Scenario: 人仔管理CRUD
- **WHEN** 测试人仔管理
- **THEN** 覆盖创建、读取、删除操作

## Test Path Design

### 用户使用网站路径
1. 首页 → 查看热门人仔 → 点击开始冒险
2. 登录页 → 输入用户名 → 提交登录
3. 书架页 → 创建新故事
4. 故事创建页 → 选择故事类型 → 选择角色 → 填写信息 → 创建成功
5. 书籍详情页 → 查看章节 → 添加章节
6. 人仔页 → 查看人仔列表 → 创建新人仔
7. 家长控制页 → 设置时间限制 → 退出登录
