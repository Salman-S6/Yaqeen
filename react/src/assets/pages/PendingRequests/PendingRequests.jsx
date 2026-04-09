import React from 'react';
import RequestsTable from "../../../components/RequestsTable/RequestsTable";
import styles from './PendingRequests.module.css';

const PendingRequests = ({ requests, onReview }) => {
    return (
        <div className={styles.container}>
            <div className={styles.alertBanner}>
                <span>⚠️ طلبات تجاوزت وقت SLA وتظهر بالأحمر - مراجعة فورية مطلوبة</span>
            </div>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3>الطلبات المعلّقة ({requests?.length || 0})</h3>
                </div>
                <RequestsTable data={requests} onReview={onReview} />
            </div>
        </div>
    );
};

export default PendingRequests;