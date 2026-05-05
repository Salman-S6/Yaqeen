import React from 'react';
import { useNavigate } from 'react-router-dom';
import RequestsTable from "../../../components/RequestsTable/RequestsTable";
// تأكد أن الاسم هنا PendingRequests وليس AdminUsersPage
import styles from './PendingRequests.module.css';

const PendingRequests = ({ requests }) => {
    const navigate = useNavigate();

    const handleReview = (id) => {
        navigate('/employee/review');
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
                <RequestsTable data={requests} onReview={handleReview} />
            </div>
        </div>
    );
};

export default PendingRequests;