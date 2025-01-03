import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { Swiper as SwiperComponent, SwiperSlide, SwiperRef } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  backdrop_path: string | null;
}

const GenreSelector: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingGenres, setLoadingGenres] = useState<boolean>(true);
  const [loadingMovies, setLoadingMovies] = useState<boolean>(true);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: number]: boolean }>({});
  const theme = useTheme();
  const swiperRef = useRef<SwiperRef>(null);

  const handleImageLoad = (movieId: number) => {
    setImagesLoaded(prev => ({
      ...prev,
      [movieId]: true
    }));
  };

  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true); // Activar carga de géneros
      try {
        const apiKey = import.meta.env.VITE_API_KEY;
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/genre/movie/list`, {
          params: {
            api_key: apiKey, language: 'es-ES',
          },
        });
        const fetchedGenres = response.data.genres.slice(0, 5); // Obtener solo los primeros 5 géneros
        setGenres(fetchedGenres);
        if (fetchedGenres.length > 0) {
          setSelectedGenre(fetchedGenres[0].id); // Seleccionar automáticamente el primer género
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoadingGenres(false); // Desactivar carga de géneros
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (selectedGenre === null) return;

      setLoadingMovies(true); // Activar carga de películas
      try {
        const apiKey = import.meta.env.VITE_API_KEY;
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/discover/movie`, {
          params: {
            api_key: apiKey,
            with_genres: selectedGenre,
            page: 1,
            language: 'es-ES',
          },
        });
        const isMobile = window.innerWidth < 800;
        setMovies(response.data.results.slice(0, isMobile ? 4 : 6)); // Obtener 4 o 6 películas
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoadingMovies(false); // Desactivar carga de películas
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  useEffect(() => {
    const genreIndex = genres.findIndex(genre => genre.id === selectedGenre);
    if (genreIndex !== -1 && swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(genreIndex, 300, true);
    }
  }, [selectedGenre, genres]);

  const handleSlideChange = (swiper: SwiperType) => {
    const activeSlide = swiper.slides[swiper.activeIndex];
    const genreId = genres.find(genre => genre.name === activeSlide.innerText)?.id;
    if (genreId) {
      setSelectedGenre(genreId);
    }
  };

  return (
    <Box className="genre-container fade-in">
      <Box
        sx={{
          '& .swiper-button-next, & .swiper-button-prev': {
            color: theme.palette.text.primary,
            fontSize: '1.5rem',
            width: '30px',
            height: '30px',
          },
          '& .swiper-button-next::after, & .swiper-button-prev::after': {
            fontSize: 'inherit',
          },
        }}
      >
        {loadingGenres ? (
          <Skeleton variant="rectangular" width="100%" height={40} />
        ) : (
          <SwiperComponent
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={1}
            navigation
            loop={true}
            onSlideChange={handleSlideChange}
            ref={swiperRef}
          >
            {genres.map((genre) => (
              <SwiperSlide key={genre.id} style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant='h4' sx={{ color: theme.palette.text.primary }} className='mbottom-3 jcenter title'>
                  {genre.name}
                </Typography>
              </SwiperSlide>
            ))}
          </SwiperComponent>
        )}
      </Box>

      {loadingMovies ? (
        <Box className="genre-movies-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <Box key={index} className="movie-grid-container">
              <Skeleton 
                variant="rectangular" 
                className='genre-img-grid' 
                sx={{
                  height: '14rem',
                  width: '100%'
                }}
              />
            </Box>
          ))}
        </Box>
      ) : (
        selectedGenre !== null && (
          <Box className="genre-movies-grid">
            {movies.map((movie) => (
              <Box key={movie.id} className="movie-grid-container" sx={{ position: 'relative', width: '100%' }}>
                <Link to={`/movie/${movie.id}`}>
                  {!imagesLoaded[movie.id] && (
                    <Skeleton 
                      variant="rectangular" 
                      className='genre-img-grid'
                      animation="wave"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        height: '14rem',
                        width: '100%',
                        transform: 'none'
                      }}
                    />
                  )}
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className='genre-img-grid'
                    style={{ 
                      display: imagesLoaded[movie.id] ? 'block' : 'none',
                      height: '14rem',
                      width: '100%',
                      objectFit: 'cover'
                    }}
                    onLoad={() => handleImageLoad(movie.id)}
                  />
                  <Typography
                    variant="body2"
                    className="genre-movie-title"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '14rem',
                      color: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                      padding: '10px 0',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      opacity: 0,
                      transition: 'all 0.3s ease-in-out',
                      '.movie-grid-container:hover &': {
                        opacity: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      }
                    }}
                  >
                    {movie.title}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Box>
        )
      )}
    </Box>
  );
};

export default GenreSelector;
