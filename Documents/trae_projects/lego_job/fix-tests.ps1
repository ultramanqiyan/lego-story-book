$file = "c:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile\tests\playwright\core-functions.spec.js"
$content = Get-Content $file -Raw

# 替换所有 text=XXXScreen 为 text=/XXXScreen/
$content = $content -replace "text=LoginScreen", "text=/LoginScreen/"
$content = $content -replace "text=HomeScreen", "text=/HomeScreen/"
$content = $content -replace "text=BookshelfScreen", "text=/BookshelfScreen/"
$content = $content -replace "text=CharactersScreen", "text=/CharactersScreen/"
$content = $content -replace "text=AdventureScreen", "text=/AdventureScreen/"
$content = $content -replace "text=SettingsScreen", "text=/SettingsScreen/"
$content = $content -replace "text=StoryCreateScreen", "text=/StoryCreateScreen/"
$content = $content -replace "text=BookDetailScreen", "text=/BookDetailScreen/"
$content = $content -replace "text=ThemeSettingsScreen", "text=/ThemeSettingsScreen/"
$content = $content -replace "text=ParentControlScreen", "text=/ParentControlScreen/"
$content = $content -replace "text=StoryDirectorScreen", "text=/StoryDirectorScreen/"
$content = $content -replace "text=ChapterScreen", "text=/ChapterScreen/"

Set-Content $file $content
Write-Host "替换完成！"
