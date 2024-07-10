import React, { useState } from 'react';
import MovieSearch from './MovieSearch';
import ActorSearch from './ActorSearch';
import SearchToggle from './SearchToggle'
import { Box } from '@mui/material';

const Home: React.FC = () => {
    const [searchType, setSearchType] = useState<string>('movie');

    return (
        <section className='home'>
            <Box mb={2}>
                <SearchToggle searchType={searchType} setSearchType={setSearchType} />
            </Box>
            {searchType === 'movie' ? <MovieSearch /> : <ActorSearch />}
        </section>
    );
};

export default Home;
