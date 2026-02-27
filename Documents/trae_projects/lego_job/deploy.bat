@echo off
chcp 65001 >nul
setlocal enabledelayadexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║         乐高故事书项目 - 一键部署到 Cloudflare Pages        ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM 检查是否在项目根目录
if not exist "wrangler.toml" (
    echo [错误] 请在项目根目录运行此脚本！
    echo 当前目录: %CD%
    pause
    exit /b 1
)

echo [步骤 1/7] 检查必要工具...
echo.

REM 检查Node.js
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [错误] 未安装 Node.js
    echo 请访问 https://nodejs.org/ 下载安装
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo   ✓ Node.js: %%i

REM 检查npm
where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [错误] 未安装 npm
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do echo   ✓ npm: %%i

echo.
echo [步骤 2/7] 检查 Cloudflare 登录状态...
echo.

npx wrangler whoami >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   ✓ 已登录 Cloudflare
) else (
    echo   ! 未登录，正在打开登录页面...
    echo   请在浏览器中完成授权...
    npx wrangler login
    if %ERRORLEVEL% neq 0 (
        echo [错误] 登录失败
        pause
        exit /b 1
    )
    echo   ✓ 登录成功
)

echo.
echo [步骤 3/7] 检查数据库...
echo.

set DB_NAME=lego-story-db

REM 检查数据库是否存在
npx wrangler d1 list 2>nul | findstr /C:"%DB_NAME%" >nul
if %ERRORLEVEL% equ 0 (
    echo   ✓ 数据库 %DB_NAME% 已存在
) else (
    echo   ! 数据库不存在，正在创建...
    npx wrangler d1 create %DB_NAME%
    if %ERRORLEVEL% neq 0 (
        echo [警告] 数据库创建可能失败，请检查
    ) else (
        echo   ✓ 数据库创建成功
        echo.
        echo   ╔════════════════════════════════════════════════════════════╗
        echo   ║  重要：请将上方显示的数据库ID复制到 wrangler.toml 文件中   ║
        echo   ║  格式：database_id = "你的数据库ID"                        ║
        echo   ╚════════════════════════════════════════════════════════════╝
        echo.
        pause
    )
)

echo.
echo [步骤 4/7] 执行数据库迁移...
echo.

if exist "migrations" (
    echo   正在执行本地迁移...
    npx wrangler d1 migrations apply %DB_NAME% --local
    echo   正在执行远程迁移...
    npx wrangler d1 migrations apply %DB_NAME%
    echo   ✓ 数据库迁移完成
) else (
    echo   ! 未找到 migrations 目录，跳过迁移
)

echo.
echo [步骤 5/7] 检查环境变量配置...
echo.

echo   请确保已在 Cloudflare Dashboard 中配置以下环境变量：
echo.
echo   ┌─────────────────────────────────────────────────────────┐
echo   │  DOUBAO_API_KEY      - 豆包AI密钥（必需）               │
echo   │  SEEDREAM_API_KEY    - 图片生成密钥（必需）             │
echo   │  SILICONFLOW_API_KEY - 语音识别密钥（可选）             │
echo   └─────────────────────────────────────────────────────────┘
echo.
echo   配置方法：
echo   1. 访问 https://dash.cloudflare.com
echo   2. 进入 Workers ^& Pages ^> lego-story-book ^> Settings
echo   3. 点击 Environment variables 添加变量
echo.
set /p continue="  已配置好环境变量？按 Y 继续: "
if /i not "%continue%"=="Y" (
    echo 部署已取消
    pause
    exit /b 0
)

echo.
echo [步骤 6/7] 部署到 Cloudflare Pages...
echo.

npx wrangler pages deploy . --project-name=lego-story-book
if %ERRORLEVEL% neq 0 (
    echo [错误] 部署失败
    pause
    exit /b 1
)

echo.
echo [步骤 7/7] 部署完成！
echo.

echo ╔════════════════════════════════════════════════════════════╗
echo ║                    部署成功！                              ║
echo ╠════════════════════════════════════════════════════════════╣
echo ║                                                            ║
echo ║  访问地址：                                                ║
echo ║    https://lego-story-book.pages.dev                      ║
echo ║                                                            ║
echo ║  管理控制台：                                              ║
echo ║    https://dash.cloudflare.com                             ║
echo ║                                                            ║
echo ║  本地开发：                                                ║
echo ║    npx wrangler pages dev . --port 8788                    ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

pause
