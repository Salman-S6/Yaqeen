import React from 'react';
import styles from './QRStatusBadge.module.css';

const QRStatusBadge = ({ status, text }) => {
    const isValid = status === 'valid';
    return (
        <span className={`${styles.statusBadge} ${isValid ? styles.valid : styles.forged}`}>
            {!isValid && <span className={styles.warningIcon}>⚠️</span>}
            {text}
        </span>
    );
};

export default QRStatusBadge;