import React from 'react';
import { Modal, Typography, Button, Box, useTheme } from '@mui/material';
import { MovieItem } from './ActorDetails';
import dayjs from 'dayjs';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CakeIcon from '@mui/icons-material/Cake';
import { alpha } from '@mui/material/styles';

interface MovieModalProps {
    open: boolean;
    handleClose: () => void;
    movie: MovieItem | null;
    actorBirthday: string | null;
}

const MovieModal: React.FC<MovieModalProps> = ({ open, handleClose, movie, actorBirthday }) => {
    const theme = useTheme();

    if (!movie) return null;

    const calculateAgeAtRelease = (releaseDate: string) => {
        if (!actorBirthday) return 'Desconocida';
        const release = dayjs(releaseDate);
        const birth = dayjs(actorBirthday);
        return release.diff(birth, 'year');
    };

    const ageAtRelease = calculateAgeAtRelease(movie.release_date);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="movie-modal-title"
            aria-describedby="movie-modal-description"
            className='modal'
            
        >
            <Box className="modal-content" sx={{ 
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                overflow: 'hidden',
                width: '30rem',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '.3rem',
            }}>
                <Box sx={{ 
                    flex: '1 1 auto',
                    minHeight: '35rem',
                    position: 'relative'
                }}>
                    <img
                        src={movie.poster_path ? 
                            `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 
                            '/images/not-available-es.png'
                        }
                        alt={movie.poster_path ? `Poster de ${movie.title}` : 'Imagen no disponible'}
                        style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }}
                    />
                </Box>
                <Box sx={{ 
                    padding: '1rem',
                    flex: '0 0 auto'
                }}>
                    <Typography variant="h6" component="h2" noWrap>
                        {movie.title}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                mb: 1
                            }}
                        >
                            <CalendarMonthIcon fontSize="small" />
                            <strong>Fecha de Estreno:</strong> {dayjs(movie.release_date).format('DD/MM/YYYY')}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1
                            }}
                        >
                            <CakeIcon fontSize="small" />
                            <strong>Edad del actor al momento del estreno:</strong> {actorBirthday ? `${ageAtRelease} años` : 'Desconocida'}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ 
                            mt: 2, 
                            backgroundColor: 'white', 
                            color: 'black', 
                            '&:hover': { 
                                backgroundColor: 'rgba(255,255,255,0.8)' 
                            } 
                        }}
                        onClick={() => window.location.href = `/movie/${movie.id}`}
                    >
                        Ver Más
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default MovieModal;
