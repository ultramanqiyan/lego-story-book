# APP构建文档

## 一、概述

本文档基于LEGO Story APP的实际项目配置，详细介绍如何构建、打包和运行应用。所有内容均来自项目实际的配置文件和脚本。

## 二、项目构建配置概览

### 2.1 项目基本信息

| 配置项 | 值 | 来源文件 |
|--------|-----|----------|
| 应用名称 | 乐高故事书 | app.json |
| 包名（Android） | com.legostory.mobile | app.json |
| Bundle ID（iOS） | com.legostory.mobile | app.json |
| 当前版本 | 1.0.0 | app.json |
| Expo版本 | 51.0.0 | package.json |
| React Native版本 | 0.74.5 | package.json |

### 2.2 项目构建脚本一览

项目提供了多个批处理脚本用于构建和运行：

| 脚本文件 | 用途 |
|----------|------|
| build-apk.bat | 构建Android APK |
| run-android.bat | 启动模拟器并安装APP |
| setup-avd-and-run.bat | 创建AVD并运行 |
| set-env.bat | 设置环境变量 |
| start-and-test.bat | 启动服务并运行测试 |

## 三、环境配置

### 3.1 必需软件安装

| 软件 | 本项目使用的路径 | 说明 |
|------|------------------|------|
| Node.js | - | 版本18.x+ |
| Java JDK | D:\Program Files\Java\jdk-17 | 用于Android构建 |
| Android Studio | D:\Program Files\Android\Android Studio | 包含JBR和SDK |
| Android SDK | C:\Users\yannis\AppData\Local\Android\Sdk | Android开发工具包 |

### 3.2 环境变量配置

项目使用 set-env.bat 配置环境变量：

**需要配置的环境变量：**

| 变量名 | 值 | 用途 |
|--------|-----|------|
| JAVA_HOME | D:\Program Files\Android\Android Studio\jbr | Java运行环境 |
| ANDROID_HOME | C:\Users\yannis\AppData\Local\Android\Sdk | Android SDK路径 |
| ANDROID_SDK_ROOT | C:\Users\yannis\AppData\Local\Android\Sdk | SDK根目录 |

**配置方式：**

方式一：运行 set-env.bat 脚本（需要管理员权限）

方式二：手动配置系统环境变量

### 3.3 依赖安装

```
npm install
```

## 四、API地址配置

### 4.1 配置位置

API地址配置在两个地方：

**1. app.json 中的 extra 配置：**

```
"extra": {
  "apiBaseUrl": "http://10.0.2.2:8788/api"
}
```

**2. src/api/client.js 中的逻辑判断：**

- Web平台：使用 http://localhost:8788/api
- 移动端：优先使用 app.json 中的 extra.apiBaseUrl

### 4.2 切换API地址

#### 开发环境（本地调试）

配置 app.json：

```
"extra": {
  "apiBaseUrl": "http://10.0.2.2:8788/api"
}
```

说明：10.0.2.2 是Android模拟器访问宿主机localhost的特殊地址

#### 生产环境（线上地址）

配置 app.json：

```
"extra": {
  "apiBaseUrl": "https://lego-story-book.pages.dev/api"
}
```

#### Web开发模式

Web模式自动使用 localhost:8788，无需额外配置。

### 4.3 实际切换示例

根据Git提交记录 1c75f6ff，切换到线上地址的方式：

1. 打开 app.json 文件
2. 找到 extra.apiBaseUrl 配置项
3. 修改为目标地址
4. 重新构建应用

## 五、Android模拟器配置与运行

### 5.1 模拟器配置

项目使用的模拟器配置：

| 配置项 | 值 |
|--------|-----|
| AVD名称 | Pixel_8_API_36 |
| 设备型号 | Pixel 8 |
| API级别 | 36 |
| 系统镜像 | google_apis_playstore |
| CPU架构 | x86_64 |
| 屏幕尺寸 | 1080x2400 |
| 屏幕密度 | 420dpi |
| 内存 | 2048MB |
| SD卡 | 800MB |

### 5.2 创建并启动模拟器

**方式一：使用项目脚本**

运行 setup-avd-and-run.bat，该脚本会：

1. 创建AVD目录
2. 生成config.ini配置文件
3. 启动模拟器
4. 等待模拟器就绪
5. 构建并安装APP

**方式二：手动创建**

1. 打开Android Studio
2. 进入 Tools → Device Manager
3. 点击 Create Device
4. 选择 Pixel 8
5. 选择系统镜像（API 36）
6. 完成创建

### 5.3 启动模拟器并运行APP

**使用 run-android.bat 脚本：**

该脚本执行流程：

1. 检查AVD是否存在
2. 不存在则自动创建
3. 启动模拟器
4. 等待模拟器启动完成
5. 构建并安装APP

**手动启动步骤：**

1. 启动模拟器
2. 运行 npm run android

### 5.4 模拟器调试技巧

**查看已连接设备：**

```
adb devices
```

**查看模拟器日志：**

```
adb logcat
```

**过滤应用日志：**

```
adb logcat | findstr "legostory"
```

**检查应用进程：**

```
adb shell pidof com.legostory.mobile
```

## 六、Android APK构建

### 6.1 项目构建配置

**eas.json 构建配置：**

| 构建类型 | 说明 | 输出格式 |
|----------|------|----------|
| development | 开发版本 | 开发客户端 |
| preview | 预览版本 | APK |
| production | 生产版本 | AAB |

### 6.2 本地构建APK

**方式一：使用项目脚本**

运行 build-apk.bat，该脚本会：

1. 设置 JAVA_HOME 环境变量
2. 设置 ANDROID_HOME 环境变量
3. 进入 android 目录
4. 执行 gradlew assembleDebug

**方式二：手动构建**

```
cd android
gradlew assembleDebug
```

**输出位置：**

```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 6.3 使用EAS云构建

**安装EAS CLI：**

```
npm install -g eas-cli
```

**登录Expo账号：**

```
eas login
```

**构建预览版APK：**

```
eas build --platform android --profile preview
```

**构建生产版本：**

```
eas build --platform android --profile production
```

### 6.4 构建前检查清单

- [ ] 已安装正确版本的Java JDK
- [ ] ANDROID_HOME环境变量已设置
- [ ] 已安装Android SDK
- [ ] 已运行 npm install 安装依赖
- [ ] API地址已正确配置

## 七、iOS构建（仅Mac用户）

### 7.1 前提条件

| 要求 | 说明 |
|------|------|
| 操作系统 | macOS |
| Xcode | 最新版本 |
| Apple ID | 用于签名 |
| CocoaPods | 需要安装 |

### 7.2 iOS模拟器运行

```
npm run ios
```

或使用Expo命令：

```
npx expo run:ios
```

### 7.3 iOS构建打包

**使用EAS云构建：**

```
eas build --platform ios --profile preview
```

**构建生产版本：**

```
eas build --platform ios --profile production
```

### 7.4 iOS配置说明

app.json 中的iOS配置：

```
"ios": {
  "supportsTablet": true,
  "bundleIdentifier": "com.legostory.mobile",
  "config": {
    "usesNonExemptEncryption": false
  }
}
```

## 八、Web版本运行

### 8.1 启动Web开发服务器

```
npm run web
```

或指定端口：

```
npx expo start --web --port 8082
```

### 8.2 Web版本特点

- 自动使用 localhost:8788 作为API地址
- 支持热重载
- 可在浏览器中调试

## 九、完整开发流程

### 9.1 本地开发流程

**步骤一：启动后端服务**

```
cd c:\Users\yannis\Documents\trae_projects\lego_job
npm run dev
```

后端服务运行在 http://localhost:8788

**步骤二：配置API地址**

确保 app.json 中 apiBaseUrl 为开发地址

**步骤三：启动前端**

```
cd lego-mobile
npm start
```

**步骤四：选择运行平台**

- 按 a 键：Android模拟器
- 按 i 键：iOS模拟器（Mac）
- 按 w 键：Web浏览器

### 9.2 一键启动测试

使用 start-and-test.bat 脚本：

1. 启动后端服务（端口8788）
2. 等待10秒
3. 启动前端服务（端口8082）
4. 等待30秒
5. 运行Playwright测试

### 9.3 发布流程

**步骤一：切换API地址**

修改 app.json 中的 apiBaseUrl 为生产地址

**步骤二：更新版本号**

修改 app.json 中的 version

**步骤三：构建APK**

```
eas build --platform android --profile preview
```

**步骤四：测试验证**

安装APK到测试设备进行验证

**步骤五：发布**

上传到应用商店或分发平台

## 十、常见问题解决

### 10.1 构建失败问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| JAVA_HOME未设置 | 环境变量缺失 | 运行 set-env.bat 或手动配置 |
| ANDROID_HOME未找到 | SDK路径错误 | 检查SDK安装路径 |
| Gradle构建失败 | 依赖下载问题 | 检查网络，清理Gradle缓存 |
| 模拟器启动失败 | AVD配置问题 | 删除AVD重新创建 |

### 10.2 运行时问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 网络连接失败 | API地址错误 | 检查 app.json 配置 |
| 模拟器无法访问后端 | 地址配置问题 | 使用 10.0.2.2 替代 localhost |
| 白屏或崩溃 | JS错误 | 查看 adb logcat 日志 |

### 10.3 调试技巧

**查看详细构建日志：**

```
gradlew assembleDebug --info
```

**清理构建缓存：**

```
gradlew clean
```

**重置Expo缓存：**

```
npx expo start --clear
```

## 十一、项目实际构建记录

### 11.1 历史构建版本

根据Git记录，项目经历了以下主要构建版本：

| 提交 | 说明 |
|------|------|
| 23ce59d7 | 首页3D卡片展示优化与Crash修复 |
| 1c75f6ff | 切换APP API到线上地址 |
| 1efdba26 | 修复Android应用网络连接和动画问题 |
| ada512f4 | 添加Android构建配置 |

### 11.2 构建环境验证

验证环境是否正确配置：

```
java -version
npm --version
adb version
```

## 十二、快速参考

### 常用命令速查

| 命令 | 说明 |
|------|------|
| npm start | 启动开发服务器 |
| npm run android | 运行Android版本 |
| npm run ios | 运行iOS版本 |
| npm run web | 运行Web版本 |
| npm test | 运行测试 |
| gradlew assembleDebug | 构建Debug APK |
| adb devices | 查看已连接设备 |
| adb logcat | 查看日志 |

### 配置文件速查

| 文件 | 用途 |
|------|------|
| app.json | Expo应用配置 |
| package.json | 项目依赖配置 |
| eas.json | EAS构建配置 |
| android/build.gradle | Android构建配置 |
