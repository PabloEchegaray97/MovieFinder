import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Chip, Avatar, Box, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
}

interface SecondaryActorListProps {
    actors: Actor[];
}

const SecondaryActorList: React.FC<SecondaryActorListProps> = ({ actors }) => {
    const [showAll, setShowAll] = useState(false);

    const handleToggleShowAll = () => {
        setShowAll(!showAll);
    };

    return (
        <Box>
            <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
                {actors.slice(0, 6).map((actor) => (
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
            {actors.length > 6 && (
                <>
                    <Collapse in={showAll}>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                            {actors.slice(6).map((actor) => (
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
                    <Box mt={1} display="flex" justifyContent="center">
                        <IconButton onClick={handleToggleShowAll}>
                            {showAll ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default SecondaryActorList;
