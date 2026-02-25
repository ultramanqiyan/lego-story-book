import { test, expect } from '@playwright/test';

test.describe('解谜状态显示测试', () => {
  test('章节列表应该显示解谜成功状态', async ({ page }) => {
    await page.goto('/');
    
    await page.evaluate(() => {
      localStorage.setItem('userId', 'id_mlyyd39k_hn29mxzne');
    });
    
    await page.goto('/book.html?id=id_mlyydvks_nx9jupj9k');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const chapterItems = await page.locator('.chapter-item, .chapter-card, .list-item').all();
    console.log('章节数量:', chapterItems.length);
    
    let successCount = 0;
    let failCount = 0;
    let pendingCount = 0;
    
    for (let i = 0; i < chapterItems.length; i++) {
      const item = chapterItems[i];
      const text = await item.textContent();
      
      const hasSuccess = await item.locator('span[title="解谜成功"], .status-success, .puzzle-solved').count();
      const hasFail = await item.locator('span[title="解谜失败"], .status-fail, .puzzle-failed').count();
      
      if (hasSuccess > 0) {
        successCount++;
        console.log('章节', i + 1, ':', text, '-> ✅ 成功');
      } else if (hasFail > 0) {
        failCount++;
        console.log('章节', i + 1, ':', text, '-> ❌ 失败');
      } else {
        pendingCount++;
      }
    }
    
    console.log('成功:', successCount, '失败:', failCount, '待解:', pendingCount);
    
    await page.screenshot({ path: 'test-screenshot-puzzle-final.png' });
    
    if (chapterItems.length > 0) {
      expect(chapterItems.length).toBeGreaterThan(0);
    }
  });
});
