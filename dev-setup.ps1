# JWT Auth System - Development Mode
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    JWT Auth System - Development Mode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Kill any existing processes on port 5000
Write-Host "🔒 Closing any existing processes on port 5000..." -ForegroundColor Yellow
$processes = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
if ($processes) {
    foreach ($pid in $processes) {
        try {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "✅ Killed process $pid" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Could not kill process $pid" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "🚀 Starting Backend Server (SQLite)..." -ForegroundColor Green
Write-Host "📱 Frontend will be available at: http://localhost:5000/public/index.html" -ForegroundColor Blue
Write-Host "🔌 API will be available at: http://localhost:5000/api/auth" -ForegroundColor Blue
Write-Host ""

# Start the backend server with nodemon for real-time changes
Write-Host "📝 Starting backend with nodemon (auto-restart on changes)..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "dev:sqlite" -WindowStyle Normal

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend server is running successfully!" -ForegroundColor Green
        
        # Open frontend in default browser
        Write-Host "🌐 Opening frontend in browser..." -ForegroundColor Blue
        Start-Process "http://localhost:5000/public/index.html"
        
        Write-Host ""
        Write-Host "🎉 Development environment is ready!" -ForegroundColor Green
        Write-Host ""
        Write-Host "💡 Development Features:" -ForegroundColor Cyan
        Write-Host "   📝 Backend: Auto-restart on file changes (nodemon)" -ForegroundColor White
        Write-Host "   🌐 Frontend: Auto-refresh in browser" -ForegroundColor White
        Write-Host "   🗄️  Database: SQLite with real-time data" -ForegroundColor White
        Write-Host ""
        Write-Host "🔧 How to use:" -ForegroundColor Yellow
        Write-Host "   1. Edit any .js file → Backend auto-restarts" -ForegroundColor White
        Write-Host "   2. Edit index.html → Refresh browser to see changes" -ForegroundColor White
        Write-Host "   3. Check terminal for backend logs" -ForegroundColor White
        Write-Host ""
        Write-Host "📱 Test the system:" -ForegroundColor Blue
        Write-Host "   - Create a new account" -ForegroundColor White
        Write-Host "   - Login with your credentials" -ForegroundColor White
        Write-Host "   - View your profile" -ForegroundColor White
        Write-Host "   - Logout" -ForegroundColor White
        Write-Host ""
        Write-Host "Press any key to stop the development environment..." -ForegroundColor Red
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        
        # Stop the backend process
        Write-Host "🛑 Stopping backend server..." -ForegroundColor Yellow
        $processes = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($processes) {
            foreach ($pid in $processes) {
                Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            }
        }
        Write-Host "✅ Development environment stopped." -ForegroundColor Green
        
    } else {
        Write-Host "❌ Backend server failed to start properly" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Could not connect to backend server" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
} 