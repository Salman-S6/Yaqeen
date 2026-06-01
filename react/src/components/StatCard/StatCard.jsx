import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon, color, subText, subColor }) => {
  return (
    <div 
      className={styles.card} 
      style={{ '--line-color': color }}
    >
      <div className={styles.iconWrapper} style={{ color: color }}>
        {icon}
      </div>

      <h2 className={styles.value}>{value}</h2>

      <div className={styles.infoArea}>
        <p className={styles.title}>{title}</p>
        {subText && (
          <span className={styles.subText} style={{ color: subColor || '#10b981' }}>
            {subText}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;