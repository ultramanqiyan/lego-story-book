@echo off
echo ========================================
echo   LEGO Demo - Run App
echo ========================================
echo.

set ADB=C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe

echo [1/3] Checking devices...
%ADB% devices

echo.
echo [2/3] Installing APK...
%ADB% install -r android\app\build\outputs\apk\debug\app-debug.apk

echo.
echo [3/3] Starting App...
%ADB% shell am start -n com.legostory.demo/.MainActivity

echo.
echo ========================================
echo   Done!
echo ========================================
