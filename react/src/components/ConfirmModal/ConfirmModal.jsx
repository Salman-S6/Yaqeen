import React from 'react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, isLoading = false, requestNumber }) => {
  if (!isOpen) return null;

  const displayedRequestNumber = requestNumber || 'المحدد';

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="approve-request-title">
      <div className={styles.modalCard}>
        <h3 id="approve-request-title" className={styles.title}>تأكيد اعتماد الطلب</h3>
        <p className={styles.message}>
          هل أنت متأكد من اعتماد الطلب {displayedRequestNumber}؟ لا يمكن التراجع بعد التأكيد.
        </p>
        <div className={styles.checkboxContainer}>
          <input type="checkbox" id="gen" defaultChecked disabled={isLoading} />
          <label htmlFor="gen">سيُوَلِّد الوثيقة تلقائياً ويُرسل إشعاراً للمواطن</label>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.confirmBtn}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'جاري الاعتماد...' : '✔️ تأكيد الاعتماد'}
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

export default ConfirmModal;
