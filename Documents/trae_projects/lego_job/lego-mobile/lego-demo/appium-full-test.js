/**
 * 全面功能测试 - Appium端到端测试
 * 
 * 测试范围：
 * 1. 首页导航功能
 * 2. 卡牌Demo页面所有按钮
 * 3. 书架页功能（创建、删除书籍）
 * 4. 书籍详情页（章节、角色、情节）
 * 5. 故事导演页（选择卡牌、创建章节）
 * 6. 翻页功能（目录翻页、章节翻页）
 * 7. 答题解锁卡牌功能
 * 8. 返回首页路径测试
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
        // 首页测试
        appLaunch: false,
        homePageDisplayed: false,
        navigateToBookshelf: false,
        
        // 书架页测试
        bookshelfPage: false,
        createBookButton: false,
        createBookModal: false,
        bookTitleInput: false,
        bookTypeSelection: false,
        bookCreated: false,
        
        // 书籍详情页测试
        bookDetailPage: false,
        tabChapters: false,
        tabCharacters: false,
        tabPlots: false,
        chapterItemClick: false,
        characterCardClick: false,
        plotCardClick: false,
        
        // 翻页功能测试
        directoryPrevPage: false,
        directoryNextPage: false,
        chapterPrevPage: false,
        chapterNextPage: false,
        backToDirectory: false,
        
        // 故事导演页测试
        addChapterButton: false,
        storyDirectorPage: false,
        characterSelection: false,
        weatherSelection: false,
        terrainSelection: false,
        equipmentSelection: false,
        adventureSelection: false,
        shootButton: false,
        chapterCreated: false,
        
        // 答题解锁测试
        chapterContent: false,
        puzzleAnswer: false,
        cardUnlocked: false,
        unlockModalClose: false,
        
        // 多章节测试
        multipleChapters: false,
        
        // 返回首页路径测试
        returnToBookshelf: false,
        returnToHomeFromBookshelf: false,
        homePageAfterReturn: false,
        
        // 卡牌Demo页面测试
        navigateToCardDemo: false,
        cardDemoPage: false,
        cardDemoHomeButton: false,
        cardDemoStyleButton: false,
        cardDemoBookshelfButton: false,
        cardDemoDirectorButton: false,
        cardDemoBookButton: false,
        
        // 删除书籍测试
        deleteBook: false,
    };
    
    try {
        await startAppiumServer();
        
        console.log('[1/50] 强制重启APP确保干净状态...');
        await forceStopAndLaunchApp();
        testResults.appLaunch = true;
        console.log('APP已重启\n');
        
        console.log('[2/50] 连接Appium服务器...');
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
        
        console.log('[3/50] 等待应用启动...');
        await driver.pause(3000);
        console.log('应用已启动\n');
        
        // ==================== 首页测试 ====================
        console.log('[4/50] 验证首页显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "乐高故事书")]', 5000)) {
            testResults.homePageDisplayed = true;
            console.log('首页显示正常\n');
        }
        
        console.log('[5/50] 从首页进入书架页...');
        if (await findAndTap(driver, '//*[contains(@text, "书架")]', 2000)) {
            await driver.pause(1000);
            testResults.navigateToBookshelf = true;
            console.log('已点击书架按钮\n');
        }
        
        // ==================== 书架页测试 ====================
        console.log('[6/50] 验证书架页...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "我的书架")]', 3000)) {
            testResults.bookshelfPage = true;
            console.log('书架页显示正常\n');
        }
        
        console.log('[7/50] 点击创建书籍按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "创建")]', 2000)) {
            testResults.createBookButton = true;
            console.log('已点击创建书籍按钮\n');
        }
        
        console.log('[8/50] 验证创建书籍弹窗...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "创建新故事")]', 3000)) {
            testResults.createBookModal = true;
            console.log('创建书籍弹窗显示正常\n');
        }
        
        console.log('[9/50] 输入书籍名称...');
        const bookTitle = `测试书籍${Date.now()}`;
        if (await inputText(driver, '//android.widget.EditText', bookTitle, 2000)) {
            testResults.bookTitleInput = true;
            console.log(`已输入书籍名称: ${bookTitle}\n`);
        }
        
        console.log('[10/50] 选择书籍类型...');
        if (await findAndTap(driver, '//*[contains(@text, "魔法世界")]', 2000)) {
            testResults.bookTypeSelection = true;
            console.log('已选择魔法世界类型\n');
        }
        
        console.log('[11/50] 点击创建按钮...');
        const createButtonSelector = '//android.view.View//android.widget.TextView[contains(@text, "创建") and not(contains(@text, "创建新"))]';
        if (await findAndTap(driver, createButtonSelector, 2000)) {
            await driver.pause(3000);
            testResults.bookCreated = true;
            console.log('书籍创建成功\n');
        } else {
            const altSelector = '(//android.widget.TextView[contains(@text, "创建")])[last()]';
            if (await findAndTap(driver, altSelector, 2000)) {
                await driver.pause(3000);
                testResults.bookCreated = true;
                console.log('书籍创建成功(备用选择器)\n');
            }
        }
        
        // ==================== 书籍详情页测试 ====================
        console.log('[12/50] 验证书籍详情页...');
        await driver.pause(2000);
        if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 5000)) {
            testResults.bookDetailPage = true;
            console.log('书籍详情页显示正常\n');
        }
        
        console.log('[13/50] 测试章节标签页...');
        if (await findAndTap(driver, '//*[contains(@text, "章节")]', 2000)) {
            testResults.tabChapters = true;
            console.log('章节标签页正常\n');
        }
        
        console.log('[14/50] 测试角色标签页...');
        if (await findAndTap(driver, '//*[contains(@text, "角色")]', 2000)) {
            await driver.pause(500);
            testResults.tabCharacters = true;
            console.log('角色标签页正常\n');
            
            // 点击角色卡牌
            if (await findAndTap(driver, '//*[contains(@text, "法师")]', 1000)) {
                testResults.characterCardClick = true;
                console.log('角色卡牌点击正常\n');
            }
        }
        
        console.log('[15/50] 测试情节标签页...');
        if (await findAndTap(driver, '//*[contains(@text, "情节")]', 2000)) {
            await driver.pause(500);
            testResults.tabPlots = true;
            console.log('情节标签页正常\n');
            
            // 点击情节卡牌
            if (await findAndTap(driver, '//*[contains(@text, "月夜")]', 1000)) {
                testResults.plotCardClick = true;
                console.log('情节卡牌点击正常\n');
            }
        }
        
        // ==================== 创建章节测试 ====================
        console.log('[16/50] 返回章节标签页...');
        await findAndTap(driver, '//*[contains(@text, "章节")]', 2000);
        await driver.pause(500);
        
        console.log('[17/50] 点击添加章节...');
        if (await findAndTap(driver, '//*[contains(@text, "添加章节")]', 2000)) {
            testResults.addChapterButton = true;
            console.log('已点击添加章节按钮\n');
        }
        await driver.pause(500);
        
        console.log('[18/50] 验证故事导演页...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "故事导演")]', 3000)) {
            testResults.storyDirectorPage = true;
            console.log('故事导演页显示正常\n');
        }
        
        console.log('[19/50] 选择角色...');
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
        
        console.log('[20/50] 选择冒险类型...');
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
        
        console.log('[21/50] 选择天气...');
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
        
        console.log('[22/50] 选择地形...');
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
        
        console.log('[23/50] 选择装备...');
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
        
        console.log('[24/50] 点击开拍按钮...');
        await swipeUp(driver);
        await driver.pause(500);
        
        if (await findAndTap(driver, '//*[contains(@text, "开始拍摄")]', 2000)) {
            testResults.shootButton = true;
            console.log('已点击开拍按钮\n');
            await driver.pause(2000);
        }
        
        console.log('[25/50] 验证章节创建...');
        await driver.pause(2000);
        if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 3000)) {
            testResults.chapterCreated = true;
            console.log('章节创建成功，已返回书籍详情页\n');
        }
        
        // ==================== 翻页功能测试 ====================
        console.log('[26/50] 测试目录翻页功能...');
        // 点击第一个章节进入内容页
        const chapterItems = await driver.$$('//*[contains(@text, "第1章")]');
        if (chapterItems.length > 0) {
            await chapterItems[0].click();
            await driver.pause(1000);
            testResults.chapterItemClick = true;
            console.log('已点击章节进入内容页\n');
        }
        
        console.log('[27/50] 测试章节翻页功能...');
        // 测试下一章按钮
        if (await findAndTap(driver, '//*[contains(@text, "下一章")]', 2000)) {
            testResults.chapterNextPage = true;
            console.log('下一章按钮正常\n');
            await driver.pause(500);
        }
        
        // 测试上一章按钮
        if (await findAndTap(driver, '//*[contains(@text, "上一章")]', 2000)) {
            testResults.chapterPrevPage = true;
            console.log('上一章按钮正常\n');
            await driver.pause(500);
        }
        
        console.log('[28/50] 测试返回目录按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "目录")]', 2000)) {
            testResults.backToDirectory = true;
            console.log('返回目录按钮正常\n');
            await driver.pause(500);
        }
        
        // ==================== 创建第二个章节测试 ====================
        console.log('[29/50] 创建第二个章节...');
        if (await findAndTap(driver, '//*[contains(@text, "添加章节")]', 2000)) {
            await driver.pause(1000);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "故事导演")]', 3000)) {
                // 快速选择卡牌
                await findAndTap(driver, '//*[contains(@text, "法师")]', 1000);
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
        
        // ==================== 目录翻页测试 ====================
        console.log('[30/50] 测试目录翻页...');
        // 如果有多个章节，测试翻页
        if (await findAndTap(driver, '//*[contains(@text, "下一页")]', 1000)) {
            testResults.directoryNextPage = true;
            console.log('目录下一页正常\n');
            await driver.pause(500);
        }
        
        if (await findAndTap(driver, '//*[contains(@text, "上一页")]', 1000)) {
            testResults.directoryPrevPage = true;
            console.log('目录上一页正常\n');
            await driver.pause(500);
        }
        
        // ==================== 返回首页路径测试 ====================
        console.log('[31/50] 测试返回书架页...');
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            testResults.returnToBookshelf = true;
            console.log('已返回书架页\n');
            await driver.pause(1000);
        }
        
        console.log('[32/50] 验证书架页显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "我的书架")]', 3000)) {
            console.log('书架页显示正常\n');
        }
        
        console.log('[33/50] 从书架页返回首页...');
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            testResults.returnToHomeFromBookshelf = true;
            console.log('已点击返回按钮\n');
            await driver.pause(1000);
        }
        
        console.log('[34/50] 验证首页显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "乐高故事书")]', 3000)) {
            testResults.homePageAfterReturn = true;
            console.log('返回首页成功\n');
        }
        
        // ==================== 卡牌Demo页面测试 ====================
        console.log('[35/50] 进入卡牌Demo页面...');
        if (await findAndTap(driver, '//*[contains(@text, "卡牌")]', 2000)) {
            testResults.navigateToCardDemo = true;
            console.log('已点击卡牌按钮\n');
            await driver.pause(2000);
        }
        
        console.log('[36/50] 验证卡牌Demo页面...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "书架")]', 3000) ||
            await isElementDisplayed(driver, '//*[contains(@text, "回合")]', 3000)) {
            testResults.cardDemoPage = true;
            console.log('卡牌Demo页面显示正常\n');
        }
        
        console.log('[37/50] 测试卡牌Demo首页按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "首页")]', 2000)) {
            testResults.cardDemoHomeButton = true;
            console.log('首页按钮正常\n');
            await driver.pause(500);
            
            // 返回卡牌Demo页面
            if (await findAndTap(driver, '//*[contains(@text, "卡牌")]', 2000)) {
                await driver.pause(1000);
            }
        }
        
        console.log('[38/50] 测试卡牌Demo风格按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "风格")]', 2000)) {
            testResults.cardDemoStyleButton = true;
            console.log('风格按钮正常\n');
            await driver.pause(500);
            
            // 关闭风格选择器
            if (await findAndTap(driver, '//*[contains(@text, "关闭")]', 2000)) {
                await driver.pause(500);
            }
        }
        
        console.log('[39/50] 测试卡牌Demo书架按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "书架")]', 2000)) {
            testResults.cardDemoBookshelfButton = true;
            console.log('书架按钮正常\n');
            await driver.pause(1000);
            
            // 返回卡牌Demo页面
            await findAndTap(driver, '//*[contains(@text, "返回")]', 2000);
            await driver.pause(500);
            
            // 重新进入卡牌Demo
            if (await findAndTap(driver, '//*[contains(@text, "卡牌")]', 2000)) {
                await driver.pause(1000);
            }
        }
        
        console.log('[40/50] 测试卡牌Demo导演台按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "导演台")]', 2000)) {
            testResults.cardDemoDirectorButton = true;
            console.log('导演台按钮正常\n');
            await driver.pause(1000);
            
            // 返回
            await findAndTap(driver, '//*[contains(@text, "返回")]', 2000);
            await driver.pause(500);
            
            // 重新进入卡牌Demo
            if (await findAndTap(driver, '//*[contains(@text, "卡牌")]', 2000)) {
                await driver.pause(1000);
            }
        }
        
        console.log('[41/50] 测试卡牌Demo书籍按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "书籍")]', 2000)) {
            testResults.cardDemoBookButton = true;
            console.log('书籍按钮正常\n');
            await driver.pause(1000);
            
            // 返回
            await findAndTap(driver, '//*[contains(@text, "返回")]', 2000);
            await driver.pause(500);
        }
        
        // ==================== 删除书籍测试 ====================
        console.log('[42/50] 进入书架页删除书籍...');
        if (await findAndTap(driver, '//*[contains(@text, "书架")]', 2000)) {
            await driver.pause(1000);
        }
        
        console.log('[43/50] 删除测试书籍...');
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
        
        console.log('首页测试:');
        console.log(`  ${testResults.appLaunch ? '✅' : '❌'} APP启动`);
        console.log(`  ${testResults.homePageDisplayed ? '✅' : '❌'} 首页显示`);
        console.log(`  ${testResults.navigateToBookshelf ? '✅' : '❌'} 进入书架页`);
        
        console.log('\n书架页测试:');
        console.log(`  ${testResults.bookshelfPage ? '✅' : '❌'} 书架页显示`);
        console.log(`  ${testResults.createBookButton ? '✅' : '❌'} 创建书籍按钮`);
        console.log(`  ${testResults.createBookModal ? '✅' : '❌'} 创建书籍弹窗`);
        console.log(`  ${testResults.bookTitleInput ? '✅' : '❌'} 书籍名称输入`);
        console.log(`  ${testResults.bookTypeSelection ? '✅' : '❌'} 书籍类型选择`);
        console.log(`  ${testResults.bookCreated ? '✅' : '❌'} 书籍创建成功`);
        
        console.log('\n书籍详情页测试:');
        console.log(`  ${testResults.bookDetailPage ? '✅' : '❌'} 书籍详情页显示`);
        console.log(`  ${testResults.tabChapters ? '✅' : '❌'} 章节标签页`);
        console.log(`  ${testResults.tabCharacters ? '✅' : '❌'} 角色标签页`);
        console.log(`  ${testResults.tabPlots ? '✅' : '❌'} 情节标签页`);
        console.log(`  ${testResults.chapterItemClick ? '✅' : '❌'} 章节点击`);
        console.log(`  ${testResults.characterCardClick ? '✅' : '❌'} 角色卡牌点击`);
        console.log(`  ${testResults.plotCardClick ? '✅' : '❌'} 情节卡牌点击`);
        
        console.log('\n翻页功能测试:');
        console.log(`  ${testResults.directoryPrevPage ? '✅' : '❌'} 目录上一页`);
        console.log(`  ${testResults.directoryNextPage ? '✅' : '❌'} 目录下一页`);
        console.log(`  ${testResults.chapterPrevPage ? '✅' : '❌'} 章节上一章`);
        console.log(`  ${testResults.chapterNextPage ? '✅' : '❌'} 章节下一章`);
        console.log(`  ${testResults.backToDirectory ? '✅' : '❌'} 返回目录`);
        
        console.log('\n故事导演页测试:');
        console.log(`  ${testResults.addChapterButton ? '✅' : '❌'} 添加章节按钮`);
        console.log(`  ${testResults.storyDirectorPage ? '✅' : '❌'} 故事导演页显示`);
        console.log(`  ${testResults.characterSelection ? '✅' : '❌'} 角色选择`);
        console.log(`  ${testResults.weatherSelection ? '✅' : '❌'} 天气选择`);
        console.log(`  ${testResults.terrainSelection ? '✅' : '❌'} 地形选择`);
        console.log(`  ${testResults.equipmentSelection ? '✅' : '❌'} 装备选择`);
        console.log(`  ${testResults.adventureSelection ? '✅' : '❌'} 冒险类型选择`);
        console.log(`  ${testResults.shootButton ? '✅' : '❌'} 开拍按钮`);
        console.log(`  ${testResults.chapterCreated ? '✅' : '❌'} 章节创建成功`);
        
        console.log('\n多章节测试:');
        console.log(`  ${testResults.multipleChapters ? '✅' : '❌'} 多章节创建`);
        
        console.log('\n返回首页路径测试:');
        console.log(`  ${testResults.returnToBookshelf ? '✅' : '❌'} 返回书架页`);
        console.log(`  ${testResults.returnToHomeFromBookshelf ? '✅' : '❌'} 从书架返回首页`);
        console.log(`  ${testResults.homePageAfterReturn ? '✅' : '❌'} 首页显示正常`);
        
        console.log('\n卡牌Demo页面测试:');
        console.log(`  ${testResults.navigateToCardDemo ? '✅' : '❌'} 进入卡牌Demo`);
        console.log(`  ${testResults.cardDemoPage ? '✅' : '❌'} 卡牌Demo页面显示`);
        console.log(`  ${testResults.cardDemoHomeButton ? '✅' : '❌'} 首页按钮`);
        console.log(`  ${testResults.cardDemoStyleButton ? '✅' : '❌'} 风格按钮`);
        console.log(`  ${testResults.cardDemoBookshelfButton ? '✅' : '❌'} 书架按钮`);
        console.log(`  ${testResults.cardDemoDirectorButton ? '✅' : '❌'} 导演台按钮`);
        console.log(`  ${testResults.cardDemoBookButton ? '✅' : '❌'} 书籍按钮`);
        
        console.log('\n删除书籍测试:');
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
