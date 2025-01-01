import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Typography, Grid, Box, Chip, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import WorkIcon from '@mui/icons-material/Work';
import TheatersIcon from '@mui/icons-material/Theaters';
import PublicIcon from '@mui/icons-material/Public';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
    popularity?: number;
    known_for_department?: string;
    known_for?: Array<{
        id: number;
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
        <Box 
            className='actor-list-container' 
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.default',
                position: 'relative',
                width: '100%',
                marginBottom: '0',
                alignContent: 'center',
            }}
        >
            <Box 
                sx={{
                    flex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Grid 
                    container 
                    spacing={2}
                    sx={{
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        justifyContent: 'center'
                    }}
                >
                    {actorsWithPhotos.map((actor) => (
                        <Grid item key={actor.id}>
                            <Link to={`/actor/${actor.id}`} style={{ textDecoration: 'none' }}>
                                <Card sx={{ 
                                    width: 384,
                                    height: 216,
                                    backgroundColor: 'background.paper',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        transform: 'scale(1.03)',
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                                    }
                                }}>
                                    <CardMedia
                                        component="img"
                                        sx={{ 
                                            width: '12rem',
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
                                        padding: '.4rem',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <Typography 
                                                variant="h6" 
                                                component="div" 
                                                sx={{ 
                                                    color: 'text.primary',
                                                    fontSize: '1.3rem',
                                                    fontWeight: 'bold',
                                                    mb: 1
                                                }}
                                            >
                                                {actor.name}
                                            </Typography>
                                            <Stack spacing={0.5}>
                                                <Stack direction="row" spacing={0.5}>
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
                                                            label={`Popularidad: ${Math.round(actor.popularity)}`}
                                                            size="small"
                                                            sx={{ 
                                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                                color: 'text.primary'
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                            </Stack>
                                        </div>

                                        <Box sx={{ mt: 'auto' }}>
                                            {actor.known_for && actor.known_for.length > 0 && (
                                                <Stack spacing={0.5}>
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <PublicIcon 
                                                            fontSize="small" 
                                                            sx={{ color: 'text.secondary' }}
                                                        />
                                                        <Typography 
                                                            variant="caption" 
                                                            sx={{ 
                                                                color: 'text.secondary',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            Conocido/a por:
                                                        </Typography>
                                                    </Stack>
                                                    {actor.known_for.slice(0, 2).map((work, index) => (
                                                        <Link 
                                                            key={index}
                                                            to={`/movie/${work.id}`}
                                                            style={{ 
                                                                textDecoration: 'none',
                                                                color: 'inherit'
                                                            }}
                                                        >
                                                            <Typography 
                                                                variant="caption" 
                                                                sx={{ 
                                                                    color: 'text.secondary',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: 0.5,
                                                                    '&:hover': {
                                                                        color: 'primary.main',
                                                                        textDecoration: 'underline'
                                                                    },
                                                                    transition: 'color 0.3s ease'
                                                                }}
                                                            >
                                                                {work.media_type === 'movie' ? 
                                                                    <LocalMoviesIcon fontSize="small" /> : 
                                                                    <TheatersIcon fontSize="small" />
                                                                }
                                                                {work.title || work.name}
                                                            </Typography>
                                                        </Link>
                                                    ))}
                                                </Stack>
                                            )}
                                        </Box>
                                    </Box>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default ActorList;
