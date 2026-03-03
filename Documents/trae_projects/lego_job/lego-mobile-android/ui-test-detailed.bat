@echo off
chcp 65001 >nul
echo ========================================
echo Android Detailed UI Test Script
echo ========================================

set ADB="C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe"
set PASS=0
set FAIL=0

echo.
echo [Step 1] Launch APP...
%ADB% shell am start -n com.legostory.mobile/.MainActivity
timeout /t 5 /nobreak >nul

echo.
echo [Step 2] Check current activity...
%ADB% shell "dumpsys activity activities | grep -E 'mResumedActivity'" 
timeout /t 1 /nobreak >nul

echo.
echo [Step 3] Clear logcat and start fresh...
%ADB% logcat -c

echo.
echo [Step 4] Input username (click on username field first)...
%ADB% shell input tap 540 800
timeout /t 1 /nobreak >nul
%ADB% shell input text "testuser"
timeout /t 1 /nobreak >nul

echo.
echo [Step 5] Move to password field...
%ADB% shell input keyevent KEYCODE_TAB
timeout /t 1 /nobreak >nul
%ADB% shell input text "test123"
timeout /t 1 /nobreak >nul

echo.
echo [Step 6] Click login button...
%ADB% shell input tap 540 1200
timeout /t 5 /nobreak >nul

echo.
echo [Step 7] Check for navigation after login...
%ADB% shell "dumpsys activity activities | grep -E 'mResumedActivity'"

echo.
echo [Step 8] Check logcat for errors...
%ADB% logcat -d -t 100 | findstr -i "Exception\|Error\|FATAL" | findstr -v "OpenGL\|Gralloc"

echo.
echo [Step 9] Navigate to Characters tab (bottom nav)...
%ADB% shell input tap 810 2200
timeout /t 3 /nobreak >nul

echo.
echo [Step 10] Check for character loading...
%ADB% logcat -d -t 50 | findstr -i "Character\|character"

echo.
echo [Step 11] Click on create character button (+)...
%ADB% shell input tap 950 300
timeout /t 3 /nobreak >nul

echo.
echo [Step 12] Check if CharacterCreateScreen opened...
%ADB% shell "dumpsys activity activities | grep -E 'mResumedActivity'"

echo.
echo [Step 13] Input character name...
%ADB% shell input tap 540 600
timeout /t 1 /nobreak >nul
%ADB% shell input text "TestCharacter"
timeout /t 1 /nobreak >nul

echo.
echo [Step 14] Click create button...
%ADB% shell input tap 540 1500
timeout /t 3 /nobreak >nul

echo.
echo [Step 15] Check for errors...
%ADB% logcat -d -t 100 | findstr -i "Exception\|Error\|FATAL" | findstr -v "OpenGL\|Gralloc"

echo.
echo [Step 16] Go back to home...
%ADB% shell input keyevent KEYCODE_BACK
timeout /t 2 /nobreak >nul
%ADB% shell input keyevent KEYCODE_BACK
timeout /t 2 /nobreak >nul

echo.
echo [Step 17] Navigate to Bookshelf...
%ADB% shell input tap 270 2200
timeout /t 3 /nobreak >nul

echo.
echo [Step 18] Check for book loading...
%ADB% logcat -d -t 50 | findstr -i "Book\|book"

echo.
echo [Step 19] Final error check...
%ADB% logcat -d -t 200 | findstr -i "FATAL" | findstr -v "OpenGL"
if %ERRORLEVEL% neq 0 (
    echo [PASS] No fatal errors found
    set /a PASS+=1
) else (
    echo [FAIL] Fatal errors found
    set /a FAIL+=1
)

echo.
echo ========================================
echo Test Complete
echo ========================================
echo Passed: %PASS%
echo Failed: %FAIL%
