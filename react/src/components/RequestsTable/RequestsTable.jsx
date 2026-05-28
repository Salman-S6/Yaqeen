import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import styles from './RequestsTable.module.css';

const RequestsTable = ({ data = [], onReview }) => {

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
                        /* 🟢 نستخدم is_sla_breached لتحديد إذا كان الطلب متأخراً (Urgent) */
                        <tr key={req.id} className={req.is_sla_breached ? styles.urgentRow : ''}>
                            
                            <td className={req.is_sla_breached ? styles.textRed : styles.textGreen}>
                                {/* 🟢 عرض رقم الطلب النصي الطويل للموظف */}
                                <strong>{req.request_number}</strong>
                            </td>
                            
                            {/* 🟢 ربط المفاتيح الجديدة القادمة من الباك-إند */}
                            <td>{req.citizen_name}</td>
                            <td>{req.service_type}</td>
                            <td>{req.submitted_date}</td>
                            
                            <td className={req.is_sla_breached ? styles.textRedBold : ''}>
                                {req.is_sla_breached && <FaExclamationTriangle style={{ marginLeft: '5px' }} />}
                                {req.wait_time_text}
                            </td>
                            
                            <td>
                                <button
                                    className={req.is_sla_breached ? styles.btnUrgent : styles.btnNormal}
                                    /* 🟢 إرسال الـ id الرقمي (مثل 4) لدالة المراجعة لكي يعمل التوجيه والـ API بشكل صحيح */
                                    onClick={() => onReview(req.id)}
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