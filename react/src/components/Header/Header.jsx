import React from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './Header.module.css';

const Header = ({ title, subtitle, toggleSidebar, showSidebarButton = true }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerRight}>
        {showSidebarButton && (
          <button
            className={styles.menuToggleBtn}
            onClick={toggleSidebar}
            type="button"
            title="فتح القائمة الجانبية"
          >
            <FaBars />
          </button>
        )}

        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      <div className={styles.actions}></div>
    </header>
  );
};

export default Header;
