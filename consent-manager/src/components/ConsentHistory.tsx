import { useEffect, useState } from 'react';
import {
    Container, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText
} from '@mui/material';
import { supabase } from '../lib/supabase';
import { Consent } from '../types';


export default function ConsentHistory() {
    const [consents, setConsents] = useState<Consent[]>([]);
    const [loading, setLoading] = useState(true);
    const [revokeId, setRevokeId] = useState<string | null>(null);

    useEffect(() => {
        fetchConsents();
    }, []);

    const fetchConsents = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('consents')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setConsents(data || []);
        } catch (error) {
            console.error('Error fetching consents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeClick = (id: string) => {
        setRevokeId(id);
    };

    const confirmRevoke = async () => {
        if (!revokeId) return;

        try {
            const { error } = await supabase
                .from('consents')
                .update({
                    status: 'revoked',
                    revoked_at: new Date().toISOString()
                })
                .eq('id', revokeId);

            if (error) throw error;

            // Refresh list
            await fetchConsents();
        } catch (error) {
            console.error('Error revoking consent:', error);
        } finally {
            setRevokeId(null);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Consents
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Purpose</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Date Given</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : consents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">No consent history found.</TableCell>
                            </TableRow>
                        ) : (
                            consents.map((consent) => (
                                <TableRow key={consent.id}>
                                    <TableCell>{consent.purpose}</TableCell>
                                    <TableCell>{consent.consent_type}</TableCell>
                                    <TableCell>{consent.policy_version}</TableCell>
                                    <TableCell>{new Date(consent.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={consent.status}
                                            color={consent.status === 'granted' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {consent.status === 'granted' && (
                                            <Button
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                onClick={() => handleRevokeClick(consent.id)}
                                            >
                                                Revoke
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={!!revokeId} onClose={() => setRevokeId(null)}>
                <DialogTitle>Revoke Consent?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to withdraw your consent? This may limit your access to certain services.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRevokeId(null)}>Cancel</Button>
                    <Button onClick={confirmRevoke} color="error" autoFocus>
                        Revoke
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
