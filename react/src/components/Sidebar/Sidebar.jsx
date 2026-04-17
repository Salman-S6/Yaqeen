import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaSignOutAlt, FaCog } from 'react-icons/fa'; 
import styles from './Sidebar.module.css';

const Sidebar = ({ currentUser = {}, pendingCount = 0 }) => {
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoSection}>
                <h2 className={styles.logoText}>يَقِين</h2>
            </div>

            <nav className={styles.navMenu}>
                <div className={`${styles.navItem} ${styles.active}`}>
                    <FaFileAlt className={styles.navIcon} />
                    <span>الطلبات المعلّقة</span>
                    {pendingCount > 0 && (
                        <span className={styles.navBadge}>{pendingCount}</span>
                    )}
                </div>
            </nav>

            <div className={styles.userSection}>
                {isProfileMenuOpen && (
                    <div className={styles.profileMenu}>
                        <div className={styles.profileHeader}>
                            {currentUser?.email || "user@yaqeen.gov.sy"}
                        </div>
                        <ul>
                            <li><FaCog style={{marginLeft: '10px'}}/> إعدادات الحساب</li>
                            <li onClick={handleLogout} className={styles.logoutBtn}>
                                <FaSignOutAlt style={{marginLeft: '10px'}}/> تسجيل الخروج
                            </li>
                        </ul>
                    </div>
                )}

                <div className={styles.userInfo} onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                    <div className={styles.avatar}>{currentUser?.initials || "??"}</div>
                    <div className={styles.userDetails}>
                        <h4 className={styles.userName}>{currentUser?.name || "مدقق بيانات"}</h4>
                        <p className={styles.userRole}>{currentUser?.role || "مستوى 1"}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;