import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import styles from './MainLayout.module.css';

const MainLayout = ({ headerTitle, pendingCount = 0, currentUser = {} }) => {
    const location = useLocation();

    const getDynamicTitle = () => {
        if (headerTitle) return headerTitle;
        if (location.pathname.includes('review')) return 'مراجعة بيانات الطلب';
        if (location.pathname.includes('pending-requests')) return 'قائمة الطلبات المعلّقة';
        if (location.pathname.includes('users')) return 'إدارة مستخدمي النظام';
        return 'نظام يقين الرقمي';
    };

    // 💡 استخراج الصلاحية بنفس الطريقة الذكية التي استخدمناها في القائمة الجانبية
    let activeRole = '';
    if (currentUser?.roles && Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
        activeRole = currentUser.roles[0]; // سحب الكلمة من المصفوفة
    } else if (currentUser?.role) {
        activeRole = currentUser.role;
    } else {
        activeRole = localStorage.getItem('userRole') || 'جاري التحقق...';
    }

    return (
        <div className={styles.layoutContainer}>
            <Sidebar currentUser={currentUser} pendingCount={pendingCount} />
            <div className={styles.mainWrapper}>
                <Header
                    title={getDynamicTitle()}
                    subtitle={activeRole} // 👈 نمرر الصلاحية بعد استخراجها بشكل صحيح
                    currentUser={currentUser}
                    activeRole={activeRole} // 👈 نمررها لكي يستخدمها الهيدر في الإشعارات
                />
                <main className={styles.contentArea}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;