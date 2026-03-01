# 类UML图文档

## 一、概述

本文档使用文字描述的方式展示LEGO Story APP的类结构和关系，帮助读者理解系统的架构设计。

## 二、核心类结构

### 2.1 API客户端类 (APIClient)

APIClient是所有网络请求的基础类，负责与服务器通信。

```
类名：APIClient
职责：管理网络请求、缓存、错误处理

属性：
- baseURL: 服务器基础地址
- cache: 请求缓存存储
- pendingRequests: 正在进行的请求

方法：
+ get(endpoint, options): 发送GET请求
+ post(endpoint, body, options): 发送POST请求
+ put(endpoint, body, options): 发送PUT请求
+ delete(endpoint, options): 发送DELETE请求
+ clearCache(): 清除所有缓存
- request(endpoint, options): 内部请求方法
- getCacheKey(endpoint, options): 生成缓存键
- getCached(key): 获取缓存数据
- setCache(key, data): 设置缓存数据
- timeout(promise, ms): 超时控制
```

### 2.2 上下文类 (Context)

APP使用React Context管理全局状态。

#### 认证上下文 (AuthContext)

```
类名：AuthContext
职责：管理用户登录状态和用户信息

属性：
- user: 当前登录用户信息
- isLoggedIn: 是否已登录
- isLoading: 加载状态

方法：
+ login(username): 用户登录
+ logout(): 用户登出
+ updateUser(data): 更新用户信息
```

#### 主题上下文 (ThemeContext)

```
类名：ThemeContext
职责：管理应用主题设置

属性：
- theme: 当前主题（light/dark）
- colors: 当前主题的颜色配置

方法：
+ toggleTheme(): 切换主题
+ setTheme(themeName): 设置指定主题
```

#### 提示上下文 (ToastContext)

```
类名：ToastContext
职责：管理全局提示消息

属性：
- toasts: 提示消息列表

方法：
+ show(message, type): 显示提示
+ hide(id): 隐藏提示
+ clear(): 清除所有提示
```

### 2.3 屏幕组件类 (Screens)

#### 主页屏幕 (HomeScreen)

```
类名：HomeScreen
职责：应用主页，展示功能入口

依赖：
- AuthContext: 获取用户信息
- ThemeContext: 获取主题设置

功能：
+ 显示欢迎信息
+ 展示功能卡片
+ 导航到各功能模块
```

#### 书架屏幕 (BookshelfScreen)

```
类名：BookshelfScreen
职责：展示用户的书籍列表

依赖：
- booksAPI: 获取书籍数据
- AuthContext: 获取用户ID

功能：
+ 展示书籍网格
+ 创建新书籍
+ 进入书籍详情
+ 删除书籍
```

#### 角色管理屏幕 (CharactersScreen)

```
类名：CharactersScreen
职责：管理故事角色

依赖：
- charactersAPI: 角色数据操作
- AuthContext: 用户信息

功能：
+ 展示角色列表
+ 创建新角色
+ 编辑角色属性
+ 删除角色
```

#### 章节阅读屏幕 (ChapterScreen)

```
类名：ChapterScreen
职责：展示章节内容和谜题

依赖：
- chaptersAPI: 获取章节内容
- puzzleAPI: 谜题交互

功能：
+ 展示故事内容
+ 显示章节标题
+ 谜题互动
+ 标记完成
```

#### 故事导演屏幕 (StoryDirectorScreen)

```
类名：StoryDirectorScreen
职责：控制故事生成过程

依赖：
- chaptersAPI: 生成章节
- plotOptionsAPI: 获取情节选项

功能：
+ 选择情节参数
+ 选择参与角色
+ 生成新章节
+ 预览生成结果
```

### 2.4 组件类 (Components)

#### 3D卡片组件 (Card3D)

```
类名：Card3D
职责：展示3D效果的卡片

依赖：
- react-native-reanimated: 动画库
- react-native-gesture-handler: 手势处理

属性：
- item: 卡片数据
- onPress: 点击回调
- style: 自定义样式

功能：
+ 3D翻转动画
+ 手势交互
+ 点击响应
```

#### 卡片组组件 (CardDeck3D)

```
类名：CardDeck3D
职责：展示多张卡片的组合效果

依赖：
- Card3D: 单卡组件
- use3DCard: 3D动画Hook

属性：
- items: 卡片数据数组
- onPress: 卡片点击回调
- layoutType: 布局类型

功能：
+ 扇形展开布局
+ 水平堆叠布局
+ 垂直堆叠布局
+ 卡片选择交互
```

### 2.5 自定义Hook类

#### 3D卡片动画Hook (use3DCard)

```
类名：use3DCard
职责：提供3D卡片动画逻辑

返回值：
- animatedStyle: 动画样式
- handlers: 手势处理器
- flipCard: 翻转方法

功能：
+ 计算动画值
+ 处理手势事件
+ 管理动画状态
```

## 三、类关系图（文字描述）

### 3.1 API模块关系

```
APIClient (核心客户端)
    │
    ├── usersAPI (用户API)
    │       └── 依赖 APIClient
    │
    ├── charactersAPI (人仔API)
    │       └── 依赖 APIClient
    │
    ├── booksAPI (书籍API)
    │       └── 依赖 APIClient
    │
    ├── bookCharactersAPI (书籍角色API)
    │       └── 依赖 APIClient
    │
    ├── chaptersAPI (章节API)
    │       └── 依赖 APIClient
    │
    ├── storyAPI (故事生成API)
    │       └── 依赖 APIClient
    │
    ├── puzzleAPI (谜题API)
    │       └── 依赖 APIClient
    │
    ├── shareAPI (分享API)
    │       └── 依赖 APIClient
    │
    └── plotOptionsAPI (情节选项API)
            └── 依赖 APIClient
```

### 3.2 Context层级关系

```
App (应用根组件)
    │
    └── ThemeProvider (主题提供者)
            │
            └── ToastProvider (提示提供者)
                    │
                    └── AuthProvider (认证提供者)
                            │
                            └── NavigationContainer (导航容器)
                                    │
                                    └── 各屏幕组件
```

### 3.3 屏幕与API关系

```
HomeScreen
    └── 使用 AuthContext

BookshelfScreen
    ├── 使用 booksAPI
    └── 使用 AuthContext

CharactersScreen
    ├── 使用 charactersAPI
    └── 使用 AuthContext

ChapterScreen
    ├── 使用 chaptersAPI
    ├── 使用 puzzleAPI
    └── 使用 AuthContext

StoryDirectorScreen
    ├── 使用 chaptersAPI
    ├── 使用 plotOptionsAPI
    └── 使用 AuthContext

BookDetailScreen
    ├── 使用 booksAPI
    ├── 使用 chaptersAPI
    └── 使用 AuthContext
```

### 3.4 组件组合关系

```
Card3DDemoScreen (3D卡片演示屏幕)
    │
    ├── Card3D (单张3D卡片)
    │       └── 使用 use3DCard Hook
    │
    └── CardDeck3D (卡片组)
            ├── 使用 Card3D
            └── 使用 use3DCard Hook
```

## 四、数据流向

### 4.1 用户登录流程

```
用户输入用户名
    ↓
LoginScreen 调用 AuthContext.login()
    ↓
AuthContext 调用 usersAPI.createOrLogin()
    ↓
usersAPI 使用 APIClient.post() 发送请求
    ↓
服务器返回用户信息
    ↓
AuthContext 更新用户状态
    ↓
界面跳转到主页
```

### 4.2 故事生成流程

```
用户选择情节参数
    ↓
StoryDirectorScreen 收集参数
    ↓
调用 chaptersAPI.generate()
    ↓
chaptersAPI 发送生成请求
    ↓
服务器调用AI生成内容
    ↓
返回新章节内容
    ↓
界面显示新章节
```

### 4.3 谜题交互流程

```
用户阅读章节
    ↓
显示章节中的谜题
    ↓
用户输入答案
    ↓
调用 puzzleAPI.submit()
    ↓
服务器验证答案
    ↓
返回验证结果
    ↓
显示正确/错误提示
```

## 五、设计原则

### 5.1 单一职责原则

每个类只负责一个功能：
- APIClient只负责网络请求
- Context只负责状态管理
- Screen只负责界面展示

### 5.2 依赖倒置原则

高层模块不依赖低层模块：
- Screen依赖API接口，不依赖具体实现
- Context提供统一的状态访问方式

### 5.3 开闭原则

对扩展开放，对修改关闭：
- 新增API只需添加新模块
- 新增屏幕只需添加新组件

## 六、命名规范

| 类型 | 命名规则 | 示例 |
|------|----------|------|
| 类名 | 大驼峰 | HomeScreen, APIClient |
| 方法名 | 小驼峰 | getUser, createBook |
| 属性名 | 小驼峰 | isLoading, currentUser |
| 常量 | 全大写下划线 | API_BASE, CACHE_DURATION |
| 私有方法 | 下划线前缀 | _handleRequest |
