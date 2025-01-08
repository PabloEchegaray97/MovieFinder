import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress, Card, CardMedia, Stack, Chip } from '@mui/material';
import Movie from './Movie';
import MovieModal from './MovieModal';
import { useTheme } from '@mui/material/styles';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import MovieIcon from '@mui/icons-material/Movie';
import LanguageIcon from '@mui/icons-material/Language';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';


export interface MovieItem {
    poster_path: string | null;
    title: string;
    overview: string;
    id: number;
    release_date: string;
}

interface ActorDetailsData {
    name: string;
    biography: string | null;
    profile_path: string | null;
    birthday: string | null;
    deathday: string | null;
    place_of_birth: string | null;
    known_for_department: string;
    homepage: string | null;
    imdb_id: string | null;
    facebook_id: string | null;
    instagram_id: string | null;
    twitter_id: string | null;
    movie_credits: {
        cast: MovieItem[];
    };
    popularity: number;
}

const ActorDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [actorDetails, setActorDetails] = useState<ActorDetailsData | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<MovieItem | null>(null);
    const apiKey = import.meta.env.VITE_API_KEY;
    const theme = useTheme();

    const handleMovieClick = (movie: MovieItem) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const fetchActorDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=es&append_to_response=movie_credits,external_ids`
                );
                setActorDetails(response.data);
            } catch (error) {
                console.error('Error al obtener los detalles del actor:', error);
            }
        };

        if (id) {
            fetchActorDetails();
        }
    }, [id, apiKey]);

    if (!actorDetails) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                }}
                className='loader-container'
            >
                <CircularProgress size={50} sx={{ color: 'white' }} />
            </Box>
        );
    }

    return (
        <Box className="actor-details-container">
            <Box className="actor-data" display="flex">
                <Box className="actor-details-text" flex={1} mr={2}>
                    {actorDetails.biography && (
                        <Box sx={{
                            backgroundColor: 'background.paper',
                            padding: '2rem',
                            borderRadius: '.3rem',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}>
                            <Typography 
                                variant="h6" 
                                className='mbottom actor-data-title'
                                sx={{
                                    borderBottom: '2px solid rgba(255,255,255,0.1)',
                                    paddingBottom: '0.5rem',
                                    marginBottom: '1.5rem'
                                }}
                            >
                                BIOGRAFÍA
                            </Typography>
                            <Typography 
                                className='actor-data-text'
                                sx={{
                                    lineHeight: '1.6',
                                    color: 'text.secondary'
                                }}
                            >
                                {actorDetails.biography}
                            </Typography>
                        </Box>
                    )}
                </Box>
                <Box className="actor-details-poster" textAlign="center">
                    <Card sx={{ 
                        width: '95%',
                        backgroundColor: 'background.paper',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',

                    }}>
                        <Box sx={{ display: 'flex' }}>
                            <CardMedia
                                component="img"
                                sx={{ 
                                    width: '18rem',
                                    height: '260px',
                                    objectFit: 'cover',
                                    borderRight: '2px solid rgba(255,255,255,0.1)'
                                }}
                                image={`https://image.tmdb.org/t/p/w300/${actorDetails.profile_path}`}
                            alt={actorDetails.name}
                            />
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                width: '100%',
                                padding: '.4rem'
                            }}>
                                <Typography 
                                    variant="h6" 
                                    component="div" 
                                    sx={{ 
                                        color: 'text.primary',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        mb: 1
                                    }}
                                >
                                    {actorDetails.name}
                                </Typography>
                                <Stack spacing={0.5}>
                                    {actorDetails.known_for_department && (
                                        <Chip 
                                            icon={<WorkIcon />}
                                            label={actorDetails.known_for_department}
                                            size="small"
                                            sx={{ 
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: 'text.primary'
                                            }}
                                        />
                                    )}
                                    <Chip 
                                        icon={<StarIcon />}
                                        label={`Popularidad: ${Math.round(actorDetails.popularity || 0)}`}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            color: 'text.primary'
                                        }}
                                    />
                                    <Chip 
                                        icon={<MovieIcon />}
                                        label={`Películas: ${actorDetails.movie_credits.cast.length}`}
                                        size="small"
                                        sx={{ 
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            color: 'text.primary'
                                        }}
                                    />
                                    {actorDetails.homepage && (
                                        <Chip 
                                            icon={<LanguageIcon />}
                                            label="Sitio Web"
                                            component="a"
                                            href={actorDetails.homepage}
                                            target="_blank"
                                            clickable
                                            size="small"
                                            sx={{ 
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: 'text.primary'
                                            }}
                                        />
                                    )}
                        {actorDetails.facebook_id && (
                                        <Chip 
                                            icon={<FacebookIcon />}
                                            label="Facebook"
                                            component="a"
                                            href={`https://facebook.com/${actorDetails.facebook_id}`}
                                            target="_blank"
                                            clickable
                                            size="small"
                                            sx={{ 
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: 'text.primary'
                                            }}
                                        />
                        )}
                        {actorDetails.instagram_id && (
                                        <Chip 
                                            icon={<InstagramIcon />}
                                            label="Instagram"
                                            component="a"
                                            href={`https://instagram.com/${actorDetails.instagram_id}`}
                                            target="_blank"
                                            clickable
                                            size="small"
                                            sx={{ 
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: 'text.primary'
                                            }}
                                        />
                                    )}
                                </Stack>
                            </Box>
                        </Box>
                        <Box className='actor-details-info'>
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Fecha de Nacimiento:</strong> {actorDetails.birthday}
                            </Typography>
                            {actorDetails.deathday && (
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <strong>Fecha de Fallecimiento:</strong> {actorDetails.deathday}
                            </Typography>
                        )}
                            <Typography variant="body2" sx={{ mb: 0.5 }}>
                                <strong>Lugar de Nacimiento:</strong> {actorDetails.place_of_birth}
                            </Typography>
                            {actorDetails.imdb_id && (
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <a href={`https://www.imdb.com/name/${actorDetails.imdb_id}`} 
                                       target="_blank" 
                                       rel="noopener noreferrer" 
                                       className='link'>
                                        IMDb
                                    </a>
                            </Typography>
                        )}
                    </Box>
                    </Card>

                </Box>
            </Box>

            <Box sx={{ 
                backgroundColor: 'background.paper',
                padding: '2rem',
                borderRadius: '.3rem',
                mt: 3,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        color: theme.palette.text.primary,
                        borderBottom: '2px solid rgba(255,255,255,0.1)',
                        paddingBottom: '0.5rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center'
                    }}
                >
                    PELÍCULAS
                </Typography>
                <Box className="movie-list" sx={{
                    gap: '1.5rem',
                    '& .movie-item': {
                        '&:hover': {
                            cursor: 'search',
                        }
                    }
                }}>
                    {actorDetails.movie_credits.cast.map((movie) => (
                        <div key={movie.id} onClick={() => handleMovieClick(movie)} className='movie-item'>
                            <Movie
                                posterPath={movie.poster_path}
                                title={movie.title}
                            />
                        </div>
                    ))}
                </Box>
            </Box>

            <MovieModal
                open={!!selectedMovie}
                handleClose={handleCloseModal}
                movie={selectedMovie}
                actorBirthday={actorDetails.birthday}
            />
        </Box>
    );
};

export default ActorDetails;
