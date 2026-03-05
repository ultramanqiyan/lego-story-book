# Appium 端到端测试文档

## 环境要求

### 必需软件

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | >= 18 | 运行测试脚本 |
| Appium | >= 2.0 | 自动化测试框架 |
| Android SDK | >= 30 | Android开发工具包 |
| Java JDK | 17 | Android构建依赖 |
| Android Emulator | API 34 | Android模拟器 |

### 安装步骤

```bash
# 1. 安装Appium
npm install -g appium

# 2. 安装UiAutomator2驱动
appium driver install uiautomator2

# 3. 安装项目依赖
cd lego-demo
npm install

# 4. 安装webdriverio
npm install webdriverio
```

### 环境变量

```powershell
# Windows PowerShell
$env:JAVA_HOME = "D:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Users\{用户名}\AppData\Local\Android\Sdk"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"
```

## 启动测试

### 1. 启动Android模拟器

```bash
# 列出可用模拟器
emulator -list-avds

# 启动模拟器
emulator -avd Pixel_6 -no-snapshot-load
```

### 2. 启动Appium服务器

```bash
appium
```

服务器地址: `http://127.0.0.1:4723`

### 3. 安装APK

```bash
# 构建APK
.\build-apk.bat

# 或手动安装
adb -s emulator-5554 install -r android\app\build\outputs\apk\debug\app-debug.apk
```

### 4. 运行测试脚本

```bash
# 运行舞台风格测试
node appium-stage-style-test.js

# 运行交互式测试
node appium-interactive-test.js

# 调试页面元素
node appium-debug.js
```

## 测试脚本规范

### 基本配置（优化版）

```javascript
const driver = await remote({
    capabilities: {
        platformName: 'Android',
        'appium:deviceName': 'emulator-5554',
        'appium:automationName': 'UiAutomator2',
        'appium:appPackage': 'com.legostory.demo',
        'appium:appActivity': '.MainActivity',
        'appium:noReset': true,
        'appium:newCommandTimeout': 600,
        'appium:autoGrantPermissions': true,
        // 性能优化配置
        'appium:waitForIdleTimeout': 100,    // 等待空闲超时
        'appium:waitForQuiescence': false,   // 禁用等待应用空闲
    },
    logLevel: 'error',
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    waitforTimeout: 2000,  // 全局等待超时（毫秒）
});
```

### 元素定位方式

```javascript
// 1. 通过文本定位
const button = await driver.$('//*[@text="按钮文本"]');

// 2. 通过包含文本定位
const element = await driver.$('//*[contains(@text, "部分文本")]');

// 3. 通过类名定位
const textView = await driver.$('//android.widget.TextView');

// 4. 通过ID定位
const view = await driver.$('//*[@resource-id="com.legostory.demo:id/viewId"]');
```

### 点击操作

```javascript
async function tapElement(driver, element) {
    const location = await element.getLocation();
    const size = await element.getSize();
    
    const centerX = location.x + size.width / 2;
    const centerY = location.y + size.height / 2;
    
    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: centerX, y: centerY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 50 },
                { type: 'pointerUp', button: 0 }
            ]
        }
    ]);
}
```

### 封装查找点击函数（推荐）

```javascript
/**
 * 查找元素并点击
 * @param {WebdriverIO.Browser} driver - WebDriver实例
 * @param {string} selector - 元素选择器
 * @param {number} timeout - 超时时间（毫秒），默认2000
 * @returns {Promise<boolean>} - 是否成功
 */
async function findAndTap(driver, selector, timeout = 2000) {
    try {
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });
        await tapElement(driver, element);
        return true;
    } catch (e) {
        return false;
    }
}

// 使用示例
if (await findAndTap(driver, '//*[@text="勇士"]')) {
    await driver.pause(50);
    console.log('✅ 已选择角色: 勇士');
}
```

### 等待时间规范

| 操作类型 | 推荐等待时间 | 说明 |
|----------|--------------|------|
| 应用启动 | 1500ms | 等待应用完全加载 |
| 页面切换 | 300ms | 页面跳转后等待 |
| 按钮点击 | 50ms | 点击后等待响应 |
| 弹窗打开 | 200ms | 弹窗动画时间 |
| 风格切换 | 200ms | UI更新时间 |

### 测试用例结构（优化版）

```javascript
console.log('⏳ [步骤编号] 步骤描述...');
if (await findAndTap(driver, '//*[@text="元素文本"]')) {
    await driver.pause(50);
    console.log('✅ 操作完成\n');
} else {
    console.log('⚠️ 操作失败\n');
}
```

## 性能优化

### 问题：测试脚本执行缓慢

**症状：**
- 每个步骤耗时约1.5秒
- `isDisplayed()` 方法等待时间过长

**原因：**
1. `isDisplayed()` 有默认超时时间（5秒或更长）
2. 元素查找失败会等待完整超时时间
3. 应用崩溃后，每个步骤都在等待超时

**解决方案：**

```javascript
// ❌ 错误写法 - 使用 isDisplayed()
const element = await driver.$('//*[@text="按钮"]');
if (await element.isDisplayed()) {  // 默认超时5秒
    await tapElement(driver, element);
}

// ✅ 正确写法 - 使用 waitForDisplayed
const element = await driver.$('//*[@text="按钮"]');
await element.waitForDisplayed({ timeout: 2000 });  // 设置2秒超时
await tapElement(driver, element);

// ✅ 最佳写法 - 封装函数
if (await findAndTap(driver, '//*[@text="按钮"]', 2000)) {
    // 成功
}
```

### 配置优化

```javascript
// 添加到 capabilities 中
{
    'appium:waitForIdleTimeout': 100,    // 减少等待空闲时间
    'appium:waitForQuiescence': false,   // 禁用等待应用空闲
}

// 添加到 remote 配置中
{
    waitforTimeout: 2000,  // 全局等待超时
}
```

## 常见问题

### 1. 找不到元素

**原因**: 元素尚未加载完成

**解决**: 使用 `waitForDisplayed` 替代 `isDisplayed`

```javascript
// ❌ 错误
if (await element.isDisplayed()) { }

// ✅ 正确
await element.waitForDisplayed({ timeout: 2000 });
```

### 2. Appium连接失败

**原因**: Appium服务器未启动

**解决**: 先启动Appium服务器

```bash
appium
```

### 3. UiAutomator2 instrumentation process crashed

**原因**: 应用代码有bug导致崩溃

**排查方法：**
```bash
# 查看崩溃日志
adb -s emulator-5554 logcat -d -t 200 | findstr -i "crash\|exception\|error"
```

**解决**: 修复应用代码bug，确保应用稳定后再运行测试

### 4. 模拟器无响应

**原因**: 模拟器卡死或未启动

**解决**: 重启模拟器

```bash
adb -s emulator-5554 reboot
```

### 5. APK安装失败

**原因**: 签名冲突

**解决**: 先卸载再安装

```bash
adb -s emulator-5554 uninstall com.legostory.demo
adb -s emulator-5554 install -r app-debug.apk
```

### 6. 测试失败未分析根因

**问题**: 测试失败时直接猜测原因，未查看日志

**解决**: 集成崩溃和错误检测

```javascript
const { execSync } = require('child_process');

async function checkForErrors() {
    try {
        const result = execSync(
            'adb -s emulator-5554 logcat -d | findstr /i "ReactNativeJS Error FATAL"',
            { encoding: 'utf8', timeout: 5000 }
        );
        if (result && result.trim()) {
            console.log('🚨 检测到应用错误!');
            console.log(result);
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

// 测试结束时调用
console.log('🔍 检查应用是否有错误...');
const hasErrors = await checkForErrors();
if (!hasErrors) {
    console.log('✅ 应用运行正常');
}
```

### 7. 弹窗操作失败后状态不一致

**问题**: 弹窗操作失败后，弹窗仍然打开，后续步骤无法找到元素

**解决**: 弹窗操作失败时关闭弹窗

```javascript
// 弹窗操作失败时关闭弹窗
if (await findAndTap(driver, '//*[@text="🎭"]', 1500)) {
    await driver.pause(400);
    if (await findAndTap(driver, '//*[contains(@text, "沉浸式场景")]', 1500)) {
        console.log('✅ 已切换风格');
    } else {
        console.log('⚠️ 未找到风格选项');
        await closeModal(driver);  // 关闭弹窗
        await driver.pause(100);
    }
}

// 关闭弹窗函数
async function closeModal(driver) {
    const { width, height } = await driver.getWindowSize();
    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: width / 2, y: height * 0.1 },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 50 },
                { type: 'pointerUp', button: 0 }
            ]
        }
    ]);
}
```

### 8. 页面需要滚动才能找到元素

**问题**: 元素在页面下方，需要滚动才能看到

**解决**: 添加滚动函数

```javascript
async function scrollDown(driver) {
    const { width, height } = await driver.getWindowSize();
    const startY = height * 0.7;
    const endY = height * 0.3;
    const centerX = width / 2;
    
    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 200, x: centerX, y: endY },
                { type: 'pointerUp', button: 0 }
            ]
        }
    ]);
}

// 使用示例
await scrollDown(driver);
await driver.pause(100);
if (await findAndTap(driver, '//*[@text="森林"]', 1500)) {
    console.log('✅ 已选择地形');
}
```

### 9. React Native动画错误导致大量日志

**问题**: 应用运行时大量错误日志 `Style property 'left' is not supported by native animated module`

**原因**: `useNativeDriver: true` 只支持 `opacity` 和 `transform` 属性，不支持 `left`、`top`、`width`、`height`

**排查方法：**
```bash
adb -s emulator-5554 logcat -d | findstr /i "is not supported"
```

**解决**: 使用 `transform: [{ translateX }, { translateY }]` 替代 `left`、`top`

```javascript
// ❌ 错误写法
<Animated.View style={{ left: anim.x, top: anim.y }}>

// ✅ 正确写法
<Animated.View style={{
    transform: [
        { translateX: anim.x },
        { translateY: anim.y }
    ]
}}>
```

## 测试覆盖范围

### 故事导演台测试 (appium-stage-style-test.js)

| 测试项 | 说明 |
|--------|------|
| 应用启动 | 验证应用正常启动 |
| 导航到导演台 | 点击导演台按钮进入页面 |
| 角色选择 | 选择多个角色 |
| 冒险类型选择 | 选择战斗类型 |
| 天气选择 | 选择晴天 |
| 地形选择 | 选择森林 |
| 装备选择 | 选择宝剑 |
| 舞台风格切换 | 切换三种舞台风格 |
| UI风格切换 | 切换UI主题 |
| 返回功能 | 返回主页面 |

### 舞台风格测试

| 风格 | 测试内容 |
|------|----------|
| 3D透视舞台 | 默认风格，验证角色显示 |
| 游戏战斗界面 | 验证头像框、能量条、状态标签 |
| 沉浸式场景 | 验证角色散落、天气效果、地形装饰 |

## 调试技巧

### 获取页面所有文本元素

```javascript
const textViews = await driver.$$('//android.widget.TextView');
for (const view of textViews) {
    const text = await view.getText();
    if (text) console.log(text);
}
```

### 获取页面源码

```javascript
const source = await driver.getPageSource();
console.log(source);
```

### 添加耗时统计

```javascript
const startTime = Date.now();
// ... 测试代码 ...
const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`⏱️ 总耗时: ${totalTime}秒`);
```
