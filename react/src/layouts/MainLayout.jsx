import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import styles from './MainLayout.module.css';

const MainLayout = ({ headerTitle, pendingCount = 0, currentUser = {} }) => {
    const location = useLocation();

    // 1. حالة التحكم بالقائمة الجانبية
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // 2. مراقبة حجم الشاشة لطي القائمة تلقائياً في الشاشات الصغيرة
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize(); 
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebarMobile = () => { if (window.innerWidth <= 1024) setIsSidebarOpen(false); };

    const isAuditPage = location.pathname.includes('/admin/audit-logs');
    // 🟢 تم مسح isReportsPage من هنا

    const getDynamicTitle = () => {
        if (isAuditPage) return 'سجلات التدقيق';
        if (location.pathname.includes('review')) return 'مراجعة بيانات الطلب';
        if (location.pathname.includes('pending-requests')) return 'قائمة الطلبات المعلّقة';
        if (location.pathname.includes('users')) return 'إدارة مستخدمي النظام';
        if (location.pathname.includes('services')) return 'إدارة الخدمات الحكومية';
        if (location.pathname.includes('verify-qr')) return 'واجهة التحقق الخارجي QR';
        return headerTitle || 'نظام يقين الرقمي';
    };

    let activeRole = '';
    if (currentUser?.roles && Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
        activeRole = currentUser.roles[0]; 
    } else if (currentUser?.role) {
        activeRole = currentUser.role;
    } else {
        activeRole = localStorage.getItem('userRole') || 'جاري التحقق...';
    }

    const getDynamicSubtitle = () => {
        if (isAuditPage) return 'سجل غير قابل للحذف - Audit Log';
        return activeRole;
    };

    return (
        <div className={styles.layoutContainer}>
            <Sidebar currentUser={currentUser} pendingCount={pendingCount} isOpen={isSidebarOpen} closeSidebar={closeSidebarMobile} />
            
            {isSidebarOpen && <div className={styles.mobileOverlay} onClick={closeSidebarMobile}></div>}

            <div className={styles.mainWrapper}>
                <Header
                    title={getDynamicTitle()}
                    subtitle={getDynamicSubtitle()} 
                    currentUser={currentUser}
                    activeRole={activeRole} 
                    toggleSidebar={toggleSidebar} 
                />
                
                <main className={`${styles.contentArea} ${isAuditPage ? styles.auditContent : ''}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;