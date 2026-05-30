@echo off
setlocal

set ROOT=%~dp0

echo Starting PureOrigins backend...
start "PureOrigins Backend" cmd /k "cd /d "%ROOT%\backend" && cmd /c npm run dev"

timeout /t 2 /nobreak >nul

echo Starting frontend static server...
start "PureOrigins Frontend" cmd /k "cd /d "%ROOT%\frontend" && node serve-local.js"

timeout /t 1 /nobreak >nul

echo.
echo Done.
echo Storefront: http://127.0.0.1:8080/index.html
echo Admin:      http://127.0.0.1:8080/admin/index.html
echo API Health: http://localhost:5000/health
exit /b 0
