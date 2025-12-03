import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import CodingPatternVisualization from './CodingPatternVisualization';

interface PatternResult {
  pattern_type: string;
  phase_quantized: number[][];
  AF_quantized_db_eplane: number[];
  AF_quantized_db_hplane: number[];
  theta_range: number[];
  theta_peak_quant: number[];
  sidelobe_level_quant: number;
}

const CodingSequenceGallery: React.FC = () => {
  const [nBits, setNBits] = useState<number>(2);
  const [arraySize, setArraySize] = useState<number>(16);
  const [patterns, setPatterns] = useState<PatternResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const patternTypes = {
    2: ['uniform_00', 'uniform_01', 'uniform_10', 'uniform_11', 'gradient_x', 'gradient_y', 'checkerboard_2x2'],
    3: ['uniform_00', 'uniform_01', 'gradient_x', 'gradient_y', 'checkerboard_2x2', 'checkerboard_4x4'],
    4: ['uniform_00', 'gradient_x', 'gradient_y', 'checkerboard_2x2', 'checkerboard_4x4', 'stripes_horizontal', 'stripes_vertical'],
  };

  const patternNames = {
    uniform_00: '00 - Uniform State 0',
    uniform_01: '01 - Uniform State 1',
    uniform_10: '10 - Uniform State 2',
    uniform_11: '11 - Uniform State 3',
    gradient_x: 'Gradient X',
    gradient_y: 'Gradient Y',
    checkerboard_2x2: 'Checkerboard 2×2',
    checkerboard_4x4: 'Checkerboard 4×4',
    stripes_horizontal: 'Horizontal Stripes',
    stripes_vertical: 'Vertical Stripes',
  };

  const generatePatterns = async () => {
    setLoading(true);
    setPatterns([]);

    const patternsToGenerate = patternTypes[nBits as keyof typeof patternTypes] || patternTypes[2];

    try {
      const results: PatternResult[] = [];
      
      for (const patternType of patternsToGenerate) {
        const response = await fetch('http://localhost:5002/api/simulate_pattern', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            N_bits: nBits,
            pattern_type: patternType,
            theta_inc: 0,
            phi_inc: 0,
            Nx: arraySize,
            Ny: arraySize,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          results.push(data);
        }
      }

      setPatterns(results);
    } catch (error) {
      console.error('Error generating patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generatePatterns();
  }, [nBits, arraySize]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🎨 Digitally-Controlled Coding Metasurface Gallery
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Explore different {nBits}-bit coding sequences and their far-field radiation patterns
      </Typography>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, my: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>N-bits</InputLabel>
          <Select value={nBits} label="N-bits" onChange={(e) => setNBits(Number(e.target.value))}>
            <MenuItem value={2}>2-bit (4 states)</MenuItem>
            <MenuItem value={3}>3-bit (8 states)</MenuItem>
            <MenuItem value={4}>4-bit (16 states)</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Array Size</InputLabel>
          <Select value={arraySize} label="Array Size" onChange={(e) => setArraySize(Number(e.target.value))}>
            <MenuItem value={8}>8×8</MenuItem>
            <MenuItem value={16}>16×16</MenuItem>
            <MenuItem value={24}>24×24</MenuItem>
            <MenuItem value={32}>32×32</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={generatePatterns} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Regenerate Patterns'}
        </Button>
      </Box>

      {/* Pattern Gallery */}
      {loading && (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Generating coding patterns...
          </Typography>
        </Box>
      )}

      {!loading && patterns.length > 0 && (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
          {patterns.map((pattern, index) => {
            const chartData = pattern.theta_range.map((theta, idx) => ({
              theta,
              eplane: pattern.AF_quantized_db_eplane[idx],
              hplane: pattern.AF_quantized_db_hplane[idx],
            }));

            return (
              <Box key={index}>
                <Paper elevation={4} sx={{ p: 2, height: '100%', border: '2px solid #1976d2' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                    {patternNames[pattern.pattern_type as keyof typeof patternNames] || pattern.pattern_type}
                  </Typography>

                  {/* Coding Pattern */}
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${arraySize}, 1fr)`,
                        gap: '1px',
                        bgcolor: '#333',
                        p: 0.5,
                        borderRadius: 1,
                        border: '2px solid #666',
                        maxWidth: '300px',
                        margin: '0 auto',
                      }}
                    >
                      {pattern.phase_quantized.map((row, i) =>
                        row.map((phaseValue, j) => {
                          const M_states = Math.pow(2, nBits);
                          const phaseShifted = (phaseValue + 180) % 360;
                          const stateIndex = Math.floor((phaseShifted / 360) * M_states);
                          const colors = {
                            2: ['#FFEB3B', '#2196F3', '#4CAF50', '#F44336'],
                            3: ['#FFEB3B', '#FF9800', '#2196F3', '#00BCD4', '#4CAF50', '#8BC34A', '#F44336', '#E91E63'],
                            4: [
                              '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
                              '#2196F3', '#03A9F4', '#00BCD4', '#009688',
                              '#4CAF50', '#8BC34A', '#CDDC39', '#E91E63',
                              '#F44336', '#9C27B0', '#673AB7', '#3F51B5',
                            ],
                          };
                          const colorPalette = colors[nBits as keyof typeof colors] || colors[2];
                          const color = colorPalette[stateIndex % colorPalette.length];

                          return (
                            <Box
                              key={`${i}-${j}`}
                              sx={{
                                bgcolor: color,
                                aspectRatio: '1',
                                border: '0.5px solid rgba(0,0,0,0.2)',
                              }}
                            />
                          );
                        })
                      )}
                    </Box>
                  </Box>

                  {/* 3D Radiation Pattern Representation (2D plot) */}
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Far-Field Pattern
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="theta"
                        label={{ value: 'θ (°)', position: 'insideBottom', offset: -5 }}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis
                        label={{ value: 'Gain (dB)', angle: -90, position: 'insideLeft', style: { fontSize: 10 } }}
                        domain={[-40, 5]}
                        tick={{ fontSize: 10 }}
                        width={40}
                      />
                      <Tooltip />
                      <Line type="monotone" dataKey="eplane" stroke="#dc004e" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>

                  {/* Metrics */}
                  <Box sx={{ mt: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    <Typography variant="caption" display="block">
                      <strong>Peak:</strong> E={pattern.theta_peak_quant[0].toFixed(1)}°, H={pattern.theta_peak_quant[1].toFixed(1)}°
                    </Typography>
                    <Typography variant="caption" display="block">
                      <strong>Sidelobe:</strong> {pattern.sidelobe_level_quant.toFixed(1)} dB
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Information */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 2, border: '2px solid', borderColor: 'info.main' }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          📚 About Coding Metasurfaces:
        </Typography>
        <Typography variant="body2" component="div">
          <ul style={{ marginTop: 8, marginBottom: 0 }}>
            <li>
              <strong>Uniform Patterns (00, 01, 10, 11):</strong> All elements in the same state produce simple beam patterns
            </li>
            <li>
              <strong>Gradient Patterns:</strong> Linear phase progression enables beam steering
            </li>
            <li>
              <strong>Checkerboard Patterns:</strong> Create multiple beams or beam splitting effects
            </li>
            <li>
              <strong>Stripe Patterns:</strong> Produce periodic far-field patterns with grating lobes
            </li>
          </ul>
        </Typography>
      </Box>
    </Box>
  );
};

export default CodingSequenceGallery;

