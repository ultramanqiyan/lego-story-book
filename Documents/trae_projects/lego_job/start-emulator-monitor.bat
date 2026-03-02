@echo off
setlocal enabledelayedexpansion
echo ========================================
echo Android Emulator - Detailed Launch Monitor
echo ========================================
echo.

set ANDROID_SDK=C:\Users\yannis\AppData\Local\Android\Sdk
set JAVA_HOME=D:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%ANDROID_SDK%\platform-tools;%ANDROID_SDK%\emulator;%PATH%
set ADB=%ANDROID_SDK%\platform-tools\adb.exe
set EMULATOR=%ANDROID_SDK%\emulator\emulator.exe
set AVD_NAME=Pixel_8_API_36

echo [Step 1] Checking prerequisites...
echo.

echo Checking Java...
"%JAVA_HOME%\bin\java.exe" -version 2>&1
if errorlevel 1 (
    echo ERROR: Java check failed!
    pause
    exit /b 1
)
echo Java OK.
echo.

echo Checking emulator executable...
if not exist "%EMULATOR%" (
    echo ERROR: Emulator not found at: %EMULATOR%
    pause
    exit /b 1
)
echo Emulator executable found.
echo.

echo Checking AVD...
"%EMULATOR%" -list-avds
if errorlevel 1 (
    echo ERROR: Cannot list AVDs
    pause
    exit /b 1
)
echo.

echo [Step 2] Checking for running emulator...
%ADB% devices
echo.

%ADB% get-state >nul 2>&1
if not errorlevel 1 (
    echo Emulator already connected!
    %ADB% devices -l
    echo.
    echo ========================================
    echo Emulator is running!
    echo ========================================
    pause
    exit /b 0
)

echo [Step 3] Starting emulator...
echo     AVD: %AVD_NAME%
echo     Time: %time%
echo.

start "Android Emulator" "%EMULATOR%" -avd %AVD_NAME% -verbose -no-snapshot-load

echo Emulator process started. Waiting for connection...
echo.

set /a count=0
set /a max_wait=60

:wait_loop
set /a count+=1
echo [%time%] Attempt !count!/%max_wait%: Checking ADB connection...

%ADB% get-state >nul 2>&1
if errorlevel 1 (
    echo     ADB not connected yet...
    
    REM Check if emulator process is still running
    tasklist /FI "IMAGENAME eq emulator.exe" 2>nul | findstr "emulator.exe" >nul
    if errorlevel 1 (
        echo.
        echo WARNING: Emulator process may have crashed!
        echo Check if emulator window appeared.
    ) else (
        echo     Emulator process is running.
    )
    
    if !count! geq %max_wait% (
        echo.
        echo ========================================
        echo ERROR: Timeout after %max_wait% attempts
        echo ========================================
        echo.
        echo Troubleshooting:
        echo 1. Check if Android Studio emulator works
        echo 2. Try: emulator -avd %AVD_NAME% -verbose
        echo 3. Check for HAXM/VM acceleration issues
        echo.
        pause
        exit /b 1
    )
    
    timeout /t 5 /nobreak >nul
    goto wait_loop
)

echo.
echo ADB connected! Checking boot status...
echo.

:check_boot
%ADB% shell getprop sys.boot_completed 2>nul
if errorlevel 1 (
    set /a count+=1
    if !count! geq %max_wait% (
        echo ERROR: Boot timeout
        pause
        exit /b 1
    )
    echo [%time%] Boot in progress... !count!/%max_wait%
    timeout /t 5 /nobreak >nul
    goto check_boot
)

echo.
echo [Step 4] Emulator fully booted!
echo.
%ADB% devices -l
echo.
echo ========================================
echo SUCCESS: Emulator is ready!
echo Time: %time%
echo ========================================
echo.
pause
