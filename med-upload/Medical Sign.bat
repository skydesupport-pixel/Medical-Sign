@echo off
chcp 65001 >nul
title Medical Sign
cd /d "%~dp0"

REM ---------------------------------------------------------------
REM  Medical Sign launcher.
REM
REM  Starts the server only if it is not already running, waits for it
REM  to answer, then opens the admin site in its own window with no
REM  browser chrome - so it looks and behaves like an installed app.
REM
REM  Double-click this file, or use the Desktop shortcut created by
REM  install-shortcut.ps1.
REM ---------------------------------------------------------------

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Node.js is not installed on this computer.
  echo   Medical Sign needs it to run.  Install from  https://nodejs.org
  echo.
  pause
  exit /b 1
)

REM --- already running?  then just open a window at it ---
powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if not errorlevel 1 goto open

REM --- start it detached, with no console window ---
echo   Starting Medical Sign...
powershell -NoProfile -Command "Start-Process -FilePath 'node' -ArgumentList 'server.js' -WorkingDirectory '%CD%' -WindowStyle Hidden"

REM --- wait until it actually answers (up to ~15s) ---
powershell -NoProfile -Command ^
  "for ($i=0; $i -lt 30; $i++) { try { Invoke-WebRequest 'http://localhost:3000/' -TimeoutSec 2 -UseBasicParsing | Out-Null; exit 0 } catch { Start-Sleep -Milliseconds 500 } }; exit 1"
if errorlevel 1 (
  echo.
  echo   The server did not start.  Run  node server.js  here to see why.
  echo.
  pause
  exit /b 1
)

:open
REM ---------------------------------------------------------------
REM  Open a NORMAL browser window, not --app.
REM
REM  --app has no address bar, and Chrome will not offer to install a
REM  page in a window without one - so the app could never actually be
REM  installed, only ever borrowed from Chrome. A normal window shows
REM  the "התקנה כאפליקציה" button in the top bar; one click and Windows
REM  has it in the Start menu with its own icon, and this launcher is
REM  no longer needed to open it.
REM ---------------------------------------------------------------
start "" http://localhost:3000/
exit /b 0
