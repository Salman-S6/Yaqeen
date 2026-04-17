import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './RequestsTable.module.css';

const RequestsTable = ({ data = [] }) => {
    const navigate = useNavigate();

    if (data.length === 0) {
        return <div className={styles.noData}>لا توجد طلبات معلقة حالياً.</div>;
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>رقم الطلب</th>
                        <th>المواطن</th>
                        <th>نوع الخدمة</th>
                        <th>تاريخ التقديم</th>
                        <th>وقت الانتظار</th>
                        <th>الإجراء</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((req) => (
                        <tr key={req.id} className={req.isUrgent ? styles.urgentRow : ''}>
                            <td className={req.isUrgent ? styles.textRed : styles.textGreen}>
                                <strong>{req.id}</strong>
                            </td>
                            <td>{req.name}</td>
                            <td>{req.type}</td>
                            <td>{req.date}</td>
                            <td className={req.isUrgent ? styles.textRedBold : ''}>
                                {req.isUrgent && <FaExclamationTriangle style={{ marginLeft: '5px' }} />}
                                {req.waitTime}
                            </td>
                            <td>
                                <button
                                    className={req.isUrgent ? styles.btnUrgent : styles.btnNormal}
                                    // 3. التوجيه لصفحة المراجعة عند الضغط
                                    onClick={() => navigate('/review')}
                                >
                                    مراجعة
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RequestsTable;