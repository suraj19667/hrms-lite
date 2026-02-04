#!/bin/bash

# HRMS Backend Setup Script - Django + MongoDB Atlas
echo "=================================================="
echo "   HRMS Backend Setup - Django + MongoDB Atlas"
echo "=================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

echo "✅ Python $(python3 --version) found"

# Create virtual environment
echo ""
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚠️  IMPORTANT: Edit .env file with your MongoDB credentials!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Get MongoDB Atlas URI:"
    echo "   • Go to https://cloud.mongodb.com/"
    echo "   • Create a free cluster"
    echo "   • Click 'Connect' → 'Connect your application'"
    echo "   • Copy the connection string"
    echo ""
    echo "2. Edit .env file and update:"
    echo "   • MONGO_URI=your-mongodb-atlas-connection-string"
    echo "   • SECRET_KEY=your-secret-key"
    echo ""
    echo "3. Run this script again after updating .env"
    echo ""
    exit 0
fi

echo "✅ .env file found"

# Run migrations
echo ""
echo "🔄 Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo ""
echo "=================================================="
echo "✅ Setup Complete!"
echo "=================================================="
echo ""
echo "To start the development server:"
echo "  1. Activate virtual environment: source venv/bin/activate"
echo "  2. Run server: python manage.py runserver"
echo ""
echo "API will be available at: http://localhost:8000"
echo ""
echo "API Endpoints:"
echo "  • GET/POST  /api/employees/"
echo "  • DELETE    /api/employees/{id}/"
echo "  • POST      /api/attendance/"
echo "  • GET       /api/attendance/all/"
echo "  • GET       /api/attendance/{employee_id}/"
echo ""
echo "Optional:"
echo "  • Create superuser: python manage.py createsuperuser"
echo "  • Access admin panel: http://localhost:8000/admin/"
echo ""
