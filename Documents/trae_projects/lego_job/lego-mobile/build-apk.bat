@echo off
echo ========================================
echo   LEGO Mobile - APK Build
echo ========================================
echo.

set JAVA_HOME=D:\Program Files\Java\jdk-17
set PATH=%JAVA_HOME%\bin;%PATH%
set ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

echo Checking prerequisites...
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%
echo.

echo Step 1: Creating assets directory...
if not exist "android\app\src\main\assets" mkdir "android\app\src\main\assets"

echo Step 2: Generating JS bundle...
call npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
if errorlevel 1 (
    echo ERROR: Failed to generate JS bundle!
    exit /b 1
)

echo Step 3: Starting Gradle build...
cd android
call gradlew.bat assembleDebug --no-daemon
if errorlevel 1 (
    echo ERROR: Gradle build failed!
    cd ..
    exit /b 1
)
cd ..

echo.
echo ========================================
echo   Build completed successfully!
echo   APK location: android\app\build\outputs\apk\debug\app-debug.apk
echo ========================================
