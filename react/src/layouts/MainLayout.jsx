import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import styles from './MainLayout.module.css';

const MainLayout = ({ headerTitle, pendingCount = 0, currentUser = {} }) => {
    const location = useLocation();

    // ✅ تعديل: فحص دقيق للمسار لضمان تفعيل التنسيق الخاص بصفحتك
    const isAuditPage = location.pathname.includes('/admin-audit');
    const isReportsPage = location.pathname.includes('/admin/reports'); // شرط خاص بصفحة التقارير تبعتك
    const getDynamicTitle = () => {
        if (isAuditPage) return 'سجلات التدقيق';
        if (isReportsPage) return 'التقارير و التصدير' ;
        if (location.pathname.includes('review')) return 'مراجعة بيانات الطلب';
        if (location.pathname.includes('pending-requests')) return 'قائمة الطلبات المعلّقة';
        if (location.pathname.includes('users')) return 'إدارة مستخدمي النظام';
        return 'نظام يقين الرقمي';
    };

    const getDynamicSubtitle = () => {
        if (isAuditPage) return 'سجل غير قابل للحذف - Audit Log';
          if (isReportsPage) return'تصدير البيانات بحسب الفترة الزمنية';
        return currentUser.role || 'موظف النظام';
    };

    



    return (
        <div className={styles.layoutContainer}>
            <Sidebar currentUser={currentUser} pendingCount={pendingCount} />
            <div className={styles.mainWrapper}>
                <Header
                    title={getDynamicTitle()}
                    subtitle={getDynamicSubtitle()}
                    currentUser={currentUser}
                />
                
                {/* ✅ التعديل السحري هنا:
                   عندما يتحقق شرط isAuditPage، سيتم دمج كلاس auditContent 
                   الذي يمسح الـ padding (30px) ويغير الخلفية للرمادي المطلوب.
                */}
                <main className={`${styles.contentArea} ${isAuditPage ? styles.auditContent : ''}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;