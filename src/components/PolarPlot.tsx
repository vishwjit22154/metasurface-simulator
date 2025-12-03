import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

interface PolarPlotProps {
  theta: number[]; // angles in degrees
  gain_db: number[]; // gain values in dB
  title: string;
  color?: string;
  steeringAngle?: number;
}

const PolarPlot: React.FC<PolarPlotProps> = ({ 
  theta, 
  gain_db, 
  title, 
  color = '#2196F3',
  steeringAngle 
}) => {
  const width = 400;
  const height = 400;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 40;

  // Check if we have valid data
  const maxGainInData = Math.max(...gain_db);
  const minGainInData = Math.min(...gain_db);
  const hasValidData = isFinite(maxGainInData) && isFinite(minGainInData);

  // Normalize gain to radius (map dB range to radius)
  const minGain = -40; // minimum dB shown
  const maxGain = 5; // maximum dB shown
  
  const gainToRadius = (gain: number) => {
    const normalized = (gain - minGain) / (maxGain - minGain);
    return Math.max(0, Math.min(1, normalized)) * maxRadius;
  };

  // Convert polar coordinates (theta in degrees, radius in pixels) to cartesian
  const polarToCartesian = (angleDeg: number, radius: number) => {
    // In standard polar plot, 0° is at top (12 o'clock), angles increase clockwise
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(angleRad),
      y: centerY + radius * Math.sin(angleRad)
    };
  };

  // Create path for the radiation pattern
  const createPath = () => {
    if (theta.length === 0) return '';
    
    const points = theta.map((angle, i) => {
      const radius = gainToRadius(gain_db[i]);
      return polarToCartesian(angle, radius);
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    path += ' Z'; // Close the path
    return path;
  };

  // Create concentric circles for gain levels
  const gainCircles = [-40, -30, -20, -10, 0];
  
  // Create radial lines every 30 degrees
  const radialLines = [];
  for (let angle = 0; angle < 360; angle += 30) {
    const outer = polarToCartesian(angle, maxRadius);
    radialLines.push(
      <line
        key={`radial-${angle}`}
        x1={centerX}
        y1={centerY}
        x2={outer.x}
        y2={outer.y}
        stroke="#ddd"
        strokeWidth="1"
      />
    );
  }

  // Create angle labels
  const angleLabels = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <Paper elevation={3} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center">
        {title}
      </Typography>
      {steeringAngle !== undefined && (
        <Typography variant="body2" color="primary" textAlign="center" sx={{ mb: 1 }}>
          Steering Angle: {steeringAngle.toFixed(1)}°
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <svg width={width} height={height} style={{ overflow: 'visible' }}>
          {/* Draw concentric circles for gain levels */}
          {gainCircles.map((gain) => {
            const radius = gainToRadius(gain);
            return (
              <g key={`circle-${gain}`}>
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke="#ddd"
                  strokeWidth="1"
                  strokeDasharray={gain === 0 ? '5,5' : 'none'}
                />
                {/* Gain label */}
                <text
                  x={centerX + 5}
                  y={centerY - radius - 5}
                  fontSize="10"
                  fill="#666"
                  textAnchor="start"
                >
                  {gain} dB
                </text>
              </g>
            );
          })}

          {/* Draw radial lines */}
          {radialLines}

          {/* Draw angle labels */}
          {angleLabels.map((angle) => {
            const labelPos = polarToCartesian(angle, maxRadius + 20);
            let displayAngle = angle;
            // Convert to -180 to 180 range for display
            if (displayAngle > 180) displayAngle -= 360;
            
            return (
              <text
                key={`label-${angle}`}
                x={labelPos.x}
                y={labelPos.y}
                fontSize="12"
                fill="#333"
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight="bold"
              >
                {displayAngle}°
              </text>
            );
          })}

          {/* Draw the radiation pattern */}
          <path
            d={createPath()}
            fill={color}
            fillOpacity="0.3"
            stroke={color}
            strokeWidth="2.5"
          />

          {/* Draw center point */}
          <circle cx={centerX} cy={centerY} r="3" fill="#333" />
        </svg>
      </Box>

      {/* Legend */}
      <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1, textAlign: 'center' }}>
        <Typography variant="caption" display="block">
          <strong>Polar Radiation Pattern</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Radial axis: Gain (dB) | Angular axis: Angle (degrees)
        </Typography>
        {hasValidData && (
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            Peak Gain: {maxGainInData.toFixed(1)} dB | Min: {minGainInData.toFixed(1)} dB
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default PolarPlot;

