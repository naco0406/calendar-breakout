'use client';

import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode, useMemo } from 'react';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
          primary: {
            main: '#1a73e8',
            dark: '#1557b0',
            light: '#4285f4',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#ea4335',
            dark: '#d33b2c',
            light: '#ff6659',
            contrastText: '#ffffff',
          },
          error: {
            main: '#ea4335',
          },
          warning: {
            main: '#fbbc04',
          },
          success: {
            main: '#34a853',
          },
          background: {
            default: '#f8f9fa',
            paper: '#ffffff',
          },
          text: {
            primary: '#3c4043',
            secondary: '#5f6368',
            disabled: '#9aa0a6',
          },
          divider: '#dadce0',
          action: {
            hover: 'rgba(60, 64, 67, 0.08)',
            selected: 'rgba(26, 115, 232, 0.12)',
            disabled: 'rgba(60, 64, 67, 0.26)',
          },
        },
        typography: {
          fontFamily: '"Google Sans", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h1: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 700,
            fontSize: '2.25rem',
            lineHeight: 1.2,
          },
          h2: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 600,
            fontSize: '1.75rem',
            lineHeight: 1.3,
          },
          h3: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 600,
            fontSize: '1.5rem',
            lineHeight: 1.3,
          },
          h4: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 500,
            fontSize: '1.25rem',
            lineHeight: 1.4,
          },
          h5: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 500,
            fontSize: '1.125rem',
            lineHeight: 1.4,
          },
          h6: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.4,
          },
          body1: {
            fontFamily: '"Roboto", sans-serif',
            fontSize: '0.875rem',
            lineHeight: 1.6,
          },
          body2: {
            fontFamily: '"Roboto", sans-serif',
            fontSize: '0.8125rem',
            lineHeight: 1.5,
          },
          button: {
            fontFamily: '"Google Sans", sans-serif',
            fontWeight: 500,
            textTransform: 'none',
            fontSize: '0.875rem',
          },
        },
        shape: {
          borderRadius: 8,
        },
        spacing: 8,
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
                fontFamily: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              },
              '*': {
                boxSizing: 'border-box',
              },
              '*:focus-visible': {
                outline: '2px solid #1a73e8',
                outlineOffset: '2px',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 24,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
                },
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: 'rgba(60, 64, 67, 0.08)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontFamily: '"Google Sans", sans-serif',
                fontWeight: 500,
              },
            },
          },
        },
      }),
    []
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;