import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SimulationParams } from '../App';

interface ParameterPanelProps {
  onSimulate: (params: SimulationParams) => void;
  loading: boolean;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ onSimulate, loading }) => {
  const [params, setParams] = useState<SimulationParams>({
    N_bits: 1,
    theta_steer: 30,
    phi_steer: 45,
    theta_inc: 30,
    phi_inc: 45,
    Nx: 16,
    Ny: 16,
  });

  const handleChange = (field: keyof SimulationParams) => (
    event: any,
    value?: number | number[]
  ) => {
    const newValue = value !== undefined ? value : parseFloat(event.target.value);
    setParams({ ...params, [field]: newValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(params);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        ⚙️ Simulation Parameters
      </Typography>

      {/* Quantization Settings */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight="bold">
            📊 Quantization
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Number of Bits</InputLabel>
            <Select
              value={params.N_bits}
              label="Number of Bits"
              onChange={(e) => setParams({ ...params, N_bits: e.target.value as number })}
            >
              <MenuItem value={1}>1-bit (2 states)</MenuItem>
              <MenuItem value={2}>2-bit (4 states)</MenuItem>
              <MenuItem value={3}>3-bit (8 states)</MenuItem>
              <MenuItem value={4}>4-bit (16 states)</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="caption" color="text.secondary">
            {params.N_bits === 1 && '⚠️ Simple hardware, poor beam quality'}
            {params.N_bits === 2 && '⚡ Better performance, moderate complexity'}
            {params.N_bits === 3 && '✅ Good performance, practical choice'}
            {params.N_bits === 4 && '🎯 Excellent performance, near-ideal'}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Steering Angles */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight="bold">
            🎯 Steering Direction
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              θ<sub>steer</sub> (Elevation): {params.theta_steer}°
            </Typography>
            <Slider
              value={params.theta_steer}
              onChange={handleChange('theta_steer')}
              min={-80}
              max={80}
              step={5}
              marks={[
                { value: -80, label: '-80°' },
                { value: 0, label: '0°' },
                { value: 80, label: '80°' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography gutterBottom>
              φ<sub>steer</sub> (Azimuth): {params.phi_steer}°
            </Typography>
            <Slider
              value={params.phi_steer}
              onChange={handleChange('phi_steer')}
              min={0}
              max={360}
              step={15}
              marks={[
                { value: 0, label: '0°' },
                { value: 90, label: '90°' },
                { value: 180, label: '180°' },
                { value: 270, label: '270°' },
                { value: 360, label: '360°' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Incident Angles */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight="bold">
            📡 Incident Direction
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              θ<sub>inc</sub> (Elevation): {params.theta_inc}°
            </Typography>
            <Slider
              value={params.theta_inc}
              onChange={handleChange('theta_inc')}
              min={-80}
              max={80}
              step={5}
              marks={[
                { value: -80, label: '-80°' },
                { value: 0, label: '0°' },
                { value: 80, label: '80°' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography gutterBottom>
              φ<sub>inc</sub> (Azimuth): {params.phi_inc}°
            </Typography>
            <Slider
              value={params.phi_inc}
              onChange={handleChange('phi_inc')}
              min={0}
              max={360}
              step={15}
              marks={[
                { value: 0, label: '0°' },
                { value: 90, label: '90°' },
                { value: 180, label: '180°' },
                { value: 270, label: '270°' },
                { value: 360, label: '360°' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 2 }} />

      {/* Array Size */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" fontWeight="bold">
            🔲 Array Size
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            fullWidth
            label="Nx (Elements in X)"
            type="number"
            value={params.Nx}
            onChange={(e) => setParams({ ...params, Nx: parseInt(e.target.value) })}
            inputProps={{ min: 4, max: 32, step: 2 }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Ny (Elements in Y)"
            type="number"
            value={params.Ny}
            onChange={(e) => setParams({ ...params, Ny: parseInt(e.target.value) })}
            inputProps={{ min: 4, max: 32, step: 2 }}
          />

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Total elements: {params.Nx * params.Ny}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Box sx={{ mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          startIcon={<PlayArrowIcon />}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Simulating...' : 'Run Simulation'}
        </Button>
      </Box>

      {/* Quick Presets */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="caption" fontWeight="bold" gutterBottom display="block">
          ⚡ Quick Presets:
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setParams({ ...params, theta_inc: -30, theta_steer: 30, phi_steer: 0, phi_inc: 0 })}
          >
            Beam Steering (-30° → 30°)
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setParams({ ...params, theta_inc: 30, theta_steer: 30, phi_steer: 45, phi_inc: 45 })}
          >
            Retroreflection (30°, 45°)
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setParams({ ...params, theta_inc: 0, theta_steer: 45, phi_steer: 0, phi_inc: 0 })}
          >
            Side Steering (0° → 45°)
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ParameterPanel;

