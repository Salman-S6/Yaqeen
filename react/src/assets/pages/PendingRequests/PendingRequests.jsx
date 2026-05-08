import React from 'react';
import { useNavigate } from 'react-router-dom';
import RequestsTable from "../../../components/RequestsTable/RequestsTable";
import styles from './PendingRequests.module.css';

const PendingRequests = ({ requests }) => {
    const navigate = useNavigate();

    // 💡 التعديل هنا: يجب استقبال الـ id وتمريره في الرابط
    const handleReview = (id) => {
        if (id) {
            // الرابط الكامل يجب أن يحتوي على المعرف ليتطابق مع App.jsx
            navigate(`/employee/review/${id}`);
        } else {
            console.error("Request ID is missing!");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.alertBanner}>
                <span>⚠️ طلبات تجاوزت وقت SLA وتظهر بالأحمر - مراجعة فورية مطلوبة</span>
            </div>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3>الطلبات المعلّقة ({requests?.length || 0})</h3>
                </div>
                {/* تأكد أن مكون RequestsTable يمرر الـ id عند النقر على الزر */}
                <RequestsTable data={requests} onReview={handleReview} />
            </div>
        </div>
    );
};

export default PendingRequests;