import { useEffect, useState } from 'react';
import {
    Container, Paper, Typography, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, TextField,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { supabase } from '../lib/supabase';
import { Consent } from '../types';

export default function AdminDashboard() {
    const [consents, setConsents] = useState<Consent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterUser, setFilterUser] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchConsents();
    }, [filterStatus, filterUser]); // crude debouncing/refetching logic

    const fetchConsents = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('consents')
                .select('*')
                .order('created_at', { ascending: false });

            if (filterUser) {
                query = query.eq('user_id', filterUser);
            }
            if (filterStatus !== 'all') {
                query = query.eq('status', filterStatus);
            }

            const { data, error } = await query;

            if (error) throw error;
            setConsents(data || []);
        } catch (error) {
            console.error('Error fetching admin consents:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Compliance Dashboard
            </Typography>

            <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    label="Filter by User ID"
                    variant="outlined"
                    size="small"
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                    sx={{ width: 300 }}
                />
                <FormControl size="small" sx={{ width: 200 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={filterStatus}
                        label="Status"
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="granted">Granted</MenuItem>
                        <MenuItem value="revoked">Revoked</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>User ID</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Purpose</TableCell>
                            <TableCell>Version</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : consents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No records found.</TableCell>
                            </TableRow>
                        ) : (
                            consents.map((consent) => (
                                <TableRow key={consent.id}>
                                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                        {consent.id.slice(0, 8)}...
                                    </TableCell>
                                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                        {consent.user_id}
                                    </TableCell>
                                    <TableCell>{consent.consent_type}</TableCell>
                                    <TableCell>{consent.purpose}</TableCell>
                                    <TableCell>{consent.policy_version}</TableCell>
                                    <TableCell>{new Date(consent.created_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={consent.status}
                                            color={consent.status === 'granted' ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
