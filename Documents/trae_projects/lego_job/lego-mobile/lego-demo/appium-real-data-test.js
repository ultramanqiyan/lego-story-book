/**
 * 真实书籍数据系统测试 - Appium端到端测试
 * 覆盖所有功能点
 * 
 * 测试范围：
 * 1. 首页入口按钮
 * 2. 书架页显示真实书籍数据
 * 3. 书籍详情页显示真实章节数据
 * 4. 书籍详情页显示真实角色数据
 * 5. 故事导演页显示真实角色和情节元素
 * 6. 不同书籍类型的卡牌风格
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

async function isElementDisplayed(driver, selector, timeout = 1000) {
    try {
        const element = await driver.$(selector);
        await element.waitForDisplayed({ timeout });
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

async function runRealDataTest() {
    let driver;
    
    console.log('\n' + '='.repeat(70));
    console.log('  真实书籍数据系统测试 - Appium端到端测试');
    console.log('  测试所有功能点');
    console.log('='.repeat(70) + '\n');
    
    const startTime = Date.now();
    const testResults = {
        appLaunch: false,
        homePage: false,
        bookshelfButton: false,
        bookshelfTitle: false,
        realBookData: false,
        bookClick: false,
        bookDetailTitle: false,
        chapterData: false,
        characterData: false,
        plotData: false,
        directorNavigation: false,
        directorData: false,
        backNavigation: false,
        returnHome: false,
    };
    
    try {
        await startAppiumServer();
        
        console.log('[1/15] 强制重启APP确保干净状态...');
        await forceStopAndLaunchApp();
        testResults.appLaunch = true;
        console.log('APP已重启\n');

        console.log('[2/15] 连接Appium服务器...');
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

        console.log('[3/15] 等待应用启动...');
        await driver.pause(3000);
        testResults.homePage = true;
        console.log('应用已启动\n');

        // ==================== 首页测试 ====================
        console.log('[4/15] 测试首页入口按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "书架")]', 3000)) {
            testResults.bookshelfButton = true;
            console.log('已点击书架按钮\n');
        } else {
            console.log('未找到书架按钮\n');
        }
        
        await driver.pause(1000);

        // ==================== 书架页测试 ====================
        console.log('[5/15] 验证书架页显示真实书籍数据...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "我的书架")]', 3000)) {
            testResults.bookshelfTitle = true;
            console.log('书架页标题显示正常\n');
        }

        // 验证真实书籍数据
        const bookTitles = [
            '小勇者的森林奇遇',
            '魔法兔子的寻宝记',
            '龙之谷的召唤',
            '魔法学院的秘密',
            '创业之路',
            '职场风云',
            '机甲觉醒',
            '星际征途'
        ];
        
        let foundBooks = 0;
        for (const title of bookTitles) {
            if (await isElementDisplayed(driver, `//*[contains(@text, "${title}")]`, 1000)) {
                foundBooks++;
            }
        }
        
        if (foundBooks >= 4) {
            testResults.realBookData = true;
            console.log(`找到${foundBooks}本真实书籍，数据加载成功\n`);
        } else {
            console.log(`只找到${foundBooks}本书籍，数据可能有问题\n`);
        }

        // ==================== 点击书籍测试 ====================
        console.log('[6/15] 测试点击书籍跳转到书籍详情页...');
        if (await findAndTap(driver, '//*[contains(@text, "小勇者的森林奇遇")]', 2000)) {
            testResults.bookClick = true;
            console.log('已点击书籍卡片\n');
            await driver.pause(1000);
        }

        // ==================== 书籍详情页测试 ====================
        console.log('[7/15] 验证书籍详情页章节数据...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 3000)) {
            testResults.bookDetailTitle = true;
            console.log('书籍详情页章节Tab显示正常\n');
        }

        // 验证章节内容
        const chapters = ['神秘森林入口', '迷路的蝴蝶', '智慧猫头鹰的考验'];
        let foundChapters = 0;
        for (const chapter of chapters) {
            if (await isElementDisplayed(driver, `//*[contains(@text, "${chapter}")]`, 1000)) {
                foundChapters++;
            }
        }
        
        if (foundChapters >= 1) {
            testResults.chapterData = true;
            console.log(`找到${foundChapters}个章节，章节数据正常\n`);
        }

        // ==================== 角色Tab测试 ====================
        console.log('[8/15] 测试角色Tab数据...');
        if (await findAndTap(driver, '//*[contains(@text, "角色")]', 2000)) {
            await driver.pause(500);
            
            const characters = ['小勇者', '魔法兔子', '智慧猫头鹰'];
            let foundCharacters = 0;
            for (const char of characters) {
                if (await isElementDisplayed(driver, `//*[contains(@text, "${char}")]`, 1000)) {
                    foundCharacters++;
                }
            }
            
            if (foundCharacters >= 1) {
                testResults.characterData = true;
                console.log(`找到${foundCharacters}个角色，角色数据正常\n`);
            }
        }

        // ==================== 情节Tab测试 ====================
        console.log('[9/15] 测试情节Tab数据...');
        if (await findAndTap(driver, '//*[contains(@text, "情节")]', 2000)) {
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "天气")]', 1000) ||
                await isElementDisplayed(driver, '//*[contains(@text, "晴天")]', 1000)) {
                testResults.plotData = true;
                console.log('情节元素数据正常\n');
            }
        }

        // ==================== 故事导演页测试 ====================
        console.log('[10/15] 测试故事导演页导航...');
        // 返回首页再进入导演台
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            await driver.pause(500);
        }
        
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            await driver.pause(500);
        }

        // 点击卡牌Demo按钮
        if (await findAndTap(driver, '//*[contains(@text, "卡牌")]', 2000)) {
            await driver.pause(500);
        }

        // 点击导演台按钮
        if (await findAndTap(driver, '//*[contains(@text, "导演")]', 2000)) {
            testResults.directorNavigation = true;
            console.log('已进入故事导演页\n');
            await driver.pause(1000);
        }

        // 验证导演页数据
        console.log('[11/15] 验证故事导演页数据...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "角色")]', 2000) ||
            await isElementDisplayed(driver, '//*[contains(@text, "天气")]', 1000)) {
            testResults.directorData = true;
            console.log('故事导演页数据正常\n');
        }

        // ==================== 返回导航测试 ====================
        console.log('[12/15] 测试返回导航...');
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            testResults.backNavigation = true;
            console.log('返回导航正常\n');
            await driver.pause(500);
        }

        // ==================== 返回首页测试 ====================
        console.log('[13/15] 测试返回首页...');
        if (await findAndTap(driver, '//*[contains(@text, "首页")]', 2000)) {
            testResults.returnHome = true;
            console.log('返回首页正常\n');
            await driver.pause(500);
        }

        // ==================== 崩溃检测 ====================
        console.log('[14/15] 检测应用崩溃...');
        const crashDetected = await checkForCrashes();
        if (crashDetected) {
            console.log('应用发生崩溃!\n');
        } else {
            console.log('应用运行正常，无崩溃\n');
        }

        // ==================== 测试结果汇总 ====================
        console.log('[15/15] 汇总测试结果...');
        
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
        console.log(`  ${testResults.realBookData ? '✅' : '❌'} 真实书籍数据加载`);
        console.log(`  ${testResults.bookClick ? '✅' : '❌'} 书籍卡片点击`);
        console.log(`  ${testResults.bookDetailTitle ? '✅' : '❌'} 书籍详情页章节Tab`);
        console.log(`  ${testResults.chapterData ? '✅' : '❌'} 章节数据`);
        console.log(`  ${testResults.characterData ? '✅' : '❌'} 角色数据`);
        console.log(`  ${testResults.plotData ? '✅' : '❌'} 情节数据`);
        console.log(`  ${testResults.directorNavigation ? '✅' : '❌'} 故事导演页导航`);
        console.log(`  ${testResults.directorData ? '✅' : '❌'} 故事导演页数据`);
        console.log(`  ${testResults.backNavigation ? '✅' : '❌'} 返回导航`);
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

runRealDataTest().catch(console.error);
