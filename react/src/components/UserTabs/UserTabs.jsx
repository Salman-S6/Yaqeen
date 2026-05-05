import React from 'react';
import styles from './UserTabs.module.css';

const UserTabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className={styles.tabsContainer}>
            <button
                className={activeTab === 'employee' ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab('employee')}
            >
                الفريق الوظيفي
            </button>
            <button
                className={activeTab === 'citizen' ? styles.activeTab : styles.tab}
                onClick={() => setActiveTab('citizen')}
            >
                سجل المواطنين
            </button>
        </div>
    );
};

export default UserTabs;