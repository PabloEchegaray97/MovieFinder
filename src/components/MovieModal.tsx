import React from 'react';
import { Modal, Typography, Button, Box } from '@mui/material';
import { MovieItem } from './ActorDetails';
import dayjs from 'dayjs';

interface MovieModalProps {
    open: boolean;
    handleClose: () => void;
    movie: MovieItem | null;
    actorBirthday: string | null;
}

const MovieModal: React.FC<MovieModalProps> = ({ open, handleClose, movie, actorBirthday }) => {

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
                backgroundColor: 'background.paper',
                overflow: 'hidden',
                width: '20rem',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '.3rem',
            }}>
                <Box sx={{ 
                    flex: '1 1 auto',
                    minHeight: '20rem',
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
                            objectFit: 'cover',
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
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Fecha de Estreno: {movie.release_date}
                    </Typography>
                    <Typography variant="body2">
                        Edad del actor cuando se estrenó: {actorBirthday ? `${ageAtRelease} años` : 'Desconocida'}
                    </Typography>
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
