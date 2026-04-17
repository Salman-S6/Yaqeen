import React from 'react';
import styles from './RejectModal.module.css';

const RejectModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <h3 className={styles.title}>رفض الطلب REQ-000044</h3>
        <p className={styles.message}>يجب كتابة سبب الرفض - سيُرسل للمواطن تلقائياً</p>
        
        <div className={styles.inputArea}>
          <label className={styles.label}>سبب الرفض *</label>
          <textarea 
            className={styles.textarea} 
            placeholder="اكتب سبب الرفض بوضوح..."
          ></textarea>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.rejectBtn} onClick={onConfirm}>
            ✖ تأكيد الرفض
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;