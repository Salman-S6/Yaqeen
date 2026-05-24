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

    return (
        <div className={styles.layoutContainer}>
            <Sidebar currentUser={currentUser} pendingCount={pendingCount} />
            <div className={styles.mainWrapper}>
                {/* ✅ تمرير currentUser للهيدر ضروري جداً لحل مشكلة الإشعارات */}
                <Header
                    title={getDynamicTitle()}
                    subtitle={currentUser.role}
                    currentUser={currentUser}
                />
                <main className={styles.contentArea}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;