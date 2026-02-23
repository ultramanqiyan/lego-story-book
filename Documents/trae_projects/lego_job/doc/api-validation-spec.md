# API接口检验规范

## 1. 参数验证规范

### 1.1 必填参数验证
所有API必须验证必填参数：
```javascript
if (!param) return createErrorResponse('参数不能为空', 400);
```

### 1.2 参数格式验证
- 字符串长度限制
- 数字范围限制
- 枚举值验证

### 1.3 参数存在性验证
- 检查关联数据是否存在（如bookId对应的书籍是否存在）
- 返回404错误

## 2. 前后端参数名一致性规范

### 2.1 URL参数命名规范
| 页面 | 参数名 | 说明 |
|------|--------|------|
| book.html | id | 书籍ID |
| adventure.html | chapterId | 章节ID |
| share.html | bookId | 书籍ID |
| share.html | code | 分享码 |

### 2.2 API参数命名规范
| API | 参数名 | 说明 |
|-----|--------|------|
| GET /api/books | bookId, userId | 书籍ID, 用户ID |
| GET /api/chapters | id, bookId | 章节ID, 书籍ID |
| GET /api/puzzle | puzzleId | 谜题ID |
| GET /api/share | code | 分享码 |

## 3. 错误处理规范

### 3.1 HTTP状态码使用
- 200: 成功
- 400: 客户端错误（参数错误）
- 404: 资源不存在
- 500: 服务器错误

### 3.2 错误响应格式
```json
{
  "success": false,
  "error": "错误信息"
}
```

### 3.3 成功响应格式
```json
{
  "success": true,
  "data": {...},
  "message": "操作成功"
}
```

## 4. 接口检查清单

### 4.1 创建类接口（POST）
- [ ] 验证必填参数
- [ ] 验证参数格式
- [ ] 检查关联数据存在性
- [ ] 检查业务限制（如数量上限）
- [ ] 返回创建的资源ID

### 4.2 查询类接口（GET）
- [ ] 验证必填参数
- [ ] 检查资源存在性
- [ ] 返回完整数据

### 4.3 更新类接口（PUT）
- [ ] 验证必填参数
- [ ] 检查资源存在性
- [ ] 验证更新参数格式
- [ ] 返回更新结果

### 4.4 删除类接口（DELETE）
- [ ] 验证必填参数
- [ ] 检查资源存在性
- [ ] 处理关联数据
- [ ] 返回删除结果

## 5. 前端调用规范

### 5.1 参数传递
```javascript
// URL参数
const url = '/api/chapters?id=' + chapterId;

// POST body
const body = {
  bookId: bookId,
  title: title,
  content: content
};
```

### 5.2 错误处理
```javascript
try {
  const data = await fetchAPI('/api/xxx', options);
  // 处理成功响应
} catch (error) {
  showToast('操作失败：' + error.message, 'error');
}
```

## 6. 测试验证规范

### 6.1 单元测试
- 测试参数验证
- 测试错误处理
- 测试边界条件

### 6.2 端到端测试
- 测试完整用户流程
- 测试页面跳转参数传递
- 测试错误恢复

## 7. 已知问题修复记录

| 问题 | 原因 | 修复 | 日期 |
|------|------|------|------|
| adventure.html无法加载章节 | 参数名不匹配 | 支持chapterId和chapter两个参数名 | 2024-01-XX |
| 故事创建后无章节 | 未自动生成第一章 | 添加自动生成逻辑 | 2024-01-XX |
