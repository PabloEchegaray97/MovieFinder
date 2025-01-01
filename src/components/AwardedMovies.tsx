import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    awards?: string;
}

const AwardedMovies: React.FC = () => {
    const navigate = useNavigate();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();
    
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;

    const awardedMovies = useMemo(() => [
        {
            id: 598,    // Cidade de Deus
            awards: "4 nominaciones al Oscar, incluyendo Mejor Director"
        },
        {
            id: 129,    // Spirited Away
            awards: "Oscar a Mejor Película de Animación 2003"
        },
        {
            id: 680,    // Pulp Fiction
            awards: "Oscar a Mejor Guion Original, Palma de Oro en Cannes"
        },
        {
            id: 155,    // The Dark Knight
            awards: "2 Oscars, incluyendo Mejor Actor de Reparto para Heath Ledger"
        },
        {
            id: 13,     // Forrest Gump
            awards: "6 Oscars, incluyendo Mejor Película y Mejor Director"
        },
        {
            id: 274,    // The Silence of the Lambs
            awards: "5 Oscars principales, incluyendo Mejor Película"
        },
        {
            id: 240,    // El Padrino
            awards: "3 Oscars, incluyendo Mejor Película y Mejor Actor"
        },
        {
            id: 11216,  // Cinema Paradiso
            awards: "Oscar a Mejor Película Extranjera"
        },
        {
            id: 637,    // La vida es bella
            awards: "3 Oscars, incluyendo Mejor Actor y Película Extranjera"
        },
        {
            id: 77338,  // El artista
            awards: "5 Oscars, incluyendo Mejor Película"
        }
    ], []);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const promises = awardedMovies.map(async (movie) => {
                    const response = await axios.get(
                        `${apiUrl}/movie/${movie.id}?api_key=${apiKey}&language=es-ES`
                    );
                    return { ...response.data, awards: movie.awards };
                });

                const moviesData = await Promise.all(promises);
                setMovies(moviesData);
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [awardedMovies, apiKey, apiUrl]);

    if (loading) {
        return <Box>Cargando...</Box>;
    }

    return (
        <Box sx={{ py: 4 }} mt={3}>
            <Typography 
                variant="h5" 
                sx={{ 
                    mb: 3, 
                    textAlign: 'center',
                    color: theme.palette.text.secondary
                }}
            >
                Películas que han hecho historia en los premios
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    maxWidth: '50vw',
                    margin: '0 auto',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                        height: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 4,
                    },
                }}
            >
                <Grid 
                    container 
                    spacing={2} 
                    sx={{ 
                        flexWrap: 'nowrap', 
                        pb: 2,
                        justifyContent: movies.length <= 4 ? 'center' : 'flex-start',
                        width: movies.length <= 4 ? '100%' : 'fit-content',
                        mx: 'auto'
                    }}
                >
                    {movies.map((movie) => (
                        <Grid item key={movie.id}> 
                            <Card 
                                onClick={() => navigate(`/movie/${movie.id}`)}
                                sx={{ 
                                    width: '16rem',
                                    display: 'flex',
                                    height: '100%',
                                    flexDirection: 'column',
                                    background: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(0, 0, 0, 0.2)' 
                                            : 'rgba(255, 255, 255, 0.2)',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        transition: 'transform 0.3s ease'
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    sx={{
                                        height: '21rem',
                                        width: '17rem',
                                        objectFit: 'cover'
                                    }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {movie.title}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{ mb: 1 }}
                                    >
                                        {movie.awards}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {movie.overview}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default AwardedMovies;
