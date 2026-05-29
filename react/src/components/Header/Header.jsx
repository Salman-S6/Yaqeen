import React from 'react';
import { FaBars } from 'react-icons/fa'; // 🟢 تم حذف FaBell بالكامل
import styles from './Header.module.css';

const Header = ({ title, subtitle, currentUser = {}, activeRole = '', toggleSidebar }) => {
  return (
    <header className={styles.header}>
      {/* 🟢 تجميعة زر القائمة + العنوان */}
      <div className={styles.headerRight}>
        <button className={styles.menuToggleBtn} onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      {/* 🟢 مساحة فارغة لترتيب العناصر إذا أردت إضافة شيء مستقبلاً مثل زر بحث سريع */}
      <div className={styles.actions}>
          {/* تم حذف جرس الإشعارات والقائمة المنسدلة بالكامل */}
      </div>
    </header>
  );
};

export default Header;