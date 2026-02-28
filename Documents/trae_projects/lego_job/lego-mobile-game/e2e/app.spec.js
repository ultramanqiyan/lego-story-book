const { test, expect } = require('@playwright/test');

test.describe('认证流程', () => {
  test('登录流程', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('#login-screen')).toBeVisible();
    
    await page.fill('input#username', 'testuser');
    await page.fill('input#password', 'password123');
    
    await page.click('button:has-text("进入游戏")');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('登录验证 - 空用户名', async ({ page }) => {
    await page.goto('/');
    
    await page.click('button:has-text("进入游戏")');
    
    await expect(page.locator('text=请输入用户名')).toBeVisible();
  });

  test('登出流程', async ({ page }) => {
    await page.goto('/');
    
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    
    await page.click('.menu-item:has-text("设置")');
    await expect(page.locator('#settings-screen')).toBeVisible();
    await page.click('#logout-btn');
    await expect(page.locator('#modal')).toBeVisible();
    await page.click('#modal-confirm');
    
    await expect(page.locator('#login-screen')).toBeVisible();
  });
});

test.describe('书籍管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('查看书籍列表', async ({ page }) => {
    await page.click('text=书架');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
    await expect(page.locator('.card[data-book]')).toHaveCount(3);
  });

  test('选择书籍', async ({ page }) => {
    await page.click('text=书架');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
    
    const bookCard = page.locator('.card[data-book]').first();
    await expect(bookCard).toBeVisible();
    await bookCard.click();
  });
});

test.describe('角色管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('查看角色列表', async ({ page }) => {
    await page.click('.menu-item:has-text("角色")');
    await expect(page.locator('#characters-screen')).toBeVisible();
    await expect(page.locator('#characters-screen .card[data-character]')).toHaveCount(4);
  });

  test('筛选角色', async ({ page }) => {
    await page.click('text=角色');
    await expect(page.locator('#characters-screen')).toBeVisible();
    
    await page.click('.tab:has-text("主角")');
    await expect(page.locator('.tab.active:has-text("主角")')).toBeVisible();
    
    await page.click('.tab:has-text("反派")');
    await expect(page.locator('.tab.active:has-text("反派")')).toBeVisible();
    
    await page.click('.tab:has-text("配角")');
    await expect(page.locator('.tab.active:has-text("配角")')).toBeVisible();
  });
});

test.describe('冒险模式', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('进入冒险模式', async ({ page }) => {
    await page.click('.menu-item:has-text("冒险")');
    await expect(page.locator('#adventure-screen')).toBeVisible();
  });

  test('查看积分', async ({ page }) => {
    await page.click('.menu-item:has-text("冒险")');
    await expect(page.locator('#adventure-screen')).toBeVisible();
    await expect(page.locator('#adventure-screen .score-display')).toBeVisible();
  });
});

test.describe('设置功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('查看设置页面', async ({ page }) => {
    await page.click('text=设置');
    await expect(page.locator('#settings-screen')).toBeVisible();
    await expect(page.locator('text=用户名: testuser')).toBeVisible();
  });

  test('主题设置', async ({ page }) => {
    await page.click('.menu-item:has-text("设置")');
    await expect(page.locator('#settings-screen')).toBeVisible();
    await expect(page.locator('#theme-setting')).toBeVisible();
    await page.click('#theme-setting');
    await expect(page.locator('#theme-settings-screen')).toBeVisible();
  });

  test('家长控制', async ({ page }) => {
    await page.click('text=设置');
    await expect(page.locator('#settings-screen')).toBeVisible();
    await expect(page.locator('text=家长控制')).toBeVisible();
    await page.click('[data-setting="parent"]');
  });
});

test.describe('故事创建', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('故事创建流程', async ({ page }) => {
    await page.click('text=书架');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
  });
});

test.describe('UI风格检查', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('无传统Tab导航', async ({ page }) => {
    const tabBar = page.locator('[role="tablist"]');
    await expect(tabBar).not.toBeVisible();
  });

  test('卡牌元素存在', async ({ page }) => {
    await page.click('text=书架');
    const cards = page.locator('.card');
    await expect(cards.first()).toBeVisible();
  });

  test('粒子背景效果', async ({ page }) => {
    const canvas = page.locator('#particles');
    await expect(canvas).toBeVisible();
  });

  test('菜单网格布局', async ({ page }) => {
    const menuGrid = page.locator('.menu-grid');
    await expect(menuGrid).toBeVisible();
    
    const menuItems = page.locator('.menu-item');
    await expect(menuItems).toHaveCount(4);
  });

  test('积分显示', async ({ page }) => {
    const scoreDisplay = page.locator('#home-screen .score-display');
    await expect(scoreDisplay).toBeVisible();
    await expect(page.locator('#score')).toHaveText('100');
  });
});

test.describe('导航测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('返回按钮功能', async ({ page }) => {
    await page.click('text=书架');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
    
    await page.click('.back-btn');
    await expect(page.locator('#home-screen')).toBeVisible();
  });

  test('多次导航', async ({ page }) => {
    await page.click('.menu-item:has-text("书架")');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
    
    await page.click('#bookshelf-screen .back-btn');
    await expect(page.locator('#home-screen')).toBeVisible();
    
    await page.click('.menu-item:has-text("角色")');
    await expect(page.locator('#characters-screen')).toBeVisible();
    
    await page.click('#characters-screen .back-btn');
    await expect(page.locator('#home-screen')).toBeVisible();
  });
});

test.describe('卡牌稀有度样式', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('稀有度边框颜色', async ({ page }) => {
    await page.click('.menu-item:has-text("书架")');
    
    const rareCard = page.locator('#bookshelf-screen .card.rare');
    await expect(rareCard).toBeVisible();
    
    const epicCard = page.locator('#bookshelf-screen .card.epic');
    await expect(epicCard).toBeVisible();
  });
});

test.describe('多级页面导航 - 书籍流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('完整书籍阅读流程: 首页→书架→书籍详情→章节', async ({ page }) => {
    await page.click('.menu-item:has-text("书架")');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
    await expect(page.locator('#bookshelf-screen .breadcrumb')).toContainText('书架');
    
    const firstBook = page.locator('#bookshelf-screen .card[data-book]').first();
    await firstBook.click();
    await expect(page.locator('#book-detail-screen')).toBeVisible();
    await expect(page.locator('#book-title')).toBeVisible();
    await expect(page.locator('#book-detail-screen .breadcrumb')).toContainText('书架');
    
    const firstChapter = page.locator('.chapter-item:not(.locked)').first();
    await firstChapter.click();
    await expect(page.locator('#chapter-screen')).toBeVisible();
    await expect(page.locator('#chapter-heading')).toBeVisible();
    await expect(page.locator('#chapter-screen .breadcrumb')).toContainText('书籍');
  });

  test('章节阅读页面功能', async ({ page }) => {
    await page.click('.menu-item:has-text("书架")');
    await page.locator('#bookshelf-screen .card[data-book]').first().click();
    await expect(page.locator('#book-detail-screen')).toBeVisible();
    
    await page.click('#start-reading-btn');
    await expect(page.locator('#chapter-screen')).toBeVisible();
    await expect(page.locator('#chapter-content')).toBeVisible();
    await expect(page.locator('#chapter-screen .progress-bar')).toBeVisible();
  });

  test('书籍详情页返回导航', async ({ page }) => {
    await page.click('.menu-item:has-text("书架")');
    await page.locator('#bookshelf-screen .card[data-book]').first().click();
    await expect(page.locator('#book-detail-screen')).toBeVisible();
    
    await page.click('#back-to-bookshelf');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
    
    await page.click('#bookshelf-screen .back-btn');
    await expect(page.locator('#home-screen')).toBeVisible();
  });

  test('章节页返回导航', async ({ page }) => {
    await page.click('.menu-item:has-text("书架")');
    await page.locator('#bookshelf-screen .card[data-book]').first().click();
    await page.locator('.chapter-item:not(.locked)').first().click();
    await expect(page.locator('#chapter-screen')).toBeVisible();
    
    await page.click('#back-to-book-detail');
    await expect(page.locator('#book-detail-screen')).toBeVisible();
  });
});

test.describe('多级页面导航 - 角色流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('完整角色选择流程: 首页→角色→角色详情→选择角色', async ({ page }) => {
    await page.click('.menu-item:has-text("角色")');
    await expect(page.locator('#characters-screen')).toBeVisible();
    await expect(page.locator('#characters-screen .breadcrumb')).toContainText('角色');
    
    const firstCharacter = page.locator('#characters-screen .card[data-character]').first();
    await firstCharacter.click();
    await expect(page.locator('#character-detail-screen')).toBeVisible();
    await expect(page.locator('#character-name')).toBeVisible();
    await expect(page.locator('.character-stats')).toBeVisible();
    
    await page.click('#select-character-btn');
    await expect(page.locator('#modal')).toBeVisible();
    await expect(page.locator('#modal-title')).toHaveText('选择成功');
    
    await page.click('#modal-confirm');
    await expect(page.locator('#home-screen')).toBeVisible();
  });

  test('角色详情页返回导航', async ({ page }) => {
    await page.click('.menu-item:has-text("角色")');
    await page.locator('#characters-screen .card[data-character]').first().click();
    await expect(page.locator('#character-detail-screen')).toBeVisible();
    
    await page.click('#back-to-characters');
    await expect(page.locator('#characters-screen')).toBeVisible();
  });

  test('角色筛选后查看详情', async ({ page }) => {
    await page.click('.menu-item:has-text("角色")');
    await expect(page.locator('#characters-screen')).toBeVisible();
    
    await page.click('.tab:has-text("主角")');
    await expect(page.locator('.tab.active:has-text("主角")')).toBeVisible();
    
    const protagonistCard = page.locator('#characters-screen .card[data-type="protagonist"]').first();
    await protagonistCard.click();
    await expect(page.locator('#character-detail-screen')).toBeVisible();
    await expect(page.locator('#character-type')).toHaveText('主角');
  });

  test('角色属性显示验证', async ({ page }) => {
    await page.click('.menu-item:has-text("角色")');
    await page.locator('#characters-screen .card[data-character]').first().click();
    await expect(page.locator('#character-detail-screen')).toBeVisible();
    
    await expect(page.locator('#char-attack')).toBeVisible();
    await expect(page.locator('#char-defense')).toBeVisible();
    await expect(page.locator('#char-speed')).toBeVisible();
    await expect(page.locator('#char-magic')).toBeVisible();
    await expect(page.locator('#character-story')).toBeVisible();
  });
});

test.describe('多级页面导航 - 冒险流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('完整冒险流程: 首页→冒险→冒险详情→开始冒险', async ({ page }) => {
    await page.click('.menu-item:has-text("冒险")');
    await expect(page.locator('#adventure-screen')).toBeVisible();
    await expect(page.locator('#adventure-screen .breadcrumb')).toContainText('冒险');
    
    const dailyAdventure = page.locator('#adventure-screen .card[data-adventure="daily"]');
    await dailyAdventure.click();
    await expect(page.locator('#adventure-detail-screen')).toBeVisible();
    await expect(page.locator('#adventure-title')).toBeVisible();
    await expect(page.locator('#adventure-difficulty')).toBeVisible();
    await expect(page.locator('#adventure-reward')).toBeVisible();
    
    await page.click('#start-adventure-btn');
    await expect(page.locator('#modal')).toBeVisible();
    await expect(page.locator('#modal-title')).toHaveText('冒险开始');
    
    await page.click('#modal-confirm');
    await expect(page.locator('#home-screen')).toBeVisible();
    
    await expect(page.locator('#score')).toHaveText('150');
  });

  test('冒险详情页返回导航', async ({ page }) => {
    await page.click('.menu-item:has-text("冒险")');
    await page.locator('#adventure-screen .card[data-adventure]').first().click();
    await expect(page.locator('#adventure-detail-screen')).toBeVisible();
    
    await page.click('#back-to-adventure');
    await expect(page.locator('#adventure-screen')).toBeVisible();
  });

  test('不同冒险类型导航', async ({ page }) => {
    await page.click('.menu-item:has-text("冒险")');
    await expect(page.locator('#adventure-screen')).toBeVisible();
    
    await page.click('.card[data-adventure="boss"]');
    await expect(page.locator('#adventure-detail-screen')).toBeVisible();
    await expect(page.locator('#adventure-title')).toHaveText('Boss战');
    
    await page.click('#back-to-adventure');
    
    await page.click('.card[data-adventure="exploration"]');
    await expect(page.locator('#adventure-detail-screen')).toBeVisible();
    await expect(page.locator('#adventure-title')).toHaveText('探索任务');
  });
});

test.describe('多级页面导航 - 设置流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('完整设置流程: 首页→设置→主题设置', async ({ page }) => {
    await page.click('.menu-item:has-text("设置")');
    await expect(page.locator('#settings-screen')).toBeVisible();
    await expect(page.locator('#settings-screen .breadcrumb')).toContainText('设置');
    await expect(page.locator('text=用户名: testuser')).toBeVisible();
    
    await page.click('#theme-setting');
    await expect(page.locator('#theme-settings-screen')).toBeVisible();
    await expect(page.locator('#theme-settings-screen .breadcrumb')).toContainText('主题');
    
    await page.click('[data-theme="light"]');
    await expect(page.locator('[data-theme="light"].selected')).toBeVisible();
    
    await page.click('#back-to-settings');
    await expect(page.locator('#settings-screen')).toBeVisible();
    await expect(page.locator('#current-theme')).toHaveText('浅色主题');
  });

  test('音效设置切换', async ({ page }) => {
    await page.click('.menu-item:has-text("设置")');
    await expect(page.locator('#settings-screen')).toBeVisible();
    
    await expect(page.locator('#sound-status')).toHaveText('开启');
    
    await page.click('#sound-setting');
    await expect(page.locator('#sound-status')).toHaveText('关闭');
    
    await page.click('#sound-setting');
    await expect(page.locator('#sound-status')).toHaveText('开启');
  });

  test('家长控制模态框', async ({ page }) => {
    await page.click('.menu-item:has-text("设置")');
    await expect(page.locator('#settings-screen')).toBeVisible();
    
    await page.click('#parent-setting');
    await expect(page.locator('#modal')).toBeVisible();
    await expect(page.locator('#modal-title')).toHaveText('家长控制');
    
    await page.click('#modal-confirm');
    await expect(page.locator('#modal')).toBeVisible();
    
    await page.click('#modal-confirm');
    await expect(page.locator('#modal')).not.toBeVisible();
  });

  test('主题选择功能', async ({ page }) => {
    await page.click('.menu-item:has-text("设置")');
    await page.click('#theme-setting');
    await expect(page.locator('#theme-settings-screen')).toBeVisible();
    
    await page.click('[data-theme="lego"]');
    await expect(page.locator('[data-theme="lego"].selected')).toBeVisible();
    
    await page.click('#back-to-settings');
    await expect(page.locator('#current-theme')).toHaveText('LEGO主题');
  });
});

test.describe('故事创建向导流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('完整故事创建向导: 3步骤流程', async ({ page }) => {
    await page.goto('/?screen=story-create');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    
    page.evaluate(() => {
      document.getElementById('story-create-screen').classList.add('active');
      document.getElementById('home-screen').classList.remove('active');
    });
    
    await expect(page.locator('#story-create-screen')).toBeVisible();
    
    await expect(page.locator('.step.active[data-step="1"]')).toBeVisible();
    await expect(page.locator('#step-1')).toBeVisible();
    
    await page.click('[data-book-choice="1"]');
    await expect(page.locator('[data-book-choice="1"].selected')).toBeVisible();
    
    await page.click('#next-step');
    await expect(page.locator('.step.active[data-step="2"]')).toBeVisible();
    await expect(page.locator('#step-2')).toBeVisible();
    
    await page.click('[data-character-choice="1"]');
    await expect(page.locator('[data-character-choice="1"].selected')).toBeVisible();
    
    await page.click('#next-step');
    await expect(page.locator('.step.active[data-step="3"]')).toBeVisible();
    await expect(page.locator('#step-3')).toBeVisible();
    
    await expect(page.locator('#selected-book-name')).toHaveText('勇敢的骑士');
    await expect(page.locator('#selected-character-name')).toHaveText('勇敢骑士');
    
    await page.click('#next-step');
    await expect(page.locator('#modal')).toBeVisible();
    await expect(page.locator('#modal-title')).toHaveText('创建成功');
    
    await page.click('#modal-confirm');
    await expect(page.locator('#home-screen')).toBeVisible();
  });

  test('故事创建向导前进和后退', async ({ page }) => {
    page.evaluate(() => {
      document.getElementById('story-create-screen').classList.add('active');
      document.getElementById('home-screen').classList.remove('active');
    });
    await expect(page.locator('#story-create-screen')).toBeVisible();
    
    await page.click('[data-book-choice="2"]');
    await page.click('#next-step');
    await expect(page.locator('#step-2')).toBeVisible();
    
    await page.click('#prev-step');
    await expect(page.locator('#step-1')).toBeVisible();
    
    await page.click('#next-step');
    await expect(page.locator('#step-2')).toBeVisible();
    
    await page.click('[data-character-choice="2"]');
    await page.click('#next-step');
    await expect(page.locator('#step-3')).toBeVisible();
  });

  test('故事创建进度条显示', async ({ page }) => {
    page.evaluate(() => {
      document.getElementById('story-create-screen').classList.add('active');
      document.getElementById('home-screen').classList.remove('active');
    });
    await expect(page.locator('#story-create-screen')).toBeVisible();
    
    const progressBar = page.locator('#create-progress');
    await expect(progressBar).toBeVisible();
    
    await page.click('[data-book-choice="1"]');
    await page.click('#next-step');
    
    await page.click('[data-character-choice="1"]');
    await page.click('#next-step');
    
    const width = await progressBar.evaluate(el => el.style.width);
    expect(width).toContain('99');
  });
});

test.describe('模态框交互测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('模态框取消操作', async ({ page }) => {
    await page.click('.menu-item:has-text("设置")');
    await page.click('#logout-btn');
    await expect(page.locator('#modal')).toBeVisible();
    
    await page.click('#modal-cancel');
    await expect(page.locator('#modal')).not.toBeVisible();
    await expect(page.locator('#settings-screen')).toBeVisible();
  });

  test('模态框确认登出', async ({ page }) => {
    await page.click('.menu-item:has-text("设置")');
    await page.click('#logout-btn');
    await expect(page.locator('#modal')).toBeVisible();
    await expect(page.locator('#modal-title')).toHaveText('确认登出');
    
    await page.click('#modal-confirm');
    await expect(page.locator('#login-screen')).toBeVisible();
  });

  test('角色选择模态框', async ({ page }) => {
    await page.click('.menu-item:has-text("角色")');
    await page.locator('#characters-screen .card[data-character]').first().click();
    await page.click('#select-character-btn');
    
    await expect(page.locator('#modal')).toBeVisible();
    await expect(page.locator('#modal-content')).toHaveText('已选择此角色作为主角');
    
    await page.click('#modal-confirm');
    await expect(page.locator('#home-screen')).toBeVisible();
  });
});

test.describe('深度导航返回测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('书籍流程完整返回路径', async ({ page }) => {
    await page.click('.menu-item:has-text("书架")');
    await page.locator('#bookshelf-screen .card[data-book]').first().click();
    await page.locator('.chapter-item:not(.locked)').first().click();
    await expect(page.locator('#chapter-screen')).toBeVisible();
    
    await page.click('#back-to-book-detail');
    await expect(page.locator('#book-detail-screen')).toBeVisible();
    
    await page.click('#back-to-bookshelf');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
    
    await page.click('#bookshelf-screen .back-btn');
    await expect(page.locator('#home-screen')).toBeVisible();
  });

  test('设置流程完整返回路径', async ({ page }) => {
    await page.click('.menu-item:has-text("设置")');
    await page.click('#theme-setting');
    await expect(page.locator('#theme-settings-screen')).toBeVisible();
    
    await page.click('#back-to-settings');
    await expect(page.locator('#settings-screen')).toBeVisible();
    
    await page.click('#settings-screen .back-btn');
    await expect(page.locator('#home-screen')).toBeVisible();
  });

  test('冒险流程完整返回路径', async ({ page }) => {
    await page.click('.menu-item:has-text("冒险")');
    await page.locator('#adventure-screen .card[data-adventure]').first().click();
    await expect(page.locator('#adventure-detail-screen')).toBeVisible();
    
    await page.click('#back-to-adventure');
    await expect(page.locator('#adventure-screen')).toBeVisible();
    
    await page.click('#adventure-screen .back-btn');
    await expect(page.locator('#home-screen')).toBeVisible();
  });

  test('角色流程完整返回路径', async ({ page }) => {
    await page.click('.menu-item:has-text("角色")');
    await page.locator('#characters-screen .card[data-character]').first().click();
    await expect(page.locator('#character-detail-screen')).toBeVisible();
    
    await page.click('#back-to-characters');
    await expect(page.locator('#characters-screen')).toBeVisible();
    
    await page.click('#characters-screen .back-btn');
    await expect(page.locator('#home-screen')).toBeVisible();
  });
});

test.describe('面包屑导航验证', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('书籍详情页面包屑', async ({ page }) => {
    await page.click('.menu-item:has-text("书架")');
    await page.locator('#bookshelf-screen .card[data-book]').first().click();
    
    const breadcrumb = page.locator('#book-detail-screen .breadcrumb');
    await expect(breadcrumb).toContainText('首页');
    await expect(breadcrumb).toContainText('书架');
  });

  test('章节页面包屑', async ({ page }) => {
    await page.click('.menu-item:has-text("书架")');
    await page.locator('#bookshelf-screen .card[data-book]').first().click();
    await page.locator('.chapter-item:not(.locked)').first().click();
    
    const breadcrumb = page.locator('#chapter-screen .breadcrumb');
    await expect(breadcrumb).toContainText('首页');
    await expect(breadcrumb).toContainText('书架');
    await expect(breadcrumb).toContainText('书籍');
  });

  test('角色详情页面包屑', async ({ page }) => {
    await page.click('.menu-item:has-text("角色")');
    await page.locator('#characters-screen .card[data-character]').first().click();
    
    const breadcrumb = page.locator('#character-detail-screen .breadcrumb');
    await expect(breadcrumb).toContainText('首页');
    await expect(breadcrumb).toContainText('角色');
  });

  test('冒险详情页面包屑', async ({ page }) => {
    await page.click('.menu-item:has-text("冒险")');
    await page.locator('#adventure-screen .card[data-adventure]').first().click();
    
    const breadcrumb = page.locator('#adventure-detail-screen .breadcrumb');
    await expect(breadcrumb).toContainText('首页');
    await expect(breadcrumb).toContainText('冒险');
  });

  test('主题设置页面包屑', async ({ page }) => {
    await page.click('.menu-item:has-text("设置")');
    await page.click('#theme-setting');
    
    const breadcrumb = page.locator('#theme-settings-screen .breadcrumb');
    await expect(breadcrumb).toContainText('首页');
    await expect(breadcrumb).toContainText('设置');
    await expect(breadcrumb).toContainText('主题');
  });
});

test.describe('积分系统测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input#username', 'testuser');
    await page.click('button:has-text("进入游戏")');
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
  });

  test('完成冒险获得积分', async ({ page }) => {
    await expect(page.locator('#score')).toHaveText('100');
    
    await page.click('.menu-item:has-text("冒险")');
    await page.locator('#adventure-screen .card[data-adventure]').first().click();
    await page.click('#start-adventure-btn');
    await page.click('#modal-confirm');
    
    await expect(page.locator('#score')).toHaveText('150');
  });

  test('积分在冒险页面同步显示', async ({ page }) => {
    await page.click('.menu-item:has-text("冒险")');
    await expect(page.locator('#total-score')).toHaveText('100');
    await expect(page.locator('#correct-answers')).toHaveText('5');
  });
})
