@echo off
setlocal

set ROOT=%~dp0

echo [1/3] Installing backend dependencies...
cd /d "%ROOT%\backend"
cmd /c npm install || goto :error

echo [2/3] Preparing env file...
if not exist ".env" copy ".env.example" ".env"

echo [3/3] Seeding database...
cmd /c npm run seed || goto :error

echo.
echo Setup complete.
echo Next run: start-all.bat
exit /b 0

:error
echo.
echo Setup failed. Check logs above.
exit /b 1
