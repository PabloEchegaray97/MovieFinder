import React from 'react';

interface MainContainerProps {
    navbarHeight: number;
    children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ navbarHeight, children }) => {
    return (
        <div style={{ marginTop: navbarHeight, height: `calc(100vh - ${navbarHeight}px)`, overflowY: 'auto' }}>
            {children}
        </div>
    );
};

export default MainContainer;
