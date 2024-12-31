import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = import.meta.env.VITE_API_URL;

// IDs de las colecciones más populares de TMDB
const POPULAR_COLLECTIONS = {
    MARVEL: 529892,        // Marvel Cinematic Universe
    STAR_WARS: 10,        // Star Wars Saga
    HARRY_POTTER: 1241,   // Harry Potter
    LORD_OF_RINGS: 119,   // Lord of the Rings
    FAST_FURIOUS: 9485    // Fast & Furious
};

export const fetchSagaCollection = async (collectionId: number) => {
    try {
        const response = await axios.get(
            `${API_URL}/collection/${collectionId}?api_key=${API_KEY}&language=es-ES`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching collection:', error);
        return null;
    }
}; 