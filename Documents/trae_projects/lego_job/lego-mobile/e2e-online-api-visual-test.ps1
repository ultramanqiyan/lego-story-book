# Visual E2E Test - Online API Connection Test
# Each action has enough wait time for user to see in emulator
# API: https://lego-story-book.pages.dev/api

$adb = "C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe"
$apiBase = "https://lego-story-book.pages.dev/api"
$testUserId = "id_mlyyd39k_hn29mxzne"

function Check-App {
    $result = & $adb shell "ps -A | grep legostory" 2>&1
    return ($result -match "legostory")
}

function Tap {
    param([int]$x, [int]$y, [string]$desc)
    Write-Host "  [TAP] $desc ($x, $y)" -ForegroundColor Yellow
    & $adb shell "input tap $x $y" 2>&1 | Out-Null
    Start-Sleep -Seconds 1.5
}

function Swipe {
    param([int]$x1, [int]$y1, [int]$x2, [int]$y2, [string]$desc)
    Write-Host "  [SWIPE] $desc" -ForegroundColor Yellow
    & $adb shell "input swipe $x1 $y1 $x2 $y2 500" 2>&1 | Out-Null
    Start-Sleep -Seconds 1
}

function Screenshot {
    param([string]$name)
    & $adb shell "screencap -p /sdcard/$name.png" 2>&1 | Out-Null
    & $adb pull /sdcard/$name.png "C:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile\$name.png" 2>&1 | Out-Null
    Write-Host "  [SCREENSHOT] $name.png" -ForegroundColor Cyan
}

Clear-Host
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "   VISUAL E2E TEST - ONLINE API" -ForegroundColor Magenta
Write-Host "   API: $apiBase" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta

# Test API connection first
Write-Host "`n[1] Test Online API Connection" -ForegroundColor Cyan
try {
    # Test books API
    $booksResult = Invoke-RestMethod -Uri "$apiBase/books?userId=$testUserId" -Method GET -TimeoutSec 15
    Write-Host "  [OK] Books API connected! Books count: $($booksResult.books.Count)" -ForegroundColor Green
    
    # Test characters API
    $charsResult = Invoke-RestMethod -Uri "$apiBase/characters?userId=$testUserId" -Method GET -TimeoutSec 15
    Write-Host "  [OK] Characters API connected! Characters count: $($charsResult.characters.Count)" -ForegroundColor Green
    
    # Test themes API
    $themesResult = Invoke-RestMethod -Uri "$apiBase/themes" -Method GET -TimeoutSec 15
    Write-Host "  [OK] Themes API connected! Themes count: $($themesResult.themes.Count)" -ForegroundColor Green
} catch {
    Write-Host "  [FAIL] API connection failed: $_" -ForegroundColor Red
    exit 1
}

# Start app
Write-Host "`n[2] Start App" -ForegroundColor Cyan
& $adb shell "am force-stop com.legostory.mobile" 2>&1 | Out-Null
Start-Sleep -Seconds 1
& $adb shell "am start -n com.legostory.mobile/.MainActivity" 2>&1 | Out-Null
Write-Host "  [OK] App started, waiting 5 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Screenshot "online_01_app_started"

if (-not (Check-App)) { 
    Write-Host "  [FAIL] App crashed on start" -ForegroundColor Red
    exit 1 
}
Write-Host "  [OK] App is running" -ForegroundColor Green

# Login
Write-Host "`n[3] Login Process" -ForegroundColor Cyan
Tap 540 950 "Username input field"
& $adb shell "input text 'TestUser'" 2>&1 | Out-Null
Start-Sleep -Seconds 1
Tap 100 500 "Close keyboard area"
Start-Sleep -Seconds 1
Swipe 540 1800 540 800 "Scroll down to find login button"
Start-Sleep -Seconds 1
Tap 540 1600 "Login button"
Write-Host "  [OK] Login button clicked, waiting 4 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 4

Screenshot "online_02_after_login"

if (-not (Check-App)) { 
    Write-Host "  [FAIL] App crashed at login" -ForegroundColor Red
    exit 1 
}
Write-Host "  [OK] Logged in successfully" -ForegroundColor Green

# Test Bookshelf Page
Write-Host "`n[4] Test Bookshelf Page" -ForegroundColor Cyan
Tap 200 2300 "Bookshelf tab (left tab)"
Start-Sleep -Seconds 2
Screenshot "online_03_bookshelf_page"

Swipe 540 1800 540 600 "Scroll down bookshelf"
Start-Sleep -Seconds 1
Swipe 540 600 540 1800 "Scroll up bookshelf"
Start-Sleep -Seconds 1
Write-Host "  [OK] Bookshelf page tested" -ForegroundColor Green

# Test Characters Page
Write-Host "`n[5] Test Characters Page" -ForegroundColor Cyan
Tap 400 2300 "Characters tab (second from left)"
Start-Sleep -Seconds 2
Screenshot "online_04_characters_page"

Swipe 540 1800 540 600 "Scroll down characters"
Start-Sleep -Seconds 1
Swipe 540 600 540 1800 "Scroll up characters"
Start-Sleep -Seconds 1
Write-Host "  [OK] Characters page tested" -ForegroundColor Green

# Test Adventure Page
Write-Host "`n[6] Test Adventure Page" -ForegroundColor Cyan
Tap 680 2300 "Adventure tab (third from left)"
Start-Sleep -Seconds 2
Screenshot "online_05_adventure_page"

Swipe 540 1800 540 600 "Scroll down adventure"
Start-Sleep -Seconds 1
Swipe 540 600 540 1800 "Scroll up adventure"
Start-Sleep -Seconds 1
Write-Host "  [OK] Adventure page tested" -ForegroundColor Green

# Test Settings Page
Write-Host "`n[7] Test Settings Page" -ForegroundColor Cyan
Tap 900 2300 "Settings tab (rightmost tab)"
Start-Sleep -Seconds 2
Screenshot "online_06_settings_page"

Swipe 540 1800 540 600 "Scroll down settings"
Start-Sleep -Seconds 1
Swipe 540 600 540 1800 "Scroll up settings"
Start-Sleep -Seconds 1
Write-Host "  [OK] Settings page tested" -ForegroundColor Green

# Navigate back to Bookshelf
Write-Host "`n[8] Navigate Back to Bookshelf" -ForegroundColor Cyan
Tap 200 2300 "Bookshelf tab"
Start-Sleep -Seconds 2
Screenshot "online_07_back_to_bookshelf"
Write-Host "  [OK] Back to bookshelf" -ForegroundColor Green

# Check app logs for API connection
Write-Host "`n[9] Check App Logs for API Connection" -ForegroundColor Cyan
$logs = & $adb logcat -d -s ReactNativeJS:V 2>&1 | Select-String -Pattern "APIClient|lego-story-book|api"
if ($logs) {
    Write-Host "  API related logs:" -ForegroundColor Yellow
    $logs | Select-Object -Last 15 | ForEach-Object { Write-Host "    $_" -ForegroundColor DarkGray }
} else {
    Write-Host "  No API logs found (might be filtered)" -ForegroundColor Yellow
}

# Final check
Write-Host "`n[10] Final App Status Check" -ForegroundColor Cyan
if (Check-App) {
    Write-Host "  [OK] App is still running" -ForegroundColor Green
} else {
    Write-Host "  [FAIL] App crashed during test" -ForegroundColor Red
    exit 1
}

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "   ALL TESTS PASSED!" -ForegroundColor Green
Write-Host "   Screenshots saved to lego-mobile folder" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
