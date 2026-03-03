@echo off
echo ========================================
echo   LEGO Story Android - Run App
echo ========================================
echo.

set JAVA_HOME=D:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\SDK
set ANDROID_SDK_ROOT=%ANDROID_HOME%
set ADB=%ANDROID_HOME%\platform-tools\adb.exe
set EMULATOR=%ANDROID_HOME%\emulator\emulator.exe
set AVD_NAME=Pixel_6_WANG

echo [1/4] Checking emulator...
%ADB% devices
for /f "tokens=1" %%i in ('%ADB% devices ^| findstr "emulator"') do set EMULATOR_RUNNING=%%i
if defined EMULATOR_RUNNING (
    echo Emulator is already running
    goto :build
)

echo Starting emulator %AVD_NAME%...
start "Android Emulator" %EMULATOR% -avd %AVD_NAME%
echo Waiting for emulator to boot (30 seconds)...
timeout /t 30 /nobreak >nul

:build
echo.
echo [2/4] Building APK...
cd /d %~dp0
call gradlew.bat assembleDebug --no-daemon
if errorlevel 1 (
    echo ERROR: Build failed!
    exit /b 1
)

echo.
echo [3/4] Installing APK...
%ADB% install -r app\build\outputs\apk\debug\app-debug.apk

echo.
echo [4/4] Starting App...
%ADB% shell am start -n com.legostory.mobile/.MainActivity

echo.
echo ========================================
echo   Done! App is running on emulator.
echo ========================================
