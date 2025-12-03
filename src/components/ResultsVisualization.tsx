import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
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
  ReferenceLine,
} from 'recharts';
import { SimulationResults } from '../App';
import CodingPatternVisualization from './CodingPatternVisualization';
import BeamSteeringScenario from './BeamSteeringScenario';

interface ResultsVisualizationProps {
  results: SimulationResults;
  nBits?: number;
  simulationParams?: {
    theta_inc: number;
    phi_inc: number;
    theta_steer: number;
    phi_steer: number;
  };
}

const ResultsVisualization: React.FC<ResultsVisualizationProps> = ({ results, nBits = 2, simulationParams }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Prepare data for E-plane chart
  const ePlaneData = results.theta_range.map((theta, index) => ({
    theta,
    ideal: results.AF_continuous_db_eplane[index],
    quantized: results.AF_quantized_db_eplane[index],
  }));

  // Prepare data for H-plane chart
  const hPlaneData = results.theta_range.map((theta, index) => ({
    theta,
    ideal: results.AF_continuous_db_hplane[index],
    quantized: results.AF_quantized_db_hplane[index],
  }));

  return (
    <Box>
      {/* Performance Metrics */}
      <Box sx={{ mb: 3 }}>
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom fontWeight="bold">
          📊 Simulation Results
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: { xs: 1, sm: 2 }, 
          mt: 1 
        }}>
          <Card sx={{ bgcolor: 'warning.light' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Gain Loss
              </Typography>
              <Typography variant={isMobile ? "body1" : "h6"} fontWeight="bold">
                {results.gain_loss_db.toFixed(2)} dB
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: 'error.light' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Sidelobe Level
              </Typography>
              <Typography variant={isMobile ? "body1" : "h6"} fontWeight="bold">
                {results.sidelobe_level_quant.toFixed(1)} dB
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: 'info.light' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                E-plane Error
              </Typography>
              <Typography variant={isMobile ? "body1" : "h6"} fontWeight="bold">
                {results.pointing_error[0].toFixed(1)}°
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: 'success.light' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                Phase States
              </Typography>
              <Typography variant={isMobile ? "body1" : "h6"} fontWeight="bold">
                {results.M_states} states
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Visual Scenario */}
      {simulationParams && (
        <Box sx={{ mb: 3 }}>
          <BeamSteeringScenario
            theta_inc={simulationParams.theta_inc}
            phi_inc={simulationParams.phi_inc}
            theta_steer={simulationParams.theta_steer}
            phi_steer={simulationParams.phi_steer}
            theta_peak={results.theta_peak_quant[0]}
          />
        </Box>
      )}

      {/* Radiation Patterns */}
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom fontWeight="bold">
          📊 Radiation Patterns
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 100%', minWidth: { xs: '100%', md: '45%' } }}>
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0' }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom fontWeight="bold">
              E-plane Pattern (φ=0°)
            </Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
              <LineChart data={ePlaneData} margin={{ top: 5, right: isMobile ? 10 : 20, left: isMobile ? 0 : 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="theta"
                  label={{ value: 'θ (degrees)', position: 'insideBottom', offset: -5, fontSize: isMobile ? 10 : 12 }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis
                  label={{ value: 'dB', angle: -90, position: 'insideLeft', fontSize: isMobile ? 10 : 12 }}
                  domain={[-40, 5]}
                  width={isMobile ? 35 : 60}
                  tickFormatter={(value) => `${value}`}
                  ticks={[-40, -20, 0]}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <ReferenceLine y={-3} stroke="green" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="ideal" stroke="#1976d2" strokeWidth={2} dot={false} name="Ideal" />
                <Line type="monotone" dataKey="quantized" stroke="#dc004e" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Quantized" />
              </LineChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip label={`Peak: ${results.theta_peak_quant[0].toFixed(1)}°`} size="small" color="primary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} />
              <Chip label={`Loss: ${results.gain_loss_db.toFixed(2)} dB`} size="small" color="warning" sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 100%', minWidth: { xs: '100%', md: '45%' } }}>
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0' }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom fontWeight="bold">
              H-plane Pattern (φ=90°)
            </Typography>
            <ResponsiveContainer width="100%" height={isMobile ? 220 : 300}>
              <LineChart data={hPlaneData} margin={{ top: 5, right: isMobile ? 10 : 20, left: isMobile ? 0 : 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="theta"
                  label={{ value: 'θ (degrees)', position: 'insideBottom', offset: -5, fontSize: isMobile ? 10 : 12 }}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <YAxis
                  label={{ value: 'dB', angle: -90, position: 'insideLeft', fontSize: isMobile ? 10 : 12 }}
                  domain={[-40, 5]}
                  width={isMobile ? 35 : 60}
                  tickFormatter={(value) => `${value}`}
                  ticks={[-40, -20, 0]}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                <ReferenceLine y={-3} stroke="green" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="ideal" stroke="#1976d2" strokeWidth={2} dot={false} name="Ideal" />
                <Line type="monotone" dataKey="quantized" stroke="#dc004e" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Quantized" />
              </LineChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              <Chip label={`Peak: ${results.theta_peak_quant[1].toFixed(1)}°`} size="small" color="primary" sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} />
              <Chip label={`Sidelobe: ${results.sidelobe_level_quant.toFixed(1)} dB`} size="small" color="error" sx={{ fontSize: { xs: '0.7rem', sm: '0.8125rem' } }} />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Phase Distributions */}
      <Box sx={{ display: 'flex', gap: { xs: 2, sm: 3 }, flexWrap: 'wrap', mt: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ flex: '1 1 100%', minWidth: { xs: '100%', md: '45%' } }}>
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0' }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom fontWeight="bold" color="primary">
              Ideal Phase Distribution
            </Typography>
            <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto', mt: 1 }}>
              <PhaseHeatmap data={results.phase_desired} title="Continuous Phase" />
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: '1 1 100%', minWidth: { xs: '100%', md: '45%' } }}>
          <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0' }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom fontWeight="bold" color="primary">
              Quantized Phase ({results.M_states} States)
            </Typography>
            <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto', mt: 1 }}>
              <PhaseHeatmap data={results.phase_quantized} title="Quantized Phase" />
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Discrete Coding Pattern Visualization */}
      <Box sx={{ mt: { xs: 2, sm: 3 } }}>
        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
          🎨 Discrete Coding Pattern Representation
        </Typography>
        <CodingPatternVisualization
          phaseData={results.phase_quantized}
          nBits={nBits}
          title={`${nBits}-bit Digital Metasurface Coding Pattern`}
        />
      </Box>

      {/* Performance Analysis */}
      <Box sx={{ mt: { xs: 2, sm: 3 }, p: { xs: 1.5, sm: 2 }, bgcolor: 'info.light', borderRadius: 2, border: '2px solid', borderColor: 'info.main' }}>
        <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          📈 Performance Analysis:
        </Typography>
        <Typography variant="body2" component="div" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
          <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: isMobile ? 16 : 24 }}>
            <li>
              <strong>Pointing Accuracy:</strong> E-plane error is {results.pointing_error[0].toFixed(1)}°, 
              H-plane error is {results.pointing_error[1].toFixed(1)}°
            </li>
            <li>
              <strong>Beam Quality:</strong> {
                results.sidelobe_level_quant > -10
                  ? '⚠️ High sidelobes - poor directivity'
                  : results.sidelobe_level_quant > -20
                  ? '⚡ Moderate sidelobes - acceptable'
                  : '✅ Low sidelobes - excellent directivity'
              }
            </li>
            <li>
              <strong>Quantization Impact:</strong> {results.gain_loss_db.toFixed(2)} dB loss due to {results.M_states}-state quantization
            </li>
          </ul>
        </Typography>
      </Box>
    </Box>
  );
};

// Simple heatmap component for phase distributions
const PhaseHeatmap: React.FC<{ data: number[][]; title: string }> = ({ data, title }) => {
  const cols = data[0]?.length || 0;

  // Use fixed range for consistent color mapping between ideal and quantized
  // Phase is in degrees, typically -180 to 180
  const min = -180;
  const max = 180;

  const getColor = (value: number) => {
    // Normalize to 0-1 range using fixed min/max
    const normalized = (value - min) / (max - min);
    const hue = normalized * 300; // HSV hue from 0 (red) to 300 (magenta)
    return `hsl(${hue}, 100%, 50%)`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '1px',
          width: '100%',
          aspectRatio: '1',
          bgcolor: '#333',
          p: 1,
          borderRadius: 2,
          border: '2px solid #666',
        }}
      >
        {data.map((row, i) =>
          row.map((value, j) => (
            <Box
              key={`${i}-${j}`}
              sx={{
                bgcolor: getColor(value),
                aspectRatio: '1',
                border: '0.5px solid rgba(0,0,0,0.2)',
              }}
              title={`Element [${i},${j}]: ${value.toFixed(1)}°`}
            />
          ))
        )}
      </Box>
      
      {/* Color Scale Legend */}
      <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
        <Typography variant="caption" fontWeight="bold" display="block" textAlign="center" sx={{ mb: 1 }}>
          Phase Color Scale
        </Typography>
        <Box sx={{ display: 'flex', height: '20px', borderRadius: 1, overflow: 'hidden', border: '1px solid #666' }}>
          {Array.from({ length: 100 }).map((_, i) => {
            const phaseValue = min + (i / 99) * (max - min);
            return (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  bgcolor: getColor(phaseValue),
                }}
              />
            );
          })}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
          <Typography variant="caption">{min}°</Typography>
          <Typography variant="caption">0°</Typography>
          <Typography variant="caption">{max}°</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ResultsVisualization;
