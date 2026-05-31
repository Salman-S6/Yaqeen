import React from 'react';
import { FaExclamationTriangle, FaEye } from 'react-icons/fa';
import styles from './RequestsTable.module.css';

const RequestsTable = ({ data = [], onReview, isAdminMode = false }) => {

    if (data.length === 0) {
        return <div className={styles.noData}>لا توجد طلبات لعرضها حالياً.</div>;
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
                        <th>{isAdminMode ? 'حالة الطلب' : 'وقت الانتظار'}</th>
                        <th>الإجراء</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((req) => (
                        <tr key={req.id} className={req.is_sla_breached && !isAdminMode ? styles.urgentRow : ''}>
                            <td className={req.is_sla_breached && !isAdminMode ? styles.textRed : styles.textGreen}>
                                <strong>{req.request_number}</strong>
                            </td>
                            <td>{req.citizen_name}</td>
                            <td>{req.service_type}</td>
                            <td>{req.submitted_date}</td>
                            <td>
                                {isAdminMode ? (
                                    <span style={{
                                        padding: '4px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
                                        backgroundColor: req.status === 'pending' ? '#fef3c7' : req.status === 'approved' ? '#d1fae5' : '#fee2e2',
                                        color: req.status === 'pending' ? '#d97706' : req.status === 'approved' ? '#059669' : '#dc2626'
                                    }}>
                                        {req.status === 'pending' ? 'قيد الانتظار' : req.status === 'approved' ? 'مقبول' : 'مرفوض'}
                                    </span>
                                ) : (
                                    <span className={req.is_sla_breached ? styles.textRedBold : ''}>
                                        {req.is_sla_breached && <FaExclamationTriangle style={{ marginLeft: '5px' }} />}
                                        {req.wait_time_text}
                                    </span>
                                )}
                            </td>
                            <td>
                                <button
                                    type="button"
                                    onClick={() => onReview(req.id)}
                                    className={isAdminMode ? styles.btnGreenView : styles.btnNormal}
                                >
                                    {isAdminMode ? <><FaEye /> عرض التفاصيل</> : "مراجعة"}
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