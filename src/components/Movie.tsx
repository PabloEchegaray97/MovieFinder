import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

interface MovieProps {
    posterPath: string | null;
    title: string;
}

const Movie: React.FC<MovieProps> = ({ posterPath, title }) => {
    return (
        <Card sx={{ maxWidth: '15rem', height: '20rem', position: 'relative' }}>
            <CardMedia
                component="img"
                height="100%"
                image={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : 'not-available-es.png'}
                alt={posterPath ? `Poster de ${title}` : 'Imagen no disponible'}
                sx={{ objectFit: 'cover' }}
            />
            <Typography
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '8px',
                    textAlign: 'center',
                    fontSize:'.8rem'
                }}
                gutterBottom
            >
                {title}
            </Typography>
        </Card>
    );
};

export default Movie;
