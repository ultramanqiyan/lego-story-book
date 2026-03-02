@echo off
echo Fixing AVD skin configuration...

set AVD_DIR=%USERPROFILE%\.android\avd\Pixel_8_x86_64.avd

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
echo skin.name=1080x2400
echo skin.path=skins\1080x2400
echo tag.display=Google Play
echo tag.id=google_apis_playstore
echo vm.heapSize=576
) > "%AVD_DIR%\config.ini"

echo AVD config fixed.
echo.
echo Starting emulator...
start "" "C:\Users\yannis\AppData\Local\Android\Sdk\emulator\emulator.exe" -avd Pixel_8_x86_64 -no-snapshot-load -no-skin
echo Emulator starting without skin...
