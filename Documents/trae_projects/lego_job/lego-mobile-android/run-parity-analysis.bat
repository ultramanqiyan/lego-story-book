@echo off
REM RN-Android Parity Analyzer Runner Script
REM Usage: run-parity-analysis.bat [options]

cd /d "%~dp0"

echo.
echo ========================================
echo RN-Android Parity Analysis Tool
echo ========================================
echo.

REM Default paths
set RN_PATH=..\lego-mobile
set ANDROID_PATH=.
set OUTPUT_DIR=parity-reports

REM Parse arguments
set ARGS=
:parse_args
if "%~1"=="" goto end_parse
set ARGS=%ARGS% %~1
shift
goto parse_args
:end_parse

REM Run the analysis
echo Running parity analysis...
echo RN Path: %RN_PATH%
echo Android Path: %ANDROID_PATH%
echo Output: %OUTPUT_DIR%
echo.

REM Run using Gradle
call gradlew.bat test --tests "com.lego.android.parity.ParityAnalyzer" %ARGS%

echo.
echo Analysis complete. Check the %OUTPUT_DIR% directory for reports.
pause
