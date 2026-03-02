@echo off
setlocal enabledelayedexpansion
echo ========================================
echo LEGO Mobile Game - Full Android Build
echo ========================================
echo.

echo [Step 1/5] Setting up environment...
set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=C:\Users\yannis\AppData\Local\Android\Sdk
set JAVA_HOME=D:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%ANDROID_HOME%\build-tools\36.1.0;%PATH%
echo     ANDROID_HOME = %ANDROID_HOME%
echo     JAVA_HOME = %JAVA_HOME%

echo.
echo [Step 2/5] Checking Java...
"%JAVA_HOME%\bin\java.exe" -version 2>&1 | findstr "version"
if errorlevel 1 (
    echo     ERROR: Java not found!
    exit /b 1
)

echo.
echo [Step 3/5] Checking/Starting emulator...
set ADB=%ANDROID_HOME%\platform-tools\adb.exe
set EMULATOR=%ANDROID_HOME%\emulator\emulator.exe
set AVD_NAME=Pixel_8_API_36

%ADB% devices 2>nul | findstr "emulator" >nul
if errorlevel 1 (
    echo     Starting emulator: %AVD_NAME%
    start "Android Emulator" /MIN "%EMULATOR%" -avd %AVD_NAME% -no-snapshot-load
    
    echo     Waiting for emulator to boot...
    set /a count=0
    :wait_loop
    %ADB% get-state >nul 2>&1
    if errorlevel 1 (
        set /a count+=1
        if !count! geq 36 (
            echo     ERROR: Timeout waiting for emulator
            exit /b 1
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
            exit /b 1
        )
        echo     Booting... !count!/36
        timeout /t 5 /nobreak >nul
        goto check_boot
    )
    echo     Emulator ready!
) else (
    echo     Emulator already running!
)

echo.
echo [Step 4/5] Building APK...
cd /d C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile-game\android
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [Step 5/5] Installing APK on emulator...
    %ADB% install -r app\build\outputs\apk\debug\app-debug.apk
    if errorlevel 1 (
        echo     Installation may have failed. Try manually.
    ) else (
        echo     APK installed successfully!
    )
    echo.
    echo ========================================
    echo Build and Install Complete!
    echo ========================================
    echo.
    echo App: com.legostory.mobilegame
    echo APK: android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo.
    echo [Step 5/5] Build FAILED
)

echo.
pause
