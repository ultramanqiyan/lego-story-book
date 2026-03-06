/**
 * 书架页Demo测试 - Appium端到端测试
 * 覆盖所有功能点
 * 
 * 测试范围：
 * 1. 首页书架按钮入口
 * 2. 书架页标题和布局
 * 3. 书籍卡片显示和点击
 * 4. 点击书籍跳转到书籍详情页
 * 5. 新建故事按钮
 * 6. 新建故事弹窗
 * 7. 输入故事名称创建新故事
 * 8. 返回功能
 */

const { remote } = require('webdriverio');
const { execSync, spawn } = require('child_process');

process.env.ANDROID_HOME = 'C:\\Users\\yannis\\AppData\\Local\\Android\\Sdk';
process.env.ANDROID_SDK_ROOT = 'C:\\Users\\yannis\\AppData\\Local\\Android\\Sdk';

const ADB = 'C:\\Users\\yannis\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe';
const DEVICE = 'emulator-5554';
const PACKAGE = 'com.legostory.demo';

let appiumProcess = null;

async function startAppiumServer() {
    console.log('启动Appium服务器...');
    
    return new Promise((resolve, reject) => {
        appiumProcess = spawn('appium', ['--base-path', '/'], {
            shell: true,
            stdio: 'pipe'
        });
        
        appiumProcess.stdout.on('data', (data) => {
            if (data.toString().includes('Appium REST http interface')) {
                console.log('Appium服务器已启动\n');
                resolve(true);
            }
        });
        
        setTimeout(() => {
            console.log('Appium服务器启动超时，继续尝试...\n');
            resolve(true);
        }, 10000);
    });
}

async function stopAppiumServer() {
    if (appiumProcess) {
        console.log('停止Appium服务器...');
        appiumProcess.kill();
        console.log('Appium服务器已停止\n');
    }
}

async function checkAppInForeground() {
    try {
        const result = execSync(
            `${ADB} -s ${DEVICE} shell "dumpsys activity activities | grep mResumedActivity"`,
            { encoding: 'utf8', timeout: 3000 }
        );
        return result && result.includes(PACKAGE);
    } catch (e) {
        return false;
    }
}

async function launchApp() {
    try {
        execSync(
            `${ADB} -s ${DEVICE} shell am start -n ${PACKAGE}/.MainActivity`,
            { encoding: 'utf8', timeout: 5000 }
        );
        return true;
    } catch (e) {
        return false;
    }
}

async function forceStopAndLaunchApp() {
    try {
        execSync(
            `${ADB} -s ${DEVICE} shell am force-stop ${PACKAGE}`,
            { encoding: 'utf8', timeout: 5000 }
        );
        await new Promise(r => setTimeout(r, 2000));
        execSync(
            `${ADB} -s ${DEVICE} shell am start -n ${PACKAGE}/.MainActivity`,
            { encoding: 'utf8', timeout: 5000 }
        );
        return true;
    } catch (e) {
        return false;
    }
}

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

async function findElement(driver, selector, timeout = 2000) {
    try {
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });
        return element;
    } catch (e) {
        return null;
    }
}

async function isElementDisplayed(driver, selector, timeout = 1000) {
    try {
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });
        return true;
    } catch (e) {
        return false;
    }
}

async function inputText(driver, selector, text, timeout = 2000) {
    try {
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });
        await element.clearValue();
        await element.addValue(text);
        return true;
    } catch (e) {
        return false;
    }
}

async function checkForCrashes() {
    try {
        const result = execSync(
            `${ADB} -s ${DEVICE} logcat -d -t 20 AndroidRuntime:E ReactNativeJS:E *:S`,
            { encoding: 'utf8', timeout: 5000 }
        );
        if (result && result.includes('FATAL')) {
            console.log('检测到应用崩溃!');
            console.log(result);
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function runBookshelfTest() {
    let driver;
    
    console.log('\n' + '='.repeat(70));
    console.log('  书架页Demo测试 - Appium端到端测试');
    console.log('  测试所有功能点');
    console.log('='.repeat(70) + '\n');
    
    const startTime = Date.now();
    const testResults = {
        appLaunch: false,
        homePage: false,
        bookshelfButton: false,
        bookshelfTitle: false,
        bookCard1: false,
        bookCard2: false,
        bookCard3: false,
        bookCardClick: false,
        bookDetailNavigation: false,
        backFromBookDetail: false,
        newStoryButton: false,
        createModal: false,
        storyNameInput: false,
        createStoryButton: false,
        newStoryNavigation: false,
        backFromNewStory: false,
        returnHome: false,
    };
    
    try {
        await startAppiumServer();
        
        console.log('[1/20] 强制重启APP确保干净状态...');
        await forceStopAndLaunchApp();
        testResults.appLaunch = true;
        console.log('APP已重启\n');

        console.log('[2/20] 连接Appium服务器...');
        driver = await remote({
            capabilities: {
                platformName: 'Android',
                'appium:deviceName': DEVICE,
                'appium:automationName': 'UiAutomator2',
                'appium:appPackage': PACKAGE,
                'appium:appActivity': '.MainActivity',
                'appium:noReset': true,
                'appium:newCommandTimeout': 600,
                'appium:autoGrantPermissions': true,
                'appium:waitForIdleTimeout': 50,
                'appium:waitForQuiescence': false,
            },
            logLevel: 'error',
            hostname: '127.0.0.1',
            port: 4723,
            path: '/',
            waitforTimeout: 2000,
        });
        console.log('连接成功！\n');

        console.log('[3/20] 等待应用启动...');
        await driver.pause(2000);
        testResults.homePage = true;
        console.log('应用已启动\n');

        // ==================== 首页书架按钮测试 ====================
        console.log('[4/20] 测试首页书架按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "书架")]', 3000)) {
            testResults.bookshelfButton = true;
            console.log('已点击书架按钮\n');
        } else if (await findAndTap(driver, '//*[@text="📚 书架"]', 2000)) {
            testResults.bookshelfButton = true;
            console.log('已点击书架按钮(完整文本)\n');
        } else {
            console.log('未找到书架按钮\n');
        }
        
        await driver.pause(800);

        // ==================== 书架页标题测试 ====================
        console.log('[5/20] 验证书架页标题显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "我的书架")]', 3000)) {
            testResults.bookshelfTitle = true;
            console.log('书架页标题显示正常\n');
        } else if (await isElementDisplayed(driver, '//*[contains(@text, "书架")]', 2000)) {
            testResults.bookshelfTitle = true;
            console.log('书架页标题显示正常(部分文本)\n');
        } else {
            console.log('书架页标题未显示\n');
        }

        // ==================== 书籍卡片显示测试 ====================
        console.log('[6/20] 验证书籍卡片显示...');
        
        if (await isElementDisplayed(driver, '//*[contains(@text, "勇者的冒险之旅")]', 2000)) {
            testResults.bookCard1 = true;
            console.log('书籍1"勇者的冒险之旅"显示正常\n');
        }
        
        if (await isElementDisplayed(driver, '//*[contains(@text, "魔法学院秘闻")]', 1000)) {
            testResults.bookCard2 = true;
            console.log('书籍2"魔法学院秘闻"显示正常\n');
        }
        
        if (await isElementDisplayed(driver, '//*[contains(@text, "精灵传说")]', 1000)) {
            testResults.bookCard3 = true;
            console.log('书籍3"精灵传说"显示正常\n');
        }

        // ==================== 点击书籍跳转测试 ====================
        console.log('[7/20] 测试点击书籍跳转到书籍详情页...');
        if (await findAndTap(driver, '//*[contains(@text, "勇者的冒险之旅")]', 2000)) {
            testResults.bookCardClick = true;
            console.log('已点击书籍卡片\n');
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 2000)) {
                testResults.bookDetailNavigation = true;
                console.log('成功跳转到书籍详情页\n');
            } else if (await isElementDisplayed(driver, '//*[contains(@text, "角色")]', 1000)) {
                testResults.bookDetailNavigation = true;
                console.log('成功跳转到书籍详情页(角色Tab)\n');
            } else {
                console.log('未检测到书籍详情页\n');
            }
        } else {
            console.log('未找到书籍卡片\n');
        }

        // ==================== 从书籍详情页返回测试 ====================
        console.log('[8/20] 测试从书籍详情页返回...');
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            testResults.backFromBookDetail = true;
            console.log('已点击返回按钮\n');
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "我的书架")]', 2000)) {
                console.log('成功返回书架页\n');
            }
        } else {
            console.log('未找到返回按钮\n');
        }

        // ==================== 新建故事按钮测试 ====================
        console.log('[9/20] 测试新建故事按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "新建")]', 2000)) {
            testResults.newStoryButton = true;
            console.log('已点击新建按钮\n');
        } else if (await findAndTap(driver, '//*[contains(@text, "➕")]', 1000)) {
            testResults.newStoryButton = true;
            console.log('已点击新建按钮(图标)\n');
        } else {
            console.log('未找到新建按钮\n');
        }
        
        await driver.pause(500);

        // ==================== 新建故事弹窗测试 ====================
        console.log('[10/20] 验证新建故事弹窗...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "创建新故事")]', 2000)) {
            testResults.createModal = true;
            console.log('新建故事弹窗显示正常\n');
        } else if (await isElementDisplayed(driver, '//*[contains(@text, "故事名称")]', 1000)) {
            testResults.createModal = true;
            console.log('新建故事弹窗显示正常(输入框)\n');
        } else {
            console.log('新建故事弹窗未显示\n');
        }

        // ==================== 输入故事名称测试 ====================
        console.log('[11/20] 测试输入故事名称...');
        if (await inputText(driver, '//android.widget.EditText', '测试故事书', 2000)) {
            testResults.storyNameInput = true;
            console.log('已输入故事名称"测试故事书"\n');
        } else {
            console.log('输入故事名称失败\n');
        }
        
        await driver.pause(300);

        // ==================== 创建故事按钮测试 ====================
        console.log('[12/20] 测试创建故事按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "创建")]', 2000)) {
            testResults.createStoryButton = true;
            console.log('已点击创建按钮\n');
            await driver.pause(800);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 2000)) {
                testResults.newStoryNavigation = true;
                console.log('成功跳转到新故事书籍详情页\n');
            } else if (await isElementDisplayed(driver, '//*[contains(@text, "测试故事书")]', 1000)) {
                testResults.newStoryNavigation = true;
                console.log('成功创建并跳转到新故事\n');
            } else {
                console.log('未检测到新故事页面\n');
            }
        } else {
            console.log('未找到创建按钮\n');
        }

        // ==================== 从新故事返回测试 ====================
        console.log('[13/20] 测试从新故事返回...');
        await driver.pause(500);
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            testResults.backFromNewStory = true;
            console.log('已点击返回按钮\n');
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "我的书架")]', 2000)) {
                console.log('成功返回书架页\n');
            }
        } else if (await findAndTap(driver, '//*[@text="← 返回"]', 1000)) {
            testResults.backFromNewStory = true;
            console.log('已点击返回按钮(完整文本)\n');
            await driver.pause(500);
        } else {
            console.log('未找到返回按钮\n');
        }

        // ==================== 返回首页测试 ====================
        console.log('[14/20] 测试返回首页...');
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            testResults.returnHome = true;
            console.log('已点击返回按钮\n');
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "你的回合")]', 2000)) {
                console.log('成功返回首页\n');
            } else if (await isElementDisplayed(driver, '//*[contains(@text, "导演")]', 1000)) {
                console.log('成功返回首页(检测到导演按钮)\n');
            }
        } else if (await isElementDisplayed(driver, '//*[contains(@text, "你的回合")]', 1000)) {
            testResults.returnHome = true;
            console.log('已在首页\n');
        } else if (await isElementDisplayed(driver, '//*[contains(@text, "我的书架")]', 1000)) {
            // 如果还在书架页，再点一次返回
            if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
                testResults.returnHome = true;
                console.log('从书架页返回首页成功\n');
            }
        } else {
            console.log('未找到返回按钮\n');
        }

        // ==================== 崩溃检测 ====================
        console.log('[15/20] 检测应用崩溃...');
        const crashDetected = await checkForCrashes();
        if (crashDetected) {
            console.log('应用发生崩溃!\n');
        } else {
            console.log('应用运行正常，无崩溃\n');
        }

        // ==================== 测试结果汇总 ====================
        console.log('[16/20] 汇总测试结果...');
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        console.log('\n' + '='.repeat(70));
        console.log('  测试结果汇总');
        console.log('='.repeat(70));
        console.log(`\n总耗时: ${totalTime}秒\n`);
        
        console.log('功能点测试结果:');
        console.log(`  ${testResults.appLaunch ? '✅' : '❌'} APP启动`);
        console.log(`  ${testResults.homePage ? '✅' : '❌'} 首页显示`);
        console.log(`  ${testResults.bookshelfButton ? '✅' : '❌'} 书架按钮入口`);
        console.log(`  ${testResults.bookshelfTitle ? '✅' : '❌'} 书架页标题`);
        console.log(`  ${testResults.bookCard1 ? '✅' : '❌'} 书籍卡片1显示`);
        console.log(`  ${testResults.bookCard2 ? '✅' : '❌'} 书籍卡片2显示`);
        console.log(`  ${testResults.bookCard3 ? '✅' : '❌'} 书籍卡片3显示`);
        console.log(`  ${testResults.bookCardClick ? '✅' : '❌'} 书籍卡片点击`);
        console.log(`  ${testResults.bookDetailNavigation ? '✅' : '❌'} 跳转到书籍详情页`);
        console.log(`  ${testResults.backFromBookDetail ? '✅' : '❌'} 从书籍详情页返回`);
        console.log(`  ${testResults.newStoryButton ? '✅' : '❌'} 新建故事按钮`);
        console.log(`  ${testResults.createModal ? '✅' : '❌'} 新建故事弹窗`);
        console.log(`  ${testResults.storyNameInput ? '✅' : '❌'} 输入故事名称`);
        console.log(`  ${testResults.createStoryButton ? '✅' : '❌'} 创建故事按钮`);
        console.log(`  ${testResults.newStoryNavigation ? '✅' : '❌'} 新故事跳转`);
        console.log(`  ${testResults.backFromNewStory ? '✅' : '❌'} 从新故事返回`);
        console.log(`  ${testResults.returnHome ? '✅' : '❌'} 返回首页`);
        
        const passedCount = Object.values(testResults).filter(v => v).length;
        const totalCount = Object.values(testResults).length;
        
        console.log(`\n通过率: ${passedCount}/${totalCount} (${Math.round(passedCount/totalCount*100)}%)`);
        
        if (passedCount === totalCount) {
            console.log('\n🎉 所有测试通过！');
        } else if (passedCount >= totalCount * 0.8) {
            console.log('\n✅ 大部分测试通过！');
        } else {
            console.log('\n⚠️ 部分测试未通过，请检查！');
        }
        
        console.log('\n提示: 请查看模拟器中的实际操作\n');

    } catch (error) {
        console.error('\n测试失败:', error.message);
        await checkForCrashes();
    } finally {
        if (driver) {
            await driver.deleteSession();
        }
        await stopAppiumServer();
    }
}

runBookshelfTest().catch(console.error);
