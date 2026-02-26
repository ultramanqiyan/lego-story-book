# 乐高故事书项目前端设计文档（优化版）

## 文档信息

| 项目名称 | 乐高故事书 |
|----------|------------|
| 文档版本 | V2.0 |
| 编写日期 | 2026年2月26日 |
| 文档状态 | 正式发布 |
| 优化说明 | 基于苏格拉底式提问深度反思，结合项目实际前端实现 |

---

## 一、苏格拉底式提问与回答（30问）

### 1.1 关于页面结构（5问）

**Q1：项目包含哪些HTML页面？**

**回答**：项目包含以下HTML页面：

| 页面文件 | 功能 | 主要组件 |
|----------|------|----------|
| index.html | 首页/登录页 | 用户名输入、登录按钮 |
| bookshelf.html | 书架页 | 书籍列表、创建书籍按钮 |
| book.html | 书籍详情页 | 章节列表、角色管理、生成按钮 |
| adventure.html | 冒险/阅读页 | 故事内容、谜题区域 |
| characters.html | 角色管理页 | 角色列表、创建角色表单 |
| settings.html | 设置页 | 主题切换、账户设置 |
| share.html | 分享页 | 分享内容展示 |

**Q2：页面之间的导航关系是什么？**

**回答**：页面导航关系：

```
index.html (登录)
    │
    ▼
bookshelf.html (书架)
    │
    ├──▶ book.html (书籍详情)
    │       │
    │       └──▶ adventure.html (阅读)
    │
    └──▶ characters.html (角色管理)
```

**导航方式**：
- 通过`window.location.href`跳转
- 通过URL参数传递数据（如`?bookId=xxx`）

**Q3：每个页面的主要功能是什么？**

**回答**：

| 页面 | 主要功能 |
|------|----------|
| index.html | 用户登录（输入用户名） |
| bookshelf.html | 显示用户书籍列表、创建新书籍 |
| book.html | 显示书籍详情、管理角色、生成章节 |
| adventure.html | 阅读故事、解谜 |
| characters.html | 管理角色（创建、编辑、删除） |
| settings.html | 切换主题、查看账户信息 |
| share.html | 查看分享的书籍内容 |

**Q4：页面布局是如何设计的？**

**回答**：页面布局采用响应式设计：

**通用布局结构**：
```html
<body>
  <header>标题栏</header>
  <main>主内容区</main>
  <footer>底部栏（可选）</footer>
</body>
```

**响应式断点**：
- 移动端：< 768px
- 平板：768px - 1024px
- 桌面：> 1024px

**Q5：页面加载性能如何优化？**

**回答**：性能优化措施：

| 优化项 | 方法 |
|--------|------|
| 资源加载 | CSS/JS内联，减少HTTP请求 |
| 图片优化 | 使用Base64编码，无额外请求 |
| 缓存策略 | 利用Cloudflare CDN缓存 |
| 代码压缩 | 部署时自动压缩 |

---

### 1.2 关于样式设计（5问）

**Q6：CSS变量有哪些？**

**回答**：项目使用的CSS变量：

```css
:root {
  /* 主题色 */
  --primary-color: #FFD700;
  --secondary-color: #FF6B6B;
  --background-color: #1a1a2e;
  --text-color: #ffffff;
  
  /* 字体 */
  --font-family: 'Nunito', sans-serif;
  
  /* 间距 */
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  
  /* 圆角 */
  --border-radius: 12px;
  
  /* 阴影 */
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

**Q7：主题切换是如何实现的？**

**回答**：主题切换实现：

```javascript
// 切换主题
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// 加载保存的主题
function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', savedTheme);
}
```

**CSS定义**：
```css
[data-theme="light"] {
  --background-color: #ffffff;
  --text-color: #333333;
}

[data-theme="dark"] {
  --background-color: #1a1a2e;
  --text-color: #ffffff;
}
```

**Q8：响应式断点是如何设置的？**

**回答**：响应式断点设置：

```css
/* 移动端优先 */
.container {
  width: 100%;
  padding: var(--spacing-sm);
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}
```

**Q9：动画效果是如何实现的？**

**回答**：动画效果实现：

**CSS过渡**：
```css
.button {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}
```

**CSS动画**：
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.story-content {
  animation: fadeIn 0.5s ease forwards;
}
```

**Q10：字体选择是什么？**

**回答**：字体选择：

| 用途 | 字体 | 说明 |
|------|------|------|
| 主字体 | Nunito | 圆润友好，适合儿童 |
| 备用字体 | sans-serif | 系统默认 |
| 代码字体 | monospace | 等宽字体 |

**加载方式**：
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
```

---

### 1.3 关于交互设计（5问）

**Q11：用户登录流程是怎样的？**

**回答**：登录流程：

```
1. 用户输入用户名
2. 点击登录按钮
3. 前端发送POST /api/users请求
4. 接收响应（userId）
5. 保存userId到localStorage
6. 跳转到bookshelf.html
```

**代码实现**：
```javascript
async function login() {
  const username = document.getElementById('username').value.trim();
  if (!username) {
    showToast('请输入用户名');
    return;
  }
  
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('username', username);
    window.location.href = 'bookshelf.html';
  }
}
```

**Q12：创建书籍流程是怎样的？**

**回答**：创建书籍流程：

```
1. 用户点击"创建书籍"按钮
2. 弹出输入框，输入书名
3. 发送POST /api/books请求
4. 接收响应（bookId）
5. 刷新书籍列表
6. 跳转到书籍详情页
```

**Q13：生成故事流程是怎样的？**

**回答**：生成故事流程：

```
1. 用户点击"生成下一章"按钮
2. 显示加载状态
3. 发送POST /api/chapters-generate请求
4. 等待AI响应（5-15秒）
5. 接收响应（chapterId）
6. 跳转到阅读页面
```

**加载状态显示**：
```javascript
function showLoading() {
  document.getElementById('loading-overlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading-overlay').style.display = 'none';
}
```

**Q14：解谜流程是怎样的？**

**回答**：解谜流程：

```
1. 用户阅读完故事
2. 点击"去解谜"按钮
3. 显示谜题界面
4. 用户选择答案
5. 发送POST /api/puzzle请求
6. 显示结果（正确/错误）
7. 错误2次后显示提示
```

**Q15：错误提示如何展示？**

**回答**：错误提示展示：

**Toast提示**：
```javascript
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, duration);
}
```

**CSS样式**：
```css
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  z-index: 1000;
}
```

---

### 1.4 关于组件设计（5问）

**Q16：有哪些可复用的UI组件？**

**回答**：可复用组件：

| 组件 | 用途 | 文件位置 |
|------|------|----------|
| 书籍卡片 | 显示书籍信息 | bookshelf.html |
| 角色卡片 | 显示角色信息 | characters.html |
| 章节卡片 | 显示章节信息 | book.html |
| 按钮组件 | 各种按钮 | 全局 |
| Toast提示 | 消息提示 | 全局 |

**Q17：按钮样式有哪些变体？**

**回答**：按钮变体：

```css
/* 主要按钮 */
.btn-primary {
  background: var(--primary-color);
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: var(--border-radius);
  cursor: pointer;
}

/* 次要按钮 */
.btn-secondary {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

/* 危险按钮 */
.btn-danger {
  background: #ff4444;
  color: white;
}

/* 禁用状态 */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Q18：卡片组件如何设计？**

**回答**：卡片组件设计：

```css
.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.card-content {
  color: rgba(255, 255, 255, 0.8);
}
```

**Q19：表单组件如何设计？**

**回答**：表单组件设计：

```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius);
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-color);
  font-size: 1rem;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.5);
}
```

**Q20：弹窗组件如何设计？**

**回答**：弹窗组件设计：

```css
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--background-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
}
```

---

### 1.5 关于用户体验（5问）

**Q21：加载状态如何展示？**

**回答**：加载状态展示：

**加载遮罩**：
```html
<div id="loading-overlay" class="loading-overlay">
  <div class="spinner"></div>
  <p>正在生成故事...</p>
</div>
```

**CSS样式**：
```css
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Q22：空状态如何展示？**

**回答**：空状态展示：

```html
<div class="empty-state">
  <div class="empty-icon">📚</div>
  <h3>还没有书籍</h3>
  <p>点击下方按钮创建你的第一本书</p>
  <button class="btn-primary">创建书籍</button>
</div>
```

**Q23：错误状态如何展示？**

**回答**：错误状态展示：

```javascript
function showError(title, message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-state';
  errorDiv.innerHTML = `
    <div class="error-icon">⚠️</div>
    <h3>${title}</h3>
    <p>${message}</p>
    <button class="btn-secondary" onclick="location.reload()">重试</button>
  `;
  document.getElementById('content').innerHTML = '';
  document.getElementById('content').appendChild(errorDiv);
}
```

**Q24：成功反馈如何展示？**

**回答**：成功反馈展示：

```javascript
function showSuccess(message) {
  showToast(`✅ ${message}`, 2000);
}

// 使用示例
showSuccess('书籍创建成功');
showSuccess('章节生成完成');
showSuccess('答对了！');
```

**Q25：用户引导如何设计？**

**回答**：用户引导设计：

**首次使用引导**：
```javascript
function showOnboarding() {
  if (!localStorage.getItem('onboarding_shown')) {
    // 显示引导提示
    showTooltip('创建你的第一本书籍吧！', 'create-btn');
    localStorage.setItem('onboarding_shown', 'true');
  }
}
```

---

### 1.6 关于可访问性（5问）

**Q26：是否支持键盘导航？**

**回答**：键盘导航支持：

| 按键 | 功能 |
|------|------|
| Tab | 切换焦点 |
| Enter | 确认/提交 |
| Escape | 关闭弹窗 |
| Arrow Keys | 列表导航 |

**实现**：
```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
```

**Q27：是否支持屏幕阅读器？**

**回答**：屏幕阅读器支持：

**ARIA标签**：
```html
<button aria-label="创建新书籍">
  <span class="icon">+</span>
</button>

<nav aria-label="主导航">
  <a href="bookshelf.html">书架</a>
</nav>

<main role="main">
  <!-- 主内容 -->
</main>
```

**Q28：颜色对比度是否符合标准？**

**回答**：颜色对比度：

| 组合 | 对比度 | WCAG标准 |
|------|--------|----------|
| 白字/深色背景 | 12:1 | AAA级 |
| 黄字/深色背景 | 8:1 | AAA级 |
| 灰字/深色背景 | 4.5:1 | AA级 |

**符合WCAG 2.1 AA级标准。**

**Q29：字体大小是否可调整？**

**回答**：字体大小使用相对单位：

```css
html {
  font-size: 16px; /* 基准大小 */
}

h1 { font-size: 2rem; }   /* 32px */
h2 { font-size: 1.5rem; } /* 24px */
p { font-size: 1rem; }    /* 16px */
```

用户可通过浏览器设置调整字体大小。

**Q30：是否支持触摸操作？**

**回答**：触摸操作支持：

**触摸友好设计**：
- 按钮最小尺寸：44x44px
- 点击区域足够大
- 支持滑动操作

**触摸事件**：
```javascript
element.addEventListener('touchstart', handleTouchStart);
element.addEventListener('touchend', handleTouchEnd);
```

---

## 二、页面结构详解

### 2.1 index.html（登录页）

```
┌─────────────────────────────────┐
│           Logo                  │
│         乐高故事书               │
├─────────────────────────────────┤
│                                 │
│    ┌─────────────────────┐     │
│    │  请输入用户名        │     │
│    └─────────────────────┘     │
│                                 │
│    ┌─────────────────────┐     │
│    │      开始冒险        │     │
│    └─────────────────────┘     │
│                                 │
└─────────────────────────────────┘
```

### 2.2 bookshelf.html（书架页）

```
┌─────────────────────────────────┐
│  我的书架              [+创建]  │
├─────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐      │
│  │ 书籍1   │  │ 书籍2   │      │
│  │ 5章     │  │ 3章     │      │
│  └─────────┘  └─────────┘      │
│                                 │
│  ┌─────────┐                   │
│  │ 书籍3   │                   │
│  │ 2章     │                   │
│  └─────────┘                   │
└─────────────────────────────────┘
```

---

## 三、CSS样式规范

### 3.1 命名规范

| 类型 | 命名方式 | 示例 |
|------|----------|------|
| 类名 | kebab-case | .book-card |
| ID | camelCase | #mainContent |
| 变量 | kebab-case | --primary-color |
| 动画 | camelCase | @keyframes fadeIn |

### 3.2 文件组织

```
styles/
├── variables.css    # CSS变量
├── reset.css        # 重置样式
├── base.css         # 基础样式
├── components.css   # 组件样式
└── themes.css       # 主题样式
```

---

## 附录：修订历史

| 版本 | 日期 | 修订内容 | 作者 |
|------|------|----------|------|
| V1.0 | 2026-02-25 | 初始版本 | 项目团队 |
| V2.0 | 2026-02-26 | 基于苏格拉底式提问深度优化，添加实际代码实现 | 项目团队 |
