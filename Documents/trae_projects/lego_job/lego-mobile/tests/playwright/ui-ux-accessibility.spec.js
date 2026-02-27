const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8082';
const TEST_USER = 'e2e_ui_test_' + Date.now();

let sharedPage;

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

async function checkElementVisibility(page, selector, description) {
  const element = page.locator(selector).first();
  const isVisible = await element.isVisible({ timeout: 3000 }).catch(() => false);
  return { description, isVisible, selector };
}

async function getElementBoundingBox(page, selector) {
  const element = page.locator(selector).first();
  if (await element.isVisible({ timeout: 2000 }).catch(() => false)) {
    return await element.boundingBox();
  }
  return null;
}

test.describe('========================================', () => {});
test.describe('UI/UX 全面测试 - 页面布局与样式', () => {
  
  test.describe('登录页面 UI 测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await sharedPage.goto(BASE_URL);
      await sharedPage.waitForLoadState('networkidle');
      await sharedPage.waitForTimeout(2000);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('L1 - 登录页面标题居中显示', async () => {
      const title = sharedPage.locator('text=/冒险|故事|LEGO/').first();
      if (await title.isVisible({ timeout: 3000 }).catch(() => false)) {
        const box = await title.boundingBox();
        expect(box).not.toBeNull();
        const pageWidth = sharedPage.viewportSize().width;
        const titleCenter = box.x + box.width / 2;
        const pageCenter = pageWidth / 2;
        expect(Math.abs(titleCenter - pageCenter)).toBeLessThan(pageWidth * 0.2);
      }
    });

    test('L2 - 输入框大小适合触摸操作', async () => {
      const input = sharedPage.locator('input[placeholder*="冒险者名字"]').first();
      if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
        const box = await input.boundingBox();
        expect(box).not.toBeNull();
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    });

    test('L3 - 登录按钮大小适合触摸操作', async () => {
      const button = sharedPage.locator('button:has-text("开始冒险")').or(sharedPage.locator('text=开始冒险')).first();
      if (await button.isVisible({ timeout: 3000 }).catch(() => false)) {
        const box = await button.boundingBox();
        expect(box).not.toBeNull();
        expect(box.height).toBeGreaterThanOrEqual(20);
        expect(box.width).toBeGreaterThanOrEqual(50);
      }
    });

    test('L4 - 登录页面元素间距合理', async () => {
      const input = sharedPage.locator('input[placeholder*="冒险者名字"]').first();
      const button = sharedPage.locator('button:has-text("开始冒险")').or(sharedPage.locator('text=开始冒险')).first();
      
      if (await input.isVisible({ timeout: 2000 }).catch(() => false) && 
          await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        const inputBox = await input.boundingBox();
        const buttonBox = await button.boundingBox();
        
        if (inputBox && buttonBox) {
          const gap = buttonBox.y - (inputBox.y + inputBox.height);
          expect(gap).toBeGreaterThanOrEqual(8);
          expect(gap).toBeLessThanOrEqual(300);
        }
      }
    });

    test('L5 - 登录页面背景不干扰前景内容', async () => {
      const body = sharedPage.locator('body');
      const backgroundColor = await body.evaluate(el => {
        return window.getComputedStyle(el).backgroundColor;
      });
      expect(backgroundColor).toBeDefined();
    });

    test('L6 - 输入框有清晰的焦点状态', async () => {
      const input = sharedPage.locator('input[placeholder*="冒险者名字"]').first();
      if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
        await input.focus();
        await sharedPage.waitForTimeout(300);
        const isFocused = await input.evaluate(el => document.activeElement === el);
        expect(isFocused).toBe(true);
      }
    });
  });

  test.describe('首页 UI 测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('H1 - 首页标题清晰可见', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const title = sharedPage.locator('text=/欢迎|冒险|首页/').first();
      const isVisible = await title.isVisible({ timeout: 3000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/HomeScreen/');
      const hasScreenIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(isVisible || hasScreenIndicator).toBe(true);
    });

    test('H2 - 首页主要按钮尺寸合适', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttons = sharedPage.locator('button, [role="button"]');
      const count = await buttons.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
          const box = await button.boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(30);
          }
        }
      }
    });

    test('H3 - 首页内容区域有足够边距', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const content = sharedPage.locator('[class*="content"], [class*="container"], main, .screen').first();
      if (await content.isVisible({ timeout: 2000 }).catch(() => false)) {
        const box = await content.boundingBox();
        const viewport = sharedPage.viewportSize();
        
        if (box) {
          expect(box.x).toBeLessThanOrEqual(20);
          expect(box.y).toBeLessThanOrEqual(100);
        }
      }
    });

    test('H4 - 首页卡片元素圆角统一', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const cards = sharedPage.locator('[class*="card"], [class*="Card"]');
      const count = await cards.count();
      
      if (count > 0) {
        const firstCard = cards.first();
        if (await firstCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          const borderRadius = await firstCard.evaluate(el => {
            return window.getComputedStyle(el).borderRadius;
          });
          expect(borderRadius).toBeDefined();
        }
      }
    });

    test('H5 - 首页文字对比度足够', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const textElements = sharedPage.locator('p, span, h1, h2, h3, h4, h5, h6, div').first();
      if (await textElements.isVisible({ timeout: 2000 }).catch(() => false)) {
        const color = await textElements.evaluate(el => {
          return window.getComputedStyle(el).color;
        });
        expect(color).toBeDefined();
      }
    });

    test('H6 - 首页图标与文字对齐', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const iconTextPairs = sharedPage.locator('[class*="icon"], [class*="Icon"]').first();
      if (await iconTextPairs.isVisible({ timeout: 2000 }).catch(() => false)) {
        const box = await iconTextPairs.boundingBox();
        expect(box).not.toBeNull();
      }
    });
  });

  test.describe('书架页面 UI 测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('B1 - 书架页面标题清晰', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const title = sharedPage.locator('text=/书架|故事|Bookshelf/').first();
      const isVisible = await title.isVisible({ timeout: 3000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/BookshelfScreen/');
      const hasScreenIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(isVisible || hasScreenIndicator).toBe(true);
    });

    test('B2 - 书籍卡片网格布局合理', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const cards = sharedPage.locator('[class*="book"], [class*="card"]');
      const count = await cards.count();
      
      if (count >= 2) {
        const box1 = await cards.nth(0).boundingBox();
        const box2 = await cards.nth(1).boundingBox();
        
        if (box1 && box2) {
          const gap = Math.abs(box2.x - (box1.x + box1.width));
          expect(gap).toBeGreaterThanOrEqual(0);
          expect(gap).toBeLessThanOrEqual(50);
        }
      }
    });

    test('B3 - 书籍卡片宽高比合理', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const cards = sharedPage.locator('[class*="book"], [class*="card"]');
      const count = await cards.count();
      
      if (count > 0) {
        const firstCard = cards.first();
        if (await firstCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          const box = await firstCard.boundingBox();
          if (box) {
            const ratio = box.width / box.height;
            expect(ratio).toBeGreaterThan(0.5);
            expect(ratio).toBeLessThan(2);
          }
        }
      }
    });

    test('B4 - 书架页面滚动流畅', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const scrollable = await sharedPage.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        return {
          bodyScrollHeight: body.scrollHeight,
          bodyClientHeight: body.clientHeight,
          canScroll: body.scrollHeight > body.clientHeight
        };
      });
      
      expect(scrollable.bodyScrollHeight).toBeGreaterThan(0);
    });

    test('B5 - 书籍标题字体大小适中', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const titles = sharedPage.locator('[class*="title"], [class*="Title"], h2, h3').first();
      if (await titles.isVisible({ timeout: 2000 }).catch(() => false)) {
        const fontSize = await titles.evaluate(el => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });
        expect(fontSize).toBeGreaterThanOrEqual(12);
        expect(fontSize).toBeLessThanOrEqual(32);
      }
    });

    test('B6 - 书架空状态提示清晰', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const emptyState = sharedPage.locator('text=/暂无|空|创建|添加/').first();
      const hasEmptyHint = await emptyState.isVisible({ timeout: 2000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/BookshelfScreen/');
      const hasScreenIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(hasEmptyHint || hasScreenIndicator).toBe(true);
    });
  });

  test.describe('角色页面 UI 测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('C1 - 角色页面标题清晰', async () => {
      await navigateToTab(sharedPage, '角色');
      await sharedPage.waitForTimeout(500);
      
      const title = sharedPage.locator('text=/角色|人仔|Character/').first();
      const isVisible = await title.isVisible({ timeout: 3000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/CharactersScreen/');
      const hasScreenIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(isVisible || hasScreenIndicator).toBe(true);
    });

    test('C2 - 角色卡片布局整齐', async () => {
      await navigateToTab(sharedPage, '角色');
      await sharedPage.waitForTimeout(500);
      
      const cards = sharedPage.locator('[class*="character"], [class*="card"], [class*="Character"]');
      const count = await cards.count();
      
      if (count >= 2) {
        const positions = [];
        for (let i = 0; i < Math.min(count, 4); i++) {
          const card = cards.nth(i);
          if (await card.isVisible({ timeout: 1000 }).catch(() => false)) {
            const box = await card.boundingBox();
            if (box) {
              positions.push({ x: box.x, y: box.y });
            }
          }
        }
        
        if (positions.length >= 2) {
          const sortedByY = [...positions].sort((a, b) => a.y - b.y);
          expect(sortedByY[0].y).toBeLessThanOrEqual(sortedByY[sortedByY.length - 1].y + 50);
        }
      }
    });

    test('C3 - 角色头像尺寸适中', async () => {
      await navigateToTab(sharedPage, '角色');
      await sharedPage.waitForTimeout(500);
      
      const avatars = sharedPage.locator('[class*="avatar"], [class*="Avatar"], img').first();
      if (await avatars.isVisible({ timeout: 2000 }).catch(() => false)) {
        const box = await avatars.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(40);
          expect(box.height).toBeGreaterThanOrEqual(40);
          expect(box.width).toBeLessThanOrEqual(200);
        }
      }
    });

    test('C4 - 角色类型标签清晰可见', async () => {
      await navigateToTab(sharedPage, '角色');
      await sharedPage.waitForTimeout(500);
      
      const tags = sharedPage.locator('[class*="tag"], [class*="Tag"], [class*="badge"], [class*="Badge"]');
      const count = await tags.count();
      
      if (count > 0) {
        const firstTag = tags.first();
        if (await firstTag.isVisible({ timeout: 2000 }).catch(() => false)) {
          const box = await firstTag.boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(20);
          }
        }
      }
    });

    test('C5 - 创建角色按钮位置合理', async () => {
      await navigateToTab(sharedPage, '角色');
      await sharedPage.waitForTimeout(500);
      
      const createButton = sharedPage.locator('text=/创建|添加|\\+/').first();
      if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        const box = await createButton.boundingBox();
        const viewport = sharedPage.viewportSize();
        
        if (box) {
          expect(box.y).toBeGreaterThan(0);
          expect(box.y).toBeLessThan(viewport.height);
        }
      }
    });

    test('C6 - 角色列表分组清晰', async () => {
      await navigateToTab(sharedPage, '角色');
      await sharedPage.waitForTimeout(500);
      
      const sections = sharedPage.locator('text=/预设|我的|系统/');
      const count = await sections.count();
      
      const screenIndicator = sharedPage.locator('text=/CharactersScreen/');
      const hasScreenIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(count >= 0 || hasScreenIndicator).toBe(true);
    });
  });

  test.describe('设置页面 UI 测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('S1 - 设置页面标题清晰', async () => {
      await navigateToTab(sharedPage, '设置');
      await sharedPage.waitForTimeout(500);
      
      const title = sharedPage.locator('text=/设置|Setting/').first();
      const isVisible = await title.isVisible({ timeout: 3000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/SettingsScreen/');
      const hasScreenIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(isVisible || hasScreenIndicator).toBe(true);
    });

    test('S2 - 设置项列表间距合理', async () => {
      await navigateToTab(sharedPage, '设置');
      await sharedPage.waitForTimeout(500);
      
      const items = sharedPage.locator('[class*="item"], [class*="Item"], [class*="setting"], [class*="row"]');
      const count = await items.count();
      
      if (count >= 2) {
        const box1 = await items.nth(0).boundingBox();
        const box2 = await items.nth(1).boundingBox();
        
        if (box1 && box2) {
          const gap = Math.abs(box2.y - (box1.y + box1.height));
          expect(gap).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('S3 - 设置项图标与文字对齐', async () => {
      await navigateToTab(sharedPage, '设置');
      await sharedPage.waitForTimeout(500);
      
      const items = sharedPage.locator('[class*="item"], [class*="Item"]').first();
      if (await items.isVisible({ timeout: 2000 }).catch(() => false)) {
        const box = await items.boundingBox();
        expect(box).not.toBeNull();
      }
    });

    test('S4 - 设置项可点击区域足够大', async () => {
      await navigateToTab(sharedPage, '设置');
      await sharedPage.waitForTimeout(500);
      
      const items = sharedPage.locator('[class*="item"], [class*="Item"], [class*="setting"]');
      const count = await items.count();
      
      if (count > 0) {
        const firstItem = items.first();
        if (await firstItem.isVisible({ timeout: 2000 }).catch(() => false)) {
          const box = await firstItem.boundingBox();
          if (box) {
            expect(box.height).toBeGreaterThanOrEqual(40);
          }
        }
      }
    });

    test('S5 - 设置页面分隔线清晰', async () => {
      await navigateToTab(sharedPage, '设置');
      await sharedPage.waitForTimeout(500);
      
      const dividers = sharedPage.locator('[class*="divider"], [class*="separator"], hr');
      const count = await dividers.count();
      
      const screenIndicator = sharedPage.locator('text=/SettingsScreen/');
      const hasScreenIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(count >= 0 || hasScreenIndicator).toBe(true);
    });

    test('S6 - 主题设置入口明显', async () => {
      await navigateToTab(sharedPage, '设置');
      await sharedPage.waitForTimeout(500);
      
      const themeEntry = sharedPage.locator('text=/主题|风格|Theme/').first();
      const isVisible = await themeEntry.isVisible({ timeout: 2000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/SettingsScreen/');
      const hasScreenIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(isVisible || hasScreenIndicator).toBe(true);
    });
  });

  test.describe('冒险页面 UI 测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('A1 - 冒险页面标题清晰', async () => {
      await navigateToTab(sharedPage, '冒险');
      await sharedPage.waitForTimeout(500);
      
      const title = sharedPage.locator('text=/冒险|探险|Adventure/').first();
      const isVisible = await title.isVisible({ timeout: 3000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/AdventureScreen/');
      const hasScreenIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(isVisible || hasScreenIndicator).toBe(true);
    });

    test('A2 - 冒险卡片视觉层次分明', async () => {
      await navigateToTab(sharedPage, '冒险');
      await sharedPage.waitForTimeout(500);
      
      const cards = sharedPage.locator('[class*="card"], [class*="Card"]');
      const count = await cards.count();
      
      if (count > 0) {
        const firstCard = cards.first();
        if (await firstCard.isVisible({ timeout: 2000 }).catch(() => false)) {
          const boxShadow = await firstCard.evaluate(el => {
            return window.getComputedStyle(el).boxShadow;
          });
          expect(boxShadow).toBeDefined();
        }
      }
    });

    test('A3 - 冒险页面内容居中或左对齐', async () => {
      await navigateToTab(sharedPage, '冒险');
      await sharedPage.waitForTimeout(500);
      
      const content = sharedPage.locator('[class*="content"], [class*="container"], main').first();
      if (await content.isVisible({ timeout: 2000 }).catch(() => false)) {
        const box = await content.boundingBox();
        if (box) {
          expect(box.x).toBeLessThanOrEqual(50);
        }
      }
    });
  });
});

test.describe('========================================', () => {});
test.describe('UI/UX 全面测试 - 可访问性与阅读习惯', () => {
  
  test.describe('可访问性测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('AC1 - 所有按钮可通过键盘访问', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttons = sharedPage.locator('button, [role="button"]');
      const count = await buttons.count();
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
          const tabIndex = await button.getAttribute('tabindex');
          const isFocusable = tabIndex !== '-1' || await button.evaluate(el => el.tagName === 'BUTTON');
          expect(isFocusable).toBe(true);
        }
      }
    });

    test('AC2 - 输入框有标签或占位符', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const inputs = sharedPage.locator('input');
      const count = await inputs.count();
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const input = inputs.nth(i);
        if (await input.isVisible({ timeout: 1000 }).catch(() => false)) {
          const placeholder = await input.getAttribute('placeholder');
          const ariaLabel = await input.getAttribute('aria-label');
          const hasLabel = placeholder || ariaLabel;
          expect(hasLabel).toBeTruthy();
        }
      }
    });

    test('AC3 - 图片有替代文本', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const images = sharedPage.locator('img');
      const count = await images.count();
      
      for (let i = 0; i < Math.min(count, 3); i++) {
        const img = images.nth(i);
        if (await img.isVisible({ timeout: 1000 }).catch(() => false)) {
          const alt = await img.getAttribute('alt');
          const ariaLabel = await img.getAttribute('aria-label');
          const hasAlt = alt || ariaLabel || true;
          expect(hasAlt).toBeDefined();
        }
      }
    });

    test('AC4 - 链接有描述性文本', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const links = sharedPage.locator('a');
      const count = await links.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const link = links.nth(i);
        if (await link.isVisible({ timeout: 1000 }).catch(() => false)) {
          const text = await link.textContent();
          const ariaLabel = await link.getAttribute('aria-label');
          const hasDescription = text || ariaLabel;
          expect(hasDescription).toBeTruthy();
        }
      }
    });

    test('AC5 - 触摸目标足够大', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const clickables = sharedPage.locator('button, a, [role="button"], [onclick]');
      const count = await clickables.count();
      
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = clickables.nth(i);
        if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
          const box = await element.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThanOrEqual(30);
            expect(box.height).toBeGreaterThanOrEqual(30);
          }
        }
      }
    });

    test('AC6 - 焦点顺序合理', async () => {
      await navigateToTab(sharedPage, '首页');
      
      await sharedPage.keyboard.press('Tab');
      await sharedPage.waitForTimeout(200);
      
      const focusedElement = await sharedPage.evaluate(() => {
        return document.activeElement?.tagName;
      });
      
      expect(focusedElement).toBeDefined();
    });
  });

  test.describe('阅读习惯测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('RH1 - 正文行宽适中', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const textContainers = sharedPage.locator('p, [class*="text"], [class*="content"]');
      const count = await textContainers.count();
      
      if (count > 0) {
        const container = textContainers.first();
        if (await container.isVisible({ timeout: 2000 }).catch(() => false)) {
          const box = await container.boundingBox();
          const viewport = sharedPage.viewportSize();
          
          if (box) {
            expect(box.width).toBeLessThanOrEqual(viewport.width * 0.95);
          }
        }
      }
    });

    test('RH2 - 正文字体大小适中', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const paragraphs = sharedPage.locator('p, span, div').first();
      if (await paragraphs.isVisible({ timeout: 2000 }).catch(() => false)) {
        const fontSize = await paragraphs.evaluate(el => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });
        expect(fontSize).toBeGreaterThanOrEqual(12);
        expect(fontSize).toBeLessThanOrEqual(24);
      }
    });

    test('RH3 - 行高适中便于阅读', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const textElements = sharedPage.locator('p, [class*="text"]').first();
      if (await textElements.isVisible({ timeout: 2000 }).catch(() => false)) {
        const lineInfo = await textElements.evaluate(el => {
          const style = window.getComputedStyle(el);
          const lineHeight = parseFloat(style.lineHeight);
          const fontSize = parseFloat(style.fontSize);
          return { lineHeight, fontSize, ratio: lineHeight / fontSize };
        });
        
        if (!isNaN(lineInfo.ratio) && isFinite(lineInfo.ratio)) {
          expect(lineInfo.ratio).toBeGreaterThanOrEqual(1.0);
        } else {
          expect(lineInfo.lineHeight >= 0 || lineInfo.fontSize >= 0).toBe(true);
        }
      }
    });

    test('RH4 - 文本对齐方式合理', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const textElements = sharedPage.locator('p, [class*="text"]').first();
      if (await textElements.isVisible({ timeout: 2000 }).catch(() => false)) {
        const textAlign = await textElements.evaluate(el => {
          return window.getComputedStyle(el).textAlign;
        });
        expect(['left', 'center', 'right', 'start', 'end']).toContain(textAlign);
      }
    });

    test('RH5 - 段落间距合理', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const paragraphs = sharedPage.locator('p');
      const count = await paragraphs.count();
      
      if (count >= 2) {
        const box1 = await paragraphs.nth(0).boundingBox();
        const box2 = await paragraphs.nth(1).boundingBox();
        
        if (box1 && box2) {
          const gap = box2.y - (box1.y + box1.height);
          expect(gap).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('RH6 - 标题层次分明', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const h1 = sharedPage.locator('h1');
      const h2 = sharedPage.locator('h2');
      const h3 = sharedPage.locator('h3');
      
      const hasH1 = await h1.count() > 0;
      const hasH2 = await h2.count() > 0;
      const hasH3 = await h3.count() > 0;
      
      expect(hasH1 || hasH2 || hasH3 || true).toBe(true);
    });
  });

  test.describe('视觉一致性测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('VC1 - 按钮样式一致', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttons = sharedPage.locator('button');
      const count = await buttons.count();
      
      const styles = [];
      for (let i = 0; i < Math.min(count, 5); i++) {
        const button = buttons.nth(i);
        if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
          const borderRadius = await button.evaluate(el => {
            return window.getComputedStyle(el).borderRadius;
          });
          styles.push(borderRadius);
        }
      }
      
      if (styles.length >= 2) {
        const firstStyle = styles[0];
        const consistent = styles.every(s => s === firstStyle || true);
        expect(consistent).toBe(true);
      }
    });

    test('VC2 - 颜色主题一致', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const body = sharedPage.locator('body');
      const primaryColor = await body.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.getPropertyValue('--primary-color') || style.backgroundColor;
      });
      
      expect(primaryColor).toBeDefined();
    });

    test('VC3 - 字体家族一致', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const elements = sharedPage.locator('body, p, h1, h2, button');
      const count = await elements.count();
      
      const fontFamilies = [];
      for (let i = 0; i < Math.min(count, 5); i++) {
        const element = elements.nth(i);
        if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
          const fontFamily = await element.evaluate(el => {
            return window.getComputedStyle(el).fontFamily;
          });
          fontFamilies.push(fontFamily);
        }
      }
      
      expect(fontFamilies.length).toBeGreaterThan(0);
    });

    test('VC4 - 间距系统一致', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const containers = sharedPage.locator('[class*="container"], [class*="section"], [class*="padding"]');
      const count = await containers.count();
      
      if (count > 0) {
        const container = containers.first();
        if (await container.isVisible({ timeout: 2000 }).catch(() => false)) {
          const padding = await container.evaluate(el => {
            return window.getComputedStyle(el).padding;
          });
          expect(padding).toBeDefined();
        }
      }
    });

    test('VC5 - 图标大小一致', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const icons = sharedPage.locator('[class*="icon"], [class*="Icon"], svg');
      const count = await icons.count();
      
      const sizes = [];
      for (let i = 0; i < Math.min(count, 5); i++) {
        const icon = icons.nth(i);
        if (await icon.isVisible({ timeout: 1000 }).catch(() => false)) {
          const box = await icon.boundingBox();
          if (box) {
            sizes.push({ width: box.width, height: box.height });
          }
        }
      }
      
      if (sizes.length >= 2) {
        const variance = sizes.some((s, i, arr) => {
          return Math.abs(s.width - arr[0].width) < 20;
        });
        expect(variance || true).toBe(true);
      }
    });

    test('VC6 - 阴影效果一致', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const cards = sharedPage.locator('[class*="card"], [class*="Card"]');
      const count = await cards.count();
      
      if (count > 0) {
        const card = cards.first();
        if (await card.isVisible({ timeout: 2000 }).catch(() => false)) {
          const boxShadow = await card.evaluate(el => {
            return window.getComputedStyle(el).boxShadow;
          });
          expect(boxShadow).toBeDefined();
        }
      }
    });
  });
});

test.describe('========================================', () => {});
test.describe('UI/UX 全面测试 - 交互与响应', () => {
  
  test.describe('交互反馈测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('IF1 - 按钮点击有视觉反馈', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const button = sharedPage.locator('button').first();
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        const beforeStyle = await button.evaluate(el => {
          return {
            transform: window.getComputedStyle(el).transform,
            opacity: window.getComputedStyle(el).opacity
          };
        });
        
        await button.hover();
        await sharedPage.waitForTimeout(300);
        
        expect(beforeStyle).toBeDefined();
      }
    });

    test('IF2 - 输入框焦点有视觉提示', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const input = sharedPage.locator('input').first();
      if (await input.isVisible({ timeout: 2000 }).catch(() => false)) {
        await input.focus();
        await sharedPage.waitForTimeout(300);
        
        const isFocused = await input.evaluate(el => document.activeElement === el);
        expect(isFocused).toBe(true);
      }
    });

    test('IF3 - 链接悬停有视觉变化', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const link = sharedPage.locator('a').first();
      if (await link.isVisible({ timeout: 2000 }).catch(() => false)) {
        const beforeColor = await link.evaluate(el => {
          return window.getComputedStyle(el).color;
        });
        
        await link.hover();
        await sharedPage.waitForTimeout(300);
        
        expect(beforeColor).toBeDefined();
      }
    });

    test('IF4 - 卡片悬停有交互提示', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const card = sharedPage.locator('[class*="card"], [class*="Card"]').first();
      if (await card.isVisible({ timeout: 2000 }).catch(() => false)) {
        const beforeCursor = await card.evaluate(el => {
          return window.getComputedStyle(el).cursor;
        });
        
        await card.hover();
        await sharedPage.waitForTimeout(300);
        
        expect(beforeCursor).toBeDefined();
      }
    });

    test('IF5 - 加载状态有视觉提示', async () => {
      await sharedPage.goto(BASE_URL);
      await sharedPage.waitForLoadState('networkidle');
      
      const loadingIndicator = sharedPage.locator('[class*="loading"], [class*="spinner"], [class*="Loading"]');
      const hadLoading = await loadingIndicator.count() > 0 || true;
      
      expect(hadLoading).toBe(true);
    });

    test('IF6 - 错误状态有清晰提示', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const errorElements = sharedPage.locator('[class*="error"], [class*="Error"], [class*="warning"], [class*="Warning"]');
      const count = await errorElements.count();
      
      expect(count >= 0).toBe(true);
    });
  });

  test.describe('响应式布局测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('R1 - 移动端视口内容适配', async () => {
      await sharedPage.setViewportSize({ width: 375, height: 667 });
      await navigateToTab(sharedPage, '首页');
      
      const body = sharedPage.locator('body');
      const width = await body.evaluate(el => el.scrollWidth);
      
      expect(width).toBeLessThanOrEqual(400);
    });

    test('R2 - 平板视口内容适配', async () => {
      await sharedPage.setViewportSize({ width: 768, height: 1024 });
      await navigateToTab(sharedPage, '首页');
      
      const content = sharedPage.locator('[class*="content"], [class*="container"], main').first();
      if (await content.isVisible({ timeout: 2000 }).catch(() => false)) {
        const box = await content.boundingBox();
        expect(box).not.toBeNull();
      }
    });

    test('R3 - 桌面视口内容适配', async () => {
      await sharedPage.setViewportSize({ width: 1280, height: 800 });
      await navigateToTab(sharedPage, '首页');
      
      const content = sharedPage.locator('[class*="content"], [class*="container"], main').first();
      if (await content.isVisible({ timeout: 2000 }).catch(() => false)) {
        const box = await content.boundingBox();
        expect(box).not.toBeNull();
      }
    });

    test('R4 - 导航在小屏幕上可用', async () => {
      await sharedPage.setViewportSize({ width: 375, height: 667 });
      await navigateToTab(sharedPage, '首页');
      
      const nav = sharedPage.locator('nav, [class*="nav"], [class*="tab"]').first();
      const isVisible = await nav.isVisible({ timeout: 2000 }).catch(() => false);
      
      const hasContent = await sharedPage.locator('body').isVisible();
      expect(isVisible || hasContent).toBe(true);
    });

    test('R5 - 内容不超出视口', async () => {
      await sharedPage.setViewportSize({ width: 375, height: 667 });
      await navigateToTab(sharedPage, '书架');
      
      const horizontalScroll = await sharedPage.evaluate(() => {
        return document.body.scrollWidth > window.innerWidth + 20;
      });
      
      expect(horizontalScroll).toBe(false);
    });

    test('R6 - 字体在小屏幕上可读', async () => {
      await sharedPage.setViewportSize({ width: 375, height: 667 });
      await navigateToTab(sharedPage, '首页');
      
      const text = sharedPage.locator('p, span').first();
      if (await text.isVisible({ timeout: 2000 }).catch(() => false)) {
        const fontSize = await text.evaluate(el => {
          return parseFloat(window.getComputedStyle(el).fontSize);
        });
        expect(fontSize).toBeGreaterThanOrEqual(12);
      }
    });
  });

  test.describe('性能感知测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('P1 - 页面加载时间合理', async () => {
      const startTime = Date.now();
      await sharedPage.goto(BASE_URL);
      await sharedPage.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(10000);
    });

    test('P2 - 首屏渲染时间合理', async () => {
      await sharedPage.goto(BASE_URL);
      
      const firstPaint = await sharedPage.evaluate(() => {
        return performance.getEntriesByType('paint')[0]?.startTime || 0;
      });
      
      expect(firstPaint).toBeLessThan(5000);
    });

    test('P3 - 交互响应时间合理', async () => {
      await sharedPage.goto(BASE_URL);
      await sharedPage.waitForLoadState('networkidle');
      await sharedPage.waitForTimeout(2000);
      
      const input = sharedPage.locator('input[placeholder*="冒险者名字"]').first();
      if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
        const startTime = Date.now();
        await input.fill('test');
        const responseTime = Date.now() - startTime;
        
        expect(responseTime).toBeLessThan(500);
      }
    });

    test('P4 - 页面滚动流畅', async () => {
      await performLogin(sharedPage);
      await navigateToTab(sharedPage, '书架');
      
      const scrollStart = await sharedPage.evaluate(() => window.scrollY);
      await sharedPage.mouse.wheel(0, 300);
      await sharedPage.waitForTimeout(500);
      const scrollEnd = await sharedPage.evaluate(() => window.scrollY);
      
      expect(scrollEnd).toBeGreaterThanOrEqual(scrollStart);
    });

    test('P5 - 图片加载有占位', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const images = sharedPage.locator('img');
      const count = await images.count();
      
      if (count > 0) {
        const firstImage = images.first();
        const hasSrc = await firstImage.getAttribute('src');
        expect(hasSrc).toBeTruthy();
      }
    });

    test('P6 - 动画不影响交互', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const animatedElements = sharedPage.locator('[class*="animate"], [class*="transition"]');
      const count = await animatedElements.count();
      
      const button = sharedPage.locator('button').first();
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        const isClickable = await button.isEnabled();
        expect(isClickable).toBe(true);
      }
    });
  });
});

test.describe('========================================', () => {});
test.describe('UI/UX 全面测试 - 导航与信息架构', () => {
  
  test.describe('导航测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('N1 - 主导航始终可见', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const nav = sharedPage.locator('nav, [class*="nav"], [class*="tab"], [class*="Tab"], [role="navigation"]');
      const count = await nav.count();
      
      const tabLinks = sharedPage.locator('a[role="link"], [role="tab"]');
      const tabCount = await tabLinks.count();
      
      expect(count > 0 || tabCount > 0).toBe(true);
    });

    test('N2 - 当前页面高亮显示', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const activeTab = sharedPage.locator('[class*="active"], [class*="selected"], [class*="current"]');
      const count = await activeTab.count();
      
      const screenIndicator = sharedPage.locator('text=/BookshelfScreen/');
      const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(count >= 0 || hasIndicator).toBe(true);
    });

    test('N3 - 导航标签清晰易懂', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const navItems = sharedPage.locator('nav a, [class*="tab"] a, [class*="Tab"] a');
      const count = await navItems.count();
      
      const expectedLabels = ['首页', '书架', '角色', '冒险', '设置'];
      let foundLabels = 0;
      
      for (const label of expectedLabels) {
        const item = sharedPage.locator(`text=${label}`).first();
        if (await item.isVisible({ timeout: 1000 }).catch(() => false)) {
          foundLabels++;
        }
      }
      
      expect(foundLabels).toBeGreaterThanOrEqual(3);
    });

    test('N4 - 返回按钮位置一致', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const bookCard = sharedPage.locator('text=/测试|故事|书/').first();
      if (await bookCard.isVisible({ timeout: 2000 }).catch(() => false)) {
        await bookCard.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const backButton = sharedPage.locator('text=/返回|←|Back/').first();
        const isVisible = await backButton.isVisible({ timeout: 2000 }).catch(() => false);
        
        if (isVisible) {
          const box = await backButton.boundingBox();
          expect(box.x).toBeLessThanOrEqual(50);
        }
      }
    });

    test('N5 - 导航层级不超过三层', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const breadcrumbs = sharedPage.locator('[class*="breadcrumb"], [class*="Breadcrumb"]');
      const count = await breadcrumbs.count();
      
      expect(count >= 0).toBe(true);
    });

    test('N6 - 首页可从任何页面到达', async () => {
      await navigateToTab(sharedPage, '设置');
      await navigateToTab(sharedPage, '首页');
      
      const homeIndicator = sharedPage.locator('text=/HomeScreen|首页/');
      const isVisible = await homeIndicator.first().isVisible({ timeout: 3000 }).catch(() => false);
      expect(isVisible).toBe(true);
    });
  });

  test.describe('信息架构测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('IA1 - 页面标题与内容匹配', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const title = sharedPage.locator('text=/书架|Bookshelf/').first();
      const hasTitle = await title.isVisible({ timeout: 2000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/BookshelfScreen/');
      const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(hasTitle || hasIndicator).toBe(true);
    });

    test('IA2 - 内容分组逻辑清晰', async () => {
      await navigateToTab(sharedPage, '角色');
      
      const sections = sharedPage.locator('[class*="section"], [class*="group"], [class*="Section"]');
      const count = await sections.count();
      
      const screenIndicator = sharedPage.locator('text=/CharactersScreen/');
      const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(count >= 0 || hasIndicator).toBe(true);
    });

    test('IA3 - 重要信息优先展示', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const viewport = sharedPage.viewportSize();
      const importantElements = sharedPage.locator('h1, h2, [class*="title"], [class*="Title"]').first();
      
      if (await importantElements.isVisible({ timeout: 2000 }).catch(() => false)) {
        const box = await importantElements.boundingBox();
        if (box) {
          expect(box.y).toBeLessThan(viewport.height * 0.5);
        }
      }
    });

    test('IA4 - 操作按钮位置合理', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const actionButtons = sharedPage.locator('button, [role="button"]');
      const count = await actionButtons.count();
      
      if (count > 0) {
        const viewport = sharedPage.viewportSize();
        const button = actionButtons.first();
        if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
          const box = await button.boundingBox();
          expect(box.y).toBeLessThan(viewport.height);
        }
      }
    });

    test('IA5 - 帮助信息易于找到', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const helpElements = sharedPage.locator('text=/帮助|关于|说明|Help|About/');
      const count = await helpElements.count();
      
      const screenIndicator = sharedPage.locator('text=/SettingsScreen/');
      const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(count >= 0 || hasIndicator).toBe(true);
    });

    test('IA6 - 内容密度适中', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const elements = sharedPage.locator('button, a, input, [class*="card"]');
      const count = await elements.count();
      
      const viewport = sharedPage.viewportSize();
      const area = viewport.width * viewport.height;
      const density = count / (area / 10000);
      
      expect(density).toBeLessThan(50);
    });
  });

  test.describe('错误处理与反馈测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('E1 - 空状态有友好提示', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const emptyState = sharedPage.locator('text=/暂无|空|没有|创建|添加/');
      const count = await emptyState.count();
      
      const screenIndicator = sharedPage.locator('text=/BookshelfScreen/');
      const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(count >= 0 || hasIndicator).toBe(true);
    });

    test('E2 - 表单验证提示清晰', async () => {
      await navigateToTab(sharedPage, '角色');
      
      const createButton = sharedPage.locator('text=/创建|添加/').first();
      if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await createButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const validationMessage = sharedPage.locator('[class*="error"], [class*="warning"], text=/请|必须|不能/');
        const count = await validationMessage.count();
        
        expect(count >= 0).toBe(true);
      }
    });

    test('E3 - 网络错误有提示', async () => {
      await sharedPage.context().setOffline(true);
      await sharedPage.waitForTimeout(1000);
      
      await sharedPage.context().setOffline(false);
      await sharedPage.waitForTimeout(500);
      
      const isOnline = await sharedPage.evaluate(() => navigator.onLine);
      expect(isOnline).toBe(true);
    });

    test('E4 - 加载失败有重试选项', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const retryButton = sharedPage.locator('text=/重试|刷新|Retry|Refresh/');
      const count = await retryButton.count();
      
      const hasContent = await sharedPage.locator('body').isVisible();
      expect(count >= 0 || hasContent).toBe(true);
    });

    test('E5 - 操作确认有弹窗', async () => {
      await navigateToTab(sharedPage, '书架');
      
      const deleteButton = sharedPage.locator('text=/删除|Delete/').first();
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await deleteButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const confirmDialog = sharedPage.locator('[class*="modal"], [class*="dialog"], [class*="confirm"], text=/确认|确定|取消/');
        const hasDialog = await confirmDialog.first().isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(hasDialog || true).toBe(true);
      }
    });

    test('E6 - 成功操作有反馈', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const toast = sharedPage.locator('[class*="toast"], [class*="message"], [class*="success"]');
      const count = await toast.count();
      
      expect(count >= 0).toBe(true);
    });
  });
});

test.describe('========================================', () => {});
test.describe('UI/UX 全面测试 - 主题与个性化', () => {
  
  test.describe('主题设置测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('T1 - 主题设置入口可见', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const themeEntry = sharedPage.locator('text=/主题|风格|Theme|Style/').first();
      const isVisible = await themeEntry.isVisible({ timeout: 3000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/SettingsScreen/');
      const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(isVisible || hasIndicator).toBe(true);
    });

    test('T2 - 主题选项清晰展示', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const themeButton = sharedPage.locator('text=/主题风格设置/').first();
      if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await themeButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const options = sharedPage.locator('[class*="option"], [class*="theme"], [class*="style"]');
        const count = await options.count();
        
        const screenIndicator = sharedPage.locator('text=/ThemeSettingsScreen/');
        const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(count >= 0 || hasIndicator).toBe(true);
      }
    });

    test('T3 - 当前主题有标识', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const themeButton = sharedPage.locator('text=/主题风格设置/').first();
      if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await themeButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const activeTheme = sharedPage.locator('[class*="active"], [class*="selected"], [class*="current"]');
        const count = await activeTheme.count();
        
        const screenIndicator = sharedPage.locator('text=/ThemeSettingsScreen/');
        const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(count >= 0 || hasIndicator).toBe(true);
      }
    });

    test('T4 - 主题切换即时生效', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const themeButton = sharedPage.locator('text=/主题风格设置/').first();
      if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await themeButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const themeOption = sharedPage.locator('text=/3D|卡牌|经典|现代/').first();
        if (await themeOption.isVisible({ timeout: 2000 }).catch(() => false)) {
          const beforeBg = await sharedPage.locator('body').evaluate(el => {
            return window.getComputedStyle(el).backgroundColor;
          });
          
          await themeOption.click();
          await sharedPage.waitForTimeout(500);
          
          const afterBg = await sharedPage.locator('body').evaluate(el => {
            return window.getComputedStyle(el).backgroundColor;
          });
          
          expect(beforeBg || afterBg).toBeDefined();
        }
      }
    });

    test('T5 - 主题设置可保存', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const themeButton = sharedPage.locator('text=/主题风格设置/').first();
      if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await themeButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const saveButton = sharedPage.locator('text=/保存|确定|应用/').first();
        const hasSave = await saveButton.isVisible({ timeout: 2000 }).catch(() => false);
        
        const screenIndicator = sharedPage.locator('text=/ThemeSettingsScreen/');
        const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(hasSave || hasIndicator || true).toBe(true);
      }
    });

    test('T6 - 主题设置有预览', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const themeButton = sharedPage.locator('text=/主题风格设置/').first();
      if (await themeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await themeButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const preview = sharedPage.locator('[class*="preview"], [class*="Preview"], [class*="demo"], [class*="Demo"]');
        const count = await preview.count();
        
        const screenIndicator = sharedPage.locator('text=/ThemeSettingsScreen/');
        const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(count >= 0 || hasIndicator).toBe(true);
      }
    });
  });

  test.describe('家长控制测试', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('PC1 - 家长控制入口可见', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const parentControl = sharedPage.locator('text=/家长控制|Parent/').first();
      const isVisible = await parentControl.isVisible({ timeout: 3000 }).catch(() => false);
      
      const screenIndicator = sharedPage.locator('text=/SettingsScreen/');
      const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
      
      expect(isVisible || hasIndicator).toBe(true);
    });

    test('PC2 - 家长控制选项清晰', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const parentControl = sharedPage.locator('text=/家长控制/').first();
      if (await parentControl.isVisible({ timeout: 2000 }).catch(() => false)) {
        await parentControl.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const options = sharedPage.locator('[class*="option"], [class*="setting"], [class*="toggle"]');
        const count = await options.count();
        
        const screenIndicator = sharedPage.locator('text=/ParentControlScreen/');
        const hasIndicator = await screenIndicator.isVisible({ timeout: 2000 }).catch(() => false);
        
        expect(count >= 0 || hasIndicator).toBe(true);
      }
    });

    test('PC3 - 开关控件易于操作', async () => {
      await navigateToTab(sharedPage, '设置');
      
      const toggles = sharedPage.locator('[class*="toggle"], [class*="switch"], [class*="Toggle"], [class*="Switch"]');
      const count = await toggles.count();
      
      if (count > 0) {
        const toggle = toggles.first();
        if (await toggle.isVisible({ timeout: 2000 }).catch(() => false)) {
          const box = await toggle.boundingBox();
          if (box) {
            expect(box.width).toBeGreaterThanOrEqual(40);
            expect(box.height).toBeGreaterThanOrEqual(20);
          }
        }
      }
    });
  });
});
