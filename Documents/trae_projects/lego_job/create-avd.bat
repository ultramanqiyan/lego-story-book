@echo off
echo ========================================
echo Create New x86_64 Android Emulator
echo ========================================
echo.

set ANDROID_SDK=C:\Users\yannis\AppData\Local\Android\Sdk
set JAVA_HOME=D:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%ANDROID_SDK%\cmdline-tools\latest\bin;%ANDROID_SDK%\platform-tools;%ANDROID_SDK%\emulator;%PATH%

echo Checking available system images...
echo.

dir "%ANDROID_SDK%\system-images" /s /b | findstr "source.properties"

echo.
echo Creating new AVD...
echo.

echo no | "%ANDROID_SDK%\cmdline-tools\latest\bin\avdmanager.bat" create avd -n Pixel_8_x86_64 -k "system-images;android-36.1;google_apis_playstore;x86_64" -d "pixel_8"

if errorlevel 1 (
    echo.
    echo Trying alternative method...
    echo.
    
    REM Create AVD directory
    if not exist "%USERPROFILE%\.android\avd\Pixel_8_x86_64.avd" mkdir "%USERPROFILE%\.android\avd\Pixel_8_x86_64.avd"
    
    REM Create config.ini
    (
        echo avd.ini.encoding=UTF-8
        echo AvdId=Pixel_8_x86_64
        echo PlayStore.enabled=true
        echo abi.type=x86_64
        echo avd.ini.displayname=Pixel 8 x86_64
        echo disk.dataPartition.size=800MB
        echo fastboot.forceColdBoot=no
        echo hw.accelerometer=yes
        echo hw.audioInput=yes
        echo hw.battery=yes
        echo hw.camera.back=virtualscene
        echo hw.camera.front=emulated
        echo hw.cpu.arch=x86_64
        echo hw.cpu.ncore=4
        echo hw.dPad=no
        echo hw.gps=yes
        echo hw.gpu.enabled=yes
        echo hw.gpu.mode=auto
        echo hw.initialOrientation=Portrait
        echo hw.keyboard=yes
        echo hw.lcd.density=420
        echo hw.lcd.height=2400
        echo hw.lcd.width=1080
        echo hw.mainKeys=no
        echo hw.ramSize=4096
        echo hw.sdCard=yes
        echo hw.sensors.orientation=yes
        echo hw.sensors.proximity=yes
        echo hw.trackBall=no
        echo image.sysdir.1=system-images\android-36.1\google_apis_playstore\x86_64\
        echo runtime.network.latency=none
        echo runtime.network.speed=full
        echo sdcard.size=800M
        echo showDeviceFrame=yes
        echo skin.dynamic=yes
        echo skin.name=pixel_8
        echo skin.path=skins\pixel_8
        echo tag.display=Google Play
        echo tag.id=google_apis_playstore
        echo vm.heapSize=512
    ) > "%USERPROFILE%\.android\avd\Pixel_8_x86_64.avd\config.ini"
    
    REM Create AVD ini file
    (
        echo avd.ini.encoding=UTF-8
        echo path=%USERPROFILE%\.android\avd\Pixel_8_x86_64.avd
        echo path.rel=avd\Pixel_8_x86_64.avd
        echo target=android-36.1
    ) > "%USERPROFILE%\.android\avd\Pixel_8_x86_64.ini"
    
    echo AVD created manually.
)

echo.
echo Listing AVDs...
"%ANDROID_SDK%\emulator\emulator.exe" -list-avds

echo.
pause
