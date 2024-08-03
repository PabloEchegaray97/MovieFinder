import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieList from './MovieList';
import SecondaryActorList from './SecondaryActorList';
import { ToggleButton, ToggleButtonGroup, Box, Typography } from '@mui/material';
import 'flag-icons/css/flag-icons.min.css';
import { useTheme } from '@mui/material/styles'; // Importa el hook useTheme

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

const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [movieDetails, setMovieDetails] = useState<MovieDetailsData | null>(null);
    const [actors, setActors] = useState<Actor[]>([]);
    const [relatedMovies, setRelatedMovies] = useState<RelatedMovie[]>([]);
    const [showContent, setShowContent] = useState<'suggestions' | 'details'>('suggestions');
    const language = 'es';
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;

    const theme = useTheme(); // Usa el hook useTheme para obtener el tema actual

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

        if (id) {
            fetchMovieDetails();
            fetchMovieCredits();
            fetchRelatedMovies();
        }
    }, [id, apiKey, apiUrl]);

    if (!movieDetails) {
        return <div>Cargando...</div>;
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
                        <div className='movie-info mbottom'>
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
                            fontSize: '1rem', // Tamaño de la fuente
                            borderBottom: showContent === 'suggestions' ? '0.2rem solid #000' : 'none', // Border bottom al estar seleccionado
                            border: 'none', // Eliminar bordes
                            outline: 'none', // Eliminar outline
                            borderRadius: 0, // Sin bordes redondeados
                            color: showContent === 'suggestions' ? 'text.primary' : 'text.secondary', // Color del texto
                            backgroundColor: 'transparent', // Fondo transparente
                            '&.Mui-selected': {
                                borderBottom: '0.2rem solid #000', // Asegura el border bottom al estar seleccionado
                            },
                        }}
                    >
                        Sugerencias
                    </ToggleButton>
                    <ToggleButton
                        value="details"
                        sx={{
                            fontSize: '1rem', // Tamaño de la fuente
                            borderBottom: showContent === 'details' ? '0.2rem solid #000' : 'none', // Border bottom al estar seleccionado
                            border: 'none', // Eliminar bordes
                            outline: 'none', // Eliminar outline
                            borderRadius: 0, // Sin bordes redondeados
                            color: showContent === 'details' ? 'text.primary' : 'text.secondary', // Color del texto
                            backgroundColor: 'transparent', // Fondo transparente
                            '&.Mui-selected': {
                                borderBottom: '0.2rem solid #000', // Asegura el border bottom al estar seleccionado
                            },
                        }}
                    >
                        Detalles
                    </ToggleButton>
                </ToggleButtonGroup>





                <Box mt={2}>
                    {showContent === 'suggestions' && (
                        <div>
                            <MovieList movies={relatedMovies} />
                        </div>
                    )}

                    {showContent === 'details' && (
                        <div>
                            <Typography variant="h6" sx={{ color: 'text.primary' }}>Detalles de la Película:</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Título Original:</strong> {movieDetails.original_title}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Tagline:</strong> {movieDetails.tagline}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Fecha de Estreno:</strong> {formattedReleaseDate}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Duración:</strong> {formattedRuntime}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Productoras:</strong> {movieDetails.production_companies.map(pc => pc.name).join(', ')}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Promedio de Votos:</strong> {movieDetails.vote_average} ({movieDetails.vote_count} votos)</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Presupuesto:</strong> ${movieDetails.budget.toLocaleString()}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Ingresos:</strong> ${movieDetails.revenue.toLocaleString()}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Idioma Original:</strong> {movieDetails.original_language.toUpperCase()}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Popularidad:</strong> {movieDetails.popularity}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Adulto:</strong> {movieDetails.adult ? 'Sí' : 'No'}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>País de Producción:</strong> {
                                movieDetails.production_countries.map(pc => (
                                    <span key={pc.iso_3166_1} className={`fi fi-${pc.iso_3166_1.toLowerCase()}`} title={pc.name} style={{ marginRight: '10px' }}></span>
                                ))
                            }</Typography>
                            <Typography variant="body1" sx={{ color: 'text.primary' }}><strong>Idiomas Hablados:</strong> {movieDetails.spoken_languages.map(sl => sl.name).join(', ')}</Typography>

                        </div>
                    )}
                </Box>
            </div>
        </div>
    );
};

export default MovieDetails;
