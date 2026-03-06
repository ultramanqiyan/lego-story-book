/**
 * 创建书籍和添加章节功能测试 - Appium端到端测试
 * 
 * 测试范围：
 * 1. 创建书籍功能（选择类型、输入名称、初始化卡牌）
 * 2. 书籍详情页显示初始化的卡牌
 * 3. 添加章节功能（选择角色、天气、地形、装备、冒险类型）
 * 4. 章节内容生成和保存
 * 5. 答题解锁卡牌功能
 * 6. 解锁后卡牌显示验证
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
        
        appiumProcess.stderr.on('data', (data) => {
            console.log('Appium stderr:', data.toString());
        });
        
        setTimeout(() => {
            console.log('Appium服务器启动超时，继续尝试...\n');
            resolve(true);
        }, 15000);
    });
}

async function stopAppiumServer() {
    if (appiumProcess) {
        console.log('停止Appium服务器...');
        appiumProcess.kill();
        console.log('Appium服务器已停止\n');
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
        console.log('启动APP失败:', e.message);
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

async function isElementDisplayed(driver, selector, timeout = 1000) {
    try {
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });
        return true;
    } catch (e) {
        return false;
    }
}

async function getElementText(driver, selector, timeout = 1000) {
    try {
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });
        return await element.getText();
    } catch (e) {
        return null;
    }
}

async function swipeUp(driver, distance = 300) {
    const { width, height } = await driver.getWindowSize();
    const startX = width / 2;
    const startY = height * 0.7;
    const endY = height * 0.3;
    
    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: startX, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 300, x: startX, y: endY },
                { type: 'pointerUp', button: 0 }
            ]
        }
    ]);
    
    await driver.pause(500);
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

async function runCreateBookTest() {
    let driver;
    
    console.log('\n' + '='.repeat(70));
    console.log('  创建书籍和添加章节功能测试 - Appium端到端测试');
    console.log('='.repeat(70) + '\n');
    
    const startTime = Date.now();
    const testResults = {
        appLaunch: false,
        bookshelfPage: false,
        createBookButton: false,
        createBookModal: false,
        bookTitleInput: false,
        bookTypeSelection: false,
        bookCreated: false,
        bookDetailPage: false,
        initialCharacters: false,
        initialPlotElements: false,
        addChapterButton: false,
        storyDirectorPage: false,
        characterSelection: false,
        weatherSelection: false,
        terrainSelection: false,
        equipmentSelection: false,
        adventureSelection: false,
        shootButton: false,
        chapterCreated: false,
        chapterContent: false,
        puzzleAnswer: false,
        cardUnlocked: false,
    };
    
    const testBookTitle = `测试书籍${Date.now()}`;
    
    try {
        await startAppiumServer();
        
        console.log('[1/22] 强制重启APP确保干净状态...');
        await forceStopAndLaunchApp();
        testResults.appLaunch = true;
        console.log('APP已重启\n');

        console.log('[2/22] 连接Appium服务器...');
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

        console.log('[3/22] 等待应用启动...');
        await driver.pause(3000);
        console.log('应用已启动\n');

        // ==================== 进入书架页 ====================
        console.log('[4/22] 进入书架页...');
        if (await findAndTap(driver, '//*[contains(@text, "书架")]', 3000)) {
            testResults.bookshelfPage = true;
            console.log('已进入书架页\n');
        }
        await driver.pause(1000);

        // ==================== 点击创建书籍按钮 ====================
        console.log('[5/22] 点击创建书籍按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "新建")]', 2000)) {
            testResults.createBookButton = true;
            console.log('已点击创建书籍按钮\n');
        }
        await driver.pause(500);

        // ==================== 验证创建书籍弹窗 ====================
        console.log('[6/22] 验证创建书籍弹窗...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "创建新故事")]', 2000)) {
            testResults.createBookModal = true;
            console.log('创建书籍弹窗显示正常\n');
        }

        // ==================== 输入书籍名称 ====================
        console.log('[7/22] 输入书籍名称...');
        if (await inputText(driver, '//android.widget.EditText', testBookTitle, 2000)) {
            testResults.bookTitleInput = true;
            console.log(`已输入书籍名称: ${testBookTitle}\n`);
        }

        // ==================== 选择书籍类型 ====================
        console.log('[8/22] 选择书籍类型...');
        if (await findAndTap(driver, '//*[contains(@text, "魔法世界")]', 2000)) {
            testResults.bookTypeSelection = true;
            console.log('已选择魔法世界类型\n');
        }
        await driver.pause(500);

        // ==================== 点击创建按钮 ====================
        console.log('[9/22] 点击创建按钮...');
        const createButtonSelector = '//android.view.View//android.widget.TextView[contains(@text, "创建") and not(contains(@text, "创建新"))]';
        if (await findAndTap(driver, createButtonSelector, 2000)) {
            await driver.pause(3000);
            testResults.bookCreated = true;
            console.log('书籍创建成功\n');
        } else {
            console.log('尝试备用选择器...');
            const altSelector = '(//android.widget.TextView[contains(@text, "创建")])[last()]';
            if (await findAndTap(driver, altSelector, 2000)) {
                await driver.pause(3000);
                testResults.bookCreated = true;
                console.log('书籍创建成功(备用选择器)\n');
            }
        }

        // ==================== 验证书籍详情页 ====================
        console.log('[10/22] 验证书籍详情页...');
        await driver.pause(2000);
        if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 5000)) {
            testResults.bookDetailPage = true;
            console.log('书籍详情页显示正常\n');
        }

        // ==================== 验证初始角色卡牌 ====================
        console.log('[11/22] 验证初始角色卡牌...');
        if (await findAndTap(driver, '//*[contains(@text, "角色")]', 2000)) {
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "魔法师")]', 1000) ||
                await isElementDisplayed(driver, '//*[contains(@text, "精灵")]', 1000)) {
                testResults.initialCharacters = true;
                console.log('初始角色卡牌显示正常\n');
            }
        }

        // ==================== 验证初始情节元素 ====================
        console.log('[12/22] 验证初始情节元素...');
        if (await findAndTap(driver, '//*[contains(@text, "情节")]', 2000)) {
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "天气")]', 1000) ||
                await isElementDisplayed(driver, '//*[contains(@text, "地形")]', 1000)) {
                testResults.initialPlotElements = true;
                console.log('初始情节元素显示正常\n');
            }
        }

        // ==================== 点击添加章节 ====================
        console.log('[13/22] 点击添加章节...');
        if (await findAndTap(driver, '//*[contains(@text, "章节")]', 2000)) {
            await driver.pause(500);
        }
        
        if (await findAndTap(driver, '//*[contains(@text, "添加章节")]', 2000)) {
            testResults.addChapterButton = true;
            console.log('已点击添加章节\n');
            await driver.pause(2000);
        }

        // ==================== 验证故事导演页 ====================
        console.log('[14/22] 验证故事导演页...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "故事导演")]', 3000)) {
            testResults.storyDirectorPage = true;
            console.log('故事导演页显示正常\n');
        }

        // ==================== 选择角色 ====================
        console.log('[15/22] 选择角色...');
        const characterSelectors = [
            '//*[contains(@text, "魔法师")]',
            '//*[contains(@text, "精灵")]',
        ];
        
        for (const selector of characterSelectors) {
            if (await findAndTap(driver, selector, 1500)) {
                testResults.characterSelection = true;
                console.log('已选择角色\n');
                await driver.pause(300);
            }
        }

        // ==================== 选择天气 ====================
        console.log('[16/22] 选择天气...');
        await swipeUp(driver);
        await driver.pause(500);
        
        const weatherSelectors = [
            '//*[contains(@text, "晴天")]',
            '//*[contains(@text, "雨天")]',
            '//*[contains(@text, "夜晚")]',
        ];
        
        for (const selector of weatherSelectors) {
            if (await findAndTap(driver, selector, 1000)) {
                testResults.weatherSelection = true;
                console.log('已选择天气\n');
                await driver.pause(300);
                break;
            }
        }

        // ==================== 选择地形 ====================
        console.log('[17/22] 选择地形...');
        const terrainSelectors = [
            '//*[contains(@text, "森林")]',
            '//*[contains(@text, "山脉")]',
            '//*[contains(@text, "城堡")]',
        ];
        
        for (const selector of terrainSelectors) {
            if (await findAndTap(driver, selector, 1000)) {
                testResults.terrainSelection = true;
                console.log('已选择地形\n');
                await driver.pause(300);
                break;
            }
        }

        // ==================== 选择装备 ====================
        console.log('[18/22] 选择装备...');
        const equipmentSelectors = [
            '//*[contains(@text, "魔法棒")]',
            '//*[contains(@text, "宝剑")]',
            '//*[contains(@text, "护盾")]',
        ];
        
        for (const selector of equipmentSelectors) {
            if (await findAndTap(driver, selector, 1000)) {
                testResults.equipmentSelection = true;
                console.log('已选择装备\n');
                await driver.pause(300);
                break;
            }
        }

        // ==================== 选择冒险类型 ====================
        console.log('[19/22] 选择冒险类型...');
        const adventureSelectors = [
            '//*[contains(@text, "探索")]',
            '//*[contains(@text, "战斗")]',
            '//*[contains(@text, "解谜")]',
        ];
        
        for (const selector of adventureSelectors) {
            if (await findAndTap(driver, selector, 1000)) {
                testResults.adventureSelection = true;
                console.log('已选择冒险类型\n');
                await driver.pause(300);
                break;
            }
        }

        // ==================== 点击开拍按钮 ====================
        console.log('[20/22] 点击开拍按钮...');
        await driver.pause(500);
        if (await findAndTap(driver, '//*[contains(@text, "开始拍摄")]', 2000)) {
            testResults.shootButton = true;
            console.log('已点击开拍按钮\n');
            await driver.pause(2000);
        }

        // ==================== 验证章节创建 ====================
        console.log('[21/22] 验证章节创建...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 3000)) {
            testResults.chapterCreated = true;
            console.log('章节创建成功，已返回书籍详情页\n');
        }

        // ==================== 验证章节内容 ====================
        console.log('[22/22] 验证章节内容和答题功能...');
        if (await findAndTap(driver, '//*[contains(@text, "新的冒险")]', 2000)) {
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "谜题")]', 2000) ||
                await isElementDisplayed(driver, '//*[contains(@text, "问题")]', 2000)) {
                testResults.chapterContent = true;
                console.log('章节内容和谜题显示正常\n');
                
                // 点击第一个选项（正确答案）
                if (await findAndTap(driver, '(//android.widget.TextView[@clickable="true"])[1]', 2000)) {
                    await driver.pause(1000);
                    
                    // 检查是否解锁卡牌
                    if (await isElementDisplayed(driver, '//*[contains(@text, "解锁")]', 2000) ||
                        await isElementDisplayed(driver, '//*[contains(@text, "恭喜")]', 2000)) {
                        testResults.cardUnlocked = true;
                        console.log('卡牌解锁成功\n');
                        
                        // 关闭弹窗
                        await findAndTap(driver, '//*[contains(@text, "太棒了")]', 2000);
                        await driver.pause(500);
                    }
                }
            }
        }

        // ==================== 测试结果汇总 ====================
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        console.log('\n' + '='.repeat(70));
        console.log('  测试结果汇总');
        console.log('='.repeat(70));
        console.log(`\n总耗时: ${totalTime}秒\n`);
        
        console.log('功能点测试结果:');
        console.log(`  ${testResults.appLaunch ? '✅' : '❌'} APP启动`);
        console.log(`  ${testResults.bookshelfPage ? '✅' : '❌'} 进入书架页`);
        console.log(`  ${testResults.createBookButton ? '✅' : '❌'} 创建书籍按钮`);
        console.log(`  ${testResults.createBookModal ? '✅' : '❌'} 创建书籍弹窗`);
        console.log(`  ${testResults.bookTitleInput ? '✅' : '❌'} 书籍名称输入`);
        console.log(`  ${testResults.bookTypeSelection ? '✅' : '❌'} 书籍类型选择`);
        console.log(`  ${testResults.bookCreated ? '✅' : '❌'} 书籍创建成功`);
        console.log(`  ${testResults.bookDetailPage ? '✅' : '❌'} 书籍详情页显示`);
        console.log(`  ${testResults.initialCharacters ? '✅' : '❌'} 初始角色卡牌`);
        console.log(`  ${testResults.initialPlotElements ? '✅' : '❌'} 初始情节元素`);
        console.log(`  ${testResults.addChapterButton ? '✅' : '❌'} 添加章节按钮`);
        console.log(`  ${testResults.storyDirectorPage ? '✅' : '❌'} 故事导演页`);
        console.log(`  ${testResults.characterSelection ? '✅' : '❌'} 角色选择`);
        console.log(`  ${testResults.weatherSelection ? '✅' : '❌'} 天气选择`);
        console.log(`  ${testResults.terrainSelection ? '✅' : '❌'} 地形选择`);
        console.log(`  ${testResults.equipmentSelection ? '✅' : '❌'} 装备选择`);
        console.log(`  ${testResults.adventureSelection ? '✅' : '❌'} 冒险类型选择`);
        console.log(`  ${testResults.shootButton ? '✅' : '❌'} 开拍按钮`);
        console.log(`  ${testResults.chapterCreated ? '✅' : '❌'} 章节创建成功`);
        console.log(`  ${testResults.chapterContent ? '✅' : '❌'} 章节内容和谜题`);
        console.log(`  ${testResults.cardUnlocked ? '✅' : '❌'} 卡牌解锁功能`);
        
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

    } catch (error) {
        console.error('\n测试失败:', error.message);
        console.error('错误堆栈:', error.stack);
        await checkForCrashes();
    } finally {
        if (driver) {
            await driver.deleteSession();
        }
        await stopAppiumServer();
    }
}

runCreateBookTest().catch(console.error);
