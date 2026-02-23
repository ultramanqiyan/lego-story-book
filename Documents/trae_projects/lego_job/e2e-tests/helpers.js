async function createBookAndSelectPlot(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const newBookTitle = await page.locator('#newBookTitle').isVisible();
  if (newBookTitle) {
    await page.fill('#newBookTitle', '测试书籍' + Date.now());
    await page.click('text=创建新书籍');
    await page.waitForTimeout(3000);
  }
  
  await page.waitForSelector('.plot-card', { timeout: 15000 });
  await page.click('.plot-card:first-child');
  await page.waitForTimeout(1000);
}

async function selectCharacter(page, index = 0) {
  await page.waitForSelector('#characterList .character-card', { timeout: 15000 });
  const cards = await page.locator('#characterList .character-card').all();
  if (cards[index]) {
    await cards[index].click();
  }
  await page.waitForTimeout(1000);
}

async function loginUser(page) {
  const uniqueName = '测试用户' + Date.now();
  await page.goto('/login.html');
  await page.fill('#username', uniqueName);
  await page.click('button[type="submit"]');
  await page.waitForURL(/bookshelf/, { timeout: 15000 });
}

export { createBookAndSelectPlot, selectCharacter, loginUser };
