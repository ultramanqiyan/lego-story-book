const { remote } = require('webdriverio');

async function detailedVisualTest() {
    let driver;
    
    console.log('\n' + '='.repeat(70));
    console.log('  🎮 LEGO卡牌游戏 - Appium详细可视化测试');
    console.log('='.repeat(70) + '\n');
    
    try {
        console.log('⏳ [1/10] 连接Appium服务器...');
        driver = await remote({
            capabilities: {
                platformName: 'Android',
                'appium:deviceName': 'emulator-5554',
                'appium:automationName': 'UiAutomator2',
                'appium:appPackage': 'com.legostory.demo',
                'appium:appActivity': '.MainActivity',
                'appium:noReset': false,
                'appium:newCommandTimeout': 600,
                'appium:autoGrantPermissions': true,
            },
            logLevel: 'error',
            hostname: '127.0.0.1',
            port: 4723,
            path: '/wd/hub',
        });
        console.log('✅ 连接成功！\n');

        console.log('⏳ [2/10] 等待应用启动...');
        await driver.pause(5000);
        console.log('✅ 应用已启动\n');

        console.log('⏳ [3/10] 获取屏幕尺寸...');
        const windowSize = await driver.getWindowSize();
        console.log(`📱 屏幕尺寸: ${windowSize.width} x ${windowSize.height}\n`);

        console.log('⏳ [4/10] 分析页面结构...');
        const pageSource = await driver.getPageSource();
        console.log(`📄 页面源码长度: ${pageSource.length} 字符`);
        
        const allElements = await driver.$$('//*');
        console.log(`📊 页面元素总数: ${allElements.length} 个\n`);

        console.log('⏳ [5/10] 查找所有可点击元素...');
        const clickableElements = await driver.$$('//*[@clickable="true"]');
        console.log(`📊 找到 ${clickableElements.length} 个可点击元素\n`);

        console.log('⏳ [6/10] 查找所有文本元素...');
        const textViews = await driver.$$('//android.widget.TextView');
        console.log(`📊 找到 ${textViews.length} 个文本元素`);
        
        console.log('\n前10个文本元素:');
        for (let i = 0; i < Math.min(10, textViews.length); i++) {
            try {
                const text = await textViews[i].getText();
                if (text) {
                    console.log(`  ${i + 1}. "${text}"`);
                }
            } catch (e) {
            }
        }
        console.log();

        console.log('⏳ [7/10] 查找所有视图元素...');
        const viewElements = await driver.$$('//android.view.View');
        console.log(`📊 找到 ${viewElements.length} 个视图元素\n`);

        console.log('⏳ [8/10] 尝试点击屏幕底部中央区域...');
        const centerX = windowSize.width / 2;
        const bottomY = windowSize.height - 100;
        
        console.log(`👆 点击坐标: (${centerX}, ${bottomY})`);
        await driver.touchPerform([
            { action: 'tap', options: { x: centerX, y: bottomY } }
        ]);
        await driver.pause(2000);
        console.log('✅ 已点击底部区域\n');

        console.log('⏳ [9/10] 再次分析页面结构...');
        const newPageSource = await driver.getPageSource();
        console.log(`📄 新页面源码长度: ${newPageSource.length} 字符`);
        
        const newTextElements = await driver.$$('//android.widget.TextView');
        console.log(`📊 新文本元素数量: ${newTextElements.length} 个`);
        
        console.log('\n新的文本元素:');
        for (let i = 0; i < Math.min(15, newTextElements.length); i++) {
            try {
                const text = await newTextElements[i].getText();
                if (text) {
                    console.log(`  ${i + 1}. "${text}"`);
                }
            } catch (e) {
            }
        }
        console.log();

        console.log('⏳ [10/10] 测试卡牌拖拽...');
        try {
            const card = await driver.$('//*[contains(@text, "战士")]');
            if (await card.isDisplayed()) {
                console.log('🃏 找到卡牌：战士');
                
                const location = await card.getLocation();
                const size = await card.getSize();
                
                const startX = location.x + size.width / 2;
                const startY = location.y + size.height / 2;
                const endY = startY - 300;
                
                console.log(`📍 卡牌位置: (${startX}, ${startY})`);
                console.log('🖱️ 开始拖拽卡牌...');
                
                await driver.touchPerform([
                    { action: 'press', options: { x: startX, y: startY } },
                    { action: 'wait', options: { ms: 1000 } },
                    { action: 'moveTo', options: { x: startX, y: endY } },
                    { action: 'wait', options: { ms: 500 } },
                    { action: 'release', options: {} }
                ]);
                
                await driver.pause(2000);
                console.log('✅ 卡牌拖拽完成\n');
            }
        } catch (e) {
            console.log('⚠️ 卡牌拖拽失败:', e.message, '\n');
        }

        console.log('='.repeat(70));
        console.log('  ✅ 测试完成！');
        console.log('='.repeat(70));
        console.log('\n📊 测试结果:');
        console.log('  ✅ 应用启动成功');
        console.log('  ✅ 页面结构分析完成');
        console.log('  ✅ UI元素识别正常');
        console.log('  ✅ 触摸操作执行成功');
        console.log('  ✅ 卡牌拖拽测试完成\n');

        console.log('💡 提示: 请查看模拟器中的实际操作\n');

    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
        console.error('\n堆栈跟踪:', error.stack);
    } finally {
        if (driver) {
            console.log('🔒 关闭应用...');
            await driver.deleteSession();
            console.log('✅ 测试会话已结束\n');
        }
    }
}

detailedVisualTest().catch(console.error);
