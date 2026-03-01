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

### 2. src/api/client.js（Fallback 配置）

**文件路径**: `lego-mobile/src/api/client.js`

```javascript
const getApiBase = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:8788/api';  // Web 端固定使用本地地址
  }
  return Constants.expoConfig?.extra?.apiBaseUrl || 'https://lego-story-book.pages.dev/api';
};
```

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

2. **重新构建 APK**:
```bash
cd lego-mobile
.\build-apk.bat
```

3. **安装 APK 到模拟器**:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

4. **确保本地后端服务运行**:
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

2. **重新构建 APK**:
```bash
cd lego-mobile
.\build-apk.bat
```

3. **安装 APK 到模拟器**:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## 快速切换脚本

可以创建以下脚本方便切换：

### switch-to-local.ps1（切换到本地）
```powershell
# 切换到本地 API
$file = "lego-mobile/app.json"
$content = Get-Content $file -Raw
$content = $content -replace '"apiBaseUrl": "https://lego-story-book.pages.dev/api"', '"apiBaseUrl": "http://10.0.2.2:8788/api"'
Set-Content $file $content
Write-Host "已切换到本地 API" -ForegroundColor Green
```

### switch-to-online.ps1（切换到线上）
```powershell
# 切换到线上 API
$file = "lego-mobile/app.json"
$content = Get-Content $file -Raw
$content = $content -replace '"apiBaseUrl": "http://10.0.2.2:8788/api"', '"apiBaseUrl": "https://lego-story-book.pages.dev/api"'
Set-Content $file $content
Write-Host "已切换到线上 API" -ForegroundColor Green
```

## 注意事项

1. **修改配置后必须重新构建 APK**，因为 `app.json` 的配置会在构建时打包进 APK
2. **本地测试需要确保后端服务已启动**（`npx wrangler pages dev --port 8788`）
3. **真机测试**需要使用电脑的局域网 IP 地址，并确保手机和电脑在同一网络
4. **Web 端固定使用本地地址**，不受 `app.json` 配置影响

## 当前配置状态

**当前 API 地址**: 检查 `lego-mobile/app.json` 中的 `extra.apiBaseUrl` 字段

## 验证 API 连接

可以在 APP 日志中查看当前使用的 API 地址：
```bash
adb logcat -s ReactNativeJS:V | findstr "APIClient"
```

日志输出示例：
```
[APIClient] Initialized with baseURL: 'http://10.0.2.2:8788/api'
```
