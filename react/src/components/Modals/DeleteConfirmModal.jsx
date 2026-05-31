import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import styles from '../../pages/AdminUsersPage/AdminUsersPage.module.css';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modalContent} ${styles.confirmModalWidth}`}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <FaExclamationCircle style={{ color: '#e53e3e', fontSize: '48px' }} />
                </div>
                <h3 className={styles.confirmTitle}>تأكيد سحب الصلاحيات والحذف</h3>
                <p className={styles.confirmDescription}>
                    هل أنت متأكد من سحب صلاحيات هذا الموظف وحذفه نهائياً من نظام يقين؟ لا يمكن التراجع عن هذا الإجراء لاحقاً.
                </p>
                <div className={styles.modalActions} style={{ justifyContent: 'center', marginTop: '24px' }}>
                    <button type="button" className={styles.deleteConfirmBtn} onClick={onConfirm}>
                        نعم، احذف الحساب
                    </button>
                    <button type="button" className={styles.cancelBtn} onClick={onClose}>
                        إلغاء الإجراء
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;