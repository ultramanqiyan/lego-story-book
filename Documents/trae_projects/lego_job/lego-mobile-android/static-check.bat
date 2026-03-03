@echo off
echo ========================================
echo Android Code Static Analysis
echo ========================================

set ERROR_COUNT=0

echo.
echo [1/6] Checking for GlobalScope.launch (CRITICAL)...
findstr /s /n /i "GlobalScope.launch" app\src\main\java\*.kt 2>nul
if %ERRORLEVEL% equ 0 (
    echo [ERROR] Found GlobalScope.launch - This causes crashes! Use rememberCoroutineScope instead.
    set /a ERROR_COUNT+=1
) else (
    echo [OK] No GlobalScope.launch found
)

echo.
echo [2/6] Checking for GlobalScope import...
findstr /s /n /i "import kotlinx.coroutines.GlobalScope" app\src\main\java\*.kt 2>nul
if %ERRORLEVEL% equ 0 (
    echo [WARNING] Found GlobalScope import - Should be removed if not used.
)

echo.
echo [3/6] Checking for koinViewModel (may indicate missing manual DI)...
findstr /s /n /i "koinViewModel" app\src\main\java\*.kt 2>nul
if %ERRORLEVEL% equ 0 (
    echo [WARNING] Found koinViewModel - This project uses manual DI, check if correct.
)

echo.
echo [4/6] Checking for missing LaunchedEffect in Screen files...
echo Checking CharactersScreen...
findstr /c:"LaunchedEffect" app\src\main\java\com\legostory\mobile\ui\screens\characters\CharactersScreen.kt >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [WARNING] CharactersScreen may be missing LaunchedEffect for data loading
)

echo.
echo [5/6] Checking for proper coroutine scope usage...
findstr /s /n "rememberCoroutineScope" app\src\main\java\*.kt 2>nul | find /c "rememberCoroutineScope" > temp_count.txt
set /p COROUTINE_COUNT=<temp_count.txt
del temp_count.txt
echo Found %COROUTINE_COUNT% files using rememberCoroutineScope

echo.
echo [6/6] Checking for common crash patterns...
findstr /s /n /i "NullPointerException\|IllegalStateException" app\src\main\java\*.kt 2>nul
if %ERRORLEVEL% equ 0 (
    echo [INFO] Found potential exception handling code
) else (
    echo [OK] No explicit exception handling found
)

echo.
echo ========================================
if %ERROR_COUNT% gtr 0 (
    echo Static Analysis FAILED with %ERROR_COUNT% error(s)
    exit /b 1
) else (
    echo Static Analysis PASSED
)
echo ========================================
