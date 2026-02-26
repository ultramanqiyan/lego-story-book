# APP 前后端 API 接口一致性保障机制规格说明

## Why

APP 前端调用与后端 API 接口存在多处不一致，导致功能异常。这类问题反复出现的原因：
1. 缺乏接口定义的单一数据源（Single Source of Truth）
2. 缺乏自动化验证机制
3. 前端 API 层与 UI 层调用缺乏类型约束
4. 没有接口变更的同步更新流程

## What Changes

- 创建 API 接口类型定义文件（单一数据源）
- 添加 API 接口静态验证脚本
- 为前端 API 层添加 JSDoc 类型注释
- 创建接口一致性测试用例
- 建立 API 变更检查清单

## Impact

- Affected specs: lego-mobile API 层架构
- Affected code: 
  - `lego-mobile/src/api/*.js` - 所有 API 文件
  - `lego-mobile/src/screens/**/*.js` - 所有 UI 界面文件
  - 新增 `lego-mobile/src/api/types.js` - 类型定义
  - 新增 `lego-mobile/scripts/verify-api.js` - 验证脚本

## ADDED Requirements

### Requirement: API 类型定义文件
系统 SHALL 提供一个集中的 API 类型定义文件，作为前后端接口契约的单一数据源。

#### Scenario: 类型定义完整性
- **WHEN** 开发者需要查看或修改接口定义
- **THEN** 可以在 `api/types.js` 中找到所有接口的参数和返回值类型定义

### Requirement: API 接口静态验证
系统 SHALL 提供自动化脚本验证前端 API 定义与后端接口的一致性。

#### Scenario: 运行验证脚本
- **WHEN** 开发者运行 `npm run verify:api`
- **THEN** 脚本自动检查前端 API 文件与后端接口定义的一致性
- **AND** 输出不一致项的详细报告

### Requirement: JSDoc 类型注释
前端 API 层 SHALL 为所有公开方法添加 JSDoc 类型注释，明确参数和返回值类型。

#### Scenario: IDE 类型提示
- **WHEN** 开发者在 IDE 中调用 API 方法
- **THEN** IDE 显示完整的参数类型提示和返回值类型

### Requirement: UI 层调用验证
UI 层调用 API 层时 SHALL 使用正确的参数签名，通过静态检查确保一致性。

#### Scenario: 参数签名检查
- **WHEN** UI 组件调用 API 方法
- **THEN** 参数数量、类型、顺序与 API 定义完全匹配

## MODIFIED Requirements

### Requirement: API 文件结构
每个 API 模块文件 SHALL 遵循统一的结构规范：
1. 导入 apiClient
2. 定义 API 方法（带 JSDoc 注释）
3. 导出 API 对象

### Requirement: 接口命名规范
API 方法命名 SHALL 遵循 RESTful 风格：
- `get` - GET 请求获取资源
- `create` - POST 请求创建资源
- `update` - PUT 请求更新资源
- `delete` - DELETE 请求删除资源

## 长效解决方案

### 1. 单一数据源原则
```
lego-mobile/src/api/types.js
├── 用户模块类型定义
├── 人仔模块类型定义
├── 书籍模块类型定义
├── 章节模块类型定义
├── 故事模块类型定义
├── 谜题模块类型定义
└── 分享模块类型定义
```

### 2. 自动化验证流程
```
开发流程:
1. 修改后端 API → 更新 types.js
2. 运行 verify:api 脚本
3. 修复前端 API 层
4. 修复 UI 层调用
5. 运行测试验证
```

### 3. 代码审查清单
- [ ] API 方法参数与 types.js 定义一致
- [ ] UI 调用与 API 方法签名一致
- [ ] 新增接口已添加类型定义
- [ ] 运行 verify:api 无错误

## 实施优先级

| 优先级 | 任务 | 说明 |
|-------|------|------|
| P0 | 全面检查并修复现有不一致 | 立即执行 |
| P1 | 创建 types.js 类型定义文件 | 本次执行 |
| P1 | 添加 JSDoc 类型注释 | 本次执行 |
| P2 | 创建验证脚本 | 本次执行 |
| P2 | 添加接口一致性测试 | 本次执行 |
