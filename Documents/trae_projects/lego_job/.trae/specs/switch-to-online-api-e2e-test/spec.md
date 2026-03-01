# 切换线上API并进行可视化E2E测试 Spec

## Why
当前 APP 使用本地测试 API 地址，需要切换到线上地址 `https://lego-story-book.pages.dev/api`，并进行可视化的端到端 UI 测试，确保 APP 能正常连接线上服务。

## What Changes
- 修改 `lego-mobile/app.json` 中的 `extra.apiBaseUrl` 为线上地址
- 修改 `lego-mobile/src/api/client.js` 中的默认 API 地址
- 重新构建 APK
- 创建可视化 E2E 测试脚本（每个操作有足够等待时间，用户可在模拟器看到操作）
- 执行可视化 UI 点击测试

## Impact
- Affected specs: 无
- Affected code: 
  - `lego-mobile/app.json`
  - `lego-mobile/src/api/client.js`
  - 新建可视化 E2E 测试脚本

## ADDED Requirements

### Requirement: 线上API连接
APP 端 API 客户端 SHALL 连接到线上地址 `https://lego-story-book.pages.dev/api`

#### Scenario: API连接成功
- **WHEN** APP 启动并发起 API 请求
- **THEN** 请求发送到 `https://lego-story-book.pages.dev/api`

### Requirement: 可视化E2E测试
系统 SHALL 提供可视化端到端测试脚本，用户可在安卓模拟器中观察到每个操作动作

#### Scenario: 测试操作可见
- **WHEN** 运行 E2E 测试脚本
- **THEN** 每个点击操作之间有足够的等待时间（至少1秒）
- **AND** 用户可以在模拟器屏幕上看到操作过程

## MODIFIED Requirements

### Requirement: API基础地址配置
APP 的 API 基础地址配置从本地测试地址修改为线上地址

**原配置**:
- `app.json`: `"apiBaseUrl": "http://10.0.2.2:8788/api"`
- `client.js` fallback: `https://lego-story.pages.dev/api`

**新配置**:
- `app.json`: `"apiBaseUrl": "https://lego-story-book.pages.dev/api"`
- `client.js` fallback: `https://lego-story-book.pages.dev/api`

## REMOVED Requirements
无
