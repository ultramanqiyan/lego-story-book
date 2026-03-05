@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   LEGO Demo - APK Build
echo ========================================
echo.

set "JAVA_HOME=D:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Users\yannis\AppData\Local\Android\Sdk"
set "ANDROID_SDK_ROOT=%ANDROID_HOME%"

echo Checking prerequisites...
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%
echo.

call :ShowProgress 5 "Initializing build process..."

call :ShowProgress 10 "Step 1/3: Creating assets directory..."
if not exist "android\app\src\main\assets" mkdir "android\app\src\main\assets"

call :ShowProgress 20 "Step 2/3: Generating JS bundle..."
echo.
call npx react-native bundle --platform android --dev false --entry-file index.tsx --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
if errorlevel 1 (
    echo.
    echo [ERROR] Failed to generate JS bundle!
    exit /b 1
)

call :ShowProgress 50 "Step 3/3: Starting Gradle build (this may take several minutes)..."
echo.
cd android
call gradlew.bat assembleDebug --no-daemon
if errorlevel 1 (
    echo.
    echo [ERROR] Gradle build failed!
    cd ..
    exit /b 1
)
cd ..

call :ShowProgress 100 "Build completed!"
echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo   APK: android\app\build\outputs\apk\debug\app-debug.apk
echo ========================================
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
echo [%bar%] %percent%%%
echo %message%
echo.
goto :eof
