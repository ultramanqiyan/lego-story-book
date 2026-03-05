# 经验反思文档

## 2026-03-05 舞台风格开发经验

### 问题1：React Native动画循环导致应用崩溃

**问题描述：**
- 在故事导演台页面中，装备卡片的波浪动画导致应用崩溃
- 崩溃发生在选择冒险类型之后

**根本原因：**
```javascript
// 错误的动画循环写法
waveAnims.forEach((anim) => {
  Animated.loop(
    Animated.parallel([
      Animated.sequence([...]),  // y轴动画 2秒
      Animated.timing(anim.rotate, {
        toValue: 1,
        duration: 2000,  // rotate动画只执行一次，不循环
        ...
      }),
    ])
  ).start();
});
```

问题在于 `anim.rotate` 动画在循环中只从0到1执行一次，第二次循环时值已经是1，无法继续动画，导致崩溃。

**解决方案：**
```javascript
// 正确的动画循环写法 - 所有动画都在sequence中重置
waveAnims.forEach((anim) => {
  Animated.loop(
    Animated.sequence([
      Animated.parallel([
        Animated.timing(anim.y, { toValue: -8, duration: 500 }),
        Animated.timing(anim.rotate, { toValue: 1, duration: 500 }),
      ]),
      Animated.parallel([
        Animated.timing(anim.y, { toValue: 8, duration: 1000 }),
        Animated.timing(anim.rotate, { toValue: 0, duration: 1000 }),  // 重置
      ]),
      Animated.parallel([
        Animated.timing(anim.y, { toValue: 0, duration: 500 }),
        Animated.timing(anim.rotate, { toValue: 0, duration: 500 }),
      ]),
    ])
  ).start();
});
```

**经验教训：**
1. `Animated.loop` 中的所有动画值必须在循环结束时重置到初始状态
2. 使用 `Animated.sequence` 确保动画按顺序执行并重置
3. 避免在 `Animated.parallel` 中混合不同时长的循环动画

---

### 问题2：Appium测试脚本执行缓慢

**问题描述：**
- 测试脚本每个步骤耗时约1.5秒
- 总测试时间超过20秒

**根本原因：**
1. `isDisplayed()` 方法有默认超时时间（5秒或更长）
2. 每次元素查找失败都会等待完整超时时间
3. 应用崩溃后，每个步骤都在等待超时

**解决方案：**
```javascript
// 1. 设置更短的超时时间
driver = await remote({
    capabilities: {
        'appium:waitForIdleTimeout': 100,
        'appium:waitForQuiescence': false,
    },
    waitforTimeout: 2000,  // 全局等待超时
});

// 2. 使用 waitForDisplayed 替代 isDisplayed
async function findAndTap(driver, selector, timeout = 2000) {
    try {
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });  // 设置超时
        await tapElement(driver, element);
        return true;
    } catch (e) {
        return false;
    }
}

// 3. 减少不必要的等待
await driver.pause(50);  // 点击后只需短暂等待
```

**经验教训：**
1. 使用 `waitForDisplayed({ timeout })` 替代 `isDisplayed()`
2. 设置全局 `waitforTimeout` 控制默认超时
3. 添加 `waitForQuiescence: false` 禁用等待应用空闲
4. 封装通用的查找点击函数，统一处理超时

---

### 问题3：UiAutomator2 instrumentation process crashed

**问题描述：**
```
WebDriverError: 'POST /element' cannot be proxied to UiAutomator2 server 
because the instrumentation process is not running (probably crashed)
```

**根本原因：**
- 应用代码有bug导致崩溃
- React Native动画循环错误

**排查方法：**
1. 检查logcat日志
2. 检查React Native代码中的动画循环
3. 确保所有动画值在循环中正确重置

**经验教训：**
1. 先在模拟器中手动测试，确保应用稳定后再运行自动化测试
2. 使用 `adb logcat` 查看崩溃日志
3. 分步骤测试，定位崩溃点

---

### 问题4：NDK版本不匹配导致构建失败

**问题描述：**
```
No version of NDK matched the requested version 26.1.10909125
```

**解决方案：**
修改 `android/build.gradle` 中的 NDK 版本为已安装的版本：
```groovy
ndkVersion = "25.1.8937393"
```

**经验教训：**
1. 检查 `C:\Users\{用户名}\AppData\Local\Android\Sdk\ndk` 目录查看已安装版本
2. 确保项目配置与本地环境匹配

---

### 问题5：测试失败case未进行根因分析

**问题描述：**
- 测试失败时直接猜测原因，未查看日志
- 没有崩溃检测机制

**根本原因：**
- 缺少日志分析步骤
- 测试脚本没有集成崩溃检测

**解决方案：**
```javascript
// 添加崩溃检测函数
const { execSync } = require('child_process');

async function checkForCrashes() {
    try {
        const result = execSync(
            'adb -s emulator-5554 logcat -d -t 20 AndroidRuntime:E ReactNativeJS:E *:S',
            { encoding: 'utf8', timeout: 5000 }
        );
        if (result && result.includes('FATAL')) {
            console.log('🚨 检测到应用崩溃!');
            console.log(result);
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

// 在测试失败时调用
catch (error) {
    console.error('❌ 测试失败:', error.message);
    crashDetected = await checkForCrashes();
    if (crashDetected) {
        console.log('🚨 测试失败原因: 应用崩溃');
    }
}
```

**经验教训：**
1. 测试失败时必须先查看日志分析原因
2. 集成崩溃检测到测试脚本中
3. 使用 `adb logcat -d -t 20 AndroidRuntime:E ReactNativeJS:E *:S` 快速检查崩溃

---

### 问题6：测试步骤失败后未正确处理弹窗状态

**问题描述：**
- 弹窗操作失败后，弹窗仍然打开
- 后续步骤无法找到元素

**根本原因：**
- 弹窗选择失败后没有关闭弹窗
- 页面状态不一致

**解决方案：**
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
```

**经验教训：**
1. 弹窗操作失败后必须关闭弹窗
2. 每个弹窗操作都要有失败处理
3. 使用统一的弹窗关闭函数

---

### 问题7：React Native动画使用 `left`/`top` 属性导致大量错误日志

**问题描述：**
- 应用运行时控制台大量红色错误日志
- 错误信息：`Style property 'left' is not supported by native animated module`

**根本原因：**
React Native 的 `useNativeDriver: true` 只支持以下CSS属性：
- `opacity`
- `transform` (translateX, translateY, scale, rotateX, rotateY)

**不支持**:
- `left`
- `top`
- `width`
- `height`
- `margin*`
- `padding`

**问题代码：**
```javascript
// 错误写法 - 使用 left/top 属性
const particleAnims = useRef(Array(20).fill(null).map((_, i) => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(Math.random() * 200),
    opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
    scale: new Animated.Value(Math.random() * 0.5 + 0.5),
  })).current;
}));

particleAnims.forEach((anim) => {
  Animated.loop(
    Animated.timing(anim.x, {
      toValue: Math.random() * width,
      duration: 0,
      useNativeDriver: true,  // ❌ left 不支持
    }),
    Animated.timing(anim.y, {
      toValue: 250,
      duration: 3000 + Math.random() * 2000,
      useNativeDriver: true,  // ❌ top 不支持
    })
  ).start();
});

// 渲染粒子
<Animated.View style={[ left: anim.x, top: anim.y ]}>
```

**解决方案：**
```javascript
// 正确写法 - 使用 transform 替代 left/top
const particleAnims = useRef(Array(20).fill(null).map((_, i) => ({
    x: new Animated.Value(Math.random() * width),
    y: new Animated.Value(Math.random() * 200),
    opacity: new Animated.Value(Math.random() * 0.5 + 0.3),
    scale: new Animated.Value(Math.random() * 0.5 + 0.5),
  }));

  translateY: x.interpolate({
    inputRange: [0, width],
    outputRange: [width, 0],
  });
  translateY: y.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 0],
  });
}));

particleAnims.forEach((anim) => {
  Animated.loop(
    Animated.sequence([
      Animated.parallel([
        Animated.timing(anim.translateY, {
          toValue: 250,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,  // ✅ translateY 支持
        }),
        Animated.timing(anim.translateX, {
          toValue: Math.random() * width,
          duration: 0,
          useNativeDriver: true,  // ✅ translateX 支持
        }),
      ]),
      Animated.timing(anim.translateY, {
        toValue: -10,
        duration: 0,
        useNativeDriver: true,  // ✅ 重置
      }),
    ])
  ).start();
});

// 渲染粒子
<Animated.View 
  style={{
    position: 'absolute',
    opacity: anim.opacity,
    transform: [
      { translateX: anim.translateX },
      { translateY: anim.translateY },
      { scale: anim.scale },
    ],
  }}
>
```

**经验教训：**
1. **`useNativeDriver: true` 只支持 `opacity` 和 `transform` 属性**
2. 不要使用 `left`、`top`、`width`、`height` 等CSS属性
3. 使用 `transform: [{ translateX }, { translateY }]` 替代 `left`、`top`
4. **查看日志时搜索 "is not supported by native animated module"**

---

## 最佳实践总结

### React Native动画
1. 所有循环动画必须能重置到初始状态
2. 使用 `Animated.sequence` 管理复杂动画序列
3. 避免在循环中使用不重置的动画值
4. **`useNativeDriver: true` 只支持 `opacity` 和 `transform` 属性**
5. **不要使用 `left`、`top`、`width`、`height` 等CSS属性**

### Appium测试
1. 设置合理的超时时间（1.5-2秒足够）
2. 封装通用的元素查找和点击函数
3. 添加总耗时统计，便于性能分析
4. 先确保应用稳定，再运行自动化测试
5. **集成崩溃检测机制**
6. **测试失败时先查看日志分析原因**
7. **弹窗操作失败后必须关闭弹窗**
8. **日志检测要包含 ReactNativeJS 错误，不只是崩溃**

### 构建流程
1. 使用 `--clear` 参数清理缓存
2. 检查NDK版本匹配
3. 使用一键构建脚本提高效率

### 问题8：测试脚本未检测APP状态导致测试失败

**问题描述：**
- 测试脚本直接开始测试，未检测APP是否在前台运行
- APP未启动或未在前台时，测试失败
- 浪费时间等待超时

**根本原因：**
- 测试脚本缺少APP状态检测步骤
- 没有在测试前确保APP已启动并处于前台

**解决方案：**
```javascript
// 1. 检测APP进程是否存在
async function checkAppProcess() {
    try {
        const result = execSync(
            'adb -s emulator-5554 shell "ps | grep legostory"',
            { encoding: 'utf8', timeout: 3000 }
        );
        return result && result.trim().length > 0;
    } catch (e) {
        return false;
    }
}

// 2. 检测APP是否在前台运行
async function checkAppInForeground() {
    try {
        const result = execSync(
            'adb -s emulator-5554 shell "dumpsys activity activities | grep mResumedActivity"',
            { encoding: 'utf8', timeout: 3000 }
        );
        return result && result.includes('com.legostory.demo');
    } catch (e) {
        return false;
    }
}

// 3. 启动APP
async function launchApp() {
    try {
        execSync(
            'adb -s emulator-5554 shell am start -n com.legostory.demo/.MainActivity',
            { encoding: 'utf8', timeout: 5000 }
        );
        await driver.pause(1000);  // 等待APP启动
        return true;
    } catch (e) {
        return false;
    }
}

// 4. 测试开始前检测并启动APP
async function ensureAppRunning() {
    console.log('🔍 检测APP状态...');
    
    // 检测APP进程
    const processExists = await checkAppProcess();
    if (!processExists) {
        console.log('⚠️ APP进程不存在，正在启动APP...');
        await launchApp();
    } else {
        // 检测APP是否在前台
        const inForeground = await checkAppInForeground();
        if (!inForeground) {
            console.log('⚠️ APP不在前台，正在切换到前台...');
            await launchApp();
        } else {
            console.log('✅ APP已在前台运行');
        }
    }
}
```

**经验教训：**
1. **测试脚本第一步必须检测APP状态**
2. 检测APP进程是否存在：`adb shell "ps | grep <package>"`
3. 检测APP是否在前台：`adb shell "dumpsys activity activities | grep mResumedActivity"`
4. 如果APP未运行，先启动APP再开始测试
5. 避免在APP未启动时直接运行测试，浪费时间等待超时

---

### 问题9：React Native代码修改后未生效

**问题描述：**
- 修改了React Native代码，但APP中没有看到修改效果
- 弹窗仍然只显示3种舞台风格，而不是7种
- 重新构建APK失败，提示Java虚拟机配置文件找不到

**根本原因：**
1. **React Native代码修改需要重新构建APK才能生效**
   - React Native的JavaScript代码打包在APK中
   - 修改代码后需要重新打包和构建
   
2. **热重载只在开发模式下有效**
   - 开发模式下，APP连接到Metro Bundler
   - Metro Bundler可以实时推送代码更新
   - 但这需要APP处于开发模式且连接到开发服务器

3. **构建失败的原因**
   - Java虚拟机配置文件路径错误
   - 可能是Android Studio或Java环境配置问题

**解决方案：**

**方案1：使用热重载（推荐）**
```bash
# 1. 确保前端服务正在运行
npm run dev  # 或 npx expo start

# 2. 在模拟器中打开开发者菜单
# 方法1：摇晃设备（Ctrl+M 或 Cmd+M）
# 方法2：adb命令
adb -s emulator-5554 shell input keyevent 82

# 3. 选择"Reload"重新加载
# 或者选择"Enable Fast Refresh"启用快速刷新
```

**方案2：重新构建APK**
```bash
# 1. 修复Java环境配置
# 检查JAVA_HOME环境变量
echo $JAVA_HOME

# 2. 检查Android Studio路径
# 确保Android Studio安装在正确路径

# 3. 重新构建
npx expo run:android
```

**方案3：清除缓存后重新构建**
```bash
# 1. 清除缓存
npx expo start --clear

# 2. 清除Android构建缓存
cd android
./gradlew clean
cd ..

# 3. 重新构建
npx expo run:android
```

**经验教训：**
1. **React Native代码修改后需要重新构建APK**
2. **开发模式下可以使用热重载加速开发**
3. **确保前端服务正在运行，Metro Bundler正常工作**
4. **在模拟器中使用开发者菜单重新加载APP**
5. **如果构建失败，检查Java和Android环境配置**
6. **记录构建失败的原因和解决方案，方便后续排查**

---

### 问题排查流程
1. **检测APP状态** - 确保APP已启动并处于前台
2. **先查看日志** - `adb logcat -d | findstr /i "ReactNativeJS\|Error\|FATAL"`
3. **检查崩溃** - 搜索 `FATAL` 或 `Exception`
4. **检查错误** - 搜索 "is not supported" 或 "Error:"
5. **定位代码** - 根据堆栈信息定位问题代码
6. **修复验证** - 修复后重新构建测试

---

### 问题10：Gradle缓存损坏导致构建失败

**问题描述：**
- 运行构建脚本时，Gradle构建失败
- 错误信息：`Could not read workspace metadata from .../metadata.bin`
- 构建过程中断，无法生成APK

**根本原因：**
1. **Gradle缓存损坏**
   - `.gradle` 目录中的元数据文件损坏
   - 可能是之前的构建过程被中断导致
   
2. **缓存文件不完整**
   - `dependencies-accessors` 目录中的 `metadata.bin` 文件损坏
   - Gradle无法读取工作空间元数据

**解决方案：**

**方案1：清除Gradle缓存（推荐）**
```powershell
# 清除Gradle缓存
Remove-Item -Recurse -Force "android\.gradle" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "android\app\src\main\assets\index.android.bundle" -ErrorAction SilentlyContinue

# 重新构建
.\run-app.ps1
```

**方案2：使用Gradle命令清除**
```bash
cd android
.\gradlew clean
cd ..
.\run-app.ps1
```

**方案3：完全清除所有缓存**
```powershell
# 清除所有缓存
Remove-Item -Recurse -Force "$env:TEMP\metro-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "$env:TEMP\react-*" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".expo" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "node_modules\.cache" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "android\.gradle" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue

# 重新构建
.\run-app.ps1
```

**经验教训：**
1. **Gradle缓存损坏是常见问题** - 构建失败时首先检查缓存
2. **清除缓存可以解决大部分构建问题**
3. **记录构建失败的错误信息** - 方便快速定位问题
4. **使用PowerShell脚本替代批处理文件** - 兼容性更好
5. **添加进度条显示** - 方便了解构建进度

---

### 问题11：PowerShell与批处理文件兼容性问题

**问题描述：**
- 在PowerShell中运行 `.bat` 批处理文件时出现解析错误
- 错误信息：`'ocal' 不是内部或外部命令`
- 批处理文件中的命令被错误解析

**根本原因：**
1. **PowerShell与CMD的语法差异**
   - PowerShell对批处理文件的解析方式不同
   - 批处理文件中的某些语法在PowerShell中不支持
   
2. **编码问题**
   - 批处理文件中的特殊字符在PowerShell中显示乱码
   - 中文字符无法正确显示

**解决方案：**

**方案1：创建PowerShell版本的脚本（推荐）**
```powershell
# run-app.ps1 - PowerShell版本的构建脚本

function Show-Progress {
    param(
        [int]$Percent,
        [string]$Message
    )
    
    $Filled = [Math]::Floor($Percent / 5)
    $Empty = 20 - $Filled
    $Bar = ("=" * $Filled) + ("-" * $Empty)
    
    Write-Host ""
    Write-Host "  [$Bar] $Percent%" -ForegroundColor Cyan
    Write-Host "  $Message" -ForegroundColor Yellow
    Write-Host ""
}

# 设置环境变量
$env:JAVA_HOME = "D:\Program Files\Java\jdk-17"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
$env:ANDROID_HOME = "C:\Users\yannis\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME

# 构建步骤...
```

**方案2：使用CMD运行批处理文件**
```powershell
# 在PowerShell中调用CMD运行批处理文件
cmd /c run-app.bat
```

**方案3：直接在CMD中运行**
```bash
# 打开CMD终端，然后运行
run-app.bat
```

**经验教训：**
1. **PowerShell脚本比批处理文件更强大** - 支持更好的错误处理和进度显示
2. **使用ASCII字符创建进度条** - 避免编码问题
3. **为不同shell创建不同版本的脚本** - 提高兼容性
4. **记录脚本语法差异** - 方便后续开发

---

### 问题12：React Native代码修改后需要重新构建APK

**问题描述：**
- 修改了React Native代码后，APP中没有看到修改效果
- 弹窗仍然只显示3种舞台风格，而不是7种
- 热重载没有生效

**根本原因：**
1. **React Native代码打包在APK中**
   - 生产模式下，JavaScript代码被打包到APK中
   - 修改代码后需要重新打包和构建
   
2. **热重载只在开发模式下有效**
   - 开发模式下，APP连接到Metro Bundler
   - Metro Bundler可以实时推送代码更新
   - 但需要APP处于开发模式且连接到开发服务器

3. **APP使用的是旧的打包代码**
   - 没有连接到Metro Bundler
   - 使用的是APK中打包的旧代码

**解决方案：**

**方案1：重新构建APK（推荐）**
```powershell
# 清除缓存
Remove-Item -Recurse -Force "android\.gradle" -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force "android\app\build" -ErrorAction SilentlyContinue

# 重新构建
.\run-app.ps1
```

**方案2：使用开发模式**
```bash
# 1. 启动Metro Bundler
npm start

# 2. 在模拟器中打开APP
adb shell am start -n com.legostory.demo/.MainActivity

# 3. 摇晃设备打开开发者菜单
adb shell input keyevent 82

# 4. 选择"Reload"重新加载
```

**方案3：使用热重载**
```bash
# 1. 确保Metro Bundler正在运行
npm start

# 2. 在开发者菜单中启用"Enable Fast Refresh"
# 3. 修改代码后会自动刷新
```

**经验教训：**
1. **React Native代码修改后必须重新构建APK**
2. **开发模式下可以使用热重载加速开发**
3. **生产模式使用打包的代码，不会实时更新**
4. **记录构建流程和常见问题** - 提高开发效率

---

## 构建成功案例

### 案例：舞台风格扩展功能构建

**构建时间：** 2026-03-05  
**构建耗时：** 11分20秒  
**构建状态：** ✅ 成功

**构建过程：**
1. ✅ 初始化 - 设置环境变量
2. ✅ 检查设备 - emulator-5554已连接
3. ✅ 创建资源目录 - assets目录已创建
4. ✅ 生成JS Bundle - Metro Bundler成功打包
5. ✅ 构建APK - Gradle成功编译（381个任务）
6. ✅ 安装APK - 成功安装到模拟器
7. ✅ 启动APP - APP已成功启动

**遇到的问题：**
1. Gradle缓存损坏 - 已解决（清除缓存）
2. PowerShell兼容性问题 - 已解决（创建PowerShell脚本）
3. 代码修改未生效 - 已解决（重新构建APK）

**关键经验：**
1. **清除缓存是解决构建问题的第一步**
2. **PowerShell脚本比批处理文件更可靠**
3. **进度条显示提高用户体验**
4. **记录构建过程方便问题排查**

**最终结果：**
- ✅ 7种舞台风格全部显示
- ✅ 新增4种风格正常工作
- ✅ APP运行稳定无崩溃

---

*最后更新：2026-03-05 14:30*
