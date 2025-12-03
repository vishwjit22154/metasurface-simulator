#!/usr/bin/env python3
"""
Flask backend server for Metasurface Beam Steering Simulator
Executes MATLAB code and returns results to React frontend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import subprocess
import json
import os
import tempfile

app = Flask(__name__)

# Configure CORS for production and development
cors_origins = os.environ.get('CORS_ORIGINS', '*').split(',')
CORS(app, origins=cors_origins)  # Enable CORS for React frontend

# Path to MATLAB script
MATLAB_SCRIPT_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'ReflectiveMetasurfaceBeamSteering.m')

@app.route('/api/simulate', methods=['POST'])
def simulate():
    """
    Run metasurface simulation with provided parameters
    """
    try:
        params = request.json
        
        # Validate parameters
        required_params = ['N_bits', 'theta_steer', 'phi_steer', 'theta_inc', 'phi_inc', 'Nx', 'Ny']
        for param in required_params:
            if param not in params:
                return jsonify({'error': f'Missing parameter: {param}'}), 400
        
        # Create temporary MATLAB script with user parameters
        matlab_code = generate_matlab_code(params)
        
        # Write to temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.m', delete=False) as f:
            matlab_file = f.name
            f.write(matlab_code)
        
        # Run MATLAB/Octave simulation
        try:
            # Try MATLAB first
            result = subprocess.run(
                ['matlab', '-nodisplay', '-nosplash', '-nodesktop', '-r', 
                 f"run('{matlab_file}'); quit;"],
                capture_output=True,
                text=True,
                timeout=60
            )
        except FileNotFoundError:
            # Fall back to Octave if MATLAB is not available
            try:
                result = subprocess.run(
                    ['octave', '--no-gui', '--eval', f"run('{matlab_file}');"],
                    capture_output=True,
                    text=True,
                    timeout=60
                )
            except FileNotFoundError:
                # If neither is available, run pure Python simulation
                results = run_python_simulation(params)
                os.unlink(matlab_file)
                return jsonify(results)
        
        # Clean up temporary file
        os.unlink(matlab_file)
        
        # Parse output
        output_file = matlab_file.replace('.m', '_output.json')
        if os.path.exists(output_file):
            with open(output_file, 'r') as f:
                results = json.load(f)
            os.unlink(output_file)
            return jsonify(results)
        else:
            # If MATLAB output not found, use Python simulation
            results = run_python_simulation(params)
            return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def generate_matlab_code(params):
    """Generate MATLAB code with user parameters"""
    return f"""
% Auto-generated MATLAB script for web simulation
clear; clc;

%% Parameters from web interface
freq = 10e9;
lambda = 3e8/freq;
k0 = 2*pi/lambda;
Nx = {params['Nx']};
Ny = {params['Ny']};
dx = lambda/2;
dy = lambda/2;

N_bits = {params['N_bits']};
M_states = 2^N_bits;
theta_steer = {params['theta_steer']};
phi_steer = {params['phi_steer']};
theta_inc = {params['theta_inc']};
phi_inc = {params['phi_inc']};
theta_range = -80:1:80;
phi_cuts = [0, 90];

%% Simulation code (simplified for web)
x_pos = (-(Nx-1)/2:(Nx-1)/2) * dx;
y_pos = (-(Ny-1)/2:(Ny-1)/2) * dy;
[X, Y] = meshgrid(x_pos, y_pos);

theta_steer_rad = deg2rad(theta_steer);
phi_steer_rad = deg2rad(phi_steer);
theta_inc_rad = deg2rad(theta_inc);
phi_inc_rad = deg2rad(phi_inc);

phase_desired = k0 * (X * (sin(theta_steer_rad) * cos(phi_steer_rad) - sin(theta_inc_rad) * cos(phi_inc_rad)) + ...
                      Y * (sin(theta_steer_rad) * sin(phi_steer_rad) - sin(theta_inc_rad) * sin(phi_inc_rad)));
phase_desired = mod(phase_desired + pi, 2*pi) - pi;

w_continuous = exp(-1j * phase_desired);

phase_shifted = phase_desired + pi;
phase_indices = floor(phase_shifted / (2*pi) * M_states);
phase_step = 2*pi / M_states;
phase_quantized_shifted = phase_indices * phase_step;
phase_quantized = mod(phase_quantized_shifted - pi, 2*pi) - pi;
w_quantized = exp(-1j * phase_quantized);

theta_rad = deg2rad(theta_range);
phi_rad = deg2rad(phi_cuts);

AF_continuous = zeros(length(phi_cuts), length(theta_range));
AF_quantized = zeros(length(phi_cuts), length(theta_range));

for phi_idx = 1:length(phi_cuts)
    phi_current = phi_rad(phi_idx);
    for theta_idx = 1:length(theta_range)
        theta_current = theta_rad(theta_idx);
        phase_factor = k0 * (X * sin(theta_current) * cos(phi_current) + ...
                            Y * sin(theta_current) * sin(phi_current));
        AF_continuous(phi_idx, theta_idx) = sum(sum(w_continuous .* exp(1j * phase_factor)));
        AF_quantized(phi_idx, theta_idx) = sum(sum(w_quantized .* exp(1j * phase_factor)));
    end
end

AF_continuous = abs(AF_continuous) / max(abs(AF_continuous(:)));
AF_quantized = abs(AF_quantized) / max(abs(AF_quantized(:)));
AF_continuous_db = 20*log10(AF_continuous + eps);
AF_quantized_db = 20*log10(AF_quantized + eps);

[~, peak_idx_quant] = max(AF_quantized, [], 2);
theta_peak_quant = theta_range(peak_idx_quant);
pointing_error = abs(theta_peak_quant - theta_steer);
gain_loss_db = max(AF_continuous_db(:)) - max(AF_quantized_db(:));
sidelobe_level_cont = max(AF_continuous_db(AF_continuous_db < max(AF_continuous_db(:)) - 3));
sidelobe_level_quant = max(AF_quantized_db(AF_quantized_db < max(AF_quantized_db(:)) - 3));

%% Export results to JSON
results.theta_range = theta_range;
results.AF_continuous_db_eplane = AF_continuous_db(1, :);
results.AF_quantized_db_eplane = AF_quantized_db(1, :);
results.AF_continuous_db_hplane = AF_continuous_db(2, :);
results.AF_quantized_db_hplane = AF_quantized_db(2, :);
results.phase_desired = rad2deg(phase_desired);
results.phase_quantized = rad2deg(phase_quantized);
results.gain_loss_db = gain_loss_db;
results.sidelobe_level_quant = sidelobe_level_quant;
results.pointing_error = pointing_error;
results.M_states = M_states;
results.theta_peak_quant = theta_peak_quant;

% Save to JSON file
jsonencode(results);  % This would require MATLAB's jsonencode
"""


def run_python_simulation(params):
    """
    Pure Python implementation of metasurface simulation
    Used as fallback when MATLAB is not available
    """
    # Extract parameters
    N_bits = params['N_bits']
    theta_steer = params['theta_steer']
    phi_steer = params['phi_steer']
    theta_inc = params['theta_inc']
    phi_inc = params['phi_inc']
    Nx = params['Nx']
    Ny = params['Ny']
    
    # Constants
    freq = 10e9
    c = 3e8
    wavelength = c / freq
    k0 = 2 * np.pi / wavelength
    dx = wavelength / 2
    dy = wavelength / 2
    M_states = 2 ** N_bits
    
    # Generate array geometry
    x_pos = np.arange(-(Nx-1)/2, (Nx-1)/2 + 1) * dx
    y_pos = np.arange(-(Ny-1)/2, (Ny-1)/2 + 1) * dy
    X, Y = np.meshgrid(x_pos, y_pos)
    
    # Convert angles to radians
    theta_steer_rad = np.deg2rad(theta_steer)
    phi_steer_rad = np.deg2rad(phi_steer)
    theta_inc_rad = np.deg2rad(theta_inc)
    phi_inc_rad = np.deg2rad(phi_inc)
    
    # Calculate desired phase distribution
    phase_desired = k0 * (
        X * (np.sin(theta_steer_rad) * np.cos(phi_steer_rad) - np.sin(theta_inc_rad) * np.cos(phi_inc_rad)) +
        Y * (np.sin(theta_steer_rad) * np.sin(phi_steer_rad) - np.sin(theta_inc_rad) * np.sin(phi_inc_rad))
    )
    phase_desired = np.mod(phase_desired + np.pi, 2*np.pi) - np.pi
    
    # Quantize phase
    phase_shifted = phase_desired + np.pi
    phase_indices = np.floor(phase_shifted / (2*np.pi) * M_states)
    phase_step = 2*np.pi / M_states
    phase_quantized_shifted = phase_indices * phase_step
    phase_quantized = np.mod(phase_quantized_shifted - np.pi, 2*np.pi) - np.pi
    
    # Calculate weights
    w_continuous = np.exp(-1j * phase_desired)
    w_quantized = np.exp(-1j * phase_quantized)
    
    # Calculate array factors
    theta_range = np.arange(-80, 81, 1)
    phi_cuts = [0, 90]
    theta_rad = np.deg2rad(theta_range)
    phi_rad = np.deg2rad(phi_cuts)
    
    AF_continuous = np.zeros((len(phi_cuts), len(theta_range)), dtype=complex)
    AF_quantized = np.zeros((len(phi_cuts), len(theta_range)), dtype=complex)
    
    for phi_idx, phi_current in enumerate(phi_rad):
        for theta_idx, theta_current in enumerate(theta_rad):
            phase_factor = k0 * (
                X * np.sin(theta_current) * np.cos(phi_current) +
                Y * np.sin(theta_current) * np.sin(phi_current)
            )
            AF_continuous[phi_idx, theta_idx] = np.sum(w_continuous * np.exp(1j * phase_factor))
            AF_quantized[phi_idx, theta_idx] = np.sum(w_quantized * np.exp(1j * phase_factor))
    
    # Normalize and convert to dB
    AF_continuous = np.abs(AF_continuous) / np.max(np.abs(AF_continuous))
    AF_quantized = np.abs(AF_quantized) / np.max(np.abs(AF_quantized))
    AF_continuous_db = 20 * np.log10(AF_continuous + 1e-10)
    AF_quantized_db = 20 * np.log10(AF_quantized + 1e-10)
    
    # Calculate performance metrics
    peak_idx_quant = np.argmax(AF_quantized, axis=1)
    theta_peak_quant = theta_range[peak_idx_quant]
    pointing_error = np.abs(theta_peak_quant - theta_steer)
    gain_loss_db = float(np.max(AF_continuous_db) - np.max(AF_quantized_db))
    
    # Calculate sidelobe levels
    AF_continuous_flat = AF_continuous_db.flatten()
    AF_quantized_flat = AF_quantized_db.flatten()
    max_continuous = np.max(AF_continuous_flat)
    max_quantized = np.max(AF_quantized_flat)
    
    sidelobe_level_cont = float(np.max(AF_continuous_flat[AF_continuous_flat < max_continuous - 3]))
    sidelobe_level_quant = float(np.max(AF_quantized_flat[AF_quantized_flat < max_quantized - 3]))
    
    # Prepare results
    results = {
        'theta_range': theta_range.tolist(),
        'AF_continuous_db_eplane': AF_continuous_db[0, :].tolist(),
        'AF_quantized_db_eplane': AF_quantized_db[0, :].tolist(),
        'AF_continuous_db_hplane': AF_continuous_db[1, :].tolist(),
        'AF_quantized_db_hplane': AF_quantized_db[1, :].tolist(),
        'phase_desired': np.rad2deg(phase_desired).tolist(),
        'phase_quantized': np.rad2deg(phase_quantized).tolist(),
        'gain_loss_db': gain_loss_db,
        'sidelobe_level_quant': sidelobe_level_quant,
        'pointing_error': pointing_error.tolist(),
        'M_states': int(M_states),
        'theta_peak_quant': theta_peak_quant.tolist(),
    }
    
    return results


def generate_coding_pattern(pattern_type, N_bits, Nx, Ny):
    """
    Generate different coding patterns for metasurface
    
    Args:
        pattern_type: Type of coding pattern (uniform, gradient_x, gradient_y, checkerboard, etc.)
        N_bits: Number of bits (1-4)
        Nx, Ny: Array dimensions
    
    Returns:
        phase_quantized: Quantized phase distribution in degrees
    """
    M_states = 2 ** N_bits
    phase_step = 360 / M_states
    
    # Generate pattern based on type
    if pattern_type == 'uniform_00':
        # All elements in state 00 (0 degrees)
        state_indices = np.zeros((Ny, Nx))
    
    elif pattern_type == 'uniform_01':
        # All elements in state 01
        state_indices = np.ones((Ny, Nx))
    
    elif pattern_type == 'uniform_10':
        # All elements in state 10 (2 in decimal)
        state_indices = np.ones((Ny, Nx)) * 2
    
    elif pattern_type == 'uniform_11':
        # All elements in state 11 (3 in decimal)
        state_indices = np.ones((Ny, Nx)) * 3
    
    elif pattern_type == 'gradient_x':
        # Linear gradient along x-direction
        state_indices = np.zeros((Ny, Nx))
        for i in range(Nx):
            state = int((i / (Nx - 1)) * (M_states - 1))
            state_indices[:, i] = state
    
    elif pattern_type == 'gradient_y':
        # Linear gradient along y-direction
        state_indices = np.zeros((Ny, Nx))
        for i in range(Ny):
            state = int((i / (Ny - 1)) * (M_states - 1))
            state_indices[i, :] = state
    
    elif pattern_type == 'checkerboard_2x2':
        # 2x2 checkerboard pattern
        state_indices = np.zeros((Ny, Nx))
        for i in range(Ny):
            for j in range(Nx):
                state_indices[i, j] = ((i // 2) + (j // 2)) % M_states
    
    elif pattern_type == 'checkerboard_4x4':
        # 4x4 checkerboard pattern
        state_indices = np.zeros((Ny, Nx))
        for i in range(Ny):
            for j in range(Nx):
                state_indices[i, j] = ((i // 4) + (j // 4)) % M_states
    
    elif pattern_type == 'stripes_horizontal':
        # Horizontal stripes
        state_indices = np.zeros((Ny, Nx))
        for i in range(Ny):
            state_indices[i, :] = i % M_states
    
    elif pattern_type == 'stripes_vertical':
        # Vertical stripes
        state_indices = np.zeros((Ny, Nx))
        for j in range(Nx):
            state_indices[:, j] = j % M_states
    
    else:
        # Default: all zeros
        state_indices = np.zeros((Ny, Nx))
    
    # Convert state indices to phase values
    phase_quantized = state_indices * phase_step
    # Convert to -180 to 180 range
    phase_quantized = np.mod(phase_quantized + 180, 360) - 180
    
    return phase_quantized


@app.route('/api/simulate_pattern', methods=['POST'])
def simulate_pattern():
    """
    Simulate metasurface with a specific coding pattern
    """
    try:
        params = request.json
        
        # Validate parameters
        required_params = ['N_bits', 'pattern_type', 'theta_inc', 'phi_inc', 'Nx', 'Ny']
        for param in required_params:
            if param not in params:
                return jsonify({'error': f'Missing parameter: {param}'}), 400
        
        N_bits = params['N_bits']
        pattern_type = params['pattern_type']
        theta_inc = params['theta_inc']
        phi_inc = params['phi_inc']
        Nx = params['Nx']
        Ny = params['Ny']
        
        # Constants
        freq = 10e9
        c = 3e8
        wavelength = c / freq
        k0 = 2 * np.pi / wavelength
        dx = wavelength / 2
        dy = wavelength / 2
        M_states = 2 ** N_bits
        
        # Generate array geometry
        x_pos = np.arange(-(Nx-1)/2, (Nx-1)/2 + 1) * dx
        y_pos = np.arange(-(Ny-1)/2, (Ny-1)/2 + 1) * dy
        X, Y = np.meshgrid(x_pos, y_pos)
        
        # Generate coding pattern
        phase_quantized_deg = generate_coding_pattern(pattern_type, N_bits, Nx, Ny)
        phase_quantized = np.deg2rad(phase_quantized_deg)
        
        # Calculate weights
        w_quantized = np.exp(-1j * phase_quantized)
        
        # Calculate array factors
        theta_range = np.arange(-80, 81, 1)
        phi_cuts = [0, 90]
        theta_rad = np.deg2rad(theta_range)
        phi_rad = np.deg2rad(phi_cuts)
        
        AF_quantized = np.zeros((len(phi_cuts), len(theta_range)), dtype=complex)
        
        for phi_idx, phi_current in enumerate(phi_rad):
            for theta_idx, theta_current in enumerate(theta_rad):
                phase_factor = k0 * (
                    X * np.sin(theta_current) * np.cos(phi_current) +
                    Y * np.sin(theta_current) * np.sin(phi_current)
                )
                AF_quantized[phi_idx, theta_idx] = np.sum(w_quantized * np.exp(1j * phase_factor))
        
        # Normalize and convert to dB
        AF_quantized = np.abs(AF_quantized) / np.max(np.abs(AF_quantized))
        AF_quantized_db = 20 * np.log10(AF_quantized + 1e-10)
        
        # Calculate performance metrics
        peak_idx_quant = np.argmax(AF_quantized, axis=1)
        theta_peak_quant = theta_range[peak_idx_quant]
        
        # Calculate sidelobe levels
        AF_quantized_flat = AF_quantized_db.flatten()
        max_quantized = np.max(AF_quantized_flat)
        sidelobe_level_quant = float(np.max(AF_quantized_flat[AF_quantized_flat < max_quantized - 3]))
        
        # Prepare results
        results = {
            'theta_range': theta_range.tolist(),
            'AF_quantized_db_eplane': AF_quantized_db[0, :].tolist(),
            'AF_quantized_db_hplane': AF_quantized_db[1, :].tolist(),
            'phase_quantized': phase_quantized_deg.tolist(),
            'sidelobe_level_quant': sidelobe_level_quant,
            'M_states': int(M_states),
            'theta_peak_quant': theta_peak_quant.tolist(),
            'pattern_type': pattern_type,
        }
        
        return jsonify(results)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Backend server is running'})


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5002))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    print("🚀 Starting Metasurface Simulator Backend Server...")
    print(f"📡 Server will run on http://localhost:{port}")
    print("🔗 Make sure React frontend is running on http://localhost:3000")
    app.run(debug=debug, host='0.0.0.0', port=port)

