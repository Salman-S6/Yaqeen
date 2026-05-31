import React, { useState, useEffect, useCallback } from 'react';
import { employeeService } from '../../api/employeeService';
import { getApiErrorMessage, getResponseData } from '../../utils/apiResponse';
import AdminStatCard from '../../components/AdminStatCard/AdminStatCard';
import { DailyBarChart, StatusDonutChart } from '../../components/Charts/AdminCharts';
import { FiUsers, FiClock, FiCheckCircle, FiFileText, FiUserPlus } from 'react-icons/fi';
import styles from './AdminStatsPage.module.css';

const AdminStatsPage = () => {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await employeeService.getAdminStats();
            setStatsData(getResponseData(response, null));
        } catch (err) {
            console.error('فشل جلب إحصائيات النظام:', err);
            setStatsData(null);
            setError(getApiErrorMessage(err, 'فشل تحميل إحصائيات النظام.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return <div className={styles.loader}>جاري تحميل الإحصائيات المركزية...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <button type="button" onClick={fetchStats}>إعادة المحاولة</button>
            </div>
        );
    }

    if (!statsData) {
        return <div className={styles.error}>لم يتم العثور على بيانات للإحصائيات.</div>;
    }

    const currentMonthYear = new Intl.DateTimeFormat('ar-EG', {
        month: 'long',
        year: 'numeric'
    }).format(new Date());

    const kpis = statsData.kpis || {};

    const summaryCards = [
        {
            title: 'إجمالي الطلبات',
            value: kpis.total_requests || 0,
            subText: 'كافة الطلبات المسجلة',
            trendType: 'up',
            icon: <FiFileText size={24} color="#3b82f6" />
        },
        {
            title: 'نسبة القبول',
            value: `${kpis.acceptance_rate || 0}%`,
            subText: 'معدل الاعتماد',
            trendType: 'up',
            icon: <FiCheckCircle size={24} color="#10b981" />
        },
        {
            title: 'وقت المعالجة',
            value: kpis.avg_processing_time || 0,
            subText: 'ساعات (متوسط عام)',
            trendType: 'neutral',
            icon: <FiClock size={24} color="#f59e0b" />
        },
        {
            title: 'إجمالي المواطنين',
            value: kpis.total_citizens || 0,
            subText: 'مسجلين بالنظام',
            trendType: 'up',
            icon: <FiUsers size={24} color="#8b5cf6" />
        },
        {
            title: 'تسجيلات اليوم',
            value: kpis.today_citizens || 0,
            subText: 'مواطنون جدد',
            trendType: 'up',
            icon: <FiUserPlus size={24} color="#ec4899" />
        }
    ];

    const distribution = statsData.charts?.status_distribution || {};
    const approved = Number(distribution.approved || 0);
    const rejected = Number(distribution.rejected || 0);
    const pending = Number(
        distribution.pending ??
        distribution.waiting ??
        distribution.in_progress ??
        distribution.pending_requests ??
        Math.max(0, Number(kpis.total_requests || 0) - approved - rejected)
    );

    const donutData = [
        { name: 'مقبولة', value: approved, color: '#10b981' },
        { name: 'قيد الانتظار', value: pending, color: '#f59e0b' },
        { name: 'مرفوضة', value: rejected, color: '#ef4444' }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                {summaryCards.map((item) => (
                    <AdminStatCard
                        key={item.title}
                        title={item.title}
                        value={item.value}
                        subText={item.subText}
                        icon={item.icon}
                        trendType={item.trendType}
                    />
                ))}
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>الطلبات اليومية - {currentMonthYear}</h3>
                    <DailyBarChart data={statsData.charts?.daily_requests || []} />
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>توزيع الحالات</h3>
                    <StatusDonutChart data={donutData} />
                </div>
            </div>
        </div>
    );
};

export default AdminStatsPage;
