import React from 'react';
import styles from './UserInfoCard.module.css';

const UserInfoCard = ({ data }) => {
  return (
    <div className={styles.cardContainer}>
      <h3 className={styles.sectionTitle}>البيانات المستخرجة بـ OCR - مع نسبة الثقة</h3>
      
      <div className={styles.fieldsList}>
        {data?.map((item, index) => (
          <div key={index} className={styles.whiteRow}>
          
            <div className={styles.rightInfo}>
              <span className={styles.grayLabel}>{item.label}</span>
              <span className={styles.blackValue}>{item.value}</span>
            </div>

            
            <div className={styles.leftConfidence}>
              <span 
                className={styles.percentText} 
                style={{ color: item.confidence < 80 ? '#eab308' : '#007c4d' }}
              >
                {item.confidence}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.warningBox}>
        ⚠️ حقل "مكان القيد" نسبة ثقته أقل من 80% - يُنصح بالتحقق اليدوي
      </div>
    </div>
  );
};

export default UserInfoCard;