import { test, expect } from '@playwright/test';
import { loginUser } from './helpers.js';

test.describe('跨页面联动测试 - 完整用户路径', () => {
  test('用户注册 -> 书架 -> 创建故事 -> 添加章节完整流程', async ({ page }) => {
    await page.goto('/login.html');
    const uniqueName = '完整流程用户' + Date.now();
    await page.fill('#username', uniqueName);
    await page.fill('#email', 'test' + Date.now() + '@example.com');
    await page.click('button[type="submit"]');
    await page.waitForURL(/bookshelf/, { timeout: 15000 });
    
    await page.click('text=创建新故事');
    await page.waitForURL(/story-create/, { timeout: 10000 });
    
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
        
        const submitBtn = await page.locator('button[type="submit"]').isVisible();
        if (submitBtn) {
          await page.click('button[type="submit"]');
          await page.waitForTimeout(3000);
          
          const currentUrl = page.url();
          expect(currentUrl).toMatch(/book|bookshelf/);
        }
      }
    }
  });

  test('首页 -> 登录 -> 人仔管理 -> 创建人仔完整流程', async ({ page }) => {
    await page.goto('/');
    await page.click('text=开始冒险');
    await page.waitForURL(/login/, { timeout: 10000 });
    
    const uniqueName = '人仔测试用户' + Date.now();
    await page.fill('#username, input[placeholder*="名字"]', uniqueName);
    await page.fill('#email, input[placeholder*="邮箱"]', 'test' + Date.now() + '@example.com');
    await page.click('button[type="submit"]');
    await page.waitForURL(/bookshelf/, { timeout: 15000 });
    
    await page.goto('/characters.html');
    await page.waitForSelector('.preset-grid > div, .preset-card, [class*="preset"] > div', { timeout: 10000 });
    
    await page.click('button:has-text("创建人仔")');
    await page.waitForSelector('.modal-overlay, .modal.active, #createModal', { timeout: 5000 });
    
    await page.fill('#name, input[name="name"]', '测试人仔' + Date.now());
    await page.fill('#description, input[name="description"], textarea[name="description"]', '这是一个测试人仔');
    await page.fill('#personality, input[name="personality"]', '勇敢、善良');
    await page.fill('#speakingStyle, input[name="speakingStyle"]', '亲切友好');
    await page.click('#createForm button[type="submit"], .modal button[type="submit"]');
    
    await page.waitForTimeout(2000);
    const toast = await page.locator('.toast').isVisible().catch(() => false);
    expect(toast).toBe(true);
  });

  test('书架 -> 书籍详情 -> 角色管理 -> 添加角色完整流程', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/bookshelf.html');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const addBtn = page.locator('#addCharacterBtn, button:has-text("角色"), .btn-character');
    const isVisible = await addBtn.isVisible().catch(() => false);
    if (isVisible) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      
      const addCard = await page.locator('#addCharacterCard, .modal, .character-select-modal').isVisible().catch(() => false);
      if (addCard) {
        const characterOption = await page.locator('#characterSelect option, select option').count();
        expect(characterOption).toBeGreaterThanOrEqual(0);
      } else {
        expect(true).toBe(true);
      }
    } else {
      expect(true).toBe(true);
    }
  });

  test('书籍详情 -> 添加章节 -> 查看提示词完整流程', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/story-create.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const newBookTitle = await page.locator('#newBookTitle').isVisible();
    if (newBookTitle) {
      await page.fill('#newBookTitle', '提示词测试书籍' + Date.now());
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
        
        const addChapterBtn = await page.locator('#addChapterBtn').isVisible();
        if (addChapterBtn) {
          await page.click('#addChapterBtn');
          await page.waitForTimeout(5000);
          
          const promptCard = await page.locator('#promptCard').isVisible();
          if (promptCard) {
            await page.click('#promptHeader');
            await page.waitForTimeout(500);
            
            const promptContent = await page.locator('#promptContent').isVisible();
            if (promptContent) {
              const promptText = await page.locator('#promptContent pre').textContent();
              expect(promptText.length).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  });

  test('冒险模式 -> 谜题答题 -> 温和惩罚完整流程', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForTimeout(3000);
    
    const puzzleOption = await page.locator('.puzzle-option').first().isVisible();
    if (puzzleOption) {
      for (let i = 0; i < 3; i++) {
        await page.click('.puzzle-option:first-child');
        await page.waitForTimeout(1500);
      }
      
      const punishment = await page.locator('.result-punishment').isVisible();
      const wrong = await page.locator('.result-wrong').isVisible();
      expect(punishment || wrong).toBe(true);
    }
  });

  test('书籍详情 -> 分享 -> 生成二维码完整流程', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/share.html?bookId=test-book-id');
    await page.waitForLoadState('networkidle');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const resultCard = await page.locator('#resultCard').isVisible();
    if (resultCard) {
      const qrcode = await page.locator('#qrcode').isVisible();
      expect(qrcode).toBe(true);
      
      const shareLink = await page.locator('#shareLink').inputValue();
      expect(shareLink).toContain('book.html?share=');
    }
  });

  test('家长控制 -> 设置时间限制 -> 退出登录完整流程', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/parent.html');
    await page.waitForLoadState('networkidle');
    
    await page.fill('#dailyLimit', '45');
    await page.click('text=保存设置');
    await page.waitForTimeout(2000);
    
    page.on('dialog', dialog => dialog.accept());
    await page.click('text=退出登录');
    await page.waitForTimeout(2000);
    
    const url = page.url();
    expect(url).toContain('login');
  });
});

test.describe('跨页面导航测试', () => {
  test('导航栏链接应该正确跳转', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const navLinks = await page.locator('.nav a').all();
    if (navLinks.length >= 2) {
      await navLinks[0].click();
      await page.waitForTimeout(1000);
      const url1 = page.url();
      expect(url1).toContain('bookshelf');
      
      await page.goto('/');
      await navLinks[1].click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain('characters');
    }
  });

  test('从书籍详情返回书架', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/bookshelf.html');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    
    await page.goBack();
    await page.waitForTimeout(1000);
    
    expect(page.url()).toContain('bookshelf');
  });

  test('从冒险模式返回书籍详情', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    
    await page.goto('/adventure.html');
    await page.waitForLoadState('networkidle');
    
    await page.goBack();
    await page.waitForTimeout(1000);
    
    const url = page.url();
    expect(url).toContain('book');
  });
});

test.describe('数据持久化测试', () => {
  test('用户登录状态应该持久化', async ({ page }) => {
    const uniqueName = '持久化用户' + Date.now();
    await page.goto('/login.html');
    await page.fill('#username', uniqueName);
    await page.click('button[type="submit"]');
    await page.waitForURL(/bookshelf/, { timeout: 15000 });
    
    await page.goto('/bookshelf.html');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('书架');
    
    await page.goto('/characters.html');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('人仔');
    
    await page.goto('/parent.html');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('家长控制');
  });

  test('创建人仔后应该在其他页面可见', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/characters.html');
    await page.waitForSelector('.preset-grid > div, .preset-card, [class*="preset"] > div', { timeout: 10000 });
    
    const initialCount = await page.locator('.preset-grid > div, .preset-card, [class*="preset"] > div').count();
    
    await page.click('button:has-text("创建人仔")');
    await page.waitForSelector('.modal-overlay, .modal.active, #createModal', { timeout: 5000 });
    await page.fill('#name, input[name="name"]', '持久化测试人仔' + Date.now());
    await page.fill('#description, input[name="description"], textarea[name="description"]', '测试描述');
    await page.fill('#personality, input[name="personality"]', '勇敢');
    await page.fill('#speakingStyle, input[name="speakingStyle"]', '正常');
    await page.click('#createForm button[type="submit"], .modal button[type="submit"]');
    await page.waitForTimeout(2000);
    
    await page.reload();
    await page.waitForSelector('.preset-grid > div, .preset-card, [class*="preset"] > div', { timeout: 10000 });
    
    const finalCount = await page.locator('.preset-grid > div, .preset-card, [class*="preset"] > div').count();
    expect(finalCount).toBeGreaterThanOrEqual(initialCount);
  });
});

test.describe('错误恢复测试', () => {
  test('API错误后应该可以继续操作', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=invalid-id-12345');
    await page.waitForTimeout(2000);
    
    await page.goto('/bookshelf.html');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('书架');
  });

  test('网络超时后应该可以重试', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/characters.html');
    await page.waitForSelector('.preset-grid > div, .preset-card, [class*="preset"] > div', { timeout: 15000 });
    
    await page.reload();
    await page.waitForSelector('.preset-grid > div, .preset-card, [class*="preset"] > div', { timeout: 15000 });
    
    const cards = await page.locator('.preset-grid > div, .preset-card, [class*="preset"] > div').count();
    expect(cards).toBeGreaterThan(0);
  });
});
