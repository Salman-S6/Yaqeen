import React from 'react';
import styles from './DecisionActions.module.css';

const DecisionActions = ({ onAccept, onReject, disabled = false }) => {
  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.acceptBtn}
        onClick={onAccept}
        disabled={disabled}
      >
        اعتماد الطلب ✔️
      </button>

      <button
        type="button"
        className={styles.rejectBtn}
        onClick={onReject}
        disabled={disabled}
      >
        رفض الطلب ✖
      </button>
    </div>
  );
};

export default DecisionActions;
