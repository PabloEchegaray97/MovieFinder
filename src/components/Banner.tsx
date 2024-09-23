import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  genre_ids: number[];
  runtime?: number; // Opcional hasta que se obtenga
}

const Banner: React.FC = () => {
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchRecentMovies = async () => {
      const apiKey = import.meta.env.VITE_API_KEY;
      const apiUrl = import.meta.env.VITE_API_URL;

      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&page=1`),
          fetch(`${apiUrl}/genre/movie/list?api_key=${apiKey}&language=es`),
        ]);

        const moviesData = await moviesResponse.json();
        const genresData = await genresResponse.json();

        // Recortamos la lista de películas a las primeras 20
        setRecentMovies(moviesData.results.slice(0, 11));
        setGenres(genresData.genres);
      } catch (error) {
        console.error('Error fetching recent movies:', error);
      }
    };

    fetchRecentMovies();
  }, []);

  useEffect(() => {
    const fetchMovieDetails = async (movieId: number) => {
      const apiKey = import.meta.env.VITE_API_KEY;
      const apiUrl = import.meta.env.VITE_API_URL;

      try {
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=es`);
        const data = await response.json();
        return data.runtime;
      } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
      }
    };

    const fetchMovieDataWithRuntime = async () => {
      const moviesWithRuntime = await Promise.all(
        recentMovies.map(async (movie) => {
          const runtime = await fetchMovieDetails(movie.id);
          return { ...movie, runtime };
        })
      );
      setRecentMovies(moviesWithRuntime);
    };

    if (recentMovies.length > 0) {
      fetchMovieDataWithRuntime();
    }
  }, [recentMovies]);

  const getGenreNames = (genreIds: number[]) => {
    return genreIds.map((id) => {
      const genre = genres.find((g) => g.id === id);
      return genre ? genre.name : 'Desconocido';
    }).join(', ');
  };

  return (
    <section className="banner-container">
      <Box className="banner-text-container">
        <Typography variant="h4" sx={{ color: theme.palette.text.primary }} className='sec-font jcenter'>
          Solo en MovieFinder
        </Typography>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }} className='sec-font jcenter'>
          Descubre las películas que todos estan viendo
        </Typography>
      </Box>
      <Box className="fade-in">
        <Carousel
          showThumbs={false}
          showIndicators={true}
          showStatus={false}
          infiniteLoop
          swipeable
          emulateTouch
          centerMode
          centerSlidePercentage={100} // Ajusta esto para mostrar 3 imágenes al mismo tiempo
          className='carousel'
        >
          {recentMovies.map((movie) => (
            <Link to={`/movie/${movie.id}`} className='link-img' key={movie.id}>
              <div className='banner-img-container'>
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className='banner-img'
                />
                <div className="movie-info">
                  <Typography variant="h4" className='banner-title'>{movie.title}</Typography>
                  <p>Género: {getGenreNames(movie.genre_ids)}</p>
                  {movie.runtime && <p>Duración: {movie.runtime} minutos</p>}
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
      </Box>
    </section>
  );
}

export default Banner;
