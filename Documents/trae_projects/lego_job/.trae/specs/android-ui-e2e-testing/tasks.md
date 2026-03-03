# Android UI E2E 测试任务列表

## 静态检查：Android与后端API字段对比

### 修复的字段不匹配问题

#### 1. Book 模型
| 后端字段 | 修复前 | 修复后 |
|----------|--------|--------|
| user_id | 缺少 | ✅ 添加 |
| updated_at | 缺少 | ✅ 添加 |
| plotSelection | 缺少 | ✅ 添加 |

#### 2. Chapter 模型
| 后端字段 | 修复前 | 修复后 |
|----------|--------|--------|
| has_puzzle (整数) | 只支持Boolean | ✅ 添加 @SerializedName 支持 |
| created_at | 缺少 | ✅ 添加 |

#### 3. Character 模型
| 后端字段 | 修复前 | 修复后 |
|----------|--------|--------|
| image_base64 | 只有imageBase64 | ✅ 添加下划线版本 |
| created_at | 缺少 | ✅ 添加 |
| updated_at | 缺少 | ✅ 添加 |

#### 4. BookCharacter 模型
| 后端字段 | 修复前 | 修复后 |
|----------|--------|--------|
| original_name | 缺少 | ✅ 添加 |
| image_base64 | 缺少 | ✅ 添加 |
| created_at | 缺少 | ✅ 添加 |
| resolveCustomName() | 只用name | ✅ 优先使用original_name |

#### 5. Puzzle 模型
| 后端字段 | 修复前 | 修复后 |
|----------|--------|--------|
| puzzle_type | 只有type | ✅ 添加puzzle_type |
| created_at | 缺少 | ✅ 添加 |
| question | 必填 | ✅ 改为可选(默认空字符串) |

### 修复的文件

1. **core/src/main/java/com/legostory/mobile/core/model/Models.kt**
   - Book: 添加 user_id, updated_at, plotSelection
   - Chapter: 添加 @SerializedName("has_puzzle"), created_at
   - Character: 添加 image_base64, created_at, updated_at
   - BookCharacter: 添加 original_name, image_base64, created_at
   - Puzzle: 添加 puzzle_type, created_at

### 构建状态

✅ BUILD SUCCESSFUL
✅ APK 已安装

### 后续测试

请在模拟器上测试：
1. 书籍详情页章节列表是否显示
2. 章节内容是否正确加载
3. 角色列表是否正确显示
