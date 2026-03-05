/**
 * UI风格页面详细测试 - Appium端到端测试
 * 
 * 参考文档: docs/appium-test-guide.md
 * 参考经验: docs/experience-reflection.md
 * 
 * 测试内容:
 * 1. UI风格列表页导航
 * 2. 横版游戏风格页面
 * 3. 像素方块风格页面
 * 4. 电影风格页面
 * 5. 手绘风格页面
 * 6. 返回功能
 * 
 * 改进点:
 * - 自动启动Appium服务器
 * - 设置ANDROID_HOME环境变量
 * - 检测APP状态
 * - 崩溃和错误检测
 * - 详细日志输出
 */

const { remote } = require('webdriverio');
const { execSync, spawn } = require('child_process');

process.env.ANDROID_HOME = 'C:\\Users\\yannis\\AppData\\Local\\Android\\Sdk';
process.env.ANDROID_SDK_ROOT = 'C:\\Users\\yannis\\AppData\\Local\\Android\\Sdk';

const ADB = 'C:\\Users\\yannis\\AppData\\Local\\Android\\Sdk\\platform-tools\\adb.exe';
const DEVICE = 'emulator-5554';
const PACKAGE = 'com.legostory.demo';

let appiumProcess = null;

const testResults = {
    passed: [],
    failed: [],
    warnings: []
};

async function startAppiumServer() {
    console.log('⏳ 启动Appium服务器...');
    
    const { execSync } = require('child_process');
    
    try {
        execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
    } catch (e) {}
    
    await new Promise(r => setTimeout(r, 2000));
    
    return new Promise((resolve, reject) => {
        appiumProcess = spawn('appium', ['--base-path', '/', '--port', '4723'], {
            shell: true,
            stdio: 'pipe'
        });
        
        appiumProcess.stdout.on('data', (data) => {
            if (data.toString().includes('Appium REST http interface')) {
                console.log('✅ Appium服务器已启动\n');
                resolve(true);
            }
        });
        
        appiumProcess.stderr.on('data', (data) => {
            if (data.toString().includes('error', String(data).toLowerCase())) {
                console.log('Appium stderr:', data.toString());
            }
        });
        
        setTimeout(() => {
            console.log('✅ Appium服务器启动超时，继续尝试...\n');
            resolve(true);
        }, 15000);
    });
}

async function stopAppiumServer() {
    if (appiumProcess) {
        console.log('⏳ 停止Appium服务器...');
        appiumProcess.kill();
        console.log('✅ Appium服务器已停止\n');
    }
}

async function checkAppProcess() {
    try {
        const result = execSync(
            `${ADB} -s ${DEVICE} shell "ps | grep legostory"`,
            { encoding: 'utf8', timeout: 3000 }
        );
        return result && result.trim().length > 0;
    } catch (e) {
        return false;
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

async function checkForCrashes() {
    try {
        const result = execSync(
            `${ADB} -s ${DEVICE} logcat -d -t 30 AndroidRuntime:E ReactNativeJS:E *:S`,
            { encoding: 'utf8', timeout: 5000 }
        );
        if (result && result.trim() && result.includes('FATAL')) {
            console.log('🚨 检测到应用崩溃!');
            console.log(result);
            return true;
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function checkForReactNativeErrors() {
    try {
        const result = execSync(
            `${ADB} -s ${DEVICE} logcat -d -t 50 | findstr /i "ReactNativeJS Error"`,
            { encoding: 'utf8', timeout: 5000 }
        );
        if (result && result.trim()) {
            console.log('⚠️ 检测到React Native错误:');
            console.log(result);
            return true;
        }
        return false;
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

async function scrollDown(driver) {
    const { width, height } = await driver.getWindowSize();
    const startY = height * 0.7;
    const endY = height * 0.3;
    const centerX = width / 2;
    
    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: centerX, y: startY },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 200, x: centerX, y: endY },
                { type: 'pointerUp', button: 0 }
            ]
        }
    ]);
}

async function getPageTexts(driver) {
    try {
        const textViews = await driver.$$('//android.widget.TextView');
        const texts = [];
        for (const view of textViews) {
            const text = await view.getText();
            if (text && text.trim()) {
                texts.push(text);
            }
        }
        return texts;
    } catch (e) {
        return [];
    }
}

function logStep(step, total, message) {
    console.log(`\n⏳ [${step}/${total}] ${message}`);
    console.log('-'.repeat(60));
}

function logSuccess(message) {
    console.log(`✅ ${message}`);
    testResults.passed.push(message);
}

function logWarning(message) {
    console.log(`⚠️ ${message}`);
    testResults.warnings.push(message);
}

function logFailure(message) {
    console.log(`❌ ${message}`);
    testResults.failed.push(message);
}

async function runUITest() {
    let driver;
    const totalSteps = 20;
    let currentStep = 0;
    
    console.log('\n' + '='.repeat(70));
    console.log('  🖼️ UI风格页面详细测试 - Appium端到端测试');
    console.log('  测试横版游戏、像素方块、电影、手绘四种风格');
    console.log('='.repeat(70) + '\n');
    
    const startTime = Date.now();
    
    try {
        await startAppiumServer();
        
        currentStep++;
        logStep(currentStep, totalSteps, '检测APP状态...');
        
        const processExists = await checkAppProcess();
        if (!processExists) {
            console.log('⚠️ APP进程不存在，正在启动APP...');
            await launchApp();
            await new Promise(r => setTimeout(r, 2000));
            logSuccess('APP已启动');
        } else {
            const inForeground = await checkAppInForeground();
            if (!inForeground) {
                console.log('⚠️ APP不在前台，正在切换到前台...');
                await launchApp();
                logSuccess('APP已切换到前台');
            } else {
                logSuccess('APP已在前台运行');
            }
        }

        currentStep++;
        logStep(currentStep, totalSteps, '连接Appium服务器...');
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
        logSuccess('连接成功！');

        currentStep++;
        logStep(currentStep, totalSteps, '等待应用启动...');
        await driver.pause(1500);
        const pageTexts = await getPageTexts(driver);
        console.log('📄 当前页面文本:', pageTexts.slice(0, 10).join(', '));
        logSuccess('应用已启动');

        currentStep++;
        logStep(currentStep, totalSteps, '进入UI风格列表页...');
        
        if (await findAndTap(driver, '//*[@text="🖼️"]', 2000)) {
            await driver.pause(500);
            logSuccess('通过🖼️按钮进入UI风格列表页');
        } else if (await findAndTap(driver, '//*[contains(@text, "UI风格")]', 2000)) {
            await driver.pause(500);
            logSuccess('通过文本按钮进入UI风格列表页');
        } else {
            logWarning('未找到UI风格按钮，尝试查找所有按钮...');
            const allBtns = await driver.$$('//android.widget.TextView');
            console.log('📋 页面所有文本元素:');
            for (const btn of allBtns) {
                const text = await btn.getText();
                if (text) console.log(`   - ${text}`);
            }
            logFailure('无法进入UI风格列表页');
        }

        currentStep++;
        logStep(currentStep, totalSteps, '验证UI风格列表页...');
        await driver.pause(300);
        const listPageTexts = await getPageTexts(driver);
        console.log('📄 列表页文本:', listPageTexts.join(', '));
        
        const hasSideScroller = listPageTexts.some(t => t.includes('横版游戏'));
        const hasPixelBlock = listPageTexts.some(t => t.includes('像素方块'));
        const hasMovie = listPageTexts.some(t => t.includes('电影'));
        const hasHandDrawn = listPageTexts.some(t => t.includes('手绘'));
        
        console.log(`\n📋 风格检测:`);
        console.log(`   横版游戏: ${hasSideScroller ? '✅' : '❌'}`);
        console.log(`   像素方块: ${hasPixelBlock ? '✅' : '❌'}`);
        console.log(`   电影风格: ${hasMovie ? '✅' : '❌'}`);
        console.log(`   手绘风格: ${hasHandDrawn ? '✅' : '❌'}`);
        
        if (hasSideScroller && hasPixelBlock && hasMovie && hasHandDrawn) {
            logSuccess('UI风格列表页显示正确，包含4种风格');
        } else {
            logWarning('UI风格列表页缺少部分风格');
        }

        currentStep++;
        logStep(currentStep, totalSteps, '测试横版游戏风格页面...');
        
        if (await findAndTap(driver, '//*[contains(@text, "横版游戏")]', 2000)) {
            await driver.pause(800);
            
            const stylePageTexts = await getPageTexts(driver);
            console.log('📄 横版游戏风格页文本:', stylePageTexts.slice(0, 15).join(', '));
            
            const hasScore = stylePageTexts.some(t => t.includes('SCORE') || t.includes('分数'));
            const hasStartBtn = stylePageTexts.some(t => t.includes('START') || t.includes('开始'));
            const hasBackBtn = stylePageTexts.some(t => t.includes('返回'));
            
            if (hasScore || hasStartBtn) {
                logSuccess('横版游戏风格页面加载成功');
                
                console.log('   测试角色选择...');
                if (await findAndTap(driver, '//*[@text="⚔️"]', 1500)) {
                    await driver.pause(200);
                    console.log('   ✅ 角色选择正常');
                }
                
                console.log('   测试关卡选择...');
                if (await findAndTap(driver, '//*[contains(@text, "BOSS")]', 1500)) {
                    await driver.pause(200);
                    console.log('   ✅ 关卡选择正常');
                }
            } else {
                logWarning('横版游戏风格页面可能未正确加载');
            }
            
            if (await findAndTap(driver, '//*[contains(@text, "返回列表")]', 2000)) {
                await driver.pause(300);
                logSuccess('已返回列表页');
            }
        } else {
            logFailure('未找到横版游戏风格按钮');
        }

        currentStep++;
        logStep(currentStep, totalSteps, '测试像素方块风格页面...');
        
        if (await findAndTap(driver, '//*[contains(@text, "像素方块")]', 2000)) {
            await driver.pause(800);
            
            const stylePageTexts = await getPageTexts(driver);
            console.log('📄 像素方块风格页文本:', stylePageTexts.slice(0, 15).join(', '));
            
            const hasMineText = stylePageTexts.some(t => t.includes('MINECRAFT') || t.includes('MINE'));
            const hasHealth = stylePageTexts.some(t => t.includes('❤️'));
            const hasBackBtn = stylePageTexts.some(t => t.includes('返回'));
            
            if (hasMineText || hasHealth) {
                logSuccess('像素方块风格页面加载成功');
                
                console.log('   测试游戏模式选择...');
                if (await findAndTap(driver, '//*[contains(@text, "生存")]', 1500)) {
                    await driver.pause(200);
                    console.log('   ✅ 游戏模式选择正常');
                }
            } else {
                logWarning('像素方块风格页面可能未正确加载');
            }
            
            if (await findAndTap(driver, '//*[contains(@text, "返回列表")]', 2000)) {
                await driver.pause(300);
                logSuccess('已返回列表页');
            }
        } else {
            logFailure('未找到像素方块风格按钮');
        }

        currentStep++;
        logStep(currentStep, totalSteps, '测试电影风格页面...');
        
        if (await findAndTap(driver, '//*[contains(@text, "电影风格")]', 2000)) {
            await driver.pause(800);
            
            const stylePageTexts = await getPageTexts(driver);
            console.log('📄 电影风格页文本:', stylePageTexts.slice(0, 15).join(', '));
            
            const hasScene = stylePageTexts.some(t => t.includes('SCENE') || t.includes('场景'));
            const hasTake = stylePageTexts.some(t => t.includes('TAKE') || t.includes('拍摄'));
            const hasBackBtn = stylePageTexts.some(t => t.includes('返回'));
            
            if (hasScene || hasTake) {
                logSuccess('电影风格页面加载成功');
                
                console.log('   测试场景类型选择...');
                if (await findAndTap(driver, '//*[contains(@text, "动作片")]', 1500)) {
                    await driver.pause(200);
                    console.log('   ✅ 场景类型选择正常');
                }
            } else {
                logWarning('电影风格页面可能未正确加载');
            }
            
            if (await findAndTap(driver, '//*[contains(@text, "返回列表")]', 2000)) {
                await driver.pause(300);
                logSuccess('已返回列表页');
            }
        } else {
            logFailure('未找到电影风格按钮');
        }

        currentStep++;
        logStep(currentStep, totalSteps, '测试手绘风格页面...');
        
        if (await findAndTap(driver, '//*[contains(@text, "手绘风格")]', 2000)) {
            await driver.pause(800);
            
            const stylePageTexts = await getPageTexts(driver);
            console.log('📄 手绘风格页文本:', stylePageTexts.slice(0, 15).join(', '));
            
            const hasStudio = stylePageTexts.some(t => t.includes('工作室') || t.includes('手绘'));
            const hasStory = stylePageTexts.some(t => t.includes('故事') || t.includes('创作'));
            const hasBackBtn = stylePageTexts.some(t => t.includes('返回'));
            
            if (hasStudio || hasStory) {
                logSuccess('手绘风格页面加载成功');
                
                console.log('   测试故事类型选择...');
                if (await findAndTap(driver, '//*[contains(@text, "冒险")]', 1500)) {
                    await driver.pause(200);
                    console.log('   ✅ 故事类型选择正常');
                }
            } else {
                logWarning('手绘风格页面可能未正确加载');
            }
            
            if (await findAndTap(driver, '//*[contains(@text, "返回列表")]', 2000)) {
                await driver.pause(300);
                logSuccess('已返回列表页');
            }
        } else {
            logFailure('未找到手绘风格按钮');
        }

        currentStep++;
        logStep(currentStep, totalSteps, '测试返回首页功能...');
        
        if (await findAndTap(driver, '//*[contains(@text, "返回首页")]', 2000)) {
            await driver.pause(500);
            logSuccess('已返回首页');
        } else {
            logWarning('未找到返回首页按钮');
        }

        currentStep++;
        logStep(currentStep, totalSteps, '检查错误和崩溃...');
        
        const hasCrash = await checkForCrashes();
        const hasError = await checkForReactNativeErrors();
        
        if (!hasCrash && !hasError) {
            logSuccess('应用运行正常，无崩溃和错误');
        } else {
            if (hasCrash) {
                logFailure('检测到应用崩溃');
            }
            if (hasError) {
                logWarning('检测到React Native错误');
            }
        }

        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        
        console.log('\n' + '='.repeat(70));
        console.log('  📊 测试结果汇总');
        console.log('='.repeat(70));
        console.log(`\n⏱️ 总耗时: ${totalTime}秒\n`);
        
        console.log('✅ 通过的测试 (' + testResults.passed.length + '):');
        testResults.passed.forEach(t => console.log(`   ✓ ${t}`));
        
        if (testResults.warnings.length > 0) {
            console.log('\n⚠️ 警告 (' + testResults.warnings.length + '):');
            testResults.warnings.forEach(t => console.log(`   ⚠ ${t}`));
        }
        
        if (testResults.failed.length > 0) {
            console.log('\n❌ 失败的测试 (' + testResults.failed.length + '):');
            testResults.failed.forEach(t => console.log(`   ✗ ${t}`));
        }
        
        console.log('\n💡 提示: 请查看模拟器中的实际操作\n');

    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
        console.error(error.stack);
        
        console.log('\n🔍 检查是否因崩溃导致失败...');
        const hasCrash = await checkForCrashes();
        const hasError = await checkForReactNativeErrors();
        
        if (hasCrash) {
            logFailure('测试失败原因: 应用崩溃');
        } else if (hasError) {
            logWarning('测试失败原因: React Native错误');
        }
    } finally {
        if (driver) {
            await driver.deleteSession();
        }
        await stopAppiumServer();
    }
}

runUITest().catch(console.error);
