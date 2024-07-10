import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';

interface Actor {
    id: number;
    name: string;
    profile_path: string | null;
}

interface ActorListProps {
    actors: Actor[];
}

const ActorList: React.FC<ActorListProps> = ({ actors }) => {
    return (
        <List>
            {actors.map((actor) => (
                <ListItem key={actor.id} component={Link} to={`/actor/${actor.id}`} button>
                    <ListItemAvatar>
                        <Avatar
                            alt={actor.name}
                            src={actor.profile_path ? `https://image.tmdb.org/t/p/w200/${actor.profile_path}` : undefined}
                        />
                    </ListItemAvatar>
                    <ListItemText primary={actor.name} />
                </ListItem>
            ))}
        </List>
    );
};

export default ActorList;
