import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface GenreSearchProps {
    onSearch: (type: string, query: string) => void;
}

const GenreSearch: React.FC<GenreSearchProps> = ({ onSearch }) => {
    const [genres, setGenres] = useState<{ id: number, name: string }[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string>('');
    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const apiKey = import.meta.env.VITE_API_KEY;
                const response = await fetch(
                    `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es-ES`
                );
                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    const handleGenreChange = (event: SelectChangeEvent<string>) => {
        const genreId = event.target.value;
        setSelectedGenre(genreId);
        onSearch('genre', genreId);
        navigate('/');
    };

    return (
        <Box sx={{ 
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: 'background.default',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box sx={{
                maxWidth: '800px',
                margin: '0 auto',
                textAlign: 'center',
                width: '100%'
            }}>
                <CategoryIcon sx={{ fontSize: 100, color: theme.palette.text.primary, mb: 2 }} />
                <Typography 
                    variant="h3" 
                    sx={{ 
                        color: 'text.primary',
                        fontWeight: 'bold',
                        mb: 2
                    }}
                >
                    Buscar por Género
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
                    Encuentra películas por su género
                </Typography>
                
                <FormControl fullWidth variant="outlined">
                    <Select
                        value={selectedGenre}
                        onChange={handleGenreChange}
                        displayEmpty
                        sx={{
                            backgroundColor: 'background.paper',
                            mb: 4
                        }}
                    >
                        <MenuItem value="" disabled>
                            Selecciona un género
                        </MenuItem>
                        {genres.map((genre) => (
                            <MenuItem key={genre.id} value={genre.id}>
                                {genre.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};

export default GenreSearch; 