@echo off
echo ========================================================
echo   Starting Appium Server and Running UI Style Tests
echo ========================================================

echo.
echo [Step 1] Starting Appium Server...
start "Appium Server" cmd /c "npx appium --base-path /"
timeout /t 8 /nobreak > nul

echo [Step 2] Running UI Style Tests...
echo ========================================================
echo.

node appium-ui-style-test.js

echo.
echo ========================================================
echo   Test Complete!
echo ========================================================

taskkill /FI "WINDOWTITLE eq Appium Server*" /F > nul 2>&1
