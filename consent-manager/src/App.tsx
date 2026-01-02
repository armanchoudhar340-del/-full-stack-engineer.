import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import ConsentCapture from './components/ConsentCapture';
import ConsentHistory from './components/ConsentHistory';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';

const queryClient = new QueryClient();

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Navigate to="/consent" replace />} />
                            <Route path="consent" element={<ConsentCapture />} />
                            <Route path="profile/consents" element={<ConsentHistory />} />
                            <Route path="admin/consents" element={<AdminDashboard />} />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
