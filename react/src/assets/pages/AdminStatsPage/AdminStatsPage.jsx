import React, { useState, useEffect } from 'react';
import { employeeService } from '../../../api/employeeService';
import AdminStatCard from '../../../components/AdminStatCard/AdminStatCard';
import { DailyBarChart, StatusDonutChart } from '../../../components/Charts/AdminCharts';
import { FiUsers, FiClock, FiCheckCircle, FiFileText, FiUserPlus } from 'react-icons/fi';
import styles from './AdminStatsPage.module.css';

const AdminStatsPage = () => {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await employeeService.getAdminStats();
                const data = response.data?.data || response.data;
                setStatsData(data);
            } catch (error) {
                console.error("فشل جلب إحصائيات النظام:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className={styles.loader}>جاري تحميل الإحصائيات المركزية...</div>;
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
            title: "إجمالي الطلبات",
            value: kpis.total_requests || 0,
            subText: "كافة الطلبات المسجلة",
            trendType: "up",
            icon: <FiFileText size={24} color="#3b82f6" />
        },
        {
            title: "نسبة القبول",
            value: `${kpis.acceptance_rate || 0}%`,
            subText: "معدل الاعتماد",
            trendType: "up",
            icon: <FiCheckCircle size={24} color="#10b981" />
        },
        {
            title: "وقت المعالجة",
            value: kpis.avg_processing_time || 0,
            subText: "ساعات (متوسط عام)",
            trendType: "neutral",
            icon: <FiClock size={24} color="#f59e0b" />
        },
        {
            title: "إجمالي المواطنين",
            value: kpis.total_citizens || 0,
            subText: "مسجلين بالنظام",
            trendType: "up",
            icon: <FiUsers size={24} color="#8b5cf6" />
        },
        {
            title: "تسجيلات اليوم",
            value: kpis.today_citizens || 0,
            subText: "مواطنون جدد",
            trendType: "up",
            icon: <FiUserPlus size={24} color="#ec4899" />
        }
    ];

    // =========================
    // توزيع الحالات للدائرة
    // =========================
    const distribution = statsData.charts?.status_distribution || {};

    const approved = Number(distribution.approved || 0);
    const rejected = Number(distribution.rejected || 0);

    /*
      نقرأ pending من الباك إن وُجد.
      وإذا لم يرسله الباك، نحسبه من:
      إجمالي الطلبات - المقبولة - المرفوضة
    */
    const pending = Number(
        distribution.pending ??
        distribution.waiting ??
        distribution.in_progress ??
        distribution.pending_requests ??
        Math.max(0, Number(kpis.total_requests || 0) - approved - rejected)
    );

    /*
      مهم:
      لا نستخدم filter هنا.
      حتى لو pending = 0، نريد أن تظهر في شرح الألوان أسفل الدائرة.
    */
    const donutData = [
        {
            name: "مقبولة",
            value: approved,
            color: "#10b981"
        },
        {
            name: "قيد الانتظار",
            value: pending,
            color: "#f59e0b"
        },
        {
            name: "مرفوضة",
            value: rejected,
            color: "#ef4444"
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.statsGrid}>
                {summaryCards.map((item, idx) => (
                    <AdminStatCard
                        key={idx}
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
                    <h3 className={styles.chartTitle}>
                        الطلبات اليومية - {currentMonthYear}
                    </h3>

                    <DailyBarChart
                        data={statsData.charts?.daily_requests || []}
                    />
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>
                        توزيع الحالات
                    </h3>

                    <StatusDonutChart data={donutData} />
                </div>
            </div>
        </div>
    );
};

export default AdminStatsPage;