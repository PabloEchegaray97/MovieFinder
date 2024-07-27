import React, { useState } from 'react';
import MovieList from './MovieList';
import ActorList from './ActorList';
import { Box, Button, Typography } from '@mui/material';
import { MovieItem, Actor } from '../types';

interface HomeProps {
  searchResults: MovieItem[] | Actor[];
  searchType: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (direction: 'next' | 'prev') => void;
}

const Home: React.FC<HomeProps> = ({ searchResults, searchType, currentPage, totalPages, onPageChange }) => {
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  React.useEffect(() => {
    setHasSearched(searchResults.length > 0);
  }, [searchResults]);

  const displayTotalPages = totalPages > 0 ? totalPages : 1; 

  return (
    <section className='home'>
      <Box mb={2}>
        {searchType === 'movie' ? <MovieList movies={searchResults as MovieItem[]} /> : <ActorList actors={searchResults as Actor[]} />}
      </Box>
      {searchType === 'movie' && hasSearched && (
        <Box display="flex" flexDirection="column" alignItems="center" mt={2}>
          <Typography variant="body1" mb={2}>
            Página {currentPage} de {displayTotalPages}
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => onPageChange('prev')}
            >
              Anterior
            </Button>
            <Button
              variant="outlined"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange('next')}
            >
              Siguiente
            </Button>
          </Box>
        </Box>
      )}
    </section>
  );
};

export default Home;
