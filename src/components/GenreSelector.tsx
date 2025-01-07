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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

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
        setMovies(response.data.results.slice(0, isMobile ? 4 : 6)); // Obtener 4 o 6 películas
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoadingMovies(false); // Desactivar carga de películas
      }
    };

    fetchMovies();
  }, [selectedGenre, isMobile]);

  useEffect(() => {
    const genreIndex = genres.findIndex(genre => genre.id === selectedGenre);
    if (genreIndex !== -1 && swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(genreIndex, 300, true);
    }
  }, [selectedGenre, genres]);

  const handleSlideChange = (swiper: SwiperType) => {
    const activeIndex = swiper.realIndex;
    const genre = genres[activeIndex];
    if (genre?.id) {
      setSelectedGenre(genre.id);
    }
  };

  useEffect(() => {
    if (selectedGenre !== null) {
      console.log('Género seleccionado:', selectedGenre);
    }
  }, [selectedGenre]);

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 800);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Box className="genre-container fade-in">
      <Box
        sx={{
          '& .swiper-button-next, & .swiper-button-prev': {
            color: theme.palette.text.primary,
            fontSize: '1.5rem',
            width: '35px',
            height: '35px',
            top: '50%',
            transform: 'translateY(-50%)',
            '&::after': {
              fontSize: '1.5rem',
              fontWeight: 'bold'
            },
            '@media (min-width: 800px)': {
              fontSize: '2rem',
              width: '50px',
              height: '50px',
              '&::after': {
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }
            }
          },
          '& .swiper-button-prev': {
            left: '10px',
            '@media (min-width: 800px)': {
              left: '20px'
            }
          },
          '& .swiper-button-next': {
            right: '10px',
            '@media (min-width: 800px)': {
              right: '20px'
            }
          },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
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
            observer={true}
            observeParents={true}
            watchSlidesProgress={true}
          >
            {genres.map((genre) => (
              <SwiperSlide key={genre.id} style={{ display: 'flex', justifyContent: 'center' }}>
                <span style={{ color: theme.palette.text.primary }} className='mbottom-3 jcenter title'>
                  {genre.name}
                </span>
              </SwiperSlide>
            ))}
          </SwiperComponent>
        )}
      </Box>

      {loadingMovies ? (
        <Box className="genre-movies-grid">
          {Array.from({ length: isMobile ? 4 : 6 }).map((_, index) => (
            <Box key={index} className="movie-grid-container">
              <Skeleton 
                variant="rectangular" 
                className='genre-img-grid' 
                sx={{
                  height: isMobile ? '10rem' : '14rem',
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
                        height: isMobile ? '10rem' : '14rem',
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
                      height: isMobile ? '10rem' : '14rem',
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
                      color: 'white',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                      padding: '0.5rem',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      ...(isMobile ? {
                        opacity: 1,
                        maxHeight: '3rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      } : {
                        opacity: 0,
                        transition: 'all 0.3s ease-in-out',
                        '.movie-grid-container:hover &': {
                          opacity: 1
                        }
                      })
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
