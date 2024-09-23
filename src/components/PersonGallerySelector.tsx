import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Person} from '../types'

const PersonGallerySelector: React.FC = () => {
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
                const allPeople = response.data.results; // All popular people
                const randomPeople = getRandomElements(allPeople, 5); // Get 5 random people
                setPeople(randomPeople);
            } catch (error) {
                console.error('Error fetching popular people:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularPeople();
    }, []);

    // Utility function to get random elements from an array
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
        <Box className="person-gallery-container">
            {people.map(person => (
                <Link to={`/actor/${person.id}`} key={person.id} className="person-item">
                    <img
                        src={person.profile_path ? `https://image.tmdb.org/t/p/w500${person.profile_path}` : 'https://via.placeholder.com/150'}
                        alt={person.name}
                    />
                    <div className="person-name">{person.name}</div>
                </Link>
            ))}
        </Box>
    );
};

export default PersonGallerySelector;
