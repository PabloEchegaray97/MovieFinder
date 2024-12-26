import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/NavBar';
import MainContainer from './components/MainContainer';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetails from './components/MovieDetails';
import ActorDetails from './components/ActorDetails';
import axios from 'axios';
import { MovieItem, Actor } from './types';
import Footer from './components/Footer';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import MovieSearch from './components/MovieSearch';
import ActorSearch from './components/ActorSearch';
import GenreSearch from './components/GenreSearch';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#242424',
      paper: '#242424',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: 'rgba(0, 0, 0, 0.7)',
    },
  },
});

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

  const handleSearch = async (type: string, query: string | number) => {
    setSearchType(type);
    setSearchQuery(query.toString()); // Guardar el query de búsqueda
    setCurrentPage(1); // Reset page a 1 en nuevo search
    setIsLoading(true); // Activar el estado de carga
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;
    let response;
  
    try {
      if (type === 'movie') {
        response = await axios.get(`${apiUrl}/search/movie`, {
          params: {
            api_key: apiKey,
            query: query,
            page: 1, // Initial page
          },
        });
      } else if (type === 'genre') {
        response = await axios.get(`${apiUrl}/discover/movie`, {
          params: {
            api_key: apiKey,
            with_genres: query, // Utiliza el ID del género en lugar de un string
            page: 1, // Initial page
          },
        });
      } else {
        response = await axios.get(`${apiUrl}/search/person`, {
          params: {
            api_key: apiKey,
            query: query,
          },
        });
      }
  
      // Lógica para manejar el límite de páginas
      const maxPages = response.data.total_pages > 500 ? 500 : response.data.total_pages;
      setTotalPages(maxPages);
  
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };
  
  const fetchMovies = async (page: number, query: string) => {
    setIsLoading(true); // Activar el estado de carga
    const apiKey = import.meta.env.VITE_API_KEY;
    const apiUrl = import.meta.env.VITE_API_URL;
    let response;
  
    try {
      if (searchType === 'genre') {
        // La búsqueda por género utiliza 'with_genres' con el ID del género
        response = await axios.get(`${apiUrl}/discover/movie`, {
          params: {
            api_key: apiKey,
            with_genres: query, // `query` es ser el ID del género (número)
            page: page > 500 ? 500 : page, // la pagina no excede de 500
          },
        });
      } else {
        // La búsqueda por término utiliza 'query'
        response = await axios.get(`${apiUrl}/search/movie`, {
          params: {
            api_key: apiKey,
            query: query,
            page: page > 500 ? 500 : page,
          },
        });
      }
  
      const maxPages = response.data.total_pages > 500 ? 500 : response.data.total_pages;
      setTotalPages(maxPages);
  
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false); // Desactivar el estado de carga
    }
  };
  




const handlePageChange = async (page: number) => {
  console.log('Page change triggered:', page);
  setCurrentPage(page);
  await fetchMovies(page, searchQuery); 
  console.log('Movies fetched for page:', page);
};

  const goTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
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
                  isLoading={isLoading}
                />
              }
            />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/actor/:id" element={<ActorDetails />} />
            
            <Route path="/movies" element={<MovieSearch />} />
            <Route path="/artists" element={<ActorSearch />} />
            <Route path="/genres" element={<GenreSearch />} />
          </Routes>
        </MainContainer>
        <Footer darkMode={darkMode} />
      </Router>
      <div className='go-top-arrow' onClick={goTop}>
        <ArrowUpward sx={{ 
          color: darkMode ? 'white' : 'black', 
          fontSize: 30,
          boxShadow: 'none'
        }} />
      </div>              
    </ThemeProvider>
  );
};

export default App;
