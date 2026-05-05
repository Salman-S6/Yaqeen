import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaFileAlt, FaChartBar, FaSignOutAlt, FaCog, FaThLarge } from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = ({ currentUser = {}, pendingCount = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // التحقق من الدور بناءً على النص العربي كما في كودك الأصلي
    const isAdmin = currentUser?.role === "مدير النظام";

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const isActive = (path) => location.pathname.includes(path);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoSection}>
                <h2 className={styles.logoText}>يَقِين</h2>
            </div>

            <nav className={styles.navMenu}>
                {isAdmin ? (
                    <>
                        <div
                            className={`${styles.navItem} ${isActive('/admin/users') ? styles.active : ''}`}
                            onClick={() => navigate('/admin/users')}
                        >
                            <FaUsers className={styles.navIcon} />
                            <span>إدارة المستخدمين</span>
                        </div>
                        <div className={styles.navItem}>
                            <FaChartBar className={styles.navIcon} />
                            <span>إحصائيات النظام</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className={`${styles.navItem} ${isActive('/employee-dashboard') ? styles.active : ''}`}
                            onClick={() => navigate('/employee-dashboard')}
                        >
                            <FaThLarge className={styles.navIcon} />
                            <span>لوحة التحكم</span>
                        </div>

                        <div
                            className={`${styles.navItem} ${isActive('/employee/pending-requests') || isActive('/pending-requests') ? styles.active : ''}`}
                            onClick={() => navigate('/employee/pending-requests')}
                        >
                            <FaFileAlt className={styles.navIcon} />
                            <span>الطلبات المعلّقة</span>
                            {pendingCount > 0 && (
                                <span className={styles.navBadge}>{pendingCount}</span>
                            )}
                        </div>
                    </>
                )}
            </nav>

            <div className={styles.userSection}>
                {isProfileMenuOpen && (
                    <div className={styles.profileMenu}>
                        <div className={styles.profileHeader}>
                            {currentUser?.email}
                        </div>
                        <ul>
                            <li><FaCog style={{ marginLeft: '10px' }} /> إعدادات الحساب</li>
                            <li onClick={handleLogout} className={styles.logoutBtn}>
                                <FaSignOutAlt style={{ marginLeft: '10px' }} /> تسجيل الخروج
                            </li>
                        </ul>
                    </div>
                )}

                <div className={styles.userInfo} onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                    <div className={styles.avatar}>{currentUser?.initials}</div>
                    <div className={styles.userDetails}>
                        <h4 className={styles.userName}>{currentUser?.name}</h4>
                        <p className={styles.userRole}>{currentUser?.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;