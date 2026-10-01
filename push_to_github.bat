@echo off
title Push PulsePoint to GitHub
color 0b
set "PATH=C:\Users\NAFILA SHAMNAD\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\git\cmd;%PATH%"
cd /d "%~dp0"

echo ============================================================
echo   Pushing PulsePoint to https://github.com/frankoo-alt/pulsepoint
echo ============================================================
echo.

git push -u origin main --force

echo.
echo ============================================================
echo   Push complete! Check your repository on GitHub.
echo ============================================================
pause
