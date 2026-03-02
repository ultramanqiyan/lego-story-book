# Android构建与E2E测试 Spec

## Why
lego-mobile项目需要成功构建Android APK并在安卓模拟器上运行端到端UI测试，确保所有核心功能正常工作。

## What Changes
- 修复Android构建配置问题
- 参考lego-mobile-game的成功构建方式
- 构建lego-mobile的Android APK
- 启动安卓模拟器并安装APK
- 运行端到端UI测试覆盖所有核心功能
- 生成测试报告

## Impact
- Affected code: lego-mobile/android配置文件
- 测试覆盖: 登录、首页、书架、角色、冒险模式、设置等核心功能

## ADDED Requirements

### Requirement: Android APK构建
系统必须能够成功构建lego-mobile项目的Android APK。

#### Scenario: 构建成功
- **WHEN** 执行gradlew assembleDebug命令
- **THEN** 生成可安装的APK文件

### Requirement: 安卓模拟器测试
系统必须在安卓模拟器上安装并运行APK。

#### Scenario: 安装成功
- **WHEN** APK构建完成且模拟器已启动
- **THEN** APK成功安装到模拟器

### Requirement: 端到端UI测试
系统必须运行端到端UI测试覆盖所有核心功能。

#### Scenario: 测试覆盖
- **WHEN** 执行E2E测试
- **THEN** 覆盖登录、首页、书架、角色、冒险模式、设置等页面
- **AND** 验证页面点击和内容返回正常
- **AND** 生成测试报告
