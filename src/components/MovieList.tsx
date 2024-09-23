import React from 'react';
import { Link } from 'react-router-dom';
import Movie from './Movie';
import { Box } from '@mui/material';
import { MovieItem} from '../types';

interface MovieListProps {
  movies: MovieItem[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <Box className="movie-list">
      {movies.map((movie) => (
        <Box className="movie-item">
          <Link to={`/movie/${movie.id}`} className="movie-link">
            <Movie
              posterPath={movie.poster_path}
              title={movie.title}
            />
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default MovieList;
