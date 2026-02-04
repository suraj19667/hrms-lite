@echo off
REM HRMS Lite - Automated Setup Script for Windows
REM This script sets up both backend and frontend automatically

echo ================================================
echo    HRMS Lite - Automated Setup Script
echo ================================================
echo.

REM Check prerequisites
echo Checking prerequisites...

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js 16 or higher.
    exit /b 1
)

echo Prerequisites check passed!
echo.

REM Setup Backend
echo Setting up Backend...
cd backend

echo Creating virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo Running database migrations...
python manage.py makemigrations
python manage.py migrate

echo Backend setup complete!
echo.

REM Setup Frontend
echo Setting up Frontend...
cd ..\frontend

echo Installing Node.js dependencies...
call npm install

echo Frontend setup complete!
echo.

REM Final instructions
echo ================================================
echo    Setup Complete!
echo ================================================
echo.
echo To start the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
echo Read QUICKSTART.md for more details
echo ================================================

pause
