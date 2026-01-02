import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Consent Manager
                    </Typography>
                    <Button color="inherit" component={Link} to="/consent">Capture</Button>
                    <Button color="inherit" component={Link} to="/profile/consents">History</Button>
                    <Button color="inherit" component={Link} to="/admin/consents">Admin</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 2 }}>
                <Outlet />
            </Box>
        </Box>
    );
}
