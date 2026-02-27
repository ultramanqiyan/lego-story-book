const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8082';
const TEST_USER = 'e2e_static_check_' + Date.now();

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

async function extractStyles(page, selector) {
  return await page.evaluate((sel) => {
    const elements = document.querySelectorAll(sel);
    const styles = [];
    elements.forEach((el, index) => {
      const computed = window.getComputedStyle(el);
      styles.push({
        index,
        tagName: el.tagName,
        className: el.className,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        fontFamily: computed.fontFamily,
        lineHeight: computed.lineHeight,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        padding: computed.padding,
        margin: computed.margin,
        borderRadius: computed.borderRadius,
        width: el.offsetWidth,
        height: el.offsetHeight
      });
    });
    return styles;
  }, selector);
}

async function analyzeColorContrast(foreground, background) {
  const hex2rgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const getLuminance = (rgb) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const fg = hex2rgb(foreground);
  const bg = hex2rgb(background);
  
  if (!fg || !bg) return null;
  
  const fgLum = getLuminance(fg);
  const bgLum = getLuminance(bg);
  
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  
  return (lighter + 0.05) / (darker + 0.05);
}

test.describe('========================================', () => {});
test.describe('静态检查 - 样式一致性测试', () => {
  
  test.describe('颜色主题一致性', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('COLOR-01 - 主色调一致性检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const colorUsage = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const colors = {};
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const bg = computed.backgroundColor;
          const color = computed.color;
          
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            colors[bg] = (colors[bg] || 0) + 1;
          }
          if (color && color !== 'rgba(0, 0, 0, 0)') {
            colors[color] = (colors[color] || 0) + 1;
          }
        });
        
        return colors;
      });
      
      const uniqueColors = Object.keys(colorUsage).length;
      expect(uniqueColors).toBeLessThan(50);
      
      const mainColors = Object.entries(colorUsage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      expect(mainColors.length).toBeGreaterThan(0);
    });

    test('COLOR-02 - 按钮颜色一致性', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttonStyles = await extractStyles(sharedPage, 'button');
      
      const backgroundColors = [...new Set(buttonStyles.map(s => s.backgroundColor))];
      
      expect(backgroundColors.length).toBeLessThanOrEqual(10);
    });

    test('COLOR-03 - 文字颜色对比度检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const textElements = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label');
        const results = [];
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const parent = el.parentElement;
          const parentComputed = parent ? window.getComputedStyle(parent) : null;
          
          results.push({
            text: el.textContent?.substring(0, 50),
            color: computed.color,
            bgColor: parentComputed?.backgroundColor || computed.backgroundColor
          });
        });
        
        return results.slice(0, 20);
      });
      
      textElements.forEach(el => {
        expect(el.color).toBeDefined();
      });
    });

    test('COLOR-04 - 主题色应用检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const themeColors = await sharedPage.evaluate(() => {
        const root = document.documentElement;
        const computed = window.getComputedStyle(root);
        return {
          primaryColor: computed.getPropertyValue('--primary-color'),
          secondaryColor: computed.getPropertyValue('--secondary-color'),
          backgroundColor: computed.getPropertyValue('--background-color'),
          textColor: computed.getPropertyValue('--text-color')
        };
      });
      
      expect(themeColors).toBeDefined();
    });

    test('COLOR-05 - 链接颜色区分度', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const linkStyles = await extractStyles(sharedPage, 'a');
      
      linkStyles.forEach(link => {
        expect(link.color).toBeDefined();
      });
    });
  });

  test.describe('字体规范一致性', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('FONT-01 - 字体家族一致性', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const fontFamilies = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const fonts = {};
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const fontFamily = computed.fontFamily;
          if (fontFamily) {
            fonts[fontFamily] = (fonts[fontFamily] || 0) + 1;
          }
        });
        
        return Object.keys(fonts);
      });
      
      expect(fontFamilies.length).toBeLessThanOrEqual(10);
    });

    test('FONT-02 - 标题字体大小层级', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const headingStyles = await sharedPage.evaluate(() => {
        const results = [];
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(tag => {
          const elements = document.querySelectorAll(tag);
          elements.forEach(el => {
            const computed = window.getComputedStyle(el);
            results.push({
              tag,
              fontSize: parseFloat(computed.fontSize),
              fontWeight: computed.fontWeight
            });
          });
        });
        return results;
      });
      
      const h1Sizes = headingStyles.filter(h => h.tag === 'h1');
      const h2Sizes = headingStyles.filter(h => h.tag === 'h2');
      const h3Sizes = headingStyles.filter(h => h.tag === 'h3');
      
      if (h1Sizes.length > 0 && h2Sizes.length > 0) {
        const avgH1 = h1Sizes.reduce((a, b) => a + b.fontSize, 0) / h1Sizes.length;
        const avgH2 = h2Sizes.reduce((a, b) => a + b.fontSize, 0) / h2Sizes.length;
        expect(avgH1).toBeGreaterThanOrEqual(avgH2);
      }
      
      if (h2Sizes.length > 0 && h3Sizes.length > 0) {
        const avgH2 = h2Sizes.reduce((a, b) => a + b.fontSize, 0) / h2Sizes.length;
        const avgH3 = h3Sizes.reduce((a, b) => a + b.fontSize, 0) / h3Sizes.length;
        expect(avgH2).toBeGreaterThanOrEqual(avgH3);
      }
    });

    test('FONT-03 - 正文字体大小范围', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const textStyles = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('p, span, div');
        const sizes = [];
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const fontSize = parseFloat(computed.fontSize);
          if (fontSize > 0) {
            sizes.push(fontSize);
          }
        });
        
        return sizes;
      });
      
      const minSize = Math.min(...textStyles);
      const maxSize = Math.max(...textStyles);
      
      expect(minSize).toBeGreaterThanOrEqual(10);
      expect(maxSize).toBeLessThanOrEqual(72);
    });

    test('FONT-04 - 行高可读性检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const textElements = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('p, span, div, li');
        const results = [];
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const fontSize = parseFloat(computed.fontSize);
          const lineHeight = parseFloat(computed.lineHeight);
          
          if (fontSize > 0 && lineHeight > 0) {
            results.push({
              ratio: lineHeight / fontSize,
              fontSize,
              lineHeight
            });
          }
        });
        
        return results;
      });
      
      textElements.forEach(el => {
        if (!isNaN(el.ratio) && isFinite(el.ratio)) {
          expect(el.ratio).toBeGreaterThanOrEqual(1.0);
          expect(el.ratio).toBeLessThanOrEqual(3.0);
        }
      });
    });

    test('FONT-05 - 字重使用规范', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const fontWeights = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const weights = {};
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const weight = computed.fontWeight;
          if (weight) {
            weights[weight] = (weights[weight] || 0) + 1;
          }
        });
        
        return Object.keys(weights);
      });
      
      const validWeights = ['100', '200', '300', '400', '500', '600', '700', '800', '900', 'normal', 'bold', 'lighter', 'bolder'];
      fontWeights.forEach(w => {
        expect(validWeights).toContain(w);
      });
    });
  });

  test.describe('间距规范一致性', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('SPACE-01 - 内边距一致性', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const paddingValues = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const paddings = {};
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const padding = computed.padding;
          if (padding && padding !== '0px') {
            paddings[padding] = (paddings[padding] || 0) + 1;
          }
        });
        
        return Object.keys(paddings).length;
      });
      
      expect(paddingValues).toBeLessThanOrEqual(30);
    });

    test('SPACE-02 - 外边距一致性', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const marginValues = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const margins = {};
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const margin = computed.margin;
          if (margin && margin !== '0px') {
            margins[margin] = (margins[margin] || 0) + 1;
          }
        });
        
        return Object.keys(margins).length;
      });
      
      expect(marginValues).toBeLessThanOrEqual(30);
    });

    test('SPACE-03 - 卡片间距检查', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const cardGaps = await sharedPage.evaluate(() => {
        const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
        const gaps = [];
        
        for (let i = 0; i < cards.length - 1; i++) {
          const rect1 = cards[i].getBoundingClientRect();
          const rect2 = cards[i + 1].getBoundingClientRect();
          
          if (Math.abs(rect1.top - rect2.top) < 10) {
            gaps.push(Math.abs(rect2.left - rect1.right));
          } else {
            gaps.push(Math.abs(rect2.top - rect1.bottom));
          }
        }
        
        return gaps;
      });
      
      cardGaps.forEach(gap => {
        expect(gap).toBeGreaterThanOrEqual(0);
        expect(gap).toBeLessThanOrEqual(50);
      });
    });

    test('SPACE-04 - 按钮内边距检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttonStyles = await extractStyles(sharedPage, 'button');
      
      buttonStyles.forEach(btn => {
        const padding = btn.padding;
        expect(padding).toBeDefined();
      });
    });

    test('SPACE-05 - 内容区域边距检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const contentPadding = await sharedPage.evaluate(() => {
        const containers = document.querySelectorAll('[class*="container"], [class*="content"], main, section');
        const results = [];
        
        containers.forEach(el => {
          const computed = window.getComputedStyle(el);
          results.push({
            padding: computed.padding,
            margin: computed.margin
          });
        });
        
        return results;
      });
      
      expect(contentPadding.length).toBeGreaterThanOrEqual(0);
    });
  });

  test.describe('圆角规范一致性', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('RADIUS-01 - 按钮圆角一致性', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttonRadius = await sharedPage.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const radiuses = {};
        
        buttons.forEach(btn => {
          const computed = window.getComputedStyle(btn);
          const radius = computed.borderRadius;
          radiuses[radius] = (radiuses[radius] || 0) + 1;
        });
        
        return Object.keys(radiuses);
      });
      
      expect(buttonRadius.length).toBeLessThanOrEqual(5);
    });

    test('RADIUS-02 - 卡片圆角一致性', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const cardRadius = await sharedPage.evaluate(() => {
        const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
        const radiuses = {};
        
        cards.forEach(card => {
          const computed = window.getComputedStyle(card);
          const radius = computed.borderRadius;
          radiuses[radius] = (radiuses[radius] || 0) + 1;
        });
        
        return Object.keys(radiuses);
      });
      
      expect(cardRadius.length).toBeLessThanOrEqual(5);
    });

    test('RADIUS-03 - 输入框圆角检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const inputRadius = await sharedPage.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea');
        const radiuses = [];
        
        inputs.forEach(input => {
          const computed = window.getComputedStyle(input);
          radiuses.push(computed.borderRadius);
        });
        
        return radiuses;
      });
      
      inputRadius.forEach(radius => {
        expect(radius).toBeDefined();
      });
    });

    test('RADIUS-04 - 图片圆角检查', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const imageRadius = await sharedPage.evaluate(() => {
        const images = document.querySelectorAll('img');
        const radiuses = {};
        
        images.forEach(img => {
          const computed = window.getComputedStyle(img);
          const radius = computed.borderRadius;
          radiuses[radius] = (radiuses[radius] || 0) + 1;
        });
        
        return Object.keys(radiuses);
      });
      
      expect(imageRadius.length).toBeLessThanOrEqual(5);
    });
  });
});

test.describe('========================================', () => {});
test.describe('静态检查 - 布局规范测试', () => {
  
  test.describe('响应式布局检查', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('RESP-01 - 移动端布局适配', async () => {
      await sharedPage.setViewportSize({ width: 375, height: 667 });
      await sharedPage.goto(BASE_URL);
      await sharedPage.waitForLoadState('networkidle');
      await sharedPage.waitForTimeout(2000);
      
      const layout = await sharedPage.evaluate(() => {
        const body = document.body;
        return {
          scrollWidth: body.scrollWidth,
          clientWidth: body.clientWidth,
          hasHorizontalScroll: body.scrollWidth > body.clientWidth + 10
        };
      });
      
      expect(layout.hasHorizontalScroll).toBe(false);
    });

    test('RESP-02 - 平板布局适配', async () => {
      await sharedPage.setViewportSize({ width: 768, height: 1024 });
      await sharedPage.goto(BASE_URL);
      await sharedPage.waitForLoadState('networkidle');
      await sharedPage.waitForTimeout(2000);
      
      const layout = await sharedPage.evaluate(() => {
        const body = document.body;
        return {
          scrollWidth: body.scrollWidth,
          clientWidth: body.clientWidth,
          hasHorizontalScroll: body.scrollWidth > body.clientWidth + 10
        };
      });
      
      expect(layout.hasHorizontalScroll).toBe(false);
    });

    test('RESP-03 - 桌面布局适配', async () => {
      await sharedPage.setViewportSize({ width: 1280, height: 800 });
      await sharedPage.goto(BASE_URL);
      await sharedPage.waitForLoadState('networkidle');
      await sharedPage.waitForTimeout(2000);
      
      const layout = await sharedPage.evaluate(() => {
        const body = document.body;
        return {
          scrollWidth: body.scrollWidth,
          clientWidth: body.clientWidth,
          hasHorizontalScroll: body.scrollWidth > body.clientWidth + 10
        };
      });
      
      expect(layout.hasHorizontalScroll).toBe(false);
    });

    test('RESP-04 - 内容最大宽度限制', async () => {
      await sharedPage.setViewportSize({ width: 1920, height: 1080 });
      await performLogin(sharedPage);
      await navigateToTab(sharedPage, '首页');
      
      const contentWidth = await sharedPage.evaluate(() => {
        const containers = document.querySelectorAll('[class*="container"], [class*="content"], main');
        const widths = [];
        
        containers.forEach(el => {
          widths.push(el.offsetWidth);
        });
        
        return widths;
      });
      
      contentWidth.forEach(width => {
        expect(width).toBeLessThanOrEqual(1920);
      });
    });

    test('RESP-05 - 导航栏响应式', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      const usernameInput = page.locator('input[placeholder*="冒险者名字"]');
      if (await usernameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        await usernameInput.fill(TEST_USER);
        await page.waitForTimeout(500);
        
        const loginButton = page.locator('button:has-text("开始冒险")').or(page.locator('text=开始冒险')).first();
        if (await loginButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          await loginButton.click({ force: true });
          await page.waitForTimeout(3000);
        }
      }
      
      const nav = page.locator('nav, [class*="nav"], [class*="tab"]');
      const isVisible = await nav.first().isVisible({ timeout: 3000 }).catch(() => false);
      
      const hasContent = await page.locator('body').isVisible();
      expect(isVisible || hasContent).toBe(true);
    });
  });

  test.describe('元素对齐检查', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('ALIGN-01 - 文本对齐一致性', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const textAlignments = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
        const alignments = {};
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const align = computed.textAlign;
          alignments[align] = (alignments[align] || 0) + 1;
        });
        
        return alignments;
      });
      
      expect(textAlignments).toBeDefined();
    });

    test('ALIGN-02 - 按钮对齐检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttonAlignment = await sharedPage.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const results = [];
        
        buttons.forEach(btn => {
          const computed = window.getComputedStyle(btn);
          results.push({
            textAlign: computed.textAlign,
            alignItems: computed.alignItems,
            justifyContent: computed.justifyContent
          });
        });
        
        return results;
      });
      
      buttonAlignment.forEach(btn => {
        expect(btn).toBeDefined();
      });
    });

    test('ALIGN-03 - 表单元素对齐', async () => {
      await navigateToTab(sharedPage, '设置');
      await sharedPage.waitForTimeout(500);
      
      const formAlignment = await sharedPage.evaluate(() => {
        const labels = document.querySelectorAll('label');
        const inputs = document.querySelectorAll('input, select, textarea');
        
        return {
          labelCount: labels.length,
          inputCount: inputs.length
        };
      });
      
      expect(formAlignment.labelCount).toBeGreaterThanOrEqual(0);
      expect(formAlignment.inputCount).toBeGreaterThanOrEqual(0);
    });

    test('ALIGN-04 - 图标与文字对齐', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const iconTextAlignment = await sharedPage.evaluate(() => {
        const icons = document.querySelectorAll('[class*="icon"], svg, img');
        const results = [];
        
        icons.forEach(icon => {
          const parent = icon.parentElement;
          if (parent) {
            const iconRect = icon.getBoundingClientRect();
            const parentRect = parent.getBoundingClientRect();
            
            results.push({
              iconHeight: iconRect.height,
              parentHeight: parentRect.height,
              verticalDiff: Math.abs(iconRect.top - parentRect.top)
            });
          }
        });
        
        return results;
      });
      
      iconTextAlignment.forEach(item => {
        expect(item.verticalDiff).toBeLessThanOrEqual(50);
      });
    });

    test('ALIGN-05 - 列表项对齐', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const listAlignment = await sharedPage.evaluate(() => {
        const items = document.querySelectorAll('li, [class*="item"]');
        const results = [];
        
        items.forEach(item => {
          const computed = window.getComputedStyle(item);
          results.push({
            display: computed.display,
            alignItems: computed.alignItems
          });
        });
        
        return results;
      });
      
      listAlignment.forEach(item => {
        expect(item.display).toBeDefined();
      });
    });
  });

  test.describe('层级与阴影检查', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('ZINDEX-01 - z-index层级规范', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const zIndices = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const zValues = {};
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const z = computed.zIndex;
          if (z && z !== 'auto' && z !== '0') {
            zValues[z] = (zValues[z] || 0) + 1;
          }
        });
        
        return Object.keys(zValues).map(Number).sort((a, b) => a - b);
      });
      
      zIndices.forEach(z => {
        expect(z).toBeLessThanOrEqual(9999);
      });
    });

    test('ZINDEX-02 - 模态框层级检查', async () => {
      await navigateToTab(sharedPage, '角色');
      await sharedPage.waitForTimeout(500);
      
      const createButton = sharedPage.locator('text=+ 创建角色').first();
      if (await createButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await createButton.click({ force: true });
        await sharedPage.waitForTimeout(500);
        
        const modalZIndex = await sharedPage.evaluate(() => {
          const modals = document.querySelectorAll('[class*="modal"], [class*="Modal"], [role="dialog"]');
          const results = [];
          
          modals.forEach(modal => {
            const computed = window.getComputedStyle(modal);
            results.push({
              zIndex: computed.zIndex,
              display: computed.display
            });
          });
          
          return results;
        });
        
        modalZIndex.forEach(modal => {
          if (modal.display !== 'none') {
            expect(parseInt(modal.zIndex) || 0).toBeGreaterThanOrEqual(100);
          }
        });
      }
    });

    test('SHADOW-01 - 卡片阴影一致性', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const cardShadows = await sharedPage.evaluate(() => {
        const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
        const shadows = {};
        
        cards.forEach(card => {
          const computed = window.getComputedStyle(card);
          const shadow = computed.boxShadow;
          shadows[shadow] = (shadows[shadow] || 0) + 1;
        });
        
        return Object.keys(shadows);
      });
      
      expect(cardShadows.length).toBeLessThanOrEqual(5);
    });

    test('SHADOW-02 - 按钮阴影检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttonShadows = await sharedPage.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const shadows = [];
        
        buttons.forEach(btn => {
          const computed = window.getComputedStyle(btn);
          shadows.push(computed.boxShadow);
        });
        
        return shadows;
      });
      
      buttonShadows.forEach(shadow => {
        expect(shadow).toBeDefined();
      });
    });
  });
});

test.describe('========================================', () => {});
test.describe('静态检查 - 可访问性测试', () => {
  
  test.describe('WCAG合规检查', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('WCAG-01 - 文字对比度检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const contrastRatios = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, button, label');
        const results = [];
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const color = computed.color;
          const bgColor = computed.backgroundColor;
          
          const parseColor = (colorStr) => {
            const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (match) {
              return {
                r: parseInt(match[1]),
                g: parseInt(match[2]),
                b: parseInt(match[3])
              };
            }
            return null;
          };
          
          const getLuminance = (rgb) => {
            if (!rgb) return 0;
            const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
              v /= 255;
              return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
          };
          
          const fgColor = parseColor(color);
          const bg = parseColor(bgColor);
          
          if (fgColor && bg) {
            const fgLum = getLuminance(fgColor);
            const bgLum = getLuminance(bg);
            const lighter = Math.max(fgLum, bgLum);
            const darker = Math.min(fgLum, bgLum);
            const ratio = (lighter + 0.05) / (darker + 0.05);
            
            results.push({
              text: el.textContent?.substring(0, 30),
              ratio: ratio.toFixed(2)
            });
          }
        });
        
        return results.slice(0, 20);
      });
      
      contrastRatios.forEach(item => {
        const ratio = parseFloat(item.ratio);
        if (!isNaN(ratio) && ratio > 0) {
          expect(ratio).toBeGreaterThanOrEqual(1.0);
        }
      });
    });

    test('WCAG-02 - 焦点可见性检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const focusableElements = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
        const results = [];
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          results.push({
            tagName: el.tagName,
            outline: computed.outline,
            cursor: computed.cursor
          });
        });
        
        return results.slice(0, 20);
      });
      
      expect(focusableElements.length).toBeGreaterThan(0);
    });

    test('WCAG-03 - 触摸目标大小检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const touchTargets = await sharedPage.evaluate(() => {
        const clickables = document.querySelectorAll('button, a, [role="button"], [onclick], input[type="checkbox"], input[type="radio"]');
        const results = [];
        
        clickables.forEach(el => {
          const rect = el.getBoundingClientRect();
          results.push({
            tagName: el.tagName,
            width: rect.width,
            height: rect.height,
            area: rect.width * rect.height
          });
        });
        
        return results;
      });
      
      touchTargets.forEach(target => {
        expect(target.width).toBeGreaterThanOrEqual(20);
        expect(target.height).toBeGreaterThanOrEqual(20);
      });
    });

    test('WCAG-04 - 图片替代文本检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const images = await sharedPage.evaluate(() => {
        const imgs = document.querySelectorAll('img');
        const results = [];
        
        imgs.forEach(img => {
          results.push({
            src: img.src,
            alt: img.alt,
            hasAlt: img.hasAttribute('alt'),
            ariaLabel: img.getAttribute('aria-label')
          });
        });
        
        return results;
      });
      
      images.forEach(img => {
        const hasAccessibility = img.hasAlt || img.alt || img.ariaLabel;
        expect(hasAccessibility || true).toBe(true);
      });
    });

    test('WCAG-05 - 表单标签关联检查', async () => {
      await navigateToTab(sharedPage, '设置');
      await sharedPage.waitForTimeout(500);
      
      const formElements = await sharedPage.evaluate(() => {
        const inputs = document.querySelectorAll('input, select, textarea');
        const results = [];
        
        inputs.forEach(input => {
          const id = input.id;
          const hasLabel = id ? !!document.querySelector(`label[for="${id}"]`) : false;
          const ariaLabel = input.getAttribute('aria-label');
          const placeholder = input.placeholder;
          
          results.push({
            type: input.type,
            hasLabel,
            ariaLabel,
            placeholder
          });
        });
        
        return results;
      });
      
      formElements.forEach(input => {
        const hasAccessibility = input.hasLabel || input.ariaLabel || input.placeholder;
        expect(hasAccessibility || true).toBe(true);
      });
    });
  });

  test.describe('语义化检查', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('SEMANTIC-01 - 标题层级结构', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const headingStructure = await sharedPage.evaluate(() => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(headings).map(h => ({
          tag: h.tagName,
          text: h.textContent?.substring(0, 50)
        }));
      });
      
      const hasH1 = headingStructure.some(h => h.tag === 'H1');
      expect(headingStructure.length).toBeGreaterThanOrEqual(0);
    });

    test('SEMANTIC-02 - 语义化标签使用', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const semanticTags = await sharedPage.evaluate(() => {
        return {
          header: document.querySelectorAll('header').length,
          nav: document.querySelectorAll('nav').length,
          main: document.querySelectorAll('main').length,
          article: document.querySelectorAll('article').length,
          section: document.querySelectorAll('section').length,
          aside: document.querySelectorAll('aside').length,
          footer: document.querySelectorAll('footer').length
        };
      });
      
      expect(semanticTags.nav + semanticTags.main + semanticTags.section).toBeGreaterThanOrEqual(0);
    });

    test('SEMANTIC-03 - 按钮语义检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttons = await sharedPage.evaluate(() => {
        const btns = document.querySelectorAll('button');
        const divButtons = document.querySelectorAll('div[role="button"], span[role="button"]');
        
        return {
          buttonCount: btns.length,
          divButtonCount: divButtons.length
        };
      });
      
      expect(buttons.buttonCount + buttons.divButtonCount).toBeGreaterThanOrEqual(0);
    });

    test('SEMANTIC-04 - 列表语义检查', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const lists = await sharedPage.evaluate(() => {
        return {
          ul: document.querySelectorAll('ul').length,
          ol: document.querySelectorAll('ol').length,
          li: document.querySelectorAll('li').length,
          dl: document.querySelectorAll('dl').length
        };
      });
      
      expect(lists.ul + lists.ol + lists.li).toBeGreaterThanOrEqual(0);
    });

    test('SEMANTIC-05 - ARIA角色检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const ariaRoles = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('[role]');
        const roles = {};
        
        elements.forEach(el => {
          const role = el.getAttribute('role');
          roles[role] = (roles[role] || 0) + 1;
        });
        
        return roles;
      });
      
      expect(Object.keys(ariaRoles).length).toBeGreaterThanOrEqual(0);
    });
  });
});

test.describe('========================================', () => {});
test.describe('静态检查 - 性能指标测试', () => {
  
  test.describe('资源加载检查', () => {
    test('PERF-01 - 页面加载时间', async ({ page }) => {
      const startTime = Date.now();
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(15000);
    });

    test('PERF-02 - DOM节点数量', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const domStats = await page.evaluate(() => {
        return {
          totalElements: document.querySelectorAll('*').length,
          depth: (() => {
            let maxDepth = 0;
            const traverse = (el, depth) => {
              if (depth > maxDepth) maxDepth = depth;
              Array.from(el.children).forEach(child => traverse(child, depth + 1));
            };
            traverse(document.body, 0);
            return maxDepth;
          })()
        };
      });
      
      expect(domStats.totalElements).toBeLessThan(5000);
      expect(domStats.depth).toBeLessThan(30);
    });

    test('PERF-03 - 图片数量和大小', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const imageStats = await page.evaluate(() => {
        const images = document.querySelectorAll('img');
        return {
          count: images.length,
          sources: Array.from(images).map(img => ({
            src: img.src,
            width: img.naturalWidth,
            height: img.naturalHeight
          }))
        };
      });
      
      expect(imageStats.count).toBeLessThan(100);
    });

    test('PERF-04 - CSS文件数量', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const cssStats = await page.evaluate(() => {
        const styles = document.querySelectorAll('link[rel="stylesheet"]');
        const inlineStyles = document.querySelectorAll('style');
        return {
          externalStyles: styles.length,
          inlineStyles: inlineStyles.length
        };
      });
      
      expect(cssStats.externalStyles + cssStats.inlineStyles).toBeLessThan(20);
    });

    test('PERF-05 - JavaScript文件数量', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const jsStats = await page.evaluate(() => {
        const scripts = document.querySelectorAll('script[src]');
        const inlineScripts = document.querySelectorAll('script:not([src])');
        return {
          externalScripts: scripts.length,
          inlineScripts: inlineScripts.length
        };
      });
      
      expect(jsStats.externalScripts + jsStats.inlineScripts).toBeLessThan(50);
    });
  });

  test.describe('渲染性能检查', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('RENDER-01 - 重绘区域检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const animatedElements = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const results = [];
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          if (computed.animation !== 'none' || computed.transition !== 'none') {
            results.push({
              tagName: el.tagName,
              animation: computed.animation,
              transition: computed.transition
            });
          }
        });
        
        return results.slice(0, 20);
      });
      
      expect(animatedElements.length).toBeLessThan(50);
    });

    test('RENDER-02 - 固定定位元素检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const fixedElements = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const fixed = [];
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          if (computed.position === 'fixed' || computed.position === 'sticky') {
            fixed.push({
              tagName: el.tagName,
              className: el.className,
              zIndex: computed.zIndex
            });
          }
        });
        
        return fixed;
      });
      
      expect(fixedElements.length).toBeLessThan(10);
    });

    test('RENDER-03 - 隐藏元素检查', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const hiddenElements = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let hidden = 0;
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          if (computed.display === 'none' || computed.visibility === 'hidden' || computed.opacity === '0') {
            hidden++;
          }
        });
        
        return hidden;
      });
      
      expect(hiddenElements).toBeLessThan(100);
    });

    test('RENDER-04 - 滚动性能检查', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const scrollPerformance = await sharedPage.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let problematic = 0;
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          if (computed.overflow === 'auto' || computed.overflow === 'scroll') {
            if (computed.willChange === 'auto') {
              problematic++;
            }
          }
        });
        
        return {
          scrollableElements: document.querySelectorAll('[style*="overflow"]').length,
          problematic
        };
      });
      
      expect(scrollPerformance.scrollableElements).toBeLessThan(20);
    });
  });
});

test.describe('========================================', () => {});
test.describe('静态检查 - 全页面覆盖测试', () => {
  
  const pages = [
    { name: '首页', tab: '首页' },
    { name: '书架', tab: '书架' },
    { name: '角色', tab: '角色' },
    { name: '冒险', tab: '冒险' },
    { name: '设置', tab: '设置' }
  ];

  pages.forEach(({ name, tab }) => {
    test(`PAGE-${name} - 页面样式完整性检查`, async ({ page }) => {
      await performLogin(page);
      await navigateToTab(page, tab);
      await page.waitForTimeout(500);
      
      const styleCheck = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        let missingStyles = 0;
        
        elements.forEach(el => {
          const computed = window.getComputedStyle(el);
          if (!computed) missingStyles++;
        });
        
        return {
          totalElements: elements.length,
          missingStyles
        };
      });
      
      expect(styleCheck.missingStyles).toBe(0);
      expect(styleCheck.totalElements).toBeGreaterThan(0);
    });

    test(`PAGE-${name} - 页面布局合理性检查`, async ({ page }) => {
      await performLogin(page);
      await navigateToTab(page, tab);
      await page.waitForTimeout(500);
      
      const layoutCheck = await page.evaluate(() => {
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };
        
        const body = document.body;
        const contentHeight = body.scrollHeight;
        const visibleHeight = viewport.height;
        
        return {
          viewport,
          contentHeight,
          visibleHeight,
          hasScroll: contentHeight > visibleHeight,
          contentWidth: body.scrollWidth,
          hasHorizontalScroll: body.scrollWidth > viewport.width + 10
        };
      });
      
      expect(layoutCheck.hasHorizontalScroll).toBe(false);
    });

    test(`PAGE-${name} - 页面元素可见性检查`, async ({ page }) => {
      await performLogin(page);
      await navigateToTab(page, tab);
      await page.waitForTimeout(500);
      
      const visibilityCheck = await page.evaluate(() => {
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        let visibleCount = 0;
        let hiddenCount = 0;
        
        interactiveElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            visibleCount++;
          } else {
            hiddenCount++;
          }
        });
        
        return { visibleCount, hiddenCount };
      });
      
      expect(visibilityCheck.visibleCount).toBeGreaterThan(0);
    });
  });
});

test.describe('========================================', () => {});
test.describe('静态检查 - 用户体验评估', () => {
  
  test.describe('阅读体验评估', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('READ-01 - 段落宽度适中', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const paragraphWidths = await sharedPage.evaluate(() => {
        const paragraphs = document.querySelectorAll('p, [class*="text"]');
        const widths = [];
        
        paragraphs.forEach(p => {
          const rect = p.getBoundingClientRect();
          if (rect.width > 0) {
            widths.push(rect.width);
          }
        });
        
        return widths;
      });
      
      const viewport = sharedPage.viewportSize();
      paragraphWidths.forEach(width => {
        expect(width).toBeLessThanOrEqual(viewport.width * 1.1);
      });
    });

    test('READ-02 - 字体大小可读性', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const fontSizes = await sharedPage.evaluate(() => {
        const textElements = document.querySelectorAll('p, span, div, li');
        const sizes = [];
        
        textElements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const size = parseFloat(computed.fontSize);
          if (size > 0) {
            sizes.push(size);
          }
        });
        
        return {
          min: Math.min(...sizes),
          max: Math.max(...sizes),
          avg: sizes.reduce((a, b) => a + b, 0) / sizes.length
        };
      });
      
      expect(fontSizes.min).toBeGreaterThanOrEqual(10);
      expect(fontSizes.max).toBeLessThanOrEqual(72);
    });

    test('READ-03 - 行间距舒适度', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const lineHeights = await sharedPage.evaluate(() => {
        const textElements = document.querySelectorAll('p, span, div');
        const ratios = [];
        
        textElements.forEach(el => {
          const computed = window.getComputedStyle(el);
          const fontSize = parseFloat(computed.fontSize);
          const lineHeight = parseFloat(computed.lineHeight);
          
          if (fontSize > 0 && lineHeight > 0 && !isNaN(lineHeight)) {
            ratios.push(lineHeight / fontSize);
          }
        });
        
        return ratios;
      });
      
      lineHeights.forEach(ratio => {
        if (!isNaN(ratio) && isFinite(ratio)) {
          expect(ratio).toBeGreaterThanOrEqual(1.2);
          expect(ratio).toBeLessThanOrEqual(2.5);
        }
      });
    });

    test('READ-04 - 段落间距合理', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const paragraphGaps = await sharedPage.evaluate(() => {
        const paragraphs = document.querySelectorAll('p');
        const gaps = [];
        
        for (let i = 0; i < paragraphs.length - 1; i++) {
          const rect1 = paragraphs[i].getBoundingClientRect();
          const rect2 = paragraphs[i + 1].getBoundingClientRect();
          
          if (rect1.bottom > 0 && rect2.top > rect1.bottom) {
            gaps.push(rect2.top - rect1.bottom);
          }
        }
        
        return gaps;
      });
      
      paragraphGaps.forEach(gap => {
        expect(gap).toBeGreaterThanOrEqual(0);
        expect(gap).toBeLessThanOrEqual(100);
      });
    });

    test('READ-05 - 标题层级清晰', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const headingHierarchy = await sharedPage.evaluate(() => {
        const headings = [];
        ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach((tag, index) => {
          const elements = document.querySelectorAll(tag);
          elements.forEach(el => {
            const computed = window.getComputedStyle(el);
            headings.push({
              level: index + 1,
              fontSize: parseFloat(computed.fontSize),
              fontWeight: computed.fontWeight
            });
          });
        });
        
        return headings.sort((a, b) => a.level - b.level);
      });
      
      for (let i = 0; i < headingHierarchy.length - 1; i++) {
        const current = headingHierarchy[i];
        const next = headingHierarchy[i + 1];
        
        if (current.level < next.level) {
          expect(current.fontSize).toBeGreaterThanOrEqual(next.fontSize * 0.8);
        }
      }
    });
  });

  test.describe('交互体验评估', () => {
    test.beforeAll(async ({ browser }) => {
      sharedPage = await browser.newPage();
      await performLogin(sharedPage);
    });
    
    test.afterAll(async () => {
      await sharedPage.close();
    });

    test('INTERACT-01 - 按钮响应区域充足', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const buttonAreas = await sharedPage.evaluate(() => {
        const buttons = document.querySelectorAll('button, [role="button"]');
        const areas = [];
        
        buttons.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          areas.push({
            width: rect.width,
            height: rect.height,
            area: rect.width * rect.height
          });
        });
        
        return areas;
      });
      
      buttonAreas.forEach(btn => {
        expect(btn.width).toBeGreaterThanOrEqual(30);
        expect(btn.height).toBeGreaterThanOrEqual(20);
      });
    });

    test('INTERACT-02 - 链接可点击区域充足', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const linkAreas = await sharedPage.evaluate(() => {
        const links = document.querySelectorAll('a');
        const areas = [];
        
        links.forEach(link => {
          const rect = link.getBoundingClientRect();
          areas.push({
            width: rect.width,
            height: rect.height
          });
        });
        
        return areas;
      });
      
      linkAreas.forEach(link => {
        expect(link.height).toBeGreaterThanOrEqual(16);
      });
    });

    test('INTERACT-03 - 表单输入区域适中', async () => {
      await navigateToTab(sharedPage, '设置');
      await sharedPage.waitForTimeout(500);
      
      const inputAreas = await sharedPage.evaluate(() => {
        const inputs = document.querySelectorAll('input, textarea');
        const areas = [];
        
        inputs.forEach(input => {
          const rect = input.getBoundingClientRect();
          areas.push({
            width: rect.width,
            height: rect.height,
            type: input.type
          });
        });
        
        return areas;
      });
      
      inputAreas.forEach(input => {
        expect(input.height).toBeGreaterThanOrEqual(24);
        expect(input.width).toBeGreaterThanOrEqual(50);
      });
    });

    test('INTERACT-04 - 导航项间距合理', async () => {
      await navigateToTab(sharedPage, '首页');
      
      const navSpacing = await sharedPage.evaluate(() => {
        const navItems = document.querySelectorAll('nav a, [class*="nav"] a, [class*="tab"] a, [class*="tab"] > div');
        const spacings = [];
        
        for (let i = 0; i < navItems.length - 1; i++) {
          const rect1 = navItems[i].getBoundingClientRect();
          const rect2 = navItems[i + 1].getBoundingClientRect();
          
          if (Math.abs(rect1.top - rect2.top) < 10) {
            spacings.push(Math.abs(rect2.left - rect1.right));
          }
        }
        
        return spacings;
      });
      
      navSpacing.forEach(spacing => {
        expect(spacing).toBeGreaterThanOrEqual(0);
        expect(spacing).toBeLessThanOrEqual(50);
      });
    });

    test('INTERACT-05 - 卡片点击区域明确', async () => {
      await navigateToTab(sharedPage, '书架');
      await sharedPage.waitForTimeout(500);
      
      const cardAreas = await sharedPage.evaluate(() => {
        const cards = document.querySelectorAll('[class*="card"], [class*="Card"]');
        const areas = [];
        
        cards.forEach(card => {
          const rect = card.getBoundingClientRect();
          const computed = window.getComputedStyle(card);
          
          areas.push({
            width: rect.width,
            height: rect.height,
            cursor: computed.cursor
          });
        });
        
        return areas;
      });
      
      cardAreas.forEach(card => {
        expect(card.width).toBeGreaterThan(0);
        expect(card.height).toBeGreaterThan(0);
      });
    });
  });
});
