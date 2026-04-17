import React from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import styles from './MainLayout.module.css';

const MainLayout = ({ children, headerTitle, headerSubtitle, pendingCount = 0, currentUser = {} }) => {
    return (
        <div className={styles.layoutContainer}>
            <Sidebar currentUser={currentUser} pendingCount={pendingCount} />
            <div className={styles.mainWrapper}>
                <Header title={headerTitle} subtitle={headerSubtitle} />
                <main className={styles.contentArea}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;