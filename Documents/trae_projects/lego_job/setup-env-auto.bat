@echo off
echo ========================================
echo Android SDK and JDK Environment Setup
echo ========================================
echo.

set ANDROID_SDK=C:\Users\yannis\AppData\Local\Android\Sdk
set JAVA_HOME_PATH=D:\Program Files\Android\Android Studio\jbr

echo Setting environment variables:
echo   ANDROID_HOME = %ANDROID_SDK%
echo   JAVA_HOME = %JAVA_HOME_PATH%
echo.

setx ANDROID_HOME "%ANDROID_SDK%" /M >nul 2>&1
setx ANDROID_SDK_ROOT "%ANDROID_SDK%" /M >nul 2>&1
setx JAVA_HOME "%JAVA_HOME_PATH%" /M >nul 2>&1

echo Environment variables set (may require admin rights for system-wide).
echo.

echo Current session environment:
set ANDROID_HOME=%ANDROID_SDK%
set ANDROID_SDK_ROOT=%ANDROID_SDK%
set JAVA_HOME=%JAVA_HOME_PATH%
set PATH=%JAVA_HOME_PATH%\bin;%ANDROID_SDK%\platform-tools;%ANDROID_SDK%\emulator;%ANDROID_SDK%\build-tools\36.1.0;%PATH%

echo Verifying Java...
"%JAVA_HOME%\bin\java.exe" -version

echo.
echo Verifying Android SDK...
"%ANDROID_SDK%\platform-tools\adb.exe" version

echo.
echo ========================================
echo Environment configured!
echo ========================================
