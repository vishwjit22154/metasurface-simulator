# 🛰️ Software Controlled Metasurface Simulator

A modern web-based interface for simulating and analyzing N-bit phase quantized software controlled metasurfaces for beam steering applications.

![Metasurface Simulator](https://img.shields.io/badge/React-18-blue) ![Flask](https://img.shields.io/badge/Flask-3.0-green) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## 🌟 Features

- **Interactive Parameter Control**: Real-time adjustment of beam steering angles, incident angles, and quantization bits
- **Visual Analysis**: Live radiation pattern plots (E-plane & H-plane) and phase distribution heatmaps
- **Performance Metrics**: Automatic calculation of gain loss, sidelobe levels, and pointing errors
- **Multiple Quantization Levels**: Support for 1-bit, 2-bit, 3-bit, and 4-bit phase quantization
- **Responsive Design**: Modern Material-UI interface that works on desktop and mobile
- **Pure Python Backend**: No MATLAB required - runs entirely on Python with NumPy

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Install Dependencies

#### Frontend (React)
```bash
cd metasurface-simulator
npm install
```

#### Backend (Python/Flask)
```bash
cd backend
pip install -r requirements.txt
# Or use a virtual environment (recommended):
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Start the Backend Server

```bash
cd backend
python server.py
```

The backend server will start on `http://localhost:5000`

### 3. Start the Frontend

Open a new terminal:

```bash
cd metasurface-simulator
npm start
```

The React app will open in your browser at `http://localhost:3000`

## 🎯 Usage Guide

### Parameter Controls

1. **Quantization Settings**
   - **N_bits**: Number of phase quantization bits (1-4)
     - 1-bit: Simple hardware, poor beam quality
     - 2-bit: Better performance, moderate complexity
     - 3-bit: Good performance, practical choice
     - 4-bit: Excellent performance, near-ideal

2. **Steering Direction**
   - **θ_steer**: Elevation angle for steered beam (-80° to 80°)
   - **φ_steer**: Azimuth angle for steered beam (0° to 360°)

3. **Incident Direction**
   - **θ_inc**: Elevation angle of incident wave (-80° to 80°)
   - **φ_inc**: Azimuth angle of incident wave (0° to 360°)

4. **Array Size**
   - **Nx**: Number of elements in X direction (4-32)
   - **Ny**: Number of elements in Y direction (4-32)


### Quick Presets

- **Beam Steering**: Incident at -30°, steer to +30°
- **Retroreflection**: Reflect back to source (same incident and steering angles)
- **Side Steering**: Normal incidence (0°) to 45° steering

### Interpreting Results

#### Performance Metrics
- **Gain Loss**: Efficiency loss due to quantization (lower is better)
- **Sidelobe Level**: Unwanted radiation level (< -20 dB is good)
- **Pointing Error**: Accuracy of beam steering (< 1° is excellent)
- **Phase States**: Number of discrete phase values available

#### Radiation Patterns
- **Blue solid line**: Ideal performance (continuous phase)
- **Red dashed line**: Actual performance (quantized phase)
- **Green line**: -3dB beamwidth reference
- **Black line**: Target steering angle

#### Phase Distributions
- **Left**: Ideal continuous phase distribution needed
- **Right**: Actual quantized phase configuration

## 🏗️ Project Structure

```
metasurface-simulator/
├── backend/
│   ├── server.py           # Flask API server
│   └── requirements.txt    # Python dependencies
├── src/
│   ├── components/
│   │   ├── ParameterPanel.tsx       # Parameter controls UI
│   │   └── ResultsVisualization.tsx # Results display
│   ├── App.tsx            # Main application
│   └── App.css            # Styling
├── public/                # Static assets
└── package.json          # Node.js dependencies
```

## 🔧 API Endpoints

### POST `/api/simulate`

Run a metasurface simulation with specified parameters.

**Request Body:**
```json
{
  "N_bits": 2,
  "theta_steer": 30,
  "phi_steer": 45,
  "theta_inc": -30,
  "phi_inc": 0,
  "Nx": 16,
  "Ny": 16
}
```

**Response:**
```json
{
  "theta_range": [-80, -79, ..., 80],
  "AF_continuous_db_eplane": [...],
  "AF_quantized_db_eplane": [...],
  "AF_continuous_db_hplane": [...],
  "AF_quantized_db_hplane": [...],
  "phase_desired": [[...], [...]],
  "phase_quantized": [[...], [...]],
  "gain_loss_db": 0.82,
  "sidelobe_level_quant": -18.5,
  "pointing_error": [0.5, 0.3],
  "M_states": 4,
  "theta_peak_quant": [30.5, 30.3]
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Backend server is running"
}
```

## 🧪 Real-World Applications

### 5G/6G Base Stations
- **Scenario**: Urban base station serving multiple users
- **Configuration**: 
  - Normal incidence (θ_inc = 0°)
  - Steer to user at θ_steer = 30°, φ_steer = 45°
  - Use 3-bit quantization for good performance/cost balance

### Satellite Communications
- **Scenario**: LEO satellite tracking ground station
- **Configuration**:
  - Dynamic steering angles following satellite trajectory
  - 4-bit quantization for high precision
  - Large array (32×32) for high gain

### Automotive Radar
- **Scenario**: 77 GHz radar for autonomous vehicles
- **Configuration**:
  - Fast scanning with 2-bit quantization
  - Smaller array (16×16) for cost efficiency
  - Multiple steering angles for object detection

## 🐛 Troubleshooting

### Backend Connection Error
- Ensure Python server is running: `python backend/server.py`
- Check if port 5000 is available
- Verify CORS is enabled in Flask

### Simulation Takes Too Long
- Reduce array size (Nx, Ny)
- Use fewer theta range points (modify backend code)
- Close other applications to free resources

### Plots Not Displaying
- Check browser console for errors
- Ensure all npm packages are installed
- Try clearing browser cache

## 📚 Technical Background

### Phase Quantization

N-bit quantization provides 2^N discrete phase states:
- **1-bit**: 0°, 180° (binary on/off)
- **2-bit**: 0°, 90°, 180°, 270°
- **3-bit**: 8 equally spaced states
- **4-bit**: 16 equally spaced states

Theoretical quantization loss: `-20*log10(sinc(1/M))` where M = 2^N

### Generalized Snell's Law

Phase distribution for reflective metasurface:
```
φ(x,y) = k₀[x(sin θᵣ cos φᵣ - sin θᵢ cos φᵢ) + y(sin θᵣ sin φᵣ - sin θᵢ sin φᵢ)]
```

Where:
- (θᵢ, φᵢ): Incident angles
- (θᵣ, φᵣ): Reflected/steered angles
- k₀: Wavenumber (2π/λ)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Vishwajit Harish**

## 🙏 Acknowledgments

- Based on metasurface beam steering research
- Uses Material-UI for modern interface
- Recharts for data visualization
- Flask for lightweight backend API

---

**Happy Simulating! 🚀**

For questions or support, please open an issue on GitHub.
