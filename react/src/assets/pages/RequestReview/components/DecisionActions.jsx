import React from 'react';
import styles from './DecisionActions.module.css';

const DecisionActions = ({ onAccept, onReject }) => {
  return (
    <div className={styles.container}>
      <button className={styles.acceptBtn} onClick={onAccept}>
        اعتماد الطلب ✔️
      </button>
      
      <button className={styles.rejectBtn} onClick={onReject}>
        رفض الطلب ✖
      </button>
    </div>
  );
};

export default DecisionActions;