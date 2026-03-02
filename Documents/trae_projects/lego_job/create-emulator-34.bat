@echo off

REM Set environment variables
set JAVA_HOME=D:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk

REM Create AVD
"%ANDROID_HOME%\cmdline-tools\latest\bin\avdmanager.bat" create avd -n Pixel_6_API_34 -k "system-images;android-34;google_apis;x86_64" -d pixel_6 -f

REM Start emulator
"%ANDROID_HOME%\emulator\emulator.exe" -avd Pixel_6_API_34 -no-snapshot-load

pause