# LEGO Mobile APK 构建和调试指南

本文档提供从零开始的完整操作步骤，帮助您构建和运行 LEGO Mobile Android 应用。

---

## 目录

1. [环境准备](#1-环境准备)
2. [安装必要软件](#2-安装必要软件)
3. [项目初始化](#3-项目初始化)
4. [创建和启动安卓模拟器](#4-创建和启动安卓模拟器)
5. [启动后端服务](#5-启动后端服务)
6. [构建APK](#6-构建apk)
7. [安装和运行APK](#7-安装和运行apk)
8. [常见问题排查](#8-常见问题排查)
9. [快速参考](#9-快速参考)

---

## 1. 环境准备

### 1.1 系统要求

- **操作系统**: Windows 10/11
- **内存**: 至少 8GB RAM（推荐 16GB）
- **磁盘空间**: 至少 20GB 可用空间
- **网络**: 需要访问互联网下载依赖

### 1.2 需要安装的软件

| 软件 | 版本要求 | 用途 |
|------|---------|------|
| Node.js | v18.x 或更高 | JavaScript 运行环境 |
| Java JDK | JDK 17 | Android 构建工具 |
| Android Studio | 最新版 | Android SDK 和模拟器 |
| Git | 最新版 | 代码版本管理 |

---

## 2. 安装必要软件

### 2.1 安装 Node.js

1. 访问 https://nodejs.org/
2. 下载 LTS 版本（长期支持版）
3. 运行安装程序，使用默认设置
4. 验证安装：
   ```powershell
   node --version
   npm --version
   ```

### 2.2 安装 Java JDK 17

1. 访问 https://adoptium.net/
2. 下载 Temurin JDK 17 (LTS)
3. 运行安装程序
4. 配置环境变量：
   - 变量名：`JAVA_HOME`
   - 变量值：`D:\Program Files\Java\jdk-17`（根据实际安装路径调整）
5. 验证安装：
   ```powershell
   java --version
   ```

### 2.3 安装 Android Studio

1. 访问 https://developer.android.com/studio
2. 下载并安装 Android Studio
3. 首次启动时，选择 "Standard" 安装类型
4. 安装完成后，打开 Android Studio
5. 进入 SDK Manager（Tools > SDK Manager）
6. 安装以下组件：
   - Android SDK Platform 34
   - Android SDK Build-Tools 34
   - Android Emulator
   - Android SDK Platform-Tools
   - NDK (Side by side) - 版本 25.1.8937393

### 2.4 配置 Android 环境变量

设置以下系统环境变量：

```
ANDROID_HOME=C:\Users\你的用户名\AppData\Local\Android\Sdk
ANDROID_SDK_ROOT=C:\Users\你的用户名\AppData\Local\Android\Sdk
```

将以下路径添加到 PATH：
```
%ANDROID_HOME%\platform-tools
%ANDROID_HOME%\emulator
%ANDROID_HOME%\cmdline-tools\latest\bin
```

验证安装：
```powershell
adb --version
```

---

## 3. 项目初始化

### 3.1 克隆项目（如果还没有）

```powershell
cd C:\Users\你的用户名\Documents
git clone <项目地址> lego_job
cd lego_job
```

### 3.2 安装项目依赖

**后端依赖**（在项目根目录）：
```powershell
cd C:\Users\yannis\Documents\trae_projects\lego_job
npm install
```

**移动端依赖**（在 lego-mobile 目录）：
```powershell
cd C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile
npm install
```

### 3.3 生成 Android 项目文件

如果是首次构建，需要生成 Android 项目文件：

```powershell
cd C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile
npx expo prebuild --platform android
```

此命令会创建 `android` 文件夹。

---

## 4. 创建和启动安卓模拟器

### 4.1 创建模拟器（首次使用）

**方法一：使用 Android Studio GUI**

1. 打开 Android Studio
2. 点击 "More Actions" > "Virtual Device Manager"
3. 点击 "Create Device"
4. 选择设备型号（推荐 Pixel 6 或 Pixel 8）
5. 选择系统镜像（推荐 API 34, x86_64）
6. 点击 "Finish" 完成创建

**方法二：使用命令行**

```powershell
# 设置环境变量
$env:ANDROID_HOME = "C:\Users\yannis\AppData\Local\Android\Sdk"
$env:JAVA_HOME = "D:\Program Files\Java\jdk-17"

# 创建 AVD（Android Virtual Device）
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\avdmanager.bat" create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;x86_64" -d pixel_6 -f
```

### 4.2 启动模拟器

**方法一：使用 Android Studio**

1. 打开 Android Studio
2. 进入 Virtual Device Manager
3. 点击模拟器旁边的播放按钮启动

**方法二：使用命令行**

```powershell
# 启动模拟器
& "C:\Users\yannis\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd Pixel_6_API_34 -no-snapshot-load
```

**方法三：使用项目提供的脚本**

```powershell
cd C:\Users\yannis\Documents\trae_projects\lego_job
.\launch-emulator.bat
```

### 4.3 验证模拟器状态

```powershell
# 检查连接的设备
& "C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices
```

输出应该显示类似：
```
List of devices attached
emulator-5554   device
```

---

## 5. 启动后端服务

APP 需要后端 API 服务才能正常加载数据。

### 5.1 启动后端服务

**方法一：使用命令行**

```powershell
cd C:\Users\yannis\Documents\trae_projects\lego_job
npm run dev
```

等待看到以下输出表示服务已启动：
```
[wrangler:inf] Ready on http://127.0.0.1:8788
```

**方法二：使用项目脚本**

```powershell
cd C:\Users\yannis\Documents\trae_projects\lego_job
.\start-services.bat
```

### 5.2 验证后端服务

在浏览器中访问：http://localhost:8788/api/users/user_001

如果返回 JSON 数据，说明服务正常运行。

### 5.3 重要提示

- 后端服务运行在 **端口 8788**
- 模拟器通过 `http://10.0.2.2:8788` 访问本机服务
- **不要关闭运行后端服务的终端窗口**

---

## 6. 构建APK

### 6.1 完整构建流程

**方法一：使用构建脚本（推荐）**

```powershell
cd C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile
.\build-apk.bat
```

脚本会自动执行以下步骤：
1. 创建 assets 目录
2. 生成 JS bundle 文件
3. 运行 Gradle 构建

**方法二：手动构建**

```powershell
# 1. 进入项目目录
cd C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile

# 2. 设置环境变量
$env:JAVA_HOME = "D:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
$env:ANDROID_HOME = "C:\Users\yannis\AppData\Local\Android\Sdk"

# 3. 创建 assets 目录
if (-not (Test-Path "android\app\src\main\assets")) {
    New-Item -ItemType Directory -Path "android\app\src\main\assets"
}

# 4. 生成 JS bundle
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# 5. 构建 APK
cd android
.\gradlew.bat assembleDebug --no-daemon
cd ..
```

### 6.2 构建输出

构建成功后，APK 文件位于：
```
lego-mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

### 6.3 构建时间

首次构建可能需要 10-15 分钟，后续构建会更快（约 1-2 分钟）。

---

## 7. 安装和运行APK

### 7.1 确保模拟器正在运行

```powershell
& "C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices
```

### 7.2 安装 APK

```powershell
& "C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe" install -r C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile\android\app\build\outputs\apk\debug\app-debug.apk
```

参数说明：
- `-r`: 替换已存在的应用

### 7.3 启动应用

```powershell
& "C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe" shell am start -n com.legostory.mobile/.MainActivity
```

### 7.4 一键安装和启动脚本

创建文件 `run-app.bat`：
```batch
@echo off
echo Installing APK...
C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe install -r android\app\build\outputs\apk\debug\app-debug.apk

echo Starting App...
C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe shell am start -n com.legostory.mobile/.MainActivity

echo Done!
pause
```

---

## 8. 常见问题排查

### 8.1 "unable to load script" 错误

**原因**: APK 中缺少 JS bundle 文件

**解决方案**:
```powershell
# 手动生成 bundle
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# 然后重新构建
cd android
.\gradlew.bat assembleDebug --no-daemon
```

### 8.2 NDK 版本问题

**错误信息**: `NDK at ... did not have a source.properties file`

**解决方案**:
1. 打开 `android\build.gradle`
2. 修改 `ndkVersion` 为已安装的版本：
   ```gradle
   ndkVersion = "25.1.8937393"
   ```

### 8.3 后端服务无法访问

**症状**: APP 显示 "数据加载失败"

**排查步骤**:
1. 确认后端服务正在运行
2. 在浏览器访问 http://localhost:8788/api/users/user_001
3. 检查终端是否有错误信息

**解决方案**:
```powershell
# 重启后端服务
cd C:\Users\yannis\Documents\trae_projects\lego_job
npm run dev
```

### 8.4 模拟器无法启动

**解决方案**:
1. 确保已安装 Android Emulator
2. 检查 BIOS 中是否启用了虚拟化 (VT-x/AMD-V)
3. 尝试创建新的 AVD

### 8.5 Gradle 构建失败

**常见原因**:
- JAVA_HOME 未正确设置
- ANDROID_HOME 未正确设置
- 网络问题导致依赖下载失败

**解决方案**:
```powershell
# 检查环境变量
echo $env:JAVA_HOME
echo $env:ANDROID_HOME

# 清理构建缓存
cd android
.\gradlew.bat clean
cd ..

# 重新构建
.\build-apk.bat
```

### 8.6 查看应用日志

```powershell
# 查看错误日志
& "C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe" logcat -d -t 100 *:E

# 查看 React Native 日志
& "C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe" logcat -d -t 100 -s ReactNative:*
```

---

## 9. 快速参考

### 9.1 目录结构

```
lego_job/
├── lego-mobile/              # 移动端项目
│   ├── android/              # Android 原生项目（由 expo prebuild 生成）
│   ├── src/                  # 源代码
│   ├── build-apk.bat         # APK 构建脚本
│   └── package.json
├── functions/                # 后端 API
├── start-services.bat        # 服务启动脚本
├── launch-emulator.bat       # 模拟器启动脚本
└── package.json
```

### 9.2 重要路径

| 项目 | 路径 |
|------|------|
| APK 输出 | `lego-mobile\android\app\build\outputs\apk\debug\app-debug.apk` |
| JS Bundle | `lego-mobile\android\app\src\main\assets\index.android.bundle` |
| Android SDK | `C:\Users\yannis\AppData\Local\Android\Sdk` |
| ADB 工具 | `C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe` |
| 模拟器 | `C:\Users\yannis\AppData\Local\Android\Sdk\emulator\emulator.exe` |

### 9.3 服务地址

| 服务 | 地址 |
|------|------|
| 后端 API（本机） | http://localhost:8788 |
| 后端 API（模拟器访问） | http://10.0.2.2:8788 |
| API 基础路径 | /api |

### 9.4 常用命令速查

```powershell
# 启动后端服务
cd C:\Users\yannis\Documents\trae_projects\lego_job; npm run dev

# 启动模拟器
C:\Users\yannis\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Pixel_6_API_34

# 检查设备连接
C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe devices

# 构建 APK
cd C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile; .\build-apk.bat

# 安装 APK
C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe install -r android\app\build\outputs\apk\debug\app-debug.apk

# 启动应用
C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe shell am start -n com.legostory.mobile/.MainActivity

# 查看日志
C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe logcat -d -t 100 *:E
```

---

## 10. 完整操作流程（从零开始）

如果您是第一次操作，请按以下顺序执行：

### 步骤 1: 启动模拟器
```powershell
C:\Users\yannis\AppData\Local\Android\Sdk\emulator\emulator.exe -avd Pixel_6_API_34
```
等待模拟器完全启动（看到桌面）。

### 步骤 2: 启动后端服务（新开一个终端）
```powershell
cd C:\Users\yannis\Documents\trae_projects\lego_job
npm run dev
```
等待看到 `Ready on http://127.0.0.1:8788`。

### 步骤 3: 构建 APK（新开一个终端）
```powershell
cd C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile
.\build-apk.bat
```
等待构建完成。

### 步骤 4: 安装并运行 APK
```powershell
C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe install -r C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile\android\app\build\outputs\apk\debug\app-debug.apk

C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe shell am start -n com.legostory.mobile/.MainActivity
```

---

**文档版本**: 1.0  
**最后更新**: 2026-03-02
