import { useEffect, useState } from 'react';
import MovieList from './MovieList';
import ActorList from './ActorList';
import { Box, Typography, Pagination, Skeleton } from '@mui/material';
import { HomeProps, MovieItem, Actor } from '../types';
import { useTheme } from '@mui/material/styles';
import Banner from './Banner';
import GenreSelector from './GenreSelector';
import PersonGallerySelector from './PersonGallerySelector';

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

  useEffect(() => {
    setHasSearched(searchResults.length > 0);
  }, [searchResults]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <section className='home'>
      <div className='test'>
      <Banner></Banner>

      </div>
      <Box className="d-center d-center-c m2 mtop2">
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }} className='sec-font jcenter mbottom'>
          Descubre lo último en:
        </Typography>
        <GenreSelector></GenreSelector>
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
        <PersonGallerySelector></PersonGallerySelector>
      </Box>
      <Box mb={2}>
        {isLoading ? (
          <div className='flex-center'>
            <Skeleton variant="rectangular" width="90%" height="30rem" />
          </div>
        ) : searchType === 'movie' || searchType === 'genre' ? (
          <MovieList movies={searchResults as MovieItem[]} />
        ) : (
          <ActorList actors={searchResults as Actor[]} />
        )}
      </Box>
      {(searchType === 'movie' || searchType === 'genre') && hasSearched && (
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
    </section>
  );
};


export default Home;
