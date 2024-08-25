import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieList from './MovieList';
import SecondaryActorList from './SecondaryActorList';
import { ToggleButton, ToggleButtonGroup, Box, Typography, Skeleton } from '@mui/material';
import 'flag-icons/css/flag-icons.min.css';
import { useTheme } from '@mui/material/styles';

interface Genre {
    id: number;
    name: string;
}

interface Actor {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
}

interface ProductionCompany {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}

interface MovieDetailsData {
    title: string;
    original_title: string;
    overview: string;
    backdrop_path: string | null;
    poster_path: string | null;
    release_date: string;
    genres: Genre[];
    runtime: number;
    certification: string;
    tagline: string;
    production_companies: ProductionCompany[];
    vote_average: number;
    vote_count: number;
    budget: number;
    revenue: number;
    original_language: string;
    popularity: number;
    adult: boolean;
    spoken_languages: { iso_639_1: string; name: string }[];
    production_countries: { iso_3166_1: string; name: string }[];
}

interface RelatedMovie {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    release_date: string;
}

interface Video {
    key: string;
    name: string;
    site: string;
    type: string;
}

const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movieDetails, setMovieDetails] = useState<MovieDetailsData | null>(null);
    const [actors, setActors] = useState<Actor[]>([]);
    const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);
    const [video, setVideo] = useState<Video | null>(null);
    const [showContent, setShowContent] = useState<'suggestions' | 'details'>('suggestions');
    const language = 'es';
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;

    const theme = useTheme();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/movie/${id}?api_key=${apiKey}&language=${language}`
                );
                const data = response.data;

                const certificationResponse = await axios.get(
                    `${apiUrl}/movie/${id}/release_dates?api_key=${apiKey}`
                );
                const certifications = certificationResponse.data.results;
                let certification = 'N/A';

                for (const release of certifications) {
                    if (release.iso_3166_1 === 'US' || release.iso_3166_1 === 'ES') {
                        certification = release.release_dates[0].certification || 'N/A';
                        break;
                    }
                }

                setMovieDetails({
                    ...data,
                    certification,
                });
            } catch (error) {
                console.error('Error al obtener los detalles de la película:', error);
            }
        };

        const fetchMovieCredits = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/movie/${id}/credits?api_key=${apiKey}&language=${language}`
                );
                setActors(response.data.cast);
            } catch (error) {
                console.error('Error al obtener los créditos de la película:', error);
            }
        };

        const fetchRelatedMovies = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/movie/${id}/recommendations?api_key=${apiKey}&language=${language}`
                );
                setRelatedMovies(response.data.results);
            } catch (error) {
                console.error('Error al obtener películas relacionadas:', error);
            }
        };

        const fetchMovieVideos = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/movie/${id}/videos?api_key=${apiKey}&language=${language}`
                );
                const videos = response.data.results;
                const trailer = videos.find(
                    (video: Video) => video.type === 'Trailer' && video.site === 'YouTube'
                );
                setVideo(trailer || null);
            } catch (error) {
                console.error('Error al obtener los videos de la película:', error);
            }
        };

        if (id) {
            fetchMovieDetails();
            fetchMovieCredits();
            fetchRelatedMovies();
            fetchMovieVideos();
        }
    }, [id, apiKey, apiUrl]);

    if (!movieDetails) {
        return (
            <Box sx={{ padding: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Box flex={1}>
                        <Box display="flex" justifyContent="center" mb={2}>
                            <Skeleton variant="text" height={40} width="50%" />
                        </Box>
                        <Skeleton variant="text" height={40} width="100%" />
                        <Skeleton variant="text" height={40} width="100%" />
                        <Skeleton variant="text" height={40} width="100%" />
                    </Box>
                    <Box display="flex" alignItems="center" flexDirection="column">
                        <Skeleton variant="rectangular" width={'20vw'} height={'22rem'} sx={{ marginRight: 2, marginLeft: 2 }} />
                    </Box>
                </Box>
                <Box flex={1}>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Skeleton variant="text" height={40} width="50%" />
                    </Box>
                    <Skeleton variant="rectangular" height={'5rem'} width="100%" />
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Skeleton variant="text" height={40} width="50%" sx={{ marginTop: '2rem' }} />
                    </Box>
                    <Box display="flex" justifyContent="center" gap="1rem">
                        <Skeleton variant="rectangular" height={'5rem'} width="20%" />
                        <Skeleton variant="rectangular" height={'5rem'} width="20%" />
                        <Skeleton variant="rectangular" height={'5rem'} width="20%" />
                        <Skeleton variant="rectangular" height={'5rem'} width="20%" />
                    </Box>
                </Box>
            </Box>
        );
    }

    const formattedRuntime = `${Math.floor(movieDetails.runtime / 60)} h ${movieDetails.runtime % 60} min`;
    const formattedReleaseDate = new Date(movieDetails.release_date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="movie-details-container">
            {movieDetails.backdrop_path && (
                <img
                    src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                    alt={`Fondo de ${movieDetails.title}`}
                    className="movie-backdrop"
                />
            )}

            <div className="movie-details">
                <Box className="movie-data">
                    <Box className="movie-details-text">
                        <Typography variant="h4" sx={{ color: theme.palette.text.primary }} className='movie-title'>
                            {movieDetails.title}
                        </Typography>
                        <div className='movie-info mbottom mtop-m'>
                            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                {`${new Date(movieDetails.release_date).getFullYear()} • ${formattedRuntime} • ${movieDetails.genres.map(genre => genre.name).join(', ')} • Clasificación: ${movieDetails.certification}`}
                            </Typography>
                        </div>
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary }} className='movie-overview'>
                            {movieDetails.overview}
                        </Typography>
                    </Box>
                    <Box className="movie-poster-container">
                        {movieDetails.poster_path && (
                            <img
                                src={`https://image.tmdb.org/t/p/original${movieDetails.poster_path}`}
                                alt={`Póster de ${movieDetails.title}`}
                                className="movie-poster"
                            />
                        )}
                    </Box>
                </Box>

                <div>
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary }} className='mtop mbottom sec-font jcenter'>
                        ELENCO
                    </Typography>
                    <SecondaryActorList actors={actors} />
                </div>
                {video && (
                    <Box className="video-iframe-container">
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }} className='mbottom sec-font jcenter'>
                            TRAILER
                        </Typography>
                        <iframe
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title={video.name}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className='video-iframe'
                        />
                    </Box>
                )}
                <ToggleButtonGroup
                    value={showContent}
                    exclusive
                    onChange={(_, value) => setShowContent(value)}
                    aria-label="toggle content"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '1rem',
                    }}
                >
                    <ToggleButton
                        value="suggestions"
                        sx={{
                            fontSize: '1rem',
                            borderBottom: showContent === 'suggestions' ? '0.2rem solid #000' : 'none',
                            border: 'none',
                            outline: 'none',
                            textTransform: 'uppercase',
                            color: showContent === 'suggestions' ? theme.palette.text.primary : theme.palette.text.secondary,
                        }}
                    >
                        Recomendaciones
                    </ToggleButton>
                    <ToggleButton
                        value="details"
                        sx={{
                            fontSize: '1rem',
                            borderBottom: showContent === 'details' ? '0.2rem solid #000' : 'none',
                            border: 'none',
                            outline: 'none',
                            textTransform: 'uppercase',
                            color: showContent === 'details' ? theme.palette.text.primary : theme.palette.text.secondary,
                        }}
                    >
                        Detalles adicionales
                    </ToggleButton>
                </ToggleButtonGroup>

                {showContent === 'suggestions' ? (
                    <MovieList movies={relatedMovies} />
                ) : (
                    <Box>
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }} className='mtop'>
                            Presupuesto:
                            <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                                ${movieDetails.budget.toLocaleString()}
                            </Typography>
                        </Typography>
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }} className='mtop'>
                        Ingresos: 
                        </Typography>
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                            ${movieDetails.revenue.toLocaleString()}

                        </Typography>

                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }} className='mtop'>
                            Lenguajes:
                            <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                                {movieDetails.spoken_languages.map(lang => lang.name).join(', ')}
                            </Typography>
                        </Typography>
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }} className='mtop'>
                            Productores:
                        </Typography>
                        <ul>
                            {movieDetails.production_companies.map(company => (
                                <li key={company.id}>
                                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                        {company.name} ({company.origin_country})
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary }} className='mtop'>
                            Países de producción:
                        </Typography>
                        <ul>
                            {movieDetails.production_countries.map(country => (
                                <li key={country.iso_3166_1}>
                                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                                        {country.name}
                                    </Typography>
                                </li>
                            ))}
                        </ul>
                    </Box>
                )}


            </div>
        </div>
    );
};

export default MovieDetails;
