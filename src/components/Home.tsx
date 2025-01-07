import { useEffect, useState } from 'react';
import MovieList from './MovieList';
import ActorList from './ActorList';
import { Box, Typography, Pagination, CircularProgress, Stack } from '@mui/material';
import { HomeProps, MovieItem, Actor } from '../types';
import Banner from './Banner';
import GenreSelector from './GenreSelector';
import PersonGallerySelector from './PersonGallerySelector';
import { useLocation, useNavigate } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import PopularSagas from './PopularSagas';
import AwardedMovies from './AwardedMovies';
import PersonGallerySelectorMobile from './PersonGallerySelectorMobile';
import { useTheme } from '@mui/material/styles';

const Home: React.FC<HomeProps> = ({
    searchResults,
    searchType,
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
}) => {
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
    const theme = useTheme();

    useEffect(() => {
        setHasSearched(searchResults.length > 0);
    }, [searchResults]);

    useEffect(() => {
        if (location.pathname === '/') {
            setHasSearched(false);
        }
    }, [location]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1000);
        };

        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Box 
            className="home"
            sx={{ 
                minHeight: '100vh',
                backgroundColor: 'background.default',
                position: 'relative'
            }}
        >
            {!hasSearched ? (
                <>
                    <Box className="home-container" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem'
                    }}>
                        <Box className="home-container-text">
                            <Typography
                                variant="h3"
                                className='title-home'
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
                                Descubre películas increíbles, conoce a tus artistas favoritos y explora por géneros
                            </Typography>
                            <Stack 
                                direction="row" 
                                spacing={3} 
                                className="home-container-buttons"
                            >
                                <Box
                                    className="home-container-buttons-button"
                                    onClick={() => navigate('/movies')}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        padding: '0.8rem 1.5rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '2rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 1)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    }}
                                >
                                    <MovieIcon sx={{ color: 'black', fontSize: 20 }} />
                                    <Typography sx={{ color: 'black', fontWeight: 500 }} className="home-container-buttons-text">
                                        Películas
                                    </Typography>
                                </Box>

                                <Box
                                    className="home-container-buttons-button"
                                    onClick={() => navigate('/artists')}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        padding: '0.8rem 1.5rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '2rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 1)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    }}
                                >
                                    <PersonIcon sx={{ color: 'black', fontSize: 20 }} />
                                    <Typography sx={{ color: 'black', fontWeight: 500 }} className="home-container-buttons-text">
                                        Personas
                                    </Typography>
                                </Box>

                                <Box
                                    className="home-container-buttons-button"
                                    onClick={() => navigate('/genres')}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        padding: '0.8rem 1.5rem',
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        borderRadius: '2rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255, 255, 255, 1)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        }
                                    }}
                                >
                                    <CategoryIcon sx={{ color: 'black', fontSize: 20 }} />
                                    <Typography sx={{ color: 'black', fontWeight: 500 }} className="home-container-buttons-text">
                                        Géneros
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Banner />
                        </Box>
                    </Box>

                    <Box className="d-center d-center-c m2 section-container">
                        <div style={{ color: theme.palette.text.primary }} className='sec-font jcenter mbottom title'>
                            Descubre lo último en:
                        </div>
                        <GenreSelector />
                    </Box>

                    <Box className="d-center d-center-c section-container">
                        <div className="box-container section-home">
                            <div style={{ color: theme.palette.text.primary }} className='sec-font title'>
                                Tus artistas favoritos
                            </div>
                            <div style={{ color: theme.palette.text.secondary }} className='sec-font jcenter mbottom title2'>
                                En un solo lugar
                            </div>
                        </div>
                        {isMobile ? <PersonGallerySelectorMobile /> : <PersonGallerySelector />}
                        <div className='section-home'>
                            <AwardedMovies/>
                        </div>
                        <div className='section-home'>
                            <PopularSagas/>
                        </div>
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
                                <CircularProgress size={60} sx={{ color: 'text.primary' }} />
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
                                onChange={(_, page) => {
                                    window.scrollTo(0, 0);
                                    onPageChange(page);
                                }}
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
