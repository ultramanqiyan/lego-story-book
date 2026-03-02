@echo off
setlocal enabledelayedexpansion
echo ========================================
echo Android Emulator Launcher
echo ========================================
echo.

set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\yannis\AppData\Local\Android\Sdk
set EMULATOR=%ANDROID_HOME%\emulator\emulator.exe
set ADB=%ANDROID_HOME%\platform-tools\adb.exe
set AVD_NAME=Pixel_8_API_36

echo [1/4] Checking for existing emulator...
%ADB% devices | findstr "emulator" >nul
if not errorlevel 1 (
    echo     Emulator already running!
    goto :show_devices
)

echo.
echo [2/4] Starting emulator: %AVD_NAME%
echo     Please wait for the emulator window to appear...
start "Android Emulator" /MIN "%EMULATOR%" -avd %AVD_NAME% -no-snapshot-load

echo.
echo [3/4] Waiting for emulator to boot (max 3 minutes)...
set /a count=0
:wait_loop
%ADB% get-state >nul 2>&1
if errorlevel 1 (
    set /a count+=1
    if !count! geq 36 (
        echo     ERROR: Timeout waiting for emulator
        goto :end
    )
    echo     Waiting... !count!/36
    timeout /t 5 /nobreak >nul
    goto wait_loop
)

:check_boot
%ADB% shell getprop sys.boot_completed 2>nul | findstr 1 >nul
if errorlevel 1 (
    set /a count+=1
    if !count! geq 36 (
        echo     ERROR: Timeout waiting for boot
        goto :end
    )
    echo     Booting... !count!/36
    timeout /t 5 /nobreak >nul
    goto check_boot
)

echo     Emulator booted successfully!

:show_devices
echo.
echo [4/4] Connected devices:
%ADB% devices -l

:end
echo.
echo ========================================
echo Done. You can now run the app.
echo ========================================
