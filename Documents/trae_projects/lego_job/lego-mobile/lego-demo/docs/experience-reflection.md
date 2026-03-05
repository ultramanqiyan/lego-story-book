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

### 问题排查流程
1. **先查看日志** - `adb logcat -d | findstr /i "ReactNativeJS\|Error\|FATAL"`
2. **检查崩溃** - 搜索 `FATAL` 或 `Exception`
3. **检查错误** - 搜索 "is not supported" 或 "Error:"
4. **定位代码** - 根据堆栈信息定位问题代码
5. **修复验证** - 修复后重新构建测试
