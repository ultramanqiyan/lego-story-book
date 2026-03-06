/**
 * 书籍详情页Demo测试 - Appium端到端测试
 * 覆盖设计方案中的所有功能点
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

async function runBookDetailTest() {
    let driver;
    
    console.log('\n' + '='.repeat(70));
    console.log('  书籍详情页Demo测试 - Appium端到端测试');
    console.log('  测试所有功能点：章节、角色、情节、谜题');
    console.log('='.repeat(70) + '\n');
    
    const startTime = Date.now();
    const testResults = {
        homeButton: false,
        bookTitle: false,
        chapterTab: false,
        chapterList: false,
        chapterSelect: false,
        chapterContent: false,
        characterHighlight: false,
        puzzleDisplay: false,
        puzzleInteraction: false,
        characterTab: false,
        characterList: false,
        characterSelect: false,
        characterDetail: false,
        plotTab: false,
        plotCategories: false,
        plotCardSelect: false,
        plotCardDetail: false,
        backNavigation: false,
    };
    
    try {
        await startAppiumServer();
        
        console.log('[1/20] 检测APP状态...');
        
        const inForeground = await checkAppInForeground();
        if (!inForeground) {
            console.log('APP不在前台，正在切换到前台...');
            await launchApp();
            console.log('APP已切换到前台\n');
        } else {
            console.log('APP已在前台运行\n');
        }

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
        await driver.pause(1000);
        console.log('应用已启动\n');

        // ==================== 首页入口按钮测试 ====================
        console.log('[4/20] 测试首页书籍入口按钮...');
        if (await findAndTap(driver, '//*[@text="📖"]', 3000)) {
            testResults.homeButton = true;
            console.log('已点击书籍入口按钮\n');
        } else if (await findAndTap(driver, '//*[contains(@text, "书籍")]', 2000)) {
            testResults.homeButton = true;
            console.log('已点击书籍入口按钮(文本)\n');
        } else if (await findAndTap(driver, '//*[@text="📖"]', 2000)) {
            testResults.homeButton = true;
            console.log('已点击书籍入口按钮(emoji)\n');
        } else {
            console.log('未找到书籍入口按钮\n');
        }
        
        await driver.pause(800);

        // ==================== 书籍标题测试 ====================
        console.log('[5/20] 验证书籍标题显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "勇者的冒险之旅")]', 2000)) {
            testResults.bookTitle = true;
            console.log('书籍标题显示正常\n');
        } else {
            console.log('书籍标题未显示\n');
        }

        // ==================== 章节Tab测试 ====================
        console.log('[6/20] 测试章节Tab...');
        if (await findAndTap(driver, '//*[contains(@text, "章节")]', 2000)) {
            testResults.chapterTab = true;
            console.log('章节Tab点击成功\n');
        }
        await driver.pause(300);

        // ==================== 目录列表测试 ====================
        console.log('[7/20] 验证目录列表显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "目 录")]', 2000)) {
            testResults.chapterList = true;
            console.log('目录列表显示正常\n');
        }
        
        if (await isElementDisplayed(driver, '//*[contains(@text, "第一章")]', 1000)) {
            console.log('第一章显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "第二章")]', 1000)) {
            console.log('第二章显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "第五章")]', 1000)) {
            console.log('第五章显示正常\n');
        }

        // ==================== 章节选择测试 ====================
        console.log('[8/20] 测试章节选择...');
        // 尝试多种选择器
        if (await findAndTap(driver, '//*[contains(@text, "第一章")]', 2000)) {
            testResults.chapterSelect = true;
            console.log('已选择第一章\n');
        } else if (await findAndTap(driver, '//*[contains(@text, "第1章")]', 1000)) {
            testResults.chapterSelect = true;
            console.log('已选择第1章\n');
        } else if (await findAndTap(driver, '//*[contains(@text, "神秘森林")]', 1000)) {
            testResults.chapterSelect = true;
            console.log('已选择神秘森林章节\n');
        } else {
            console.log('未找到章节选项\n');
        }
        await driver.pause(500);

        // ==================== 章节内容测试 ====================
        console.log('[9/20] 验证章节内容显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "神秘森林")]', 2000)) {
            testResults.chapterContent = true;
            console.log('章节内容显示正常\n');
        }
        
        // 检查内容文本
        if (await isElementDisplayed(driver, '//*[contains(@text, "森林深处")]', 1000)) {
            console.log('章节内容文本正常\n');
        }

        // ==================== 角色高亮测试 ====================
        console.log('[10/20] 验证角色高亮显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "登场角色")]', 1000)) {
            testResults.characterHighlight = true;
            console.log('登场角色区域显示正常\n');
        }
        
        if (await isElementDisplayed(driver, '//*[contains(@text, "勇士阿尔法")]', 1000)) {
            console.log('角色名称高亮显示正常\n');
        }

        // ==================== 谜题测试 ====================
        console.log('[11/20] 测试谜题显示...');
        // 选择第二章（有谜题）
        if (await findAndTap(driver, '//*[contains(@text, "第二章")]', 2000)) {
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "谜题")]', 2000)) {
                testResults.puzzleDisplay = true;
                console.log('谜题显示正常\n');
            } else if (await isElementDisplayed(driver, '//*[contains(@text, "❓")]', 1000)) {
                testResults.puzzleDisplay = true;
                console.log('谜题图标显示正常\n');
            } else {
                console.log('谜题未显示\n');
            }
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "符文代表")]', 1000)) {
                console.log('谜题问题显示正常\n');
            }
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "A.")]', 1000)) {
                console.log('谜题选项显示正常\n');
            }
        } else if (await findAndTap(driver, '//*[contains(@text, "古老城堡")]', 1000)) {
            await driver.pause(500);
            if (await isElementDisplayed(driver, '//*[contains(@text, "谜题")]', 2000)) {
                testResults.puzzleDisplay = true;
                console.log('谜题显示正常(通过标题选择)\n');
            }
        } else {
            console.log('未找到第二章\n');
        }

        console.log('[12/20] 测试谜题交互...');
        // 点击选项C - 大地
        if (await findAndTap(driver, '//*[contains(@text, "C. 大地")]', 2000)) {
            await driver.pause(500);
            testResults.puzzleInteraction = true;
            console.log('谜题选项点击成功\n');
            
            // 检查是否显示正确
            if (await isElementDisplayed(driver, '//*[contains(@text, "正确")]', 1000)) {
                console.log('谜题回答正确\n');
            } else if (await isElementDisplayed(driver, '//*[contains(@text, "✅")]', 1000)) {
                console.log('谜题回答正确(图标)\n');
            }
        } else if (await findAndTap(driver, '//*[contains(@text, "大地")]', 1000)) {
            await driver.pause(500);
            testResults.puzzleInteraction = true;
            console.log('谜题选项点击成功(无前缀)\n');
        } else {
            console.log('未找到谜题选项\n');
        }

        // ==================== 角色Tab测试 ====================
        console.log('[13/20] 测试角色Tab...');
        if (await findAndTap(driver, '//*[contains(@text, "角色")]', 2000)) {
            testResults.characterTab = true;
            console.log('角色Tab点击成功\n');
        }
        await driver.pause(300);

        console.log('[14/20] 验证角色列表显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "角色列表")]', 2000)) {
            testResults.characterList = true;
            console.log('角色列表显示正常\n');
        }
        
        if (await isElementDisplayed(driver, '//*[contains(@text, "勇士阿尔法")]', 1000)) {
            console.log('勇士阿尔法显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "魔王")]', 1000)) {
            console.log('魔王显示正常\n');
        }

        console.log('[15/20] 测试角色选择和详情...');
        if (await findAndTap(driver, '//*[contains(@text, "勇士阿尔法")]', 2000)) {
            testResults.characterSelect = true;
            await driver.pause(300);
            console.log('已选择勇士阿尔法\n');
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "故事的主角")]', 1000)) {
                testResults.characterDetail = true;
                console.log('角色详情显示正常\n');
            }
        }

        // ==================== 情节Tab测试 ====================
        console.log('[16/20] 测试情节Tab...');
        if (await findAndTap(driver, '//*[contains(@text, "情节")]', 2000)) {
            testResults.plotTab = true;
            console.log('情节Tab点击成功\n');
        }
        await driver.pause(300);

        console.log('[17/20] 验证情节分类显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "情节元素")]', 2000)) {
            testResults.plotCategories = true;
            console.log('情节元素标题显示正常\n');
        }
        
        if (await isElementDisplayed(driver, '//*[contains(@text, "天气")]', 1000)) {
            console.log('天气分类显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "冒险类型")]', 1000)) {
            console.log('冒险类型分类显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "地形")]', 1000)) {
            console.log('地形分类显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "装备")]', 1000)) {
            console.log('装备分类显示正常\n');
        }

        console.log('[18/20] 测试情节卡牌选择和详情...');
        if (await findAndTap(driver, '//*[contains(@text, "晴天")]', 2000)) {
            testResults.plotCardSelect = true;
            await driver.pause(300);
            console.log('已选择晴天卡牌\n');
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "阳光明媚")]', 1000)) {
                testResults.plotCardDetail = true;
                console.log('卡牌详情显示正常\n');
            }
        }

        // ==================== 返回功能测试 ====================
        console.log('[19/20] 测试返回功能...');
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            testResults.backNavigation = true;
            await driver.pause(300);
            console.log('返回功能正常\n');
        }

        // ==================== 测试结果汇总 ====================
        console.log('[20/20] 汇总测试结果...');
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        console.log('\n' + '='.repeat(70));
        console.log('  测试结果汇总');
        console.log('='.repeat(70));
        console.log(`\n总耗时: ${totalTime}秒\n`);
        
        console.log('功能点测试结果:');
        console.log(`  ${testResults.homeButton ? '✅' : '❌'} 首页入口按钮`);
        console.log(`  ${testResults.bookTitle ? '✅' : '❌'} 书籍标题显示`);
        console.log(`  ${testResults.chapterTab ? '✅' : '❌'} 章节Tab切换`);
        console.log(`  ${testResults.chapterList ? '✅' : '❌'} 目录列表显示`);
        console.log(`  ${testResults.chapterSelect ? '✅' : '❌'} 章节选择功能`);
        console.log(`  ${testResults.chapterContent ? '✅' : '❌'} 章节内容显示`);
        console.log(`  ${testResults.characterHighlight ? '✅' : '❌'} 角色高亮显示`);
        console.log(`  ${testResults.puzzleDisplay ? '✅' : '❌'} 谜题显示`);
        console.log(`  ${testResults.puzzleInteraction ? '✅' : '❌'} 谜题交互`);
        console.log(`  ${testResults.characterTab ? '✅' : '❌'} 角色Tab切换`);
        console.log(`  ${testResults.characterList ? '✅' : '❌'} 角色列表显示`);
        console.log(`  ${testResults.characterSelect ? '✅' : '❌'} 角色选择功能`);
        console.log(`  ${testResults.characterDetail ? '✅' : '❌'} 角色详情显示`);
        console.log(`  ${testResults.plotTab ? '✅' : '❌'} 情节Tab切换`);
        console.log(`  ${testResults.plotCategories ? '✅' : '❌'} 情节分类显示`);
        console.log(`  ${testResults.plotCardSelect ? '✅' : '❌'} 情节卡牌选择`);
        console.log(`  ${testResults.plotCardDetail ? '✅' : '❌'} 情节卡牌详情`);
        console.log(`  ${testResults.backNavigation ? '✅' : '❌'} 返回功能`);
        
        const passedCount = Object.values(testResults).filter(v => v).length;
        const totalCount = Object.values(testResults).length;
        
        console.log(`\n通过率: ${passedCount}/${totalCount} (${Math.round(passedCount/totalCount*100)}%)`);
        
        if (passedCount === totalCount) {
            console.log('\n所有测试通过！');
        } else {
            console.log('\n部分测试未通过，请检查！');
        }
        
        console.log('\n提示: 请查看模拟器中的实际操作\n');

    } catch (error) {
        console.error('\n测试失败:', error.message);
    } finally {
        if (driver) {
            await driver.deleteSession();
        }
        await stopAppiumServer();
    }
}

runBookDetailTest().catch(console.error);
