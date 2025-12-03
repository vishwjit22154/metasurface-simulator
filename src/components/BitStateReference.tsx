import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';

const BitStateReference: React.FC = () => {
  const [nBits, setNBits] = useState<number>(2);
  const [arraySize, setArraySize] = useState<number>(8);

  const M_states = Math.pow(2, nBits);

  // Color palettes
  const getColorForBits = (stateIndex: number): string => {
    const colors = {
      2: ['#FFEB3B', '#2196F3', '#4CAF50', '#F44336'], // Yellow, Blue, Green, Red
      3: ['#FFEB3B', '#FF9800', '#2196F3', '#00BCD4', '#4CAF50', '#8BC34A', '#F44336', '#E91E63'],
      4: [
        '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688',
        '#4CAF50', '#8BC34A', '#CDDC39', '#E91E63',
        '#F44336', '#9C27B0', '#673AB7', '#3F51B5'
      ]
    };
    const colorPalette = colors[nBits as keyof typeof colors] || colors[2];
    return colorPalette[stateIndex % colorPalette.length];
  };

  // Generate bit string
  const getBitString = (stateIndex: number): string => {
    return stateIndex.toString(2).padStart(nBits, '0');
  };

  // Generate all states
  const states = [];
  for (let i = 0; i < M_states; i++) {
    states.push({
      index: i,
      bitString: getBitString(i),
      color: getColorForBits(i),
      phase: (i * 360 / M_states).toFixed(0) + '°'
    });
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        📚 Software Controlled Metasurface - Bit State Reference
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
        Understanding {nBits}-bit digital coding: Each bit pattern represents a discrete phase state for software-controlled beam steering
      </Typography>

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
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
            <MenuItem value={4}>4×4</MenuItem>
            <MenuItem value={8}>8×8</MenuItem>
            <MenuItem value={16}>16×16</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Bit State Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {states.map((state) => (
          <Paper 
            key={state.index} 
            elevation={3} 
            sx={{ 
              p: 2, 
              border: '2px solid #1976d2',
              bgcolor: '#fafafa'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Chip 
                label={`State ${state.index}`} 
                color="primary" 
                sx={{ fontWeight: 'bold', fontSize: '0.9rem', mb: 1 }}
              />
              <Typography variant="h5" fontWeight="bold" sx={{ fontFamily: 'monospace', mb: 0.5 }}>
                {state.bitString}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phase: {state.phase}
              </Typography>
            </Box>

            {/* Uniform Pattern Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${arraySize}, 1fr)`,
                gap: '1px',
                bgcolor: '#333',
                p: 0.5,
                borderRadius: 1,
                border: '2px solid #666',
                aspectRatio: '1',
                maxWidth: '250px',
                margin: '0 auto',
              }}
            >
              {Array.from({ length: arraySize * arraySize }).map((_, idx) => (
                <Box
                  key={idx}
                  sx={{
                    bgcolor: state.color,
                    aspectRatio: '1',
                    border: '0.5px solid rgba(0,0,0,0.2)',
                  }}
                />
              ))}
            </Box>

            {/* Description */}
            <Box sx={{ mt: 2, p: 1, bgcolor: 'rgba(25, 118, 210, 0.08)', borderRadius: 1 }}>
              <Typography variant="caption" display="block" textAlign="center">
                All elements in state <strong>{state.bitString}</strong>
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Educational Info */}
      <Paper sx={{ mt: 4, p: 3, bgcolor: 'info.light', border: '2px solid', borderColor: 'info.main' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          💡 Understanding {nBits}-bit Digital Coding
        </Typography>
        <Typography variant="body2" component="div">
          <ul style={{ marginTop: 8, marginBottom: 8 }}>
            <li>
              <strong>Number of states:</strong> {M_states} discrete phase values ({nBits} bits = 2^{nBits} = {M_states} states)
            </li>
            <li>
              <strong>Phase resolution:</strong> {(360 / M_states).toFixed(1)}° between each state
            </li>
            <li>
              <strong>Binary representation:</strong> Each element can be in one of {M_states} states (
              {states.map(s => s.bitString).join(', ')})
            </li>
            <li>
              <strong>Color coding:</strong> Each color represents a unique bit pattern for easy visualization
            </li>
          </ul>
        </Typography>

        <Box sx={{ mt: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Example: {nBits === 2 ? '2-bit System' : nBits === 3 ? '3-bit System' : '4-bit System'}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {states.map((state) => (
              <Box
                key={state.index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  p: 0.5,
                  bgcolor: '#fff',
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: state.color,
                    border: '2px solid #333',
                    borderRadius: 0.5,
                  }}
                />
                <Box>
                  <Typography variant="caption" fontWeight="bold" display="block" sx={{ fontFamily: 'monospace' }}>
                    {state.bitString}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {state.phase}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Application Note */}
      <Paper sx={{ mt: 3, p: 2, bgcolor: 'success.light', border: '1px solid', borderColor: 'success.main' }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          🎯 How to Use This Information:
        </Typography>
        <Typography variant="body2">
          In a real metasurface, you can program each element to any of these {M_states} states. 
          By choosing different combinations across the array, you can:
          <strong> steer beams, split beams, or create custom radiation patterns.</strong>
          {' '}The patterns shown above are uniform (all elements the same), but you can mix different 
          states across the array for complex beam shaping.
        </Typography>
      </Paper>
    </Box>
  );
};

export default BitStateReference;

