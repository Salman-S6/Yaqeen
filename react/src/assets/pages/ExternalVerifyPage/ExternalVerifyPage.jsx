import React, { useState, useEffect } from 'react';
import Header from '../../../components/Header/Header';
import AdminStatCard from '../../../components/AdminStatCard/AdminStatCard';
import ExternalVerifyTable from '../../../components/ExternalVerifyTable/ExternalVerifyTable';
import { employeeService } from '../../../api/employeeService'; // 🟢 استدعاء الـ API

import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import styles from './ExternalVerifyPage.module.css';

const ExternalVerifyPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 🟢 جلب البيانات من السيرفر
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await employeeService.getVerificationLogs();
                // 💡 التعامل مع هيكلية Pagination الخاصة بـ Laravel
                const fetchedData = response.data?.data?.data || response.data?.data || [];
                setRecords(fetchedData);
            } catch (error) {
                console.error("خطأ في جلب سجلات التحقق:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // 🟢 حساب الإحصائيات ديناميكياً من البيانات القادمة من السيرفر
    const validCount = records.filter(r => r.result === 'valid').length;
    const forgedCount = records.filter(r => r.result === 'forged').length;
    const unknownCount = records.length - (validCount + forgedCount);

    const dynamicStats = [
        { id: 1, title: 'عمليات تحقق ناجحة', value: validCount, icon: <FaCheckCircle style={{ color: '#2f855a', fontSize: '24px' }} /> },
        { id: 2, title: 'وثائق مزورة اكتشفت', value: forgedCount, icon: <FaTimesCircle style={{ color: '#c53030', fontSize: '24px' }} /> },
        { id: 3, title: 'نتيجة غير محددة', value: unknownCount, icon: <FaExclamationTriangle style={{ color: '#c05621', fontSize: '24px' }} /> }
    ];

    // 🟢 تحديث الفلترة لتعمل مع مفاتيح الباك-إند الحقيقية (request_number)
    const filteredRecords = records.filter(record => 
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
                        value={isLoading ? '...' : stat.value} // إظهار تحميل بسيط أثناء جلب الأرقام
                        icon={stat.icon}
                    />
                ))}
            </div>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#4b5563' }}>جاري تحميل سجلات التحقق...</div>
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