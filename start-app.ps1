# Start PhD Opportunity Finder Application
Write-Host "Starting PhD Opportunity Finder Application..." -ForegroundColor Cyan

# Start backend server
Write-Host "Starting Backend (Flask)..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command cd backend; python app.py"

# Give backend a moment to start
Start-Sleep -Seconds 2

# Start frontend server
Write-Host "Starting Frontend (React)..." -ForegroundColor Green
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit -Command cd frontend; npm start"

Write-Host "`nBoth servers are starting. Please wait a moment..." -ForegroundColor Yellow
Write-Host "Backend will be available at http://localhost:5000" -ForegroundColor Magenta
Write-Host "Frontend will be available at http://localhost:3000" -ForegroundColor Magenta
