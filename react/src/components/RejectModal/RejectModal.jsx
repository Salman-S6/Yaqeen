import React, { useState } from 'react';
import { useToast } from '../Common/ToastProvider';
import styles from './RejectModal.module.css';

// 🟢 أضفنا isLoading لتعطيل الزر أثناء الإرسال، و requestId ليكون العنوان ديناميكياً
const RejectModal = ({ isOpen, onClose, onConfirm, isLoading, requestId }) => {
  const { showToast } = useToast();
  // 🟢 1. إنشاء حالة (State) لتخزين النص المكتوب
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  // 🟢 2. دالة لحماية الإرسال وتمرير النص (String) فقط
  const handleConfirmClick = () => {
    if (!reason.trim()) {
        showToast('يرجى كتابة سبب الرفض أولاً.', 'warning');
        return;
    }
    onConfirm(reason); // 🚀 نمرر النص الصافي هنا
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        {/* 🟢 جعلنا رقم الطلب ديناميكياً بدلاً من الرقم الثابت */}
        <h3 className={styles.title}>رفض الطلب {requestId || 'المحدد'}</h3>
        <p className={styles.message}>يجب كتابة سبب الرفض - سيُرسل للمواطن تلقائياً</p>
        
        <div className={styles.inputArea}>
          <label className={styles.label}>سبب الرفض *</label>
          <textarea 
            className={styles.textarea} 
            placeholder="اكتب سبب الرفض بوضوح..."
            value={reason} // 🟢 ربطنا القيمة بالحالة
            onChange={(e) => setReason(e.target.value)} // 🟢 تحديث الحالة عند الكتابة
            disabled={isLoading} // تعطيل الكتابة أثناء الإرسال
          ></textarea>
        </div>

        <div className={styles.modalActions}>
          <button 
            className={styles.rejectBtn} 
            onClick={handleConfirmClick} // 🟢 استدعاء دالتنا المحمية
            disabled={isLoading} // تعطيل الزر أثناء الإرسال
          >
            {isLoading ? 'جاري الإرسال...' : '✖ تأكيد الرفض'}
          </button>
          <button 
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

export default RejectModal;