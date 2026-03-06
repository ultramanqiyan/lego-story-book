# Appium测试用例文档

## 概述

本文档记录了乐高故事书应用的Appium端到端测试用例，包括测试文件、构建脚本和模拟器管理脚本。

---

## 测试环境

| 项目 | 配置 |
|------|------|
| Android SDK | C:\Users\yannis\AppData\Local\Android\Sdk |
| 模拟器设备 | emulator-5554 (Pixel_6) |
| APP包名 | com.legostory.demo |
| APP Activity | .MainActivity |
| Appium端口 | 4723 |
| Appium Base Path | / |

---

## 快速启动脚本

### 1. 启动模拟器

```powershell
powershell -ExecutionPolicy Bypass -File start-emulator.ps1
```

### 2. 构建APK

```powershell
powershell -ExecutionPolicy Bypass -File build-apk.ps1
```

### 3. 安装APK

```powershell
powershell -ExecutionPolicy Bypass -File install-apk.ps1
```

### 4. 运行APP

```powershell
powershell -ExecutionPolicy Bypass -File run-app.ps1
```

---

## 有效测试文件

### 主要测试文件

| 文件名 | 描述 | 测试点数量 | 状态 |
|--------|------|------------|------|
| `appium-full-test.js` | 全面功能测试，覆盖所有可点击元素 | 50 | ✅ 有效 |
| `appium-create-book-test.js` | 创建书籍和添加章节功能测试 | 22 | ✅ 有效 |
| `appium-real-data-test.js` | 真实数据测试 | - | ✅ 有效 |

### 专项测试文件

| 文件名 | 描述 | 状态 |
|--------|------|------|
| `appium-bookshelf-test.js` | 书架页功能测试 | ✅ 有效 |
| `appium-book-detail-test.js` | 书籍详情页测试 | ✅ 有效 |
| `appium-director-test.js` | 故事导演页测试 | ✅ 有效 |
| `appium-ui-style-test.js` | UI风格测试 | ✅ 有效 |
| `appium-ui-style-detailed-test.js` | UI风格详细测试 | ✅ 有效 |
| `appium-stage-style-test.js` | 舞台风格测试 | ✅ 有效 |
| `appium-stage-style-extended-test.js` | 舞台风格扩展测试 | ✅ 有效 |
| `appium-visual-test.js` | 视觉测试 | ✅ 有效 |
| `appium-detailed-test.js` | 详细功能测试 | ✅ 有效 |
| `appium-interactive-test.js` | 交互测试 | ✅ 有效 |
| `appium-debug.js` | 调试测试 | ✅ 有效 |
| `appium-test.js` | 基础测试 | ✅ 有效 |
| `appium-test-visual.js` | 视觉测试（备用） | ✅ 有效 |

---

## 测试用例详情

### appium-full-test.js - 全面功能测试

**测试范围：**
1. 首页导航功能
2. 卡牌Demo页面所有按钮
3. 书架页功能（创建、删除书籍）
4. 书籍详情页（章节、角色、情节）
5. 故事导演页（选择卡牌、创建章节）
6. 翻页功能（目录翻页、章节翻页）
7. 答题解锁卡牌功能
8. 返回首页路径测试

**测试用例列表：**

#### 首页测试 (3个)
| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| H-01 | APP启动 | APP成功启动 |
| H-02 | 首页显示 | 显示"乐高故事书"标题 |
| H-03 | 进入书架页 | 点击书架按钮进入书架页 |

#### 书架页测试 (6个)
| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| B-01 | 书架页显示 | 显示"我的书架"标题 |
| B-02 | 创建书籍按钮 | 点击创建按钮显示弹窗 |
| B-03 | 创建书籍弹窗 | 显示"创建新故事"弹窗 |
| B-04 | 书籍名称输入 | 输入框可输入文本 |
| B-05 | 书籍类型选择 | 可选择魔法世界等类型 |
| B-06 | 书籍创建成功 | 创建后跳转到书籍详情页 |

#### 书籍详情页测试 (7个)
| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| D-01 | 书籍详情页显示 | 显示章节标签 |
| D-02 | 章节标签页 | 点击切换到章节列表 |
| D-03 | 角色标签页 | 点击切换到角色列表 |
| D-04 | 情节标签页 | 点击切换到情节列表 |
| D-05 | 章节点击 | 点击章节进入内容页 |
| D-06 | 角色卡牌点击 | 点击角色卡牌高亮显示 |
| D-07 | 情节卡牌点击 | 点击情节卡牌高亮显示 |

#### 翻页功能测试 (5个)
| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| P-01 | 目录上一页 | 翻到目录上一页 |
| P-02 | 目录下一页 | 翻到目录下一页 |
| P-03 | 章节上一章 | 翻到上一章内容 |
| P-04 | 章节下一章 | 翻到下一章内容 |
| P-05 | 返回目录 | 从内容页返回目录 |

#### 故事导演页测试 (9个)
| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| S-01 | 添加章节按钮 | 点击进入故事导演页 |
| S-02 | 故事导演页显示 | 显示"故事导演"标题 |
| S-03 | 角色选择 | 可选择法师、精灵等角色 |
| S-04 | 天气选择 | 可选择月夜、迷雾等天气 |
| S-05 | 地形选择 | 可选择魔法塔、禁林等地形 |
| S-06 | 装备选择 | 可选择法杖、魔戒等装备 |
| S-07 | 冒险类型选择 | 可选择施法、召唤等类型 |
| S-08 | 开拍按钮 | 点击开始拍摄 |
| S-09 | 章节创建成功 | 创建后返回书籍详情页 |

#### 多章节测试 (1个)
| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| M-01 | 多章节创建 | 可创建多个章节 |

#### 返回首页路径测试 (3个)
| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| R-01 | 返回书架页 | 从书籍详情页返回书架 |
| R-02 | 从书架返回首页 | 点击返回按钮 |
| R-03 | 首页显示正常 | 显示首页内容 |

#### 卡牌Demo页面测试 (7个)
| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| C-01 | 进入卡牌Demo | 从首页点击卡牌按钮 |
| C-02 | 卡牌Demo页面显示 | 显示游戏界面 |
| C-03 | 首页按钮 | 点击返回首页 |
| C-04 | 风格按钮 | 点击显示风格选择器 |
| C-05 | 书架按钮 | 点击进入书架页 |
| C-06 | 导演台按钮 | 点击进入故事导演页 |
| C-07 | 书籍按钮 | 点击进入书籍详情页 |

#### 删除书籍测试 (1个)
| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| X-01 | 书籍删除功能 | 可删除创建的书籍 |

---

### appium-create-book-test.js - 创建书籍测试

**测试范围：**
1. 书架页创建书籍
2. 书籍详情页验证
3. 故事导演页创建章节
4. 章节内容验证

**测试用例列表：**

| 编号 | 测试项 | 预期结果 |
|------|--------|----------|
| CB-01 | APP启动 | APP成功启动 |
| CB-02 | 进入书架页 | 显示书架页面 |
| CB-03 | 创建书籍按钮 | 显示创建弹窗 |
| CB-04 | 创建书籍弹窗 | 显示创建表单 |
| CB-05 | 书籍名称输入 | 输入成功 |
| CB-06 | 书籍类型选择 | 选择成功 |
| CB-07 | 书籍创建成功 | 跳转到详情页 |
| CB-08 | 书籍详情页显示 | 显示章节信息 |
| CB-09 | 初始角色卡牌 | 显示角色卡牌 |
| CB-10 | 初始情节元素 | 显示情节元素 |
| CB-11 | 添加章节按钮 | 进入故事导演页 |
| CB-12 | 故事导演页 | 显示导演页面 |
| CB-13 | 角色选择 | 选择成功 |
| CB-14 | 天气选择 | 选择成功 |
| CB-15 | 地形选择 | 选择成功 |
| CB-16 | 装备选择 | 选择成功 |
| CB-17 | 冒险类型选择 | 选择成功 |
| CB-18 | 开拍按钮 | 点击成功 |
| CB-19 | 章节创建成功 | 返回详情页 |
| CB-20 | 章节内容和谜题 | 显示章节内容 |
| CB-21 | 卡牌解锁功能 | 答题解锁卡牌 |
| CB-22 | 书籍删除功能 | 删除成功 |

---

## 构建脚本说明

### build-apk.ps1 - 构建APK

**功能：** 构建Android APK文件

**使用方法：**
```powershell
powershell -ExecutionPolicy Bypass -File build-apk.ps1
```

**输出：**
- APK文件位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### install-apk.ps1 - 安装APK

**功能：** 安装APK到模拟器

**使用方法：**
```powershell
powershell -ExecutionPolicy Bypass -File install-apk.ps1
```

**前置条件：**
- 模拟器已启动
- APK已构建

### start-emulator.ps1 - 启动模拟器

**功能：** 启动Android模拟器

**使用方法：**
```powershell
powershell -ExecutionPolicy Bypass -File start-emulator.ps1
```

**配置：**
- 模拟器名称：Pixel_6
- 设备ID：emulator-5554

### run-app.ps1 - 运行APP

**功能：** 在模拟器中启动APP

**使用方法：**
```powershell
powershell -ExecutionPolicy Bypass -File run-app.ps1
```

---

## 测试运行命令

### 运行全面功能测试

```bash
node appium-full-test.js
```

### 运行创建书籍测试

```bash
node appium-create-book-test.js
```

### 运行真实数据测试

```bash
node appium-real-data-test.js
```

---

## 书籍类型数据

系统支持以下4种书籍类型：

| typeId | 类型名称 | 描述 |
|--------|----------|------|
| children | 儿童探险 | 适合儿童的冒险故事 |
| magic | 魔法世界 | 魔法奇幻故事 |
| urban | 都市职场 | 现代都市故事 |
| mechanical | 机械帝国 | 科幻机械故事 |

### 魔法世界类型卡牌数据

| 类型 | 卡牌名称 |
|------|----------|
| 角色 | 法师、精灵、巨龙、独角兽 |
| 天气 | 月夜、迷雾、雷暴、极光 |
| 地形 | 魔法塔、禁林、龙巢、水晶洞 |
| 装备 | 法杖、魔戒、魔法书、水晶球 |
| 冒险类型 | 施法、召唤、炼金、飞行 |

---

## 常见问题

### Q1: Appium服务器启动失败

**解决方案：**
```bash
# 检查Appium是否安装
npm list -g appium

# 重新安装Appium
npm install -g appium
```

### Q2: 模拟器连接失败

**解决方案：**
```bash
# 检查模拟器状态
adb devices

# 重启ADB服务
adb kill-server
adb start-server
```

### Q3: APK安装失败

**解决方案：**
```bash
# 卸载旧版本
adb uninstall com.legostory.demo

# 重新安装
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 更新日志

| 日期 | 版本 | 更新内容 |
|------|------|----------|
| 2026-03-07 | 1.0 | 初始版本，记录所有测试用例 |
| 2026-03-07 | 1.1 | 添加翻页功能测试、返回首页路径测试 |

---

*最后更新：2026-03-07*
