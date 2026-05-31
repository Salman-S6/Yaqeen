import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/authService';
import {
    FaUsers,
    FaFileAlt,
    FaChartBar,
    FaSignOutAlt,
    FaUserCircle,
    FaThLarge,
    FaChartLine,
    FaEye,
    FaQrcode,
    FaServer,
    FaTimes,
    FaFolderOpen
} from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = ({
    currentUser = {},
    pendingCount = 0,
    isOpen,
    closeSidebar,
    toggleSidebar
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [livePendingCount, setLivePendingCount] = useState(pendingCount);

    useEffect(() => {
        setLivePendingCount(pendingCount);

        const handleUpdateCount = (event) => {
            setLivePendingCount(event.detail);
        };

        window.addEventListener('updatePendingCount', handleUpdateCount);
        return () => window.removeEventListener('updatePendingCount', handleUpdateCount);
    }, [pendingCount]);

    let userRole = '';

    if (currentUser?.roles && Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
        userRole = currentUser.roles[0];
    } else if (currentUser?.role) {
        userRole = currentUser.role;
    } else {
        userRole = localStorage.getItem('userRole') || 'employee';
    }

    const isAdmin = String(userRole).toLowerCase() === 'admin' || userRole === 'مدير النظام';
    const profilePath = isAdmin ? '/admin/profile' : '/employee/profile';

    const displayName =
        currentUser?.name ||
        currentUser?.full_name ||
        currentUser?.username ||
        (isAdmin ? 'مدير النظام' : 'مستخدم النظام');

    const displayEmail =
        currentUser?.email ||
        'بريد غير متوفر';

    const displayInitials =
        currentUser?.initials ||
        (isAdmin ? 'A' : 'E');

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch {
            console.error('فشل تسجيل الخروج من السيرفر، يتم الخروج محلياً...');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            window.location.replace('/login');
        }
    };

    const isActive = (path) => {
        if (location.pathname.includes('/admin/review-request')) {
            return path === '/admin/all-requests';
        }

        if (location.pathname.includes('/employee/review-request')) {
            return path === '/employee/pending-requests';
        }

        return location.pathname.startsWith(path);
    };

    const handleNavigate = (path) => {
        navigate(path);

        if (typeof closeSidebar === 'function') {
            closeSidebar();
        }
    };

    const handleGoToProfile = () => {
        navigate(profilePath);
        setIsProfileMenuOpen(false);

        if (typeof closeSidebar === 'function') {
            closeSidebar();
        }
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
            {isOpen && (
                <button
                    type="button"
                    className={styles.sidebarToggleBtn}
                    onClick={toggleSidebar}
                    title="إغلاق القائمة الجانبية"
                >
                    <FaTimes />
                </button>
            )}

            <div className={styles.logoSection}>
                <h2 className={styles.logoText}>يَقِين</h2>
            </div>

            <nav className={styles.navMenu}>
                {isAdmin ? (
                    <>
                        <div
                            className={`${styles.navItem} ${isActive('/admin/users') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/admin/users')}
                        >
                            <FaUsers className={styles.navIcon} />
                            <span>إدارة المستخدمين</span>
                        </div>

                        <div
                            className={`${styles.navItem} ${isActive('/admin/all-requests') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/admin/all-requests')}
                        >
                            <FaFolderOpen className={styles.navIcon} />
                            <span>سجل الطلبات</span>
                        </div>

                        <div
                            className={`${styles.navItem} ${isActive('/admin/audit-logs') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/admin/audit-logs')}
                        >
                            <FaFileAlt className={styles.navIcon} />
                            <span>سجلات التدقيق</span>
                        </div>

                        <div
                            className={`${styles.navItem} ${isActive('/admin/stats') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/admin/stats')}
                        >
                            <FaChartBar className={styles.navIcon} />
                            <span>إحصائيات النظام</span>
                        </div>

                        <div
                            className={`${styles.navItem} ${isActive('/admin/performance') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/admin/performance')}
                        >
                            <FaChartLine className={styles.navIcon} />
                            <span>أداء الموظفين</span>
                        </div>

                        <div
                            className={`${styles.navItem} ${isActive('/admin/ocr') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/admin/ocr')}
                        >
                            <FaEye className={styles.navIcon} />
                            <span>مراقبة OCR</span>
                        </div>

                        <div
                            className={`${styles.navItem} ${isActive('/admin/verify-qr') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/admin/verify-qr')}
                        >
                            <FaQrcode className={styles.navIcon} />
                            <span>التحقق الخارجي QR</span>
                        </div>

                        <div
                            className={`${styles.navItem} ${isActive('/admin/services') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/admin/services')}
                        >
                            <FaServer className={styles.navIcon} />
                            <span>إدارة الخدمات</span>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className={`${styles.navItem} ${isActive('/employee/dashboard') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/employee/dashboard')}
                        >
                            <FaThLarge className={styles.navIcon} />
                            <span>لوحة التحكم</span>
                        </div>

                        <div
                            className={`${styles.navItem} ${isActive('/employee/pending-requests') ? styles.active : ''}`}
                            onClick={() => handleNavigate('/employee/pending-requests')}
                        >
                            <FaFileAlt className={styles.navIcon} />
                            <span>الطلبات المعلّقة</span>

                            {livePendingCount > 0 && (
                                <span className={styles.navBadge}>{livePendingCount}</span>
                            )}
                        </div>
                    </>
                )}
            </nav>

            <div className={styles.userSection}>
                {isProfileMenuOpen && (
                    <div className={styles.profileMenu}>
                        <div className={styles.profileHeader}>
                            {displayEmail}
                        </div>

                        <ul className={styles.menuList}>
                            <li onClick={handleGoToProfile}>
                                <FaUserCircle className={styles.menuIcon} />
                                <span>الملف الشخصي</span>
                            </li>

                            <li onClick={handleLogout} className={styles.logoutBtn}>
                                <FaSignOutAlt className={styles.menuIcon} />
                                <span>تسجيل الخروج</span>
                            </li>
                        </ul>
                    </div>
                )}

                <div
                    className={styles.userInfo}
                    onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                    <div className={styles.avatar}>{displayInitials}</div>

                    <div className={styles.userDetails}>
                        <h4 className={styles.userName}>{displayName}</h4>
                        <p className={styles.userRole}>
                            {isAdmin ? 'مدير النظام' : 'موظف النظام'}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;