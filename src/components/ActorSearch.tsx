// src/components/ActorSearch.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Actor {
    id: number;
    name: string;
}

const ActorSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [actors, setActors] = useState<Actor[]>([]);
    const apiKey = import.meta.env.VITE_API_KEY;

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const response = await axios.get(
                `https://api.themoviedb.org/3/search/person?api_key=${apiKey}&language=es&query=${query}`
            );
            setActors(response.data.results);
        } catch (error) {
            console.error('Error searching actors:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar actor"
                />
                <button type="submit">Buscar</button>
            </form>
            <ul>
                {actors.map((actor) => (
                    <li key={actor.id}>
                        <Link to={`/actor/${actor.id}`}>{actor.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActorSearch;
