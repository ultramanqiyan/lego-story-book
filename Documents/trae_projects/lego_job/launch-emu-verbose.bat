@echo off
echo ========================================
echo Android Emulator - Direct Launch with Verbose Output
echo ========================================
echo.

set ANDROID_SDK=C:\Users\yannis\AppData\Local\Android\Sdk
set JAVA_HOME=D:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%ANDROID_SDK%\platform-tools;%ANDROID_SDK%\emulator;%PATH%

echo Checking AVD...
"%ANDROID_SDK%\emulator\emulator.exe" -list-avds
echo.

echo Starting emulator with verbose output...
echo This will show any errors.
echo.
"%ANDROID_SDK%\emulator\emulator.exe" -avd Pixel_8_API_36 -verbose -no-snapshot-load
