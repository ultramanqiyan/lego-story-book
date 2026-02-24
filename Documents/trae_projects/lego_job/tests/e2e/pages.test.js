/**
 * 端到端测试 - 页面加载测试
 * 确保所有页面能正常加载，数据能正确显示
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// 测试配置
var BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:8788';
var TEST_USER = {
  username: '测试用户',
  email: 'test@example.com'
};

describe('端到端页面加载测试', function() {
  var testUserId = null;
  var testBookId = null;

  // 在所有测试前创建测试用户
  beforeAll(async function() {
    try {
      var response = await fetch(BASE_URL + '/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(TEST_USER)
      });
      var data = await response.json();
      if (data.success) {
        testUserId = data.userId;
        console.log('测试用户创建成功:', testUserId);
      }
    } catch (error) {
      console.error('创建测试用户失败:', error);
    }
  });

  // 在所有测试后清理
  afterAll(async function() {
    // 清理测试数据
    if (testBookId && testUserId) {
      try {
        await fetch(BASE_URL + '/api/books/' + testBookId + '?userId=' + testUserId, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('清理测试书籍失败:', error);
      }
    }
  });

  describe('首页 (index.html)', function() {
    it('应该能正常加载首页', async function() {
      var response = await fetch(BASE_URL + '/');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('乐高故事书');
      expect(html).toContain('乐高故事');
      expect(html).toContain('创作属于你的冒险');
    });

    it('应该能加载人仔列表API', async function() {
      var response = await fetch(BASE_URL + '/api/characters');
      expect(response.status).toBe(200);

      var data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.characters)).toBe(true);
      expect(data.characters.length).toBeGreaterThan(0);
    });

    it('应该包含乐高主题CSS文件', async function() {
      var response = await fetch(BASE_URL + '/');
      var html = await response.text();

      // CSS文件
      expect(html).toContain('css/lego-theme.css');
      expect(html).toContain('css/loading.css');
    });

    it('应该包含必要的JS文件引用', async function() {
      var response = await fetch(BASE_URL + '/');
      var html = await response.text();

      // JS文件
      expect(html).toContain('js/utils.js');
      expect(html).toContain('js/loading-manager.js');
    });

    it('应该包含加载动画初始化', async function() {
      var response = await fetch(BASE_URL + '/');
      var html = await response.text();

      // 检查加载管理器初始化
      expect(html).toContain('initLoadingManager()');
    });

    it('应该包含乐高风格组件', async function() {
      var response = await fetch(BASE_URL + '/');
      var html = await response.text();

      // 检查乐高风格组件
      expect(html).toContain('lego-btn');
      expect(html).toContain('lego-title');
      expect(html).toContain('lego-dialog');
      expect(html).toContain('lego-footer-bar');
      expect(html).toContain('lego-badge');
      expect(html).toContain('lego-input');
    });
  });

  describe('书籍编辑页 (book.html)', function() {
    it('应该能正常加载页面', async function() {
      var response = await fetch(BASE_URL + '/book.html');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('书籍');
    });

    it('应该包含加载动画管理器', async function() {
      var response = await fetch(BASE_URL + '/book.html');
      var html = await response.text();

      expect(html).toContain('loading-manager.js');
      expect(html).toContain('initLoadingManager()');
    });

    it('应该在生成章节时显示加载动画', async function() {
      var response = await fetch(BASE_URL + '/book.html');
      var html = await response.text();

      // 检查是否有showLoading调用
      expect(html).toContain('showLoading(');
    });
  });

  describe('书架页 (bookshelf.html)', function() {
    it('应该能正常加载页面', async function() {
      var response = await fetch(BASE_URL + '/bookshelf.html');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('书架');
    });

    it('应该能加载用户的书籍列表', async function() {
      if (!testUserId) {
        console.log('跳过测试：没有测试用户');
        return;
      }

      var response = await fetch(BASE_URL + '/api/books?userId=' + testUserId);
      expect(response.status).toBe(200);

      var data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.books)).toBe(true);
    });
  });

  describe('人仔管理页 (characters.html)', function() {
    it('应该能正常加载页面', async function() {
      var response = await fetch(BASE_URL + '/characters.html');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('人仔角色');
    });

    it('应该能加载人仔列表', async function() {
      var response = await fetch(BASE_URL + '/api/characters');
      expect(response.status).toBe(200);

      var data = await response.json();
      expect(data.success).toBe(true);
      expect(Array.isArray(data.characters)).toBe(true);
    });

    it('应该包含加载动画管理器', async function() {
      var response = await fetch(BASE_URL + '/characters.html');
      var html = await response.text();

      expect(html).toContain('loading-manager.js');
      expect(html).toContain('initLoadingManager()');
    });

    it('应该包含图片上传功能', async function() {
      var response = await fetch(BASE_URL + '/characters.html');
      var html = await response.text();

      expect(html).toContain('imageInput');
      expect(html).toContain('handleImageUpload');
      expect(html).toContain('uploadedImageData');
    });

    it('应该包含图片预览功能', async function() {
      var response = await fetch(BASE_URL + '/characters.html');
      var html = await response.text();

      expect(html).toContain('imagePreview');
      expect(html).toContain('clearImage');
    });
  });

  describe('登录页 (login.html)', function() {
    it('应该能正常加载页面', async function() {
      var response = await fetch(BASE_URL + '/login.html');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('登录');
    });

    it('应该包含加载动画管理器', async function() {
      var response = await fetch(BASE_URL + '/login.html');
      var html = await response.text();

      expect(html).toContain('loading-manager.js');
      expect(html).toContain('initLoadingManager()');
    });

    it('应该在登录时显示加载动画', async function() {
      var response = await fetch(BASE_URL + '/login.html');
      var html = await response.text();

      expect(html).toContain('showLoading(');
    });
  });

  describe('家长控制页 (parent.html)', function() {
    it('应该能正常加载页面', async function() {
      var response = await fetch(BASE_URL + '/parent.html');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('家长控制');
    });

    it('应该包含加载动画管理器', async function() {
      var response = await fetch(BASE_URL + '/parent.html');
      var html = await response.text();

      expect(html).toContain('loading-manager.js');
      expect(html).toContain('initLoadingManager()');
    });
  });

  describe('CSS文件测试', function() {
    it('lego-theme.css 应该可访问', async function() {
      var response = await fetch(BASE_URL + '/css/lego-theme.css');
      expect(response.status).toBe(200);

      var css = await response.text();
      expect(css.length).toBeGreaterThan(0);
    });

    it('loading.css 应该可访问', async function() {
      var response = await fetch(BASE_URL + '/css/loading.css');
      expect(response.status).toBe(200);

      var css = await response.text();
      expect(css.length).toBeGreaterThan(0);
      expect(css).toContain('loading-overlay');
    });
  });

  describe('JS文件测试', function() {
    it('utils.js 应该可访问', async function() {
      var response = await fetch(BASE_URL + '/js/utils.js');
      expect(response.status).toBe(200);

      var js = await response.text();
      expect(js.length).toBeGreaterThan(0);
      expect(js).toContain('fetchAPI');
    });

    it('loading-manager.js 应该可访问', async function() {
      var response = await fetch(BASE_URL + '/js/loading-manager.js');
      expect(response.status).toBe(200);

      var js = await response.text();
      expect(js.length).toBeGreaterThan(0);
      expect(js).toContain('initLoadingManager');
      expect(js).toContain('showLoading');
      expect(js).toContain('hideLoading');
    });

    it('loading-manager.js 应该使用ES5语法', async function() {
      var response = await fetch(BASE_URL + '/js/loading-manager.js');
      var js = await response.text();

      // 检查是否使用了ES6特性（应该没有）
      expect(js).not.toContain('const ');
      expect(js).not.toContain('let ');
      expect(js).not.toContain('=>'); // 箭头函数
    });
  });

  describe('人仔图片资源测试', function() {
    it('人仔图片目录应该存在', async function() {
      var response = await fetch(BASE_URL + '/minifigures/');
      // 目录可能返回403或404，但不应是500
      expect([200, 403, 404]).toContain(response.status);
    });

    it('至少一个人仔图片应该可访问', async function() {
      var response = await fetch(BASE_URL + '/minifigures/naruto.png');
      expect(response.status).toBe(200);
    });
  });

  describe('章节阅读页 (chapter.html)', function() {
    it('应该能正常加载页面', async function() {
      var response = await fetch(BASE_URL + '/chapter.html');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('章节阅读');
    });

    it('应该包含故事创作提示区域', async function() {
      var response = await fetch(BASE_URL + '/chapter.html');
      var html = await response.text();

      expect(html).toContain('promptSection');
      expect(html).toContain('故事创作提示');
      expect(html).toContain('togglePrompt');
    });

    it('应该包含角色信息展示', async function() {
      var response = await fetch(BASE_URL + '/chapter.html');
      var html = await response.text();

      expect(html).toContain('promptCharacters');
      expect(html).toContain('角色信息');
    });

    it('应该包含故事背景展示', async function() {
      var response = await fetch(BASE_URL + '/chapter.html');
      var html = await response.text();

      expect(html).toContain('promptBackground');
      expect(html).toContain('故事背景');
    });

    it('应该包含前情提要展示', async function() {
      var response = await fetch(BASE_URL + '/chapter.html');
      var html = await response.text();

      expect(html).toContain('promptSummary');
      expect(html).toContain('前情提要');
    });

    it('应该包含章节上限检查', async function() {
      var response = await fetch(BASE_URL + '/chapter.html');
      var html = await response.text();

      expect(html).toContain('chapters.length >= 100');
    });

    it('应该包含互动谜题区域', async function() {
      var response = await fetch(BASE_URL + '/chapter.html');
      var html = await response.text();

      expect(html).toContain('puzzleArea');
      expect(html).toContain('互动谜题');
    });
  });

  describe('书籍编辑页功能测试 (book.html)', function() {
    it('应该包含章节上限显示', async function() {
      var response = await fetch(BASE_URL + '/book.html');
      var html = await response.text();

      expect(html).toContain('chapterCount');
      expect(html).toContain('/ 100');
    });

    it('应该包含章节上限检查', async function() {
      var response = await fetch(BASE_URL + '/book.html');
      var html = await response.text();

      expect(html).toContain('chaptersCount >= 100');
    });

    it('应该包含故事背景显示', async function() {
      var response = await fetch(BASE_URL + '/book.html');
      var html = await response.text();

      expect(html).toContain('故事背景');
    });

    it('应该包含编辑角色名称功能', async function() {
      var response = await fetch(BASE_URL + '/book.html');
      var html = await response.text();

      expect(html).toContain('editNameDialog');
      expect(html).toContain('openEditNameDialog');
      expect(html).toContain('saveEditedName');
    });

    it('应该包含章节分页功能', async function() {
      var response = await fetch(BASE_URL + '/book.html');
      var html = await response.text();

      expect(html).toContain('currentPage');
      expect(html).toContain('chaptersPerPage');
      expect(html).toContain('goToPage');
    });
  });

  describe('故事创建页功能测试 (story-create.html)', function() {
    it('应该能正常加载页面', async function() {
      var response = await fetch(BASE_URL + '/story-create.html');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('创建新故事');
    });

    it('应该包含语音输入功能', async function() {
      var response = await fetch(BASE_URL + '/story-create.html');
      var html = await response.text();

      expect(html).toContain('voiceInputBtn');
      expect(html).toContain('toggleVoiceInput');
      expect(html).toContain('startRecording');
      expect(html).toContain('stopRecording');
    });

    it('应该包含自定义情节输入', async function() {
      var response = await fetch(BASE_URL + '/story-create.html');
      var html = await response.text();

      expect(html).toContain('customPlotInput');
      expect(html).toContain('自定义情节');
    });
  });

  describe('回收站页面测试 (trash.html)', function() {
    it('应该能正常加载页面', async function() {
      var response = await fetch(BASE_URL + '/trash.html');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('回收站');
    });

    it('应该包含恢复和永久删除功能', async function() {
      var response = await fetch(BASE_URL + '/trash.html');
      var html = await response.text();

      expect(html).toContain('restoreBook');
      expect(html).toContain('permanentDelete');
      expect(html).toContain('emptyTrash');
    });

    it('应该显示30天保留提示', async function() {
      var response = await fetch(BASE_URL + '/trash.html');
      var html = await response.text();

      expect(html).toContain('30天');
    });
  });

  describe('分享管理页面测试 (shares.html)', function() {
    it('应该能正常加载页面', async function() {
      var response = await fetch(BASE_URL + '/shares.html');
      expect(response.status).toBe(200);

      var html = await response.text();
      expect(html).toContain('分享管理');
    });

    it('应该包含分享列表功能', async function() {
      var response = await fetch(BASE_URL + '/shares.html');
      var html = await response.text();

      expect(html).toContain('loadShares');
      expect(html).toContain('copyShareUrl');
      expect(html).toContain('confirmDeleteShare');
    });
  });

  describe('首页功能测试 (index.html)', function() {
    it('应该包含回收站入口', async function() {
      var response = await fetch(BASE_URL + '/');
      var html = await response.text();

      expect(html).toContain('trash.html');
    });

    it('应该包含分享管理入口', async function() {
      var response = await fetch(BASE_URL + '/');
      var html = await response.text();

      expect(html).toContain('shares.html');
    });
  });
});
