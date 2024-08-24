import React, { useState } from 'react';
import axios from 'axios';
import ActorList from './ActorList';
import { TextField, Button, Box, Skeleton } from '@mui/material';

interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
}

const ActorSearch: React.FC = () => {
    const [query, setQuery] = useState<string>('');
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
            <Box component="form" onSubmit={handleSearch} display="flex" alignItems="center" mb={2}>
                <TextField
                    label="Buscar actor"
                    variant="outlined"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginLeft: '10px' }}>
                    Buscar
                </Button>
            </Box>
            <ActorList actors={actors} />
        </div>
    );
};

export default ActorSearch;
