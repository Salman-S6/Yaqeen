import React from 'react';
import styles from './SLAAlert.module.css';

const SLAAlert = ({ count }) => {
  return (
    <div className={styles.alertBar}>
      <span className={styles.alertIcon}>⚠️</span>
      <p className={styles.alertText}>
        لديك <strong>{count} طلبات</strong> تجاوزت وقت SLA - نحتاج مراجعة فورية
      </p>
    </div>
  );
};

export default SLAAlert;