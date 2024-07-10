import React from 'react';
import { Link } from 'react-router-dom';
import Movie from './Movie';
import Grid from '@mui/material/Grid';

interface MovieItem {
  poster_path: string | null;
  title: string;
  overview: string;
  id: number; 
}

interface MovieListProps {
  movies: MovieItem[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <Grid container spacing={2} justifyContent="flex-start" wrap="wrap" className="movie-list">
      {movies.map((movie) => (
        <Grid item key={movie.id} xs={6} sm={4} md={2}>
          <Link to={`/movie/${movie.id}`} className="movie-link" style={{ textDecoration: 'none' }}>
            <Movie
              posterPath={movie.poster_path}
              title={movie.title}
            />
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieList;
