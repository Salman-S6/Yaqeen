import React, { useState, useEffect, useCallback } from 'react';
import AdminStatCard from '../../components/AdminStatCard/AdminStatCard';
import ExternalVerifyTable from '../../components/ExternalVerifyTable/ExternalVerifyTable';
import { employeeService } from '../../api/employeeService';
import { getApiErrorMessage, getResponseCollection } from '../../utils/apiResponse';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import styles from './ExternalVerifyPage.module.css';

const ExternalVerifyPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchLogs = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await employeeService.getVerificationLogs();
            setRecords(getResponseCollection(response));
        } catch (err) {
            console.error('خطأ في جلب سجلات التحقق:', err);
            setRecords([]);
            setError(getApiErrorMessage(err, 'فشل تحميل سجلات التحقق الخارجي.'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const validCount = records.filter((r) => r.result === 'valid').length;
    const forgedCount = records.filter((r) => r.result === 'forged').length;
    const unknownCount = records.length - (validCount + forgedCount);

    const dynamicStats = [
        { id: 1, title: 'عمليات تحقق ناجحة', value: validCount, icon: <FaCheckCircle style={{ color: '#2f855a', fontSize: '24px' }} /> },
        { id: 2, title: 'وثائق مزورة اكتشفت', value: forgedCount, icon: <FaTimesCircle style={{ color: '#c53030', fontSize: '24px' }} /> },
        { id: 3, title: 'نتيجة غير محددة', value: unknownCount, icon: <FaExclamationTriangle style={{ color: '#c05621', fontSize: '24px' }} /> }
    ];

    const filteredRecords = records.filter((record) =>
        (record.organization || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.request_number || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.statsGrid}>
                {dynamicStats.map((stat) => (
                    <AdminStatCard
                        key={stat.id}
                        title={stat.title}
                        value={isLoading ? '...' : stat.value}
                        icon={stat.icon}
                    />
                ))}
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#4b5563' }}>جاري تحميل سجلات التحقق...</div>
            ) : error ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#ef4444', fontWeight: 700 }}>
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={fetchLogs}
                        style={{ border: 'none', background: '#007c4d', color: '#fff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                    >
                        إعادة المحاولة
                    </button>
                </div>
            ) : (
                <ExternalVerifyTable
                    records={filteredRecords}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            )}
        </div>
    );
};

export default ExternalVerifyPage;
