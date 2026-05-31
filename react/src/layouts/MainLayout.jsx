import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import { getPrimaryRole, normalizeRole } from '../utils/auth';
import styles from './MainLayout.module.css';

const MainLayout = ({ headerTitle, pendingCount = 0, currentUser = {} }) => {
    const location = useLocation();

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [pendingCountState, setPendingCountState] = useState(pendingCount);

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

    useEffect(() => {
        setPendingCountState(pendingCount);
    }, [pendingCount]);

    useEffect(() => {
        const handler = (event) => {
            if (event && typeof event.detail === 'number') {
                setPendingCountState(event.detail);
            }
        };

        window.addEventListener('updatePendingCount', handler);
        return () => window.removeEventListener('updatePendingCount', handler);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const closeSidebarMobile = () => {
        if (window.innerWidth <= 1024) {
            setIsSidebarOpen(false);
        }
    };

    const isAuditPage = location.pathname.includes('/admin/audit-logs');

    const getDynamicTitle = () => {
        if (isAuditPage) return 'سجلات التدقيق';
        if (location.pathname.includes('profile')) return 'الملف الشخصي';
        if (location.pathname.includes('review')) return 'مراجعة بيانات الطلب';
        if (location.pathname.includes('pending-requests')) return 'قائمة الطلبات المعلّقة';
        if (location.pathname.includes('users')) return 'إدارة مستخدمي النظام';
        if (location.pathname.includes('services')) return 'إدارة الخدمات الحكومية';
        if (location.pathname.includes('verify-qr')) return 'واجهة التحقق الخارجي QR';

        return headerTitle || 'نظام يقين الرقمي';
    };

    const getDynamicSubtitle = () => {
        if (isAuditPage) return 'سجل غير قابل للحذف - Audit Log';

        const role = normalizeRole(getPrimaryRole(currentUser));

        if (role === 'admin') return 'مدير النظام';
        if (role === 'employee') return 'موظف النظام';

        return 'جاري التحقق...';
    };

    return (
        <div className={styles.layoutContainer}>
            <Sidebar
                currentUser={currentUser}
                pendingCount={pendingCountState}
                isOpen={isSidebarOpen}
                closeSidebar={closeSidebarMobile}
                toggleSidebar={toggleSidebar}
            />

            {isSidebarOpen && (
                <div
                    className={styles.mobileOverlay}
                    onClick={closeSidebarMobile}
                ></div>
            )}

            <div className={styles.mainWrapper}>
                <Header
                    title={getDynamicTitle()}
                    subtitle={getDynamicSubtitle()}
                    toggleSidebar={toggleSidebar}
                    showSidebarButton={!isSidebarOpen}
                />

                <main className={`${styles.contentArea} ${isAuditPage ? styles.auditContent : ''}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;