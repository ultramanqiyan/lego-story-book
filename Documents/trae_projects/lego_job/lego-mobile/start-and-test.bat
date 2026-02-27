@echo off
echo Starting Backend API Server on port 8788...
start cmd /k "cd /d c:\Users\yannis\Documents\trae_projects\lego_job && npm run dev"

echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak

echo Starting Frontend Server on port 8082...
start cmd /k "cd /d c:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile && npx expo start --web --port 8082"

echo Waiting 30 seconds for frontend to start...
timeout /t 30 /nobreak

echo Running Playwright tests...
cd /d c:\Users\yannis\Documents\trae_projects\lego_job\lego-mobile
npx playwright test tests/playwright/core-functions.spec.js --reporter=list --timeout=120000

echo Done!
