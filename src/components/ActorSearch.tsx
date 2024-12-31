import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';

interface ActorSearchProps {
    onSearch: (type: string, query: string) => void;
}

const ActorSearch: React.FC<ActorSearchProps> = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const navigate = useNavigate();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            onSearch('person', searchQuery);
            navigate('/');
        }
    };

    return (
        <Box sx={{ minHeight: 'calc(100vh - 64px)', backgroundColor: 'background.default', padding: '2rem' }}>
            <Box sx={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
                    Buscar Actores
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                    Encuentra tus actores favoritos y descubre su filmografía
                </Typography>
                
                <TextField
                    fullWidth
                    placeholder="Buscar actores..."
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearch}
                    sx={{
                        mb: 4,
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'background.paper',
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
};

export default ActorSearch; 