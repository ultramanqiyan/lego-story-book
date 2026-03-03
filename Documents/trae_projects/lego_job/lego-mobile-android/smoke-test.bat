@echo off
echo ========================================
echo Android App Smoke Test
echo ========================================

echo.
echo [1/5] Building APK...
call gradlew.bat assembleDebug
if %ERRORLEVEL% neq 0 (
    echo BUILD FAILED!
    exit /b 1
)
echo BUILD SUCCESS!

echo.
echo [2/5] Checking for crashes in code...
findstr /s /i "GlobalScope.launch" app\src\main\java\*.kt > nul
if %ERRORLEVEL% equ 0 (
    echo WARNING: Found GlobalScope.launch - this may cause crashes!
    findstr /s /i "GlobalScope.launch" app\src\main\java\*.kt
)

echo.
echo [3/5] Installing APK...
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe install -r app\build\outputs\apk\debug\app-debug.apk
if %ERRORLEVEL% neq 0 (
    echo INSTALL FAILED!
    exit /b 1
)
echo INSTALL SUCCESS!

echo.
echo [4/5] Launching App...
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe shell am start -n com.legostory.mobile/.MainActivity

echo.
echo [5/5] Monitoring for crashes (10 seconds)...
timeout /t 10 /nobreak > nul
%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe logcat -d -t 100 | findstr /i "FATAL Exception Error" | findstr /v "OpenGL"

echo.
echo ========================================
echo Smoke Test Complete!
echo ========================================
