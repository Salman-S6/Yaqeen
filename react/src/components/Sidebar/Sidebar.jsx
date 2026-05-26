import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../api/authService';
import {
    FaUsers, FaFileAlt, FaChartBar, FaSignOutAlt,
    FaCog, FaThLarge, FaChartLine, FaEye, 
    FaQrcode,
    FaServer // 🚨 استيراد أيقونة السيرفر لإدارة الخدمات
} from 'react-icons/fa';
import styles from './Sidebar.module.css';

const Sidebar = ({ currentUser = {}, pendingCount = 0 }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    let userRole = '';
    if (currentUser?.roles && Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
        userRole = currentUser.roles[0];
    } else if (currentUser?.role) {
        userRole = currentUser.role;
    } else {
        userRole = localStorage.getItem('userRole') || '';
    }

    const isAdmin = 
        String(userRole).toLowerCase() === "admin" || 
        userRole === "مدير النظام";

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("فشل تسجيل الخروج من السيرفر، يتم الخروج محلياً...");
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            window.location.replace('/login');
        }
    };

    const isActive = (path) => {
        if (path === '/admin' || path === '/employee') return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoSection}>
                <h2 className={styles.logoText}>يَقِين</h2>
            </div>

            <nav className={styles.navMenu}>
                {isAdmin ? (
                    /* قائمة مدير النظام (Admin) */
                    <>
                        <div className={`${styles.navItem} ${isActive('/admin/users') ? styles.active : ''}`} onClick={() => navigate('/admin/users')}>
                            <FaUsers className={styles.navIcon} />
                            <span>إدارة المستخدمين</span>
                        </div>
                        <div className={`${styles.navItem} ${isActive('/admin/stats') ? styles.active : ''}`} onClick={() => navigate('/admin/stats')}>
                            <FaChartBar className={styles.navIcon} />
                            <span>إحصائيات النظام</span>
                        </div>
                        <div className={`${styles.navItem} ${isActive('/admin/performance') ? styles.active : ''}`} onClick={() => navigate('/admin/performance')}>
                            <FaChartLine className={styles.navIcon} />
                            <span>أداء الموظفين</span>
                        </div>
                        <div className={`${styles.navItem} ${isActive('/admin/ocr') ? styles.active : ''}`} onClick={() => navigate('/admin/ocr')}>
                            <FaEye className={styles.navIcon} />
                            <span>مراقبة OCR</span>
                        </div>
                        <div className={`${styles.navItem} ${isActive('/admin/verify-qr') ? styles.active : ''}`} onClick={() => navigate('/admin/verify-qr')}>
                            <FaQrcode className={styles.navIcon} />
                            <span>التحقق الخارجي QR</span>
                        </div>
                        {/* 🚨 زر واجهة إدارة الخدمات الفعالة الجديد داخل قائمة الأدمن فقط 🚨 */}
                        <div className={`${styles.navItem} ${isActive('/admin/services') ? styles.active : ''}`} onClick={() => navigate('/admin/services')}>
                            <FaServer className={styles.navIcon} />
                            <span>إدارة الخدمات</span>
                        </div>
                    </>
                ) : (
                    /* قائمة الموظف (Employee) */
                    <>
                        <div className={`${styles.navItem} ${isActive('/employee/dashboard') ? styles.active : ''}`} onClick={() => navigate('/employee/dashboard')}>
                            <FaThLarge className={styles.navIcon} />
                            <span>لوحة التحكم</span>
                        </div>
                        <div className={`${styles.navItem} ${isActive('/employee/pending-requests') ? styles.active : ''}`} onClick={() => navigate('/employee/pending-requests')}>
                            <FaFileAlt className={styles.navIcon} />
                            <span>الطلبات المعلّقة</span>
                            {pendingCount > 0 && <span className={styles.navBadge}>{pendingCount}</span>}
                        </div>
                    </>
                )}
            </nav>

            <div className={styles.userSection}>
                {isProfileMenuOpen && (
                    <div className={styles.profileMenu}>
                        <div className={styles.profileHeader}>{currentUser?.email || localStorage.getItem('userEmail')}</div>
                        <ul className={styles.menuList}>
                            <li><FaCog className={styles.menuIcon} /><span>إعدادات الحساب</span></li>
                            <li onClick={handleLogout} className={styles.logoutBtn}>
                                <FaSignOutAlt className={styles.menuIcon} /><span>تسجيل الخروج</span>
                            </li>
                        </ul>
                    </div>
                )}

                <div className={styles.userInfo} onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                    <div className={styles.avatar}>{currentUser?.initials || 'Admin'}</div>
                    <div className={styles.userDetails}>
                        <h4 className={styles.userName}>{currentUser?.name || 'مدير النظام'}</h4>
                        <p className={styles.userRole}>{userRole}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;