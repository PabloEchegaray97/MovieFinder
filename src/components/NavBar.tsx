import React, { useRef, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';
interface NavBarProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    setNavbarHeight: (height: number) => void;
}

const NavBar: React.FC<NavBarProps> = ({ darkMode, setDarkMode, setNavbarHeight }) => {
    const navbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.clientHeight);
        }
    }, [setNavbarHeight]);

    return (
        <AppBar className='navbar' ref={navbarRef}>
            <Toolbar className='navbar-content'>
                <Link to="/" className='navbar-title'>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        MovieFinder
                    </Typography>
                </Link>
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
