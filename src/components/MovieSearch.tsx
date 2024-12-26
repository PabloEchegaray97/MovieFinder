import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MovieIcon from '@mui/icons-material/Movie';

const MovieSearch: React.FC = () => {
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
                <MovieIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography 
                    variant="h3" 
                    sx={{ 
                        color: 'text.primary',
                        fontWeight: 'bold',
                        mb: 2
                    }}
                >
                    Buscar Películas
                </Typography>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: 'text.secondary',
                        mb: 4
                    }}
                >
                    Encuentra tus películas favoritas, descubre nuevos estrenos y explora el mundo del cine
                </Typography>
                
                <TextField
                    fullWidth
                    placeholder="Buscar películas..."
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
                    {/* Aquí puedes agregar categorías populares o sugerencias */}
                    {/* Por ejemplo: Películas populares, Mejor valoradas, etc. */}
                </Box>
            </Box>
        </Box>
    );
};

export default MovieSearch; 