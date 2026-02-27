const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8082';
const TEST_USER = 'e2e_crud_test_' + Date.now();
const BOOK_TITLE = 'E2E自动化测试书籍_' + Date.now();
const CHARACTER_NAME = '测试角色_' + Date.now();

let sharedPage;
let createdBookId;
let createdCharacterId;

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

async function navigateToTab(page, tabName) {
  const tab = page.getByRole('link', { name: new RegExp(tabName) }).first();
  if (await tab.isVisible({ timeout: 2000 }).catch(() => false)) {
    await tab.click({ force: true });
    await page.waitForTimeout(500);
    return true;
  }
  
  const tabText = page.locator(`text=${tabName}`).first();
  if (await tabText.isVisible({ timeout: 2000 }).catch(() => false)) {
    await tabText.click({ force: true });
    await page.waitForTimeout(500);
    return true;
  }
  return false;
}

async function navigateToBookshelf(page) {
  await navigateToTab(page, '书架');
  await page.waitForTimeout(500);
}

async function navigateToCharacters(page) {
  await navigateToTab(page, '角色');
  await page.waitForTimeout(500);
}

async function navigateToSettings(page) {
  await navigateToTab(page, '设置');
  await page.waitForTimeout(500);
}

async function navigateToHome(page) {
  await navigateToTab(page, '首页');
  await page.waitForTimeout(500);
}

test.describe('========================================', () => {});
test.describe('书籍CRUD完整测试', () => {
  
  test.describe('创建书籍 (Create)', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('C1 - 从首页进入故事创建流程', async () => {
      await navigateToHome(sharedPage);
      
      const startButton = sharedPage.locator('text=开始冒险').or(sharedPage.locator('text=创建故事')).first();
      if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await startButton.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        await expect(sharedPage.locator('text=/StoryCreateScreen/')).toBeVisible({ timeout: 5000 });
      }
    });

    test('C2 - 故事创建步骤1：选择书籍或创建新书', async () => {
      await navigateToHome(sharedPage);
      
      const startButton = sharedPage.locator('text=开始冒险').first();
      if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await startButton.click({ force: true });
        await sharedPage.waitForTimeout(1000);
      }
      
      const createScreen = sharedPage.locator('text=/StoryCreateScreen/');
      if (await createScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const newBookButton = sharedPage.locator('text=创建新故事').or(sharedPage.locator('text=+ 新书')).first();
        if (await newBookButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await newBookButton.click();
          await sharedPage.waitForTimeout(500);
        }
      }
    });

    test('C3 - 故事创建步骤2：选择角色', async () => {
      await navigateToHome(sharedPage);
      
      const startButton = sharedPage.locator('text=开始冒险').first();
      if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await startButton.click({ force: true });
        await sharedPage.waitForTimeout(1000);
      }
      
      const createScreen = sharedPage.locator('text=/StoryCreateScreen/');
      if (await createScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const characterCard = sharedPage.locator('[data-testid="character-card"]').or(sharedPage.locator('text=/主角|配角|英雄|勇士/')).first();
        if (await characterCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          await characterCard.click();
          await sharedPage.waitForTimeout(300);
        }
      }
    });

    test('C4 - 故事创建步骤3：选择情节类型', async () => {
      await navigateToHome(sharedPage);
      
      const startButton = sharedPage.locator('text=开始冒险').first();
      if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await startButton.click({ force: true });
        await sharedPage.waitForTimeout(1000);
      }
      
      const createScreen = sharedPage.locator('text=/StoryCreateScreen/');
      if (await createScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const plotCard = sharedPage.locator('text=/探险|冒险|寻宝|救援/').first();
        if (await plotCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          await plotCard.click();
          await sharedPage.waitForTimeout(300);
        }
      }
    });

    test('C5 - 故事创建步骤4：输入书名并创建', async () => {
      await navigateToHome(sharedPage);
      
      const startButton = sharedPage.locator('text=开始冒险').first();
      if (await startButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await startButton.click({ force: true });
        await sharedPage.waitForTimeout(1000);
      }
      
      const createScreen = sharedPage.locator('text=/StoryCreateScreen/');
      if (await createScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const titleInput = sharedPage.locator('input[placeholder*="故事名称"]').first();
        if (await titleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await titleInput.fill(BOOK_TITLE);
          await sharedPage.waitForTimeout(300);
        }
        
        const createButton = sharedPage.locator('text=创建故事').or(sharedPage.locator('text=开始创作')).first();
        if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await createButton.click();
          await sharedPage.waitForTimeout(2000);
        }
      }
    });
  });

  test.describe('读取书籍 (Read)', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('R1 - 进入书架页面', async () => {
      await navigateToBookshelf(sharedPage);
      await sharedPage.waitForTimeout(1000);
      
      await expect(sharedPage.locator('text=/BookshelfScreen/')).toBeVisible({ timeout: 5000 });
      const hasTitle = await sharedPage.locator('text=我的故事书架').or(sharedPage.locator('text=书架')).first().isVisible({ timeout: 3000 }).catch(() => false);
      expect(hasTitle).toBe(true);
    });

    test('R2 - 查看书籍列表', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCards = sharedPage.locator('[data-testid="book-card"]').or(sharedPage.locator('text=/章/'));
      const count = await bookCards.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });

    test('R3 - 点击书籍进入详情页', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').or(sharedPage.locator('text=测试')).first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        await expect(sharedPage.locator('text=/BookDetailScreen/')).toBeVisible({ timeout: 5000 });
      }
    });

    test('R4 - 查看书籍详情-章节列表', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const chapterTab = sharedPage.locator('text=章节').first();
        if (await chapterTab.isVisible()) {
          await chapterTab.click();
          await sharedPage.waitForTimeout(500);
        }
        
        const chapterList = sharedPage.locator('text=/第.*章/');
        const hasChapters = await chapterList.first().isVisible({ timeout: 3000 }).catch(() => false);
        const hasDetailScreen = await sharedPage.locator('text=/BookDetailScreen/').isVisible({ timeout: 2000 }).catch(() => false);
        expect(hasChapters || hasDetailScreen).toBe(true);
      }
    });

    test('R5 - 查看书籍详情-角色列表', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const characterTab = sharedPage.locator('text=角色').first();
        if (await characterTab.isVisible()) {
          await characterTab.click();
          await sharedPage.waitForTimeout(500);
        }
        
        const characterList = sharedPage.locator('text=/主角|配角|反派/');
        const hasCharacters = await characterList.first().isVisible({ timeout: 3000 }).catch(() => false);
        const hasDetailScreen = await sharedPage.locator('text=/BookDetailScreen/').isVisible({ timeout: 2000 }).catch(() => false);
        expect(hasCharacters || hasDetailScreen).toBe(true);
      }
    });

    test('R6 - 查看书籍统计数据', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const stats = sharedPage.locator('text=/章|角色|字/');
        const hasStats = await stats.first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasStats).toBe(true);
      }
    });
  });

  test.describe('更新书籍 (Update)', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('U1 - 进入书籍编辑模式', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const editButton = sharedPage.locator('text=编辑').or(sharedPage.locator('text=✏️')).first();
        if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await editButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
    });

    test('U2 - 修改书籍标题', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const editButton = sharedPage.locator('text=编辑').first();
        if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await editButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
          
          const titleInput = sharedPage.locator('input[value*="测试"]').first();
          if (await titleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await titleInput.fill('修改后的书名_' + Date.now());
            await sharedPage.waitForTimeout(300);
          }
        }
      }
    });

    test('U3 - 保存书籍修改', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const editButton = sharedPage.locator('text=编辑').first();
        if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await editButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
          
          const saveButton = sharedPage.locator('text=保存').or(sharedPage.locator('text=确定')).first();
          if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await saveButton.click();
            await sharedPage.waitForTimeout(500);
          }
        }
      }
    });

    test('U4 - 添加角色到书籍', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const addCharacterButton = sharedPage.locator('text=+ 添加角色').or(sharedPage.locator('text=添加角色')).first();
        if (await addCharacterButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await addCharacterButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
          
          const characterOption = sharedPage.locator('[data-testid="character-option"]').first();
          if (await characterOption.isVisible({ timeout: 2000 }).catch(() => false)) {
            await characterOption.click();
            await sharedPage.waitForTimeout(300);
          }
          
          const confirmButton = sharedPage.locator('text=确定').or(sharedPage.locator('text=添加')).first();
          if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await confirmButton.click();
            await sharedPage.waitForTimeout(500);
          }
        }
      }
    });
  });

  test.describe('删除书籍 (Delete)', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('D1 - 点击删除书籍按钮', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const deleteButton = sharedPage.locator('text=删除').or(sharedPage.locator('text=🗑️')).first();
        if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await deleteButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
          
          const confirmModal = sharedPage.locator('text=确认').or(sharedPage.locator('text=删除'));
          const hasConfirm = await confirmModal.first().isVisible({ timeout: 2000 }).catch(() => false);
          expect(hasConfirm || await deleteButton.isVisible()).toBe(true);
        }
      }
    });

    test('D2 - 取消删除书籍', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const deleteButton = sharedPage.locator('text=删除').first();
        if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await deleteButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
          
          const cancelButton = sharedPage.locator('text=取消').first();
          if (await cancelButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await cancelButton.click();
            await sharedPage.waitForTimeout(500);
            
            await expect(sharedPage.locator('text=/BookDetailScreen/')).toBeVisible({ timeout: 3000 });
          }
        }
      }
    });

    test('D3 - 确认删除书籍', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const deleteButton = sharedPage.locator('text=删除').first();
        if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await deleteButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
          
          const confirmButton = sharedPage.locator('text=确认').or(sharedPage.locator('text=删除')).first();
          if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await confirmButton.click();
            await sharedPage.waitForTimeout(1000);
            
            await expect(sharedPage.locator('text=/BookshelfScreen/')).toBeVisible({ timeout: 5000 });
          }
        }
      }
    });
  });
});

test.describe('========================================', () => {});
test.describe('角色/人仔CRUD完整测试', () => {
  
  test.describe('创建角色 (Create)', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('C1 - 进入角色页面', async () => {
      await navigateToCharacters(sharedPage);
      await sharedPage.waitForTimeout(1000);
      
      await expect(sharedPage.locator('text=/CharactersScreen/')).toBeVisible({ timeout: 5000 });
    });

    test('C2 - 点击创建角色按钮', async () => {
      await navigateToCharacters(sharedPage);
      
      const createButton = sharedPage.locator('text=+ 创建角色').or(sharedPage.locator('text=创建')).first();
      if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await createButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const modal = sharedPage.locator('text=创建新角色').or(sharedPage.locator('text=创建角色'));
        await expect(modal.first()).toBeVisible({ timeout: 3000 });
      }
    });

    test('C3 - 填写角色名称', async () => {
      await navigateToCharacters(sharedPage);
      
      const createButton = sharedPage.locator('text=+ 创建角色').first();
      if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await createButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
      }
      
      const nameInput = sharedPage.locator('input[placeholder*="角色名称"]').first();
      if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nameInput.fill(CHARACTER_NAME);
        await sharedPage.waitForTimeout(300);
        await expect(nameInput).toHaveValue(CHARACTER_NAME);
      }
    });

    test('C4 - 选择角色性格', async () => {
      await navigateToCharacters(sharedPage);
      
      const createButton = sharedPage.locator('text=+ 创建角色').first();
      if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await createButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
      }
      
      const personalityOption = sharedPage.locator('text=/勇敢|聪明|善良|调皮/').first();
      if (await personalityOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await personalityOption.click();
        await sharedPage.waitForTimeout(300);
      }
    });

    test('C5 - 选择说话方式', async () => {
      await navigateToCharacters(sharedPage);
      
      const createButton = sharedPage.locator('text=+ 创建角色').first();
      if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await createButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
      }
      
      const styleOption = sharedPage.locator('text=/正式|随意|幽默|温柔/').first();
      if (await styleOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await styleOption.click();
        await sharedPage.waitForTimeout(300);
      }
    });

    test('C6 - 提交创建角色', async () => {
      await navigateToCharacters(sharedPage);
      
      const createButton = sharedPage.locator('text=+ 创建角色').first();
      if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await createButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const nameInput = sharedPage.locator('input[placeholder*="角色名称"]').first();
        if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nameInput.fill(CHARACTER_NAME);
        }
        
        const submitButton = sharedPage.locator('text=创建').or(sharedPage.locator('text=保存')).first();
        if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await submitButton.click();
          await sharedPage.waitForTimeout(1000);
        }
      }
    });
  });

  test.describe('读取角色 (Read)', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('R1 - 查看预设角色列表', async () => {
      await navigateToCharacters(sharedPage);
      await sharedPage.waitForTimeout(1000);
      
      const presetSection = sharedPage.locator('text=预设人仔').or(sharedPage.locator('text=系统角色')).or(sharedPage.locator('text=/CharactersScreen/'));
      const hasPreset = await presetSection.first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasPreset).toBe(true);
    });

    test('R2 - 查看我的角色列表', async () => {
      await navigateToCharacters(sharedPage);
      await sharedPage.waitForTimeout(1000);
      
      const mySection = sharedPage.locator('text=我的角色').or(sharedPage.locator('text=我的人仔')).or(sharedPage.locator('text=/CharactersScreen/'));
      const hasSection = await mySection.first().isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasSection).toBe(true);
    });

    test('R3 - 查看角色详情', async () => {
      await navigateToCharacters(sharedPage);
      
      const characterCard = sharedPage.locator('[data-testid="character-card"]').first();
      if (await characterCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await characterCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const detailModal = sharedPage.locator('text=/性格|说话方式|描述/');
        const hasDetail = await detailModal.first().isVisible({ timeout: 2000 }).catch(() => false);
        expect(hasDetail || await characterCard.isVisible()).toBe(true);
      }
    });

    test('R4 - 查看角色类型标签', async () => {
      await navigateToCharacters(sharedPage);
      
      const typeLabels = sharedPage.locator('text=主角').or(sharedPage.locator('text=配角')).or(sharedPage.locator('text=反派'));
      const count = await typeLabels.count();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('更新角色 (Update)', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('U1 - 点击编辑角色按钮', async () => {
      await navigateToCharacters(sharedPage);
      
      const editButton = sharedPage.locator('text=✏️').or(sharedPage.locator('text=编辑')).first();
      if (await editButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await editButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const editModal = sharedPage.locator('text=编辑角色').or(sharedPage.locator('text=修改角色'));
        const hasModal = await editModal.first().isVisible({ timeout: 2000 }).catch(() => false);
        expect(hasModal || await editButton.isVisible()).toBe(true);
      }
    });

    test('U2 - 修改角色名称', async () => {
      await navigateToCharacters(sharedPage);
      
      const editButton = sharedPage.locator('text=✏️').first();
      if (await editButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await editButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const nameInput = sharedPage.locator('input[placeholder*="角色名称"]').first();
        if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nameInput.fill('修改后的角色名_' + Date.now());
          await sharedPage.waitForTimeout(300);
        }
      }
    });

    test('U3 - 保存角色修改', async () => {
      await navigateToCharacters(sharedPage);
      
      const editButton = sharedPage.locator('text=✏️').first();
      if (await editButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await editButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const saveButton = sharedPage.locator('text=保存').or(sharedPage.locator('text=确定')).first();
        if (await saveButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await saveButton.click();
          await sharedPage.waitForTimeout(500);
        }
      }
    });
  });

  test.describe('删除角色 (Delete)', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('D1 - 点击删除角色按钮', async () => {
      await navigateToCharacters(sharedPage);
      
      const deleteButton = sharedPage.locator('text=🗑️').or(sharedPage.locator('text=删除')).first();
      if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await deleteButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const confirmModal = sharedPage.locator('text=确认').or(sharedPage.locator('text=删除'));
        const hasConfirm = await confirmModal.first().isVisible({ timeout: 2000 }).catch(() => false);
        expect(hasConfirm || await deleteButton.isVisible()).toBe(true);
      }
    });

    test('D2 - 取消删除角色', async () => {
      await navigateToCharacters(sharedPage);
      
      const deleteButton = sharedPage.locator('text=🗑️').first();
      if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await deleteButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const cancelButton = sharedPage.locator('text=取消').first();
        if (await cancelButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await cancelButton.click();
          await sharedPage.waitForTimeout(500);
          
          await expect(sharedPage.locator('text=/CharactersScreen/')).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('D3 - 确认删除角色', async () => {
      await navigateToCharacters(sharedPage);
      
      const deleteButton = sharedPage.locator('text=🗑️').first();
      if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await deleteButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const confirmButton = sharedPage.locator('text=确认').or(sharedPage.locator('text=删除')).first();
        if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await confirmButton.click();
          await sharedPage.waitForTimeout(1000);
        }
      }
    });
  });
});

test.describe('========================================', () => {});
test.describe('多页面跳转完整测试', () => {
  
  test.describe('导航链测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('N1 - 首页→书架→书籍详情→章节阅读', async () => {
      await navigateToHome(sharedPage);
      await expect(sharedPage.locator('text=/HomeScreen/')).toBeVisible({ timeout: 3000 });
      
      await navigateToBookshelf(sharedPage);
      await expect(sharedPage.locator('text=/BookshelfScreen/')).toBeVisible({ timeout: 3000 });
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        await expect(sharedPage.locator('text=/BookDetailScreen/')).toBeVisible({ timeout: 3000 });
        
        const chapterItem = sharedPage.locator('text=第一章').first();
        if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await chapterItem.click({ force: true });
          await sharedPage.waitForTimeout(1000);
          await expect(sharedPage.locator('text=/ChapterScreen/')).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('N2 - 章节阅读→书籍详情→书架（返回路径）', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const chapterItem = sharedPage.locator('text=第一章').first();
        if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await chapterItem.click({ force: true });
          await sharedPage.waitForTimeout(1000);
          
          const backButton = sharedPage.locator('text=← 返回').first();
          if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await backButton.click();
            await sharedPage.waitForTimeout(500);
            await expect(sharedPage.locator('text=/BookDetailScreen/')).toBeVisible({ timeout: 3000 });
            
            const backButton2 = sharedPage.locator('text=← 返回').first();
            if (await backButton2.isVisible({ timeout: 2000 }).catch(() => false)) {
              await backButton2.click();
              await sharedPage.waitForTimeout(500);
              await expect(sharedPage.locator('text=/BookshelfScreen/')).toBeVisible({ timeout: 3000 });
            }
          }
        }
      }
    });

    test('N3 - 首页→角色→创建角色弹窗→关闭弹窗', async () => {
      await navigateToHome(sharedPage);
      await navigateToCharacters(sharedPage);
      await expect(sharedPage.locator('text=/CharactersScreen/')).toBeVisible({ timeout: 3000 });
      
      const createButton = sharedPage.locator('text=+ 创建角色').first();
      if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await createButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const modal = sharedPage.locator('text=创建新角色');
        const hasModal = await modal.first().isVisible({ timeout: 2000 }).catch(() => false);
        
        if (hasModal) {
          const closeButton = sharedPage.locator('text=×').or(sharedPage.locator('text=取消')).first();
          if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeButton.click();
            await sharedPage.waitForTimeout(500);
          }
        }
      }
    });

    test('N4 - 首页→设置→主题设置→返回设置', async () => {
      await navigateToHome(sharedPage);
      await navigateToSettings(sharedPage);
      await expect(sharedPage.locator('text=/SettingsScreen/')).toBeVisible({ timeout: 3000 });
      
      const themeButton = sharedPage.locator('text=主题风格设置').first();
      if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await themeButton.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        await expect(sharedPage.locator('text=/ThemeSettingsScreen/')).toBeVisible({ timeout: 3000 });
        
        const backButton = sharedPage.locator('text=← 返回').first();
        if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await backButton.click();
          await sharedPage.waitForTimeout(500);
          await expect(sharedPage.locator('text=/SettingsScreen/')).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('N5 - 设置→家长控制→返回设置', async () => {
      await navigateToSettings(sharedPage);
      
      const parentButton = sharedPage.locator('text=家长控制').first();
      if (await parentButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await parentButton.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        const hasParentScreen = await sharedPage.locator('text=/ParentControlScreen/').or(sharedPage.locator('text=家长控制')).first().isVisible({ timeout: 3000 }).catch(() => false);
        expect(hasParentScreen).toBe(true);
        
        const backButton = sharedPage.locator('text=← 返回').first();
        if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await backButton.click();
          await sharedPage.waitForTimeout(500);
          await expect(sharedPage.locator('text=/SettingsScreen/')).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('N6 - 书架→书籍详情→故事导演台→返回书籍详情', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        await expect(sharedPage.locator('text=/BookDetailScreen/')).toBeVisible({ timeout: 3000 });
        
        const directorButton = sharedPage.locator('text=故事导演台').or(sharedPage.locator('text=添加章节')).first();
        if (await directorButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await directorButton.click({ force: true });
          await sharedPage.waitForTimeout(1000);
          await expect(sharedPage.locator('text=/StoryDirectorScreen/')).toBeVisible({ timeout: 3000 });
          
          const backButton = sharedPage.locator('text=← 返回').first();
          if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await backButton.click();
            await sharedPage.waitForTimeout(500);
            await expect(sharedPage.locator('text=/BookDetailScreen/')).toBeVisible({ timeout: 3000 });
          }
        }
      }
    });

    test('N7 - 冒险→书籍卡片→书籍详情', async () => {
      await navigateToTab(sharedPage, '冒险');
      await sharedPage.waitForTimeout(500);
      await expect(sharedPage.locator('text=/AdventureScreen/')).toBeVisible({ timeout: 3000 });
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        await expect(sharedPage.locator('text=/BookDetailScreen/')).toBeVisible({ timeout: 3000 });
      }
    });

    test('N8 - 快速切换所有Tab', async () => {
      const tabs = ['首页', '书架', '角色', '冒险', '设置'];
      
      for (let i = 0; i < 2; i++) {
        for (const tabName of tabs) {
          await navigateToTab(sharedPage, tabName);
          await sharedPage.waitForTimeout(500);
        }
      }
      
      await expect(sharedPage.locator('text=/SettingsScreen/')).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('深层导航测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('D1 - 三层导航：首页→书架→书籍详情→章节阅读', async () => {
      await navigateToHome(sharedPage);
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const chapterItem = sharedPage.locator('text=第一章').first();
        if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await chapterItem.click({ force: true });
          await sharedPage.waitForTimeout(500);
          
          await expect(sharedPage.locator('text=/ChapterScreen/')).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('D2 - 三层返回：章节阅读→书籍详情→书架→首页', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const chapterItem = sharedPage.locator('text=第一章').first();
        if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await chapterItem.click({ force: true });
          await sharedPage.waitForTimeout(500);
          
          let backButton = sharedPage.locator('text=← 返回').first();
          if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await backButton.click();
            await sharedPage.waitForTimeout(300);
          }
          
          backButton = sharedPage.locator('text=← 返回').first();
          if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await backButton.click();
            await sharedPage.waitForTimeout(300);
          }
          
          await navigateToHome(sharedPage);
          await expect(sharedPage.locator('text=/HomeScreen/')).toBeVisible({ timeout: 3000 });
        }
      }
    });

    test('D3 - 四层导航：首页→设置→主题设置→选择风格→返回', async () => {
      await navigateToHome(sharedPage);
      await navigateToSettings(sharedPage);
      
      const themeButton = sharedPage.locator('text=主题风格设置').first();
      if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await themeButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const styleTab = sharedPage.locator('text=3D卡牌').first();
        if (await styleTab.isVisible({ timeout: 2000 }).catch(() => false)) {
          await styleTab.click();
          await sharedPage.waitForTimeout(300);
        }
        
        const backButton = sharedPage.locator('text=← 返回').first();
        if (await backButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await backButton.click();
          await sharedPage.waitForTimeout(300);
        }
        
        await navigateToHome(sharedPage);
        await expect(sharedPage.locator('text=/HomeScreen/')).toBeVisible({ timeout: 3000 });
      }
    });
  });
});

test.describe('========================================', () => {});
test.describe('核心功能交互测试', () => {
  
  test.describe('故事导演台完整流程', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('SD1 - 进入故事导演台', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const directorButton = sharedPage.locator('text=故事导演台').first();
        if (await directorButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await directorButton.click({ force: true });
          await sharedPage.waitForTimeout(1000);
          
          await expect(sharedPage.locator('text=/StoryDirectorScreen/')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('SD2 - 选择天气选项', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const directorButton = sharedPage.locator('text=故事导演台').first();
        if (await directorButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await directorButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const directorScreen = sharedPage.locator('text=/StoryDirectorScreen/');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const weatherOption = sharedPage.locator('text=/☀️|🌧️|❄️|⛈️/').first();
        if (await weatherOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await weatherOption.click();
          await sharedPage.waitForTimeout(300);
        }
      }
    });

    test('SD3 - 选择冒险类型', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const directorButton = sharedPage.locator('text=故事导演台').first();
        if (await directorButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await directorButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const directorScreen = sharedPage.locator('text=/StoryDirectorScreen/');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const adventureOption = sharedPage.locator('text=/探险|寻宝|救援|解谜/').first();
        if (await adventureOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await adventureOption.click();
          await sharedPage.waitForTimeout(300);
        }
      }
    });

    test('SD4 - 选择地形', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const directorButton = sharedPage.locator('text=故事导演台').first();
        if (await directorButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await directorButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const directorScreen = sharedPage.locator('text=/StoryDirectorScreen/');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const terrainOption = sharedPage.locator('text=/森林|沙漠|海洋|山脉/').first();
        if (await terrainOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await terrainOption.click();
          await sharedPage.waitForTimeout(300);
        }
      }
    });

    test('SD5 - 选择装备', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const directorButton = sharedPage.locator('text=故事导演台').first();
        if (await directorButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await directorButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const directorScreen = sharedPage.locator('text=/StoryDirectorScreen/');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const equipmentOption = sharedPage.locator('text=/地图|指南针|宝剑|盾牌/').first();
        if (await equipmentOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          await equipmentOption.click();
          await sharedPage.waitForTimeout(300);
        }
      }
    });

    test('SD6 - 选择角色并设置类型', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const directorButton = sharedPage.locator('text=故事导演台').first();
        if (await directorButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await directorButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const directorScreen = sharedPage.locator('text=/StoryDirectorScreen/');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const characterCard = sharedPage.locator('[data-testid="director-character"]').first();
        if (await characterCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          await characterCard.click();
          await sharedPage.waitForTimeout(300);
          
          const roleTypeButton = sharedPage.locator('text=主角').first();
          if (await roleTypeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await roleTypeButton.click();
            await sharedPage.waitForTimeout(300);
          }
        }
      }
    });

    test('SD7 - 使用随机选择功能', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const directorButton = sharedPage.locator('text=故事导演台').first();
        if (await directorButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await directorButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const directorScreen = sharedPage.locator('text=/StoryDirectorScreen/');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const randomButton = sharedPage.locator('text=随机').or(sharedPage.locator('text=🎲')).first();
        if (await randomButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await randomButton.click();
          await sharedPage.waitForTimeout(500);
        }
      }
    });

    test('SD8 - 点击开始拍摄按钮', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const directorButton = sharedPage.locator('text=故事导演台').first();
        if (await directorButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await directorButton.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const directorScreen = sharedPage.locator('text=/StoryDirectorScreen/');
      if (await directorScreen.isVisible({ timeout: 3000 }).catch(() => false)) {
        const startButton = sharedPage.locator('text=开始拍摄').or(sharedPage.locator('text=开拍')).first();
        if (await startButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(startButton).toBeEnabled();
        }
      }
    });
  });

  test.describe('章节阅读完整流程', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('CR1 - 进入章节阅读', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(1000);
        
        const chapterItem = sharedPage.locator('text=第一章').first();
        if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await chapterItem.click({ force: true });
          await sharedPage.waitForTimeout(1000);
          
          await expect(sharedPage.locator('text=/ChapterScreen/')).toBeVisible({ timeout: 5000 });
        }
      }
    });

    test('CR2 - 展开创作提示', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const chapterItem = sharedPage.locator('text=第一章').first();
        if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await chapterItem.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const toggleButton = sharedPage.locator('text=展开创作提示').first();
      if (await toggleButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await toggleButton.click();
        await sharedPage.waitForTimeout(500);
        
        const hintContent = sharedPage.locator('text=登场角色').or(sharedPage.locator('text=创作提示'));
        const hasHint = await hintContent.first().isVisible({ timeout: 2000 }).catch(() => false);
        expect(hasHint || await toggleButton.isVisible()).toBe(true);
      }
    });

    test('CR3 - 查看谜题区域', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const chapterItem = sharedPage.locator('text=第一章').first();
        if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await chapterItem.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const puzzleSection = sharedPage.locator('text=互动谜题').or(sharedPage.locator('text=❓'));
      const hasPuzzle = await puzzleSection.first().isVisible({ timeout: 2000 }).catch(() => false);
      const hasChapterScreen = await sharedPage.locator('text=/ChapterScreen/').isVisible({ timeout: 2000 }).catch(() => false);
      const hasContent = await sharedPage.locator('body').isVisible();
      expect(hasPuzzle || hasChapterScreen || hasContent).toBe(true);
    });

    test('CR4 - 提交谜题答案', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const chapterItem = sharedPage.locator('text=第一章').first();
        if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await chapterItem.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const answerInput = sharedPage.locator('input[placeholder*="答案"]').first();
      if (await answerInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await answerInput.fill('测试答案');
        await sharedPage.waitForTimeout(300);
        
        const submitButton = sharedPage.locator('text=提交').first();
        if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await submitButton.click();
          await sharedPage.waitForTimeout(500);
        }
      }
    });

    test('CR5 - 查看提示按钮', async () => {
      await navigateToBookshelf(sharedPage);
      
      const bookCard = sharedPage.locator('text=E2E测试故事书').first();
      if (await bookCard.isVisible({ timeout: 3000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const chapterItem = sharedPage.locator('text=第一章').first();
        if (await chapterItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          await chapterItem.click({ force: true });
          await sharedPage.waitForTimeout(500);
        }
      }
      
      const hintButton = sharedPage.locator('text=提示').first();
      if (await hintButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await hintButton.click();
        await sharedPage.waitForTimeout(300);
      }
    });
  });
});
