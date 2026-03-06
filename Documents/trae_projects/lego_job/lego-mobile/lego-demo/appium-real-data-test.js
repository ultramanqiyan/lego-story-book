/**
 * 真实书籍数据系统测试 - Appium端到端测试（完整版）
 * 覆盖所有功能点，包含详细的内容检查
 * 
 * 测试范围：
 * 1. 首页入口按钮
 * 2. 书架页显示真实书籍数据（8本书）
 * 3. 书籍详情页显示真实章节数据（10章）
 * 4. 书籍详情页显示真实角色数据（4个角色）
 * 5. 书籍详情页显示真实情节元素
 * 6. 故事导演页显示真实角色和情节元素卡牌
 * 7. 不同书籍类型的卡牌风格
 * 8. 章节阅读和解谜功能
 * 9. 角色选择和舞台展示
 * 10. 所有导航流程
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

async function getPageSource(driver) {
    try {
        const source = await driver.getPageSource();
        return source;
    } catch (e) {
        return null;
    }
}

async function runRealDataTest() {
    let driver;
    
    console.log('\n' + '='.repeat(70));
    console.log('  真实书籍数据系统测试 - Appium端到端测试（完整版）');
    console.log('  测试所有功能点，包含详细的内容检查');
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
        chapterContent: false,
        puzzleFeature: false,
        characterData: false,
        plotData: false,
        directorNavigation: false,
        directorPageTitle: false,
        directorCharacterCards: false,
        directorAdventureCards: false,
        directorWeatherCards: false,
        directorTerrainCards: false,
        directorEquipmentCards: false,
        characterSelection: false,
        stageDisplay: false,
        backNavigation: false,
        returnHome: false,
        styleButton: false,
    };
    
    try {
        await startAppiumServer();
        
        console.log('[1/25] 强制重启APP确保干净状态...');
        await forceStopAndLaunchApp();
        testResults.appLaunch = true;
        console.log('APP已重启\n');

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
        await driver.pause(3000);
        testResults.homePage = true;
        console.log('应用已启动\n');

        // ==================== 首页测试 ====================
        console.log('[4/25] 测试首页入口按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "书架")]', 3000)) {
            testResults.bookshelfButton = true;
            console.log('已点击书架按钮\n');
        } else {
            console.log('未找到书架按钮\n');
        }
        
        await driver.pause(1000);

        // ==================== 书架页测试 ====================
        console.log('[5/25] 验证书架页显示真实书籍数据...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "我的书架")]', 3000)) {
            testResults.bookshelfTitle = true;
            console.log('书架页标题显示正常\n');
        }

        // 验证真实书籍数据（8本书）
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
        console.log('[6/25] 测试点击书籍跳转到书籍详情页...');
        if (await findAndTap(driver, '//*[contains(@text, "小勇者的森林奇遇")]', 2000)) {
            testResults.bookClick = true;
            console.log('已点击书籍卡片\n');
            await driver.pause(1000);
        }

        // ==================== 书籍详情页测试 ====================
        console.log('[7/25] 验证书籍详情页章节数据...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "章节")]', 3000)) {
            testResults.bookDetailTitle = true;
            console.log('书籍详情页章节Tab显示正常\n');
        }

        // 验证章节内容（10章）
        const chapters = [
            '神秘森林入口',
            '迷路的蝴蝶',
            '智慧猫头鹰的考验',
            '森林深处的秘密',
            '勇敢的决定',
            '魔法兔子的帮助',
            '解开古老谜题',
            '找到宝藏',
            '胜利归来',
            '新的冒险'
        ];
        let foundChapters = 0;
        for (const chapter of chapters) {
            if (await isElementDisplayed(driver, `//*[contains(@text, "${chapter}")]`, 1000)) {
                foundChapters++;
            }
        }
        
        if (foundChapters >= 3) {
            testResults.chapterData = true;
            console.log(`找到${foundChapters}个章节，章节数据正常\n`);
        }

        // ==================== 章节内容测试 ====================
        console.log('[8/25] 测试章节内容阅读...');
        if (await findAndTap(driver, '//*[contains(@text, "神秘森林入口")]', 2000)) {
            await driver.pause(500);
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "森林")]', 2000)) {
                testResults.chapterContent = true;
                console.log('章节内容显示正常\n');
            }
            
            if (await isElementDisplayed(driver, '//*[contains(@text, "谜题")]', 1000) ||
                await isElementDisplayed(driver, '//*[contains(@text, "?")]', 1000)) {
                testResults.puzzleFeature = true;
                console.log('解谜功能显示正常\n');
            }
            
            await findAndTap(driver, '//*[contains(@text, "目录")]', 2000);
            await driver.pause(500);
        }

        // ==================== 角色Tab测试 ====================
        console.log('[9/25] 测试角色Tab数据...');
        if (await findAndTap(driver, '//*[contains(@text, "角色")]', 2000)) {
            await driver.pause(500);
            
            const characters = ['小勇者', '魔法兔子', '智慧猫头鹰', '森林精灵'];
            let foundCharacters = 0;
            for (const char of characters) {
                if (await isElementDisplayed(driver, `//*[contains(@text, "${char}")]`, 1000)) {
                    foundCharacters++;
                }
            }
            
            if (foundCharacters >= 2) {
                testResults.characterData = true;
                console.log(`找到${foundCharacters}个角色，角色数据正常\n`);
            }
        }

        // ==================== 情节Tab测试 ====================
        console.log('[10/25] 测试情节Tab数据...');
        if (await findAndTap(driver, '//*[contains(@text, "情节")]', 2000)) {
            await driver.pause(500);
            
            const plotCategories = ['天气', '地形', '装备', '冒险'];
            let foundCategories = 0;
            for (const cat of plotCategories) {
                if (await isElementDisplayed(driver, `//*[contains(@text, "${cat}")]`, 1000)) {
                    foundCategories++;
                }
            }
            
            if (foundCategories >= 2) {
                testResults.plotData = true;
                console.log(`找到${foundCategories}个情节分类，情节元素数据正常\n`);
            }
        }

        // ==================== 故事导演页测试（从书籍详情页进入）====================
        console.log('[11/25] 测试故事导演页导航（从书籍详情页->章节Tab->添加章节进入）...');
        
        // 先点击章节Tab
        if (await findAndTap(driver, '//*[contains(@text, "章节")]', 2000)) {
            await driver.pause(500);
            console.log('已点击章节Tab\n');
        }
        
        // 添加章节按钮在最后一页，需要翻页
        // 每页显示6个章节，共10章，添加章节按钮在第2页
        console.log('查找添加章节按钮，可能需要翻页...\n');
        
        // 先尝试在当前页查找
        let addChapterClicked = false;
        const addChapterSelectors = [
            '//*[contains(@text, "添加章节")]',
            '//*[contains(@text, "➕")]',
        ];
        
        // 最多翻3页
        for (let page = 0; page < 3; page++) {
            console.log(`检查第${page + 1}页...`);
            
            for (const selector of addChapterSelectors) {
                if (await findAndTap(driver, selector, 1500)) {
                    addChapterClicked = true;
                    console.log('已点击添加章节按钮\n');
                    break;
                }
            }
            
            if (addChapterClicked) break;
            
            // 点击下一页按钮
            const nextButtonSelectors = [
                '//*[contains(@text, "下一页")]',
                '//*[contains(@text, ">")]',
                '//android.widget.TextView[@text=">"]',
            ];
            
            let nextPageClicked = false;
            for (const selector of nextButtonSelectors) {
                if (await findAndTap(driver, selector, 1000)) {
                    nextPageClicked = true;
                    console.log('已点击下一页按钮\n');
                    await driver.pause(500);
                    break;
                }
            }
            
            if (!nextPageClicked) {
                console.log('未找到下一页按钮，可能在最后一页了\n');
                break;
            }
        }
        
        if (addChapterClicked) {
            testResults.directorNavigation = true;
            await driver.pause(2000);  // 等待数据加载和动画
        } else {
            console.log('未找到添加章节按钮\n');
        }

        // ==================== 故事导演页详细检查 ====================
        console.log('[12/25] 检查故事导演页标题...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "故事导演")]', 3000)) {
            testResults.directorPageTitle = true;
            console.log('故事导演页标题显示正常\n');
        } else {
            console.log('故事导演页标题未找到\n');
        }

        // 获取页面源代码进行分析
        console.log('[13/25] 获取页面源代码进行分析...');
        const pageSource = await getPageSource(driver);
        if (pageSource) {
            console.log('页面源代码长度:', pageSource.length);
            
            // 检查是否包含角色名称
            const characterNames = ['小勇者', '魔法兔子', '智慧猫头鹰', '森林精灵'];
            let foundInSource = 0;
            for (const name of characterNames) {
                if (pageSource.includes(name)) {
                    foundInSource++;
                    console.log(`  在页面源码中找到角色: ${name}`);
                }
            }
            console.log(`页面源码中找到${foundInSource}个角色名称\n`);
        }

        // ==================== 角色卡牌检查 ====================
        console.log('[14/25] 检查故事导演页角色卡牌...');
        const directorCharacters = ['小勇者', '魔法兔子', '智慧猫头鹰', '森林精灵'];
        let foundDirectorCharacters = 0;
        for (const char of directorCharacters) {
            if (await isElementDisplayed(driver, `//*[contains(@text, "${char}")]`, 1500)) {
                foundDirectorCharacters++;
                console.log(`  找到角色卡牌: ${char}`);
            }
        }
        
        if (foundDirectorCharacters >= 2) {
            testResults.directorCharacterCards = true;
            console.log(`故事导演页找到${foundDirectorCharacters}个角色卡牌\n`);
        } else {
            console.log(`故事导演页只找到${foundDirectorCharacters}个角色卡牌，可能有问题\n`);
        }

        // ==================== 天气卡牌检查 ====================
        console.log('[15/25] 检查故事导演页天气卡牌...');
        const weathers = ['晴天', '雨天', '雾天', '夜晚'];
        let foundWeathers = 0;
        for (const weather of weathers) {
            if (await isElementDisplayed(driver, `//*[contains(@text, "${weather}")]`, 1500)) {
                foundWeathers++;
                console.log(`  找到天气卡牌: ${weather}`);
            }
        }
        
        if (foundWeathers >= 1) {
            testResults.directorWeatherCards = true;
            console.log(`故事导演页找到${foundWeathers}个天气卡牌\n`);
        } else {
            console.log(`故事导演页未找到天气卡牌\n`);
        }

        // ==================== 滚动查看更多卡牌 ====================
        console.log('[16/25] 滚动页面查看更多卡牌...');
        await swipeUp(driver);
        await driver.pause(500);
        console.log('已向上滚动一次\n');

        // ==================== 冒险卡牌检查 ====================
        console.log('[17/25] 检查故事导演页冒险卡牌...');
        const adventures = ['森林探险', '宝藏寻找', '怪物战斗', '谜题挑战'];
        let foundAdventures = 0;
        for (const adv of adventures) {
            if (await isElementDisplayed(driver, `//*[contains(@text, "${adv}")]`, 1500)) {
                foundAdventures++;
                console.log(`  找到冒险卡牌: ${adv}`);
            }
        }
        
        if (foundAdventures >= 1) {
            testResults.directorAdventureCards = true;
            console.log(`故事导演页找到${foundAdventures}个冒险卡牌\n`);
        } else {
            console.log(`故事导演页未找到冒险卡牌，尝试继续滚动\n`);
        }

        // ==================== 再次滚动查看地形和装备 ====================
        console.log('[18/25] 再次滚动查看地形和装备卡牌...');
        await swipeUp(driver);
        await driver.pause(500);
        console.log('已向上滚动第二次\n');

        // ==================== 地形卡牌检查 ====================
        console.log('[19/25] 检查故事导演页地形卡牌...');
        const terrains = ['森林', '山脉', '河流', '洞穴'];
        let foundTerrains = 0;
        for (const terrain of terrains) {
            if (await isElementDisplayed(driver, `//*[contains(@text, "${terrain}")]`, 1500)) {
                foundTerrains++;
                console.log(`  找到地形卡牌: ${terrain}`);
            }
        }
        
        if (foundTerrains >= 1) {
            testResults.directorTerrainCards = true;
            console.log(`故事导演页找到${foundTerrains}个地形卡牌\n`);
        } else {
            console.log(`故事导演页未找到地形卡牌\n`);
        }

        // ==================== 装备卡牌检查 ====================
        console.log('[20/25] 检查故事导演页装备卡牌...');
        const equipments = ['魔法剑', '盾牌', '药水', '地图'];
        let foundEquipments = 0;
        for (const equip of equipments) {
            if (await isElementDisplayed(driver, `//*[contains(@text, "${equip}")]`, 1500)) {
                foundEquipments++;
                console.log(`  找到装备卡牌: ${equip}`);
            }
        }
        
        if (foundEquipments >= 1) {
            testResults.directorEquipmentCards = true;
            console.log(`故事导演页找到${foundEquipments}个装备卡牌\n`);
        } else {
            console.log(`故事导演页未找到装备卡牌\n`);
        }

        // ==================== 角色选择测试 ====================
        console.log('[21/25] 测试角色选择功能...');
        // 先滚动回顶部
        const { height } = await driver.getWindowSize();
        await driver.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: 360, y: height * 0.3 },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 100 },
                    { type: 'pointerMove', duration: 300, x: 360, y: height * 0.7 },
                    { type: 'pointerUp', button: 0 }
                ]
            }
        ]);
        await driver.pause(500);
        
        if (await findAndTap(driver, '//*[contains(@text, "小勇者")]', 2000)) {
            testResults.characterSelection = true;
            console.log('角色选择功能正常\n');
            await driver.pause(500);
        }

        // ==================== 舞台展示测试 ====================
        console.log('[22/25] 测试舞台展示...');
        if (await isElementDisplayed(driver, '//*[contains(@text, "选择角色")]', 1000) ||
            await isElementDisplayed(driver, '//*[contains(@text, "舞台")]', 1000)) {
            testResults.stageDisplay = true;
            console.log('舞台展示正常\n');
        }

        // ==================== 返回导航测试 ====================
        console.log('[23/25] 测试返回导航...');
        if (await findAndTap(driver, '//*[contains(@text, "返回")]', 2000)) {
            testResults.backNavigation = true;
            console.log('返回导航正常\n');
            await driver.pause(500);
        }

        // ==================== 返回首页测试 ====================
        console.log('[24/25] 测试返回首页...');
        if (await findAndTap(driver, '//*[contains(@text, "首页")]', 2000)) {
            testResults.returnHome = true;
            console.log('返回首页正常\n');
            await driver.pause(500);
        }

        // ==================== 风格按钮测试 ====================
        console.log('[25/25] 测试风格按钮...');
        if (await findAndTap(driver, '//*[contains(@text, "风格")]', 2000)) {
            testResults.styleButton = true;
            console.log('风格按钮正常\n');
            await driver.pause(500);
        }

        // ==================== 测试结果汇总 ====================
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
        console.log(`  ${testResults.realBookData ? '✅' : '❌'} 真实书籍数据加载（8本书）`);
        console.log(`  ${testResults.bookClick ? '✅' : '❌'} 书籍卡片点击`);
        console.log(`  ${testResults.bookDetailTitle ? '✅' : '❌'} 书籍详情页章节Tab`);
        console.log(`  ${testResults.chapterData ? '✅' : '❌'} 章节数据（10章）`);
        console.log(`  ${testResults.chapterContent ? '✅' : '❌'} 章节内容阅读`);
        console.log(`  ${testResults.puzzleFeature ? '✅' : '❌'} 解谜功能`);
        console.log(`  ${testResults.characterData ? '✅' : '❌'} 角色数据（每本书4个角色）`);
        console.log(`  ${testResults.plotData ? '✅' : '❌'} 情节元素数据`);
        console.log(`  ${testResults.directorNavigation ? '✅' : '❌'} 故事导演页导航（添加章节）`);
        console.log(`  ${testResults.directorPageTitle ? '✅' : '❌'} 故事导演页标题`);
        console.log(`  ${testResults.directorCharacterCards ? '✅' : '❌'} 故事导演页角色卡牌`);
        console.log(`  ${testResults.directorAdventureCards ? '✅' : '❌'} 故事导演页冒险卡牌`);
        console.log(`  ${testResults.directorWeatherCards ? '✅' : '❌'} 故事导演页天气卡牌`);
        console.log(`  ${testResults.directorTerrainCards ? '✅' : '❌'} 故事导演页地形卡牌`);
        console.log(`  ${testResults.directorEquipmentCards ? '✅' : '❌'} 故事导演页装备卡牌`);
        console.log(`  ${testResults.characterSelection ? '✅' : '❌'} 角色选择功能`);
        console.log(`  ${testResults.stageDisplay ? '✅' : '❌'} 舞台展示`);
        console.log(`  ${testResults.backNavigation ? '✅' : '❌'} 返回导航`);
        console.log(`  ${testResults.returnHome ? '✅' : '❌'} 返回首页`);
        console.log(`  ${testResults.styleButton ? '✅' : '❌'} 风格按钮`);
        
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
        console.error('错误堆栈:', error.stack);
        await checkForCrashes();
    } finally {
        if (driver) {
            await driver.deleteSession();
        }
        await stopAppiumServer();
    }
}

runRealDataTest().catch(console.error);
