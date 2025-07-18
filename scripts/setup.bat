@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo     SmartHire Frontend Setup Script
echo ==========================================
echo.

echo 🚀 Setting up SmartHire Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher.
    exit /b 1
)

echo [SUCCESS] Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed. Please install npm.
    exit /b 1
)

echo [SUCCESS] npm version:
npm --version

REM Install dependencies
echo [INFO] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [SUCCESS] Dependencies installed successfully

REM Create environment file
if not exist .env (
    echo [INFO] Creating .env file...
    (
        echo # SmartHire Frontend Environment Variables
        echo REACT_APP_API_URL=http://localhost:5000
        echo REACT_APP_API_TIMEOUT=10000
        echo REACT_APP_ENVIRONMENT=development
        echo REACT_APP_VERSION=1.0.0
        echo REACT_APP_NAME=SmartHire
        echo REACT_APP_ENABLE_PWA=true
        echo REACT_APP_ENABLE_ANALYTICS=false
        echo REACT_APP_ENABLE_NOTIFICATIONS=true
        echo REACT_APP_DEBUG_MODE=true
    ) > .env
    echo [SUCCESS] .env file created
) else (
    echo [WARNING] .env file already exists
)

REM Create necessary directories
echo [INFO] Creating necessary directories...
if not exist "public\images" mkdir "public\images"
if not exist "src\components" mkdir "src\components"
if not exist "src\utils" mkdir "src\utils"
if not exist "src\hooks" mkdir "src\hooks"
echo [SUCCESS] Directories created

REM Check if backend is running
echo [INFO] Checking backend connection...
curl -s http://localhost:5000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Backend is running on http://localhost:5000
) else (
    echo [WARNING] Backend is not running on http://localhost:5000
    echo [WARNING] Please start the Flask backend before running the frontend
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo Next steps:
echo 1. Start the backend server:
echo    cd .. ^&^& python app.py
echo.
echo 2. Start the frontend development server:
echo    npm start
echo.
echo 3. Open your browser and navigate to:
echo    http://localhost:3000
echo.
echo 4. For Docker development:
echo    docker-compose -f docker-compose.dev.yml up
echo.
echo 5. For production build:
echo    npm run build
echo.
echo 📚 Documentation: README.md
echo 🐛 Issues: Check the console for any errors
echo.

pause 