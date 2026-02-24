import { test, expect } from '@playwright/test';

test.describe('解谜状态API测试', () => {
  test('检查API返回的解谜状态', async ({ page }) => {
    const response = await page.request.get('http://localhost:8788/api/books?bookId=id_mlyydvks_nx9jupj9k&userId=id_mlyyd39k_hn29mxzne');
    const data = await response.json();
    
    console.log('章节数量:', data.chapters.length);
    
    for (let i = 0; i < Math.min(5, data.chapters.length); i++) {
      const ch = data.chapters[i];
      console.log('章节', i + 1, ':', {
        title: ch.title,
        has_puzzle: ch.has_puzzle,
        puzzle_result: ch.puzzle_result,
        isCompleted: ch.isCompleted
      });
    }
    
    const chaptersWithPuzzle = data.chapters.filter(ch => ch.has_puzzle);
    console.log('有谜题的章节数:', chaptersWithPuzzle.length);
    
    const chaptersWithResult = data.chapters.filter(ch => ch.puzzle_result !== undefined);
    console.log('有解谜结果的章节数:', chaptersWithResult.length);
  });
});
