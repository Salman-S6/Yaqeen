import React from 'react';
import PerformanceTable from '../../../components/PerformanceTable/PerformanceTable';
import StatCard from '../../../components/StatCard/StatCard';
import { useEmployeePerformance } from '../../../hooks/useEmployeePerformance';
import { FaUserCheck, FaPercent, FaExclamationTriangle } from 'react-icons/fa';
import styles from './AdminPerfPage.module.css';

const AdminPerfPage = () => {
    const { stats, loading } = useEmployeePerformance();

    if (loading || !stats) {
        return <div className={styles.loading}>جاري تحليل أداء الفريق...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleInfo}>
                    <h1>مؤشرات أداء الموظفين</h1>
                    <p>مراقبة حية لاتفاقية مستوى الخدمة (SLA)</p>
                </div>
            </header>

            <div className={styles.summaryGrid}>
                <StatCard 
                    title="الأعلى أداءً" 
                    value={stats?.summary?.topPerformer || "غير متوفر"} 
                    icon={<FaUserCheck size={28} />} 
                    color="#10b981" 
                    subText="بناءً على التقييم الكلي"
                />
                
                <StatCard 
                    title="كفاءة الفريق" 
                    value={stats?.summary?.avgEfficiency || "0%"} 
                    icon={<FaPercent size={28} />} 
                    color="#3b82f6" 
                    subText="متوسط الإنتاجية اليوم"
                />
                
                <StatCard 
                    title="إجمالي التجاوزات" 
                    value={stats?.summary?.totalViolations?.toString() || "0"} 
                    icon={<FaExclamationTriangle size={28} />} 
                    color="#ef4444" 
                    subText="تجاوزات SLA الأسبوعية"
                    subColor="#ef4444"
                />
            </div>

            <div className={styles.tableSection}>
                <PerformanceTable data={stats?.employees || []} />
            </div>
        </div>
    );
};

export default AdminPerfPage;