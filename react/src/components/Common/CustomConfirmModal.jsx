import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import styles from './CustomConfirmModal.module.css';

const CustomConfirmModal = ({ isOpen, title, description, onClose, onConfirm, isDanger = true }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <FaExclamationCircle style={{ color: isDanger ? '#e53e3e' : '#00a65a', fontSize: '48px' }} />
                </div>
                <h3 className={styles.confirmTitle}>{title}</h3>
                <p className={styles.confirmDescription}>{description}</p>
                <div className={styles.modalActions}>
                    <button
                        className={isDanger ? styles.deleteConfirmBtn : styles.saveBtn}
                        onClick={onConfirm}
                    >
                        تأكيد الإجراء
                    </button>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

// 🟢 التعديل المصلح: إضافة التصدير الافتراضي لحل خطأ الـ Console فوراً
export default CustomConfirmModal;