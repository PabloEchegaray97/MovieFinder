import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Card, CardMedia, Grid, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
}

interface Collection {
    name: string;
    parts: Movie[];
}

const PopularSagas: React.FC = () => {
    const [collection, setCollection] = useState<Collection | null>(null);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    const popularCollections = useMemo(() => [
        10,     // Star Wars
        1241,   // Harry Potter
        9485,   // Fast & Furious
        119,    // Lord of the Rings
        86311,  // Mission Impossible
        295,    // Pirates of the Caribbean
        2980,   // Indiana Jones
        263,    // The Dark Knight
        87359,  // Matrix
        2344,   // Transformers
        131635, // The Hunger Games
        328,    // Jurassic Park
        1709,   // James Bond
        121938, // El Hobbit
        573436, // Spider-Man (Tom Holland)
        91361,  // Monsterverse (Godzilla, Kong)
        84,     // Terminator
        87096,  // X-Men
        2806,   // Back to the Future
        33514,  // Toy Story
        86066,  // John Wick
        531241, // Pixar
        735,    // Alien
        1575,   // Shrek
        556,    // Rocky
        8945,   // Mad Max
        86534,  // Planet of the Apes
        70068,  // Bourne
        115575  // El Padrino
    ], []);

    useEffect(() => {
        const fetchRandomSaga = async () => {
            setLoading(true);
            try {
                const randomIndex = Math.floor(Math.random() * popularCollections.length);
                const randomCollectionId = popularCollections[randomIndex];
                
                console.log('Saga seleccionada ID:', randomCollectionId);

                const apiKey = import.meta.env.VITE_API_KEY;
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(
                    `${apiUrl}/collection/${randomCollectionId}?api_key=${apiKey}&language=es-ES`
                );
                const data = await response.json();
                
                console.log('Nombre de la saga:', data.name);
                
                // Filtrar películas sin fecha válida o sin imagen
                data.parts = data.parts.filter((movie: Movie) => {
                    const releaseYear = new Date(movie.release_date).getFullYear();
                    return !isNaN(releaseYear) && movie.poster_path !== null;
                });

                // Solo establecer la colección si hay películas válidas
                if (data.parts.length > 0) {
                    // Ordenar por fecha de lanzamiento
                    data.parts.sort((a: Movie, b: Movie) => 
                        new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
                    );
                    setCollection(data);
                } else {
                    // Si no hay películas válidas, volver a intentar con otra saga
                    fetchRandomSaga();
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRandomSaga();
    }, [popularCollections]);

    if (loading) {
        return (
            <Box sx={{ py: 4 }}>
                <Skeleton variant="text" width={300} height={50} sx={{ mx: 'auto', mb: 4 }} />
                <Grid container spacing={2} justifyContent="center">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Grid item key={item}>
                            <Skeleton variant="rectangular" width={200} height={300} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    }

    return (
        <Box >
            <Typography 
                variant="h5" 
                sx={{ 
                    mb: 1,
                    textAlign: 'center',
                    color: theme.palette.text.secondary,
                }}
            >
                Descubre las sagas más populares del cine
            </Typography>

            {collection && (
                <>
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mb: 4, 
                            textAlign: 'center',
                            color: theme.palette.text.primary 
                        }}
                    >
                        {collection.name.replace(' - Colección', '')}
                    </Typography>
                    
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: '50vw',
                            margin: '0 auto',
                            overflow: 'auto',
                            px: 2,
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
                                justifyContent: collection.parts.length <= 4 ? 'center' : 'flex-start',
                                width: collection.parts.length <= 4 ? '100%' : 'fit-content',
                                mx: 0
                            }}
                        >
                            {collection.parts.map((movie: Movie) => (
                                <Grid item key={movie.id} sx={{ pl: 2 }}>
                                    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                                        <Card sx={{ 
                                            height: '21rem',
                                            width: '16rem',
                                            transition: 'transform 0.3s',
                                            '&:hover': {
                                                transform: 'scale(1.05)'
                                            },
                                            bgcolor: 'background.paper',
                                            position: 'relative'
                                        }}>
                                            {movie.poster_path && (
                                                <>
                                                    <CardMedia
                                                        component="img"
                                                        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                                        alt={movie.title}
                                                        sx={{
                                                            height: '21rem',
                                                            width: '16rem',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                    <Box sx={{ 
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        right: 0,
                                                        p: 1,
                                                        background: 'rgba(0, 0, 0, 0.7)',
                                                    }}>
                                                        <Typography 
                                                            variant="subtitle1" 
                                                            sx={{ 
                                                                color: 'white',
                                                                textAlign: 'center',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            {new Date(movie.release_date).getFullYear()}
                                                        </Typography>
                                                    </Box>
                                                </>
                                            )}
                                        </Card>
                                    </Link>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default PopularSagas; 