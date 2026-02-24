import { test, expect } from '@playwright/test';

async function loginUser(page) {
  await page.goto('/login.html');
  const uniqueName = '测试用户' + Date.now();
  await page.fill('#username', uniqueName);
  await page.click('button[type="submit"]');
  await page.waitForURL(/bookshelf/, { timeout: 15000 });
}

test.describe('情节选择功能测试 - 直接测试', () => {
  test('直接访问书籍页面测试情节选择', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=id_mlyydvks_nx9jupj9k');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'test-screenshot-page.png' });
    
    const addChapterBtn = page.locator('#addChapterBtn');
    await expect(addChapterBtn).toBeVisible({ timeout: 10000 });
    
    await addChapterBtn.click();
    await page.waitForTimeout(2000);
    
    const chapterModal = page.locator('#chapterCharacterModal');
    const isChapterModalVisible = await chapterModal.isVisible();
    console.log('角色选择弹窗可见:', isChapterModalVisible);
    
    await page.screenshot({ path: 'test-screenshot-after-click.png' });
    
    if (isChapterModalVisible) {
      const confirmChapterChars = page.locator('#confirmChapterChars');
      await confirmChapterChars.click();
      await page.waitForTimeout(2000);
      
      const plotModal = page.locator('#plotModal');
      const isPlotModalVisible = await plotModal.isVisible();
      console.log('情节选择弹窗可见:', isPlotModalVisible);
      
      await page.screenshot({ path: 'test-screenshot-plot-modal.png' });
      
      expect(isPlotModalVisible).toBe(true);
    } else {
      console.log('角色选择弹窗未显示');
    }
  });
});
