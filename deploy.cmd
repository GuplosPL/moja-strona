@echo off
chcp 65001 >nul
cd /d "C:\Users\kolan\Documents\Default Project"
git add -A
set /p msg="Opis zmian (Enter = auto): "
if "%msg%"=="" set msg=auto-update
git commit -m "%msg%"
git push
echo.
echo Zrobione! Strona zostala automatycznie wgrana.
pause
