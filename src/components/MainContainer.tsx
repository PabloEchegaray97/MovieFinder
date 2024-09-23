import React from 'react';
import { MainContainerProps } from '../types';

const MainContainer: React.FC<MainContainerProps> = ({ navbarHeight, children }) => {
    return (
        <div style={{ marginTop: navbarHeight}}>
            {children}
        </div>
    );
};

export default MainContainer;
