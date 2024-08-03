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
import { Button, InputLabel, TextField, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

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
        setExpanded((prev) => !prev);
    };

    return (
        <AppBar
            ref={navbarRef}
            sx={{
                transition: 'background 0.3s ease',
                backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
                color: darkMode ? 'white' : 'black',
            }}
        >
            <Toolbar className="navbar-content">
                <Box className="navbar-logo-container" sx={{ color: darkMode ? 'white' : 'black' }}>
                    <Link to="/" className="navbar-title" style={{ display: 'flex', alignItems: 'center', color: darkMode ? 'white' : 'black' }}>
                        <LocalMoviesIcon sx={{ mr: 1, color: darkMode ? 'white' : 'black' }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: darkMode ? 'white' : 'black' }}>
                            MovieFinder
                        </Typography>
                    </Link>

                    <Box display="flex" alignItems="center">
                        <Switch
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                            icon={<Brightness7Icon sx={{ color: darkMode ? 'white' : 'black' }} />}
                            checkedIcon={<Brightness4Icon sx={{ color: darkMode ? 'white' : 'black' }} />}
                        />
                    </Box>
                </Box>

                <IconButton onClick={handleToggleExpand} sx={{ color: darkMode ? 'white' : 'black' }}>
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Toolbar>

            <Collapse in={expanded} className='search-options-container'>
                <Box className="search-options" px={2} pb={2}>
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
                        size="small"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                        sx={{ mt: 2 }}
                        fullWidth
                    >
                        Buscar
                    </Button>
                </Box>
            </Collapse>
        </AppBar>
    );
};

export default NavBar;
