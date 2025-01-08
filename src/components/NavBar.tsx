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
import { Button, InputLabel, TextField, IconButton, Collapse } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useTheme } from '@mui/material/styles';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';

interface NavBarProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
    setNavbarHeight: (height: number) => void;
    onSearch: (type: string, query: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ darkMode, setDarkMode, setNavbarHeight, onSearch }) => {
    const theme = useTheme();
    const navbarRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [searchType, setSearchType] = useState<string>('movie');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [expanded, setExpanded] = useState<boolean>(false);
    const [genres, setGenres] = useState<{ id: number, name: string }[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | string>('');
    const apiKey = import.meta.env.VITE_API_KEY;
    useEffect(() => {
        if (searchType === 'genre' && genres.length === 0) {
            // Llamada a la API para obtener los géneros
            const fetchGenres = async () => {
                try {
                    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es-ES`);
                    const data = await response.json();
                    setGenres(data.genres);
                    console.log(data.genres);
                    
                } catch (error) {
                    console.error('Error fetching genres:', error);
                }
            };
    
            fetchGenres();
        }
    }, [searchType, genres, apiKey]);
    

    useEffect(() => {
        if (navbarRef.current) {
            setNavbarHeight(navbarRef.current.clientHeight);
        }
    }, [setNavbarHeight]);

    const handleSearchTypeChange = (event: SelectChangeEvent) => {
        setSearchType(event.target.value as string);
    };

    const handleSearch = () => {
        if (searchType === 'genre') {
            onSearch(searchType, selectedGenre.toString()); // Pasa el ID del género como query
        } else {
            onSearch(searchType, searchQuery);
        }
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
                    <Link to="/" className="navbar-title" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ display: 'flex', alignItems: 'center', color: darkMode ? 'white' : 'black' }}>
                        <LocalMoviesIcon sx={{  color: darkMode ? 'white' : 'black' }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: darkMode ? 'white' : 'black' }}>
                            <span className='text-thin'>MovieFinder</span>
                        </Typography>
                    </Link>


                </Box>
                <Box className="nav-buttons">
                    <Box display="flex" alignItems="center" className="darkmode-switch">
                        <Switch
                            className='switch'
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                            icon={<Brightness7Icon sx={{ color: darkMode ? 'white' : 'black' }} />}
                            checkedIcon={<Brightness4Icon sx={{ color: darkMode ? 'white' : 'black' }} />}
                            sx={{
                                '& .MuiSwitch-switchBase': {
                                    color: darkMode ? 'white' : 'black', // Color del ícono cuando no está marcado
                                    '&.Mui-checked': {
                                        color: 'white', // Color del ícono cuando está marcado
                                    },
                                    '&.Mui-checked + .MuiSwitch-track': {
                                        backgroundColor: 'white', // Color de fondo de la pista cuando está marcado
                                    },
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor:'black'  // Color de fondo de la pista cuando no está marcado
                                },
                            }}
                        />
                    </Box>
                    <IconButton onClick={handleToggleExpand} sx={{ color: darkMode ? 'white' : 'black' }}>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>
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
                            className='mod-select'
                        >
                            <MenuItem value="movie">Película</MenuItem>
                            <MenuItem value="person">Persona</MenuItem>
                            <MenuItem value="genre">Genero</MenuItem>

                        </Select>
                    </FormControl>
                    {searchType === 'genre' ? (
                        <FormControl variant="outlined" size="small" fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="genre-select-label">Seleccionar género</InputLabel>
                            <Select
                                labelId="genre-select-label"
                                id="genre-select"
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(Number(e.target.value))}
                                label="Seleccionar género"
                            >
                                {genres.map((genre) => (
                                    <MenuItem key={genre.id} value={genre.id}>
                                        {genre.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
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
                    />)}
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        sx={{   
                            mt: 2,
                            bgcolor: theme.palette.text.primary,
                            '&:hover': {
                                bgcolor: theme.palette.text.secondary
                            }
                        }}

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
