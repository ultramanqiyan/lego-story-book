@echo off
echo ========================================
echo   LEGO Story 服务启动脚本
echo ========================================
echo.

echo [1/2] 启动后端API服务 (端口8788)...
start "Backend API" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 8 /nobreak > nul

echo [2/2] 启动前端Web服务 (端口8082)...
start "Frontend Web" cmd /k "cd /d %~dp0lego-mobile && npx expo start --web --port 8082"
timeout /t 15 /nobreak > nul

echo.
echo ========================================
echo   服务启动完成！
echo ========================================
echo.
echo   后端API: http://localhost:8788
echo   前端Web: http://localhost:8082
echo.
echo   请等待前端服务完全启动后再访问
echo ========================================
pause
