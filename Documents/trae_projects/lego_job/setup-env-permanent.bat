@echo off
echo ========================================
echo Android SDK and JDK Permanent Setup
echo ========================================
echo.

set ANDROID_SDK=C:\Users\yannis\AppData\Local\Android\Sdk
set JAVA_HOME_PATH=D:\Program Files\Android\Android Studio\jbr

echo This script will set permanent system environment variables:
echo.
echo   ANDROID_HOME = %ANDROID_SDK%
echo   ANDROID_SDK_ROOT = %ANDROID_SDK%
echo   JAVA_HOME = %JAVA_HOME_PATH%
echo.
echo And add to PATH:
echo   - %JAVA_HOME_PATH%\bin
echo   - %ANDROID_SDK%\platform-tools
echo   - %ANDROID_SDK%\emulator
echo   - %ANDROID_SDK%\build-tools\36.1.0
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo [1/4] Setting ANDROID_HOME...
setx ANDROID_HOME "%ANDROID_SDK%" /M
if errorlevel 1 (
    echo     Warning: Could not set ANDROID_HOME (may need admin rights)
) else (
    echo     ANDROID_HOME set successfully
)

echo.
echo [2/4] Setting ANDROID_SDK_ROOT...
setx ANDROID_SDK_ROOT "%ANDROID_SDK%" /M
if errorlevel 1 (
    echo     Warning: Could not set ANDROID_SDK_ROOT (may need admin rights)
) else (
    echo     ANDROID_SDK_ROOT set successfully
)

echo.
echo [3/4] Setting JAVA_HOME...
setx JAVA_HOME "%JAVA_HOME_PATH%" /M
if errorlevel 1 (
    echo     Warning: Could not set JAVA_HOME (may need admin rights)
) else (
    echo     JAVA_HOME set successfully
)

echo.
echo [4/4] Updating PATH...
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "CURRENT_PATH=%%b"
set "NEW_PATH=%JAVA_HOME_PATH%\bin;%ANDROID_SDK%\platform-tools;%ANDROID_SDK%\emulator;%ANDROID_SDK%\build-tools\36.1.0;%CURRENT_PATH%"
setx Path "%NEW_PATH%" /M
if errorlevel 1 (
    echo     Warning: Could not update PATH (may need admin rights)
) else (
    echo     PATH updated successfully
)

echo.
echo ========================================
echo Environment variables configured!
echo ========================================
echo.
echo Please restart your terminal/IDE for changes to take effect.
echo.
pause
