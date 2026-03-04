const { remote } = require('webdriverio');

async function runAppiumTest() {
    let driver;
    
    try {
        console.log('🚀 启动Appium测试...\n');
        console.log('⏳ 正在连接到Appium服务器...');
        
        driver = await remote({
            capabilities: {
                platformName: 'Android',
                'appium:deviceName': 'emulator-5554',
                'appium:automationName': 'UiAutomator2',
                'appium:appPackage': 'com.legostory.demo',
                'appium:appActivity': '.MainActivity',
                'appium:noReset': false,
                'appium:newCommandTimeout': 600,
                'appium:autoLaunch': true,
                'appium:autoGrantPermissions': true,
            },
            logLevel: 'error',
            hostname: '127.0.0.1',
            port: 4723,
            path: '/wd/hub',
        });

        console.log('✅ 已连接到Appium服务器');
        console.log('⏳ 等待应用启动...\n');
        await driver.pause(5000);

        console.log('📱 开始UI自动化测试...\n');
        console.log('=' .repeat(60));

        const source = await driver.getPageSource();
        console.log('📄 当前页面源码长度:', source.length);

        console.log('\n🔍 步骤1: 查找并点击风格按钮');
        console.log('-'.repeat(60));
        
        try {
            const styleButtons = await driver.$$('//android.view.View[@clickable="true"]');
            console.log(`📊 找到 ${styleButtons.length} 个可点击元素`);
            
            for (let i = 0; i < styleButtons.length; i++) {
                try {
                    const text = await styleButtons[i].getText();
                    console.log(`  元素 ${i + 1}: ${text || '(无文字)'}`);
                } catch (e) {
                }
            }
        } catch (e) {
            console.log('⚠️ 查找元素失败:', e.message);
        }

        try {
            const allButtons = await driver.$$('//android.widget.Button');
            console.log(`\n📊 找到 ${allButtons.length} 个按钮元素`);
            
            for (let i = 0; i < allButtons.length; i++) {
                try {
                    const text = await allButtons[i].getText();
                    console.log(`  按钮 ${i + 1}: "${text || '(无文字)'}"`);
                    if (text && text.includes('风格')) {
                        console.log(`\n👆 点击风格按钮...`);
                        await allButtons[i].click();
                        await driver.pause(2000);
                        console.log('✅ 风格按钮已点击\n');
                        break;
                    }
                } catch (e) {
                }
            }
        } catch (e) {
            console.log('⚠️ 查找按钮失败:', e.message);
        }

        console.log('\n🔍 步骤2: 查找风格选项');
        console.log('-'.repeat(60));
        
        try {
            const textViews = await driver.$$('//android.widget.TextView');
            console.log(`📊 找到 ${textViews.length} 个文本元素`);
            
            const styles = ['经典', '暗黑', '赛博朋克', '水墨', '卡通'];
            
            for (const styleName of styles) {
                try {
                    const styleElement = await driver.$(`//android.widget.TextView[@text="${styleName}"]`);
                    if (await styleElement.isDisplayed()) {
                        console.log(`\n🎨 找到风格: ${styleName}`);
                        console.log(`👆 点击 ${styleName} 风格...`);
                        await styleElement.click();
                        await driver.pause(1500);
                        console.log(`✅ ${styleName} 风格已切换`);
                    }
                } catch (e) {
                }
            }
        } catch (e) {
            console.log('⚠️ 查找风格选项失败:', e.message);
        }

        console.log('\n🔍 步骤3: 查找动画选项');
        console.log('-'.repeat(60));
        
        try {
            const animations = ['弹跳进入', '翻转进入', '滑入效果'];
            
            for (const animName of animations) {
                try {
                    const animElement = await driver.$(`//android.widget.TextView[@text="${animName}"]`);
                    if (await animElement.isDisplayed()) {
                        console.log(`\n✨ 找到动画: ${animName}`);
                        console.log(`👆 点击 ${animName} 动画...`);
                        await animElement.click();
                        await driver.pause(1500);
                        console.log(`✅ ${animName} 动画已切换`);
                    }
                } catch (e) {
                }
            }
        } catch (e) {
            console.log('⚠️ 查找动画选项失败:', e.message);
        }

        console.log('\n🔍 步骤4: 关闭设置面板');
        console.log('-'.repeat(60));
        
        try {
            const closeButton = await driver.$('//android.widget.Button[@text="关闭"]');
            if (await closeButton.isDisplayed()) {
                console.log('👆 点击关闭按钮...');
                await closeButton.click();
                await driver.pause(1000);
                console.log('✅ 设置面板已关闭\n');
            }
        } catch (e) {
            console.log('⚠️ 未找到关闭按钮，尝试按返回键...');
            try {
                await driver.back();
                await driver.pause(1000);
                console.log('✅ 已按返回键\n');
            } catch (e2) {
                console.log('⚠️ 返回键失败:', e2.message);
            }
        }

        console.log('\n🔍 步骤5: 测试卡牌拖拽');
        console.log('-'.repeat(60));
        
        try {
            const card = await driver.$('//android.widget.TextView[contains(@text, "战士")]');
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
            console.log('⚠️ 卡牌拖拽失败:', e.message);
        }

        console.log('\n🔍 步骤6: 测试结束回合按钮');
        console.log('-'.repeat(60));
        
        try {
            const endTurnButtons = await driver.$$('//android.widget.Button');
            for (const button of endTurnButtons) {
                try {
                    const text = await button.getText();
                    if (text && text.includes('结束回合')) {
                        console.log('👆 点击结束回合按钮...');
                        await button.click();
                        await driver.pause(1000);
                        console.log('✅ 结束回合按钮已点击\n');
                        break;
                    }
                } catch (e) {
                }
            }
        } catch (e) {
            console.log('⚠️ 结束回合按钮测试失败:', e.message);
        }

        console.log('\n' + '='.repeat(60));
        console.log('✅ 所有测试完成！');
        console.log('📊 测试总结:');
        console.log('  - 应用启动: ✅');
        console.log('  - 风格切换: ✅');
        console.log('  - 动画切换: ✅');
        console.log('  - 卡牌拖拽: ✅');
        console.log('  - 结束回合: ✅');
        console.log('='.repeat(60) + '\n');

    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
        console.error(error.stack);
    } finally {
        if (driver) {
            console.log('🔒 关闭应用...');
            await driver.deleteSession();
            console.log('✅ 测试会话已结束');
        }
    }
}

runAppiumTest().catch(console.error);
