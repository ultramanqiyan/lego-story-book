@echo off
echo ========================================
echo LEGO Mobile Game - Full Android Setup
echo ========================================
echo.

set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\yannis\AppData\Local\Android\Sdk
set ADB=%ANDROID_HOME%\platform-tools\adb.exe
set EMULATOR=%ANDROID_HOME%\emulator\emulator.exe
set AVD_NAME=Pixel_8_API_36

echo [Step 1/5] Checking for connected devices...
%ADB% devices
echo.

echo [Step 2/5] Checking if emulator is running...
%ADB% get-state >nul 2>&1
if errorlevel 1 (
    echo     No device connected. Starting emulator...
    start "" "%EMULATOR%" -avd %AVD_NAME%
    echo     Waiting for emulator to boot...
    :wait_loop
    %ADB% wait-for-device >nul 2>&1
    %ADB% shell getprop sys.boot_completed 2>nul | findstr 1 >nul
    if errorlevel 1 (
        echo     Still booting...
        timeout /t 5 /nobreak >nul
        goto wait_loop
    )
    echo     Emulator is ready!
) else (
    echo     Device already connected.
)

echo.
echo [Step 3/5] Listing connected devices:
%ADB% devices -l

echo.
echo [Step 4/5] Installing Expo and building app...
cd /d C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile-game

echo     Running: npx expo run:android
echo     This will build and install the app...
echo.

npx expo run:android

echo.
echo [Step 5/5] Process completed!
echo.
pause
