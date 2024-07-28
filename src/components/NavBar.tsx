import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Box from '@mui/material/Box';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Link } from 'react-router-dom';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import { Button, InputLabel, TextField } from '@mui/material';

interface NavBarProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    setNavbarHeight: (height: number) => void;
    onSearch: (type: string, query: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ darkMode, setDarkMode, setNavbarHeight, onSearch }) => {
    const navbarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState<string>('movie');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expanded, setExpanded] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.clientHeight);
        }
    }, [setNavbarHeight]);

    const handleSearchTypeChange = (event: SelectChangeEvent) => {
        setSearchType(event.target.value as string);
    };

    const handleSearch = () => {
        onSearch(searchType, searchQuery);
        navigate('/');
        setExpanded(false);
    };

    const handleToggleExpand = () => {
        setExpanded(prev => !prev);
    };

    return (
        <AppBar className={`navbar ${expanded ? 'navbar-expanded' : ''}`} ref={navbarRef}>
            <Toolbar className='navbar-content'>
                <Link to="/" className='navbar-title'>
                    <LocalMoviesIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        MovieFinder
                    </Typography>
                </Link>
                <Box className={`search-options ${expanded ? 'expanded' : ''}`}>
                    <FormControl variant="outlined" size="small" fullWidth>
                        <InputLabel id="search-type-label">Buscar por</InputLabel>
                        <Select
                            labelId="search-type-label"
                            id="search-type-select"
                            value={searchType}
                            onChange={handleSearchTypeChange}
                            label="Buscar por"
                        >
                            <MenuItem value="movie">Película</MenuItem>
                            <MenuItem value="person">Persona</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="filled-search"
                        label="Buscar"
                        type="search"
                        variant="outlined"
                        size='small'
                        className='search-input'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" color="primary" onClick={handleSearch}>
                        Buscar
                    </Button>
                </Box>
                
                <Box display="flex" alignItems="center" >
                    <Switch
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        icon={<Brightness7Icon />}
                        checkedIcon={<Brightness4Icon />}
                        className="xd"
                    />
                </Box>
                {isMobile && (
                    <Button className="toggle-button" onClick={handleToggleExpand}>
                        {expanded ? '▲' : '▼'}
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
