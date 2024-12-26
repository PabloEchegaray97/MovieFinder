import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';

const ActorSearch: React.FC = () => {
    return (
        <Box sx={{ 
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: 'background.default',
            padding: '2rem'
        }}>
            <Box sx={{
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center'
            }}>
                <PersonIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
                <Typography 
                    variant="h3" 
                    sx={{ 
                        color: 'text.primary',
                        fontWeight: 'bold',
                        mb: 2
                    }}
                >
                    Buscar personas
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: 'text.secondary',
                        mb: 4
                    }}
                >
                    Encuentra tus artistas favoritas, descubre sus películas y explora sus carreras
                </Typography>
                
                <TextField
                    fullWidth
                    placeholder="Buscar personas..."
                    variant="outlined"
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

                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    mt: 4
                }}>
                    {/* Aquí puedes agregar actores populares o sugerencias */}
                </Box>
            </Box>
        </Box>
    );
};

export default ActorSearch; 