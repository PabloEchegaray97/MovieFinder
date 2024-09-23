import React from 'react';
import { Modal, Typography, Button, Box } from '@mui/material';
import { MovieItem } from './ActorDetails';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';

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
            <Box className="modal-content" sx={{ backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'}}>
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    style={{ width: '50%', marginBottom: '1rem' }}
                />
                <Typography id="movie-modal-title" variant="h6" component="h2">
                    {movie.title}
                </Typography>
                <Typography id="movie-modal-description" sx={{ mt: 1 }}>
                    Fecha de Estreno: {movie.release_date}
                </Typography>
                <Typography sx={{ mt: 0 }}>
                    Edad del actor cuando se estrenó: {actorBirthday ? `${ageAtRelease} años` : 'Desconocida'}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => window.location.href = `/movie/${movie.id}`}
                >
                    Ver Más
                </Button>
            </Box>
        </Modal>
    );
};

export default MovieModal;
