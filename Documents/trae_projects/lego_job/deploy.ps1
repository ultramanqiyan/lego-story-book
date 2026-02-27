# 乐高故事书项目 - 一键部署脚本 (PowerShell版本)
# 使用方法：右键点击此文件，选择"使用 PowerShell 运行"
# 或在PowerShell中执行：.\deploy.ps1

param(
    [switch]$SkipEnvCheck,
    [switch]$Force
)

# 设置错误处理
$ErrorActionPreference = "Stop"

# 颜色函数
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Step {
    param([string]$Message)
    Write-Host "`n[步骤] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  ✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "  ! $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "  ✗ $Message" -ForegroundColor Red
}

# 显示欢迎信息
Clear-Host
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║         乐高故事书项目 - 一键部署到 Cloudflare Pages        ║" -ForegroundColor Magenta
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# 检查是否在项目根目录
if (-not (Test-Path "wrangler.toml")) {
    Write-Error "请在项目根目录运行此脚本！"
    Write-Host "当前目录: $PWD" -ForegroundColor Gray
    Read-Host "按回车键退出"
    exit 1
}

# 步骤1：检查必要工具
Write-Step "检查必要工具..."

# 检查Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js: $nodeVersion"
} catch {
    Write-Error "未安装 Node.js"
    Write-Host "请访问 https://nodejs.org/ 下载安装" -ForegroundColor Gray
    Read-Host "按回车键退出"
    exit 1
}

# 检查npm
try {
    $npmVersion = npm --version
    Write-Success "npm: $npmVersion"
} catch {
    Write-Error "未安装 npm"
    Read-Host "按回车键退出"
    exit 1
}

# 步骤2：检查Cloudflare登录状态
Write-Step "检查 Cloudflare 登录状态..."

try {
    $whoami = npx wrangler whoami 2>&1
    if ($whoami -match "You are logged in") {
        Write-Success "已登录 Cloudflare"
    } else {
        throw "Not logged in"
    }
} catch {
    Write-Warning "未登录，正在打开登录页面..."
    Write-Host "请在浏览器中完成授权..." -ForegroundColor Gray
    npx wrangler login
    if ($LASTEXITCODE -ne 0) {
        Write-Error "登录失败"
        Read-Host "按回车键退出"
        exit 1
    }
    Write-Success "登录成功"
}

# 步骤3：检查数据库
Write-Step "检查数据库..."

$dbName = "lego-story-db"
$dbExists = npx wrangler d1 list 2>$null | Select-String $dbName

if ($dbExists) {
    Write-Success "数据库 $dbName 已存在"
} else {
    Write-Warning "数据库不存在，正在创建..."
    $createResult = npx wrangler d1 create $dbName 2>&1
    
    if ($createResult -match "database_id") {
        Write-Success "数据库创建成功"
        
        # 提取数据库ID
        $dbId = $createResult | Select-String "database_id.*?([a-f0-9]+)" | ForEach-Object { $_.Matches.Groups[1].Value }
        
        Write-Host ""
        Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
        Write-Host "║  重要：请将以下数据库ID复制到 wrangler.toml 文件中         ║" -ForegroundColor Yellow
        Write-Host "╠════════════════════════════════════════════════════════════╣" -ForegroundColor Yellow
        Write-Host "║  database_id = `"$dbId`"                                   " -ForegroundColor Yellow
        Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
        Write-Host ""
        
        Read-Host "已更新 wrangler.toml？按回车继续"
    } else {
        Write-Warning "数据库创建可能失败，请检查输出"
    }
}

# 步骤4：执行数据库迁移
Write-Step "执行数据库迁移..."

if (Test-Path "migrations") {
    Write-Host "  正在执行本地迁移..." -NoNewline
    npx wrangler d1 migrations apply $dbName --local 2>$null
    Write-Host " 完成" -ForegroundColor Green
    
    Write-Host "  正在执行远程迁移..." -NoNewline
    npx wrangler d1 migrations apply $dbName 2>$null
    Write-Host " 完成" -ForegroundColor Green
    
    Write-Success "数据库迁移完成"
} else {
    Write-Warning "未找到 migrations 目录，跳过迁移"
}

# 步骤5：检查环境变量
Write-Step "检查环境变量配置..."

Write-Host ""
Write-Host "  请确保已在 Cloudflare Dashboard 中配置以下环境变量：" -ForegroundColor White
Write-Host ""
Write-Host "  ┌─────────────────────────────────────────────────────────┐" -ForegroundColor DarkGray
Write-Host "  │  DOUBAO_API_KEY      - 豆包AI密钥（必需）               │" -ForegroundColor DarkGray
Write-Host "  │  SEEDREAM_API_KEY    - 图片生成密钥（必需）             │" -ForegroundColor DarkGray
Write-Host "  │  SILICONFLOW_API_KEY - 语音识别密钥（可选）             │" -ForegroundColor DarkGray
Write-Host "  └─────────────────────────────────────────────────────────┘" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  配置方法：" -ForegroundColor White
Write-Host "  1. 访问 https://dash.cloudflare.com" -ForegroundColor Gray
Write-Host "  2. 进入 Workers & Pages > lego-story-book > Settings" -ForegroundColor Gray
Write-Host "  3. 点击 Environment variables 添加变量" -ForegroundColor Gray
Write-Host ""

if (-not $SkipEnvCheck) {
    $continue = Read-Host "  已配置好环境变量？按 Y 继续"
    if ($continue -ne "Y" -and $continue -ne "y") {
        Write-Host "部署已取消" -ForegroundColor Yellow
        Read-Host "按回车键退出"
        exit 0
    }
}

# 步骤6：部署到Cloudflare Pages
Write-Step "部署到 Cloudflare Pages..."

Write-Host ""
$deployResult = npx wrangler pages deploy . --project-name=lego-story-book 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Error "部署失败"
    Write-Host $deployResult -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 步骤7：显示部署信息
Write-Step "部署完成！"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    部署成功！                              ║" -ForegroundColor Green
Write-Host "╠════════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  访问地址：                                                ║" -ForegroundColor Green
Write-Host "║    https://lego-story-book.pages.dev                      ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  管理控制台：                                              ║" -ForegroundColor Green
Write-Host "║    https://dash.cloudflare.com                             ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║  本地开发：                                                ║" -ForegroundColor Green
Write-Host "║    npx wrangler pages dev . --port 8788                    ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# 尝试打开浏览器
try {
    Start-Process "https://lego-story-book.pages.dev"
    Write-Host "已在浏览器中打开项目地址" -ForegroundColor Gray
} catch {
    # 忽略错误
}

Read-Host "按回车键退出"
