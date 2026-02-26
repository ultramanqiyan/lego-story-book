# Checklist

## P0: 紧急修复

### API 文件与后端一致性
- [x] users.js 接口定义与后端一致
- [x] characters.js 接口定义与后端一致
- [x] books.js 接口定义与后端一致
- [x] chapters.js 接口定义与后端一致
- [x] story.js 接口定义与后端一致
- [x] puzzle.js 接口定义与后端一致
- [x] share.js 接口定义与后端一致
- [x] bookCharactersAPI 接口定义与后端一致

### UI 层 API 调用正确性
- [x] ParentControlScreen.js API 调用正确
- [x] CharactersScreen.js API 调用正确
- [x] AdventureScreen.js API 调用正确
- [x] StoryCreateScreen.js API 调用正确
- [x] StoryDirectorScreen.js API 调用正确
- [x] BookDetailScreen.js API 调用正确
- [x] ChapterScreen.js API 调用正确
- [x] ShareScreen.js API 调用正确
- [x] HomeScreen.js API 调用正确
- [x] BookshelfScreen.js API 调用正确

## P1: 类型定义

### types.js 文件
- [x] 创建 api/types.js 文件
- [x] 用户模块类型定义完整
- [x] 人仔模块类型定义完整
- [x] 书籍模块类型定义完整
- [x] 章节模块类型定义完整
- [x] 故事模块类型定义完整
- [x] 谜题模块类型定义完整
- [x] 分享模块类型定义完整

### JSDoc 注释
- [x] users.js 添加 JSDoc 注释
- [x] characters.js 添加 JSDoc 注释
- [x] books.js 添加 JSDoc 注释
- [x] chapters.js 添加 JSDoc 注释
- [x] story.js 添加 JSDoc 注释
- [x] puzzle.js 添加 JSDoc 注释
- [x] share.js 添加 JSDoc 注释

## P2: 自动化验证

### 验证脚本
- [ ] 创建 verify-api.js 脚本（后续完善）
- [ ] 脚本可解析后端接口定义（后续完善）
- [ ] 脚本可解析前端 API 定义（后续完善）
- [ ] 脚本可输出一致性报告（后续完善）

### 测试覆盖
- [x] 创建 API 接口测试文件
- [x] 所有 API 方法有对应测试
- [x] 测试覆盖率 > 80%

### 最终验证
- [x] npm test 全部通过 (11 suites, 151 tests)
- [x] 无 TypeScript/ESLint 错误
- [x] 无运行时错误

## 长效机制

### 文档完善
- [x] 更新 API 使用文档（types.js 作为单一数据源）
- [x] 添加接口变更流程说明
- [x] 添加代码审查清单

### 流程规范
- [x] 建立接口变更同步机制
- [x] 建立 PR 检查清单
