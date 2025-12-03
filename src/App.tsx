import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Zoom,
  Fade,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ParameterPanel from './components/ParameterPanel';
import ResultsVisualization from './components/ResultsVisualization';
import BitStateReference from './components/BitStateReference';
import './App.css';

const getLightTheme = () => createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

const getDarkTheme = () => createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
    },
    secondary: {
      main: '#f48fb1',
      light: '#ffc1e3',
      dark: '#bf5f82',
    },
    background: {
      default: '#0a1929',
      paper: '#132f4c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

export interface SimulationParams {
  N_bits: number;
  theta_steer: number;
  phi_steer: number;
  theta_inc: number;
  phi_inc: number;
  Nx: number;
  Ny: number;
}

export interface SimulationResults {
  theta_range: number[];
  AF_continuous_db_eplane: number[];
  AF_quantized_db_eplane: number[];
  AF_continuous_db_hplane: number[];
  AF_quantized_db_hplane: number[];
  phase_desired: number[][];
  phase_quantized: number[][];
  gain_loss_db: number;
  sidelobe_level_quant: number;
  pointing_error: number[];
  M_states: number;
  theta_peak_quant: number[];
}

function App() {
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentNBits, setCurrentNBits] = useState<number>(2);
  const [currentParams, setCurrentParams] = useState<SimulationParams | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState(0);

  const theme = darkMode ? getDarkTheme() : getLightTheme();

  const handleSimulate = async (params: SimulationParams) => {
    setLoading(true);
    setError(null);
    setProgress(0);
    setCurrentNBits(params.N_bits);
    setCurrentParams(params);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5002';
      const response = await fetch(`${apiUrl}/api/simulate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const data = await response.json();
      setProgress(100);
      setTimeout(() => {
        setResults(data);
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Simulation error:', err);
    } finally {
      clearInterval(progressInterval);
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        sx={{ 
          flexGrow: 1,
          minHeight: '100vh',
          background: darkMode 
            ? 'linear-gradient(135deg, #0a1929 0%, #132f4c 50%, #1e4976 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundAttachment: 'fixed',
        }}
      >
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{
            background: darkMode 
              ? 'rgba(19, 47, 76, 0.8)'
              : 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid',
            borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 700,
                background: darkMode
                  ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                  : 'linear-gradient(45deg, #fff 30%, #f8f9fa 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: darkMode ? 'none' : '0 2px 10px rgba(0,0,0,0.1)',
              }}
            >
              🛰️ Metasurface Simulator
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mr: 2,
                color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.9)',
              }}
            >
              N-Bit Phase Quantization
            </Typography>
            <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"} TransitionComponent={Zoom}>
              <IconButton 
                onClick={() => setDarkMode(!darkMode)} 
                color="inherit"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Toolbar>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ 
              bgcolor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)',
              '& .MuiTab-root': {
                fontWeight: 600,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.15)',
                },
              },
            }}
          >
            <Tab label="🎯 Beam Steering" />
            <Tab label="📊 Bit States" />
          </Tabs>
          {loading && (
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                backgroundColor: 'rgba(255,255,255,0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                },
              }}
            />
          )}
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          {/* Tab 0: Beam Steering Simulation */}
          <Fade in={activeTab === 0} timeout={500} unmountOnExit>
            <Box sx={{ display: activeTab === 0 ? 'flex' : 'none', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
              {/* Parameter Panel */}
              <Zoom in={activeTab === 0} timeout={600}>
                <Box sx={{ width: { xs: '100%', md: '25%' } }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3, 
                      height: '100%',
                      background: darkMode 
                        ? 'rgba(19, 47, 76, 0.6)'
                        : 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid',
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: darkMode 
                          ? '0 10px 40px rgba(0, 0, 0, 0.5)'
                          : '0 10px 40px rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    <ParameterPanel onSimulate={handleSimulate} loading={loading} />
                  </Paper>
                </Box>
              </Zoom>

              {/* Results Visualization */}
              <Zoom in={activeTab === 0} timeout={700}>
                <Box sx={{ width: { xs: '100%', md: '75%' } }}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 3,
                      background: darkMode 
                        ? 'rgba(19, 47, 76, 0.6)'
                        : 'rgba(255, 255, 255, 0.25)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid',
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: darkMode 
                          ? '0 10px 40px rgba(0, 0, 0, 0.5)'
                          : '0 10px 40px rgba(102, 126, 234, 0.3)',
                      },
                    }}
                  >
                    {error && (
                      <Fade in>
                        <Box 
                          sx={{ 
                            p: 3, 
                            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                            color: 'white', 
                            borderRadius: 2, 
                            mb: 2,
                            boxShadow: '0 4px 20px rgba(238, 90, 111, 0.3)',
                          }}
                        >
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            ⚠️ Error
                          </Typography>
                          <Typography variant="body1">
                            {error}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                            Make sure the backend server is running on http://localhost:5002
                          </Typography>
                        </Box>
                      </Fade>
                    )}

                    {loading && (
                      <Fade in>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                          <CircularProgress 
                            size={80} 
                            thickness={4}
                            sx={{
                              color: darkMode ? '#90caf9' : '#667eea',
                              mb: 3,
                            }}
                          />
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 600,
                              mb: 2,
                              background: darkMode
                                ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                                : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            🔄 Running Simulation
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                            Processing metasurface array calculations...
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                            {progress}% complete
                          </Typography>
                        </Box>
                      </Fade>
                    )}

                    {!loading && !results && !error && (
                      <Fade in>
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              mb: 2,
                              fontWeight: 700,
                              background: darkMode
                                ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
                                : 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}
                          >
                            ✨ Ready to Simulate
                          </Typography>
                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
                            Configure parameters on the left panel
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', opacity: 0.7 }}>
                            Adjust beam steering angles and quantization bits to analyze performance
                          </Typography>
                        </Box>
                      </Fade>
                    )}

                    {!loading && results && currentParams && (
                      <Fade in timeout={500}>
                        <Box>
                          <ResultsVisualization 
                            results={results} 
                            nBits={currentNBits}
                            simulationParams={{
                              theta_inc: currentParams.theta_inc,
                              phi_inc: currentParams.phi_inc,
                              theta_steer: currentParams.theta_steer,
                              phi_steer: currentParams.phi_steer,
                            }}
                          />
                        </Box>
                      </Fade>
                    )}
                  </Paper>
                </Box>
              </Zoom>
            </Box>
          </Fade>

          {/* Information Footer */}
          {activeTab === 0 && (
            <Fade in timeout={800}>
              <Box 
                sx={{ 
                  mt: 4, 
                  p: 3, 
                  background: darkMode 
                    ? 'rgba(19, 47, 76, 0.4)'
                    : 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateX(10px)',
                  },
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  💡 <strong>Pro Tip:</strong> Start with 1-bit quantization to see basic behavior, then increase to 2, 3, or 4 bits to observe performance improvements!
                </Typography>
              </Box>
            </Fade>
          )}

          {/* Tab 1: Bit State Reference */}
          <Fade in={activeTab === 1} timeout={500} unmountOnExit>
            <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
              <BitStateReference />
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
