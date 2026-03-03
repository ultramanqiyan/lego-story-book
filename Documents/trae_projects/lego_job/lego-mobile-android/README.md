# 乐高故事书 - Android原生版

这是一个使用Kotlin + Jetpack Compose开发的Android原生应用，完全复刻了lego-mobile React Native应用。

## 项目结构

```
lego-mobile-android/
├── app/                    # 主应用模块
│   ├── src/main/          # 主要源代码
│   │   ├── java/          # Kotlin/Java代码
│   │   └── res/           # 资源文件
│   └── build.gradle.kts   # 应用构建配置
├── core/                   # 核心模块（常量、工具类）
├── data/                   # 数据层（API、存储）
├── domain/                 # 业务逻辑层
├── build.gradle.kts       # 项目构建配置
└── settings.gradle.kts    # 项目设置
```

## 功能特性

### 已实现功能
- ✅ 用户登录/注册
- ✅ 首页展示（热门人仔、最近故事）
- ✅ 书架管理
- ✅ 角色管理
- ✅ 冒险页面
- ✅ 设置页面
- ✅ 故事创建流程
- ✅ 书籍详情页
- ✅ 章节阅读页
- ✅ Demo页面（卡牌效果展示）
- ✅ 导航系统
- ✅ 主题系统
- ✅ 动画效果

### 技术栈
- **语言**: Kotlin
- **UI框架**: Jetpack Compose
- **架构**: MVVM + Clean Architecture
- **网络**: OkHttp + Gson
- **存储**: DataStore Preferences
- **测试**: JUnit + MockK + Turbine

## 构建要求

- JDK 17+
- Android SDK 34
- Android Studio Hedgehog (2023.1.1) 或更高版本
- Gradle 8.4

## 构建步骤

### 使用Android Studio（推荐）

1. 打开Android Studio
2. 选择 "Open an Existing Project"
3. 选择 `lego-mobile-android` 目录
4. 等待Gradle同步完成
5. 点击 Run 按钮或按 Shift+F10

### 使用命令行

```bash
# Windows
cd lego-mobile-android
gradlew.bat assembleDebug

# Linux/Mac
cd lego-mobile-android
./gradlew assembleDebug
```

APK将生成在 `app/build/outputs/apk/debug/` 目录下。

## 运行测试

### 单元测试
```bash
# Windows
gradlew.bat test

# Linux/Mac
./gradlew test
```

### 测试覆盖率报告
```bash
# Windows
gradlew.bat jacocoTestReport

# Linux/Mac
./gradlew jacocoTestReport
```

## API配置

应用默认连接到 `http://10.0.2.2:8788/api`（Android模拟器访问本地服务器的地址）。

如需修改API地址，请编辑 `data/src/main/java/com/legostory/mobile/data/api/ApiClient.kt` 文件中的 `baseUrl` 参数。

## 项目模块说明

### core模块
包含应用的核心常量和工具类：
- `Colors.kt` - 颜色常量
- `RoleColors.kt` - 角色类型颜色
- `PlotTypes.kt` - 情节类型
- `RoleTypes.kt` - 角色类型
- `CharacterEmojis.kt` - 角色表情符号
- `Themes.kt` - 主题配置

### data模块
数据层实现：
- `api/` - API客户端和各模块API
- `model/` - 数据模型
- `storage/` - 本地存储管理

### domain模块
业务逻辑层：
- `repository/` - 仓库接口定义
- `repository/impl/` - 仓库实现

### app模块
主应用模块：
- `ui/components/` - UI组件
- `ui/screens/` - 页面
- `ui/viewmodel/` - ViewModel
- `ui/navigation/` - 导航
- `ui/theme/` - 主题

## 测试覆盖

项目包含完整的单元测试：
- Core模块测试：颜色、角色类型、情节类型等
- Data模块测试：API客户端、数据模型
- ViewModel测试：AuthViewModel、HomeViewModel、BookshelfViewModel

## 注意事项

1. 确保后端服务运行在 `http://localhost:8788`
2. Android模拟器需要使用 `10.0.2.2` 访问主机localhost
3. 首次构建需要下载依赖，请确保网络畅通

## 许可证

MIT License
