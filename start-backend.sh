#!/bin/bash

echo "🚀 Starting Metasurface Simulator Backend Server..."
echo ""

# Navigate to backend directory
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created!"
    echo ""
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
echo "📥 Installing/updating dependencies..."
pip install -q -r requirements.txt

echo ""
echo "✅ Backend setup complete!"
echo "🌐 Starting Flask server on http://localhost:5000"
echo "📡 API will be available at http://localhost:5000/api/simulate"
echo ""
echo "Press Ctrl+C to stop the server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server
python server.py


