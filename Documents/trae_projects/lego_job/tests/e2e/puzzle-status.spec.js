import { test, expect } from '@playwright/test';

test.describe('解谜状态显示测试 - 原用户', () => {
  test('章节列表应该显示解谜状态', async ({ page }) => {
    await page.goto('/login.html');
    await page.fill('#username', '原用户');
    await page.click('button[type="submit"]');
    await page.waitForURL(/bookshelf/, { timeout: 15000 });
    
    await page.goto('/book.html?id=id_mlyydvks_nx9jupj9k');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const chapterList = page.locator('#chapterList');
    await expect(chapterList).toBeVisible();
    
    const chapterItems = await chapterList.locator('.chapter-item').all();
    console.log('章节数量:', chapterItems.length);
    
    for (let i = 0; i < Math.min(5, chapterItems.length); i++) {
      const item = chapterItems[i];
      const text = await item.textContent();
      const hasSuccess = await item.locator('span[title="解谜成功"]').count();
      const hasFail = await item.locator('span[title="解谜失败"]').count();
      const hasPuzzle = await item.locator('span:has-text("🧩")').count();
      console.log('章节', i + 1, ':', text, '| 成功:', hasSuccess, '| 失败:', hasFail, '| 未解:', hasPuzzle);
    }
    
    await page.screenshot({ path: 'test-screenshot-puzzle-status-original.png' });
  });
});
