import React, { useEffect } from 'react';
import MovieList from './MovieList';
import ActorList from './ActorList';
import { Box, Typography, Pagination, Skeleton } from '@mui/material';
import { MovieItem, Actor } from '../types';

interface HomeProps {
  searchResults: MovieItem[] | Actor[];
  searchType: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // Cambiado para aceptar el número de página directamente
  isLoading: boolean; // Nuevo prop para manejar el estado de carga
}

const Home: React.FC<HomeProps> = ({ searchResults, searchType, currentPage, totalPages, onPageChange, isLoading }) => {
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHasSearched(searchResults.length > 0);
  }, [searchResults]);

  useEffect(() => {
    // Scroll al principio de la página cuando cambie el número de página
    window.scrollTo(0, 0);
  }, [currentPage]);

  return (
    <section className='home'>
      <Box mb={2}>
        {isLoading ? (
          <div className='flex-center'>
            <Skeleton variant="rectangular" width="90%" height="30rem" />
          </div>
        ) : searchType === 'movie' ? (
          <MovieList movies={searchResults as MovieItem[]} />
        ) : (
          <ActorList actors={searchResults as Actor[]} />
        )}
      </Box>
      {searchType === 'movie' && hasSearched && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
          <Typography variant="body1" mb={1} mt={2}>
            Página {currentPage} de {totalPages}
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange(page)}
            color="primary"
            siblingCount={1}
            boundaryCount={1}
            sx={{marginBottom:"1rem"}}
          />
        </Box>
      )}
    </section>
  );
};

export default Home;
