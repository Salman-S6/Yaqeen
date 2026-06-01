import React, { useState } from 'react';
import { useToast } from '../Common/ToastProvider';
import styles from './RejectModal.module.css';

const RejectModal = ({ isOpen, onClose, onConfirm, isLoading, requestId }) => {
  const { showToast } = useToast();
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      showToast('يرجى كتابة سبب الرفض أولاً.', 'warning');
      return;
    }

    onConfirm(trimmedReason);
  };

  const handleClose = () => {
    if (isLoading) return;

    setReason('');
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        <h3 className={styles.title}>رفض الطلب {requestId || 'المحدد'}</h3>

        <p className={styles.message}>
          يجب كتابة سبب الرفض - سيُرسل للمواطن تلقائياً
        </p>

        <div className={styles.inputArea}>
          <label className={styles.label} htmlFor="reject-reason">
            سبب الرفض *
          </label>

          <textarea
            id="reject-reason"
            name="rejectReason"
            className={styles.textarea}
            placeholder="اكتب سبب الرفض بوضوح..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.rejectBtn}
            onClick={handleConfirmClick}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'جاري الإرسال...' : '✖ تأكيد الرفض'}
          </button>

          <button
            type="button"
            className={styles.cancelBtn}
            onClick={handleClose}
            disabled={isLoading}
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectModal;