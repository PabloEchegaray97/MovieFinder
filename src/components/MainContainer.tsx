import React from 'react';

interface MainContainerProps {
    navbarHeight: number;
    children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ navbarHeight, children }) => {
    return (
        <div style={{ marginTop: navbarHeight}}>
            {children}
        </div>
    );
};

export default MainContainer;
