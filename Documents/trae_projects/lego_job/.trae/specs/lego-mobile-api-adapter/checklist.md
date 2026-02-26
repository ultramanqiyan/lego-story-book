# Lego-Mobile API 接口适配检查清单

## 一、API 文件检查

### 1.1 users.js
- [ ] 检查 GET /users 接口参数
- [ ] 检查 POST /users 接口参数
- [ ] 检查 PUT /users 接口参数
- [ ] 移除 `timeUsed` 参数
- [ ] 添加 `username` 参数支持
- [ ] 添加 `email` 参数支持
- [ ] 添加 `avatar` 参数支持
- [ ] 保留 `dailyTimeLimit` 参数

### 1.2 characters.js
- [ ] 检查 GET /characters 接口参数
- [ ] 检查 POST /characters 接口参数
- [ ] 检查 PUT /characters 接口参数
- [ ] 检查 DELETE /characters 接口参数
- [ ] POST 接口添加 `imageBase64` 参数
- [ ] PUT 接口添加 `imageBase64` 参数

### 1.3 books.js
- [ ] 检查 GET /books?userId 接口
- [ ] 检查 GET /books?bookId 接口
- [ ] 检查 POST /books 接口
- [ ] 检查 PUT /books 接口
- [ ] 检查 DELETE /books 接口
- [ ] 确认参数与后端一致

### 1.4 chapters.js
- [ ] 检查 GET /chapters 接口
- [ ] 检查 POST /chapters 接口
- [ ] 检查 DELETE /chapters 接口
- [ ] 检查章节完成接口
- [ ] 检查章节生成接口
- [ ] 确认参数与后端一致

### 1.5 story.js
- [ ] 检查 POST /story 接口
- [ ] 添加 `forcePuzzle` 参数
- [ ] 确认其他参数一致

### 1.6 puzzle.js
- [ ] 检查 POST /puzzle 接口
- [ ] 添加 GET /puzzle 接口
- [ ] 支持 `id` 查询参数
- [ ] 支持 `chapterId` 查询参数

### 1.7 share.js
- [ ] 检查 GET /share 接口
- [ ] 添加分享码查询支持
- [ ] 检查 POST /share 接口
- [ ] 添加 `password` 参数
- [ ] 添加 `isPublic` 参数
- [ ] 添加 DELETE /share 接口

### 1.8 bookCharacters.js
- [ ] 检查是否存在独立文件
- [ ] 添加 GET /book-characters 接口
- [ ] 检查 POST 接口
- [ ] 检查 PUT 接口
- [ ] 检查 DELETE 接口

### 1.9 index.js
- [ ] 更新导出列表
- [ ] 确保所有新增函数导出

---

## 二、接口参数对比检查

### 2.1 用户模块参数
| 参数 | 前端支持 | 后端支持 | 状态 |
|-----|---------|---------|------|
| userId | ✅ | ✅ | 一致 |
| username | ❓ | ✅ | 待确认 |
| email | ✅ | ✅ | 一致 |
| avatar | ❌ | ✅ | 需添加 |
| parentId | ❌ | ✅ | 可选添加 |
| dailyTimeLimit | ✅ | ✅ | 一致 |
| timeUsed | ✅ | ❌ | 需移除 |

### 2.2 人仔模块参数
| 参数 | 前端支持 | 后端支持 | 状态 |
|-----|---------|---------|------|
| name | ✅ | ✅ | 一致 |
| imageBase64 | ❌ | ✅ | 需添加 |
| description | ✅ | ✅ | 一致 |
| personality | ✅ | ✅ | 一致 |
| speakingStyle | ✅ | ✅ | 一致 |
| creatorId | ✅ | ✅ | 一致 |

### 2.3 故事生成模块参数
| 参数 | 前端支持 | 后端支持 | 状态 |
|-----|---------|---------|------|
| characters | ✅ | ✅ | 一致 |
| plot | ✅ | ✅ | 一致 |
| chapter | ✅ | ✅ | 一致 |
| chapterCharacters | ✅ | ✅ | 一致 |
| previousSummary | ✅ | ✅ | 一致 |
| previousPuzzle | ✅ | ✅ | 一致 |
| plotSelection | ✅ | ✅ | 一致 |
| forcePuzzle | ❌ | ✅ | 需添加 |

### 2.4 分享模块参数
| 参数 | 前端支持 | 后端支持 | 状态 |
|-----|---------|---------|------|
| bookId | ✅ | ✅ | 一致 |
| userId | ✅ | ✅ | 一致 |
| code | ❌ | ✅ | 需添加 |
| password | ❌ | ✅ | 需添加 |
| isPublic | ❌ | ✅ | 需添加 |

---

## 三、代码质量检查

### 3.1 静态检查
- [ ] 运行 ESLint 检查
- [ ] 修复所有 error 级别问题
- [ ] 修复所有 warning 级别问题
- [ ] 检查未使用的变量
- [ ] 检查未使用的导入

### 3.2 代码规范
- [ ] 函数命名规范
- [ ] 参数命名规范
- [ ] 注释完整性
- [ ] 错误处理完整性

### 3.3 类型检查 (如有 TypeScript/JSDoc)
- [ ] 参数类型定义正确
- [ ] 返回值类型定义正确
- [ ] 无类型错误

---

## 四、测试检查

### 4.1 单元测试
- [ ] users.js 测试覆盖
- [ ] characters.js 测试覆盖
- [ ] books.js 测试覆盖
- [ ] chapters.js 测试覆盖
- [ ] story.js 测试覆盖
- [ ] puzzle.js 测试覆盖
- [ ] share.js 测试覆盖
- [ ] bookCharacters.js 测试覆盖

### 4.2 集成测试
- [ ] 用户登录流程
- [ ] 书籍创建流程
- [ ] 章节生成流程
- [ ] 谜题提交流程
- [ ] 分享功能流程

### 4.3 测试覆盖率
- [ ] 语句覆盖率 > 80%
- [ ] 分支覆盖率 > 70%
- [ ] 函数覆盖率 > 80%

---

## 五、功能验证检查

### 5.1 核心功能
- [ ] 用户登录正常
- [ ] 书籍列表显示正常
- [ ] 书籍详情显示正常
- [ ] 章节阅读正常
- [ ] 谜题功能正常

### 5.2 新增功能
- [ ] 人仔图片上传正常
- [ ] 分享码访问正常
- [ ] 分享密码保护正常
- [ ] 谜题详情获取正常

### 5.3 边界情况
- [ ] 网络错误处理
- [ ] 参数缺失处理
- [ ] 权限错误处理

---

## 六、文档检查

### 6.1 API 文档
- [ ] 接口说明完整
- [ ] 参数说明完整
- [ ] 返回值说明完整
- [ ] 错误码说明完整

### 6.2 代码注释
- [ ] 函数注释完整
- [ ] 复杂逻辑注释
- [ ] TODO 标记清理

---

## 七、发布检查

### 7.1 版本控制
- [ ] 代码已提交
- [ ] 提交信息规范
- [ ] 分支管理正确

### 7.2 兼容性
- [ ] 向后兼容
- [ ] 不影响现有功能
- [ ] 迁移指南 (如有破坏性变更)

---

## 检查结果汇总

| 检查项 | 通过 | 失败 | 跳过 |
|-------|------|------|------|
| API 文件检查 | - | - | - |
| 参数对比检查 | - | - | - |
| 代码质量检查 | - | - | - |
| 测试检查 | - | - | - |
| 功能验证检查 | - | - | - |
| 文档检查 | - | - | - |
| 发布检查 | - | - | - |

**最终状态**: ⏳ 待检查
