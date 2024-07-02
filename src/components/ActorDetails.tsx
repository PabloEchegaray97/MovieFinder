// src/components/ActorDetails.tsx
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Movie from './Movie';

interface MovieItem {
    poster_path: string | null;
    title: string;
    overview: string;
    id: number;
}

interface ActorDetailsData {
    name: string;
    biography: string;
    profile_path: string | null;
    movie_credits: {
        cast: MovieItem[];
    };
}

const ActorDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [actorDetails, setActorDetails] = useState<ActorDetailsData | null>(null);
    const apiKey = import.meta.env.VITE_API_KEY;

    useEffect(() => {
        const fetchActorDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=es&append_to_response=movie_credits`
                );
                setActorDetails(response.data);
                console.log(response.data);  // Agregado para mostrar los datos en la consola
            } catch (error) {
                console.error('Error al obtener los detalles del actor:', error);
            }
        };

        if (id) {
            fetchActorDetails();
        }
    }, [id]);

    if (!actorDetails) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="actor-details">
            <h2>{actorDetails.name}</h2>
            {actorDetails.profile_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w500${actorDetails.profile_path}`}
                    alt={actorDetails.name}
                />
            )}
            <p>{actorDetails.biography}</p>
            <h3>Películas:</h3>
            <div className="movie-list">
                {actorDetails.movie_credits.cast.map((movie) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`}>
                        <Movie
                            posterPath={movie.poster_path}
                            title={movie.title}
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ActorDetails;
