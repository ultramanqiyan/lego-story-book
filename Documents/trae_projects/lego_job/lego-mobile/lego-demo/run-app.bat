@echo off
setlocal enabledelayedexpansion

echo.
echo  ========================================================
echo    LEGO Demo - One-Click Build and Run
echo  ========================================================
echo.

set "JAVA_HOME=D:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk"
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"
set "ADB=%ANDROID_HOME%\platform-tools\adb.exe"
set "APK_PATH=android\app\build\outputs\apk\debug\app-debug.apk"

call :ShowProgress 0 "Initializing..."

echo  [INFO] JAVA_HOME: %JAVA_HOME%
echo  [INFO] ANDROID_HOME: %ANDROID_HOME%
echo.

call :ShowProgress 5 "Step 1/5: Checking connected devices..."
echo.
%ADB% devices
echo.

call :ShowProgress 10 "Step 2/5: Creating assets directory..."
if not exist "android\app\src\main\assets" mkdir "android\app\src\main\assets"

call :ShowProgress 15 "Step 3/5: Generating JS bundle..."
echo.
call npx react-native bundle --platform android --dev false --entry-file index.tsx --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
if errorlevel 1 (
    echo.
    echo  [ERROR] Failed to generate JS bundle!
    pause
    exit /b 1
)

call :ShowProgress 50 "Step 4/5: Building APK with Gradle..."
echo.
cd android
call gradlew.bat assembleDebug --no-daemon
if errorlevel 1 (
    echo.
    echo  [ERROR] Gradle build failed!
    cd ..
    pause
    exit /b 1
)
cd ..

call :ShowProgress 85 "Step 5/5: Installing and launching app..."
echo.
echo  [INFO] Installing APK to device...
%ADB% install -r %APK_PATH%
if errorlevel 1 (
    echo  [WARN] Installation failed. Trying to uninstall first...
    %ADB% uninstall com.legostory.demo
    %ADB% install -r %APK_PATH%
)

echo.
echo  [INFO] Starting app...
%ADB% shell am start -n com.legostory.demo/.MainActivity

call :ShowProgress 100 "All done!"
echo.
echo  ========================================================
echo    BUILD AND RUN SUCCESSFUL!
echo    APK: %APK_PATH%
echo  ========================================================
echo.
pause
exit /b 0

:ShowProgress
set "percent=%~1"
set "message=%~2"
set "bar="
set "filled="
set "empty="

set /a "filled=percent/5"
set /a "empty=20-filled"

for /l %%i in (1,1,%filled%) do set "bar=!bar!█"
for /l %%i in (1,1,%empty%) do set "bar=!bar!░"

echo.
echo  [%bar%] %percent%%%
echo  %message%
echo.
goto :eof
