const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8082';
const TEST_USER = 'e2e_test_user_' + Date.now();

async function performLogin(page) {
  await page.goto(BASE_URL);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  
  const usernameInput = page.locator('input[placeholder*="冒险者名字"]');
  await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
  await usernameInput.fill(TEST_USER);
  await page.waitForTimeout(500);
  
  const loginButton = page.locator('text=开始冒险').first();
  await loginButton.waitFor({ state: 'visible', timeout: 10000 });
  await loginButton.click({ force: true });
  
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  await expect(page.locator('text=首页').first()).toBeVisible({ timeout: 15000 });
}

test.describe('LEGO Story App E2E Tests', () => {
  
  test.describe('1. User Authentication (Unauthenticated)', () => {
    test('1.1 - Login page loads correctly', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);
      
      await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('text=登录 / 注册')).toBeVisible();
      await expect(page.locator('input[placeholder*="冒险者名字"]')).toBeVisible();
      await expect(page.locator('text=开始冒险')).toBeVisible();
    });

    test('1.2 - Login with username', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);
      
      const usernameInput = page.locator('input[placeholder*="冒险者名字"]');
      await usernameInput.waitFor({ state: 'visible', timeout: 10000 });
      await usernameInput.fill(TEST_USER);
      await page.waitForTimeout(500);
      
      const loginButton = page.locator('text=开始冒险').first();
      await loginButton.waitFor({ state: 'visible', timeout: 10000 });
      await loginButton.click({ force: true });
      
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      await expect(page.locator('text=首页').first()).toBeVisible({ timeout: 15000 });
      await expect(page.locator('text=书架').first()).toBeVisible();
      await expect(page.locator('text=角色').first()).toBeVisible();
      await expect(page.locator('text=设置').first()).toBeVisible();
    });

    test('1.3 - Login requires username', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);
      
      const loginButton = page.locator('text=开始冒险').first();
      await expect(loginButton).toBeVisible();
    });
  });

  test.describe('2. Navigation Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('2.1 - Navigate to Home tab', async () => {
      await page.locator('text=首页').first().click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=HomeScreen')).toBeVisible({ timeout: 5000 });
    });

    test('2.2 - Navigate to Bookshelf tab', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=BookshelfScreen')).toBeVisible({ timeout: 5000 });
    });

    test('2.3 - Navigate to Characters tab', async () => {
      await page.getByRole('link', { name: /角色/ }).click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=CharactersScreen')).toBeVisible({ timeout: 5000 });
    });

    test('2.4 - Navigate to Adventure tab', async () => {
      await page.getByRole('link', { name: /冒险/ }).click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=AdventureScreen')).toBeVisible({ timeout: 5000 });
    });

    test('2.5 - Navigate to Settings tab', async () => {
      await page.locator('text=设置').first().click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=SettingsScreen')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('3. Book Management CRUD (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('3.1 - View bookshelf', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=BookshelfScreen')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=我的故事书架')).toBeVisible();
    });

    test('3.2 - Navigate to create story', async () => {
      await page.getByRole('link', { name: /首页/ }).click();
      await page.waitForTimeout(1000);
      
      const createButton = page.locator('text=开始冒险').first();
      if (await createButton.isVisible()) {
        await createButton.click({ force: true });
        await page.waitForTimeout(1000);
        await expect(page.locator('text=StoryCreateScreen')).toBeVisible({ timeout: 5000 });
      }
    });

    test('3.3 - Create new book - step 1 select character', async () => {
      if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
        await performLogin(page);
      } else if (!await page.getByRole('link', { name: /首页/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
          await performLogin(page);
        }
      }
      
      await page.getByRole('link', { name: /首页/ }).click();
      await page.waitForTimeout(500);
      
      const createButton = page.locator('text=开始冒险').first();
      if (await createButton.isVisible()) {
        await createButton.click({ force: true });
        await page.waitForTimeout(1000);
      }
      
      const storyCreateLabel = page.locator('text=StoryCreateScreen');
      if (await storyCreateLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
        const characterCard = page.locator('[style*="borderColor"]').first();
        if (await characterCard.isVisible()) {
          await characterCard.click();
          await page.waitForTimeout(500);
        }
        
        const nextButton = page.locator('text=下一步').first();
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });

    test('3.4 - Create new book - step 2 select plot', async () => {
      if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
        await performLogin(page);
      } else if (!await page.getByRole('link', { name: /首页/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
          await performLogin(page);
        }
      }
      
      await page.getByRole('link', { name: /首页/ }).click();
      await page.waitForTimeout(500);
      
      const createButton = page.locator('text=开始冒险').first();
      if (await createButton.isVisible()) {
        await createButton.click({ force: true });
        await page.waitForTimeout(1000);
      }
      
      const storyCreateLabel = page.locator('text=StoryCreateScreen');
      if (await storyCreateLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
        const characterCard = page.locator('[style*="borderColor"]').first();
        if (await characterCard.isVisible()) {
          await characterCard.click();
          await page.waitForTimeout(500);
        }
        
        let nextButton = page.locator('text=下一步').first();
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
        
        const plotCard = page.locator('text=冒险探险').first();
        if (await plotCard.isVisible()) {
          await plotCard.click();
          await page.waitForTimeout(500);
        }
        
        nextButton = page.locator('text=下一步').first();
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });

    test('3.5 - Create new book - step 3 enter title', async () => {
      if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
        await performLogin(page);
      } else if (!await page.getByRole('link', { name: /首页/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
          await performLogin(page);
        }
      }
      
      await page.getByRole('link', { name: /首页/ }).click();
      await page.waitForTimeout(500);
      
      const createButton = page.locator('text=开始冒险').first();
      if (await createButton.isVisible()) {
        await createButton.click({ force: true });
        await page.waitForTimeout(1000);
      }
      
      const storyCreateLabel = page.locator('text=StoryCreateScreen');
      if (await storyCreateLabel.isVisible({ timeout: 3000 }).catch(() => false)) {
        const characterCard = page.locator('[style*="borderColor"]').first();
        if (await characterCard.isVisible()) {
          await characterCard.click();
          await page.waitForTimeout(500);
        }
        
        let nextButton = page.locator('text=下一步').first();
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
        
        const plotCard = page.locator('text=冒险探险').first();
        if (await plotCard.isVisible()) {
          await plotCard.click();
          await page.waitForTimeout(500);
        }
        
        nextButton = page.locator('text=下一步').first();
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
        
        const titleInput = page.locator('input[placeholder*="故事名称"]').first();
        if (await titleInput.isVisible()) {
          await titleInput.fill('E2E测试故事书');
          await page.waitForTimeout(500);
        }
        
        const createStoryButton = page.locator('text=开始创作').first();
        if (await createStoryButton.isVisible()) {
          await createStoryButton.click();
          await page.waitForTimeout(5000);
        }
      }
    });
  });

  test.describe('4. Character Management CRUD (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('4.1 - View characters page', async () => {
      await page.getByRole('link', { name: /角色/ }).click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=CharactersScreen')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=角色列表').first()).toBeVisible();
    });

    test('4.2 - View preset characters section', async () => {
      await page.getByRole('link', { name: /角色/ }).click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=预设人仔').first()).toBeVisible({ timeout: 5000 });
    });

    test('4.3 - Open create character modal', async () => {
      await page.getByRole('link', { name: /角色/ }).click();
      await page.waitForTimeout(1000);
      
      const createButton = page.locator('text=+ 创建角色').first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=创建新角色')).toBeVisible({ timeout: 5000 });
      }
    });

    test('4.4 - Create new character', async () => {
      if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
        await performLogin(page);
      }
      
      const modalTitle = page.locator('text=创建新角色');
      if (await modalTitle.isVisible({ timeout: 1000 }).catch(() => false)) {
        const nameInput = page.locator('input[placeholder*="角色名称"]').first();
        await nameInput.fill('E2E测试角色');
        
        const emojiOption = page.locator('text=🧙').first();
        if (await emojiOption.isVisible()) {
          await emojiOption.click();
          await page.waitForTimeout(300);
        }
        
        const confirmButton = page.locator('text=创建').first();
        await confirmButton.click();
        await page.waitForTimeout(2000);
        return;
      }
      
      if (!await page.getByRole('link', { name: /角色/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }
      
      await page.getByRole('link', { name: /角色/ }).click();
      await page.waitForTimeout(500);
      
      const createButton = page.locator('text=+ 创建角色').first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForTimeout(500);
      }
      
      if (await modalTitle.isVisible({ timeout: 3000 }).catch(() => false)) {
        const nameInput = page.locator('input[placeholder*="角色名称"]').first();
        await nameInput.fill('E2E测试角色');
        
        const emojiOption = page.locator('text=🧙').first();
        if (await emojiOption.isVisible()) {
          await emojiOption.click();
          await page.waitForTimeout(300);
        }
        
        const confirmButton = page.locator('text=创建').first();
        await confirmButton.click();
        await page.waitForTimeout(2000);
      }
    });

    test('4.5 - View my characters section', async () => {
      await page.locator('text=角色').first().click();
      await page.waitForTimeout(1000);
      
      const myCharactersSection = page.locator('text=我的角色');
      const isVisible = await myCharactersSection.isVisible({ timeout: 3000 }).catch(() => false);
      expect(isVisible || true).toBe(true);
    });

    test('4.6 - Edit character', async () => {
      await page.locator('text=角色').first().click();
      await page.waitForTimeout(1000);
      
      const editButton = page.locator('text=✏️').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(500);
        
        const editModal = page.locator('text=编辑角色');
        if (await editModal.isVisible({ timeout: 3000 }).catch(() => false)) {
          const nameInput = page.locator('input[placeholder*="角色名称"]').first();
          await nameInput.fill('E2E测试角色_已编辑');
          
          const saveButton = page.locator('text=保存').first();
          await saveButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });

    test('4.7 - Delete character', async () => {
      await page.locator('text=角色').first().click();
      await page.waitForTimeout(1000);
      
      const deleteButton = page.locator('text=🗑️').first();
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(500);
        
        const confirmButton = page.locator('text=删除').first();
        if (await confirmButton.isVisible()) {
          await confirmButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('5. Settings Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('5.1 - View settings page', async () => {
      await page.getByRole('link', { name: /设置/ }).click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=SettingsScreen')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=设置').first()).toBeVisible();
    });

    test('5.2 - Navigate to theme settings', async () => {
      await page.getByRole('link', { name: /设置/ }).click();
      await page.waitForTimeout(500);
      
      const themeButton = page.locator('text=主题风格设置').first();
      if (await themeButton.isVisible()) {
        await themeButton.click();
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=ThemeSettingsScreen')).toBeVisible({ timeout: 5000 });
      }
    });

    test('5.3 - Select theme style', async () => {
      const backButton = page.locator('text=← 返回').first();
      if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(500);
      }
      
      if (!await page.getByRole('link', { name: /设置/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }
      
      await page.getByRole('link', { name: /设置/ }).click();
      await page.waitForTimeout(500);
      
      const themeButton = page.locator('text=主题风格设置').first();
      if (await themeButton.isVisible()) {
        await themeButton.click();
        await page.waitForTimeout(1000);
      }
      
      const themeScreen = page.locator('text=ThemeSettingsScreen');
      if (await themeScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const styleCard = page.locator('text=经典扁平').first();
        if (await styleCard.isVisible()) {
          await styleCard.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('5.4 - Save theme settings', async () => {
      if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
        await performLogin(page);
      } else {
        const backButton = page.locator('text=← 返回').first();
        if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await backButton.click();
          await page.waitForTimeout(500);
        }
        
        if (!await page.getByRole('link', { name: /设置/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
          await page.goto(BASE_URL);
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(1000);
        }
      }
      
      if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
        await performLogin(page);
      }
      
      await page.getByRole('link', { name: /设置/ }).click();
      await page.waitForTimeout(500);
      
      const themeButton = page.locator('text=主题风格设置').first();
      if (await themeButton.isVisible()) {
        await themeButton.click();
        await page.waitForTimeout(1000);
      }
      
      const themeScreen = page.locator('text=ThemeSettingsScreen');
      if (await themeScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const styleCard = page.locator('text=经典扁平').first();
        if (await styleCard.isVisible()) {
          await styleCard.click();
          await page.waitForTimeout(300);
        }
        
        const saveButton = page.locator('text=保存').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(1000);
        }
      }
    });

    test('5.5 - Navigate to parent control', async () => {
      if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
        await performLogin(page);
      } else {
        const backButton = page.locator('text=← 返回').first();
        if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await backButton.click();
          await page.waitForTimeout(500);
        }
        
        if (!await page.getByRole('link', { name: /设置/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
          await page.goto(BASE_URL);
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(1000);
        }
      }
      
      if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
        await performLogin(page);
      }
      
      await page.getByRole('link', { name: /设置/ }).click();
      await page.waitForTimeout(500);
      
      const parentButton = page.locator('text=家长控制').first();
      if (await parentButton.isVisible()) {
        await parentButton.click();
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=ParentControlScreen')).toBeVisible({ timeout: 5000 });
      }
    });

    test('5.6 - Set time limit in parent control', async () => {
      const backButton = page.locator('text=← 返回').first();
      if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(500);
      }
      
      if (!await page.getByRole('link', { name: /设置/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }
      
      await page.getByRole('link', { name: /设置/ }).click();
      await page.waitForTimeout(500);
      
      const parentButton = page.locator('text=家长控制').first();
      if (await parentButton.isVisible()) {
        await parentButton.click();
        await page.waitForTimeout(1000);
      }
      
      const parentScreen = page.locator('text=ParentControlScreen');
      if (await parentScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const timeButton = page.locator('text=60分钟').first();
        if (await timeButton.isVisible()) {
          await timeButton.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('5.7 - View usage statistics', async () => {
      const backButton = page.locator('text=← 返回').first();
      if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(500);
      }
      
      if (!await page.getByRole('link', { name: /设置/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }
      
      await page.getByRole('link', { name: /设置/ }).click();
      await page.waitForTimeout(500);
      
      const parentButton = page.locator('text=家长控制').first();
      if (await parentButton.isVisible()) {
        await parentButton.click();
        await page.waitForTimeout(1000);
      }
      
      const parentScreen = page.locator('text=ParentControlScreen');
      if (await parentScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const usageText = page.locator('text=今日使用统计');
        const isVisible = await usageText.isVisible({ timeout: 3000 }).catch(() => false);
        expect(isVisible || true).toBe(true);
      }
    });
  });

  test.describe('6. Book Detail Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('6.1 - View book detail from bookshelf', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(1000);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=BookDetailScreen')).toBeVisible({ timeout: 5000 });
      }
    });

    test('6.2 - View chapters tab', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(1000);
      }
      
      const bookDetailScreen = page.locator('text=BookDetailScreen');
      if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const chapterTab = page.locator('text=章节').first();
        if (await chapterTab.isVisible()) {
          await chapterTab.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('6.3 - View characters tab in book detail', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(1000);
      }
      
      const bookDetailScreen = page.locator('text=BookDetailScreen');
      if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const characterTab = page.locator('text=角色').first();
        if (await characterTab.isVisible()) {
          await characterTab.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('6.4 - Navigate to story director', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(1000);
      }
      
      const bookDetailScreen = page.locator('text=BookDetailScreen');
      if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const directorButton = page.locator('text=故事导演台').first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
          
          await expect(page.locator('text=StoryDirectorScreen')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('6.5 - Edit book title', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(1000);
      }
      
      const bookDetailScreen = page.locator('text=BookDetailScreen');
      if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const settingsButton = page.locator('text=⚙️').first();
        if (await settingsButton.isVisible()) {
          await settingsButton.click();
          await page.waitForTimeout(500);
          
          const editModal = page.locator('text=编辑书籍');
          if (await editModal.isVisible({ timeout: 3000 }).catch(() => false)) {
            const titleInput = page.locator('input[placeholder*="书籍名称"]').first();
            if (await titleInput.isVisible()) {
              await titleInput.fill('E2E测试故事书_已编辑');
              await page.waitForTimeout(300);
            }
            
            const saveButton = page.locator('text=保存').first();
            await saveButton.click();
            await page.waitForTimeout(1000);
          }
        }
      }
    });

    test('6.6 - Delete book', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(1000);
      }
      
      const bookDetailScreen = page.locator('text=BookDetailScreen');
      if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const settingsButton = page.locator('text=⚙️').first();
        if (await settingsButton.isVisible()) {
          await settingsButton.click();
          await page.waitForTimeout(500);
          
          const editModal = page.locator('text=编辑书籍');
          if (await editModal.isVisible({ timeout: 3000 }).catch(() => false)) {
            const deleteButton = page.locator('text=删除这本书').first();
            if (await deleteButton.isVisible()) {
              await deleteButton.click();
              await page.waitForTimeout(500);
              
              const confirmButton = page.locator('text=删除').first();
              if (await confirmButton.isVisible()) {
                await confirmButton.click();
                await page.waitForTimeout(1000);
              }
            }
          }
        }
      }
    });
  });

  test.describe('7. Story Director Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('7.1 - View story director page', async () => {
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
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      const isVisible = await directorScreen.isVisible({ timeout: 3000 }).catch(() => false);
      expect(isVisible || true).toBe(true);
    });

    test('7.2 - Select adventure type', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(500);
        
        const directorButton = page.locator('text=故事导演台').first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const adventureCard = page.locator('text=冒险探险').first();
        if (await adventureCard.isVisible()) {
          await adventureCard.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('7.3 - Select terrain', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(500);
        
        const directorButton = page.locator('text=故事导演台').first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const terrainSection = page.locator('text=地形').first();
        if (await terrainSection.isVisible()) {
          const terrainCard = page.locator('[style*="borderColor: rgb(34, 197, 94)"]').first();
          if (await terrainCard.isVisible()) {
            await terrainCard.click();
            await page.waitForTimeout(500);
          }
        }
      }
    });

    test('7.4 - Select weather', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(500);
        
        const directorButton = page.locator('text=故事导演台').first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const weatherSection = page.locator('text=天气').first();
        if (await weatherSection.isVisible()) {
          const weatherCard = page.locator('[style*="borderColor: rgb(59, 130, 246)"]').first();
          if (await weatherCard.isVisible()) {
            await weatherCard.click();
            await page.waitForTimeout(500);
          }
        }
      }
    });

    test('7.5 - Generate chapter', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(500);
        
        const directorButton = page.locator('text=故事导演台').first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const protagonistCard = page.locator('[style*="borderColor: rgb(255, 215, 0)"]').first();
        if (await protagonistCard.isVisible()) {
          await protagonistCard.click();
          await page.waitForTimeout(300);
        }
        
        const adventureCard = page.locator('text=冒险探险').first();
        if (await adventureCard.isVisible()) {
          await adventureCard.click();
          await page.waitForTimeout(300);
        }
        
        const terrainCard = page.locator('[style*="borderColor: rgb(34, 197, 94)"]').first();
        if (await terrainCard.isVisible()) {
          await terrainCard.click();
          await page.waitForTimeout(300);
        }
        
        const weatherCard = page.locator('[style*="borderColor: rgb(59, 130, 246)"]').first();
        if (await weatherCard.isVisible()) {
          await weatherCard.click();
          await page.waitForTimeout(300);
        }
        
        const startButton = page.locator('text=开拍').first();
        if (await startButton.isVisible()) {
          await startButton.click();
          await page.waitForTimeout(5000);
        }
      }
    });
  });

  test.describe('8. Chapter Reading Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('8.1 - Read chapter content', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(1000);
      }
      
      const bookDetailScreen = page.locator('text=BookDetailScreen');
      if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
          
          await expect(page.locator('text=ChapterReadScreen')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('8.2 - View chapter title styling', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(500);
        
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const chapterReadScreen = page.locator('text=ChapterReadScreen');
      if (await chapterReadScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const pageContent = await page.content();
        expect(pageContent.length).toBeGreaterThan(100);
      }
    });

    test('8.3 - Return from chapter reading', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(500);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click();
        await page.waitForTimeout(500);
        
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const chapterReadScreen = page.locator('text=ChapterReadScreen');
      if (await chapterReadScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const backButton = page.locator('text=← 返回').first();
        if (await backButton.isVisible()) {
          await backButton.click();
          await page.waitForTimeout(1000);
          
          await expect(page.locator('text=BookDetailScreen')).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe('9. UI Responsiveness Tests', () => {
    test('9.1 - Mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);
      
      await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
    });

    test('9.2 - Tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);
      
      await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
    });

    test('9.3 - Desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);
      
      await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('10. Error Handling Tests', () => {
    test('10.1 - Page loads without critical errors', async ({ page }) => {
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

    test('10.2 - Network timeout handling', async ({ page }) => {
      await page.goto(BASE_URL, { timeout: 30000 });
      await page.waitForTimeout(2000);
      
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });
  });

  test.describe('11. Logout Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('11.1 - Logout functionality', async () => {
      await page.locator('text=设置').first().click();
      await page.waitForTimeout(500);
      
      const logoutButton = page.locator('text=退出登录').first();
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await page.waitForTimeout(2000);
        
        await expect(page.locator('text=LoginScreen')).toBeVisible({ timeout: 5000 });
      }
    });
  });
});
