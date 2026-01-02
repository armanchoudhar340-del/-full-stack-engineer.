import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Paper, Typography, Alert, Container, CircularProgress } from '@mui/material';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function ConsentCapture() {
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleAccept = async () => {
        if (!isChecked) return;
        setIsLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // For demo purposes, if no user is logged in, we might want to prompt login or handle this gracefully.
                // The requirement implies "Logged-in user", so let's assume we need auth.
                // For now, let's just error if not logged in.
                throw new Error('User not authenticated');
            }

            const { error: insertError } = await supabase.from('consents').insert({
                user_id: user.id,
                consent_type: 'terms_of_service',
                purpose: 'Required for accessing the application services.',
                policy_version: '1.0', // This could come from a config or props
                status: 'granted',
            });

            if (insertError) throw insertError;

            // Navigate to history or dashboard on success
            navigate('/profile/consents');

        } catch (err: any) {
            setError(err.message || 'Failed to record consent');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDecline = () => {
        // Requirement: "Prevent continuation without required consent"
        // So we might just show a message or logout.
        setError('You must accept the terms to proceed.');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Terms of Service
                </Typography>

                <Typography variant="body1">
                    Please review our terms of service. We collect data to improve your experience and ensure compliance with regulatory standards.
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    <a href="#" style={{ color: '#90caf9' }}>Read full Privacy Policy (v1.0)</a>
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="I have read and agree to the Terms of Service and Privacy Policy"
                />

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleDecline}
                        disabled={isLoading}
                    >
                        Decline
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAccept}
                        disabled={!isChecked || isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Accept & Continue'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
