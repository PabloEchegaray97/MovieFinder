import { useEffect, useState } from 'react';
import MovieList from './MovieList';
import ActorList from './ActorList';
import { Box, Typography, Pagination, CircularProgress, Chip } from '@mui/material';
import { HomeProps, MovieItem, Actor } from '../types';
import { useTheme } from '@mui/material/styles';
import Banner from './Banner';
import GenreSelector from './GenreSelector';
import PersonGallerySelector from './PersonGallerySelector';
import { useLocation } from 'react-router-dom';

const Home: React.FC<HomeProps> = ({
  searchResults,
  searchType,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}) => {
  const theme = useTheme();
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setHasSearched(searchResults.length > 0);
  }, [searchResults]);

  useEffect(() => {
    if (location.pathname === '/') {
      setHasSearched(false);
    }
  }, [location]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (initialLoading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
        }}
        className='loader-container'
      >
        <CircularProgress size={50} sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.9) 100%)',
        backgroundAttachment: 'fixed'
    }}>
        <Box className="banner-container">
            <Box className="banner-text-container" sx={{ flex: 1, padding: '2rem' }}>
                <Typography 
                    variant="h2" 
                    sx={{ 
                        color: 'text.primary',
                        fontWeight: 'bold',
                        marginBottom: '1rem'
                    }}
                >
                    Bienvenido a MovieFinder
                </Typography>
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: 'text.secondary',
                        marginBottom: '2rem'
                    }}
                >
                    Descubre las películas que todos están viendo
                </Typography>
                <Box sx={{ 
                    display: 'flex', 
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <Chip 
                        label="Películas Populares" 
                        color="primary" 
                        clickable
                    />
                    <Chip 
                        label="Series" 
                        color="secondary" 
                        clickable
                    />
                    <Chip 
                        label="Actores" 
                        variant="outlined" 
                        clickable
                    />
                </Box>
            </Box>
            <Box sx={{ flex: 1 }}>
                <Banner />
            </Box>
        </Box>
        {!hasSearched ? (
            <>
                <Box className="d-center d-center-c m2 mtop2">
                    <Typography variant="h4" sx={{ color: theme.palette.text.primary }} className='sec-font jcenter mbottom'>
                        Descubre lo último en:
                    </Typography>
                    <GenreSelector />
                </Box>
                <Box className="d-center d-center-c m2 mtop2 m1">
                    <Box className="w50">
                        <Typography variant="h4" sx={{ color: theme.palette.text.primary }} className='sec-font jcenter'>
                            Tus artistas favoritos
                        </Typography>
                        <Typography variant="body1" sx={{ color: theme.palette.text.primary }} className='sec-font jcenter mbottom'>
                            En un solo lugar
                        </Typography>
                    </Box>
                    <PersonGallerySelector />
                </Box>
            </>
        ) : (
            <>
                <Box mb={2}>
                    {isLoading ? (
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                minHeight: '50vh'
                            }}
                        >
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                        </Box>
                    ) : searchType === 'movie' || searchType === 'genre' ? (
                        <MovieList movies={searchResults as MovieItem[]} />
                    ) : (
                        <ActorList actors={searchResults as Actor[]} />
                    )}
                </Box>
                {(searchType === 'movie' || searchType === 'genre') && (
                    <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
                        <Typography variant="body1" mb={1} mt={2}>
                            Página {currentPage} de {totalPages}
                        </Typography>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(_, page) => onPageChange(page)}
                            siblingCount={1}
                            boundaryCount={1}
                            sx={{ marginBottom: "1rem" }}
                        />
                    </Box>
                )}
            </>
        )}
    </Box>
  );
};


export default Home;
