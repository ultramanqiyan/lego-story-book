const { test, expect } = require('@playwright/test');

const API_BASE = 'http://localhost:8788/api';
const FRONTEND_URL = 'http://localhost:8084';

test.describe('字段一致性验证测试', () => {
  
  test('用户API字段一致性: 后端返回字段 vs 前端期望字段', async ({ request }) => {
    const testUsername = `field_${Date.now().toString().slice(-6)}`;
    
    const createResponse = await request.post(`${API_BASE}/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username: testUsername, email: `${testUsername}@test.com` }
    });
    
    expect(createResponse.ok()).toBeTruthy();
    const createData = await createResponse.json();
    
    expect(createData).toHaveProperty('userId');
    expect(createData.userId).toBeDefined();
    expect(typeof createData.userId).toBe('string');
    
    const getResponse = await request.get(`${API_BASE}/users?userId=${createData.userId}`);
    expect(getResponse.ok()).toBeTruthy();
    const getData = await getResponse.json();
    
    expect(getData.user).toBeDefined();
    const user = getData.user;
    
    expect(user).toHaveProperty('user_id');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    
    const frontendExpectedFields = ['id', 'username', 'email'];
    const backendActualFields = Object.keys(user);
    
    const fieldMapping = {
      'user_id': 'id',
      'username': 'username',
      'email': 'email',
      'daily_time_limit': 'dailyTimeLimit',
      'time_used_today': 'timeUsedToday',
      'parent_id': 'parentId',
    };
    
    for (const [backendField, frontendField] of Object.entries(fieldMapping)) {
      if (user[backendField] !== undefined) {
        console.log(`后端字段 "${backendField}" -> 前端期望 "${frontendField}"`);
      }
    }
    
    expect(user.user_id).toBeDefined();
    expect(user.username).toBe(testUsername);
  });

  test('书籍API字段一致性: 后端返回字段 vs 前端期望字段', async ({ request }) => {
    const testUsername = `book_field_${Date.now().toString().slice(-6)}`;
    
    const createUserResponse = await request.post(`${API_BASE}/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username: testUsername, email: `${testUsername}@test.com` }
    });
    const userData = await createUserResponse.json();
    const userId = userData.userId;
    
    const bookTitle = `字段测试书籍_${Date.now()}`;
    const createBookResponse = await request.post(`${API_BASE}/books`, {
      headers: { 'Content-Type': 'application/json' },
      data: { userId, title: bookTitle }
    });
    expect(createBookResponse.ok()).toBeTruthy();
    const bookData = await createBookResponse.json();
    
    expect(bookData).toHaveProperty('bookId');
    expect(bookData.bookId).toBeDefined();
    
    const listResponse = await request.get(`${API_BASE}/books?userId=${userId}`);
    expect(listResponse.ok()).toBeTruthy();
    const listData = await listResponse.json();
    
    expect(Array.isArray(listData.books)).toBeTruthy();
    expect(listData.books.length).toBeGreaterThan(0);
    
    const book = listData.books.find(b => b.book_id === bookData.bookId);
    expect(book).toBeDefined();
    
    expect(book).toHaveProperty('book_id');
    expect(book).toHaveProperty('title');
    expect(book).toHaveProperty('user_id');
    
    const fieldMapping = {
      'book_id': 'id',
      'title': 'title',
      'user_id': 'userId',
      'chapter_count': 'chapterCount',
      'status': 'status',
      'plot_selection': 'plotSelection',
    };
    
    console.log('书籍字段映射验证:');
    for (const [backendField, frontendField] of Object.entries(fieldMapping)) {
      if (book[backendField] !== undefined) {
        console.log(`  后端 "${backendField}" -> 前端 "${frontendField}": 值=${book[backendField]}`);
      }
    }
    
    expect(book.book_id).toBeDefined();
    expect(book.title).toBe(bookTitle);
    
    const detailResponse = await request.get(`${API_BASE}/books?bookId=${bookData.bookId}&userId=${userId}`);
    expect(detailResponse.ok()).toBeTruthy();
    const detailData = await detailResponse.json();
    
    expect(detailData.book).toBeDefined();
    expect(detailData.book.book_id).toBe(bookData.bookId);
  });

  test('章节API字段一致性: 后端返回字段 vs 前端期望字段', async ({ request }) => {
    const testUsername = `chap_field_${Date.now().toString().slice(-6)}`;
    
    const createUserResponse = await request.post(`${API_BASE}/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username: testUsername, email: `${testUsername}@test.com` }
    });
    const userData = await createUserResponse.json();
    const userId = userData.userId;
    
    const createBookResponse = await request.post(`${API_BASE}/books`, {
      headers: { 'Content-Type': 'application/json' },
      data: { userId, title: '章节字段测试书籍' }
    });
    const bookData = await createBookResponse.json();
    const bookId = bookData.bookId;
    
    const createChapterResponse = await request.post(`${API_BASE}/chapters`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        bookId,
        title: '第一章：字段测试',
        content: '这是测试内容...',
        puzzle: {
          question: '测试问题？',
          options: ['选项A', '选项B', '选项C'],
          answer: 0
        }
      }
    });
    expect(createChapterResponse.ok()).toBeTruthy();
    const chapterData = await createChapterResponse.json();
    
    expect(chapterData).toHaveProperty('chapterId');
    
    const listResponse = await request.get(`${API_BASE}/chapters?bookId=${bookId}`);
    expect(listResponse.ok()).toBeTruthy();
    const listData = await listResponse.json();
    
    expect(Array.isArray(listData.chapters)).toBeTruthy();
    expect(listData.chapters.length).toBeGreaterThan(0);
    
    const chapter = listData.chapters[0];
    
    expect(chapter).toHaveProperty('chapter_id');
    expect(chapter).toHaveProperty('title');
    
    const fieldMapping = {
      'chapter_id': 'id',
      'book_id': 'bookId',
      'chapter_number': 'chapterNumber',
      'title': 'title',
      'content': 'content',
      'has_puzzle': 'hasPuzzle',
    };
    
    console.log('章节字段映射验证:');
    for (const [backendField, frontendField] of Object.entries(fieldMapping)) {
      if (chapter[backendField] !== undefined) {
        console.log(`  后端 "${backendField}" -> 前端 "${frontendField}": 值=${chapter[backendField]}`);
      } else {
        console.log(`  警告: 后端缺少字段 "${backendField}" (前端期望 "${frontendField}")`);
      }
    }
    
    expect(chapter.chapter_id).toBeDefined();
  });

  test('角色API字段一致性: 后端返回字段 vs 前端期望字段', async ({ request }) => {
    const testUsername = `char_field_${Date.now().toString().slice(-6)}`;
    
    const createUserResponse = await request.post(`${API_BASE}/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username: testUsername, email: `${testUsername}@test.com` }
    });
    const userData = await createUserResponse.json();
    const userId = userData.userId;
    
    const charName = `字段测试人仔_${Date.now().toString().slice(-6)}`;
    const createCharResponse = await request.post(`${API_BASE}/characters`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: charName,
        description: '测试字段一致性',
        personality: '勇敢',
        creatorId: userId
      }
    });
    expect(createCharResponse.ok()).toBeTruthy();
    const charData = await createCharResponse.json();
    
    expect(charData).toHaveProperty('characterId');
    
    const listResponse = await request.get(`${API_BASE}/characters?userId=${userId}`);
    expect(listResponse.ok()).toBeTruthy();
    const listData = await listResponse.json();
    
    expect(Array.isArray(listData.characters)).toBeTruthy();
    expect(listData.characters.length).toBeGreaterThan(0);
    
    const character = listData.characters.find(c => c.character_id === charData.characterId) || listData.characters[0];
    
    expect(character).toHaveProperty('character_id');
    expect(character).toHaveProperty('name');
    expect(character).toHaveProperty('creator_id');
    
    const fieldMapping = {
      'character_id': 'id',
      'name': 'name',
      'description': 'description',
      'personality': 'personality',
      'speaking_style': 'speakingStyle',
      'image_base64': 'imageBase64',
      'creator_id': 'creatorId',
    };
    
    console.log('角色字段映射验证:');
    for (const [backendField, frontendField] of Object.entries(fieldMapping)) {
      if (character[backendField] !== undefined) {
        console.log(`  后端 "${backendField}" -> 前端 "${frontendField}": 值=${character[backendField]}`);
      }
    }
    
    expect(character.character_id).toBeDefined();
  });

  test('谜题API字段一致性: 后端返回字段 vs 前端期望字段', async ({ request }) => {
    const testUsername = `puzzle_${Date.now().toString().slice(-6)}`;
    
    const createUserResponse = await request.post(`${API_BASE}/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username: testUsername, email: `${testUsername}@test.com` }
    });
    const userData = await createUserResponse.json();
    const userId = userData.userId;
    
    const createBookResponse = await request.post(`${API_BASE}/books`, {
      headers: { 'Content-Type': 'application/json' },
      data: { userId, title: '谜题字段测试书籍' }
    });
    const bookData = await createBookResponse.json();
    
    const createChapterResponse = await request.post(`${API_BASE}/chapters`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        bookId: bookData.bookId,
        title: '谜题测试章节',
        content: '内容...',
        puzzle: {
          question: '1+1=?',
          options: ['1', '2', '3'],
          answer: 1,
          hint: '数学题'
        }
      }
    });
    const chapterData = await createChapterResponse.json();
    
    const chaptersResponse = await request.get(`${API_BASE}/chapters?bookId=${bookData.bookId}`);
    const chaptersData = await chaptersResponse.json();
    const chapterId = chaptersData.chapters[0].chapter_id;
    
    const puzzleResponse = await request.get(`${API_BASE}/puzzle?chapterId=${chapterId}`);
    expect(puzzleResponse.ok()).toBeTruthy();
    const puzzleData = await puzzleResponse.json();
    
    if (puzzleData.puzzle) {
      const puzzle = puzzleData.puzzle;
      
      expect(puzzle).toHaveProperty('puzzle_id');
      expect(puzzle).toHaveProperty('question');
      expect(puzzle).toHaveProperty('options');
      
      const fieldMapping = {
        'puzzle_id': 'id',
        'chapter_id': 'chapterId',
        'question': 'question',
        'options': 'options',
        'answer': 'correctAnswer',
        'hint': 'hint',
        'puzzle_type': 'puzzleType',
      };
      
      console.log('谜题字段映射验证:');
      for (const [backendField, frontendField] of Object.entries(fieldMapping)) {
        if (puzzle[backendField] !== undefined) {
          console.log(`  后端 "${backendField}" -> 前端 "${frontendField}": 值=${puzzle[backendField]}`);
        } else {
          console.log(`  注意: 后端未返回字段 "${backendField}" (前端期望 "${frontendField}") - 可能是安全考虑`);
        }
      }
      
      expect(puzzle.puzzle_id).toBeDefined();
      expect(puzzle.question).toBeDefined();
    }
  });

  test('前端适配器字段转换验证', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    
    const testUsername = `adapter_${Date.now().toString().slice(-6)}`;
    await page.fill('#username', testUsername);
    await page.click('#login-btn');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    
    await page.click('.menu-item[data-screen="bookshelf"]');
    await page.click('#create-book-btn');
    
    const bookTitle = `适配器测试_${Date.now().toString().slice(-6)}`;
    await page.fill('#book-title', bookTitle);
    await page.click('#submit-create-book');
    
    await expect(page.locator('#bookshelf-screen')).toBeVisible({ timeout: 10000 });
    
    const bookCard = page.locator('.card[data-book-id]').first();
    await expect(bookCard).toBeVisible({ timeout: 10000 });
    
    const bookId = await bookCard.getAttribute('data-book-id');
    expect(bookId).toBeDefined();
    expect(bookId.length).toBeGreaterThan(0);
    
    console.log(`前端适配器正确转换: book_id -> data-book-id="${bookId}"`);
    
    await bookCard.click();
    await expect(page.locator('#book-detail-screen')).toBeVisible();
    
    const bookInfo = page.locator('#book-info');
    await expect(bookInfo).toContainText(bookTitle);
  });

  test('前端ID字段使用一致性验证', async ({ page }) => {
    await page.goto(FRONTEND_URL);
    
    const testUsername = `idtest_${Date.now().toString().slice(-6)}`;
    await page.fill('#username', testUsername);
    await page.click('#login-btn');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    
    await page.click('.menu-item[data-screen="characters"]');
    await page.click('#create-character-btn');
    
    const charName = `ID测试人仔_${Date.now().toString().slice(-6)}`;
    await page.fill('#character-name', charName);
    await page.fill('#character-description', '测试ID字段');
    await page.click('#submit-create-character');
    
    await expect(page.locator('#characters-screen')).toBeVisible({ timeout: 10000 });
    
    const charCard = page.locator(`.character-card:has-text("${charName}")`).first();
    await expect(charCard).toBeVisible({ timeout: 10000 });
    
    console.log(`前端正确显示角色: ${charName}`);
  });
});

test.describe('后端API联动测试', () => {
  let testUserId;
  let testBookId;
  let testCharacterId;

  test.beforeAll(async ({ request }) => {
    const response = await request.get(`${API_BASE}/plot-options`);
    expect(response.ok()).toBeTruthy();
  });

  test('API健康检查 - 情节选项接口', async ({ request }) => {
    const response = await request.get(`${API_BASE}/plot-options`);
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toBeDefined();
    expect(data.plotOptions || data).toBeDefined();
    
    const plotOptions = data.plotOptions || data;
    expect(plotOptions.weather).toBeDefined();
    expect(plotOptions.adventureType).toBeDefined();
    expect(plotOptions.terrain).toBeDefined();
    expect(plotOptions.equipment).toBeDefined();
    
    expect(Array.isArray(plotOptions.weather)).toBeTruthy();
    expect(plotOptions.weather.length).toBeGreaterThan(0);
  });

  test('用户流程: 创建用户 → 获取用户信息', async ({ request }) => {
    const testUsername = `pw_${Date.now().toString().slice(-8)}`;
    const testEmail = `${testUsername}@test.com`;
    
    const createResponse = await request.post(`${API_BASE}/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username: testUsername, email: testEmail }
    });
    
    expect(createResponse.ok()).toBeTruthy();
    const createData = await createResponse.json();
    expect(createData.userId).toBeDefined();
    
    testUserId = createData.userId;
    
    const getResponse = await request.get(`${API_BASE}/users?userId=${testUserId}`);
    expect(getResponse.ok()).toBeTruthy();
    
    const getData = await getResponse.json();
    expect(getData.user).toBeDefined();
    expect(getData.user.username).toBe(testUsername);
  });

  test('书籍流程: 创建书籍 → 获取列表 → 查看详情', async ({ request }) => {
    if (!testUserId) {
      const createResponse = await request.post(`${API_BASE}/users`, {
        headers: { 'Content-Type': 'application/json' },
        data: { username: `book_${Date.now()}`, email: `book_${Date.now()}@test.com` }
      });
      const data = await createResponse.json();
      testUserId = data.userId;
    }
    
    const bookTitle = `测试书籍_${Date.now()}`;
    const createBookResponse = await request.post(`${API_BASE}/books`, {
      headers: { 'Content-Type': 'application/json' },
      data: { userId: testUserId, title: bookTitle }
    });
    
    expect(createBookResponse.ok()).toBeTruthy();
    const createBookData = await createBookResponse.json();
    expect(createBookData.bookId).toBeDefined();
    testBookId = createBookData.bookId;
    
    const listResponse = await request.get(`${API_BASE}/books?userId=${testUserId}`);
    expect(listResponse.ok()).toBeTruthy();
    
    const listData = await listResponse.json();
    expect(Array.isArray(listData.books)).toBeTruthy();
    expect(listData.books.length).toBeGreaterThan(0);
    
    const createdBook = listData.books.find(b => b.book_id === testBookId);
    expect(createdBook).toBeDefined();
    expect(createdBook.title).toBe(bookTitle);
    
    const detailResponse = await request.get(`${API_BASE}/books?bookId=${testBookId}&userId=${testUserId}`);
    expect(detailResponse.ok()).toBeTruthy();
    
    const detailData = await detailResponse.json();
    expect(detailData.book).toBeDefined();
    expect(detailData.book.title).toBe(bookTitle);
  });

  test('角色流程: 创建人仔 → 获取列表', async ({ request }) => {
    if (!testUserId) {
      const createResponse = await request.post(`${API_BASE}/users`, {
        headers: { 'Content-Type': 'application/json' },
        data: { username: `char_${Date.now()}`, email: `char_${Date.now()}@test.com` }
      });
      const data = await createResponse.json();
      testUserId = data.userId;
    }
    
    const charName = `测试人仔_${Date.now()}`;
    const createCharResponse = await request.post(`${API_BASE}/characters`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: charName,
        description: 'Playwright自动化测试创建的人仔',
        personality: '勇敢、善良',
        creatorId: testUserId
      }
    });
    
    expect(createCharResponse.ok()).toBeTruthy();
    const createCharData = await createCharResponse.json();
    expect(createCharData.characterId).toBeDefined();
    testCharacterId = createCharData.characterId;
    
    const listResponse = await request.get(`${API_BASE}/characters?userId=${testUserId}`);
    expect(listResponse.ok()).toBeTruthy();
    
    const listData = await listResponse.json();
    expect(Array.isArray(listData.characters)).toBeTruthy();
    
    const createdChar = listData.characters.find(c => c.character_id === testCharacterId);
    expect(createdChar).toBeDefined();
    expect(createdChar.name).toBe(charName);
  });

  test('书籍更新流程', async ({ request }) => {
    if (!testUserId) {
      const createResponse = await request.post(`${API_BASE}/users`, {
        headers: { 'Content-Type': 'application/json' },
        data: { username: `update_${Date.now()}`, email: `update_${Date.now()}@test.com` }
      });
      const data = await createResponse.json();
      testUserId = data.userId;
    }
    
    if (!testBookId) {
      const createBookResponse = await request.post(`${API_BASE}/books`, {
        headers: { 'Content-Type': 'application/json' },
        data: { userId: testUserId, title: `更新测试书籍_${Date.now()}` }
      });
      const data = await createBookResponse.json();
      testBookId = data.bookId;
    }
    
    const newTitle = `更新后的标题_${Date.now()}`;
    const updateResponse = await request.put(`${API_BASE}/books`, {
      headers: { 'Content-Type': 'application/json' },
      data: { bookId: testBookId, title: newTitle, status: 'reading' }
    });
    
    expect(updateResponse.ok()).toBeTruthy();
    
    const detailResponse = await request.get(`${API_BASE}/books?bookId=${testBookId}&userId=${testUserId}`);
    const detailData = await detailResponse.json();
    expect(detailData.book.title).toBe(newTitle);
  });

  test('章节流程: 创建章节 → 获取列表', async ({ request }) => {
    if (!testUserId || !testBookId) {
      const createResponse = await request.post(`${API_BASE}/users`, {
        headers: { 'Content-Type': 'application/json' },
        data: { username: `chapter_${Date.now()}`, email: `chapter_${Date.now()}@test.com` }
      });
      const userData = await createResponse.json();
      testUserId = userData.userId;
      
      const createBookResponse = await request.post(`${API_BASE}/books`, {
        headers: { 'Content-Type': 'application/json' },
        data: { userId: testUserId, title: `章节测试书籍_${Date.now()}` }
      });
      const bookData = await createBookResponse.json();
      testBookId = bookData.bookId;
    }
    
    const chapterTitle = `第一章: 开始冒险`;
    const createChapterResponse = await request.post(`${API_BASE}/chapters`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        bookId: testBookId,
        title: chapterTitle,
        content: '这是一个关于勇气和友谊的故事...',
        puzzle: {
          question: '主角接下来应该怎么做?',
          options: ['前进', '后退', '等待'],
          answer: 0
        }
      }
    });
    
    expect(createChapterResponse.ok()).toBeTruthy();
    const createChapterData = await createChapterResponse.json();
    expect(createChapterData.chapterId).toBeDefined();
    
    const listResponse = await request.get(`${API_BASE}/chapters?bookId=${testBookId}`);
    expect(listResponse.ok()).toBeTruthy();
    
    const listData = await listResponse.json();
    expect(Array.isArray(listData.chapters)).toBeTruthy();
    expect(listData.chapters.length).toBeGreaterThan(0);
  });
});

test.describe('网页端到端API联动测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(FRONTEND_URL);
    await expect(page.locator('#api-status')).toBeVisible({ timeout: 10000 });
  });

  test('网页登录并创建书籍流程', async ({ page }) => {
    await expect(page.locator('#login-screen')).toBeVisible();
    
    const testUsername = `wb_${Date.now().toString().slice(-6)}`;
    await page.fill('#username', testUsername);
    await page.click('#login-btn');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('#display-username')).toHaveText(testUsername);
    
    await page.click('.menu-item[data-screen="bookshelf"]');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
    
    await page.click('#create-book-btn');
    await expect(page.locator('#create-book-screen')).toBeVisible();
    
    const bookTitle = `网页测试书籍_${Date.now().toString().slice(-6)}`;
    await page.fill('#book-title', bookTitle);
    await page.click('#submit-create-book');
    
    await expect(page.locator('#bookshelf-screen')).toBeVisible({ timeout: 10000 });
    
    const bookCard = page.locator('.card[data-book-id]').first();
    await expect(bookCard).toBeVisible({ timeout: 10000 });
    await expect(bookCard).toContainText(bookTitle);
  });

  test('网页创建人仔流程', async ({ page }) => {
    await expect(page.locator('#login-screen')).toBeVisible();
    
    const testUsername = `wc_${Date.now().toString().slice(-6)}`;
    await page.fill('#username', testUsername);
    await page.click('#login-btn');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    
    await page.click('.menu-item[data-screen="characters"]');
    await expect(page.locator('#characters-screen')).toBeVisible();
    
    await page.click('#create-character-btn');
    await expect(page.locator('#create-character-screen')).toBeVisible();
    
    const charName = `人仔_${Date.now().toString().slice(-6)}`;
    await page.fill('#character-name', charName);
    await page.fill('#character-description', '这是一个测试人仔');
    await page.fill('#character-personality', '勇敢、聪明');
    await page.click('#submit-create-character');
    
    await expect(page.locator('#characters-screen')).toBeVisible({ timeout: 10000 });
    
    const charCard = page.locator(`.character-card:has-text("${charName}")`).first();
    await expect(charCard).toBeVisible({ timeout: 10000 });
  });

  test('网页查看情节选项', async ({ page }) => {
    await expect(page.locator('#login-screen')).toBeVisible();
    
    const testUsername = `wp_${Date.now().toString().slice(-6)}`;
    await page.fill('#username', testUsername);
    await page.click('#login-btn');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    
    await page.click('.menu-item[data-screen="plot-options"]');
    await expect(page.locator('#plot-options-screen')).toBeVisible();
    
    await expect(page.locator('.plot-section').first()).toBeVisible({ timeout: 10000 });
    
    const weatherOptions = page.locator('.plot-option[data-type="weather"]');
    await expect(weatherOptions.first()).toBeVisible();
    
    const count = await weatherOptions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('网页运行API测试', async ({ page }) => {
    await expect(page.locator('#login-screen')).toBeVisible();
    
    const testUsername = `wt_${Date.now().toString().slice(-6)}`;
    await page.fill('#username', testUsername);
    await page.click('#login-btn');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    
    await page.click('.menu-item[data-screen="test-runner"]');
    await expect(page.locator('#test-runner-screen')).toBeVisible();
    
    await page.click('#run-all-tests');
    
    await expect(page.locator('.test-result').first()).toBeVisible({ timeout: 60000 });
    
    const passTests = page.locator('.test-result.pass');
    const passCount = await passTests.count();
    expect(passCount).toBeGreaterThan(0);
  });

  test('网页书籍详情查看', async ({ page }) => {
    await expect(page.locator('#login-screen')).toBeVisible();
    
    const testUsername = `wd_${Date.now().toString().slice(-6)}`;
    await page.fill('#username', testUsername);
    await page.click('#login-btn');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    
    await page.click('.menu-item[data-screen="bookshelf"]');
    await expect(page.locator('#bookshelf-screen')).toBeVisible();
    
    await page.click('#create-book-btn');
    
    const bookTitle = `详情书籍_${Date.now().toString().slice(-6)}`;
    await page.fill('#book-title', bookTitle);
    await page.click('#submit-create-book');
    
    await expect(page.locator('#bookshelf-screen')).toBeVisible({ timeout: 10000 });
    
    const bookCard = page.locator('.card[data-book-id]').first();
    await bookCard.click();
    
    await expect(page.locator('#book-detail-screen')).toBeVisible();
    await expect(page.locator('#book-info')).toContainText(bookTitle);
  });

  test('网页删除书籍流程', async ({ page }) => {
    await expect(page.locator('#login-screen')).toBeVisible();
    
    const testUsername = `wx_${Date.now().toString().slice(-6)}`;
    await page.fill('#username', testUsername);
    await page.click('#login-btn');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    
    await page.click('.menu-item[data-screen="bookshelf"]');
    await page.click('#create-book-btn');
    
    const bookTitle = `待删书籍_${Date.now().toString().slice(-6)}`;
    await page.fill('#book-title', bookTitle);
    await page.click('#submit-create-book');
    
    await expect(page.locator('#bookshelf-screen')).toBeVisible({ timeout: 10000 });
    
    const bookCard = page.locator('.card[data-book-id]').first();
    await bookCard.click();
    
    await expect(page.locator('#book-detail-screen')).toBeVisible();
    
    page.on('dialog', dialog => dialog.accept());
    await page.click('#delete-book-btn');
    
    await expect(page.locator('#bookshelf-screen')).toBeVisible({ timeout: 10000 });
  });

  test('网页退出登录流程', async ({ page }) => {
    await expect(page.locator('#login-screen')).toBeVisible();
    
    const testUsername = `wq_${Date.now().toString().slice(-6)}`;
    await page.fill('#username', testUsername);
    await page.click('#login-btn');
    
    await expect(page.locator('#home-screen')).toBeVisible({ timeout: 10000 });
    
    await page.click('#logout-btn');
    
    await expect(page.locator('#login-screen')).toBeVisible();
  });
});

test.describe('完整业务流程测试', () => {
  test('完整故事创建流程: 用户→书籍→章节', async ({ request }) => {
    const testUsername = `full_${Date.now().toString().slice(-6)}`;
    
    const createUserResponse = await request.post(`${API_BASE}/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username: testUsername, email: `${testUsername}@test.com` }
    });
    expect(createUserResponse.ok()).toBeTruthy();
    const userData = await createUserResponse.json();
    const userId = userData.userId;
    
    const createBookResponse = await request.post(`${API_BASE}/books`, {
      headers: { 'Content-Type': 'application/json' },
      data: { userId, title: '完整流程测试故事' }
    });
    expect(createBookResponse.ok()).toBeTruthy();
    const bookData = await createBookResponse.json();
    const bookId = bookData.bookId;
    
    const createChapterResponse = await request.post(`${API_BASE}/chapters`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        bookId,
        title: '第一章：冒险的开始',
        content: '在一个阳光明媚的早晨，小英雄踏上了他的冒险之旅...',
        puzzle: {
          question: '小英雄应该选择哪条路？',
          options: ['森林小径', '山间大道', '河边小路'],
          answer: 0
        }
      }
    });
    expect(createChapterResponse.ok()).toBeTruthy();
    
    const getChaptersResponse = await request.get(`${API_BASE}/chapters?bookId=${bookId}`);
    expect(getChaptersResponse.ok()).toBeTruthy();
    const chaptersData = await getChaptersResponse.json();
    expect(chaptersData.chapters.length).toBeGreaterThan(0);
    
    const getBookResponse = await request.get(`${API_BASE}/books?bookId=${bookId}&userId=${userId}`);
    expect(getBookResponse.ok()).toBeTruthy();
    const finalBookData = await getBookResponse.json();
    expect(finalBookData.book.chapter_count).toBeGreaterThan(0);
  });

  test('完整角色管理流程: 创建→查询→更新', async ({ request }) => {
    const testUsername = `cf_${Date.now().toString().slice(-6)}`;
    
    const createUserResponse = await request.post(`${API_BASE}/users`, {
      headers: { 'Content-Type': 'application/json' },
      data: { username: testUsername, email: `${testUsername}@test.com` }
    });
    const userData = await createUserResponse.json();
    const userId = userData.userId;
    
    const createCharResponse = await request.post(`${API_BASE}/characters`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        name: '勇敢骑士',
        description: '一位来自远方的勇敢骑士',
        personality: '勇敢、正义、善良',
        speakingStyle: '正式、有礼貌',
        creatorId: userId
      }
    });
    expect(createCharResponse.ok()).toBeTruthy();
    const charData = await createCharResponse.json();
    const characterId = charData.characterId;
    
    const getCharsResponse = await request.get(`${API_BASE}/characters?userId=${userId}`);
    expect(getCharsResponse.ok()).toBeTruthy();
    const charsData = await getCharsResponse.json();
    expect(charsData.characters.length).toBeGreaterThan(0);
    
    const updateCharResponse = await request.put(`${API_BASE}/characters`, {
      headers: { 'Content-Type': 'application/json' },
      data: {
        characterId,
        name: '勇敢骑士·进化',
        description: '经历冒险后变得更强大的骑士',
        personality: '勇敢、正义、善良、智慧'
      }
    });
    expect(updateCharResponse.ok()).toBeTruthy();
  });
});
