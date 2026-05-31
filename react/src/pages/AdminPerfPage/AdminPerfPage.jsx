import React, { useState, useEffect, useCallback } from 'react';
import PerformanceTable from '../../components/PerformanceTable/PerformanceTable';
import StatCard from '../../components/StatCard/StatCard';
import { employeeService } from '../../api/employeeService';
import { getApiErrorMessage, getResponseData } from '../../utils/apiResponse';
import { FaUserCheck, FaPercent, FaExclamationTriangle } from 'react-icons/fa';
import styles from './AdminPerfPage.module.css';

const AdminPerfPage = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPerformanceStats = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await employeeService.getPerformanceDashboard();
            setDashboardData(getResponseData(response, null));
        } catch (err) {
            console.error('خطأ في جلب بيانات أداء الموظفين:', err);
            setDashboardData(null);
            setError(getApiErrorMessage(err, 'فشل تحميل بيانات أداء الموظفين.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPerformanceStats();
    }, [fetchPerformanceStats]);

    if (loading) {
        return <div className={styles.loading}>جاري تحليل أداء الفريق...</div>;
    }

    if (error) {
        return (
            <div className={styles.errorState}>
                <p>{error}</p>
                <button type="button" onClick={fetchPerformanceStats}>إعادة المحاولة</button>
            </div>
        );
    }

    const kpis = dashboardData?.kpis || {};
    const employees = Array.isArray(dashboardData?.employee_performance)
        ? dashboardData.employee_performance
        : [];

    return (
        <div className={styles.container}>
            <div className={styles.summaryGrid}>
                <StatCard
                    title="الأعلى أداءً"
                    value={kpis.top_performer_name || 'لا يوجد بيانات'}
                    icon={<FaUserCheck size={28} />}
                    color="#10b981"
                    subText="بناءً على التقييم الكلي"
                />

                <StatCard
                    title="كفاءة الفريق"
                    value={`${kpis.team_efficiency || 0}%`}
                    icon={<FaPercent size={28} />}
                    color="#3b82f6"
                    subText="متوسط الإنتاجية اليوم"
                />

                <StatCard
                    title="إجمالي التجاوزات"
                    value={kpis.weekly_sla_breaches?.toString() || '0'}
                    icon={<FaExclamationTriangle size={28} />}
                    color="#ef4444"
                    subText="تجاوزات SLA الأسبوعية"
                    subColor="#ef4444"
                />
            </div>

            <div className={styles.tableSection}>
                <PerformanceTable data={employees} />
            </div>
        </div>
    );
};

export default AdminPerfPage;
