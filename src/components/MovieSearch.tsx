import React, { useState } from 'react';
import axios from 'axios';
import MovieList from './MovieList';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    overview: string;
    release_date: string;
}

enum SearchType {
    NAME = 'name',
    DATE = 'date',
}

const MovieSearch: React.FC = () => {
    const [searchType, setSearchType] = useState<SearchType>(SearchType.NAME);
    const [query, setQuery] = useState<string>('');

    const [movies, setMovies] = useState<Movie[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
    const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

    const apiKey = import.meta.env.VITE_API_KEY;
    const language = 'es';

    const handleSearch = async () => {
        setCurrentPage(1);
        await fetchMovies();
    };

    const fetchMovies = async () => {
        try {
            let url = '';
            switch (searchType) {
                case SearchType.NAME:
                    url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}&language=${language}&page=${currentPage}`;
                    break;
                case SearchType.DATE:
                    url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=${language}&primary_release_date.gte=${startDate?.format('YYYY-MM-DD')}&primary_release_date.lte=${endDate?.format('YYYY-MM-DD')}&page=${currentPage}`;
                    break;
                default:
                    break;
            }

            const response = await axios.get(url);
            const { results, total_pages } = response.data;
            setMovies(results);
            setTotalPages(total_pages);
        } catch (error) {
            console.error('Error al buscar películas:', error);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="movie-search">
            <FormControl fullWidth>
                <InputLabel id="search-type-label">Tipo de Búsqueda</InputLabel>
                <Select
                    labelId="search-type-label"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value as SearchType)}
                    label="Tipo de Búsqueda"
                >
                    <MenuItem value={SearchType.NAME}>Por Nombre</MenuItem>
                    <MenuItem value={SearchType.DATE}>Por Fecha</MenuItem>
                </Select>
            </FormControl>

            {searchType === SearchType.NAME && (
                <Box mt={2}>
                    <TextField
                        fullWidth
                        label="Buscar películas..."
                        variant="outlined"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </Box>
            )}

            {searchType === SearchType.DATE && (
                <Box mt={2}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Fecha de inicio"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                        />
                        <DatePicker
                            label="Fecha de fin"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            minDate={startDate ? startDate : undefined} 
                        />
                    </LocalizationProvider>
                </Box>
            )}

            <Box mt={2} mb={2}>
                <Button variant="contained" color="primary" onClick={handleSearch}>
                    Buscar
                </Button>
            </Box>

            {movies.length > 0 && <MovieList movies={movies} />}

            {movies.length > 0 && (
                <div className="pagination">
                    <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                        Anterior
                    </Button>
                    <span>{`Página ${currentPage} de ${totalPages == 0 ? 1 : totalPages}`}</span>
                    <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MovieSearch;
