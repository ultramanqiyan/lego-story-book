# Tasks

- [x] Task 1: 修改 story.js API 接口
  - [x] SubTask 1.1: 修改 buildStoryPrompt 函数，要求AI返回包含title的JSON格式
  - [x] SubTask 1.2: 修改 extractContent 函数，解析JSON格式的响应
  - [x] SubTask 1.3: 更新接口返回格式，包含title、content、puzzle

- [x] Task 2: 修改 book.html 页面
  - [x] SubTask 2.1: 移除 prompt() 人工输入章节标题和内容
  - [x] SubTask 2.2: 添加章节生成按钮，调用 /api/story 接口
  - [x] SubTask 2.3: 实现章节自动保存功能
  - [x] SubTask 2.4: 更新章节列表显示，显示AI生成的标题

- [x] Task 3: 更新单元测试
  - [x] SubTask 3.1: 修改 story.test.js，测试新的返回格式
  - [x] SubTask 3.2: 添加章节名称提取的测试用例

- [x] Task 4: 验证功能
  - [x] SubTask 4.1: 本地测试章节生成功能通过
  - [x] SubTask 4.2: 验证章节名称符合4-10字要求
  - [x] SubTask 4.3: 验证覆盖率 >= 90%

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]
