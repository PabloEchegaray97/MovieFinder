import React from 'react';
import { Box, Typography } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link } from 'react-router-dom';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import { useTheme } from '@mui/material/styles';
import Icon from '@mdi/react';
import { mdiReact, mdiLanguageTypescript } from '@mdi/js';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode'; // Representa Material-UI
import { mdiMaterialUi } from '@mdi/js';

interface FooterProps {
    darkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({darkMode}) => {
    const theme = useTheme();

    return (
        <footer className='footer-container d-center' style={{
            backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.9)',
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09))'

        }}>
            <Box>
                <Link to="/" className="navbar-title" style={{ display: 'flex', alignItems: 'center', color: theme.palette.text.primary }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: theme.palette.text.primary, textAlign: 'center' }} className='footer-logo-container'>
                        <MovieFilterOutlinedIcon sx={{ color: theme.palette.text.primary, marginRight: '.5rem' }} />
                        <span className='text-thin text-size-1'>MovieFinder</span>
                    </Typography>
                </Link>
                <Box className='d-center footer-links'>
                    <Link to="/" className='footer-link' style={{ color: theme.palette.text.primary }}>Link 1</Link>
                    <Link to="/" className='footer-link' style={{ color: theme.palette.text.primary }}>Link 2</Link>
                    <Link to="/" className='footer-link' style={{ color: theme.palette.text.primary }}>Link 3</Link>
                </Box>
                <Box className="d-center">
                    <LinkedInIcon sx={{ marginRight: 2, cursor: 'pointer', fontSize: '180%' }} />
                    <GitHubIcon sx={{ cursor: 'pointer', fontSize: '180%' }} />
                </Box>
                <Box className="d-center mtop">
                    <Typography>Hecho con:</Typography>
                </Box>
                <Box className="d-center footer-links">
                    <Icon path={mdiMaterialUi} size={1.2} className='footer-icon' />
                    <Icon path={mdiReact} size={1.2} />
                    <Icon path={mdiLanguageTypescript} size={1.2} />
                </Box>



            </Box>
        </footer>
    );
}

export default Footer;
