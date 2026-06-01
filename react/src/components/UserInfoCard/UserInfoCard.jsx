import React from 'react';
import styles from './UserInfoCard.module.css';

const UserInfoCard = ({ data }) => {
  return (
    <div className={styles.cardContainer}>
      {/* 🟢 تم حذف العنوان القديم لأننا أضفناه بشكل ديناميكي من الصفحة الرئيسية */}

      <div className={styles.fieldsList}>
        {data?.map((item, index) => (
          <div key={index} className={styles.whiteRow}>
            <div className={styles.rightInfo}>
              <span className={styles.grayLabel}>{item.label}</span>
              <span className={styles.blackValue}>{item.value}</span>
            </div>

            {/* 🟢 تم حذف قسم leftConfidence الذي كان يطبع النسبة المئوية % */}
          </div>
        ))}
      </div>

      {/* 🟢 تم حذف صندوق التحذير الأصفر (warningBox) نهائياً من هنا */}
    </div>
  );
};

export default UserInfoCard;