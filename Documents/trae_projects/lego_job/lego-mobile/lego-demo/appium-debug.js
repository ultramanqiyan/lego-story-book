const { remote } = require('webdriverio');

async function debugPageElements() {
    let driver;
    
    try {
        console.log('连接Appium...');
        driver = await remote({
            capabilities: {
                platformName: 'Android',
                'appium:deviceName': 'emulator-5554',
                'appium:automationName': 'UiAutomator2',
                'appium:appPackage': 'com.legostory.demo',
                'appium:appActivity': '.MainActivity',
                'appium:noReset': true,
                'appium:newCommandTimeout': 600,
            },
            logLevel: 'error',
            hostname: '127.0.0.1',
            port: 4723,
            path: '/',
        });

        await driver.pause(3000);
        
        console.log('\n获取页面所有文本元素:\n');
        const textViews = await driver.$$('//android.widget.TextView');
        console.log(`找到 ${textViews.length} 个文本元素:\n`);
        
        for (let i = 0; i < textViews.length; i++) {
            try {
                const text = await textViews[i].getText();
                if (text && text.trim()) {
                    console.log(`  ${i + 1}. "${text}"`);
                }
            } catch (e) {}
        }
        
        console.log('\n获取页面所有按钮元素:\n');
        const buttons = await driver.$$('//android.widget.Button');
        console.log(`找到 ${buttons.length} 个按钮元素:\n`);
        
        for (let i = 0; i < buttons.length; i++) {
            try {
                const text = await buttons[i].getText();
                if (text && text.trim()) {
                    console.log(`  ${i + 1}. "${text}"`);
                }
            } catch (e) {}
        }

        console.log('\n获取所有可点击元素:\n');
        const clickables = await driver.$$('//*[@clickable="true"]');
        console.log(`找到 ${clickables.length} 个可点击元素:\n`);
        
        for (let i = 0; i < Math.min(20, clickables.length); i++) {
            try {
                const text = await clickables[i].getText();
                const className = await clickables[i].getAttribute('className');
                console.log(`  ${i + 1}. [${className}] "${text || '(无文本)'}"`);
            } catch (e) {}
        }

    } catch (error) {
        console.error('错误:', error.message);
    } finally {
        if (driver) {
            await driver.deleteSession();
        }
    }
}

debugPageElements();
