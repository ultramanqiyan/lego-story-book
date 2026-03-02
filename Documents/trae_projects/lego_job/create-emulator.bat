@echo off

REM 设置环境变量
set JAVA_HOME=D:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

REM 进入SDK工具目录
cd /d "%ANDROID_HOME%\cmdline-tools\latest\bin"

echo 正在创建新的Android模拟器 (Android 34)...
echo =========================================

REM 创建模拟器
avdmanager.bat create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;x86_64" -d pixel_6 -f

echo =========================================
echo 模拟器创建完成！

echo 正在启动模拟器...
echo =========================================

REM 启动模拟器
cd /d "%ANDROID_HOME%\emulator"
emulator.exe -avd Pixel_6_API_34 -no-snapshot-load

pause