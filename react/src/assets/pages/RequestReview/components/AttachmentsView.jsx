import React from 'react';
import styles from './AttachmentsView.module.css';

const AttachmentsView = ({ imageSrc, matchRate = 96 }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>صورة الهوية الأصلية المرفوعة</h3>
      
      <div className={styles.imageCard}>
        {/* هنا نضع الصورة، واستخدمت placeholder مؤقتاً */}
        <img 
          src={imageSrc || 'https://via.placeholder.com/400x250?text=ID+Card+Preview'} 
          alt="Original ID" 
          className={styles.idImage} 
        />
      </div>

      <div className={styles.verificationBadge}>
        <span className={styles.checkIcon}>✔</span>
        <span className={styles.badgeText}>الصورة أصلية - لا توجد علامات تلاعب</span>
      </div>

      <div className={styles.matchScore}>
        <span>نسبة التطابق الإجمالية مع OCR:</span>
        <span className={styles.scoreNumber}> %{matchRate}</span>
      </div>
    </div>
  );
};

export default AttachmentsView;