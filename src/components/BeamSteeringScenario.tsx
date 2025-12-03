import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

interface BeamSteeringScenarioProps {
  theta_inc: number;
  phi_inc: number;
  theta_steer: number;
  phi_steer: number;
  theta_peak: number;
}

const BeamSteeringScenario: React.FC<BeamSteeringScenarioProps> = ({
  theta_inc,
  phi_inc,
  theta_steer,
  phi_steer,
  theta_peak,
}) => {
  const width = 900;
  const height = 500;
  const centerX = width / 2;
  const surfaceY = height / 2;
  const rayLength = 180;
  
  // Convert angles to radians
  const thetaIncRad = (theta_inc * Math.PI) / 180;
  const thetaSteerRad = (theta_steer * Math.PI) / 180;
  const thetaPeakRad = (theta_peak * Math.PI) / 180;
  
  // Metasurface surface endpoints
  const surfaceLeft = centerX - 250;
  const surfaceRight = centerX + 250;
  
  // Incident ray (coming from above TO the surface)
  const incidentEndX = centerX;
  const incidentEndY = surfaceY;
  const incidentStartX = centerX - Math.sin(thetaIncRad) * rayLength;
  const incidentStartY = surfaceY - Math.cos(thetaIncRad) * rayLength;
  
  // Desired reflected ray (FROM the surface)
  const desiredStartX = centerX;
  const desiredStartY = surfaceY;
  const desiredEndX = centerX + Math.sin(thetaSteerRad) * rayLength;
  const desiredEndY = surfaceY - Math.cos(thetaSteerRad) * rayLength;
  
  // Actual reflected ray (FROM the surface)
  const actualStartX = centerX;
  const actualStartY = surfaceY;
  const actualEndX = centerX + Math.sin(thetaPeakRad) * rayLength;
  const actualEndY = surfaceY - Math.cos(thetaPeakRad) * rayLength;
  
  // Surface normal (perpendicular to surface) - for reference
  const normalLength = 120;
  const normalEndX = centerX;
  const normalEndY = surfaceY - normalLength;

  return (
    <Paper elevation={3} sx={{ p: 3, border: '2px solid #1976d2' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center">
        🔬 Reflective Metasurface - 2D Cross-Section View (Plane of Incidence)
      </Typography>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <svg width={width} height={height} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', background: 'linear-gradient(to bottom, #e3f2fd 0%, #ffffff 50%, #f5f5f5 100%)' }}>
          <defs>
            {/* Arrow markers */}
            <marker id="arrowIncident" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#ff5722" />
            </marker>
            <marker id="arrowReflected" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#2196f3" />
            </marker>
            <marker id="arrowDesired" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#4caf50" />
            </marker>
          </defs>

          {/* Background - Plane of Incidence indicator */}
          <rect x="0" y="0" width={width} height={height} fill="url(#planeGradient)" opacity="0.1" />
          <defs>
            <linearGradient id="planeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff9c4" />
              <stop offset="50%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#fff9c4" />
            </linearGradient>
          </defs>

          {/* Metasurface Surface */}
          <g>
            {/* Main surface line */}
            <line 
              x1={surfaceLeft} 
              y1={surfaceY} 
              x2={surfaceRight} 
              y2={surfaceY}
              stroke="#37474f" 
              strokeWidth="6" 
            />
            
            {/* Array element indicators */}
            {Array.from({ length: 17 }).map((_, i) => {
              const x = surfaceLeft + (i * (surfaceRight - surfaceLeft) / 16);
              return (
                <g key={`element-${i}`}>
                  <rect 
                    x={x - 6} 
                    y={surfaceY - 3} 
                    width="12" 
                    height="6" 
                    fill="#1976d2" 
                    stroke="#0d47a1" 
                    strokeWidth="1"
                  />
                  <line 
                    x1={x} 
                    y1={surfaceY + 3} 
                    x2={x} 
                    y2={surfaceY + 15} 
                    stroke="#90a4ae" 
                    strokeWidth="1.5" 
                    strokeDasharray="2,2"
                  />
                </g>
              );
            })}
            
            {/* Surface label */}
            <text 
              x={centerX} 
              y={surfaceY + 40} 
              textAnchor="middle" 
              fontSize="14" 
              fontWeight="bold" 
              fill="#263238"
            >
              METASURFACE ARRAY (16×16 elements)
            </text>
          </g>

          {/* SURFACE NORMAL - Light gray dotted line for reference */}
          <line 
            x1={centerX} 
            y1={surfaceY} 
            x2={normalEndX} 
            y2={normalEndY}
            stroke="#757575" 
            strokeWidth="2" 
            strokeDasharray="3,6"
            opacity="0.5"
          />
          <text 
            x={normalEndX + 10} 
            y={normalEndY + 10} 
            fontSize="10" 
            fill="#757575"
            opacity="0.7"
          >
            ⊥ Normal
          </text>

          {/* INCIDENT RAY - Red (coming TO surface) */}
          <line 
            x1={incidentStartX} 
            y1={incidentStartY} 
            x2={incidentEndX} 
            y2={incidentEndY}
            stroke="#ff5722" 
            strokeWidth="5" 
            markerEnd="url(#arrowIncident)"
          />
          <circle 
            cx={incidentStartX} 
            cy={incidentStartY} 
            r="12" 
            fill="#ff5722" 
            stroke="#bf360c" 
            strokeWidth="3"
          />
          
          {/* Incident angle arc */}
          <path
            d={`M ${centerX} ${surfaceY - 60} A 60 60 0 0 ${theta_inc < 0 ? 1 : 0} ${centerX - Math.sin(thetaIncRad) * 60} ${surfaceY - Math.cos(thetaIncRad) * 60}`}
            fill="none"
            stroke="#ff5722"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
          <text 
            x={incidentStartX - 90} 
            y={incidentStartY} 
            fontSize="13" 
            fontWeight="bold" 
            fill="#ff5722"
          >
            INCIDENT
          </text>
          <text 
            x={incidentStartX - 90} 
            y={incidentStartY + 16} 
            fontSize="12" 
            fill="#d84315"
          >
            θᵢ = {theta_inc}°
          </text>

          {/* DESIRED REFLECTED RAY - Green dashed */}
          <line 
            x1={desiredStartX} 
            y1={desiredStartY} 
            x2={desiredEndX} 
            y2={desiredEndY}
            stroke="#ffffff" 
            strokeWidth="6" 
            strokeDasharray="12,8"
            opacity="0.7"
          />
          <line 
            x1={desiredStartX} 
            y1={desiredStartY} 
            x2={desiredEndX} 
            y2={desiredEndY}
            stroke="#4caf50" 
            strokeWidth="4" 
            strokeDasharray="12,8"
            markerEnd="url(#arrowDesired)"
          />
          <circle 
            cx={desiredEndX} 
            cy={desiredEndY} 
            r="10" 
            fill="#4caf50" 
            fillOpacity="0.3"
            stroke="#2e7d32" 
            strokeWidth="2"
            strokeDasharray="4,2"
          />
          
          {/* Desired angle arc */}
          <path
            d={`M ${centerX} ${surfaceY - 70} A 70 70 0 0 1 ${centerX + Math.sin(thetaSteerRad) * 70} ${surfaceY - Math.cos(thetaSteerRad) * 70}`}
            fill="none"
            stroke="#4caf50"
            strokeWidth="2"
            strokeDasharray="3,3"
          />
          <text 
            x={desiredEndX + 20} 
            y={desiredEndY - 10} 
            fontSize="13" 
            fontWeight="bold" 
            fill="#4caf50"
          >
            DESIRED
          </text>
          <text 
            x={desiredEndX + 20} 
            y={desiredEndY + 6} 
            fontSize="12" 
            fill="#2e7d32"
          >
            θᵣ = {theta_steer}°
          </text>

          {/* ACTUAL REFLECTED RAY - Blue solid */}
          <line 
            x1={actualStartX} 
            y1={actualStartY} 
            x2={actualEndX} 
            y2={actualEndY}
            stroke="#2196f3" 
            strokeWidth="5" 
            markerEnd="url(#arrowReflected)"
          />
          <circle 
            cx={actualEndX} 
            cy={actualEndY} 
            r="12" 
            fill="#2196f3" 
            stroke="#0d47a1" 
            strokeWidth="3"
          />
          
          {/* Actual angle arc */}
          <path
            d={`M ${centerX} ${surfaceY - 80} A 80 80 0 0 1 ${centerX + Math.sin(thetaPeakRad) * 80} ${surfaceY - Math.cos(thetaPeakRad) * 80}`}
            fill="none"
            stroke="#2196f3"
            strokeWidth="2"
          />
          <text 
            x={actualEndX + 20} 
            y={actualEndY + 30} 
            fontSize="13" 
            fontWeight="bold" 
            fill="#2196f3"
          >
            ACTUAL
          </text>
          <text 
            x={actualEndX + 20} 
            y={actualEndY + 46} 
            fontSize="12" 
            fill="#1565c0"
          >
            θ = {theta_peak.toFixed(1)}°
          </text>

          {/* Legend */}
          <g transform="translate(20, 20)">
            <rect x="0" y="0" width="200" height="130" fill="white" fillOpacity="0.95" stroke="#333" strokeWidth="2" rx="8" />
            <text x="100" y="18" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#333">
              Legend
            </text>
            
            <line x1="10" y1="35" x2="45" y2="35" stroke="#ff5722" strokeWidth="5" />
            <text x="52" y="39" fontSize="11" fill="#333">Incident Ray</text>
            
            <line x1="10" y1="55" x2="45" y2="55" stroke="#4caf50" strokeWidth="4" strokeDasharray="12,8" />
            <text x="52" y="59" fontSize="11" fill="#333">Desired Reflection</text>
            
            <line x1="10" y1="75" x2="45" y2="75" stroke="#2196f3" strokeWidth="5" />
            <text x="52" y="79" fontSize="11" fill="#333">Actual Reflection</text>
            
            <line x1="10" y1="95" x2="45" y2="95" stroke="#757575" strokeWidth="2" strokeDasharray="3,6" opacity="0.5" />
            <text x="52" y="99" fontSize="10" fill="#757575">Normal (ref)</text>
            
            <text x="10" y="120" fontSize="9" fontWeight="bold" fill="#666">
              ✓ All rays in same plane
            </text>
          </g>

          {/* Plane of incidence label */}
          <text 
            x={width - 20} 
            y={30} 
            textAnchor="end" 
            fontSize="11" 
            fontWeight="bold" 
            fill="#f57f17"
          >
            📐 Plane of Incidence (2D Cross-Section)
          </text>
        </svg>
      </Box>

      {/* Explanation */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 2 }}>
        <Chip 
          label={`Incident: θᵢ=${theta_inc}°, φᵢ=${phi_inc}°`} 
          color="warning" 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
        <Chip 
          label={`Desired: θᵣ=${theta_steer}°, φᵣ=${phi_steer}°`} 
          color="success" 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
        <Chip 
          label={`Actual: θ=${theta_peak.toFixed(1)}°`} 
          color="info" 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
        <Chip 
          label={`Error: ${Math.abs(theta_peak - theta_steer).toFixed(1)}°`} 
          color={Math.abs(theta_peak - theta_steer) < 2 ? 'success' : 'warning'}
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom>
          🔬 How Reflective Metasurface Works:
        </Typography>
        <Typography variant="body2" component="div">
          <ol style={{ marginTop: 4, marginBottom: 0, paddingLeft: 20 }}>
            <li><strong>Incident wave</strong> (red) arrives at the metasurface at angle θᵢ={theta_inc}°</li>
            <li><strong>Metasurface</strong> applies programmable phase shifts to each of the 16×16 elements</li>
            <li><strong>Desired reflection</strong> (green dashed) aims for angle θᵣ={theta_steer}°</li>
            <li><strong>Actual reflection</strong> (blue solid) achieves θ={theta_peak.toFixed(1)}° due to phase quantization</li>
            <li><strong>Pointing error:</strong> {Math.abs(theta_peak - theta_steer).toFixed(1)}° difference caused by limited phase states</li>
          </ol>
        </Typography>
      </Box>
      
      <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom color="error">
          ⚠️ Physics Principle - Plane of Incidence:
        </Typography>
        <Typography variant="body2">
          This 2D view shows the <strong>cross-section through the plane of incidence</strong> - the plane containing the 
          incident ray, reflected ray, and surface normal (light gray dotted line). All three lie in the same plane 
          (fundamental law of reflection). The surface normal is shown as a subtle reference line to help visualize 
          the angle measurements. This simplified representation makes it easy to understand how the metasurface 
          steers the beam by controlling phase gradients.
        </Typography>
      </Box>
    </Paper>
  );
};

export default BeamSteeringScenario;

