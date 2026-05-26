import React from 'react';
import { useAdminStats } from '../../../hooks/useAdminStats';
import AdminStatCard from '../../../components/AdminStatCard/AdminStatCard';
import { DailyBarChart, StatusDonutChart } from '../../../components/Charts/AdminCharts';
import { FiUsers, FiClock, FiCheckCircle, FiFileText } from 'react-icons/fi';
import styles from './AdminStatsPage.module.css';

const AdminStatsPage = () => {
    const { stats, loading, error } = useAdminStats();
    const icons = [<FiFileText />, <FiCheckCircle />, <FiClock />, <FiUsers />];

    if (loading) return <div className={styles.loader}>جاري تحميل الإحصائيات...</div>;
    if (error) return <div className={styles.error}>حدث خطأ: {error}</div>;
    if (!stats) return null;

    // 💡 التعديل هنا: جلب الشهر والسنة الحاليين باللغة العربية ديناميكياً
    const currentMonthYear = new Intl.DateTimeFormat('ar-EG', {
        month: 'long',
        year: 'numeric'
    }).format(new Date());

    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                {stats.summary.map((item, idx) => (
                    <AdminStatCard
                        key={idx}
                        {...item}
                        icon={icons[idx]}
                        trendType={item.trendType}
                    />
                ))}
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    {/* 💡 استخدام المتغير الديناميكي هنا */}
                    <h3 className={styles.chartTitle}>الطلبات اليومية - {currentMonthYear}</h3>
                    <DailyBarChart data={stats.dailyRequests} />
                </div>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>توزيع الحالات</h3>
                    <StatusDonutChart data={stats.statusDistribution} />
                </div>
            </div>
        </div>
    );
};

export default AdminStatsPage;