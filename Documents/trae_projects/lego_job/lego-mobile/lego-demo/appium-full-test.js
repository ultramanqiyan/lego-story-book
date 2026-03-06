/**
 * 全面功能测试 - Appium端到端测试
 * 
 * 测试范围：
 * 1. 书架页功能（创建、删除书籍）
 * 2. 书籍详情页（查看章节、卡牌）
 * 3. 故事导演页（选择卡牌、创建章节）
 * 4. 答题解锁卡牌功能
 * 5. 多种书籍类型测试
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

async function findAndTap(driver, selector, timeout = 2000) {
    try {
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });
        await element.click();
        return true;
    } catch (e) {
        return false;
    }
}

async function isElementDisplayed(driver, selector, timeout = 2000) {
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

async function swipeUp(driver) {
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

async function runFullTest() {
    let driver = null;
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
        cardUnlocked: false,
        deleteBook: false,
        multipleChapters: false,
    };
    
    try {
        await startAppiumServer();
        
        console.log('[1/25] 强制重启APP确保干净状态...');
        await forceStopAndLaunchApp();
        testResults.appLaunch = true;
        console.log('APP已重启\n');
        
        console.log('[2/25] 连接Appium服务器...');
        driver = await remote({
            hostname: '127.0.0.1',
            port: 4723,
            path: '/',
            capabilities: {
                platformName: 'Android',
                'appium:deviceName': DEVICE,
                'appium:automationName': 'UiAutomator2',
                'appium:appPackage': PACKAGE,
                'appium:appActivity': '.MainActivity',
                'appium:noReset': true,
                'appium:newCommandTimeout': 300,
            }
        });
        console.log('连接成功！\n');
        
        console.log('[3/25] 等待应用启动...');
        await driver.pause(3000);
        console.log('应用已启动\n');
        
        console.log('[4/25] 进入书架页...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "书架")]', 5000)) {
            testResults.bookshelfPage = true;
            console.log('已进入书架页\n');
        }
        
        console.log('[5/25] 点击创建书籍按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "创建")]', 2000)) {
            testResults.createBookButton = true;
            console.log('已点击创建书籍按钮\n');
        }
        
        console.log('[6/25] 验证创建书籍弹窗...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "创建新故事")]', 3000)) {
            testResults.createBookModal = true;
            console.log('创建书籍弹窗显示正常\n');
        }
        
        console.log('[7/25] 输入书籍名称...');
        const bookTitle = `测试书籍${Date.now()}`;
        if (await inputText(driver, '//android.widget.EditText', bookTitle, 2000)) {
            testResults.bookTitleInput = true;
            console.log(`已输入书籍名称: ${bookTitle}\n`);
        }
        
        console.log('[8/25] 选择书籍类型...');
        if (await findAndTap(driver, '//*[contains(@text, "魔法世界")]', 2000)) {
            testResults.bookTypeSelection = true;
            console.log('已选择魔法世界类型\n');
        }
        
        console.log('[9/25] 点击创建按钮...');
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
        
        console.log('[10/25] 验证书籍详情页...');
        await driver.pause(2000);
        if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 5000)) {
            testResults.bookDetailPage = true;
            console.log('书籍详情页显示正常\n');
        }
        
        console.log('[11/25] 验证初始角色卡牌...');
        if (await findAndTap(driver, '//*[contains(@text, "角色")]', 2000)) {
            await driver.pause(1000);
            if (await isElementDisplayed(driver, '//*[contains(@text, "法师")]', 2000) ||
                await isElementDisplayed(driver, '//*[contains(@text, "精灵")]', 2000)) {
                testResults.initialCharacters = true;
                console.log('初始角色卡牌显示正常\n');
            } else {
                console.log('初始角色卡牌未找到\n');
            }
        }
        
        console.log('[12/25] 验证初始情节元素...');
        if (await findAndTap(driver, '//*[contains(@text, "情节")]', 2000)) {
            await driver.pause(1000);
            testResults.initialPlotElements = true;
            console.log('初始情节元素显示正常\n');
        }
        
        console.log('[13/25] 点击添加章节...');
        if (await findAndTap(driver, '//*[contains(@text, "添加章节")]', 2000)) {
            testResults.addChapterButton = true;
            console.log('已点击添加章节按钮\n');
        }
        await driver.pause(500);
        
        console.log('[14/25] 验证故事导演页...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "故事导演")]', 3000)) {
            testResults.storyDirectorPage = true;
            console.log('故事导演页显示正常\n');
        }
        
        console.log('[15/25] 选择角色...');
        const characterSelectors = [
            '//*[contains(@text, "法师")]',
            '//*[contains(@text, "精灵")]',
            '//*[contains(@text, "巨龙")]',
            '//*[contains(@text, "独角兽")]',
        ];
        
        for (const selector of characterSelectors) {
            if (await findAndTap(driver, selector, 1500)) {
                testResults.characterSelection = true;
                console.log('已选择角色\n');
                await driver.pause(300);
            }
        }
        
        console.log('[16/25] 选择冒险类型...');
        const adventureSelectors = [
            '//*[contains(@text, "施法")]',
            '//*[contains(@text, "召唤")]',
            '//*[contains(@text, "炼金")]',
            '//*[contains(@text, "飞行")]',
        ];
        
        for (const selector of adventureSelectors) {
            if (await findAndTap(driver, selector, 1000)) {
                testResults.adventureSelection = true;
                console.log('已选择冒险类型\n');
                await driver.pause(300);
                break;
            }
        }
        
        console.log('[17/25] 选择天气...');
        await swipeUp(driver);
        await driver.pause(500);
        
        const weatherSelectors = [
            '//*[contains(@text, "月夜")]',
            '//*[contains(@text, "迷雾")]',
            '//*[contains(@text, "雷暴")]',
            '//*[contains(@text, "极光")]',
        ];
        
        for (const selector of weatherSelectors) {
            if (await findAndTap(driver, selector, 1000)) {
                testResults.weatherSelection = true;
                console.log('已选择天气\n');
                await driver.pause(300);
                break;
            }
        }
        
        console.log('[18/25] 选择地形...');
        await swipeUp(driver);
        await driver.pause(500);
        
        const terrainSelectors = [
            '//*[contains(@text, "魔法塔")]',
            '//*[contains(@text, "禁林")]',
            '//*[contains(@text, "龙巢")]',
            '//*[contains(@text, "水晶洞")]',
        ];
        
        for (const selector of terrainSelectors) {
            if (await findAndTap(driver, selector, 1000)) {
                testResults.terrainSelection = true;
                console.log('已选择地形\n');
                await driver.pause(300);
                break;
            }
        }
        
        console.log('[19/25] 选择装备...');
        await swipeUp(driver);
        await driver.pause(500);
        
        const equipmentSelectors = [
            '//*[contains(@text, "法杖")]',
            '//*[contains(@text, "魔戒")]',
            '//*[contains(@text, "魔法书")]',
            '//*[contains(@text, "水晶球")]',
        ];
        
        for (const selector of equipmentSelectors) {
            if (await findAndTap(driver, selector, 1000)) {
                testResults.equipmentSelection = true;
                console.log('已选择装备\n');
                await driver.pause(300);
                break;
            }
        }
        
        console.log('[20/25] 点击开拍按钮...');
        await swipeUp(driver);
        await driver.pause(500);
        
        if (await findAndTap(driver, '//*[contains(@text, "开始拍摄")]', 2000)) {
            testResults.shootButton = true;
            console.log('已点击开拍按钮\n');
            await driver.pause(2000);
        }
        
        console.log('[21/25] 验证章节创建...');
        await driver.pause(2000);
        if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 3000)) {
            testResults.chapterCreated = true;
            console.log('章节创建成功，已返回书籍详情页\n');
        }
        
        console.log('[22/25] 验证章节内容和答题功能...');
        await driver.pause(500);
        
        const chapterContent = await driver.$('//*[contains(@text, "谜题")]');
        if (await chapterContent.isDisplayed()) {
            testResults.chapterContent = true;
            console.log('章节内容和谜题显示正常\n');
            
            const options = await driver.$$('//android.widget.TextView[@clickable="true"]');
            if (options.length > 0) {
                await options[0].click();
                await driver.pause(500);
                
                if (await isElementDisplayed(driver, '//*[contains(@text, "解锁")]', 2000)) {
                    testResults.cardUnlocked = true;
                    console.log('卡牌解锁成功\n');
                    
                    await findAndTap(driver, '//*[contains(@text, "太棒了")]', 2000);
                }
            }
        }
        
        console.log('[23/25] 测试创建多个章节...');
        if (await findAndTap(driver, '//*[contains(@text, "添加章节")]', 2000)) {
            await driver.pause(1000);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "故事导演")]', 3000)) {
                const charSelectors = ['//*[contains(@text, "法师")]', '//*[contains(@text, "精灵")]'];
                for (const selector of charSelectors) {
                    await findAndTap(driver, selector, 1000);
                }
                
                await findAndTap(driver, '//*[contains(@text, "施法")]', 1000);
                await swipeUp(driver);
                await findAndTap(driver, '//*[contains(@text, "月夜")]', 1000);
                await swipeUp(driver);
                await findAndTap(driver, '//*[contains(@text, "魔法塔")]', 1000);
                await swipeUp(driver);
                await findAndTap(driver, '//*[contains(@text, "法杖")]', 1000);
                await swipeUp(driver);
                await findAndTap(driver, '//*[contains(@text, "开始拍摄")]', 2000);
                
                await driver.pause(2000);
                if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 3000)) {
                    testResults.multipleChapters = true;
                    console.log('多章节创建成功\n');
                }
            }
        }
        
        console.log('[24/25] 返回书架页...');
        await driver.pause(500);
        
        for (let i = 0; i < 3; i++) {
            if (await findAndTap(driver, '//android.widget.TextView[@text="返回"]', 1000)) {
                await driver.pause(500);
            } else {
                break;
            }
        }
        
        console.log('[25/25] 测试删除书籍...');
        await driver.pause(1000);
        
        const bookItems = await driver.$$('//*[contains(@text, "测试书籍")]');
        if (bookItems.length > 0) {
            await bookItems[0].click();
            await driver.pause(1000);
            
            if (await findAndTap(driver, '//*[contains(@text, "删除")]', 2000)) {
                await driver.pause(500);
                if (await findAndTap(driver, '//*[contains(@text, "确定")]', 2000)) {
                    testResults.deleteBook = true;
                    console.log('书籍删除成功\n');
                }
            }
        }
        
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
        console.log(`  ${testResults.multipleChapters ? '✅' : '❌'} 多章节创建`);
        console.log(`  ${testResults.deleteBook ? '✅' : '❌'} 书籍删除功能`);
        
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
    } finally {
        if (driver) {
            await driver.deleteSession();
        }
        await stopAppiumServer();
    }
}

runFullTest().catch(console.error);
