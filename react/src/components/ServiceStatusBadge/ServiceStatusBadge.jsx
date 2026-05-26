import React from 'react';
import styles from './ServiceStatusBadge.module.css';

const ServiceStatusBadge = ({ isActive }) => {
    return (
        <span className={`${styles.statusBadge} ${isActive ? styles.active : styles.inactive}`}>
            <span className={`${styles.dot} ${isActive ? styles.activeDot : styles.inactiveDot}`}></span>
            {isActive ? 'متاحة بالنظام' : 'متوقفة مؤقتاً'}
        </span>
    );
};

export default ServiceStatusBadge;