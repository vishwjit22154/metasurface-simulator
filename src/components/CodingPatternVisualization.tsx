import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface CodingPatternVisualizationProps {
  phaseData: number[][];
  nBits: number;
  title: string;
}

const CodingPatternVisualization: React.FC<CodingPatternVisualizationProps> = ({
  phaseData,
  nBits,
  title,
}) => {
  const cols = phaseData[0]?.length || 0;
  const M_states = Math.pow(2, nBits);

  // Define discrete colors for different bit configurations
  // 2-bit: Yellow (00), Blue (01), Green (10), Red (11)
  // 3-bit: 8 distinct colors
  // 4-bit: 16 distinct colors
  const getColorForBits = (stateIndex: number): string => {
    const colors = {
      2: ['#FFEB3B', '#2196F3', '#4CAF50', '#F44336'], // Yellow, Blue, Green, Red
      3: ['#FFEB3B', '#FF9800', '#2196F3', '#00BCD4', '#4CAF50', '#8BC34A', '#F44336', '#E91E63'], // 8 colors
      4: [
        '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
        '#2196F3', '#03A9F4', '#00BCD4', '#009688',
        '#4CAF50', '#8BC34A', '#CDDC39', '#E91E63',
        '#F44336', '#9C27B0', '#673AB7', '#3F51B5'
      ] // 16 colors
    };
    
    const colorPalette = colors[nBits as keyof typeof colors] || colors[2];
    return colorPalette[stateIndex % colorPalette.length];
  };

  // Convert phase to discrete state index
  const phaseToStateIndex = (phase: number): number => {
    // Phase is in degrees, typically -180 to 180
    // Map to 0 to M_states-1
    const phaseShifted = (phase + 180) % 360; // 0 to 360
    const stateIndex = Math.floor((phaseShifted / 360) * M_states);
    return Math.min(stateIndex, M_states - 1);
  };

  // Generate bit string (00, 01, 10, 11, etc.)
  const getBitString = (stateIndex: number): string => {
    return stateIndex.toString(2).padStart(nBits, '0');
  };

  // Generate legend for bit states
  const generateLegend = () => {
    const states = [];
    for (let i = 0; i < M_states; i++) {
      states.push({
        index: i,
        bitString: getBitString(i),
        color: getColorForBits(i),
        phase: (i * 360 / M_states).toFixed(0) + '°'
      });
    }
    return states;
  };

  const legend = generateLegend();

  return (
    <Paper elevation={3} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
        {title}
      </Typography>
      
      {/* Coding Pattern Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '2px',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
          bgcolor: '#333',
          p: 1,
          borderRadius: 2,
          border: '2px solid #666',
          mt: 2,
        }}
      >
        {phaseData.map((row, i) =>
          row.map((phaseValue, j) => {
            const stateIndex = phaseToStateIndex(phaseValue);
            const bitString = getBitString(stateIndex);
            return (
              <Box
                key={`${i}-${j}`}
                sx={{
                  bgcolor: getColorForBits(stateIndex),
                  aspectRatio: '1',
                  border: '0.5px solid rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: cols <= 8 ? '10px' : '8px',
                  fontWeight: 'bold',
                  color: 'rgba(0,0,0,0.6)',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    zIndex: 10,
                    boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                  },
                  transition: 'transform 0.1s',
                }}
                title={`Element [${i},${j}]\nBit State: ${bitString}\nPhase: ${phaseValue.toFixed(1)}°`}
              >
                {cols <= 16 && bitString}
              </Box>
            );
          })
        )}
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          {nBits}-bit Coding States ({M_states} states):
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {legend.map((state) => (
            <Box
              key={state.index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                border: '1px solid #ccc',
                borderRadius: 1,
                p: 0.5,
                bgcolor: '#f5f5f5',
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: state.color,
                  border: '1px solid #333',
                  borderRadius: 0.5,
                }}
              />
              <Typography variant="caption" fontWeight="bold">
                {state.bitString}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ({state.phase})
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Info Box */}
      <Box
        sx={{
          mt: 2,
          p: 1.5,
          bgcolor: 'info.light',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'info.main',
        }}
      >
        <Typography variant="caption" fontWeight="bold">
          💡 Coding Pattern Info:
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
          Each colored square represents a metasurface element with a discrete phase state.
          {nBits}-bit quantization provides {M_states} distinct states (
          {nBits === 2 && '00, 01, 10, 11'}
          {nBits === 3 && '000, 001, 010, 011, 100, 101, 110, 111'}
          {nBits === 4 && '0000-1111'}
          ), each with {(360 / M_states).toFixed(0)}° phase spacing.
        </Typography>
      </Box>
    </Paper>
  );
};

export default CodingPatternVisualization;

