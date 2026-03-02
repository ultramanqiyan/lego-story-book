# 开发经验教训文档

本文档记录开发过程中遇到的问题、原因分析和解决方案，供后续开发参考。

---

## 2026-03-02: React Native Android APK 构建缓存问题

### 问题描述

修改了 `CharactersScreen.js` 源代码，将创建按钮从 Header 的 `rightButton` 改为右下角的浮动按钮 (FAB)。网页版 (`npx expo start --web`) 显示正确，但 Android APK 构建后仍然显示旧的右上角创建按钮。

### 问题排查过程

1. **确认源代码正确**：检查 `CharactersScreen.js` 源文件，确认 `rightButton` 已被移除，FAB 代码已添加。

2. **确认网页版正确**：运行 `npx expo start --web`，网页版显示正确的 FAB 按钮。

3. **检查 APK 中的 bundle**：发现 `android/app/src/main/assets/index.android.bundle` 文件中仍然包含旧的 `rightButton` 代码。

4. **检查构建脚本**：`build-apk.bat` 只运行 `gradlew.bat assembleDebug`，没有重新生成 JS bundle。

### 根本原因

**Android APK 构建时，Gradle 会优先使用 `android/app/src/main/assets/index.android.bundle` 这个预打包的 bundle 文件。如果这个文件存在且是旧的，构建出的 APK 就会包含旧代码。**

Metro bundler 的缓存机制在直接运行 `gradlew assembleDebug` 时不会被触发重新生成 bundle。

### 解决方案

在构建 APK 之前，先使用 `react-native bundle` 命令重新生成 bundle 文件：

```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

然后再运行 `gradlew assembleDebug`。

### 推荐的构建脚本

```batch
@echo off
set JAVA_HOME=D:\Program Files\Java\jdk-17
set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk

echo Generating JS bundle...
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

echo Building APK...
cd android
call gradlew.bat assembleDebug --no-daemon

echo Build complete!
```

### 相关缓存清理命令

如果遇到其他缓存问题，可以尝试清理以下目录：

```bash
# 清理 Metro 缓存
rd /s /q "%LOCALAPPDATA%\Temp\metro-cache"

# 清理 Haste 缓存
rd /s /q "%LOCALAPPDATA%\Temp\haste-map*"

# 清理 node_modules 缓存
rd /s /q "node_modules\.cache"

# 清理 Android 构建缓存
rd /s /q "android\app\build"

# 使用 Expo 清理缓存
npx expo start --clear
```

### 经验总结

1. **网页版正常但 APK 异常时**：优先检查 APK 中的 bundle 文件是否包含最新代码。

2. **Gradle 不会自动重新生成 bundle**：需要手动运行 `react-native bundle` 命令。

3. **缓存清理顺序**：先清理缓存，再重新生成 bundle，最后构建 APK。

4. **预打包 bundle 文件优先级高**：`android/app/src/main/assets/index.android.bundle` 文件会被 Gradle 优先使用，必须确保该文件是最新版本。

---

## 文档维护说明

- 每次遇到重要问题并解决后，请将经验添加到本文档
- 包含：问题描述、排查过程、根本原因、解决方案、经验总结
- 按时间倒序排列，最新的问题放在最前面
