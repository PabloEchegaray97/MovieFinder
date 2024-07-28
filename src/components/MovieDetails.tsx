import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MovieList from './MovieList';
import SecondaryActorList from './SecondaryActorList';

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

interface MovieDetailsData {
    title: string;
    overview: string;
    backdrop_path: string | null;
    release_date: string;
    genres: Genre[];
    runtime: number;
    certification: string;
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
    const language = 'es';
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;

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

    return (
        <div className="movie-details-container">

            <div className="movie-details">
                <h2 className='movie-title'>{movieDetails.title}</h2>
                <div className='movie-info mbottom'>
                    <p>{`${new Date(movieDetails.release_date).getFullYear()} • ${formattedRuntime} • ${movieDetails.genres.map(genre => genre.name).join(', ')} • Clasificación: ${movieDetails.certification}`}</p>
                </div>
                <p className='movie-overview'>{movieDetails.overview}</p>
                {movieDetails.backdrop_path && (
                    <img
                        src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                        alt={`Fondo de ${movieDetails.title}`}
                        className="movie-backdrop"
                    />
                )}
                <div>
                    <p className='mtop mbottom sec-font'>Elenco:</p>
                    <SecondaryActorList actors={actors} />
                </div>
                <div>
                    <h3>Películas relacionadas:</h3>
                    <MovieList movies={relatedMovies} />
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
