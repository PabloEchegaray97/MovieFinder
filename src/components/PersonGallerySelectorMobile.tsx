import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Person } from '../types';

const PersonGallerySelectorMobile: React.FC = () => {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPopularPeople = async () => {
            try {
                const apiKey = import.meta.env.VITE_API_KEY;
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiUrl}/person/popular`, {
                    params: {
                        api_key: apiKey,
                        language: 'es-ES',
                    },
                });
                const randomPeople = getRandomElements(response.data.results, 4);
                setPeople(randomPeople);
            } catch (error) {
                console.error('Error fetching popular people:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularPeople();
    }, []);

    const getRandomElements = (arr: Person[], count: number): Person[] => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="person-gallery-mobile-container">
            {people.map(person => (
                <Link to={`/actor/${person.id}`} key={person.id} className="person-mobile-item">
                    <img
                        src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/150'}
                        alt={person.name}
                    />
                    <div className="person-mobile-name">{person.name}</div>
                </Link>
            ))}
        </Box>
    );
};

export default PersonGallerySelectorMobile; 