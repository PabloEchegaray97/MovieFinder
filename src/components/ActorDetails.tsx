import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, CircularProgress } from '@mui/material';
import Movie from './Movie';
import MovieModal from './MovieModal';
import { useTheme } from '@mui/material/styles';


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
    }, [id]);

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
                        <>
                            <Typography variant="h6" className='mbottom'>BIOGRAFÍA</Typography>
                            <Typography className='actor-data-text'>{actorDetails.biography}</Typography>
                        </>
                    )}
                </Box>
                <Box className="actor-details-poster" textAlign="center">
                    {actorDetails.profile_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${actorDetails.profile_path}`}
                            alt={actorDetails.name}
                            className='actor-poster'
                        />
                    )}
                    <Typography variant="h3" className='actor-title'>{actorDetails.name}</Typography>
                    <Box className="actor-details-info">
                        {actorDetails.imdb_id && (
                            <Typography>
                                <a href={`https://www.imdb.com/name/${actorDetails.imdb_id}`} target="_blank" rel="noopener noreferrer" className='link'>IMDb</a>
                            </Typography>
                        )}
                        <Typography><strong>Fecha de Nacimiento:</strong> {actorDetails.birthday}</Typography>
                        {actorDetails.deathday && <Typography><strong>Fecha de Fallecimiento:</strong> {actorDetails.deathday}</Typography>}
                        <Typography><strong>Lugar de Nacimiento:</strong> {actorDetails.place_of_birth}</Typography>

                        {actorDetails.facebook_id && (
                            <Typography>
                                <strong>Facebook:</strong>
                                <a href={`https://www.facebook.com/${actorDetails.facebook_id}`} target="_blank" rel="noopener noreferrer">Ver en Facebook</a>
                            </Typography>
                        )}
                        {actorDetails.instagram_id && (
                            <Typography>
                                <strong>Instagram:</strong>
                                <a href={`https://www.instagram.com/${actorDetails.instagram_id}`} target="_blank" rel="noopener noreferrer">Ver en Instagram</a>
                            </Typography>
                        )}
                        {actorDetails.twitter_id && (
                            <Typography>
                                <strong>Twitter:</strong>
                                <a href={`https://twitter.com/${actorDetails.twitter_id}`} target="_blank" rel="noopener noreferrer">Ver en Twitter</a>
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }} className='mtop mbottom sec-font jcenter'>
                PELÍCULAS
            </Typography>
            <Box className="movie-list">
                {actorDetails.movie_credits.cast.map((movie) => (
                    <div key={movie.id} onClick={() => handleMovieClick(movie)}>
                        <Movie
                            posterPath={movie.poster_path}
                            title={movie.title}
                        />
                    </div>
                ))}
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
