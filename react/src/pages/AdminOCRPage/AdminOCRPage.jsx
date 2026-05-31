import React, { useState } from 'react';
import StatCard from '../../components/StatCard/StatCard';
import OCRTable from '../../components/OCRTable/OCRTable';
import { useOCRMonitoring } from '../../hooks/useOCRMonitoring';
import {
    FaServer,
    FaUsers,
    FaCheckCircle,
    FaInfoCircle,
    FaTimes,
    FaIdCard,
    FaExclamationTriangle
} from 'react-icons/fa';
import styles from './AdminOCRPage.module.css';

const AdminOCRPage = () => {
    const { ocrData, loading, error, refetch } = useOCRMonitoring();
    const [selectedRecord, setSelectedRecord] = useState(null);

    if (loading) {
        return (
            <div className={styles.loading}>
                جاري جلب سجلات الـ OCR من السيرفر...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorState}>
                <FaExclamationTriangle className={styles.errorIcon} />

                <h3>تعذر تحميل سجلات OCR</h3>

                <p>{error}</p>

                <button
                    type="button"
                    className={styles.retryButton}
                    onClick={refetch}
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    if (!ocrData) {
        return (
            <div className={styles.errorState}>
                <FaExclamationTriangle className={styles.errorIcon} />

                <h3>لا توجد بيانات OCR</h3>

                <p>لم يرجع الخادم أي بيانات قابلة للعرض.</p>

                <button
                    type="button"
                    className={styles.retryButton}
                    onClick={refetch}
                >
                    إعادة المحاولة
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div
                style={{
                    marginBottom: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    border: '1px solid #bae6fd',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
            >
                <FaInfoCircle size={22} />

                <span style={{ fontSize: '15px', fontWeight: '600' }}>
                    سجل التحقق: يعرض هذا السجل بيانات المواطنين الذين اجتازوا فحص الـ OCR وتم تسجيلهم في النظام بنجاح.
                </span>
            </div>

            <div className={styles.summaryGrid}>
                <StatCard
                    title="المحرك النشط"
                    value={ocrData.kpis?.active_engine || 'N/A'}
                    icon={<FaServer size={22} />}
                    color="#64748b"
                />

                <StatCard
                    title="مواطنين تم قبولهم"
                    value={ocrData.kpis?.total_processed || '0'}
                    icon={<FaUsers size={22} />}
                    color="#3b82f6"
                    subText="إجمالي المسجلين عبر النظام"
                />

                <StatCard
                    title="متوسط دقة التعرف"
                    value={ocrData.kpis?.avg_confidence || '0%'}
                    icon={<FaCheckCircle size={22} />}
                    color="#10b981"
                    subText="نسبة الثقة التقنية"
                />
            </div>

            <div className={styles.tableSection}>
                <div className={styles.tableHeader}>
                    <h3>سجل المواطنين المسجلين عبر محركات الـ OCR</h3>
                </div>

                <OCRTable
                    data={ocrData.ocr_logs?.data || []}
                    onViewResult={(record) => setSelectedRecord(record)}
                />
            </div>

            {selectedRecord && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                    }}
                    onClick={() => setSelectedRecord(null)}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            width: '500px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            overflow: 'hidden',
                            direction: 'rtl'
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '15px 20px',
                                borderBottom: '1px solid #e5e7eb',
                                backgroundColor: '#f9fafb'
                            }}
                        >
                            <h3
                                style={{
                                    margin: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#1f2937'
                                }}
                            >
                                <FaIdCard color="#007c4d" />
                                تفاصيل الهوية المستخرجة
                            </h3>

                            <button
                                type="button"
                                onClick={() => setSelectedRecord(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '18px',
                                    color: '#9ca3af',
                                    cursor: 'pointer'
                                }}
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '15px',
                                    paddingBottom: '10px',
                                    borderBottom: '1px dashed #e5e7eb'
                                }}
                            >
                                <span style={{ color: '#6b7280' }}>الاسم:</span>
                                <strong style={{ color: '#111827' }}>
                                    {selectedRecord.details?.first_name || 'غير متوفر'}
                                </strong>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '15px',
                                    paddingBottom: '10px',
                                    borderBottom: '1px dashed #e5e7eb'
                                }}
                            >
                                <span style={{ color: '#6b7280' }}>النسبة:</span>
                                <strong style={{ color: '#111827' }}>
                                    {selectedRecord.details?.last_name || 'غير متوفر'}
                                </strong>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '15px',
                                    paddingBottom: '10px',
                                    borderBottom: '1px dashed #e5e7eb'
                                }}
                            >
                                <span style={{ color: '#6b7280' }}>اسم الأب:</span>
                                <strong style={{ color: '#111827' }}>
                                    {selectedRecord.details?.father_name || 'غير متوفر'}
                                </strong>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '15px',
                                    paddingBottom: '10px',
                                    borderBottom: '1px dashed #e5e7eb'
                                }}
                            >
                                <span style={{ color: '#6b7280' }}>اسم الأم:</span>
                                <strong style={{ color: '#111827' }}>
                                    {selectedRecord.details?.mother_full_name || 'غير متوفر'}
                                </strong>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '15px',
                                    paddingBottom: '10px',
                                    borderBottom: '1px dashed #e5e7eb'
                                }}
                            >
                                <span style={{ color: '#6b7280' }}>الميلاد:</span>
                                <strong style={{ color: '#111827' }}>
                                    {selectedRecord.details?.birth_info || 'غير متوفر'}
                                </strong>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '15px',
                                    paddingBottom: '10px',
                                    borderBottom: '1px dashed #e5e7eb'
                                }}
                            >
                                <span style={{ color: '#6b7280' }}>الرقم الوطني:</span>
                                <strong style={{ color: '#111827' }}>
                                    {selectedRecord.details?.national_id || 'غير متوفر'}
                                </strong>
                            </div>
                        </div>

                        <div
                            style={{
                                padding: '15px 20px',
                                borderTop: '1px solid #e5e7eb',
                                backgroundColor: '#f9fafb',
                                textAlign: 'left'
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedRecord(null)}
                                style={{
                                    backgroundColor: '#007c4d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOCRPage;