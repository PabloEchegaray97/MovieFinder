// src/components/NavBar.tsx

import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface NavBarProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({ darkMode, setDarkMode }) => {

    return (
        <AppBar className='navbar'>
            <Toolbar className='navbar-content'>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    MovieFinder
                </Typography>
                <Box display="flex" alignItems="center">
                    <Switch
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        icon={<Brightness7Icon />}
                        checkedIcon={<Brightness4Icon />}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
