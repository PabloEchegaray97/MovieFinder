import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Genre {
    id: number;
    name: string;
}

interface MovieDetailsData {
    title: string;
    overview: string;
    backdrop_path: string | null;
    release_date: string;
    genres: Genre[];
    
}

const MovieDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); 
    const [movieDetails, setMovieDetails] = useState<MovieDetailsData | null>(null);
    const language = 'es';
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(
                    `${apiUrl}/movie/${id}?api_key=${apiKey}&language=${language}`
                );
                setMovieDetails(response.data);
                console.log(response.data);
                
            } catch (error) {
                console.error('Error al obtener los detalles de la película:', error);
            }
        };

        if (id) {
            fetchMovieDetails();
        }
    }, [id]);

    if (!movieDetails) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="movie-details">
            <h2>{movieDetails.title}</h2>
            <p>Fecha de lanzamiento: {movieDetails.release_date}</p>
            <p>{movieDetails.overview}</p>
            {movieDetails.backdrop_path && (
                <img
                    src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                    alt={`Fondo de ${movieDetails.title}`}
                    className="movie-backdrop"
                />
            )}
            <div>
                <h3>Géneros:</h3>
                <ul>
                    {movieDetails.genres.map((genre) => (
                        <li key={genre.id}>{genre.name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MovieDetails;
