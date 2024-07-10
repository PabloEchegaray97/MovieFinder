import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import NavBar from './components/NavBar';
import MainContainer from './components/MainContainer';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieDetails from './components/MovieDetails';
import ActorDetails from './components/ActorDetails';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode !== null ? savedDarkMode === 'true' : true;
  });

  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <NavBar darkMode={darkMode} setDarkMode={setDarkMode} setNavbarHeight={setNavbarHeight} />
        <MainContainer navbarHeight={navbarHeight}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/actor/:id" element={<ActorDetails />} />
          </Routes>
        </MainContainer>
      </Router>
    </ThemeProvider>
  );
};

export default App;
