# 乐高故事书籍功能 - 部署文档

## 1. 部署概述

### 1.1 部署架构
```
┌─────────────────────────────────────────────────────────────┐
│                      GitHub Repository                       │
│                    (Source Code Storage)                     │
└─────────────────────────┬───────────────────────────────────┘
                          │ Push/PR
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   Cloudflare Pages                           │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Static Pages  │  │  Page Functions │                  │
│  │   (Next.js)     │  │   (API Routes)  │                  │
│  └─────────────────┘  └─────────────────┘                  │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Cloudflare D1 Database                  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 部署环境信息
- **托管平台**: Cloudflare Pages
- **数据库**: Cloudflare D1
- **Account ID**: 384f38befa8bb63e7629d36cb248d8a4
- **Database UUID**: 10e66538-d906-424f-a478-b34d156e6ee2
- **代码仓库**: GitHub

## 2. 前置条件

### 2.1 账户准备
1. Cloudflare账户
2. GitHub账户
3. 火山引擎账户（用于AI API）
4. SiliconFlow账户（用于语音识别）

### 2.2 本地环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- Wrangler CLI

## 3. 项目配置

### 3.1 package.json
```json
{
    "name": "lego-story-book",
    "version": "1.0.0",
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "export": "next build && next export",
        "start": "next start",
        "lint": "next lint",
        "test": "jest",
        "test:unit": "jest --testPathPattern=tests/unit",
        "test:integration": "jest --testPathPattern=tests/integration",
        "test:e2e": "playwright test",
        "test:coverage": "jest --coverage",
        "deploy": "wrangler pages deploy out"
    },
    "dependencies": {
        "next": "^14.0.0",
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
    },
    "devDependencies": {
        "@playwright/test": "^1.40.0",
        "jest": "^29.7.0",
        "@testing-library/react": "^14.0.0",
        "@testing-library/jest-dom": "^6.1.0",
        "wrangler": "^3.0.0"
    }
}
```

### 3.2 next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    images: {
        unoptimized: true
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || ''
    }
}

module.exports = nextConfig
```

### 3.3 wrangler.toml
```toml
name = "lego-story-book"
compatibility_date = "2024-01-01"
pages_build_output_dir = "out"

[[d1_databases]]
binding = "DB"
database_name = "lego-story-db"
database_id = "10e66538-d906-424f-a478-b34d156e6ee2"

[vars]
ENVIRONMENT = "production"
```

## 4. 数据库初始化

### 4.1 创建数据库
```bash
wrangler d1 create lego-story-db
```

### 4.2 数据库迁移脚本

创建文件 `schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'child',
    parent_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    personality TEXT NOT NULL,
    speaking_style TEXT NOT NULL,
    creator_id TEXT DEFAULT 'system',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    user_id TEXT NOT NULL,
    chapter_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    characters TEXT NOT NULL,
    plot TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shares (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    share_code TEXT UNIQUE NOT NULL,
    password TEXT,
    is_public INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT
);

CREATE TABLE IF NOT EXISTS parent_controls (
    id TEXT PRIMARY KEY,
    parent_id TEXT NOT NULL,
    child_id TEXT NOT NULL,
    daily_time_limit INTEGER DEFAULT 60,
    allowed_start_hour INTEGER DEFAULT 8,
    allowed_end_hour INTEGER DEFAULT 21,
    break_reminder_interval INTEGER DEFAULT 30,
    content_filter_level TEXT DEFAULT 'medium',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usage_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    duration INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_parent_id ON users(parent_id);
CREATE INDEX IF NOT EXISTS idx_characters_creator_id ON characters(creator_id);
CREATE INDEX IF NOT EXISTS idx_books_user_id ON books(user_id);
CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_shares_book_id ON shares(book_id);
CREATE INDEX IF NOT EXISTS idx_shares_share_code ON shares(share_code);
CREATE INDEX IF NOT EXISTS idx_parent_controls_child_id ON parent_controls(child_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_id ON usage_logs(user_id);
```

### 4.3 执行迁移
```bash
wrangler d1 execute lego-story-db --file=./schema.sql
```

### 4.4 初始化预设人仔数据

创建文件 `seed.sql`:

```sql
INSERT INTO characters (id, name, image, description, personality, speaking_style, creator_id) VALUES
('preset-001', '乐高蝙蝠侠', 'batman_base64', '哥谭暗夜骑士', '勇敢、正义、严肃', '低沉有力', 'system'),
('preset-002', '乐高蜘蛛侠', 'spiderman_base64', '友好邻居英雄', '活泼、幽默、善良', '轻松俏皮', 'system'),
('preset-003', '乐高火影忍者', 'naruto_base64', '忍者村忍者', '热血、坚韧、乐观', '充满干劲', 'system'),
('preset-004', '乐高恐龙', 'dinosaur_base64', '史前巨兽', '威猛、古老、神秘', '低沉咆哮', 'system'),
('preset-005', '乐高公主', 'princess_base64', '童话王国', '优雅、善良、勇敢', '温柔甜美', 'system'),
('preset-006', '乐高骑士', 'knight_base64', '中世纪战士', '忠诚、勇敢、正直', '庄重有力', 'system'),
('preset-007', '乐高巫师', 'wizard_base64', '魔法大师', '智慧、神秘、慈祥', '古老深奥', 'system'),
('preset-008', '乐高宇航员', 'astronaut_base64', '太空探索者', '好奇、勇敢、科学', '专业冷静', 'system'),
('preset-009', '乐高海盗', 'pirate_base64', '七海冒险家', '豪爽、自由、机智', '粗犷豪迈', 'system'),
('preset-010', '乐高精灵', 'elf_base64', '森林守护者', '敏捷、聪慧、友善', '清脆悦耳', 'system'),
('preset-011', '乐高机器人', 'robot_base64', '未来科技', '精确、理性、忠诚', '机械平稳', 'system'),
('preset-012', '乐高超人', 'superman_base64', '氪星之子', '正义、无私、强大', '坚定有力', 'system');
```

```bash
wrangler d1 execute lego-story-db --file=./seed.sql
```

## 5. GitHub配置

### 5.1 创建仓库
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lego-story-book.git
git push -u origin main
```

### 5.2 GitHub Secrets配置
在GitHub仓库设置中添加以下Secrets:

| Secret名称 | 描述 |
|-----------|------|
| CLOUDFLARE_API_TOKEN | Cloudflare API Token |
| CLOUDFLARE_ACCOUNT_ID | Cloudflare Account ID |
| DOUBAO_API_KEY | 火山引擎 Doubao API Key |
| SEEDREAM_API_KEY | 火山引擎 Seedream API Key |
| SILICONFLOW_API_KEY | SiliconFlow API Key |
| JWT_SECRET | JWT签名密钥 |

### 5.3 GitHub Actions配置

创建文件 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
    push:
        branches:
            - main
    pull_request:
        branches:
            - main

jobs:
    test:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            
            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: '18'
                  cache: 'npm'
            
            - name: Install dependencies
              run: npm ci
            
            - name: Run lint
              run: npm run lint
            
            - name: Run tests
              run: npm run test:coverage
              env:
                  CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
                  CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
            
            - name: Upload coverage
              uses: codecov/codecov-action@v3
              with:
                  files: ./coverage/lcov.info

    deploy:
        needs: test
        runs-on: ubuntu-latest
        if: github.ref == 'refs/heads/main'
        steps:
            - uses: actions/checkout@v3
            
            - name: Setup Node.js
              uses: actions/setup-node@v3
              with:
                  node-version: '18'
                  cache: 'npm'
            
            - name: Install dependencies
              run: npm ci
            
            - name: Build
              run: npm run build
              env:
                  NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
            
            - name: Deploy to Cloudflare Pages
              uses: cloudflare/pages-action@v1
              with:
                  apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
                  accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
                  projectName: lego-story-book
                  directory: out
                  gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## 6. Cloudflare Pages配置

### 6.1 创建项目
1. 登录 Cloudflare Dashboard
2. 进入 Pages 页面
3. 点击 "Create a project"
4. 选择 "Connect to Git"
5. 选择 GitHub 仓库
6. 配置构建设置:
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `out`

### 6.2 环境变量配置
在 Cloudflare Pages 项目设置中添加环境变量:

| 变量名称 | 值 |
|---------|---|
| DB | D1数据库绑定 |
| DOUBAO_API_KEY | 火山引擎API Key |
| SEEDREAM_API_KEY | 火山引擎Seedream API Key |
| SILICONFLOW_API_KEY | SiliconFlow API Key |
| JWT_SECRET | JWT签名密钥 |
| ENVIRONMENT | production |

### 6.3 绑定D1数据库
1. 进入项目设置
2. 选择 "Functions"
3. 在 "D1 database bindings" 中添加:
   - Variable name: `DB`
   - D1 database: `lego-story-db`

## 7. 部署流程

### 7.1 开发环境部署
```bash
npm run dev
```

### 7.2 本地预览生产构建
```bash
npm run build
npm run start
```

### 7.3 手动部署
```bash
npm run build
wrangler pages deploy out --project-name=lego-story-book
```

### 7.4 自动部署
推送到main分支后，GitHub Actions会自动执行:
1. 运行测试
2. 构建项目
3. 部署到Cloudflare Pages

## 8. 域名配置

### 8.1 默认域名
Cloudflare Pages会提供默认域名:
`https://lego-story-book.pages.dev`

### 8.2 自定义域名
1. 在项目设置中选择 "Custom domains"
2. 点击 "Set up a custom domain"
3. 输入域名并验证
4. 配置DNS记录

## 9. 监控与日志

### 9.1 查看部署日志
```bash
wrangler pages deployment list --project-name=lego-story-book
wrangler pages deployment tail --project-name=lego-story-book
```

### 9.2 查看函数日志
```bash
wrangler pages function tail --project-name=lego-story-book
```

### 9.3 Cloudflare Analytics
在Cloudflare Dashboard中可以查看:
- 页面访问量
- 响应时间
- 错误率
- 带宽使用

## 10. 回滚操作

### 10.1 查看部署历史
```bash
wrangler pages deployment list --project-name=lego-story-book
```

### 10.2 回滚到指定版本
```bash
wrangler pages deployment rollback --project-name=lego-story-book --deployment-id=<deployment_id>
```

### 10.3 通过GitHub回滚
```bash
git revert HEAD
git push origin main
```

## 11. 安全配置

### 11.1 API密钥管理
- 所有API密钥存储在Cloudflare环境变量中
- 不在代码中硬编码任何密钥
- 定期轮换密钥

### 11.2 访问控制
- 配置Cloudflare防火墙规则
- 启用Bot Protection
- 配置Rate Limiting

### 11.3 HTTPS配置
- Cloudflare自动提供SSL证书
- 强制HTTPS重定向

## 12. 性能优化

### 12.1 缓存配置
在 `_headers` 文件中配置:
```
/*
    Cache-Control: public, max-age=3600

/static/*
    Cache-Control: public, max-age=31536000, immutable

/_next/static/*
    Cache-Control: public, max-age=31536000, immutable
```

### 12.2 图片优化
- 使用WebP格式
- 图片懒加载
- 响应式图片

## 13. 故障排除

### 13.1 常见问题

#### 构建失败
- 检查Node.js版本
- 检查依赖版本
- 查看构建日志

#### 函数执行错误
- 检查D1数据库绑定
- 检查环境变量配置
- 查看函数日志

#### 数据库连接失败
- 确认数据库已创建
- 确认绑定配置正确
- 检查数据库权限

### 13.2 调试命令
```bash
wrangler pages project list
wrangler d1 list
wrangler d1 info lego-story-db
```

## 14. 维护计划

### 14.1 定期任务
- 每周检查部署状态
- 每月检查日志和错误
- 每季度更新依赖

### 14.2 备份策略
- 数据库定期导出
- 代码版本控制
- 配置文件备份
