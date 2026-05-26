import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Header from '../components/Header/Header';
import styles from './MainLayout.module.css';

const MainLayout = ({ headerTitle, pendingCount = 0, currentUser = {} }) => {
    const location = useLocation();

    // 🟢 تعديل الـ Lead: فحص دقيق للمسارات المتداخلة (Nested Routes) لضمان تفعيل التنسيق والـ Active Tabs
    const isAuditPage = location.pathname.includes('/admin/audit-logs');
    const isReportsPage = location.pathname.includes('/admin/reports'); 

    const getDynamicTitle = () => {
        if (isAuditPage) return 'سجلات التدقيق';
        if (isReportsPage) return 'التقارير و التصدير';
        if (location.pathname.includes('review')) return 'مراجعة بيانات الطلب';
        if (location.pathname.includes('pending-requests')) return 'قائمة الطلبات المعلّقة';
        if (location.pathname.includes('users')) return 'إدارة مستخدمي النظام';
        if (location.pathname.includes('services')) return 'إدارة الخدمات الحكومية';
        if (location.pathname.includes('verify-qr')) return 'واجهة التحقق الخارجي QR';
        return headerTitle || 'نظام يقين الرقمي';
    };

    // 🟢 استخراج الصلاحية ودور المستخدم ديناميكياً من السيرفر بالتوافق مع الـ main
    let activeRole = '';
    if (currentUser?.roles && Array.isArray(currentUser.roles) && currentUser.roles.length > 0) {
        activeRole = currentUser.roles[0]; 
    } else if (currentUser?.role) {
        activeRole = currentUser.role;
    } else {
        activeRole = localStorage.getItem('userRole') || 'جاري التحقق...';
    }

    // 🟢 دمج ذكي للـ Subtitle: مخصص لصفحات بتول، وديناميكي بالدور لباقي أجزاء المنصة
    const getDynamicSubtitle = () => {
        if (isAuditPage) return 'سجل غير قابل للحذف - Audit Log';
        if (isReportsPage) return 'تصدير البيانات بحسب الفترة الزمنية';
        return activeRole;
    };

    return (
        <div className={styles.layoutContainer}>
            <Sidebar currentUser={currentUser} pendingCount={pendingCount} />
            <div className={styles.mainWrapper}>
                <Header
                    title={getDynamicTitle()}
                    subtitle={getDynamicSubtitle()} // 👈 تفعيل العنوان الفرعي المدمج الذكي
                    currentUser={currentUser}
                    activeRole={activeRole} // 👈 نمررها لكي يستخدمها الهيدر في الإشعارات والتحقق الصارم
                />
                
                {/* 🟢 التعديل السحري المتوافق مع كلاسات بتول لضبط بادينغ صفحة التدقيق */}
                <main className={`${styles.contentArea} ${isAuditPage ? styles.auditContent : ''}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;