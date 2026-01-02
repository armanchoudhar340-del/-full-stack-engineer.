import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Standard MUI Blue, clean and professional
        },
        secondary: {
            main: '#dc004e', // Standard MUI Pink/Red for actions
        },
        background: {
            default: '#f5f5f5', // Light gray background for better contrast
        },
    },
    typography: {
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600,
            marginBottom: '1rem',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            marginBottom: '0.8rem',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // More readable, less shouty
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    padding: '16px',
                    borderRadius: 12,
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                },
            },
        },
    },
});
