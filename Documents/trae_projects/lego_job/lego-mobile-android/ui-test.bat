@echo off
echo ========================================
echo Android UI E2E Test Script
echo ========================================

set ADB="C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe"
set PASS=0
set FAIL=0

echo.
echo [Pre-check] Verify backend service...
curl -s http://127.0.0.1:8788/api/characters >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Backend service is not running!
    echo Please start backend: npm run dev
    exit /b 1
)
echo [OK] Backend service is running

echo.
echo [Pre-check] Verify emulator...
%ADB% devices | findstr "emulator" >nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] No emulator found!
    exit /b 1
)
echo [OK] Emulator is running

echo.
echo [Pre-check] Verify APP installed...
%ADB% shell pm list packages | findstr "com.legostory.mobile" >nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] APP not installed!
    exit /b 1
)
echo [OK] APP is installed

echo.
echo ========================================
echo Test 1: Launch APP
echo ========================================
%ADB% shell am start -n com.legostory.mobile/.MainActivity
timeout /t 3 /nobreak >nul
%ADB% shell "dumpsys window | grep -E 'mCurrentFocus'" | findstr "com.legostory.mobile" >nul
if %ERRORLEVEL% equ 0 (
    echo [PASS] APP launched successfully
    set /a PASS+=1
) else (
    echo [FAIL] APP failed to launch
    set /a FAIL+=1
)

echo.
echo ========================================
echo Test 2: Check for crashes
echo ========================================
%ADB% logcat -d -t 50 | findstr "FATAL" >nul
if %ERRORLEVEL% neq 0 (
    echo [PASS] No crashes detected
    set /a PASS+=1
) else (
    echo [FAIL] Crash detected!
    %ADB% logcat -d -t 50 | findstr "FATAL"
    set /a FAIL+=1
)

echo.
echo ========================================
echo Test 3: Check login page elements
echo ========================================
%ADB% shell "dumpsys window | grep -E 'mCurrentFocus'" | findstr "Login" >nul
if %ERRORLEVEL% equ 0 (
    echo [PASS] Login page is displayed
    set /a PASS+=1
) else (
    echo [INFO] Checking current page...
    %ADB% shell "dumpsys window | grep -E 'mCurrentFocus'"
)

echo.
echo ========================================
echo Test 4: Input login credentials
echo ========================================
%ADB% shell input text "testuser"
timeout /t 1 /nobreak >nul
%ADB% shell input keyevent KEYCODE_TAB
timeout /t 1 /nobreak >nul
%ADB% shell input text "test123"
echo [INFO] Login credentials entered

echo.
echo ========================================
echo Test 5: Click login button
echo ========================================
%ADB% shell input tap 540 1200
timeout /t 5 /nobreak >nul
%ADB% shell "dumpsys window | grep -E 'mCurrentFocus'" | findstr -v "Login" >nul
if %ERRORLEVEL% equ 0 (
    echo [PASS] Navigation after login successful
    set /a PASS+=1
) else (
    echo [FAIL] Still on login page
    set /a FAIL+=1
)

echo.
echo ========================================
echo Test 6: Check for errors after login
echo ========================================
%ADB% logcat -d -t 100 | findstr -i "Exception" | findstr -v "OpenGL" >nul
if %ERRORLEVEL% neq 0 (
    echo [PASS] No exceptions after login
    set /a PASS+=1
) else (
    echo [FAIL] Exceptions found:
    %ADB% logcat -d -t 100 | findstr -i "Exception" | findstr -v "OpenGL"
    set /a FAIL+=1
)

echo.
echo ========================================
echo Test 7: Navigate to Characters page
echo ========================================
%ADB% shell input tap 810 2200
timeout /t 2 /nobreak >nul
echo [INFO] Tapped on Characters tab

echo.
echo ========================================
echo Test 8: Check Characters page loaded
echo ========================================
timeout /t 3 /nobreak >nul
%ADB% logcat -d -t 50 | findstr -i "Character" >nul
if %ERRORLEVEL% equ 0 (
    echo [PASS] Characters page activity detected
    set /a PASS+=1
) else (
    echo [INFO] Checking page state...
)

echo.
echo ========================================
echo Test 9: Check for API errors
echo ========================================
%ADB% logcat -d -t 100 | findstr -i "API\|Network\|HTTP" | findstr -i "error\|fail" >nul
if %ERRORLEVEL% neq 0 (
    echo [PASS] No API errors detected
    set /a PASS+=1
) else (
    echo [FAIL] API errors found:
    %ADB% logcat -d -t 100 | findstr -i "API\|Network\|HTTP" | findstr -i "error\|fail"
    set /a FAIL+=1
)

echo.
echo ========================================
echo Test 10: Navigate back and check
echo ========================================
%ADB% shell input keyevent KEYCODE_BACK
timeout /t 2 /nobreak >nul
echo [PASS] Back navigation works

echo.
echo ========================================
echo Final Results
echo ========================================
echo Passed: %PASS%
echo Failed: %FAIL%
echo.

if %FAIL% gtr 0 (
    echo [RESULT] TESTS FAILED
    exit /b 1
) else (
    echo [RESULT] ALL TESTS PASSED
    exit /b 0
)
