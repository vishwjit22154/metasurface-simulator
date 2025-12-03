# 🚀 Quick Start Guide

## One-Time Setup (First Time Only)

### Step 1: Install Python Dependencies
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Step 2: Install Node.js Dependencies
```bash
npm install
```

## Running the Application

### Option 1: Using Startup Scripts (Recommended)

**Terminal 1 - Start Backend:**
```bash
./start-backend.sh
```

**Terminal 2 - Start Frontend:**
```bash
./start-frontend.sh
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python server.py
```

**Terminal 2 - Frontend:**
```bash
npm start
```

## Access the Application

Open your browser and go to:
```
http://localhost:3000
```

The backend API runs on:
```
http://localhost:5000
```

## First Simulation

1. **Select Quantization**: Start with "1-bit" to see basic behavior
2. **Set Angles**: 
   - Incident: θ=-30°, φ=0°
   - Steering: θ=30°, φ=0°
3. **Click "Run Simulation"**: Wait a few seconds for results
4. **Explore Results**: Check radiation patterns and phase distributions

## Quick Presets

Try these preset configurations:

### 1. Beam Steering (-30° → 30°)
- Shows basic beam deflection
- Good for understanding fundamentals

### 2. Retroreflection (30°, 45°)
- Reflects signal back to source
- Useful for RFID and backscatter applications

### 3. Side Steering (0° → 45°)
- Normal incidence to side reflection
- Common in satellite communications

## Troubleshooting

### "Cannot connect to backend"
- Make sure backend server is running (Terminal 1)
- Check http://localhost:5000/api/health in browser

### "Module not found" errors
- Run `npm install` in the project root
- Run `pip install -r requirements.txt` in backend folder

### Port already in use
- Kill process on port 5000: `lsof -ti:5000 | xargs kill -9`
- Kill process on port 3000: `lsof -ti:3000 | xargs kill -9`

## System Requirements

- **Node.js**: v16 or higher
- **Python**: v3.8 or higher
- **RAM**: 2GB minimum (4GB recommended)
- **Browser**: Modern browser (Chrome, Firefox, Safari, Edge)

## Next Steps

1. Try different quantization levels (1-bit → 4-bit)
2. Experiment with various angle combinations
3. Compare performance metrics
4. Adjust array size for different applications

---

**Need Help?** Check the full README.md or open an issue on GitHub.

**Happy Simulating! 🛰️**


