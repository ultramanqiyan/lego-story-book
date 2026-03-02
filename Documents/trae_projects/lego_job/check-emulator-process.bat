@echo off
echo Checking emulator process...
tasklist /FI "IMAGENAME eq emulator.exe" 2>nul
echo.
echo Checking qemu processes...
tasklist /FI "IMAGENAME eq qemu-system-x86_64.exe" 2>nul
echo.
echo ADB devices:
C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe devices
