# Tasks

## P0: 紧急修复现有不一致

- [x] Task 1: 全面检查 API 文件与后端接口一致性
  - [x] SubTask 1.1: 检查 users.js 与后端 users.js 一致性
  - [x] SubTask 1.2: 检查 characters.js 与后端 characters.js 一致性
  - [x] SubTask 1.3: 检查 books.js 与后端 books.js 一致性
  - [x] SubTask 1.4: 检查 chapters.js 与后端 chapters.js 一致性
  - [x] SubTask 1.5: 检查 story.js 与后端 story.js 一致性
  - [x] SubTask 1.6: 检查 puzzle.js 与后端 puzzle.js 一致性
  - [x] SubTask 1.7: 检查 share.js 与后端 share.js 一致性
  - [x] SubTask 1.8: 检查 bookCharactersAPI 与后端 book-characters.js 一致性

- [x] Task 2: 全面检查 UI 层对 API 的调用
  - [x] SubTask 2.1: 检查所有 screens 文件中的 usersAPI 调用
  - [x] SubTask 2.2: 检查所有 screens 文件中的 charactersAPI 调用
  - [x] SubTask 2.3: 检查所有 screens 文件中的 booksAPI 调用
  - [x] SubTask 2.4: 检查所有 screens 文件中的 chaptersAPI 调用
  - [x] SubTask 2.5: 检查所有 screens 文件中的其他 API 调用

- [x] Task 3: 修复发现的所有不一致问题
  - [x] SubTask 3.1: 修复 API 文件中的接口定义
  - [x] SubTask 3.2: 修复 UI 层中的 API 调用

## P1: 建立长效机制

- [x] Task 4: 创建 API 类型定义文件
  - [x] SubTask 4.1: 创建 lego-mobile/src/api/types.js
  - [x] SubTask 4.2: 定义所有 API 接口的参数类型
  - [x] SubTask 4.3: 定义所有 API 接口的返回值类型
  - [x] SubTask 4.4: 添加详细的 JSDoc 注释

- [x] Task 5: 为 API 文件添加 JSDoc 类型注释
  - [x] SubTask 5.1: 为 users.js 添加 JSDoc 注释
  - [x] SubTask 5.2: 为 characters.js 添加 JSDoc 注释
  - [x] SubTask 5.3: 为 books.js 添加 JSDoc 注释
  - [x] SubTask 5.4: 为 chapters.js 添加 JSDoc 注释
  - [x] SubTask 5.5: 为 story.js 添加 JSDoc 注释
  - [x] SubTask 5.6: 为 puzzle.js 添加 JSDoc 注释
  - [x] SubTask 5.7: 为 share.js 添加 JSDoc 注释

## P2: 自动化验证

- [ ] Task 6: 创建 API 验证脚本
  - [ ] SubTask 6.1: 创建 lego-mobile/scripts/verify-api.js
  - [ ] SubTask 6.2: 实现后端接口定义解析
  - [ ] SubTask 6.3: 实现前端 API 定义解析
  - [ ] SubTask 6.4: 实现一致性对比检查
  - [ ] SubTask 6.5: 输出检查报告

- [ ] Task 7: 添加接口一致性测试
  - [ ] SubTask 7.1: 创建 API 接口测试文件
  - [ ] SubTask 7.2: 测试所有 API 方法的参数签名
  - [ ] SubTask 7.3: 测试返回值结构

- [ ] Task 8: 运行测试验证
  - [ ] SubTask 8.1: 运行单元测试
  - [ ] SubTask 8.2: 确认所有测试通过

# Task Dependencies

- Task 2 依赖 Task 1（先检查 API 层，再检查 UI 层）
- Task 3 依赖 Task 1, Task 2（先发现问题，再修复）
- Task 4, Task 5 可并行执行
- Task 6 依赖 Task 4（需要类型定义文件）
- Task 7 依赖 Task 4, Task 5（需要类型定义）
- Task 8 依赖 Task 3, Task 7（修复后验证）
