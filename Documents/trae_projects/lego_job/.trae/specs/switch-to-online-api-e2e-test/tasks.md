# Tasks

- [x] Task 1: 修改API配置为线上地址
  - [x] SubTask 1.1: 修改 `lego-mobile/app.json` 中 `extra.apiBaseUrl` 为 `https://lego-story-book.pages.dev/api`
  - [x] SubTask 1.2: 修改 `lego-mobile/src/api/client.js` 中默认 fallback 地址为 `https://lego-story-book.pages.dev/api`

- [x] Task 2: 重新构建APK
  - [x] SubTask 2.1: 运行 `react-native bundle` 打包 JS bundle
  - [x] SubTask 2.2: 运行 `gradlew assembleDebug` 构建 Debug APK

- [x] Task 3: 安装APK到安卓模拟器
  - [x] SubTask 3.1: 确认模拟器正在运行
  - [x] SubTask 3.2: 使用 `adb install` 安装新构建的 APK

- [x] Task 4: 创建可视化E2E测试脚本
  - [x] SubTask 4.1: 创建使用 UI Automator 的 PowerShell 测试脚本
  - [x] SubTask 4.2: 每个操作之间添加 1-2 秒等待时间
  - [x] SubTask 4.3: 测试主要页面导航（书架、角色、冒险、设置）

- [x] Task 5: 执行可视化E2E测试
  - [x] SubTask 5.1: 启动 APP
  - [x] SubTask 5.2: 测试书架页面（点击、滚动）
  - [x] SubTask 5.3: 测试角色页面
  - [x] SubTask 5.4: 测试冒险模式页面
  - [x] SubTask 5.5: 测试设置页面
  - [x] SubTask 5.6: 验证 API 连接线上地址成功

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
