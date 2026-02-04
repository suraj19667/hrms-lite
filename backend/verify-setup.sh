#!/bin/bash

# HRMS Backend Verification Script
echo "=================================================="
echo "   HRMS Backend Verification"
echo "=================================================="
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found"
    echo "   Run ./setup.sh first"
    exit 1
fi
echo "✅ Virtual environment exists"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found"
    echo "   Copy .env.example to .env and configure it"
    exit 1
fi
echo "✅ .env file exists"

# Activate virtual environment
source venv/bin/activate

# Check if required packages are installed
echo ""
echo "Checking dependencies..."
python -c "import django" 2>/dev/null && echo "✅ Django installed" || echo "❌ Django not installed"
python -c "import rest_framework" 2>/dev/null && echo "✅ Django REST Framework installed" || echo "❌ DRF not installed"
python -c "import djongo" 2>/dev/null && echo "✅ djongo installed" || echo "❌ djongo not installed"
python -c "import pymongo" 2>/dev/null && echo "✅ pymongo installed" || echo "❌ pymongo not installed"
python -c "import dotenv" 2>/dev/null && echo "✅ python-dotenv installed" || echo "❌ python-dotenv not installed"

# Check MongoDB connection
echo ""
echo "Checking MongoDB connection..."
python -c "
import os
import sys
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()
mongo_uri = os.getenv('MONGO_URI')

if not mongo_uri or '<username>' in mongo_uri:
    print('❌ MONGO_URI not configured in .env')
    sys.exit(1)

try:
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    client.server_info()
    print('✅ MongoDB Atlas connection successful')
except Exception as e:
    print(f'❌ MongoDB connection failed: {str(e)}')
    sys.exit(1)
"

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "✅ All checks passed!"
    echo "=================================================="
    echo ""
    echo "Your backend is ready to run!"
    echo "Start the server with: python manage.py runserver"
    echo ""
else
    echo ""
    echo "=================================================="
    echo "❌ Some checks failed"
    echo "=================================================="
    echo ""
    echo "Please fix the issues above before proceeding."
    echo ""
fi
