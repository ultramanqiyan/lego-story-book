@echo off
set ADB=C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe
echo Waiting for emulator to boot...
:loop
%ADB% wait-for-device
%ADB% shell getprop sys.boot_completed | findstr 1 >nul
if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto loop
)
echo Emulator is ready!
%ADB% devices
