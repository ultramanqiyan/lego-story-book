@echo off
echo ========================================
echo LEGO Mobile Game - Android APK Build
echo ========================================
echo.

call C:\Users\yannis\Documents\trae_projects\lego_job\setup-env.bat

echo.
echo [1/4] Navigating to Android project...
cd /d C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile-game\android

echo.
echo [2/4] Checking Gradle wrapper...
if not exist gradlew.bat (
    echo     ERROR: gradlew.bat not found!
    pause
    exit /b 1
)
echo     Gradle wrapper found.

echo.
echo [3/4] Building debug APK (this may take several minutes)...
echo     Running: gradlew.bat assembleDebug
echo.

call gradlew.bat assembleDebug --info

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [4/4] Build SUCCESS!
    echo.
    echo APK location:
    echo     android\app\build\outputs\apk\debug\app-debug.apk
) else (
    echo.
    echo [4/4] Build FAILED with error code: %ERRORLEVEL%
)

echo.
echo ========================================
echo Build process completed.
echo ========================================
pause
