@echo off
echo ========================================
echo    JWT Authentication System
echo ========================================
echo.
echo Starting the authentication system...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please create .env file with your configuration.
    echo See README.md for details.
    pause
    exit /b 1
)

REM Check if PostgreSQL is running (optional check)
echo Checking database connection...
node -e "import('./config/database.js').then(() => console.log('Database connection OK')).catch(e => console.log('Database connection failed:', e.message))" 2>nul

echo.
echo Starting server...
echo Server will be available at: http://localhost:5000
echo Frontend will be available at: http://localhost:5000/public/index.html
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm start

pause 