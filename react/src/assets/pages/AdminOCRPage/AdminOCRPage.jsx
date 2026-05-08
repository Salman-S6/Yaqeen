import React from 'react';
import StatCard from '../../../components/StatCard/StatCard';
import OCRTable from '../../../components/OCRTable/OCRTable';
import { useOCRMonitoring } from '../../../hooks/useOCRMonitoring';
import { FaServer, FaHandPaper, FaCheckCircle } from 'react-icons/fa';
import styles from './AdminOCRPage.module.css';

const AdminOCRPage = () => {
    const { ocrData, loading } = useOCRMonitoring();

    if (loading || !ocrData) {
        return <div className={styles.loading}>جاري فحص حالة محركات الـ OCR...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleInfo}>
                    <h1>مراقبة OCR</h1>
                    <p>أداء نظام التعرف الضوئي على النصوص</p>
                </div>
            </header>

            <div className={styles.summaryGrid}>
                <StatCard
                    title="المحرك المستخدم حالياً"
                    value={ocrData.summary.activeEngine}
                    icon={<FaServer size={24} />}
                    color="#64748b"
                />

                <StatCard
                    title="احتاجت تدخلاً يدوياً"
                    value={ocrData.summary.manualInterventions}
                    icon={<FaHandPaper size={24} />}
                    color="#f59e0b"
                />

                <StatCard
                    title="نسبة النجاح"
                    value={ocrData.summary.successRate}
                    icon={<FaCheckCircle size={24} />}
                    color="#10b981"
                    subText="ثقة ≥ 80%"
                />
            </div>

            <div className={styles.tableSection}>
                <OCRTable data={ocrData.rejectedRequests} />
            </div>
        </div>
    );
};

export default AdminOCRPage;