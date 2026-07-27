@echo off
title Memulai CatMatch App & Backend
echo ==========================================
echo    MEMULAI APLIKASI CATMATCH (FRONTEND & BACKEND)
echo ==========================================

echo [1/2] Menjalankan Backend Server (Port 7863)...
start "CatMatch Backend Server" cmd /k "cd /d "%~dp0..\pasangan-kucing-backend-main" && npm start"

echo [2/2] Menjalankan Frontend Next.js (Port 3000)...
start "CatMatch Frontend Server" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo ==========================================
echo    KEDUA SERVER BERHASIL DIJALANKAN!
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:7863
echo ==========================================
pause
