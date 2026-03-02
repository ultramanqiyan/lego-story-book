@echo off
echo ========================================
echo Android SDK and JDK Environment Setup
echo ========================================
echo.

set ANDROID_SDK=C:\Users\yannis\AppData\Local\Android\Sdk
set JAVA_HOME=D:\Program Files\Android\Android Studio\jbr

echo [1/4] Setting environment variables...
echo     ANDROID_HOME = %ANDROID_SDK%
echo     ANDROID_SDK_ROOT = %ANDROID_SDK%
echo     JAVA_HOME = %JAVA_HOME%

set ANDROID_HOME=%ANDROID_SDK%
set ANDROID_SDK_ROOT=%ANDROID_SDK%

echo.
echo [2/4] Adding to PATH...
set PATH=%JAVA_HOME%\bin;%ANDROID_SDK%\platform-tools;%ANDROID_SDK%\emulator;%ANDROID_SDK%\build-tools\36.1.0;%PATH%

echo.
echo [3/4] Verifying Java...
"%JAVA_HOME%\bin\java.exe" -version
if errorlevel 1 (
    echo     ERROR: Java not found!
    pause
    exit /b 1
)

echo.
echo [4/4] Verifying Android SDK...
if not exist "%ANDROID_SDK%\platform-tools\adb.exe" (
    echo     ERROR: adb.exe not found!
    pause
    exit /b 1
)
echo     Android SDK found at: %ANDROID_SDK%

echo.
echo ========================================
echo Environment configured successfully!
echo ========================================
echo.
echo You can now run Android builds.
echo.
