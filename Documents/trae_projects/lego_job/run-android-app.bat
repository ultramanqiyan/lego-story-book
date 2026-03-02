@echo off
echo ========================================
echo   LEGO Mobile Game - Expo Build
echo ========================================
echo.

set JAVA_HOME=D:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

echo Checking prerequisites...
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%
echo.

cd /d "%~dp0lego-mobile-game"

echo Starting Expo development build...
echo This will build and install the app on the emulator.
echo.

npx expo run:android --no-install --no-build-cache

echo.
echo ========================================
echo   Build process completed
echo ========================================
pause
