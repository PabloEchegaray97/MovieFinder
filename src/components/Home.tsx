import { useEffect, useState } from 'react';
import MovieList from './MovieList';
import ActorList from './ActorList';
import { Box, Typography, Pagination, Skeleton, Card } from '@mui/material';
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
  const location = useLocation();

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

  return (
    <section className='home'>
      {!hasSearched ? (
        <>
          <div className='test'>
            <Banner />
          </div>
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
              <div className='flex-center'>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))', gap: '1rem' }}>
                    {Array.from({ length: searchResults.length || 20 }).map((_, index) => (
                      <Card key={index} sx={{ height: '21rem', position: 'relative' }}>
                        <Skeleton 
                          variant="rectangular" 
                          width="100%"
                          height="100%"
                          animation="wave"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'none'
                          }}
                        />
                        <Skeleton 
                          variant="text" 
                          width="100%"
                          height={30}
                          animation="wave"
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            transform: 'none'
                          }}
                        />
                      </Card>
                    ))}
                  </Box>
                </Box>
              </div>
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
    </section>
  );
};


export default Home;
