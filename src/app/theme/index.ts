import { createTheme, ThemeOptions } from '@mui/material/styles';

// Material 3 Expressive theme for non-coders
// Soft corners, generous spacing, friendly colors
const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#6750A4', // Material 3 primary purple
      light: '#D0BCFF',
      dark: '#4F378B',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#625B71', // Material 3 secondary
      light: '#E7DEF0',
      dark: '#49454F',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFBFE', // Very light background
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1B1F',
      secondary: '#49454F',
    },
    error: {
      main: '#BA1A1A',
    },
    warning: {
      main: '#7D5700',
    },
    success: {
      main: '#146C2E',
    },
    info: {
      main: '#006495',
    },
  },
  shape: {
    borderRadius: 16, // Soft, friendly corners
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 400,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    button: {
      textTransform: 'none', // More friendly for non-coders
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Extra rounded for friendly feel
          padding: '10px 24px',
          fontSize: '0.875rem',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(103, 80, 164, 0.2)',
          },
        },
        contained: {
          boxShadow: '0 2px 8px rgba(103, 80, 164, 0.15)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default gradient
          borderRadius: 0,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        elevation3: {
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#6750A4',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 48,
        },
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          minHeight: 48,
          padding: '12px 24px',
        },
      },
    },
  },
  spacing: 8, // Base spacing unit
};

export const theme = createTheme(themeOptions);

export default theme;
