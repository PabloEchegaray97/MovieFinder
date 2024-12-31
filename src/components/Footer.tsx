import React from 'react';
import { Box, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link, useNavigate } from 'react-router-dom';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import { useTheme } from '@mui/material/styles';
import Icon from '@mdi/react';
import { mdiReact, mdiLanguageTypescript } from '@mdi/js';
import { mdiMaterialUi } from '@mdi/js';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface FooterProps {
    darkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({darkMode}) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleNavigation = (path: string) => {
        navigate(path);
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    return (
        <footer className='footer-container d-center' style={{
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))'

        }}>
            <Box>
                <Link to="/" style={{ textDecoration: 'none' }} onClick={() => handleNavigation('/')}>
                    <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                            flexGrow: 1, 
                            color: theme.palette.text.primary, 
                            textAlign: 'center',
                            cursor: 'pointer'
                        }} 
                        className='footer-logo-container'
                    >
                        <MovieFilterOutlinedIcon sx={{ color: theme.palette.text.primary, marginRight: '.5rem' }} />
                        <span className='text-thin text-size-1'>MovieFinder</span>
                    </Typography>
                </Link>
                <Box className='d-center footer-links'>
                    <Box onClick={() => handleNavigation('/movies')} className='footer-link' style={{ color: theme.palette.text.primary, cursor: 'pointer' }}>Películas</Box>
                    <Box onClick={() => handleNavigation('/genres')} className='footer-link' style={{ color: theme.palette.text.primary, cursor: 'pointer' }}>Géneros</Box>
                    <Box onClick={() => handleNavigation('/artists')} className='footer-link' style={{ color: theme.palette.text.primary, cursor: 'pointer' }}>Personas</Box>
                </Box>
                <Box className="d-center">
                    <LinkedInIcon sx={{ marginRight: 2, cursor: 'pointer', fontSize: '180%' }} />
                    <GitHubIcon sx={{ cursor: 'pointer', fontSize: '180%' }} />
                </Box>
                <Box className="d-center mtop">
                    <Typography>Hecho con:</Typography>
                </Box>
                <Box className="d-center footer-links">
                    <FavoriteIcon className='heart-icon' sx={{ fontSize: '140%' }} />
                    <Icon path={mdiMaterialUi} size={1.2} className='footer-icon' />
                    <Icon path={mdiReact} size={1.2} />
                    <Icon path={mdiLanguageTypescript} size={1.2} />
                </Box>



            </Box>
        </footer>
    );
}

export default Footer;
