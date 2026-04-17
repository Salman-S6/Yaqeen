import React from 'react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <h3 className={styles.title}>تأكيد اعتماد الطلب</h3>
        <p className={styles.message}>
          هل أنتِ متأكدة من اعتماد الطلب REQ-000044؟ لا يمكن التراجع بعد التأكيد.
        </p>
        <div className={styles.checkboxContainer}>
          <input type="checkbox" id="gen" defaultChecked />
          <label htmlFor="gen">سيُوَلِّد الوثيقة تلقائياً ويُرسل إشعار للمواطن</label>
        </div>
        <div className={styles.modalActions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>✔️ تأكيد الاعتماد</button>
          <button className={styles.cancelBtn} onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;