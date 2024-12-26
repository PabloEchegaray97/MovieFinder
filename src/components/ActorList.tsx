import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Typography, Grid, Box, Chip, Stack } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';

interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
    popularity?: number;
    known_for_department?: string;
    known_for?: Array<{
        title?: string;
        name?: string;
        media_type: string;
    }>;
}

interface ActorListProps {
    actors: Actor[];
}

const ActorList: React.FC<ActorListProps> = ({ actors }) => {
    const actorsWithPhotos = actors.filter(actor => actor.profile_path);

    return (
        <Box className='actor-list-container' sx={{ bgcolor: 'background.default' }}>
            <Grid 
                container 
                spacing={0.5}
                className='actor-list'
            >
                {actorsWithPhotos.map((actor) => (
                    <Grid item key={actor.id}>
                        <Link to={`/actor/${actor.id}`} style={{ textDecoration: 'none' }}>
                            <Card sx={{ 
                                width: 300,
                                height: 160,
                                backgroundColor: 'background.paper',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                '&:hover': {
                                    transform: 'scale(1.03)',
                                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                                }
                            }}>
                                <CardMedia
                                    component="img"
                                    sx={{ 
                                        width: '10rem',
                                        objectFit: 'cover',
                                        borderRight: '2px solid rgba(255,255,255,0.1)'
                                    }}
                                    image={`https://image.tmdb.org/t/p/w300/${actor.profile_path}`}
                                    alt={actor.name}
                                />
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    width: '100%',
                                    padding: '.4rem'
                                }}>
                                    <Typography 
                                        variant="h6" 
                                        component="div" 
                                        sx={{ 
                                            color: 'text.primary',
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            mb: 1
                                        }}
                                    >
                                        {actor.name}
                                    </Typography>
                                    <Stack spacing={0.5}>
                                        {actor.known_for_department && (
                                            <Chip 
                                                icon={<WorkIcon />}
                                                label={actor.known_for_department}
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    color: 'text.primary'
                                                }}
                                            />
                                        )}
                                        {actor.popularity && (
                                            <Chip 
                                                icon={<StarIcon />}
                                                label={`${Math.round(actor.popularity)}`}
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    color: 'text.primary'
                                                }}
                                            />
                                        )}
                                        {actor.known_for && actor.known_for.length > 0 && (
                                            <Typography 
                                                variant="caption" 
                                                sx={{ 
                                                    color: 'text.secondary',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5
                                                }}
                                            >
                                                <MovieIcon fontSize="small" />
                                                {actor.known_for[0].title || actor.known_for[0].name}
                                            </Typography>
                                        )}
                                    </Stack>
                                </Box>
                            </Card>
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ActorList;
