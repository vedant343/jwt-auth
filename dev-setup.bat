@echo off
echo ========================================
echo    JWT Auth System - Development Mode
echo ========================================
echo.
echo 🚀 Starting Backend Server (SQLite)...
echo 📱 Frontend will be available at: http://localhost:5000/public/index.html
echo 🔌 API will be available at: http://localhost:5000/api/auth
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start the backend server with nodemon for real-time changes
start "Backend Server" cmd /k "npm run dev:sqlite"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Open the frontend in default browser
start http://localhost:5000/public/index.html

echo.
echo ✅ Development environment started!
echo 📝 Backend: Auto-restart on file changes (nodemon)
echo 🌐 Frontend: Auto-refresh in browser
echo.
echo 💡 Tips:
echo    - Edit any .js file to see backend auto-restart
echo    - Edit index.html to see frontend changes
echo    - Check terminal for backend logs
echo.
pause 