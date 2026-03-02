@echo off
echo ========================================
echo LEGO Mobile Game - Run on Android
echo ========================================
echo.

echo [1/3] Setting up environment...
set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\yannis\AppData\Local\Android\Sdk
echo     ANDROID_HOME=%ANDROID_HOME%

echo.
echo [2/3] Checking emulator connection...
C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe devices

echo.
echo [3/3] Starting Expo Android...
echo     This will build and install the app on the emulator.
echo.

cd /d C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile-game
npx expo run:android

echo.
echo ========================================
echo Process completed.
echo ========================================
pause
