import { test, expect, Page } from '@playwright/test';

test.describe('游戏界面加载测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${process.cwd()}/demo.html`);
    await page.waitForLoadState('networkidle');
  });

  test('页面标题正确显示', async ({ page }) => {
    await expect(page).toHaveTitle(/炉石传说风格卡牌对战/);
  });

  test('头部信息正确显示', async ({ page }) => {
    const header = page.locator('.header h1');
    await expect(header).toBeVisible();
    await expect(header).toHaveText('炉石传说风格卡牌对战');
  });

  test('战场背景正确渲染', async ({ page }) => {
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
    
    const computedStyle = await gameContainer.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(computedStyle).toBeTruthy();
  });

  test('对手区域正确显示', async ({ page }) => {
    const opponentSection = page.locator('.opponent-section');
    await expect(opponentSection).toBeVisible();
    
    const heroAvatar = opponentSection.locator('.hero-avatar');
    await expect(heroAvatar).toBeVisible();
    
    const healthBar = opponentSection.locator('.health-bar');
    await expect(healthBar).toBeVisible();
  });

  test('玩家区域正确显示', async ({ page }) => {
    const playerSection = page.locator('.player-section').last();
    await expect(playerSection).toBeVisible();
    
    const heroAvatar = playerSection.locator('.hero-avatar');
    await expect(heroAvatar).toBeVisible();
    
    const healthBar = playerSection.locator('.health-bar');
    await expect(healthBar).toBeVisible();
  });

  test('法力水晶正确显示', async ({ page }) => {
    const manaCrystals = page.locator('.mana-crystals').first();
    await expect(manaCrystals).toBeVisible();
    
    const crystals = manaCrystals.locator('.crystal');
    const count = await crystals.count();
    expect(count).toBeGreaterThan(0);
  });

  test('手牌区域正确显示', async ({ page }) => {
    const handCards = page.locator('.hand-cards');
    await expect(handCards).toBeVisible();
    
    const cards = handCards.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('随从战场正确显示', async ({ page }) => {
    const minionFields = page.locator('.minion-field');
    const count = await minionFields.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('操作按钮正确显示', async ({ page }) => {
    const actionButtons = page.locator('.action-buttons');
    await expect(actionButtons).toBeVisible();
    
    const heroPowerBtn = actionButtons.locator('.btn-hero-power');
    await expect(heroPowerBtn).toBeVisible();
    
    const endTurnBtn = actionButtons.locator('.btn-end-turn');
    await expect(endTurnBtn).toBeVisible();
  });

  test('牌库区域正确显示', async ({ page }) => {
    const deckAreas = page.locator('.deck-area');
    const count = await deckAreas.count();
    expect(count).toBeGreaterThanOrEqual(2);
    
    const deck = deckAreas.first().locator('.deck');
    await expect(deck).toBeVisible();
    
    const deckCount = deck.locator('.deck-count');
    await expect(deckCount).toBeVisible();
  });

  test('回合指示器正确显示', async ({ page }) => {
    const turnIndicator = page.locator('.turn-indicator');
    await expect(turnIndicator).toBeVisible();
    await expect(turnIndicator).toContainText('回合');
  });

  test('日志面板正确显示', async ({ page }) => {
    const logPanel = page.locator('.log-panel');
    await expect(logPanel).toBeVisible();
    
    const logHeader = logPanel.locator('.log-header');
    await expect(logHeader).toBeVisible();
    
    const logContent = logPanel.locator('.log-content');
    await expect(logContent).toBeVisible();
  });
});

test.describe('卡牌交互测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${process.cwd()}/demo.html`);
    await page.waitForLoadState('networkidle');
  });

  test('卡牌悬停效果', async ({ page }) => {
    const card = page.locator('.card').first();
    await card.hover();
    
    await page.waitForTimeout(200);
    
    const transform = await card.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    expect(transform).toBeTruthy();
  });

  test('卡牌点击记录日志', async ({ page }) => {
    const card = page.locator('.card').first();
    const cardName = await card.locator('.card-name').textContent();
    
    await card.click();
    
    const logContent = page.locator('.log-content');
    await page.waitForTimeout(100);
    
    const lastLog = logContent.locator('.log-entry').last();
    await expect(lastLog).toContainText('点击卡牌');
    await expect(lastLog).toContainText(cardName || '');
  });

  test('随从点击选中效果', async ({ page }) => {
    const minion = page.locator('.minion').first();
    
    await minion.click();
    
    await expect(minion).toHaveClass(/selected/);
  });

  test('随从点击记录日志', async ({ page }) => {
    const minion = page.locator('.minion').first();
    const minionName = await minion.locator('.minion-name').textContent();
    
    await minion.click();
    
    const logContent = page.locator('.log-content');
    await page.waitForTimeout(100);
    
    const lastLog = logContent.locator('.log-entry').last();
    await expect(lastLog).toContainText('点击随从');
    await expect(lastLog).toContainText(minionName || '');
  });

  test('结束回合按钮点击', async ({ page }) => {
    const endTurnBtn = page.locator('.btn-end-turn');
    
    await endTurnBtn.click();
    
    const logContent = page.locator('.log-content');
    await page.waitForTimeout(100);
    
    const lastLog = logContent.locator('.log-entry').last();
    await expect(lastLog).toContainText('结束回合');
  });

  test('英雄技能按钮点击', async ({ page }) => {
    const heroPowerBtn = page.locator('.btn-hero-power');
    
    await heroPowerBtn.click();
    
    const logContent = page.locator('.log-content');
    await page.waitForTimeout(100);
    
    const lastLog = logContent.locator('.log-entry').last();
    await expect(lastLog).toContainText('英雄技能');
  });

  test('清空日志按钮', async ({ page }) => {
    const clearBtn = page.locator('.log-clear');
    const logContent = page.locator('.log-content');
    
    await clearBtn.click();
    
    const logEntries = logContent.locator('.log-entry');
    const count = await logEntries.count();
    expect(count).toBe(0);
  });
});

test.describe('游戏流程测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${process.cwd()}/demo.html`);
    await page.waitForLoadState('networkidle');
  });

  test('完整游戏交互流程', async ({ page }) => {
    const card = page.locator('.card').first();
    await card.click();
    await page.waitForTimeout(100);
    
    const minion = page.locator('.minion').first();
    await minion.click();
    await page.waitForTimeout(100);
    
    const endTurnBtn = page.locator('.btn-end-turn');
    await endTurnBtn.click();
    await page.waitForTimeout(100);
    
    const heroPowerBtn = page.locator('.btn-hero-power');
    await heroPowerBtn.click();
    await page.waitForTimeout(100);
    
    const logEntries = page.locator('.log-content .log-entry');
    const count = await logEntries.count();
    expect(count).toBeGreaterThan(3);
  });

  test('多个随从选中切换', async ({ page }) => {
    const minions = page.locator('.minion');
    const firstMinion = minions.first();
    const secondMinion = minions.nth(1);
    
    await firstMinion.click();
    await expect(firstMinion).toHaveClass(/selected/);
    
    await secondMinion.click();
    await expect(secondMinion).toHaveClass(/selected/);
  });

  test('卡牌信息正确显示', async ({ page }) => {
    const card = page.locator('.card').first();
    
    const cardName = await card.locator('.card-name').textContent();
    const cardCost = await card.locator('.card-cost').textContent();
    const cardDescription = await card.locator('.card-description').textContent();
    
    expect(cardName).toBeTruthy();
    expect(cardCost).toBeTruthy();
    expect(cardDescription).toBeTruthy();
  });

  test('随从属性正确显示', async ({ page }) => {
    const minion = page.locator('.minion').first();
    
    const minionName = await minion.locator('.minion-name').textContent();
    const statBadges = minion.locator('.stat-badge');
    const attack = await statBadges.first().textContent();
    const health = await statBadges.nth(1).textContent();
    
    expect(minionName).toBeTruthy();
    expect(attack).toBeTruthy();
    expect(health).toBeTruthy();
  });
});

test.describe('动画效果测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${process.cwd()}/demo.html`);
    await page.waitForLoadState('networkidle');
  });

  test('卡牌悬停动画', async ({ page }) => {
    const card = page.locator('.card').first();
    
    const beforeTransform = await card.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    await card.hover();
    await page.waitForTimeout(300);
    
    const afterTransform = await card.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    expect(beforeTransform).not.toEqual(afterTransform);
  });

  test('随从选中动画', async ({ page }) => {
    const minion = page.locator('.minion').first();
    
    await minion.click();
    await page.waitForTimeout(200);
    
    const hasSelectedClass = await minion.evaluate((el) => {
      return el.classList.contains('selected');
    });
    
    expect(hasSelectedClass).toBe(true);
  });

  test('按钮点击动画', async ({ page }) => {
    const endTurnBtn = page.locator('.btn-end-turn');
    
    await endTurnBtn.click();
    await page.waitForTimeout(100);
    
    await expect(endTurnBtn).toBeVisible();
  });
});

test.describe('响应式布局测试', () => {
  test('移动端布局适配', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`file://${process.cwd()}/demo.html`);
    await page.waitForLoadState('networkidle');
    
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
    
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('平板布局适配', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(`file://${process.cwd()}/demo.html`);
    await page.waitForLoadState('networkidle');
    
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
    
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('桌面端布局适配', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(`file://${process.cwd()}/demo.html`);
    await page.waitForLoadState('networkidle');
    
    const gameContainer = page.locator('.game-container');
    await expect(gameContainer).toBeVisible();
    
    const logPanel = page.locator('.log-panel');
    await expect(logPanel).toBeVisible();
  });
});

test.describe('日志系统测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${process.cwd()}/demo.html`);
    await page.waitForLoadState('networkidle');
  });

  test('初始日志正确显示', async ({ page }) => {
    const logEntries = page.locator('.log-content .log-entry');
    const count = await logEntries.count();
    expect(count).toBeGreaterThan(0);
  });

  test('日志时间戳格式正确', async ({ page }) => {
    const timestamp = page.locator('.log-timestamp').first();
    const text = await timestamp.textContent();
    
    expect(text).toMatch(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/);
  });

  test('日志级别正确标记', async ({ page }) => {
    const infoLog = page.locator('.log-entry.info').first();
    await expect(infoLog).toBeVisible();
  });

  test('日志自动滚动到底部', async ({ page }) => {
    const logContent = page.locator('.log-content');
    
    for (let i = 0; i < 5; i++) {
      const card = page.locator('.card').first();
      await card.click();
      await page.waitForTimeout(50);
    }
    
    const scrollTop = await logContent.evaluate((el) => {
      return el.scrollTop;
    });
    
    const scrollHeight = await logContent.evaluate((el) => {
      return el.scrollHeight;
    });
    
    const clientHeight = await logContent.evaluate((el) => {
      return el.clientHeight;
    });
    
    expect(scrollTop + clientHeight).toBeGreaterThanOrEqual(scrollHeight - 10);
  });
});
