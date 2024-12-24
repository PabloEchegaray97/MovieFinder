import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Skeleton } from '@mui/material';
import { MovieProps } from '../types';

const Movie: React.FC<MovieProps> = ({ posterPath, title }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <Card sx={{ height: '21rem', position: 'relative' }}>
            {!imageLoaded && (
                <Skeleton 
                    variant="rectangular" 
                    width="16rem"
                    height="21rem"
                    animation="wave"
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    }}
                />
            )}
            <CardMedia
                component="img"
                height="100%"
                image={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : '/images/not-available-es.png'}
                alt={posterPath ? `Poster de ${title}` : 'Imagen no disponible'}
                sx={{ 
                    objectFit: 'cover', 
                    width: '16rem',
                    display: imageLoaded ? 'block' : 'none'
                }}
                onLoad={() => setImageLoaded(true)}
            />
            {imageLoaded && (
                <Typography
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        padding: '.5rem',
                        textAlign: 'center',
                        fontSize: '.8rem',
                        marginBottom: '.5rem'
                    }}
                >
                    {title}
                </Typography>
            )}
        </Card>
    );
};

export default Movie;
