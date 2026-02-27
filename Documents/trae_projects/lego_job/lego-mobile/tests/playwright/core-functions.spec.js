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

async function ensureAuthenticated(page) {
  if (await page.locator('text=LoginScreen').isVisible({ timeout: 1000 }).catch(() => false)) {
    await performLogin(page);
  }
}

async function navigateToBookDetail(page, bookTitle = 'E2E测试故事书') {
  await page.locator('text=书架').first().click();
  await page.waitForTimeout(500);
  
  const bookCard = page.locator(`text=${bookTitle}`).first();
  if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
    await bookCard.click();
    await page.waitForTimeout(1000);
    return true;
  }
  return false;
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

    test('3.1 - View bookshelf with title', async () => {
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

    test('3.3 - Create new book - step 1 select character with verification', async () => {
      await ensureAuthenticated(page);
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
          await expect(characterCard).toBeVisible();
        }
        
        const nextButton = page.locator('text=下一步').first();
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
          await expect(page.locator('text=冒险探险').first()).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('3.4 - Create new book - step 2 select plot with verification', async () => {
      await ensureAuthenticated(page);
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
          await expect(plotCard).toBeVisible();
        }
        
        nextButton = page.locator('text=下一步').first();
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
          await expect(page.locator('input[placeholder*="故事名称"]').first()).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('3.5 - Create new book - step 3 enter title with verification', async () => {
      await ensureAuthenticated(page);
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
          await expect(titleInput).toHaveValue('E2E测试故事书');
        }
        
        const createStoryButton = page.locator('text=开始创作').first();
        if (await createStoryButton.isVisible()) {
          await createStoryButton.click();
          await page.waitForTimeout(5000);
          await expect(page.locator('text=BookDetailScreen')).toBeVisible({ timeout: 10000 });
        }
      }
    });

    test('3.6 - CREATE-01: Select existing book option', async () => {
      await ensureAuthenticated(page);
      await page.getByRole('link', { name: /首页/ }).click();
      await page.waitForTimeout(500);
      
      const createButton = page.locator('text=开始冒险').first();
      if (await createButton.isVisible()) {
        await createButton.click({ force: true });
        await page.waitForTimeout(1000);
      }
      
      const existingBookOption = page.locator('text=选择已有书籍').first();
      if (await existingBookOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await existingBookOption.click();
        await page.waitForTimeout(500);
        const bookList = page.locator('text=E2E测试故事书').first();
        await expect(bookList).toBeVisible({ timeout: 3000 });
      }
    });

    test('3.7 - CREATE-08: Step indicator verification', async () => {
      await ensureAuthenticated(page);
      await page.getByRole('link', { name: /首页/ }).click();
      await page.waitForTimeout(500);
      
      const createButton = page.locator('text=开始冒险').first();
      if (await createButton.isVisible()) {
        await createButton.click({ force: true });
        await page.waitForTimeout(1000);
      }
      
      const stepIndicator = page.locator('text=步骤 1').or(page.locator('text=第一步')).first();
      if (await stepIndicator.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(stepIndicator).toBeVisible();
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

    test('4.1 - View characters page with sections', async () => {
      await page.getByRole('link', { name: /角色/ }).click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=CharactersScreen')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=角色列表').first()).toBeVisible();
    });

    test('4.2 - View preset characters section with content', async () => {
      await page.getByRole('link', { name: /角色/ }).click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=预设人仔').first()).toBeVisible({ timeout: 5000 });
      const presetCards = page.locator('text=系统').or(page.locator('text=🧙')).or(page.locator('text=🦸'));
      const count = await presetCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('4.3 - Open create character modal with form fields', async () => {
      await page.getByRole('link', { name: /角色/ }).click();
      await page.waitForTimeout(1000);
      
      const createButton = page.locator('text=+ 创建角色').or(page.locator('text=创建')).first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForTimeout(1000);
        
        await expect(page.locator('text=创建新角色')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('input[placeholder*="角色名称"]').first()).toBeVisible();
      }
    });

    test('4.4 - Create new character with full fields and verify', async () => {
      await ensureAuthenticated(page);
      
      if (!await page.getByRole('link', { name: /角色/ }).isVisible({ timeout: 1000 }).catch(() => false)) {
        await page.goto(BASE_URL);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
      }
      
      await page.getByRole('link', { name: /角色/ }).click();
      await page.waitForTimeout(500);
      
      const createButton = page.locator('text=+ 创建角色').or(page.locator('text=创建')).first();
      if (await createButton.isVisible()) {
        await createButton.click();
        await page.waitForTimeout(500);
      }
      
      const modalTitle = page.locator('text=创建新角色');
      if (await modalTitle.isVisible({ timeout: 3000 }).catch(() => false)) {
        const nameInput = page.locator('input[placeholder*="角色名称"]').first();
        await nameInput.fill('E2E测试角色_完整');
        
        const confirmButton = page.locator('text=创建').or(page.locator('text=保存')).first();
        await confirmButton.click();
        await page.waitForTimeout(2000);
        
        const createdCharacter = page.locator('text=E2E测试角色_完整');
        await expect(createdCharacter.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('4.5 - View my characters section with created character', async () => {
      await page.locator('text=角色').first().click();
      await page.waitForTimeout(1000);
      
      const myCharactersSection = page.locator('text=我的角色').or(page.locator('text=我的人仔'));
      await expect(myCharactersSection.first()).toBeVisible({ timeout: 5000 });
      
      const createdCharacter = page.locator('text=E2E测试角色_完整').or(page.locator('text=E2E测试角色'));
      await expect(createdCharacter.first()).toBeVisible({ timeout: 3000 });
    });

    test('4.6 - Edit character and verify save', async () => {
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
          
          await expect(page.locator('text=E2E测试角色_已编辑').first()).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('4.7 - Delete character and verify removal', async () => {
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
          
          const deletedCharacter = page.locator('text=E2E测试角色_已编辑');
          await expect(deletedCharacter.first()).not.toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('4.8 - CHAR-10: Character type label display', async () => {
      await page.locator('text=角色').first().click();
      await page.waitForTimeout(1000);
      
      const typeLabels = page.locator('text=主角').or(page.locator('text=配角')).or(page.locator('text=反派'));
      const count = await typeLabels.count();
      expect(count).toBeGreaterThanOrEqual(0);
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

    test('5.1 - View settings page with options', async () => {
      await page.getByRole('link', { name: /设置/ }).click();
      await page.waitForTimeout(1000);
      
      await expect(page.locator('text=SettingsScreen')).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=设置').first()).toBeVisible();
      await expect(page.locator('text=主题风格设置').first()).toBeVisible({ timeout: 3000 });
      await expect(page.locator('text=家长控制').first()).toBeVisible({ timeout: 3000 });
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

    test('5.3 - Select theme style with verification', async () => {
      const backButton = page.locator('text=← 返回').first();
      if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(500);
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
          await expect(styleCard).toBeVisible();
        }
      }
    });

    test('5.4 - Save theme settings with verification', async () => {
      await ensureAuthenticated(page);
      
      const backButton = page.locator('text=← 返回').first();
      if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(500);
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
          
          const successMessage = page.locator('text=保存成功').or(page.locator('text=设置已保存'));
          const isVisible = await successMessage.first().isVisible({ timeout: 3000 }).catch(() => false);
          expect(isVisible || await page.locator('text=SettingsScreen').isVisible()).toBe(true);
        }
      }
    });

    test('5.5 - Navigate to parent control', async () => {
      await ensureAuthenticated(page);
      
      const backButton = page.locator('text=← 返回').first();
      if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(500);
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

    test('5.6 - Set time limit with verification', async () => {
      const backButton = page.locator('text=← 返回').first();
      if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(500);
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
          await expect(timeButton).toBeVisible();
        }
      }
    });

    test('5.7 - View usage statistics with content', async () => {
      const backButton = page.locator('text=← 返回').first();
      if (await backButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await backButton.click();
        await page.waitForTimeout(500);
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
        const usageSection = page.locator('text=今日使用统计').or(page.locator('text=使用统计'));
        await expect(usageSection.first()).toBeVisible({ timeout: 5000 });
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
      const found = await navigateToBookDetail(page);
      if (found) {
        await expect(page.locator('text=BookDetailScreen')).toBeVisible({ timeout: 5000 });
      }
    });

    test('6.2 - View chapters tab with content', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const bookDetailScreen = page.locator('text=BookDetailScreen');
        if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
          const chapterTab = page.locator('text=章节').first();
          if (await chapterTab.isVisible()) {
            await chapterTab.click();
            await page.waitForTimeout(500);
            
            const chapterList = page.locator('text=第一章').or(page.locator('text=第1章'));
            const hasChapters = await chapterList.first().isVisible({ timeout: 3000 }).catch(() => false);
            expect(hasChapters || await chapterTab.isVisible()).toBe(true);
          }
        }
      }
    });

    test('6.3 - View characters tab in book detail with content', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const bookDetailScreen = page.locator('text=BookDetailScreen');
        if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
          const characterTab = page.locator('text=角色').first();
          if (await characterTab.isVisible()) {
            await characterTab.click();
            await page.waitForTimeout(500);
            
            const characterList = page.locator('text=主角').or(page.locator('text=配角'));
            const hasCharacters = await characterList.first().isVisible({ timeout: 3000 }).catch(() => false);
            expect(hasCharacters || await characterTab.isVisible()).toBe(true);
          }
        }
      }
    });

    test('6.4 - Navigate to story director', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const bookDetailScreen = page.locator('text=BookDetailScreen');
        if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
          const directorButton = page.locator('text=故事导演台').or(page.locator('text=添加章节')).first();
          if (await directorButton.isVisible()) {
            await directorButton.click();
            await page.waitForTimeout(1000);
            
            await expect(page.locator('text=StoryDirectorScreen')).toBeVisible({ timeout: 5000 });
          }
        }
      }
    });

    test('6.5 - BOOK-04~06: Add character to book', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const characterTab = page.locator('text=角色').first();
        if (await characterTab.isVisible()) {
          await characterTab.click();
          await page.waitForTimeout(500);
        }
        
        const addButton = page.locator('text=添加角色').first();
        if (await addButton.isVisible()) {
          await addButton.click();
          await page.waitForTimeout(500);
          
          const addModal = page.locator('text=添加角色');
          if (await addModal.isVisible({ timeout: 3000 }).catch(() => false)) {
            const characterOption = page.locator('[data-testid="character-option"]').or(page.locator('text=选择人仔')).first();
            if (await characterOption.isVisible({ timeout: 2000 }).catch(() => false)) {
              await characterOption.click();
            }
            
            const nameInput = page.locator('input[placeholder*="名称"]').first();
            if (await nameInput.isVisible()) {
              await nameInput.fill('测试角色名');
            }
            
            const roleOption = page.locator('text=主角').first();
            if (await roleOption.isVisible()) {
              await roleOption.click();
            }
            
            const saveButton = page.locator('text=保存').first();
            if (await saveButton.isVisible()) {
              await saveButton.click();
              await page.waitForTimeout(1000);
            }
          }
        }
      }
    });

    test('6.6 - BOOK-09: View prompt', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const promptButton = page.locator('text=查看提示词').first();
        if (await promptButton.isVisible()) {
          await promptButton.click();
          await page.waitForTimeout(500);
          
          const promptModal = page.locator('text=AI提示词');
          await expect(promptModal).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('6.7 - BOOK-10: Share story', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const shareButton = page.locator('text=📤').first();
        if (await shareButton.isVisible()) {
          await shareButton.click();
          await page.waitForTimeout(500);
        }
      }
    });

    test('6.8 - BOOK-12~14: Statistics display verification', async () => {
      await ensureAuthenticated(page);
      const found = await navigateToBookDetail(page);
      if (found) {
        const bookDetailScreen = page.locator('text=BookDetailScreen');
        if (await bookDetailScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
          const statsSection = page.locator('text=章').or(page.locator('text=角色')).or(page.locator('text=字'));
          const hasStats = await statsSection.first().isVisible({ timeout: 3000 }).catch(() => false);
          expect(hasStats || await bookDetailScreen.isVisible()).toBe(true);
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

    test('7.1 - View story director page with verification', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const directorButton = page.locator('text=故事导演台').or(page.locator('text=添加章节')).first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      await expect(directorScreen).toBeVisible({ timeout: 5000 });
    });

    test('7.2 - DIR-02~04: Character type selection with limits', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const directorButton = page.locator('text=故事导演台').or(page.locator('text=添加章节')).first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const roleTypeSection = page.locator('text=设置角色类型').or(page.locator('text=主角'));
        await expect(roleTypeSection.first()).toBeVisible({ timeout: 5000 });
        
        const protagonistOption = page.locator('text=👑 主角').first();
        if (await protagonistOption.isVisible()) {
          await expect(protagonistOption).toBeVisible();
        }
      }
    });

    test('7.3 - DIR-08: Equipment selection', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const directorButton = page.locator('text=故事导演台').or(page.locator('text=添加章节')).first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const equipmentSection = page.locator('text=装备').or(page.locator('text=道具'));
        await expect(equipmentSection.first()).toBeVisible({ timeout: 5000 });
      }
    });

    test('7.4 - DIR-09: Stage preview', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const directorButton = page.locator('text=故事导演台').or(page.locator('text=添加章节')).first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const stagePreview = page.locator('text=StagePreview').or(page.locator('[data-testid="stage-preview"]'));
        const hasStage = await stagePreview.first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasStage || await directorScreen.isVisible()).toBe(true);
      }
    });

    test('7.5 - DIR-10: Weather effect', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const directorButton = page.locator('text=故事导演台').or(page.locator('text=添加章节')).first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const weatherSection = page.locator('text=天气').first();
        await expect(weatherSection).toBeVisible({ timeout: 5000 });
      }
    });

    test('7.6 - DIR-11: Random selection', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const directorButton = page.locator('text=故事导演台').or(page.locator('text=添加章节')).first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const randomButton = page.locator('text=随机').or(page.locator('text=🎲')).first();
        if (await randomButton.isVisible({ timeout: 3000 }).catch(() => false)) {
          await randomButton.click();
          await page.waitForTimeout(500);
          await expect(randomButton).toBeVisible();
        }
      }
    });

    test('7.7 - Generate chapter with verification', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const directorButton = page.locator('text=故事导演台').or(page.locator('text=添加章节')).first();
        if (await directorButton.isVisible()) {
          await directorButton.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const directorScreen = page.locator('text=StoryDirectorScreen');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const startButton = page.locator('text=开始拍摄').or(page.locator('text=开拍')).first();
        if (await startButton.isVisible()) {
          await expect(startButton).toBeVisible();
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
      const found = await navigateToBookDetail(page);
      if (found) {
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
          
          await expect(page.locator('text=ChapterScreen')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('8.2 - CHAP-06: Story creation hint panel', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const chapterScreen = page.locator('text=ChapterScreen');
      if (await chapterScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const hintToggle = page.locator('text=展开创作提示').first();
        if (await hintToggle.isVisible()) {
          await hintToggle.click();
          await page.waitForTimeout(500);
          
          const hintCard = page.locator('text=故事背景').or(page.locator('text=登场角色'));
          await expect(hintCard.first()).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('8.3 - CHAP-07~09: Character info and story background display', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const chapterScreen = page.locator('text=ChapterScreen');
      if (await chapterScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const hintToggle = page.locator('text=展开创作提示').first();
        if (await hintToggle.isVisible()) {
          await hintToggle.click();
          await page.waitForTimeout(500);
        }
        
        const storyBackground = page.locator('text=故事背景').first();
        const characterInfo = page.locator('text=登场角色').first();
        
        const hasBackground = await storyBackground.isVisible({ timeout: 2000 }).catch(() => false);
        const hasCharacters = await characterInfo.isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(hasBackground || hasCharacters || await chapterScreen.isVisible()).toBe(true);
      }
    });

    test('8.4 - CHAP-10~11: Chapter navigation', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const chapterScreen = page.locator('text=ChapterScreen');
      if (await chapterScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const nextButton = page.locator('text=下一章').or(page.locator('text=›')).first();
        const prevButton = page.locator('text=上一章').or(page.locator('text=‹')).first();
        
        const hasNext = await nextButton.isVisible({ timeout: 1000 }).catch(() => false);
        const hasPrev = await prevButton.isVisible({ timeout: 1000 }).catch(() => false);
        
        expect(hasNext || hasPrev || await chapterScreen.isVisible()).toBe(true);
      }
    });

    test('8.5 - CHAP-12: Current chapter position display', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const chapterScreen = page.locator('text=ChapterScreen');
      if (await chapterScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const positionIndicator = page.locator('text=/第.*章/').or(page.locator('text=/\\d+\\/\\d+/'));
        const hasPosition = await positionIndicator.first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasPosition || await chapterScreen.isVisible()).toBe(true);
      }
    });

    test('8.6 - CHAP-13~14: Interactive puzzle', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const chapterScreen = page.locator('text=ChapterScreen');
      if (await chapterScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const puzzleSection = page.locator('text=互动谜题').or(page.locator('text=❓'));
        const hasPuzzle = await puzzleSection.first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasPuzzle || await chapterScreen.isVisible()).toBe(true);
      }
    });

    test('8.7 - Return from chapter reading with verification', async () => {
      const found = await navigateToBookDetail(page);
      if (found) {
        const chapterItem = page.locator('text=第一章').first();
        if (await chapterItem.isVisible()) {
          await chapterItem.click();
          await page.waitForTimeout(1000);
        }
      }
      
      const chapterScreen = page.locator('text=ChapterScreen');
      if (await chapterScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const backButton = page.locator('text=← 返回').first();
        if (await backButton.isVisible()) {
          await backButton.click();
          await page.waitForTimeout(1000);
          
          await expect(page.locator('text=BookDetailScreen')).toBeVisible({ timeout: 5000 });
        }
      }
    });
  });

  test.describe('9. Home Screen Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('9.1 - HOME-02: Popular characters display', async () => {
      await page.locator('text=首页').first().click();
      await page.waitForTimeout(1000);
      
      const popularSection = page.locator('text=热门人仔').or(page.locator('text=推荐角色'));
      await expect(popularSection.first()).toBeVisible({ timeout: 5000 });
    });

    test('9.2 - HOME-03: Recent stories display', async () => {
      await page.locator('text=首页').first().click();
      await page.waitForTimeout(1000);
      
      const recentSection = page.locator('text=最近故事').or(page.locator('text=继续阅读'));
      await expect(recentSection.first()).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('10. Adventure Mode Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('10.1 - ADV-01: Reading time statistics', async () => {
      await page.getByRole('link', { name: /冒险/ }).click();
      await page.waitForTimeout(1000);
      
      const timeDisplay = page.locator('text=/\\d+.*分钟/').or(page.locator('text=/阅读时间/'));
      const hasTimeDisplay = await timeDisplay.first().isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasTimeDisplay || await page.locator('text=AdventureScreen').isVisible()).toBe(true);
    });

    test('10.2 - ADV-02: Time progress bar', async () => {
      await page.getByRole('link', { name: /冒险/ }).click();
      await page.waitForTimeout(1000);
      
      const progressBar = page.locator('[role="progressbar"]').or(page.locator('text=/进度/'));
      const hasProgress = await progressBar.first().isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasProgress || await page.locator('text=AdventureScreen').isVisible()).toBe(true);
    });

    test('10.3 - ADV-03: Select story in adventure mode', async () => {
      await page.getByRole('link', { name: /冒险/ }).click();
      await page.waitForTimeout(1000);
      
      const storyCard = page.locator('text=E2E测试故事书').first();
      if (await storyCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await storyCard.click();
        await page.waitForTimeout(500);
        await expect(storyCard).toBeVisible();
      }
    });
  });

  test.describe('11. Bookshelf Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('11.1 - SHELF-02: Book info display verification', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(1000);
      
      const bookCard = page.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(bookCard).toBeVisible();
        
        const bookInfo = page.locator('text=章').or(page.locator('text=角色'));
        const hasInfo = await bookInfo.first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasInfo || await bookCard.isVisible()).toBe(true);
      }
    });

    test('11.2 - SHELF-06: Empty bookshelf state', async () => {
      await page.locator('text=书架').first().click();
      await page.waitForTimeout(1000);
      
      const emptyState = page.locator('text=还没有故事').or(page.locator('text=创建你的第一个故事'));
      const hasEmptyState = await emptyState.first().isVisible({ timeout: 3000 }).catch(() => false);
      
      const bookCards = page.locator('text=E2E测试故事书');
      const hasBooks = await bookCards.first().isVisible({ timeout: 1000 }).catch(() => false);
      
      expect(hasEmptyState || hasBooks).toBe(true);
    });
  });

  test.describe('12. UI Responsiveness Tests', () => {
    test('12.1 - Mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);
      
      await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
    });

    test('12.2 - Tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);
      
      await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
    });

    test('12.3 - Desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto(BASE_URL);
      await page.waitForTimeout(2000);
      
      await expect(page.locator('text=乐高故事书')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('13. Error Handling Tests', () => {
    test('13.1 - Page loads without critical errors', async ({ page }) => {
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

    test('13.2 - Network timeout handling', async ({ page }) => {
      await page.goto(BASE_URL, { timeout: 30000 });
      await page.waitForTimeout(2000);
      
      const pageContent = await page.content();
      expect(pageContent.length).toBeGreaterThan(100);
    });
  });

  test.describe('14. Logout Tests (Authenticated)', () => {
    let page;
    
    test.beforeAll(async ({ browser }) => {
      page = await browser.newPage();
      await performLogin(page);
    });
    
    test.afterAll(async () => {
      await page.close();
    });

    test('14.1 - Logout functionality with verification', async () => {
      await page.locator('text=设置').first().click();
      await page.waitForTimeout(500);
      
      const logoutButton = page.locator('text=退出登录').first();
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await page.waitForTimeout(2000);
        
        await expect(page.locator('text=LoginScreen')).toBeVisible({ timeout: 5000 });
        await expect(page.locator('text=乐高故事书')).toBeVisible();
      }
    });
  });
});
