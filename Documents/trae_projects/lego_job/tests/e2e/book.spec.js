import { test, expect } from '@playwright/test';
import { loginUser } from './helpers.js';

async function createBookWithCharacters(page) {
  await page.goto('/story-create.html');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const newBookTitle = await page.locator('#newBookTitle').isVisible();
  if (newBookTitle) {
    await page.fill('#newBookTitle', '测试书籍' + Date.now());
    await page.click('text=创建新书籍');
    await page.waitForTimeout(3000);
  }
  
  const plotCard = await page.locator('.plot-card').first().isVisible();
  if (plotCard) {
    await page.click('.plot-card:first-child');
    await page.waitForTimeout(2000);
    
    const characterCard = await page.locator('#characterList .character-card').first().isVisible();
    if (characterCard) {
      await page.click('#characterList .character-card:first-child');
      await page.waitForTimeout(1000);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(3000);
    }
  }
  
  const currentUrl = page.url();
  const bookIdMatch = currentUrl.match(/book\.html\?id=([^&]+)/);
  return bookIdMatch ? bookIdMatch[1] : null;
}

test.describe('情节选择功能测试', () => {
  test('点击添加章节按钮应该先显示角色选择弹窗，然后显示情节选择弹窗', async ({ page }) => {
    await loginUser(page);
    
    const bookId = await createBookWithCharacters(page);
    if (!bookId) {
      test.skip();
      return;
    }
    
    await page.goto('/book.html?id=' + bookId);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#addChapterBtn', { timeout: 10000 });
    
    const addChapterBtn = page.locator('#addChapterBtn');
    await expect(addChapterBtn).toBeVisible();
    
    await addChapterBtn.click();
    await page.waitForTimeout(1000);
    
    const chapterModal = page.locator('#chapterCharacterModal');
    await expect(chapterModal).toBeVisible();
    
    const confirmChapterChars = page.locator('#confirmChapterChars');
    await expect(confirmChapterChars).toBeVisible();
    
    await confirmChapterChars.click();
    await page.waitForTimeout(1000);
    
    const plotModal = page.locator('#plotModal');
    await expect(plotModal).toBeVisible();
    
    const weatherOptions = page.locator('#weatherOptions');
    await expect(weatherOptions).toBeVisible();
    
    const adventureTypeOptions = page.locator('#adventureTypeOptions');
    await expect(adventureTypeOptions).toBeVisible();
    
    const terrainOptions = page.locator('#terrainOptions');
    await expect(terrainOptions).toBeVisible();
    
    const equipmentOptions = page.locator('#equipmentOptions');
    await expect(equipmentOptions).toBeVisible();
  });

  test('情节选择弹窗应该显示4个维度选项', async ({ page }) => {
    await loginUser(page);
    
    const bookId = await createBookWithCharacters(page);
    if (!bookId) {
      test.skip();
      return;
    }
    
    await page.goto('/book.html?id=' + bookId);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#addChapterBtn', { timeout: 10000 });
    
    const addChapterBtn = page.locator('#addChapterBtn');
    await addChapterBtn.click();
    await page.waitForTimeout(1000);
    
    const confirmChapterChars = page.locator('#confirmChapterChars');
    await confirmChapterChars.click();
    await page.waitForTimeout(1000);
    
    const plotModal = page.locator('#plotModal');
    await expect(plotModal).toBeVisible();
    
    const weatherSection = page.locator('h4', { hasText: '天气' });
    await expect(weatherSection).toBeVisible();
    
    const adventureSection = page.locator('h4', { hasText: '冒险类型' });
    await expect(adventureSection).toBeVisible();
    
    const terrainSection = page.locator('h4', { hasText: '地形' });
    await expect(terrainSection).toBeVisible();
    
    const equipmentSection = page.locator('h4', { hasText: '装备' });
    await expect(equipmentSection).toBeVisible();
  });

  test('每个维度应该显示8个选项', async ({ page }) => {
    await loginUser(page);
    
    const bookId = await createBookWithCharacters(page);
    if (!bookId) {
      test.skip();
      return;
    }
    
    await page.goto('/book.html?id=' + bookId);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#addChapterBtn', { timeout: 10000 });
    
    const addChapterBtn = page.locator('#addChapterBtn');
    await addChapterBtn.click();
    await page.waitForTimeout(1000);
    
    const confirmChapterChars = page.locator('#confirmChapterChars');
    await confirmChapterChars.click();
    await page.waitForTimeout(1000);
    
    const plotModal = page.locator('#plotModal');
    await expect(plotModal).toBeVisible();
    
    const weatherOptions = page.locator('#weatherOptions button');
    await expect(weatherOptions).toHaveCount(8);
    
    const adventureTypeOptions = page.locator('#adventureTypeOptions button');
    await expect(adventureTypeOptions).toHaveCount(8);
    
    const terrainOptions = page.locator('#terrainOptions button');
    await expect(terrainOptions).toHaveCount(8);
    
    const equipmentOptions = page.locator('#equipmentOptions button');
    await expect(equipmentOptions).toHaveCount(8);
  });

  test('点击选项应该高亮显示', async ({ page }) => {
    await loginUser(page);
    
    const bookId = await createBookWithCharacters(page);
    if (!bookId) {
      test.skip();
      return;
    }
    
    await page.goto('/book.html?id=' + bookId);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#addChapterBtn', { timeout: 10000 });
    
    const addChapterBtn = page.locator('#addChapterBtn');
    await addChapterBtn.click();
    await page.waitForTimeout(1000);
    
    const confirmChapterChars = page.locator('#confirmChapterChars');
    await confirmChapterChars.click();
    await page.waitForTimeout(1000);
    
    const plotModal = page.locator('#plotModal');
    await expect(plotModal).toBeVisible();
    
    const firstWeatherOption = page.locator('#weatherOptions button').first();
    await firstWeatherOption.click();
    
    await page.waitForTimeout(500);
    
    const weatherOptions = page.locator('#weatherOptions button');
    const selectedCount = await weatherOptions.evaluateAll(buttons => {
      return buttons.filter(btn => {
        const style = btn.getAttribute('style') || '';
        return style.includes('lego-yellow') || style.includes('border: 2px solid');
      }).length;
    });
    
    expect(selectedCount).toBeGreaterThanOrEqual(1);
  });

  test('随机选择按钮应该选择所有维度', async ({ page }) => {
    await loginUser(page);
    
    const bookId = await createBookWithCharacters(page);
    if (!bookId) {
      test.skip();
      return;
    }
    
    await page.goto('/book.html?id=' + bookId);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#addChapterBtn', { timeout: 10000 });
    
    const addChapterBtn = page.locator('#addChapterBtn');
    await addChapterBtn.click();
    await page.waitForTimeout(1000);
    
    const confirmChapterChars = page.locator('#confirmChapterChars');
    await confirmChapterChars.click();
    await page.waitForTimeout(1000);
    
    const plotModal = page.locator('#plotModal');
    await expect(plotModal).toBeVisible();
    
    const randomPlotBtn = page.locator('#randomPlotBtn');
    await randomPlotBtn.click();
    await page.waitForTimeout(500);
    
    const selectedCount = await page.evaluate(() => {
      const buttons = document.querySelectorAll('#weatherOptions button, #adventureTypeOptions button, #terrainOptions button, #equipmentOptions button');
      let count = 0;
      buttons.forEach(btn => {
        const style = btn.getAttribute('style') || '';
        if (style.includes('lego-yellow') || style.includes('border: 2px solid')) {
          count++;
        }
      });
      return count;
    });
    
    expect(selectedCount).toBe(4);
  });

  test('取消按钮应该关闭弹窗', async ({ page }) => {
    await loginUser(page);
    
    const bookId = await createBookWithCharacters(page);
    if (!bookId) {
      test.skip();
      return;
    }
    
    await page.goto('/book.html?id=' + bookId);
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('#addChapterBtn', { timeout: 10000 });
    
    const addChapterBtn = page.locator('#addChapterBtn');
    await addChapterBtn.click();
    await page.waitForTimeout(1000);
    
    const confirmChapterChars = page.locator('#confirmChapterChars');
    await confirmChapterChars.click();
    await page.waitForTimeout(1000);
    
    const plotModal = page.locator('#plotModal');
    await expect(plotModal).toBeVisible();
    
    const cancelPlotBtn = page.locator('#cancelPlotBtn');
    await cancelPlotBtn.click();
    await page.waitForTimeout(500);
    
    await expect(plotModal).not.toBeVisible();
  });
});
