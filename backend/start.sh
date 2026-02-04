#!/bin/bash

# Quick Start - HRMS Backend with MongoDB
echo "=================================================="
echo "   HRMS Backend - Quick Start"
echo "=================================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo ""
    echo "Creating .env from template..."
    cp .env.example .env
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚠️  YOU NEED TO CONFIGURE MONGODB ATLAS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Get MongoDB Atlas URI (FREE):"
    echo "   → https://cloud.mongodb.com/"
    echo "   → Create cluster → Connect → Copy connection string"
    echo ""
    echo "2. Edit .env file and update MONGO_URI:"
    echo "   nano .env"
    echo ""
    echo "   Replace this:"
    echo "   MONGO_URI=mongodb+srv://<username>:<password>@..."
    echo ""
    echo "   With your actual credentials:"
    echo "   MONGO_URI=mongodb+srv://myuser:mypass123@cluster0.xxxxx.mongodb.net/"
    echo ""
    echo "3. Save and run again: ./start.sh"
    echo ""
    exit 0
fi

# Load and check MongoDB URI
MONGO_URI=$(grep "^MONGO_URI=" .env | cut -d'=' -f2-)

if [[ -z "$MONGO_URI" ]] || [[ "$MONGO_URI" == *"<username>"* ]] || [[ "$MONGO_URI" == *"<password>"* ]]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ MongoDB URI NOT CONFIGURED in .env"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Open .env file and update MONGO_URI with your actual credentials"
    echo ""
    echo "Example:"
    echo "  MONGO_URI=mongodb+srv://myuser:mypass123@cluster0.xxxxx.mongodb.net/"
    echo ""
    echo "Get MongoDB Atlas URI at: https://cloud.mongodb.com/"
    echo ""
    exit 1
fi

echo "✅ .env configuration found"

# Activate virtual environment
if [ -d "venv" ]; then
    echo "✅ Activating virtual environment..."
    source venv/bin/activate
else
    echo "❌ Virtual environment not found"
    echo "Run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -q -r requirements.txt

# Run migrations
echo "🔄 Running migrations..."
python manage.py migrate --no-input

# Check system
echo "🔍 Checking system..."
python manage.py check

echo ""
echo "==========================================="
echo "✅ Ready to start!"
echo "==========================================="
echo ""
echo "Start the server:"
echo "  python manage.py runserver"
echo ""
echo "Test the API:"
echo "  curl http://localhost:8000/api/employees/"
echo ""
