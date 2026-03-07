const { remote } = require('webdriverio');

async function runPuzzleTest() {
  console.log('========================================');
  console.log('  答题功能专项测试');
  console.log('========================================\n');

  let driver;
  try {
    driver = await remote({
      capabilities: {
        platformName: 'Android',
        'appium:deviceName': 'emulator-5554',
        'appium:automationName': 'UiAutomator2',
        'appium:app': 'android/app/build/outputs/apk/debug/app-debug.apk',
        'appium:autoLaunch': true,
        'appium:noReset': false,
      },
      port: 4723,
      path: '/',
    });

    console.log('APP 已启动\n');
    await driver.pause(3000);

    // 获取当前页面的所有文本元素
    const getAllTexts = async () => {
      const elements = await driver.$$('//android.widget.TextView');
      const texts = [];
      for (const el of elements) {
        const text = await el.getText();
        texts.push(text);
      }
      return texts;
    };

    // 打印当前页面信息
    const printPageInfo = async (title) => {
      console.log(`\n=== ${title} ===`);
      const texts = await getAllTexts();
      console.log('当前页面文本元素:');
      texts.slice(0, 20).forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
      console.log('');
    };

    await printPageInfo('首页');

    // 点击书架
    console.log('点击书架...');
    const bookshelfBtns = await driver.$$('//*[contains(@text, "书架")]');
    if (bookshelfBtns.length > 0) {
      await bookshelfBtns[0].click();
      await driver.pause(2000);
    }

    await printPageInfo('书架页');

    // 查找测试书籍
    console.log('查找测试书籍...');
    const testBooks = await driver.$$('//*[contains(@text, "测试书籍")]');
    console.log(`找到 ${testBooks.length} 个测试书籍`);

    if (testBooks.length > 0) {
      await testBooks[0].click();
      await driver.pause(2000);
    } else {
      // 列出所有书籍
      const allTexts = await getAllTexts();
      console.log('所有文本:');
      allTexts.forEach(t => console.log(`  - ${t}`));
      
      // 尝试点击第一个用户创建的书籍
      const userBooks = await driver.$$('//*[contains(@text, "用户创建")]');
      if (userBooks.length > 0) {
        console.log('点击用户创建的书籍...');
        await userBooks[0].click();
        await driver.pause(2000);
      }
    }

    await printPageInfo('书籍详情页');

    // 确保在章节标签页
    const chaptersTab = await driver.$$('//*[contains(@text, "章节")]');
    if (chaptersTab.length > 0) {
      await chaptersTab[0].click();
      await driver.pause(1000);
      console.log('已切换到章节标签页');
    }

    // 点击第一个章节
    const chapterItems = await driver.$$('//*[contains(@text, "第1章")]');
    console.log(`找到 ${chapterItems.length} 个第1章`);

    if (chapterItems.length > 0) {
      await chapterItems[0].click();
      await driver.pause(2000);
    }

    await printPageInfo('章节内容页');

    // 查找答题选项
    console.log('查找答题选项...');
    const puzzleOptions = await driver.$$('//*[contains(@text, "A.") or contains(@text, "B.") or contains(@text, "C.") or contains(@text, "D.")]');
    console.log(`找到 ${puzzleOptions.length} 个答题选项`);

    if (puzzleOptions.length > 0) {
      console.log('\n点击第一个答题选项（正确答案）...');
      await puzzleOptions[0].click();
      await driver.pause(3000);

      await printPageInfo('答题后页面');

      // 检查是否有解锁弹窗
      const unlockModal = await driver.$$('//*[contains(@text, "解锁") or contains(@text, "获得") or contains(@text, "恭喜")]');
      if (unlockModal.length > 0) {
        console.log('✅ 检测到卡牌掉落弹窗！');
        
        // 关闭弹窗
        const closeBtn = await driver.$$('//*[contains(@text, "确定") or contains(@text, "关闭")]');
        if (closeBtn.length > 0) {
          await closeBtn[0].click();
          await driver.pause(1000);
        }
      } else {
        console.log('❌ 未检测到卡牌掉落弹窗');
      }

      // 返回书籍详情页查看卡牌
      await driver.back();
      await driver.pause(1000);

      // 切换到角色标签页
      const charactersTab = await driver.$$('//*[contains(@text, "角色")]');
      if (charactersTab.length > 0) {
        await charactersTab[0].click();
        await driver.pause(1000);
      }

      await printPageInfo('角色标签页（答题后）');

      // 切换到情节标签页
      const plotsTab = await driver.$$('//*[contains(@text, "情节")]');
      if (plotsTab.length > 0) {
        await plotsTab[0].click();
        await driver.pause(1000);
      }

      await printPageInfo('情节标签页（答题后）');
    } else {
      console.log('❌ 未找到答题选项');
      
      // 打印页面所有文本，帮助调试
      const allTexts = await getAllTexts();
      console.log('\n页面所有文本:');
      allTexts.forEach(t => console.log(`  - ${t}`));
    }

    console.log('\n========================================');
    console.log('  测试完成');
    console.log('========================================');

  } catch (error) {
    console.error('测试失败:', error);
  } finally {
    if (driver) {
      await driver.deleteSession();
    }
  }
}

runPuzzleTest();
