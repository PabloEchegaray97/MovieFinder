import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Chip, Avatar, Box, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {Actor} from '../types'

interface SecondaryActorListProps {
    actors: Actor[];
}

const SecondaryActorList: React.FC<SecondaryActorListProps> = ({ actors }) => {
    const [showAll, setShowAll] = useState(false);
    const previewCount = 8;
    
    return (
        <Box 
            sx={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                position: 'relative'
            }}
        >
            <Box 
                sx={{ 
                    width: '100%',
                    maxWidth: '1200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                {/* Primera fila siempre visible */}
                <Box 
                    display="flex" 
                    flexWrap="wrap" 
                    gap={1} 
                    justifyContent="center" 
                    sx={{ width: '100%' }}
                >
                    {actors.slice(0, previewCount).map((actor) => (
                        <Chip
                            key={actor.id}
                            component={Link}
                            to={`/actor/${actor.id}`}
                            label={actor.name}
                            avatar={
                                actor.profile_path ? (
                                    <Avatar src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} />
                                ) : (
                                    <Avatar>{actor.name.charAt(0)}</Avatar>
                                )
                            }
                            clickable
                        />
                    ))}
                </Box>

                {/* Contenido expandible con animación */}
                <Collapse in={showAll} sx={{ width: '100%' }}>
                    <Box 
                        display="flex" 
                        flexWrap="wrap" 
                        gap={1} 
                        justifyContent="center" 
                        sx={{ 
                            width: '100%',
                            mt: 1 
                        }}
                    >
                        {actors.slice(previewCount).map((actor) => (
                            <Chip
                                key={actor.id}
                                component={Link}
                                to={`/actor/${actor.id}`}
                                label={actor.name}
                                avatar={
                                    actor.profile_path ? (
                                        <Avatar src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} />
                                    ) : (
                                        <Avatar>{actor.name.charAt(0)}</Avatar>
                                    )
                                }
                                clickable
                            />
                        ))}
                    </Box>
                </Collapse>

                {actors.length > previewCount && (
                    <IconButton 
                        onClick={() => setShowAll(!showAll)}
                        sx={{ mt: 2 }}
                    >
                        {showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                )}
            </Box>
        </Box>
    );
};

export default SecondaryActorList;
