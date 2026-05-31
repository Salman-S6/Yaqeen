import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import styles from './CustomConfirmModal.module.css';

const CustomConfirmModal = ({
    isOpen,
    title,
    description,
    onClose,
    onConfirm,
    isDanger = true,
    isLoading = false
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={styles.modalContent}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <FaExclamationCircle style={{ color: isDanger ? '#e53e3e' : '#00a65a', fontSize: '48px' }} />
                </div>
                <h3 className={styles.confirmTitle}>{title}</h3>
                <p className={styles.confirmDescription}>{description}</p>
                <div className={styles.modalActions}>
                    <button
                        type="button"
                        className={isDanger ? styles.deleteConfirmBtn : styles.saveBtn}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'جاري التنفيذ...' : 'تأكيد الإجراء'}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        إلغاء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomConfirmModal;
