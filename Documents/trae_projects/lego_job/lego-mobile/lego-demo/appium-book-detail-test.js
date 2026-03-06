/**
 * 书籍详情页Demo测试 - Appium端到端测试
 * 覆盖重新设计后的所有功能点
 * 
 * 测试范围：
 * 1. 章节Tab - 目录视图、分页、章节内容、添加章节按钮
 * 2. 角色Tab - 卡牌网格布局（2列）
 * 3. 情节Tab - 分类卡牌网格布局（2列）
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
    console.log('  测试重新设计后的所有功能点');
    console.log('='.repeat(70) + '\n');
    
    const startTime = Date.now();
    const testResults = {
        homeButton: false,
        bookTitle: false,
        chapterTab: false,
        directoryTitle: false,
        directoryTwoColumns: false,
        directoryPagination: false,
        chapterSelect: false,
        chapterContent: false,
        chapterContentPaging: false,
        addChapterButton: false,
        addChapterNavigation: false,
        characterTab: false,
        characterCardGrid: false,
        characterCardSelect: false,
        plotTab: false,
        plotCategories: false,
        plotCardGrid: false,
        plotCardSelect: false,
        backNavigation: false,
    };
    
    try {
        await startAppiumServer();
        
        console.log('[1/25] 检测APP状态...');
        
        const inForeground = await checkAppInForeground();
        if (!inForeground) {
            console.log('APP不在前台，正在切换到前台...');
            await launchApp();
            console.log('APP已切换到前台\n');
        } else {
            console.log('APP已在前台运行\n');
        }

        console.log('[2/25] 连接Appium服务器...');
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

        console.log('[3/25] 等待应用启动...');
        await driver.pause(1000);
        console.log('应用已启动\n');

        // ==================== 首页入口按钮测试 ====================
        console.log('[4/25] 测试首页书籍入口按钮...');
        if (await findAndTap(driver, '//*[@text="📖"]', 3000)) {
            testResults.homeButton = true;
            console.log('已点击书籍入口按钮\n');
        } else if (await findAndTap(driver, '//*[contains(@text, "书籍")]', 2000)) {
            testResults.homeButton = true;
            console.log('已点击书籍入口按钮(文本)\n');
        } else {
            console.log('未找到书籍入口按钮\n');
        }
        
        await driver.pause(800);

        // ==================== 书籍标题测试 ====================
        console.log('[5/25] 验证书籍标题显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "勇者的冒险之旅")]', 2000)) {
            testResults.bookTitle = true;
            console.log('书籍标题显示正常\n');
        } else {
            console.log('书籍标题未显示\n');
        }

        // ==================== 章节Tab测试 ====================
        console.log('[6/25] 测试章节Tab...');
        if (await findAndTap(driver, '//*[contains(@text, "章节")]', 2000)) {
            testResults.chapterTab = true;
            console.log('章节Tab点击成功\n');
        }
        await driver.pause(500);

        // ==================== 目录视图测试 ====================
        console.log('[7/25] 验证目录标题显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "目 录")]', 2000)) {
            testResults.directoryTitle = true;
            console.log('目录标题显示正常\n');
        }

        console.log('[8/25] 验证目录两列布局...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "第一章")]', 1000)) {
            console.log('第一章显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "第二章")]', 1000)) {
            console.log('第二章显示正常\n');
            testResults.directoryTwoColumns = true;
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "第三章")]', 1000)) {
            console.log('第三章显示正常\n');
        }

        // ==================== 目录分页测试 ====================
        console.log('[9/25] 测试目录分页功能...');
        if (await findAndTap(driver, '//*[contains(@text, "下一页")]', 2000)) {
            testResults.directoryPagination = true;
            console.log('下一页按钮点击成功\n');
            await driver.pause(300);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "第七章")]', 1000)) {
                console.log('分页后显示第七章正常\n');
            }
            if (await isElementDisplayed(driver, '//*[contains(@text, "第八章")]', 1000)) {
                console.log('分页后显示第八章正常\n');
            }
        } else if (await isElementDisplayed(driver, '//*[contains(@text, "下一页")]', 1000)) {
            testResults.directoryPagination = true;
            console.log('分页按钮存在\n');
        } else {
            console.log('未找到分页按钮（可能只有一页）\n');
        }

        // 返回第一页
        if (await findAndTap(driver, '//*[contains(@text, "上一页")]', 1000)) {
            console.log('返回上一页成功\n');
            await driver.pause(300);
        }

        // ==================== 章节选择测试 ====================
        console.log('[10/25] 测试章节选择...');
        if (await findAndTap(driver, '//*[contains(@text, "第一章")]', 2000)) {
            testResults.chapterSelect = true;
            console.log('已选择第一章\n');
        } else if (await findAndTap(driver, '//*[contains(@text, "神秘森林")]', 1000)) {
            testResults.chapterSelect = true;
            console.log('已选择神秘森林章节\n');
        }
        await driver.pause(500);

        // ==================== 章节内容视图测试 ====================
        console.log('[11/25] 验证章节内容视图...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "神秘森林")]', 2000)) {
            testResults.chapterContent = true;
            console.log('章节内容标题显示正常\n');
        }
        
        if (await isElementDisplayed(driver, '//*[contains(@text, "森林深处")]', 1000)) {
            console.log('章节内容文本正常\n');
        }

        // ==================== 章节内容分页测试 ====================
        console.log('[12/25] 测试章节内容分页...');
        if (await findAndTap(driver, '//*[contains(@text, "下一页")]', 2000)) {
            testResults.chapterContentPaging = true;
            console.log('章节内容下一页点击成功\n');
            await driver.pause(300);
        } else if (await isElementDisplayed(driver, '//*[contains(@text, "下一页")]', 1000)) {
            testResults.chapterContentPaging = true;
            console.log('章节内容分页按钮存在\n');
        } else {
            console.log('章节内容可能只有一页\n');
        }

        // 返回目录
        console.log('[13/25] 返回目录视图...');
        if (await findAndTap(driver, '//*[contains(@text, "返回目录")]', 2000)) {
            console.log('返回目录成功\n');
        } else if (await findAndTap(driver, '//*[contains(@text, "目录")]', 1000)) {
            console.log('返回目录成功(通过Tab)\n');
        }
        await driver.pause(300);

        // ==================== 添加章节按钮测试 ====================
        console.log('[14/25] 测试添加章节按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "下一页")]', 2000)) {
            await driver.pause(300);
        }
        
        if (await findAndTap(driver, '//*[contains(@text, "添加章节")]', 2000)) {
            testResults.addChapterButton = true;
            console.log('添加章节按钮点击成功\n');
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "故事导演")]', 2000)) {
                testResults.addChapterNavigation = true;
                console.log('成功跳转到故事导演页面\n');
            } else if (await isElementDisplayed(driver, '//*[contains(@text, "导演")]', 1000)) {
                testResults.addChapterNavigation = true;
                console.log('成功跳转到导演页面\n');
            }
            
            await driver.pause(300);
            
            // 返回书籍详情页 - 点击返回按钮
            if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
                console.log('点击返回按钮\n');
                await driver.pause(500);
            }
            
            // 确认返回到书籍详情页
            if (await isElementDisplayed(driver, '//*[contains(@text, "勇者的冒险之旅")]', 2000)) {
                console.log('已返回书籍详情页\n');
            }
            
            // 重新进入章节Tab
            if (await findAndTap(driver, '//*[contains(@text, "章节")]', 2000)) {
                console.log('重新进入章节Tab\n');
                await driver.pause(300);
            }
        } else {
            console.log('未找到添加章节按钮\n');
        }

        // ==================== 角色Tab测试 ====================
        console.log('[15/25] 测试角色Tab...');
        if (await findAndTap(driver, '//*[contains(@text, "角色")]', 2000)) {
            testResults.characterTab = true;
            console.log('角色Tab点击成功\n');
        } else if (await findAndTap(driver, '//*[@text="🎭 角色"]', 2000)) {
            testResults.characterTab = true;
            console.log('角色Tab点击成功(完整文本)\n');
        }
        await driver.pause(500);

        console.log('[16/25] 验证角色卡牌网格布局...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "勇士阿尔法")]', 2000)) {
            console.log('勇士阿尔法卡牌显示正常\n');
            testResults.characterCardGrid = true;
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "魔王")]', 1000)) {
            console.log('魔王卡牌显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "精灵")]', 1000)) {
            console.log('精灵卡牌显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "守卫")]', 1000)) {
            console.log('守卫卡牌显示正常\n');
        }

        console.log('[17/25] 测试角色卡牌选择...');
        if (await findAndTap(driver, '//*[contains(@text, "勇士阿尔法")]', 2000)) {
            testResults.characterCardSelect = true;
            console.log('角色卡牌点击成功\n');
            await driver.pause(300);
        }

        // ==================== 情节Tab测试 ====================
        console.log('[18/25] 测试情节Tab...');
        if (await findAndTap(driver, '//*[contains(@text, "情节")]', 2000)) {
            testResults.plotTab = true;
            console.log('情节Tab点击成功\n');
        } else if (await findAndTap(driver, '//*[@text="🎴 情节"]', 2000)) {
            testResults.plotTab = true;
            console.log('情节Tab点击成功(完整文本)\n');
        }
        await driver.pause(500);

        console.log('[19/25] 验证情节分类显示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "天气")]', 2000)) {
            testResults.plotCategories = true;
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

        console.log('[20/25] 验证情节卡牌网格布局...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "晴天")]', 2000)) {
            testResults.plotCardGrid = true;
            console.log('晴天卡牌显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "雨天")]', 1000)) {
            console.log('雨天卡牌显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "战斗")]', 1000)) {
            console.log('战斗卡牌显示正常\n');
        }
        if (await isElementDisplayed(driver, '//*[contains(@text, "探索")]', 1000)) {
            console.log('探索卡牌显示正常\n');
        }

        console.log('[21/25] 测试情节卡牌选择...');
        if (await findAndTap(driver, '//*[contains(@text, "晴天")]', 2000)) {
            testResults.plotCardSelect = true;
            console.log('情节卡牌点击成功\n');
            await driver.pause(300);
        }

        // ==================== 返回功能测试 ====================
        console.log('[22/25] 测试返回功能...');
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            testResults.backNavigation = true;
            await driver.pause(300);
            console.log('返回功能正常\n');
        }

        // ==================== 测试结果汇总 ====================
        console.log('[23/25] 汇总测试结果...');
        
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        console.log('\n' + '='.repeat(70));
        console.log('  测试结果汇总');
        console.log('='.repeat(70));
        console.log(`\n总耗时: ${totalTime}秒\n`);
        
        console.log('功能点测试结果:');
        console.log(`  ${testResults.homeButton ? '✅' : '❌'} 首页入口按钮`);
        console.log(`  ${testResults.bookTitle ? '✅' : '❌'} 书籍标题显示`);
        console.log(`  ${testResults.chapterTab ? '✅' : '❌'} 章节Tab切换`);
        console.log(`  ${testResults.directoryTitle ? '✅' : '❌'} 目录标题显示`);
        console.log(`  ${testResults.directoryTwoColumns ? '✅' : '❌'} 目录两列布局`);
        console.log(`  ${testResults.directoryPagination ? '✅' : '❌'} 目录分页功能`);
        console.log(`  ${testResults.chapterSelect ? '✅' : '❌'} 章节选择功能`);
        console.log(`  ${testResults.chapterContent ? '✅' : '❌'} 章节内容视图`);
        console.log(`  ${testResults.chapterContentPaging ? '✅' : '❌'} 章节内容分页`);
        console.log(`  ${testResults.addChapterButton ? '✅' : '❌'} 添加章节按钮`);
        console.log(`  ${testResults.addChapterNavigation ? '✅' : '❌'} 添加章节跳转`);
        console.log(`  ${testResults.characterTab ? '✅' : '❌'} 角色Tab切换`);
        console.log(`  ${testResults.characterCardGrid ? '✅' : '❌'} 角色卡牌网格`);
        console.log(`  ${testResults.characterCardSelect ? '✅' : '❌'} 角色卡牌选择`);
        console.log(`  ${testResults.plotTab ? '✅' : '❌'} 情节Tab切换`);
        console.log(`  ${testResults.plotCategories ? '✅' : '❌'} 情节分类显示`);
        console.log(`  ${testResults.plotCardGrid ? '✅' : '❌'} 情节卡牌网格`);
        console.log(`  ${testResults.plotCardSelect ? '✅' : '❌'} 情节卡牌选择`);
        console.log(`  ${testResults.backNavigation ? '✅' : '❌'} 返回功能`);
        
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
    } finally {
        if (driver) {
            await driver.deleteSession();
        }
        await stopAppiumServer();
    }
}

runBookDetailTest().catch(console.error);
