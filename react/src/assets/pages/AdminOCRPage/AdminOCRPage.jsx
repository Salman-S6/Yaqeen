import React from 'react';
import StatCard from '../../../components/StatCard/StatCard';
import OCRTable from '../../../components/OCRTable/OCRTable';
import { useOCRMonitoring } from '../../../hooks/useOCRMonitoring';
import { FaServer, FaHandPaper, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
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
                    <h1>مراقبة محركات الـ OCR</h1>
                    <p>تحليل دقة التعرف الآلي والتدخلات البشرية المطلوبة</p>
                </div>
                {/* تنبيه للمدير بأن دوره رقابي */}
                <div className={styles.adminAlert}>
                    <FaExclamationTriangle />
                    <span>وضع الرقابة: الاطلاع على الطلبات التي فشل النظام في معالجتها آلياً.</span>
                </div>
            </header>

            <div className={styles.summaryGrid}>
                <StatCard
                    title="المحرك النشط"
                    value={ocrData.summary.activeEngine}
                    icon={<FaServer size={22} />}
                    color="#64748b"
                />

                <StatCard
                    title="طلبات قيد التدقيق البشري"
                    value={ocrData.summary.manualInterventions}
                    icon={<FaHandPaper size={22} />}
                    color="#f59e0b"
                    subText="يتم معالجتها من قبل الموظفين"
                />

                <StatCard
                    title="دقة المعالجة الآلية"
                    value={ocrData.summary.successRate}
                    icon={<FaCheckCircle size={22} />}
                    color="#10b981"
                    subText="نسبة الثقة التقنية"
                />
            </div>

            <div className={styles.tableSection}>
                <div className={styles.tableHeader}>
                    <h3>سجل التنبيهات التقنية (طلبات فشل فيها الـ OCR)</h3>
                </div>
                {/* 💡 ملاحظة تقنية: يجب التأكد أن مكون OCRTable داخل Admin لا يحتوي على روابط قابلة للضغط تؤدي لصفحة المراجعة */}
                <OCRTable
                    data={ocrData.rejectedRequests}
                    isReadOnly={true} // نمرر خاصية القراءة فقط للمكون
                />
            </div>
        </div>
    );
};

export default AdminOCRPage;