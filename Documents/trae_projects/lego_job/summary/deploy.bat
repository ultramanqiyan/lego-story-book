@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ==========================================
echo   乐高故事书项目 - 一键部署脚本
echo ==========================================
echo.

REM 颜色定义（Windows不支持ANSI颜色，使用简单文本）

REM 打印函数
:print_step
echo [步骤 %~1] %~2
goto :eof

:print_warning
echo [警告] %~1
goto :eof

:print_error
echo [错误] %~1
goto :eof

:print_success
echo [成功] %~1
goto :eof

REM 步骤1：检查必要工具
call :print_step 1 "检查必要工具..."

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    call :print_error "未安装Node.js，请先安装Node.js"
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo   - Node.js: %NODE_VERSION%

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
    call :print_error "未安装npm，请先安装Node.js"
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo   - npm: %NPM_VERSION%

call :print_success "工具检查完成"
echo.

REM 步骤2：检查Cloudflare登录状态
call :print_step 2 "检查Cloudflare登录状态..."

npx wrangler whoami >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo   - 已登录Cloudflare
) else (
    call :print_warning "未登录Cloudflare，正在打开登录页面..."
    npx wrangler login
    call :print_success "登录成功"
)
echo.

REM 步骤3：检查并创建数据库
call :print_step 3 "检查数据库..."

set DB_NAME=lego-story-db
npx wrangler d1 list 2>nul | findstr /C:"%DB_NAME%" >nul
if %ERRORLEVEL% equ 0 (
    echo   - 数据库 %DB_NAME% 已存在
) else (
    call :print_warning "数据库不存在，正在创建..."
    npx wrangler d1 create %DB_NAME%
    call :print_success "数据库创建成功"
    echo.
    call :print_warning "请将数据库ID更新到wrangler.toml文件中"
    call :print_warning "数据库ID已显示在上方输出中"
    echo.
    pause
)
echo.

REM 步骤4：执行数据库迁移
call :print_step 4 "执行数据库迁移..."

if exist migrations (
    echo   - 正在执行本地迁移...
    npx wrangler d1 migrations apply %DB_NAME% --local
    echo   - 正在执行远程迁移...
    npx wrangler d1 migrations apply %DB_NAME%
    call :print_success "数据库迁移完成"
) else (
    call :print_warning "未找到migrations目录，跳过迁移"
)
echo.

REM 步骤5：检查环境变量
call :print_step 5 "检查环境变量配置..."

echo.
call :print_warning "请确保已在Cloudflare Dashboard中配置以下环境变量："
echo   - DOUBAO_API_KEY（豆包AI密钥）
echo   - SEEDREAM_API_KEY（图片生成密钥）
echo   - SILICONFLOW_API_KEY（语音识别密钥，可选）
echo.
echo 配置方法:
echo   1. 登录 https://dash.cloudflare.com
echo   2. 进入 Workers ^& Pages ^> 您的项目 ^> Settings ^> Environment variables
echo   3. 添加上述变量
echo.
echo 按任意键继续部署...
pause >nul
echo.

REM 步骤6：部署到Cloudflare Pages
call :print_step 6 "部署到Cloudflare Pages..."

echo   - 正在部署...
npx wrangler pages deploy . --project-name=lego-story-book

call :print_success "部署完成！"
echo.

REM 步骤7：显示部署信息
call :print_step 7 "部署信息"

echo.
echo ==========================================
echo   部署成功！
echo ==========================================
echo.
echo 访问地址:
echo   https://lego-story-book.pages.dev
echo.
echo 管理控制台:
echo   https://dash.cloudflare.com
echo.
echo 数据库管理:
echo   npx wrangler d1 execute lego-story-db --command="SELECT * FROM users"
echo.
call :print_success "一键部署完成！"
echo.
pause
