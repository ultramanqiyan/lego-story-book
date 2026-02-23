# Tasks

- [x] Task 1: 完善AI提示词参数
  - [x] SubTask 1.1: 修改 buildStoryPrompt 函数，添加前情提要参数
  - [x] SubTask 1.2: 添加本章角色参数
  - [x] SubTask 1.3: 添加本章情节参数
  - [x] SubTask 1.4: 添加解谜要求参数（随机选择谜题类型）

- [x] Task 2: 实现谜题自动生成
  - [x] SubTask 2.1: 添加谜题生成逻辑（50%概率）
  - [x] SubTask 2.2: 生成谜题数据（question、options、answer、hint、type）
  - [x] SubTask 2.3: 更新返回格式，包含puzzle字段

- [x] Task 3: 实现谜题展示和交互
  - [x] SubTask 3.1: 修改 adventure.html，添加谜题展示区域
  - [x] SubTask 3.2: 实现4个选项按钮（A/B/C/D）
  - [x] SubTask 3.3: 实现答案验证逻辑
  - [x] SubTask 3.4: 实现提示机制（答错2次后显示）

- [x] Task 4: 修正AI模型版本
  - [x] SubTask 4.1: 修改 story.js 模型为 doubao-1-5-pro-32k-250115

- [x] Task 5: 实现提示词展示功能
  - [x] SubTask 5.1: 在 book.html 添加提示词展示区域
  - [x] SubTask 5.2: 实现折叠/展开功能
  - [x] SubTask 5.3: 显示完整提示词内容

- [x] Task 6: 更新单元测试
  - [x] SubTask 6.1: 添加谜题生成测试
  - [x] SubTask 6.2: 添加谜题展示测试
  - [x] SubTask 6.3: 添加提示词展示测试

- [x] Task 7: 验证功能
  - [x] SubTask 7.1: 本地测试谜题生成功能
  - [x] SubTask 7.2: 本地测试谜题展示和交互
  - [x] SubTask 7.3: 验证覆盖率 >= 90%

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 3]
- [Task 6] depends on [Task 1, Task 2, Task 3, Task 4, Task 5]
- [Task 7] depends on [Task 2, Task 3, Task 5, Task 6]
