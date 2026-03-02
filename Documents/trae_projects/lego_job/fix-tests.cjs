const fs = require('fs');
const file = 'c:/Users/yannis/Documents/trae_projects/lego_job/lego-mobile/tests/playwright/core-functions.spec.js';
let content = fs.readFileSync(file, 'utf8');

// 替换所有 text=XXXScreen 为 text=/XXXScreen/
content = content.replace(/text=StoryCreateScreen/g, 'text=/StoryCreateScreen/');
content = content.replace(/text=BookDetailScreen/g, 'text=/BookDetailScreen/');
content = content.replace(/text=ThemeSettingsScreen/g, 'text=/ThemeSettingsScreen/');
content = content.replace(/text=ParentControlScreen/g, 'text=/ParentControlScreen/');
content = content.replace(/text=StoryDirectorScreen/g, 'text=/StoryDirectorScreen/');
content = content.replace(/text=ChapterScreen/g, 'text=/ChapterScreen/');

// 只替换第1453行的 LoginScreen（在ensureAuthenticated中已经修改过了，所以跳过）
// content = content.replace(/text=LoginScreen/g, 'text=/LoginScreen/');

fs.writeFileSync(file, content);
console.log('替换完成！');
