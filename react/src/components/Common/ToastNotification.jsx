import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import styles from './ToastNotification.module.css';

const ToastNotification = ({ toast, onClose }) => {
    if (!toast.show) return null;

    return (
        <div className={`${styles.toastNotification} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
            <div className={styles.toastBody}>
                {toast.type === 'success' ? (
                    <FaCheckCircle className={styles.toastIcon} />
                ) : (
                    <FaExclamationCircle className={styles.toastIcon} />
                )}
                <span className={styles.toastMessage}>{toast.message}</span>
            </div>
            <button className={styles.toastCloseBtn} onClick={onClose}>
                <FaTimes />
            </button>
        </div>
    );
};

export default ToastNotification;