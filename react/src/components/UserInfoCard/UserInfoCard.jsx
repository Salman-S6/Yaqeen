import React from 'react';
import styles from './UserInfoCard.module.css';

const UserInfoCard = ({ data }) => {
  return (
    <div className={styles.cardContainer}>

      <div className={styles.fieldsList}>
        {data?.map((item, index) => (
          <div key={index} className={styles.whiteRow}>
            <div className={styles.rightInfo}>
              <span className={styles.grayLabel}>{item.label}</span>
              <span className={styles.blackValue}>{item.value}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default UserInfoCard;