import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import NavBar from './components/NavBar';
import MainContainer from './components/MainContainer';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetails from './components/MovieDetails';
import ActorDetails from './components/ActorDetails';
import axios from 'axios';
import { MovieItem, Actor } from './types';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode !== null ? savedDarkMode === 'true' : true;
  });

  const [navbarHeight, setNavbarHeight] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<MovieItem[] | Actor[]>([]);
  const [searchType, setSearchType] = useState<string>('movie');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Agregado para mantener el query de búsqueda
  const [isLoading, setIsLoading] = useState<boolean>(false); // Nuevo estado para manejar la carga

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleSearch = async (type: string, query: string) => {
    setSearchType(type);
    setSearchQuery(query); // Guardar el query de búsqueda
    setCurrentPage(1); // Reset page a 1 en nuevo search
    setIsLoading(true); // Activar el estado de carga
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;
    let response;
    if (type === 'movie') {
      response = await axios.get(`${apiUrl}/search/movie`, {
        params: {
          api_key: apiKey,
          query: query,
          page: 1, // Initial page
        },
      });
      setSearchResults(response.data.results);
      setTotalPages(response.data.total_pages);
    } else {
      response = await axios.get(`${apiUrl}/search/person`, {
        params: {
          api_key: apiKey,
          query: query,
        },
      });
      setSearchResults(response.data.results);
      setTotalPages(response.data.total_pages);
    }
    setIsLoading(false); // Desactivar el estado de carga
  };

  const fetchMovies = async (page: number, query: string) => {
    setIsLoading(true); // Activar el estado de carga
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await axios.get(`${apiUrl}/search/movie`, {
      params: {
        api_key: apiKey,
        query: query,
        page: page,
      },
    });
    setSearchResults(response.data.results);
    setTotalPages(response.data.total_pages);
    setIsLoading(false); // Desactivar el estado de carga
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchMovies(page, searchQuery); // Pasa el query actual
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          setNavbarHeight={setNavbarHeight} 
          onSearch={handleSearch} 
        />
        <MainContainer navbarHeight={navbarHeight}>
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  searchResults={searchResults} 
                  searchType={searchType}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isLoading} // Pasar el estado de carga
                />
              } 
            />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/actor/:id" element={<ActorDetails />} />
          </Routes>
        </MainContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;
