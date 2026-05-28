import React, { useState, useEffect } from 'react';
import PerformanceTable from '../../../components/PerformanceTable/PerformanceTable';
import StatCard from '../../../components/StatCard/StatCard';
import { employeeService } from '../../../api/employeeService'; // 🟢 استدعاء مسارات الأدمن الحقيقية
import { FaUserCheck, FaPercent, FaExclamationTriangle } from 'react-icons/fa';
import styles from './AdminPerfPage.module.css';

const AdminPerfPage = () => {
    // 🟢 حالات تخزين البيانات من الباك-إند
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🟢 جلب البيانات عند فتح الصفحة
    useEffect(() => {
        const fetchPerformanceStats = async () => {
            try {
                const response = await employeeService.getPerformanceDashboard();
                // حماية للحصول على البيانات سواء كانت داخل data.data أو data مباشرة
                setDashboardData(response.data?.data || response.data);
            } catch (error) {
                console.error("خطأ في جلب بيانات أداء الموظفين:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPerformanceStats();
    }, []);

    if (loading) {
        return <div className={styles.loading}>جاري تحليل أداء الفريق...</div>;
    }

    // 🟢 تجهيز البيانات بعد وصولها للحماية من الأخطاء
    const kpis = dashboardData?.kpis || {};
    const employees = dashboardData?.employee_performance || [];

    return (
        <div className={styles.container}>
            {/* ✂️ تم حذف قسم الـ <header> بالكامل من هنا لكي لا يتكرر العنوان والجرس */}

            <div className={styles.summaryGrid}>
                {/* 🟢 ربط البطاقة الخضراء (الأعلى أداءً) */}
                <StatCard 
                    title="الأعلى أداءً" 
                    value={kpis.top_performer_name || "لا يوجد بيانات"} 
                    icon={<FaUserCheck size={28} />} 
                    color="#10b981" 
                    subText="بناءً على التقييم الكلي"
                />
                
                {/* 🟢 ربط البطاقة الزرقاء (كفاءة الفريق) */}
                <StatCard 
                    title="كفاءة الفريق" 
                    value={`${kpis.team_efficiency || 0}%`} 
                    icon={<FaPercent size={28} />} 
                    color="#3b82f6" 
                    subText="متوسط الإنتاجية اليوم"
                />
                
                {/* 🟢 ربط البطاقة الحمراء (إجمالي التجاوزات) */}
                <StatCard 
                    title="إجمالي التجاوزات" 
                    value={kpis.weekly_sla_breaches?.toString() || "0"} 
                    icon={<FaExclamationTriangle size={28} />} 
                    color="#ef4444" 
                    subText="تجاوزات SLA الأسبوعية"
                    subColor="#ef4444"
                />
            </div>

            <div className={styles.tableSection}>
                {/* 🟢 تمرير مصفوفة الموظفين للجدول */}
                <PerformanceTable data={employees} />
            </div>
        </div>
    );
};

export default AdminPerfPage;