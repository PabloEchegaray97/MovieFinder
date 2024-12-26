import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieList from './MovieList';
import SecondaryActorList from './SecondaryActorList';
import { ToggleButton, ToggleButtonGroup, Box, Typography, Tooltip, CircularProgress } from '@mui/material';
import 'flag-icons/css/flag-icons.min.css';
import { useTheme } from '@mui/material/styles';
import {  Actor, MovieDetailsData, RelatedMovie, Video, ProvidersData} from '../types';



const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movieDetails, setMovieDetails] = useState<MovieDetailsData | null>(null);
    const [actors, setActors] = useState<Actor[]>([]);
    const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);
    const [video, setVideo] = useState<Video | null>(null);
    const [showContent, setShowContent] = useState<'suggestions' | 'details'>('suggestions');
    const [loading, setLoading] = useState<boolean>(true); // Estado para manejar la carga
    const [providers, setProviders] = useState<ProvidersData | null>(null);
    const language = 'es';
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;

    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [movieResponse, creditsResponse, relatedResponse, videosResponse, providersResponse] = await Promise.all([
                    axios.get(`${apiUrl}/movie/${id}?api_key=${apiKey}&language=${language}`),
                    axios.get(`${apiUrl}/movie/${id}/credits?api_key=${apiKey}&language=${language}`),
                    axios.get(`${apiUrl}/movie/${id}/recommendations?api_key=${apiKey}&language=${language}`),
                    axios.get(`${apiUrl}/movie/${id}/videos?api_key=${apiKey}&language=${language}`),
                    axios.get(`${apiUrl}/movie/${id}/watch/providers?api_key=${apiKey}`)
                ]);

                const movieData = movieResponse.data;
                const certifications = (await axios.get(`${apiUrl}/movie/${id}/release_dates?api_key=${apiKey}`)).data.results;
                let certification = 'N/A';
                for (const release of certifications) {
                    if (release.iso_3166_1 === 'US' || release.iso_3166_1 === 'ES') {
                        certification = release.release_dates[0].certification || 'N/A';
                        break;
                    }
                }

                setMovieDetails({
                    ...movieData,
                    certification,
                });
                setActors(creditsResponse.data.cast);
                setRelatedMovies(relatedResponse.data.results);

                const trailer = videosResponse.data.results.find((video: Video) => video.type === 'Trailer' && video.site === 'YouTube');
                setVideo(trailer || null);
                setProviders(providersResponse.data.results.ES || null);
            } catch (error) {
                console.error('Error al obtener los datos de la película:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
            window.scrollTo(0, 0);
        }
    }, [id, apiKey, apiUrl, language]);

    if (loading || !movieDetails) {
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

    const formattedRuntime = `${Math.floor(movieDetails.runtime / 60)} h ${movieDetails.runtime % 60} min`;
    

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

                </div>
                <div>
                    <Typography variant="h6" sx={{ color: theme.palette.text.primary, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }} className='mbottom sec-font jcenter'>
                        ELENCO
                    </Typography>
                    <SecondaryActorList actors={actors} />
                </div>
                {
                    providers && (
                        <Box>
                            <Typography variant="h6" sx={{ color: theme.palette.text.primary, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }} className='mbottom sec-font jcenter'>
                            DISPONIBLE EN:
                        </Typography>
                            <Box className="d-center movie-providers">
                                {providers.flatrate?.map(provider => (
                                    <Tooltip key={provider.provider_id} title={`${provider.provider_name} (Suscripción)`}>
                                        <Box>
                                            <img
                                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                width="40"
                                                style={{ cursor: 'pointer' }}
                                                className='provider-img'

                                            />
                                        </Box>
                                    </Tooltip>
                                ))}
                                {providers.buy?.map(provider => (
                                    <Tooltip key={provider.provider_id} title={`${provider.provider_name} (Compra)`}>
                                        <Box>
                                            <img
                                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                width="40"
                                                style={{ cursor: 'pointer' }}
                                                className='provider-img'
                                            />
                                        </Box>
                                    </Tooltip>
                                ))}
                                {providers.rent?.map(provider => (
                                    <Tooltip key={provider.provider_id} title={`${provider.provider_name} (Alquiler)`}>
                                        <Box>
                                            <img
                                                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                                alt={provider.provider_name}
                                                width="40"
                                                style={{ cursor: 'pointer' }}
                                                className='provider-img'

                                            />
                                        </Box>
                                    </Tooltip>
                                ))}
                            </Box>
                            <Typography variant="body1" sx={{ color: theme.palette.text.primary }} className='mbottom sec-font jcenter d-flex-column'>
                            Fuente: <a href={providers.link} target="_blank" rel="noopener noreferrer" className='link'>TMDb</a>
                            </Typography>
                        </Box>
                    )
                }

                {video && (
                    <Box className="video-iframe-container">
                        <Typography variant="h6" sx={{ color: theme.palette.text.primary, borderBottom: '2px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem', marginBottom: '1.5rem', textAlign: 'center' }} className='mbottom sec-font jcenter'>
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
