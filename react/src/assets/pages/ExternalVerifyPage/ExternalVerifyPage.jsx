import React, { useState } from 'react';
import Header from '../../../components/Header/Header';
import AdminStatCard from '../../../components/AdminStatCard/AdminStatCard';
import ExternalVerifyTable from '../../../components/ExternalVerifyTable/ExternalVerifyTable';

// استدعاء الأيقونات مباشرة لضمان ظهورها داخل الكروت
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import styles from './ExternalVerifyPage.module.css';

const ExternalVerifyPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // تمرير الأيقونات بشكل مباشر مع ستايل ألوانها الأصلي لضمان الرندرة الصحيحة
    const mockStats = [
        { id: 1, title: 'عمليات تحقق ناجحة', value: 842, icon: <FaCheckCircle style={{ color: '#2f855a', fontSize: '24px' }} /> },
        { id: 2, title: 'وثائق مزورة اكتشفت', value: 12, icon: <FaTimesCircle style={{ color: '#c53030', fontSize: '24px' }} /> },
        { id: 3, title: 'نتيجة غير محددة', value: 34, icon: <FaExclamationTriangle style={{ color: '#c05621', fontSize: '24px' }} /> }
    ];

    const mockRecords = [
        { id: 'REQ-000042', organization: 'سفارة الأردن - عمان', status: 'valid', statusText: 'صالحة', time: '5 أبريل - 9:00 ص', ip: 'x.x.x.185' },
        { id: 'REQ-000031', organization: 'بنك بيمو - دمشق', status: 'forged', statusText: 'مزورة', time: '4 أبريل - 1:30 م', ip: 'x.x.x.91' },
        { id: 'REQ-000025', organization: 'مطار دمشق الدولي', status: 'valid', statusText: 'صالحة', time: '4 أبريل - 11:00 ص', ip: 'x.x.x.176' },
        { id: 'REQ-000019', organization: 'وزارة الداخلية', status: 'valid', statusText: 'صالحة', time: '3 أبريل - 2:00 م', ip: 'x.x.x.10' },
        { id: 'REQ-000015', organization: 'مستشفى الأسد - دمشق', status: 'valid', statusText: 'صالحة', time: '2 أبريل - 9:45 ص', ip: 'x.x.x.122' }
    ];

    const filteredRecords = mockRecords.filter(record => 
        record.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.pageContainer}>
            <div className={styles.statsGrid}>
                {mockStats.map((stat) => (
                    <AdminStatCard 
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon} // إرجاع الـ icon كـ prop أساسي ليعود للظهور فوراً
                    />
                ))}
            </div>

            <ExternalVerifyTable 
                records={filteredRecords} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
            />
        </div>
    );
};

export default ExternalVerifyPage;