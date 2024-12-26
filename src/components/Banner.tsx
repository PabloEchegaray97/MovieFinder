import React, { useEffect, useState } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router-dom';

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
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({}); // Mover arriba

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

        const movies = moviesData.results.slice(0, 11);
        // Inicializar el estado de carga aquí, antes de establecer las películas
        setImageLoading(
          movies.reduce((acc: { [key: number]: boolean }, movie: Movie) => ({
            ...acc,
            [movie.id]: true
          }), {})
        );
        setRecentMovies(movies);
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
      <Box className="fade-in">
        <Carousel
          showThumbs={false}
          showIndicators={true}
          showStatus={false}
          swipeable
          emulateTouch
          centerMode
          centerSlidePercentage={100}
          className='carousel'
          renderArrowPrev={(clickHandler) => (
            <div
              onClick={clickHandler}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '10%',
                zIndex: 2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)'
              }}
            >
              <span className="carousel-arrow-prev">❮</span>
            </div>
          )}
          renderArrowNext={(clickHandler) => (
            <div
              onClick={clickHandler}
              style={{
                position: 'absolute',
                right: 0,
                top: 0,
                bottom: 0,
                width: '10%',
                zIndex: 2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to left, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)'
              }}
            >
              <span className="carousel-arrow-next">❯</span>
            </div>
          )}
        >
          {recentMovies.map((movie) => (
            <Link to={`/movie/${movie.id}`} className='link-img' key={movie.id}>
              <div className='banner-img-container'>
                {imageLoading[movie.id] ? (
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      transform: 'none'
                    }}
                  />
                ) : null}
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                  className='banner-img'
                  onLoad={() => setImageLoading(prev => ({ ...prev, [movie.id]: false }))}
                  onError={() => setImageLoading(prev => ({ ...prev, [movie.id]: false }))}
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
