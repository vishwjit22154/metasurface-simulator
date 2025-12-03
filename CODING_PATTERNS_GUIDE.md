# 🎨 Coding Pattern Visualization Guide

## Overview

This simulator now includes advanced visualizations for digitally-controlled coding metasurfaces, similar to research papers on 2-bit, 3-bit, and 4-bit metasurface arrays. You can visualize how different bit states (00, 01, 10, 11) are represented as discrete colored patterns on a 16×16 array, along with their corresponding far-field radiation patterns.

## New Features

### 1. **Discrete Coding Pattern Visualization**

Each simulation result now shows:
- **Discrete color-coded patterns** where each color represents a specific bit state
- **Bit state legends** showing the mapping between colors and binary codes
- **Phase information** for each state

#### Color Coding by N-bits:

**2-bit (4 states):**
- 🟡 Yellow = `00` (0°)
- 🔵 Blue = `01` (90°)
- 🟢 Green = `10` (180°)
- 🔴 Red = `11` (270°)

**3-bit (8 states):**
- 8 distinct colors representing states `000` through `111`
- Each state separated by 45° phase increments

**4-bit (16 states):**
- 16 distinct colors representing states `0000` through `1111`
- Each state separated by 22.5° phase increments

### 2. **Coding Pattern Gallery**

A new tab in the interface provides a comprehensive gallery of different coding sequences:

#### Available Patterns:

##### Uniform Patterns
- **00 (All Yellow)**: All elements in state 00
- **01 (All Blue)**: All elements in state 01
- **10 (All Green)**: All elements in state 10
- **11 (All Red)**: All elements in state 11

##### Gradient Patterns
- **Gradient X**: Linear phase progression along x-axis
- **Gradient Y**: Linear phase progression along y-axis

##### Periodic Patterns
- **Checkerboard 2×2**: 2×2 unit cell checkerboard
- **Checkerboard 4×4**: 4×4 unit cell checkerboard
- **Horizontal Stripes**: Alternating rows
- **Vertical Stripes**: Alternating columns

### 3. **Interactive Controls**

#### Beam Steering Tab:
- Run custom simulations with any steering angle
- View discrete coding patterns alongside radiation patterns
- See ideal vs. quantized phase distributions

#### Coding Pattern Gallery Tab:
- Select N-bits: 2, 3, or 4 bits
- Choose array size: 8×8, 16×16, 24×24, or 32×32
- Generate all pattern types automatically
- Compare different coding sequences side-by-side

## How to Use

### Step 1: Start the Application

```bash
# Terminal 1: Start Backend
cd "/Users/hvishwajit/1 bit/metasurface-simulator/backend"
source venv/bin/activate
python server.py

# Terminal 2: Start Frontend
cd "/Users/hvishwajit/1 bit/metasurface-simulator"
npm start
```

### Step 2: Explore Beam Steering Simulation

1. **Configure parameters** in the left panel:
   - Set N_bits (1-4)
   - Set steering angles (θ_steer, φ_steer)
   - Set incident angles (θ_inc, φ_inc)
   - Set array size (Nx, Ny)

2. **Click "Run Simulation"**

3. **View results**:
   - Radiation patterns (E-plane and H-plane)
   - Phase distributions (ideal and quantized)
   - **New**: Discrete coding pattern with colored bit states
   - Performance metrics

### Step 3: Explore Coding Pattern Gallery

1. **Click the "Coding Pattern Gallery" tab**

2. **Select parameters**:
   - Choose N-bits (2, 3, or 4)
   - Choose array size (8×8 to 32×32)

3. **View the gallery**:
   - See all coding patterns for the selected configuration
   - Each pattern shows:
     - Discrete color-coded metasurface array
     - Far-field radiation pattern
     - Peak angles and sidelobe levels

4. **Compare patterns**:
   - Uniform patterns produce simple beams
   - Gradient patterns enable beam steering
   - Checkerboard patterns create multiple beams
   - Stripe patterns produce periodic patterns

## Understanding the Visualizations

### Discrete Coding Patterns

The colored grid represents the physical metasurface array:
- Each square = one metasurface element
- Color = the discrete phase state (00, 01, 10, 11, etc.)
- Hover over elements to see bit state and phase value

### Far-Field Patterns

The radiation pattern plots show:
- **X-axis**: Angle θ in degrees (-80° to 80°)
- **Y-axis**: Normalized gain in dB
- **Red line**: E-plane pattern (φ = 0°)
- Different patterns produce different beam shapes

### Applications

#### Research Paper Style Analysis

Generate figures similar to:
- "Dynamical beam manipulation based on 2-bit digitally-controlled coding metasurface" (Scientific Reports)
- Shows multiple coding sequences and their radiation patterns
- Demonstrates beam steering, splitting, and diffusion

#### 5G/6G Communication

- **Uniform patterns**: Fixed beam direction
- **Gradient patterns**: Electronically steerable beams
- **Checkerboard patterns**: Multi-user MIMO

#### Radar Systems

- **Scanning patterns**: Gradient configurations
- **Target tracking**: Dynamic coding sequences
- **Interference mitigation**: Selective beam patterns

## API Endpoints

### New Endpoint: `/api/simulate_pattern`

Generate and analyze specific coding patterns.

**Request:**
```json
{
  "N_bits": 2,
  "pattern_type": "checkerboard_2x2",
  "theta_inc": 0,
  "phi_inc": 0,
  "Nx": 16,
  "Ny": 16
}
```

**Available Pattern Types:**
- `uniform_00`, `uniform_01`, `uniform_10`, `uniform_11`
- `gradient_x`, `gradient_y`
- `checkerboard_2x2`, `checkerboard_4x4`
- `stripes_horizontal`, `stripes_vertical`

**Response:**
```json
{
  "theta_range": [-80, ..., 80],
  "AF_quantized_db_eplane": [...],
  "AF_quantized_db_hplane": [...],
  "phase_quantized": [[...]],
  "theta_peak_quant": [30.5, 30.3],
  "sidelobe_level_quant": -18.5,
  "M_states": 4,
  "pattern_type": "checkerboard_2x2"
}
```

## Technical Details

### Phase Quantization Formula

For N-bit quantization:
- M = 2^N discrete states
- Phase step = 360° / M
- State 0 → 0°
- State 1 → 360°/M
- State k → k × 360°/M

### State-to-Color Mapping

Colors are assigned to ensure visual distinction:
- High contrast between adjacent states
- Consistent across different array sizes
- Accessible color palette

### Pattern Generation

Patterns are generated using state indices:
```python
# Example: Gradient X
for i in range(Nx):
    state = int((i / (Nx - 1)) * (M_states - 1))
    state_indices[:, i] = state
```

## Tips and Best Practices

1. **Start with 2-bit**: Easiest to understand with 4 clear states
2. **Use 16×16 arrays**: Good balance of detail and performance
3. **Compare uniform patterns**: See how each state behaves individually
4. **Try checkerboard**: Observe beam splitting effects
5. **Experiment with gradients**: Understand beam steering mechanisms

## Troubleshooting

### Colors not displaying correctly
- Refresh the browser
- Check console for errors
- Verify backend is running

### Patterns not generating
- Ensure backend server is running on port 5002
- Check network tab in browser dev tools
- Verify no CORS errors

### Slow performance
- Reduce array size (use 8×8 or 16×16)
- Close other browser tabs
- Check CPU usage

## References

- Huang, C., et al. "Dynamical beam manipulation based on 2-bit digitally-controlled coding metasurface." Scientific Reports, 2017.
- Research on N-bit phase quantization for metasurfaces
- Generalized Snell's law for anomalous reflection

---

**Created by:** Vishwajit Harish  
**Version:** 2.0  
**Last Updated:** October 2025

