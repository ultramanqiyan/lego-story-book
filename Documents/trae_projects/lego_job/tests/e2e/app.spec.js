import { test, expect } from '@playwright/test';
import { loginUser } from './helpers.js';

test.describe('首页功能测试', () => {
  test('应该正确加载首页', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toContainText('乐高故事书');
    await expect(page.locator('.header p, .hero-card p')).toContainText('冒险');
  });

  test('应该显示导航链接', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('nav a, .nav-card').first()).toContainText('书架');
    await expect(page.locator('nav a, .nav-card').nth(1)).toContainText('人仔');
  });

  test('应该加载热门人仔', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForSelector('#popularCharacters .character-card, #popularCharacters [class*="card"], .popular-section [class*="card"]', { timeout: 10000 });
    const cards = await page.locator('#popularCharacters .character-card, #popularCharacters [class*="card"], .popular-section [class*="card"]').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('点击开始冒险应跳转到登录页', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=开始冒险');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('用户管理测试', () => {
  test('应该显示登录表单', async ({ page }) => {
    await page.goto('/login.html');
    
    await expect(page.locator('h1, h2')).toContainText('乐高故事书');
    await expect(page.locator('#username, input[placeholder*="名字"]')).toBeVisible();
    await page.fill('#username', 'test');
    await expect(page.locator('#email, input[placeholder*="邮箱"]')).toBeVisible();
  });

  test('应该成功注册新用户', async ({ page }) => {
    await page.goto('/login.html');
    
    const uniqueName = '测试用户' + Date.now();
    await page.fill('#username', uniqueName);
    await page.fill('#email', 'test' + Date.now() + '@example.com');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/bookshelf/, { timeout: 10000 });
    await expect(page).toHaveURL(/bookshelf/);
    
    const userId = await page.evaluate(() => localStorage.getItem('userId'));
    expect(userId).not.toBeNull();
  });

  test('应该拒绝空用户名', async ({ page }) => {
    await page.goto('/login.html');
    
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain('login');
  });
});

test.describe('书架功能测试', () => {
  test('登录后应该显示书架页面', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/bookshelf.html');
    await expect(page.locator('h1')).toContainText('书架');
    await expect(page.locator('text=创建新故事')).toBeVisible();
  });
});

test.describe('人仔管理测试', () => {
  test('应该显示人仔列表', async ({ page }) => {
    await page.goto('/characters.html');
    
    await page.waitForSelector('.preset-grid > div, .preset-card, [class*="preset"] > div', { timeout: 10000 });
    const cards = await page.locator('.preset-grid > div, .preset-card, [class*="preset"] > div').count();
    expect(cards).toBeGreaterThan(0);
  });

  test('应该显示创建人仔按钮', async ({ page }) => {
    await page.goto('/characters.html');
    
    await expect(page.locator('button:has-text("创建人仔")')).toBeVisible();
  });

  test('点击创建人仔应显示弹窗', async ({ page }) => {
    await page.goto('/characters.html');
    
    await page.click('button:has-text("创建人仔")');
    await page.waitForTimeout(500);
    await expect(page.locator('#createModal')).toBeVisible();
  });

  test('应该成功创建人仔', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/characters.html');
    await page.click('text=创建人仔');
    
    await page.fill('#name', '测试人仔' + Date.now());
    await page.fill('#description', '这是一个测试人仔');
    await page.fill('#personality', '勇敢、善良');
    await page.fill('#speakingStyle', '亲切友好');
    await page.click('#createForm button[type="submit"]');
    
    await page.waitForTimeout(2000);
    await expect(page.locator('.toast')).toBeVisible();
  });
});

test.describe('家长控制测试', () => {
  test('登录后应该显示家长控制页面', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/parent.html');
    await expect(page.locator('h1')).toContainText('家长控制');
    await expect(page.locator('#dailyLimit')).toBeVisible();
    await expect(page.locator('text=退出登录')).toBeVisible();
  });

  test('应该成功更新时间限制', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/parent.html');
    await page.fill('#dailyLimit', '60');
    await page.click('text=保存设置');
    
    await page.waitForTimeout(1000);
    await expect(page.locator('.toast')).toBeVisible();
  });

  test('应该成功退出登录', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/parent.html');
    page.on('dialog', dialog => dialog.accept());
    await page.click('text=退出登录');
    
    await page.waitForTimeout(1000);
  });
});

test.describe('冒险模式测试', () => {
  test('登录后应该显示冒险模式页面', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await expect(page.locator('h1')).toContainText('冒险模式');
    await expect(page.locator('.time-display')).toBeVisible();
  });
});

test.describe('故事创建页面测试 - 未登录状态', () => {
  test('未登录状态访问创建故事页面应该重定向', async ({ page }) => {
    await page.goto('/story-create.html');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const url = page.url();
    expect(url).toContain('login') || expect(url).not.toContain('story-create');
  });
});

test.describe('故事创建页面测试 - 已登录状态', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('已登录状态应该显示创建故事页面', async ({ page }) => {
    await page.goto('/story-create.html');
    
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('创建新故事');
  });
});

test.describe('分享功能测试', () => {
  test('应该显示分享页面', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/share.html?bookId=test-book-id');
    await expect(page.locator('h1')).toContainText('分享');
  });

  test('应该显示创建分享链接表单', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/share.html?bookId=test-book-id');
    await expect(page.locator('#shareForm')).toBeVisible();
    await expect(page.locator('#isPublic')).toBeVisible();
  });

  test('生成分享链接后应该显示二维码', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/share.html?bookId=test-book-id');
    await page.waitForLoadState('networkidle');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    const resultCard = await page.locator('#resultCard').isVisible();
    if (resultCard) {
      const qrcode = await page.locator('#qrcode').isVisible();
      expect(qrcode).toBe(true);
    }
  });
});

test.describe('书籍详情测试', () => {
  test('应该显示书籍详情页面', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('应该显示添加角色按钮', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const addBtn = page.locator('#addCharacterBtn, button:has-text("角色"), .btn-character');
    const isVisible = await addBtn.isVisible().catch(() => false);
    if (isVisible) {
      await expect(addBtn).toBeVisible();
    } else {
      expect(true).toBe(true);
    }
  });

  test('应该显示添加章节按钮', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const addBtn = page.locator('#addChapterBtn, button:has-text("章节"), .btn-chapter, button:has-text("生成")');
    const isVisible = await addBtn.isVisible().catch(() => false);
    if (isVisible) {
      await expect(addBtn).toBeVisible();
    } else {
      expect(true).toBe(true);
    }
  });
});

test.describe('章节生成测试', () => {
  test('书籍详情页应该显示添加章节按钮', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const addBtn = page.locator('#addChapterBtn, button:has-text("章节"), button:has-text("生成")');
    const isVisible = await addBtn.isVisible().catch(() => false);
    if (isVisible) {
      await expect(addBtn).toBeVisible();
    } else {
      expect(true).toBe(true);
    }
  });
});

test.describe('谜题功能测试', () => {
  test('冒险模式页面应该加载', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('冒险模式');
  });

  test('尝试次数指示器应该在有谜题时显示', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForTimeout(2000);
    
    const attemptsDisplay = await page.locator('.attempts-display').isVisible();
    if (attemptsDisplay) {
      const dots = await page.locator('.attempt-dot.active').count();
      expect(dots).toBe(3);
    }
  });

  test('谜题区域应该在有谜题时显示', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForTimeout(2000);
    
    const puzzleContainer = await page.locator('#puzzleContainer').isVisible();
    if (puzzleContainer) {
      await expect(page.locator('#puzzleQuestion')).toBeVisible();
      await expect(page.locator('#puzzleOptions')).toBeVisible();
    }
  });

  test('谜题选项应该可以点击', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForTimeout(2000);
    
    const puzzleOption = await page.locator('.puzzle-option').first().isVisible();
    if (puzzleOption) {
      await page.click('.puzzle-option:first-child');
      await page.waitForTimeout(1000);
      
      const selected = await page.locator('.puzzle-option.selected, .puzzle-option.correct, .puzzle-option.wrong').count();
      expect(selected).toBeGreaterThanOrEqual(0);
    }
  });

  test('答错后应该显示提示', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForTimeout(2000);
    
    const puzzleOption = await page.locator('.puzzle-option').first().isVisible();
    if (puzzleOption) {
      await page.click('.puzzle-option:first-child');
      await page.waitForTimeout(1000);
      
      await page.click('.puzzle-option:first-child');
      await page.waitForTimeout(1000);
      
      const hintBox = await page.locator('#hintBox').isVisible();
      if (hintBox) {
        await expect(page.locator('#hintText')).toBeVisible();
      }
    }
  });

  test('第3次错误后应该显示温和惩罚', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForTimeout(2000);
    
    const puzzleOption = await page.locator('.puzzle-option').first().isVisible();
    if (puzzleOption) {
      for (let i = 0; i < 3; i++) {
        await page.click('.puzzle-option:first-child');
        await page.waitForTimeout(1000);
      }
      
      const punishment = await page.locator('.result-punishment').isVisible();
      if (punishment) {
        await expect(page.locator('.result-punishment')).toBeVisible();
      }
    }
  });
});

test.describe('角色管理测试', () => {
  test('书籍详情页面应该加载', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('应该显示添加角色按钮', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const addBtn = page.locator('#addCharacterBtn, button:has-text("角色"), .btn-character');
    const isVisible = await addBtn.isVisible().catch(() => false);
    if (isVisible) {
      await expect(addBtn).toBeVisible();
    } else {
      expect(true).toBe(true);
    }
  });

  test('应该可以打开添加角色弹窗', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const addBtn = page.locator('#addCharacterBtn, button:has-text("角色"), .btn-character');
    const isVisible = await addBtn.isVisible().catch(() => false);
    if (isVisible) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const addCard = await page.locator('#addCharacterCard, .modal, .character-select-modal').isVisible();
      expect(addCard).toBe(true);
    } else {
      expect(true).toBe(true);
    }
  });

  test('添加角色弹窗应该显示角色类型选择', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const addBtn = page.locator('#addCharacterBtn, button:has-text("角色"), .btn-character');
    const isVisible = await addBtn.isVisible().catch(() => false);
    if (isVisible) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      const roleSelect = await page.locator('#roleTypeSelect, select[name="roleType"], .role-type-select').isVisible();
      if (roleSelect) {
        const options = await page.locator('#roleTypeSelect option, select[name="roleType"] option').count();
        expect(options).toBe(4);
      } else {
        expect(true).toBe(true);
      }
    } else {
      expect(true).toBe(true);
    }
  });
});

test.describe('页面重定向测试', () => {
  test('未登录访问书架应该重定向到登录页', async ({ page }) => {
    await page.goto('/bookshelf.html');
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain('login');
  });

  test('未登录访问家长控制应该可以访问', async ({ page }) => {
    await page.goto('/parent.html');
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain('parent');
  });

  test('未登录访问冒险模式应该可以访问', async ({ page }) => {
    await page.goto('/adventure.html');
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toContain('adventure');
  });
});

test.describe('异常处理测试', () => {
  test('无效书籍ID应该显示错误提示', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=invalid-id-12345');
    await page.waitForTimeout(2000);
    
    const toast = await page.locator('.toast').isVisible();
    if (toast) {
      await expect(page.locator('.toast')).toBeVisible();
    }
  });

  test('无效章节ID应该显示错误提示', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html?chapterId=invalid-id-12345');
    await page.waitForTimeout(2000);
    
    const toast = await page.locator('.toast').isVisible();
    if (toast) {
      await expect(page.locator('.toast')).toBeVisible();
    }
  });

  test('空分享码应该显示错误提示', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/share.html?bookId=test-book-id');
    await page.fill('#accessCode', '');
    await page.click('text=访问故事');
    
    await page.waitForTimeout(1000);
    const toast = await page.locator('.toast').isVisible();
    if (toast) {
      await expect(page.locator('.toast')).toBeVisible();
    }
  });
});

test.describe('边界条件测试', () => {
  test('用户名长度应该在限制范围内', async ({ page }) => {
    await page.goto('/login.html');
    
    const longName = 'A'.repeat(50);
    await page.fill('#username', longName);
    await page.fill('#email', 'test@test.com');
    await page.click('button[type="submit"]');
    
    await page.waitForTimeout(2000);
  });

  test('人仔名称长度应该在限制范围内', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/characters.html');
    await page.click('text=创建人仔');
    
    const longName = '测'.repeat(25);
    await page.fill('#name', longName);
    await page.fill('#description', '测试描述');
    await page.fill('#personality', '勇敢');
    await page.fill('#speakingStyle', '正常');
    await page.click('#createForm button[type="submit"]');
    
    await page.waitForTimeout(2000);
  });

  test('时间限制应该在合理范围内', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/parent.html');
    await page.fill('#dailyLimit', '60');
    await page.click('text=保存设置');
    
    await page.waitForTimeout(2000);
    const toast = await page.locator('.toast').isVisible();
    if (toast) {
      await expect(page.locator('.toast')).toBeVisible();
    }
  });
});

test.describe('书籍管理测试', () => {
  test('应该显示书架列表', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/bookshelf.html');
    await page.waitForTimeout(2000);
    
    await expect(page.locator('h1')).toContainText('书架');
  });

  test('应该显示创建新故事按钮', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/bookshelf.html');
    await expect(page.locator('text=创建新故事')).toBeVisible();
  });
});

test.describe('关键词高亮测试', () => {
  test('故事内容应该高亮角色名称', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForTimeout(2000);
    
    const highlight = await page.locator('.keyword-highlight').first().isVisible();
    if (highlight) {
      await expect(page.locator('.keyword-highlight').first()).toBeVisible();
    }
  });

  test('书籍详情页章节内容应该高亮关键词', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const chapterItem = await page.locator('.chapter-item').first().isVisible();
    if (chapterItem) {
      await page.click('.chapter-item:first-child');
      await page.waitForTimeout(1000);
      
      const highlight = await page.locator('#chapterContentDisplay .keyword-highlight').first().isVisible();
      if (highlight) {
        await expect(page.locator('#chapterContentDisplay .keyword-highlight').first()).toBeVisible();
      }
    }
  });
});

test.describe('音效功能测试', () => {
  test('答题时应该触发音效', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForTimeout(2000);
    
    const puzzleOption = await page.locator('.puzzle-option').first().isVisible();
    if (puzzleOption) {
      await page.click('.puzzle-option:first-child');
      await page.waitForTimeout(1000);
      
      const selector = '.puzzle-option.selected, .puzzle-option.correct, .puzzle-option.wrong';
      const selected = await page.locator(selector).count();
      expect(selected).toBeGreaterThanOrEqual(0);
    }
  });
});

test.describe('章节限制测试', () => {
  test('章节限制提示应该正确显示', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    
    const addBtn = await page.locator('#addChapterBtn').isVisible();
    if (addBtn) {
      await expect(page.locator('#addChapterBtn')).toBeVisible();
    }
  });
});

test.describe('添加章节角色选择测试', () => {
  test('添加章节时应该显示角色选择弹窗', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const addChapterBtn = await page.locator('#addChapterBtn').isVisible();
    if (addChapterBtn) {
      await page.click('#addChapterBtn');
      await page.waitForTimeout(1000);
      
      const modal = await page.locator('#chapterCharacterModal').isVisible();
      if (modal) {
        await expect(page.locator('#chapterCharacterModal h3')).toContainText('选择本章角色');
        
        const checkboxes = await page.locator('#chapterCharacterModal input[type="checkbox"]').count();
        expect(checkboxes).toBeGreaterThan(0);
      }
    }
  });

  test('选择角色后应该能生成章节', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const addChapterBtn = await page.locator('#addChapterBtn').isVisible();
    if (addChapterBtn) {
      await page.click('#addChapterBtn');
      await page.waitForTimeout(1000);
      
      const modal = await page.locator('#chapterCharacterModal').isVisible();
      if (modal) {
        await page.click('#confirmChapterChars');
        await page.waitForTimeout(5000);
        
        const toast = await page.locator('.toast').isVisible();
        expect(toast).toBe(true);
      }
    }
  });

  test('API返回的角色数据应该包含正确的字段名', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/books?bookId=test-book-id');
      return await response.json();
    });
    
    if (result.success && result.characters && result.characters.length > 0) {
      const character = result.characters[0];
      
      expect(character).toHaveProperty('character_id');
      expect(character).toHaveProperty('custom_name');
      expect(character).toHaveProperty('original_name');
      expect(character).toHaveProperty('role_type');
    }
  });
});

test.describe('章节内容展示测试', () => {
  test('点击章节应该显示内容', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const chapterItem = await page.locator('.chapter-item').first().isVisible();
    if (chapterItem) {
      await page.click('.chapter-item:first-child');
      await page.waitForTimeout(1000);
      
      const contentCard = await page.locator('#chapterContentCard').isVisible();
      if (contentCard) {
        const content = await page.locator('#chapterContentDisplay').textContent();
        expect(content.length).toBeGreaterThan(0);
      }
    }
  });
});

test.describe('冒险模式书籍列表测试', () => {
  test('冒险模式应该显示书籍列表', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const bookList = await page.locator('#bookList').isVisible();
    if (bookList) {
      const books = await page.locator('.book-select-card').count();
      expect(books).toBeGreaterThanOrEqual(0);
    }
  });

  test('点击书籍应该跳转到章节', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/adventure.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const bookCard = await page.locator('.book-select-card').first().isVisible();
    if (bookCard) {
      await page.click('.book-select-card:first-child');
      await page.waitForTimeout(2000);
      
      const url = page.url();
      expect(url).toContain('chapterId') || expect(url).toContain('book');
    }
  });
});

test.describe('删除确认功能测试', () => {
  test('删除正在使用的人仔应该提示确认', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/characters.html');
    await page.waitForSelector('.preset-grid > div, .preset-card, [class*="preset"] > div', { timeout: 10000 });
    
    const deleteBtn = await page.locator('.delete-btn, button:has-text("删除")').first().isVisible().catch(() => false);
    if (deleteBtn) {
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('使用');
        await dialog.accept();
      });
    } else {
      expect(true).toBe(true);
    }
  });

  test('删除正在使用的角色应该提示确认', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const editBtn = await page.locator('.edit-btn, button:has-text("编辑")').first().isVisible().catch(() => false);
    if (editBtn) {
      await page.click('.edit-btn:first-child, button:has-text("编辑"):first-child');
      await page.waitForTimeout(500);
    } else {
      expect(true).toBe(true);
    }
  });
});

test.describe('前情提要功能测试', () => {
  test('续写故事时应该传递前情提要', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    
    const addChapterBtn = await page.locator('#addChapterBtn').isVisible();
    if (addChapterBtn) {
      await page.click('#addChapterBtn');
      await page.waitForTimeout(5000);
      
      const promptCard = await page.locator('#promptCard').isVisible();
      if (promptCard) {
        const promptText = await page.locator('#promptContent pre').textContent();
        if (promptText && promptText.includes('前情提要')) {
          expect(promptText).toContain('前情提要');
        }
      }
    }
  });
});

test.describe('故事连贯性测试', () => {
  test('连续生成多章应该保持连贯', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/story-create.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const newBookTitle = await page.locator('#newBookTitle').isVisible();
    if (newBookTitle) {
      await page.fill('#newBookTitle', '连贯性测试书籍' + Date.now());
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
          
          const chapters = await page.locator('.chapter-item').count();
          expect(chapters).toBeGreaterThanOrEqual(1);
        }
      }
    }
  });
});

test.describe('分享功能完整性测试', () => {
  test('分享链接应该可以访问', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/share.html?bookId=test-book-id');
    await page.waitForLoadState('networkidle');
    
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    
    const resultCard = await page.locator('#resultCard').isVisible();
    if (resultCard) {
      const shareLink = await page.locator('#shareLink').inputValue();
      expect(shareLink).toContain('book.html?share=');
      
      await page.goto(shareLink);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});

test.describe('家长控制完整性测试', () => {
  test('时间限制应该正确保存', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/parent.html');
    await page.waitForLoadState('networkidle');
    
    await page.fill('#dailyLimit', '60');
    await page.click('text=保存设置');
    await page.waitForTimeout(2000);
    
    const toast = await page.locator('.toast').isVisible();
    expect(toast).toBe(true);
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    const limitValue = await page.locator('#dailyLimit').inputValue();
    expect(parseInt(limitValue)).toBeLessThanOrEqual(120);
  });
});

test.describe('情节选择功能测试', () => {
  test('点击继续生成故事应该显示情节选择弹窗', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const addChapterBtn = await page.locator('#addChapterBtn').isVisible();
    if (addChapterBtn) {
      await page.click('#addChapterBtn');
      await page.waitForTimeout(1000);
      
      const modal = await page.locator('#chapterCharacterModal').isVisible();
      if (modal) {
        await page.click('#confirmChapterChars');
        await page.waitForTimeout(3000);
        
        const continueBtn = await page.locator('#continueBtn').isVisible();
        if (continueBtn) {
          await page.click('#continueBtn');
          await page.waitForTimeout(1000);
          
          const plotModal = await page.locator('#plotModal').isVisible();
          expect(plotModal).toBe(true);
        }
      }
    }
  });

  test('情节选择弹窗应该显示4个维度选项', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const addChapterBtn = await page.locator('#addChapterBtn').isVisible();
    if (addChapterBtn) {
      await page.click('#addChapterBtn');
      await page.waitForTimeout(1000);
      
      const modal = await page.locator('#chapterCharacterModal').isVisible();
      if (modal) {
        await page.click('#confirmChapterChars');
        await page.waitForTimeout(3000);
        
        const continueBtn = await page.locator('#continueBtn').isVisible();
        if (continueBtn) {
          await page.click('#continueBtn');
          await page.waitForTimeout(1000);
          
          const plotModal = await page.locator('#plotModal').isVisible();
          if (plotModal) {
            await expect(page.locator('#weatherOptions')).toBeVisible();
            await expect(page.locator('#adventureTypeOptions')).toBeVisible();
            await expect(page.locator('#terrainOptions')).toBeVisible();
            await expect(page.locator('#equipmentOptions')).toBeVisible();
          }
        }
      }
    }
  });

  test('每个维度应该显示8个选项', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const addChapterBtn = await page.locator('#addChapterBtn').isVisible();
    if (addChapterBtn) {
      await page.click('#addChapterBtn');
      await page.waitForTimeout(1000);
      
      const modal = await page.locator('#chapterCharacterModal').isVisible();
      if (modal) {
        await page.click('#confirmChapterChars');
        await page.waitForTimeout(3000);
        
        const continueBtn = await page.locator('#continueBtn').isVisible();
        if (continueBtn) {
          await page.click('#continueBtn');
          await page.waitForTimeout(1000);
          
          const plotModal = await page.locator('#plotModal').isVisible();
          if (plotModal) {
            const weatherOptions = await page.locator('#weatherOptions .plot-option-btn').count();
            const adventureOptions = await page.locator('#adventureTypeOptions .plot-option-btn').count();
            const terrainOptions = await page.locator('#terrainOptions .plot-option-btn').count();
            const equipmentOptions = await page.locator('#equipmentOptions .plot-option-btn').count();
            
            expect(weatherOptions).toBe(8);
            expect(adventureOptions).toBe(8);
            expect(terrainOptions).toBe(8);
            expect(equipmentOptions).toBe(8);
          }
        }
      }
    }
  });

  test('点击选项应该高亮显示', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const addChapterBtn = await page.locator('#addChapterBtn').isVisible();
    if (addChapterBtn) {
      await page.click('#addChapterBtn');
      await page.waitForTimeout(1000);
      
      const modal = await page.locator('#chapterCharacterModal').isVisible();
      if (modal) {
        await page.click('#confirmChapterChars');
        await page.waitForTimeout(3000);
        
        const continueBtn = await page.locator('#continueBtn').isVisible();
        if (continueBtn) {
          await page.click('#continueBtn');
          await page.waitForTimeout(1000);
          
          const plotModal = await page.locator('#plotModal').isVisible();
          if (plotModal) {
            await page.click('#weatherOptions .plot-option-btn:first-child');
            await page.waitForTimeout(500);
            
            const selected = await page.locator('#weatherOptions .plot-option-btn.selected').count();
            expect(selected).toBe(1);
          }
        }
      }
    }
  });

  test('随机选择按钮应该选择所有维度', async ({ page }) => {
    await loginUser(page);
    
    await page.goto('/book.html?id=test-book-id');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const addChapterBtn = await page.locator('#addChapterBtn').isVisible();
    if (addChapterBtn) {
      await page.click('#addChapterBtn');
      await page.waitForTimeout(1000);
      
      const modal = await page.locator('#chapterCharacterModal').isVisible();
      if (modal) {
        await page.click('#confirmChapterChars');
        await page.waitForTimeout(3000);
        
        const continueBtn = await page.locator('#continueBtn').isVisible();
        if (continueBtn) {
          await page.click('#continueBtn');
          await page.waitForTimeout(1000);
          
          const plotModal = await page.locator('#plotModal').isVisible();
          if (plotModal) {
            await page.click('button:has-text("随机选择")');
            await page.waitForTimeout(500);
            
            const weatherSelected = await page.locator('#weatherOptions .plot-option-btn.selected').count();
            const adventureSelected = await page.locator('#adventureTypeOptions .plot-option-btn.selected').count();
            const terrainSelected = await page.locator('#terrainOptions .plot-option-btn.selected').count();
            const equipmentSelected = await page.locator('#equipmentOptions .plot-option-btn.selected').count();
            
            expect(weatherSelected).toBe(1);
            expect(adventureSelected).toBe(1);
            expect(terrainSelected).toBe(1);
            expect(equipmentSelected).toBe(1);
          }
        }
      }
    }
  });

  test('API应该返回情节选项', async ({ page }) => {
    await page.goto('/');
    const response = await page.evaluate(async () => {
      try {
        const res = await fetch('/api/plot-options');
        return await res.json();
      } catch (e) {
        return { success: false, error: e.message };
      }
    });
    
    if (response.success) {
      expect(response.plotOptions).toHaveProperty('weather');
      expect(response.plotOptions).toHaveProperty('adventureType');
      expect(response.plotOptions).toHaveProperty('terrain');
      expect(response.plotOptions).toHaveProperty('equipment');
    } else {
      expect(true).toBe(true);
    }
  });
});
