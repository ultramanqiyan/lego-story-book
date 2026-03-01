# Stage Preview Card Display Test
# Correct flow: Login -> Bookshelf -> Select Book -> Add Chapter -> Story Director

$adb = "C:\Users\yannis\AppData\Local\Android\Sdk\platform-tools\adb.exe"

function Tap {
    param([int]$x, [int]$y, [string]$desc)
    Write-Host "  [TAP] $desc ($x, $y)" -ForegroundColor Yellow
    & $adb shell "input tap $x $y" 2>&1 | Out-Null
    Start-Sleep -Seconds 2
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
    & $adb pull /sdcard/$name.png "c:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile\$name.png" 2>&1 | Out-Null
    Write-Host "  [SCREENSHOT] $name.png" -ForegroundColor Cyan
}

Clear-Host
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "   Stage Preview Card Display Test" -ForegroundColor Magenta
Write-Host "   Flow: Login -> Bookshelf -> Book -> Add Chapter" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta

# Step 1: Start app
Write-Host "`n[1] Starting APP" -ForegroundColor Cyan
& $adb shell "am force-stop com.legostory.mobile" 2>&1 | Out-Null
Start-Sleep -Seconds 1
& $adb shell "am start -n com.legostory.mobile/.MainActivity" 2>&1 | Out-Null
Write-Host "  Waiting 5 seconds for app to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Screenshot "stage_card_01_app_started"

# Step 2: Login
Write-Host "`n[2] Login" -ForegroundColor Cyan
Tap 540 950 "Username input"
& $adb shell "input text 'testuser'" 2>&1 | Out-Null
Start-Sleep -Seconds 1
Tap 100 500 "Close keyboard"
Start-Sleep -Seconds 1
Swipe 540 1800 540 800 "Scroll down"
Start-Sleep -Seconds 1
Tap 540 1600 "Login button"
Write-Host "  Waiting 4 seconds for login..." -ForegroundColor Yellow
Start-Sleep -Seconds 4
Screenshot "stage_card_02_after_login"

# Step 3: Go to Bookshelf tab
Write-Host "`n[3] Go to Bookshelf Tab" -ForegroundColor Cyan
Tap 200 2300 "Bookshelf Tab (leftmost)"
Start-Sleep -Seconds 2
Screenshot "stage_card_03_bookshelf"

# Step 4: Select a book
Write-Host "`n[4] Select a Book" -ForegroundColor Cyan
Tap 540 800 "First book in list"
Write-Host "  Waiting 3 seconds for book details..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Screenshot "stage_card_04_book_details"

# Step 5: Click Add Chapter button
Write-Host "`n[5] Click Add Chapter Button" -ForegroundColor Cyan
Swipe 540 1800 540 800 "Scroll down to find add chapter button"
Start-Sleep -Seconds 1
Tap 540 1600 "Add Chapter button"
Write-Host "  Waiting 3 seconds for story director..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Screenshot "stage_card_05_story_director"

# Step 6: Find and select characters
Write-Host "`n[6] Select Characters" -ForegroundColor Cyan
Swipe 540 1800 540 800 "Scroll down to find character cards"
Start-Sleep -Seconds 1
Screenshot "stage_card_06_characters_visible"

# Select first character
Tap 540 1000 "First character card"
Start-Sleep -Seconds 2
Screenshot "stage_card_07_first_character_selected"

# Select second character
Tap 540 1300 "Second character card"
Start-Sleep -Seconds 2
Screenshot "stage_card_08_second_character_selected"

# Step 7: Check Stage Preview
Write-Host "`n[7] Check Stage Preview Area" -ForegroundColor Cyan
Swipe 540 1200 540 1800 "Scroll up to see stage preview"
Start-Sleep -Seconds 1
Screenshot "stage_card_09_stage_preview"

# Step 8: Select terrain
Write-Host "`n[8] Select Terrain" -ForegroundColor Cyan
Swipe 540 1800 540 800 "Scroll down to find terrain options"
Start-Sleep -Seconds 1
Tap 200 1500 "Forest terrain"
Start-Sleep -Seconds 2
Screenshot "stage_card_10_terrain_selected"

# Step 9: Final Stage Preview Check
Write-Host "`n[9] Final Stage Preview Check" -ForegroundColor Cyan
Swipe 540 1200 540 1800 "Scroll up to see final stage preview"
Start-Sleep -Seconds 1
Screenshot "stage_card_11_final_stage_preview"

# Check logs
Write-Host "`n[10] Check Logs" -ForegroundColor Cyan
$logs = & $adb logcat -d -s ReactNativeJS:V 2>&1 | Out-String
if ($logs -match "StagePreview") {
    Write-Host "  [OK] Found StagePreview in logs" -ForegroundColor Green
}
if ($logs -match "selectedCharacters") {
    Write-Host "  [OK] Found selectedCharacters in logs" -ForegroundColor Green
}

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "   Test Complete!" -ForegroundColor Green
Write-Host "   Please check screenshots:" -ForegroundColor Green
Write-Host "   - stage_card_09_stage_preview.png" -ForegroundColor Green
Write-Host "   - stage_card_11_final_stage_preview.png" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
