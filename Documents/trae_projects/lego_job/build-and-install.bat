@echo off
echo ========================================
echo LEGO Mobile Game - Build and Install APK
echo ========================================
echo.

set ANDROID_SDK=C:\Users\yannis\AppData\Local\Android\Sdk
set JAVA_HOME=D:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%ANDROID_SDK%\platform-tools;%ANDROID_SDK%\build-tools\36.1.0;%PATH%

echo [1/3] Checking emulator connection...
%ANDROID_SDK%\platform-tools\adb.exe devices
echo.

echo [2/3] Building debug APK...
cd /d C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile-game\android
call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [3/3] Installing APK on emulator...
    %ANDROID_SDK%\platform-tools\adb.exe install -r app\build\outputs\apk\debug\app-debug.apk
    
    echo.
    echo ========================================
    echo SUCCESS!
    echo ========================================
    echo.
    echo App installed. Launch with:
    echo     adb shell am start -n com.legostory.mobilegame/.MainActivity
    echo.
) else (
    echo.
    echo [3/3] Build FAILED
)

pause
