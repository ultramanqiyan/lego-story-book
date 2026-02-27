# 移动端章节阅读页关键词高亮修复规范

## Why

用户反馈移动端章节阅读页（ChapterScreen）的故事内容没有关键字飘色（关键词高亮），而网页端有此功能。

经过调查发现：

1. **ChapterScreen.js 已使用 KeywordHighlight 组件**：
   - 第302-306行正确使用了 `<KeywordHighlight content={chapter?.content} characters={bookCharacters} />`

2. **bookCharacters 数据获取逻辑存在问题**：
   - 第111-113行：尝试从 `chaptersAPI.getDetail` 获取 `bookCharacters`，但**后端不返回此数据**
   - 第119-127行：如果有 `bookId`，会额外调用 `booksAPI.getDetail` 获取角色数据

3. **可能的问题原因**：
   - `bookId` 没有正确传递到 ChapterScreen
   - 或者 `bookId` 传递了，但 `booksAPI.getDetail` 调用失败
   - 或者角色数据格式不对导致 KeywordHighlight 无法正确匹配

4. **KeywordHighlight 组件关键词类型不完整**：
   - 网页端支持6种关键词类型：char-name, action-word, emotion-word, location-word, weather-word, item-word
   - 移动端只支持4种：character, action, emotion, location
   - **缺少 weather-word 和 item-word**

5. **之前的gap分析遗漏了此问题**：
   - gap-analysis.md 将"关键词高亮"标记为"一致"
   - 只检查了组件使用，没有验证数据流
   - E2E测试没有验证关键词高亮的视觉效果

## What Changes

- 修复 ChapterScreen 中 bookCharacters 数据获取问题
- 在 KeywordHighlight.js 中添加缺失的关键词类型（weather-word, item-word）
- 添加E2E测试验证关键词高亮功能
- **立即执行**苏格拉底式反思改进：更新gap-analysis.md、socratic-reflection.md，建立功能验证检查清单

## Impact

- Affected specs: mobile-feature-parity
- Affected code:
  - lego-mobile/src/screens/chapter/ChapterScreen.js
  - lego-mobile/src/components/chapter/KeywordHighlight.js
  - lego-mobile/e2e/chapter-keyword-highlight.spec.js (新增)
- Affected docs:
  - .trae/specs/mobile-feature-gap-reflection/gap-analysis.md (立即更新)
  - .trae/specs/mobile-feature-gap-reflection/socratic-reflection.md (立即更新)
  - 功能验证检查清单文档 (立即创建)

---

## ADDED Requirements

### Requirement: 章节阅读页正确获取角色数据

ChapterScreen 应该正确获取书籍角色数据用于关键词高亮。

#### Scenario: 从书籍详情页进入章节阅读
- **GIVEN** 用户在书籍详情页
- **WHEN** 用户点击某个章节
- **THEN** 应该正确传递 bookId 参数到 ChapterScreen
- **AND** ChapterScreen 应该成功获取 bookCharacters 数据
- **AND** 关键词高亮应该正确显示

#### Scenario: 章节导航时保持角色数据
- **GIVEN** 用户在章节阅读页
- **WHEN** 用户点击"上一章"或"下一章"
- **THEN** 应该保持 bookId 参数
- **AND** 新章节也应该正确显示关键词高亮

### Requirement: 关键词高亮支持完整类型

KeywordHighlight组件应该支持所有关键词类型，与网页端保持一致。

#### Scenario: 高亮角色名
- **GIVEN** 故事内容包含角色名
- **WHEN** 渲染故事内容时
- **THEN** 角色名应该使用角色类型对应的颜色高亮
- **AND** 主角使用黄色，反派使用红色，配角使用蓝色

#### Scenario: 高亮动作词
- **GIVEN** 故事内容包含动作词（如"飞向"、"跳跃"、"奔跑"）
- **WHEN** 渲染故事内容时
- **THEN** 动作词应该使用绿色背景高亮

#### Scenario: 高亮情感词
- **GIVEN** 故事内容包含情感词（如"开心"、"快乐"、"勇敢"）
- **WHEN** 渲染故事内容时
- **THEN** 情感词应该使用紫色背景高亮

#### Scenario: 高亮地点词
- **GIVEN** 故事内容包含地点词（如"城堡"、"森林"、"太空"）
- **WHEN** 渲染故事内容时
- **THEN** 地点词应该使用蓝色背景高亮

#### Scenario: 高亮天气词（新增）
- **GIVEN** 故事内容包含天气词（如"阳光"、"浓雾"、"闪电"）
- **WHEN** 渲染故事内容时
- **THEN** 天气词应该使用浅蓝色背景高亮

#### Scenario: 高亮物品词（新增）
- **GIVEN** 故事内容包含物品词（如"魔法杖"、"宝剑"、"盾牌"）
- **WHEN** 渲染故事内容时
- **THEN** 物品词应该使用粉色背景高亮

### Requirement: E2E测试覆盖关键词高亮

E2E测试应该验证章节阅读页的关键词高亮功能。

#### Scenario: 验证章节阅读页显示关键词高亮
- **GIVEN** 用户已登录并打开一个有章节的书籍
- **WHEN** 用户点击进入章节阅读页
- **THEN** 应该能看到故事内容
- **AND** 应该能看到关键词高亮效果

#### Scenario: 验证所有关键词类型
- **GIVEN** 故事内容包含所有类型的关键词
- **WHEN** 渲染故事内容时
- **THEN** 所有类型的关键词都应该正确高亮
- **AND** 每种类型使用不同的颜色

### Requirement: 苏格拉底式反思改进（立即执行）

必须立即执行反思改进，而不是作为未来措施。

#### Scenario: 更新gap-analysis.md
- **GIVEN** 发现了之前遗漏的问题
- **WHEN** 执行反思改进
- **THEN** gap-analysis.md应该立即更新
- **AND** 添加"章节阅读页关键词高亮"到功能缺失清单
- **AND** 记录问题原因

#### Scenario: 更新socratic-reflection.md
- **GIVEN** 发现了之前遗漏的问题
- **WHEN** 执行反思改进
- **THEN** socratic-reflection.md应该立即更新
- **AND** 分析为什么之前的gap分析标记"关键词高亮"为"一致"
- **AND** 记录：只检查了组件使用，没有验证数据流
- **AND** 记录：E2E测试没有验证关键词高亮的视觉效果

#### Scenario: 建立功能验证检查清单
- **GIVEN** 发现了之前遗漏的问题
- **WHEN** 执行反思改进
- **THEN** 应该立即创建功能验证检查清单文档
- **AND** 包含：不仅检查组件使用，还要验证数据传递
- **AND** 包含：E2E测试必须验证视觉效果，不只是功能可用

---

## MODIFIED Requirements

### Requirement: ChapterScreen角色数据获取

ChapterScreen 应该确保 bookCharacters 数据正确获取：
1. 优先从路由参数获取 bookId
2. 如果 bookId 不存在，尝试从 chapter 数据中获取 book_id
3. 如果 bookId 存在，调用 booksAPI.getDetail 获取角色数据

---

## REMOVED Requirements

无
