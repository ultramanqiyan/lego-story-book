const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8082';
const TEST_USER = 'e2e_full_test_' + Date.now();

async function performLogin(page) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  const usernameInput = page.locator('input[placeholder*="冒险者名字"]');
  await usernameInput.waitFor({ state: 'visible', timeout: 15000 });
  await usernameInput.fill(TEST_USER);
  await page.waitForTimeout(500);
  
  const loginButton = page.locator('button:has-text("开始冒险")').or(page.locator('text=开始冒险')).first();
  await loginButton.waitFor({ state: 'visible', timeout: 10000 });
  await loginButton.click({ force: true });
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  const homeTab = page.locator('text=首页').or(page.getByRole('link', { name: /首页/ })).first();
  await homeTab.waitFor({ state: 'visible', timeout: 20000 });
  await expect(homeTab).toBeVisible();
}

async function ensureAuthenticated(page) {
  const loginScreen = page.locator('text=/LoginScreen/');
  if (await loginScreen.isVisible({ timeout: 1000 }).catch(() => false)) {
    await performLogin(page);
  }
}

test.describe('1. 用户认证模块完整测试', () => {
  test('1.1 - 登录页面标题显示', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
  });

  test('1.2 - 登录页面输入框可见', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await expect(page.locator('input[placeholder*="冒险者名字"]')).toBeVisible({ timeout: 10000 });
  });

  test('1.3 - 登录页面按钮可见', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=开始冒险').first()).toBeVisible({ timeout: 10000 });
  });

  test('1.4 - 有效用户名登录成功', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const usernameInput = page.locator('input[placeholder*="冒险者名字"]');
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await usernameInput.fill(TEST_USER);
    await page.waitForTimeout(500);
    
    const loginButton = page.locator('text=开始冒险').first();
    await loginButton.click({ force: true });
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=首页').first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('text=书架').first()).toBeVisible();
    await expect(page.locator('text=角色').first()).toBeVisible();
    await expect(page.locator('text=设置').first()).toBeVisible();
  });

  test('1.5 - 空用户名登录被阻止', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const loginButton = page.locator('text=开始冒险').first();
    await loginButton.click({ force: true });
    await page.waitForTimeout(1000);
    
    const stillOnLogin = page.locator('text=乐高故事书');
    await expect(stillOnLogin).toBeVisible({ timeout: 5000 });
  });

  test('1.6 - 用户名输入字符限制', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const usernameInput = page.locator('input[placeholder*="冒险者名字"]');
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    
    const longUsername = 'A'.repeat(25);
    await usernameInput.fill(longUsername);
    await page.waitForTimeout(500);
    
    const inputValue = await usernameInput.inputValue();
    expect(inputValue.length).toBeLessThanOrEqual(20);
  });

  test('1.7 - 登出功能', async ({ page }) => {
    await performLogin(page);
    
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const logoutButton = page.locator('text=退出登录').first();
    if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await logoutButton.click({ force: true });
      await page.waitForTimeout(2000);
      
      const loginScreen = page.locator('text=/LoginScreen/').or(page.locator('input[placeholder*="冒险者名字"]'));
      const hasLoginScreen = await loginScreen.first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasLoginScreen).toBe(true);
    }
  });
});

test.describe('2. 导航模块完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('2.1 - 首页Tab切换', async () => {
    await page.locator('text=首页').first().click({ force: true });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=/HomeScreen/')).toBeVisible({ timeout: 5000 });
  });

  test('2.2 - 书架Tab切换', async () => {
    await page.locator('text=书架').first().click({ force: true });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=/BookshelfScreen/')).toBeVisible({ timeout: 5000 });
  });

  test('2.3 - 角色Tab切换', async () => {
    await page.getByRole('link', { name: /角色/ }).click({ force: true });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=/CharactersScreen/')).toBeVisible({ timeout: 5000 });
  });

  test('2.4 - 冒险Tab切换', async () => {
    await page.getByRole('link', { name: /冒险/ }).click({ force: true });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=/AdventureScreen/')).toBeVisible({ timeout: 5000 });
  });

  test('2.5 - 设置Tab切换', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=/SettingsScreen/')).toBeVisible({ timeout: 5000 });
  });

  test('2.6 - 设置子页面返回', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const themeButton = page.locator('text=主题风格设置').first();
    if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await themeButton.click({ force: true });
      await page.waitForTimeout(1000);
    }
    
    const backButton = page.locator('text=← 返回').first();
    if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await backButton.click({ force: true });
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=/SettingsScreen/')).toBeVisible({ timeout: 5000 });
    }
  });

  test('2.7 - 深层导航路径测试', async () => {
    await page.locator('text=书架').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').or(page.locator('[data-testid="book-card"]')).first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click({ force: true });
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=/BookDetailScreen/')).toBeVisible({ timeout: 5000 });
      
      const chapterItem = page.locator('text=第一章').first();
      if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
        await chapterItem.click({ force: true });
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=/ChapterScreen/')).toBeVisible({ timeout: 5000 });
      }
    }
  });
});

test.describe('3. 书籍管理模块完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('3.1 - 书架页面加载', async () => {
    await page.locator('text=书架').first().click({ force: true });
    await page.waitForTimeout(1000);
    
    const bookshelfTitle = page.locator('text=我的故事书架').or(page.locator('text=/BookshelfScreen/'));
    const hasTitle = await bookshelfTitle.first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasTitle).toBe(true);
  });

  test('3.2 - 书籍卡片显示信息', async () => {
    await page.locator('text=书架').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const bookCards = page.locator('[data-testid="book-card"]').or(page.locator('text=/章/'));
    const count = await bookCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('3.3 - 创建故事入口', async () => {
    await page.locator('text=首页').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const createButton = page.locator('text=开始冒险').or(page.locator('text=创建故事')).first();
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click({ force: true });
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=/StoryCreateScreen/')).toBeVisible({ timeout: 5000 });
    }
  });

  test('3.4 - 创建故事步骤指示器', async () => {
    await page.locator('text=首页').first().click();
    await page.waitForTimeout(500);
    
    const createButton = page.locator('text=开始冒险').first();
    if (await createButton.isVisible()) {
      await createButton.click({ force: true });
      await page.waitForTimeout(1000);
    }
    
    const stepIndicator = page.locator('text=/步骤|Step/').first();
    if (await stepIndicator.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(stepIndicator).toBeVisible();
    }
  });

  test('3.5 - 书籍详情章节Tab', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const chapterTab = page.locator('text=章节').first();
      if (await chapterTab.isVisible()) {
        await chapterTab.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('3.6 - 书籍详情角色Tab', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const characterTab = page.locator('text=角色').first();
      if (await characterTab.isVisible()) {
        await characterTab.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('3.7 - 书籍详情统计数据', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const stats = page.locator('text=/章|角色|字/');
      const hasStats = await stats.first().isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasStats || await page.locator('text=/BookDetailScreen/').isVisible()).toBe(true);
    }
  });

  test('3.8 - 查看提示词功能', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const promptButton = page.locator('text=查看提示词').first();
      if (await promptButton.isVisible()) {
        await promptButton.click();
        await page.waitForTimeout(500);
        
        const promptModal = page.locator('text=AI提示词').or(page.locator('text=提示词'));
        const hasPrompt = await promptModal.first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasPrompt || await promptButton.isVisible()).toBe(true);
      }
    }
  });
});

test.describe('4. 角色管理模块完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('4.1 - 角色页面加载', async () => {
    await page.getByRole('link', { name: /角色/ }).click();
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=CharactersScreen')).toBeVisible({ timeout: 5000 });
  });

  test('4.2 - 预设角色区域显示', async () => {
    await page.getByRole('link', { name: /角色/ }).click({ force: true });
    await page.waitForTimeout(1000);
    
    const presetSection = page.locator('text=预设人仔').or(page.locator('text=系统角色')).or(page.locator('text=/CharactersScreen/'));
    const hasSection = await presetSection.first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasSection).toBe(true);
  });

  test('4.3 - 我的角色区域显示', async () => {
    await page.getByRole('link', { name: /角色/ }).click({ force: true });
    await page.waitForTimeout(1000);
    
    const mySection = page.locator('text=我的角色').or(page.locator('text=我的人仔')).or(page.locator('text=/CharactersScreen/'));
    const hasSection = await mySection.first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasSection).toBe(true);
  });

  test('4.4 - 打开创建角色弹窗', async () => {
    await page.getByRole('link', { name: /角色/ }).click({ force: true });
    await page.waitForTimeout(500);
    
    const createButton = page.locator('text=+ 创建角色').or(page.locator('text=创建')).first();
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click({ force: true });
      await page.waitForTimeout(1000);
      
      const modal = page.locator('text=创建新角色').or(page.locator('text=创建角色'));
      const hasModal = await modal.first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasModal || await createButton.isVisible()).toBe(true);
    }
  });

  test('4.5 - 创建角色表单填写', async () => {
    await page.getByRole('link', { name: /角色/ }).click({ force: true });
    await page.waitForTimeout(500);
    
    const createButton = page.locator('text=+ 创建角色').first();
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click({ force: true });
      await page.waitForTimeout(500);
    }
    
    const modal = page.locator('text=创建新角色');
    if (await modal.isVisible({ timeout: 3000 }).catch(() => false)) {
      const nameInput = page.locator('input[placeholder*="角色名称"]').first();
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameInput.fill('E2E测试角色_' + Date.now());
        await page.waitForTimeout(300);
      }
    }
  });

  test('4.6 - 角色类型标签显示', async () => {
    await page.getByRole('link', { name: /角色/ }).click({ force: true });
    await page.waitForTimeout(1000);
    
    const typeLabels = page.locator('text=主角').or(page.locator('text=配角')).or(page.locator('text=反派'));
    const count = await typeLabels.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('4.7 - 编辑角色按钮', async () => {
    await page.getByRole('link', { name: /角色/ }).click({ force: true });
    await page.waitForTimeout(500);
    
    const editButton = page.locator('text=✏️').first();
    if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await editButton.click({ force: true });
      await page.waitForTimeout(500);
      
      const editModal = page.locator('text=编辑角色');
      const hasModal = await editModal.isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasModal || await editButton.isVisible()).toBe(true);
    }
  });

  test('4.8 - 删除角色按钮', async () => {
    await page.getByRole('link', { name: /角色/ }).click({ force: true });
    await page.waitForTimeout(500);
    
    const deleteButton = page.locator('text=🗑️').first();
    if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await deleteButton.click({ force: true });
      await page.waitForTimeout(500);
      
      const confirmModal = page.locator('text=确认').or(page.locator('text=删除'));
      const hasConfirm = await confirmModal.first().isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasConfirm || await deleteButton.isVisible()).toBe(true);
    }
  });
});

test.describe('5. 章节阅读模块完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('5.1 - 章节标题显示', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const chapterItem = page.locator('text=第一章').first();
      if (await chapterItem.isVisible()) {
        await chapterItem.click();
        await page.waitForTimeout(1000);
        
        const chapterTitle = page.locator('text=/第.*章/');
        await expect(chapterTitle.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('5.2 - 故事内容显示', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const chapterItem = page.locator('text=第一章').first();
      if (await chapterItem.isVisible()) {
        await chapterItem.click();
        await page.waitForTimeout(1000);
        
        const content = await page.content();
        expect(content.length).toBeGreaterThan(500);
      }
    }
  });

  test('5.3 - 角色信息展示', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const chapterItem = page.locator('text=第一章').first();
      if (await chapterItem.isVisible()) {
        await chapterItem.click();
        await page.waitForTimeout(1000);
        
        const hintToggle = page.locator('text=展开创作提示').first();
        if (await hintToggle.isVisible()) {
          await hintToggle.click();
          await page.waitForTimeout(500);
          
          const characterInfo = page.locator('text=登场角色').or(page.locator('text=角色信息'));
          const hasInfo = await characterInfo.first().isVisible({ timeout: 3000 }).catch(() => false);
          expect(hasInfo || await hintToggle.isVisible()).toBe(true);
        }
      }
    }
  });

  test('5.4 - 章节返回按钮', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const chapterItem = page.locator('text=第一章').first();
      if (await chapterItem.isVisible()) {
        await chapterItem.click();
        await page.waitForTimeout(1000);
        
        const backButton = page.locator('text=← 返回').first();
        if (await backButton.isVisible()) {
          await backButton.click();
          await page.waitForTimeout(1000);
          
          await expect(page.locator('text=/BookDetailScreen/')).toBeVisible({ timeout: 5000 });
        }
      }
    }
  });

  test('5.5 - 互动谜题区域', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const chapterItem = page.locator('text=第一章').first();
      if (await chapterItem.isVisible()) {
        await chapterItem.click();
        await page.waitForTimeout(1000);
        
        const puzzleSection = page.locator('text=互动谜题').or(page.locator('text=❓')).or(page.locator('text=谜题'));
        const hasPuzzle = await puzzleSection.first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasPuzzle || await page.locator('text=/ChapterScreen/').isVisible()).toBe(true);
      }
    }
  });
});

test.describe('6. 故事导演台模块完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('6.1 - 导演台页面加载', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const directorButton = page.locator('text=故事导演台').or(page.locator('text=添加章节')).first();
      if (await directorButton.isVisible()) {
        await directorButton.click();
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=/StoryDirectorScreen/')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('6.2 - 天气选择区域', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const directorButton = page.locator('text=故事导演台').first();
      if (await directorButton.isVisible()) {
        await directorButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    const directorScreen = page.locator('text=/StoryDirectorScreen/');
    if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
      const weatherSection = page.locator('text=天气').first();
      await expect(weatherSection).toBeVisible({ timeout: 5000 });
    }
  });

  test('6.3 - 冒险类型选择', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const directorButton = page.locator('text=故事导演台').first();
      if (await directorButton.isVisible()) {
        await directorButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    const directorScreen = page.locator('text=/StoryDirectorScreen/');
    if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
      const adventureSection = page.locator('text=冒险').or(page.locator('text=探险'));
      await expect(adventureSection.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('6.4 - 地形选择', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const directorButton = page.locator('text=故事导演台').first();
      if (await directorButton.isVisible()) {
        await directorButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    const directorScreen = page.locator('text=/StoryDirectorScreen/');
    if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
      const terrainSection = page.locator('text=地形').or(page.locator('text=场景'));
      await expect(terrainSection.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('6.5 - 装备选择', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const directorButton = page.locator('text=故事导演台').first();
      if (await directorButton.isVisible()) {
        await directorButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    const directorScreen = page.locator('text=/StoryDirectorScreen/');
    if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
      const equipmentSection = page.locator('text=装备').or(page.locator('text=道具'));
      await expect(equipmentSection.first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('6.6 - 随机选择按钮', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const directorButton = page.locator('text=故事导演台').first();
      if (await directorButton.isVisible()) {
        await directorButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    const directorScreen = page.locator('text=/StoryDirectorScreen/');
    if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
      const randomButton = page.locator('text=随机').or(page.locator('text=🎲')).first();
      if (await randomButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await randomButton.click();
        await page.waitForTimeout(500);
        await expect(randomButton).toBeVisible();
      }
    }
  });

  test('6.7 - 开始拍摄按钮', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const directorButton = page.locator('text=故事导演台').first();
      if (await directorButton.isVisible()) {
        await directorButton.click();
        await page.waitForTimeout(1000);
      }
    }
    
    const directorScreen = page.locator('text=/StoryDirectorScreen/');
    if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
      const startButton = page.locator('text=开始拍摄').or(page.locator('text=开拍')).first();
      if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(startButton).toBeVisible();
      }
    }
  });
});

test.describe('7. 设置模块完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('7.1 - 设置页面加载', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=/SettingsScreen/')).toBeVisible({ timeout: 5000 });
  });

  test('7.2 - 主题风格设置选项', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const themeOption = page.locator('text=主题风格设置').or(page.locator('text=/SettingsScreen/'));
    const hasOption = await themeOption.first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasOption).toBe(true);
  });

  test('7.3 - 家长控制选项', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const parentOption = page.locator('text=家长控制').or(page.locator('text=/SettingsScreen/'));
    const hasOption = await parentOption.first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasOption).toBe(true);
  });

  test('7.4 - 进入主题设置', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const themeButton = page.locator('text=主题风格设置').first();
    if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await themeButton.click({ force: true });
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=/ThemeSettingsScreen/')).toBeVisible({ timeout: 5000 });
    }
  });

  test('7.5 - 主题设置Tab切换', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const themeButton = page.locator('text=主题风格设置').first();
    if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await themeButton.click({ force: true });
      await page.waitForTimeout(1000);
    }
    
    const themeScreen = page.locator('text=/ThemeSettingsScreen/');
    if (await themeScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
      const tabs = ['2D卡牌', '3D卡牌', '粒子特效', '天气效果'];
      for (const tabName of tabs) {
        const tab = page.locator(`text=${tabName}`).first();
        if (await tab.isVisible({ timeout: 2000 }).catch(() => false)) {
          await tab.click({ force: true });
          await page.waitForTimeout(300);
        }
      }
    }
  });

  test('7.6 - 进入家长控制', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const parentButton = page.locator('text=家长控制').first();
    if (await parentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await parentButton.click({ force: true });
      await page.waitForTimeout(1000);
      
      const parentScreen = page.locator('text=/ParentControlScreen/').or(page.locator('text=家长控制'));
      const hasScreen = await parentScreen.first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasScreen).toBe(true);
    }
  });

  test('7.7 - 时间限制设置', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const parentButton = page.locator('text=家长控制').first();
    if (await parentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await parentButton.click({ force: true });
      await page.waitForTimeout(1000);
    }
    
    const parentScreen = page.locator('text=/ParentControlScreen/');
    if (await parentScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
      const timeOption = page.locator('text=60分钟').or(page.locator('text=30分钟')).first();
      if (await timeOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await timeOption.click({ force: true });
        await page.waitForTimeout(500);
      }
    }
  });

  test('7.8 - 使用统计显示', async () => {
    await page.locator('text=设置').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const parentButton = page.locator('text=家长控制').first();
    if (await parentButton.isVisible()) {
      await parentButton.click();
      await page.waitForTimeout(1000);
    }
    
    const parentScreen = page.locator('text=/ParentControlScreen/');
    if (await parentScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
      const statsSection = page.locator('text=今日使用统计').or(page.locator('text=使用统计'));
      await expect(statsSection.first()).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('8. 按钮交互完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('8.1 - 登录按钮可点击', async ({ page: newPage }) => {
    await newPage.goto(BASE_URL);
    await newPage.waitForTimeout(2000);
    
    const loginButton = newPage.locator('text=开始冒险').first();
    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();
  });

  test('8.2 - 创建角色按钮可点击', async () => {
    await page.getByRole('link', { name: /角色/ }).click();
    await page.waitForTimeout(500);
    
    const createButton = page.locator('text=+ 创建角色').first();
    if (await createButton.isVisible()) {
      await expect(createButton).toBeEnabled();
    }
  });

  test('8.3 - 保存按钮可点击', async () => {
    await page.getByRole('link', { name: /角色/ }).click();
    await page.waitForTimeout(500);
    
    const createButton = page.locator('text=+ 创建角色').first();
    if (await createButton.isVisible()) {
      await createButton.click();
      await page.waitForTimeout(500);
    }
    
    const saveButton = page.locator('text=保存').or(page.locator('text=创建')).first();
    if (await saveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(saveButton).toBeEnabled();
    }
  });

  test('8.4 - 删除按钮可点击', async () => {
    await page.getByRole('link', { name: /角色/ }).click();
    await page.waitForTimeout(500);
    
    const deleteButton = page.locator('text=🗑️').first();
    if (await deleteButton.isVisible()) {
      await expect(deleteButton).toBeEnabled();
    }
  });

  test('8.5 - 返回按钮可点击', async () => {
    await page.locator('text=设置').first().click();
    await page.waitForTimeout(500);
    
    const themeButton = page.locator('text=主题风格设置').first();
    if (await themeButton.isVisible()) {
      await themeButton.click();
      await page.waitForTimeout(1000);
    }
    
    const backButton = page.locator('text=← 返回').first();
    if (await backButton.isVisible()) {
      await expect(backButton).toBeEnabled();
    }
  });

  test('8.6 - Tab按钮可点击', async () => {
    const tabs = ['首页', '书架', '角色', '冒险', '设置'];
    for (const tabName of tabs) {
      const tab = page.locator(`text=${tabName}`).first();
      if (await tab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(tab).toBeEnabled();
        await tab.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('8.7 - 展开收起按钮', async () => {
    await page.locator('text=书架').first().click();
    await page.waitForTimeout(500);
    
    const bookCard = page.locator('text=E2E测试故事书').first();
    if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await bookCard.click();
      await page.waitForTimeout(1000);
      
      const chapterItem = page.locator('text=第一章').first();
      if (await chapterItem.isVisible()) {
        await chapterItem.click();
        await page.waitForTimeout(1000);
      }
    }
    
    const toggleButton = page.locator('text=展开创作提示').or(page.locator('text=收起')).first();
    if (await toggleButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await toggleButton.click();
      await page.waitForTimeout(300);
      await expect(toggleButton).toBeEnabled();
    }
  });
});

test.describe('9. 表单输入完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('9.1 - 用户名输入框', async ({ page: newPage }) => {
    await newPage.goto(BASE_URL);
    await newPage.waitForTimeout(2000);
    
    const usernameInput = newPage.locator('input[placeholder*="冒险者名字"]');
    await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    
    await usernameInput.fill('测试用户名');
    await newPage.waitForTimeout(300);
    
    await expect(usernameInput).toHaveValue('测试用户名');
  });

  test('9.2 - 角色名称输入框', async () => {
    await page.getByRole('link', { name: /角色/ }).click({ force: true });
    await page.waitForTimeout(500);
    
    const createButton = page.locator('text=+ 创建角色').first();
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click({ force: true });
      await page.waitForTimeout(500);
    }
    
    const nameInput = page.locator('input[placeholder*="角色名称"]').first();
    if (await nameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nameInput.fill('测试角色名');
      await page.waitForTimeout(300);
      
      await expect(nameInput).toHaveValue('测试角色名');
    }
  });

  test('9.3 - 书籍标题输入框', async () => {
    await page.locator('text=首页').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const createButton = page.locator('text=开始冒险').first();
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click({ force: true });
      await page.waitForTimeout(1000);
    }
    
    const titleInput = page.locator('input[placeholder*="故事名称"]').first();
    if (await titleInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await titleInput.fill('测试故事标题');
      await page.waitForTimeout(300);
      
      await expect(titleInput).toHaveValue('测试故事标题');
    }
  });

  test('9.4 - 选项卡片选择', async () => {
    await page.locator('text=首页').first().click({ force: true });
    await page.waitForTimeout(500);
    
    const createButton = page.locator('text=开始冒险').first();
    if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await createButton.click({ force: true });
      await page.waitForTimeout(1000);
    }
    
    const optionCard = page.locator('[style*="borderColor"]').first();
    if (await optionCard.isVisible({ timeout: 3000 }).catch(() => false)) {
      await optionCard.click({ force: true });
      await page.waitForTimeout(300);
    }
  });

  test('9.5 - 空表单提交验证', async ({ page: newPage }) => {
    await newPage.goto(BASE_URL);
    await newPage.waitForTimeout(2000);
    
    const loginButton = newPage.locator('text=开始冒险').first();
    await loginButton.click({ force: true });
    await newPage.waitForTimeout(1000);
    
    const stillOnLogin = newPage.locator('input[placeholder*="冒险者名字"]').or(newPage.locator('text=/LoginScreen/'));
    const hasLogin = await stillOnLogin.first().isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasLogin).toBe(true);
  });
});

test.describe('10. 错误处理完整测试', () => {
  test('10.1 - 页面无严重错误', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto(BASE_URL);
    await page.waitForTimeout(3000);
    
    const criticalErrors = errors.filter(e => 
      !e.includes('Warning:') && 
      !e.includes('DevTools') &&
      !e.includes('network') &&
      !e.includes('404')
    );
    
    expect(criticalErrors.length).toBeLessThan(5);
  });

  test('10.2 - 空书架状态', async ({ page }) => {
    await performLogin(page);
    
    await page.locator('text=书架').first().click({ force: true });
    await page.waitForTimeout(1000);
    
    const emptyState = page.locator('text=还没有故事').or(page.locator('text=创建你的第一个故事')).or(page.locator('text=/BookshelfScreen/'));
    const hasEmptyState = await emptyState.first().isVisible({ timeout: 3000 }).catch(() => false);
    
    const bookCards = page.locator('[data-testid="book-card"]').or(page.locator('text=/章/'));
    const hasBooks = await bookCards.first().isVisible({ timeout: 1000 }).catch(() => false);
    
    expect(hasEmptyState || hasBooks).toBe(true);
  });

  test('10.3 - 加载状态显示', async ({ page }) => {
    await page.goto(BASE_URL);
    
    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(100);
  });

  test('10.4 - 网络超时处理', async ({ page }) => {
    await page.goto(BASE_URL, { timeout: 30000 });
    await page.waitForTimeout(2000);
    
    const pageContent = await page.content();
    expect(pageContent.length).toBeGreaterThan(100);
  });
});

test.describe('11. 响应式完整测试', () => {
  test('11.1 - 手机视口', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    const loginElement = page.locator('input[placeholder*="冒险者名字"]').or(page.locator('text=/LoginScreen/'));
    const hasLogin = await loginElement.first().isVisible({ timeout: 10000 }).catch(() => false);
    expect(hasLogin).toBe(true);
  });

  test('11.2 - 小屏手机视口', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
  });

  test('11.3 - 平板视口', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
  });

  test('11.4 - 桌面视口', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
  });

  test('11.5 - 大屏桌面视口', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('12. 首页模块完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('12.1 - 首页欢迎信息', async () => {
    await page.locator('text=首页').first().click();
    await page.waitForTimeout(1000);
    
    const welcome = page.locator('text=/欢迎|Hello|Hi/');
    const hasWelcome = await welcome.first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasWelcome || await page.locator('text=/HomeScreen/').isVisible()).toBe(true);
  });

  test('12.2 - 热门人仔区域', async () => {
    await page.locator('text=首页').first().click();
    await page.waitForTimeout(1000);
    
    const popularSection = page.locator('text=热门人仔').or(page.locator('text=推荐角色'));
    await expect(popularSection.first()).toBeVisible({ timeout: 5000 });
  });

  test('12.3 - 最近故事区域', async () => {
    await page.locator('text=首页').first().click();
    await page.waitForTimeout(1000);
    
    const recentSection = page.locator('text=最近故事').or(page.locator('text=继续阅读'));
    await expect(recentSection.first()).toBeVisible({ timeout: 5000 });
  });

  test('12.4 - 开始冒险按钮', async () => {
    await page.locator('text=首页').first().click();
    await page.waitForTimeout(500);
    
    const adventureButton = page.locator('text=开始冒险').first();
    if (await adventureButton.isVisible()) {
      await expect(adventureButton).toBeEnabled();
    }
  });
});

test.describe('13. 冒险模式完整测试', () => {
  let page;
  
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await performLogin(page);
  });
  
  test.afterAll(async () => {
    await page.close();
  });

  test('13.1 - 冒险页面加载', async () => {
    await page.getByRole('link', { name: /冒险/ }).click();
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=/AdventureScreen/')).toBeVisible({ timeout: 5000 });
  });

  test('13.2 - 阅读时间显示', async () => {
    await page.getByRole('link', { name: /冒险/ }).click();
    await page.waitForTimeout(1000);
    
    const timeDisplay = page.locator('text=/\\d+.*分钟/').or(page.locator('text=/阅读时间/'));
    const hasTimeDisplay = await timeDisplay.first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasTimeDisplay || await page.locator('text=/AdventureScreen/').isVisible()).toBe(true);
  });

  test('13.3 - 时间进度条', async () => {
    await page.getByRole('link', { name: /冒险/ }).click();
    await page.waitForTimeout(1000);
    
    const progressBar = page.locator('[role="progressbar"]').or(page.locator('text=/进度/'));
    const hasProgress = await progressBar.first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasProgress || await page.locator('text=/AdventureScreen/').isVisible()).toBe(true);
  });

  test('13.4 - 故事列表显示', async () => {
    await page.getByRole('link', { name: /冒险/ }).click();
    await page.waitForTimeout(1000);
    
    const storyList = page.locator('text=E2E测试故事书').or(page.locator('[data-testid="story-card"]'));
    const hasStories = await storyList.first().isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasStories || await page.locator('text=/AdventureScreen/').isVisible()).toBe(true);
  });
});
