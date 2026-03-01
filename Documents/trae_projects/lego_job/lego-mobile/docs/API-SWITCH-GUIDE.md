# API 地址切换指南

## 概述

本项目支持在线上和线下 API 地址之间切换，方便开发和测试。

## 配置文件位置

### 1. app.json（主要配置）

**文件路径**: `lego-mobile/app.json`

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://lego-story-book.pages.dev/api"
    }
  }
}
```

### 2. src/api/client.js（Fallback 配置 - 重要！）

**文件路径**: `lego-mobile/src/api/client.js`

```javascript
const getApiBase = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8788/api';  // Web 端固定使用本地地址
  }
  return Constants.expoConfig?.extra?.apiBaseUrl || 'http://10.0.2.2:8788/api';
};
```

**注意**: 由于 `expoConfig.extra` 在某些情况下可能返回 `undefined`，所以 **必须同时修改 `client.js` 中的 fallback 地址**！

## API 地址说明

| 环境 | 地址 | 说明 |
|------|------|------|
| 线上 | `https://lego-story-book.pages.dev/api` | Cloudflare Pages 部署的生产环境 |
| 线下（Android 模拟器） | `http://10.0.2.2:8788/api` | 模拟器访问本机 localhost |
| 线下（Web） | `http://localhost:8788/api` | Web 端本地开发 |
| 线下（真机） | `http://<电脑IP>:8788/api` | 真机需要使用电脑的局域网 IP |

## 切换步骤

### 切换到线下 API（本地测试）

1. **修改 `app.json`**:
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://10.0.2.2:8788/api"
    }
  }
}
```

2. **修改 `src/api/client.js` 中的 fallback 地址**:
```javascript
return Constants.expoConfig?.extra?.apiBaseUrl || 'http://10.0.2.2:8788/api';
```

3. **清理所有缓存（重要！）**:
```bash
cd lego-mobile

# 清理 Android 构建缓存
Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue

# 清理 Expo Constants 缓存（关键步骤！）
Remove-Item -Recurse -Force "node_modules\expo-constants\android\build" -ErrorAction SilentlyContinue

# 清理 Gradle 缓存
Remove-Item -Recurse -Force "android\.gradle" -ErrorAction SilentlyContinue
```

4. **重新打包 JS bundle**:
```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

5. **重新构建 APK**:
```bash
.\build-apk.bat
```

6. **安装 APK 到模拟器**:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

7. **确保本地后端服务运行**:
```bash
npx wrangler pages dev --port 8788
```

### 切换到线上 API（生产环境）

1. **修改 `app.json`**:
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://lego-story-book.pages.dev/api"
    }
  }
}
```

2. **修改 `src/api/client.js` 中的 fallback 地址**:
```javascript
return Constants.expoConfig?.extra?.apiBaseUrl || 'https://lego-story-book.pages.dev/api';
```

3. **清理所有缓存（重要！）**:
```bash
cd lego-mobile
Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "node_modules\expo-constants\android\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "android\.gradle" -ErrorAction SilentlyContinue
```

4. **重新打包 JS bundle**:
```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

5. **重新构建 APK**:
```bash
.\build-apk.bat
```

6. **安装 APK 到模拟器**:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## 关键缓存位置

Expo 会在以下位置缓存配置，**切换 API 地址时必须清理**：

| 缓存位置 | 说明 |
|----------|------|
| `android/app/build` | Android 构建输出 |
| `node_modules/expo-constants/android/build` | **Expo Constants 缓存（关键！）** |
| `android/.gradle` | Gradle 缓存 |

## 快速切换脚本

### switch-to-local.ps1（切换到本地）
```powershell
# 切换到本地 API
$file1 = "lego-mobile/app.json"
$content = Get-Content $file1 -Raw
$content = $content -replace '"apiBaseUrl": "https://lego-story-book.pages.dev/api"', '"apiBaseUrl": "http://10.0.2.2:8788/api"'
Set-Content $file1 $content

$file2 = "lego-mobile/src/api/client.js"
$content = Get-Content $file2 -Raw
$content = $content -replace "'https://lego-story-book.pages.dev/api'", "'http://10.0.2.2:8788/api'"
Set-Content $file2 $content

# 清理缓存
Remove-Item -Recurse -Force "lego-mobile/android/app/build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "lego-mobile/node_modules/expo-constants/android/build" -ErrorAction SilentlyContinue

Write-Host "已切换到本地 API" -ForegroundColor Green
Write-Host "请重新打包 JS bundle 并构建 APK" -ForegroundColor Yellow
```

### switch-to-online.ps1（切换到线上）
```powershell
# 切换到线上 API
$file1 = "lego-mobile/app.json"
$content = Get-Content $file1 -Raw
$content = $content -replace '"apiBaseUrl": "http://10.0.2.2:8788/api"', '"apiBaseUrl": "https://lego-story-book.pages.dev/api"'
Set-Content $file1 $content

$file2 = "lego-mobile/src/api/client.js"
$content = Get-Content $file2 -Raw
$content = $content -replace "'http://10.0.2.2:8788/api'", "'https://lego-story-book.pages.dev/api'"
Set-Content $file2 $content

# 清理缓存
Remove-Item -Recurse -Force "lego-mobile/android/app/build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "lego-mobile/node_modules/expo-constants/android/build" -ErrorAction SilentlyContinue

Write-Host "已切换到线上 API" -ForegroundColor Green
Write-Host "请重新打包 JS bundle 并构建 APK" -ForegroundColor Yellow
```

## 注意事项

1. **必须同时修改两个文件**: `app.json` 和 `src/api/client.js`
2. **必须清理 Expo Constants 缓存**: `node_modules/expo-constants/android/build`
3. **必须重新打包 JS bundle**: 修改代码后需要运行 `react-native bundle` 命令
4. **修改配置后必须重新构建 APK**，因为配置会在构建时打包进 APK
5. **本地测试需要确保后端服务已启动**（`npx wrangler pages dev --port 8788`）
6. **真机测试**需要使用电脑的局域网 IP 地址，并确保手机和电脑在同一网络
7. **Web 端固定使用本地地址**，不受 `app.json` 配置影响

## 当前配置状态

**当前 API 地址**: 检查以下两个位置
1. `lego-mobile/app.json` 中的 `extra.apiBaseUrl` 字段
2. `lego-mobile/src/api/client.js` 中的 fallback 地址

## 验证 API 连接

可以在 APP 日志中查看当前使用的 API 地址：
```bash
adb logcat -s ReactNativeJS:V | findstr "APIClient"
```

日志输出示例：
```
[APIClient] Initialized with baseURL: 'http://10.0.2.2:8788/api'
```

## 验证 JS Bundle 中的 API 地址

可以检查打包后的 JS bundle 是否包含正确的 API 地址：
```bash
# 检查是否包含本地地址
findstr "10.0.2.2:8788" lego-mobile\android\app\src\main\assets\index.android.bundle

# 检查是否包含线上地址
findstr "lego-story-book.pages.dev" lego-mobile\android\app\src\main\assets\index.android.bundle
```

## 验证 Expo Constants 缓存

检查 Expo Constants 缓存中的配置：
```bash
# 查看缓存的 app.config
type lego-mobile\node_modules\expo-constants\android\build\generated\assets\expo-constants\app.config
```

如果显示的 `apiBaseUrl` 与预期不符，需要清理缓存并重新构建。
