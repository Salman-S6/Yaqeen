import React from 'react';
import styles from './AdminStatCard.module.css';

const AdminStatCard = ({ title, value, icon, color, trend, trendType }) => {
    return (
        <div className={styles.card}>
            <div className={styles.headerRow}>
                <div className={styles.iconBox} style={{ color: color, backgroundColor: `${color}15` }}>
                    {icon}
                </div>
                <div className={styles.textGroup}>
                    <p className={styles.title}>{title}</p>
                    <h2 className={styles.value}>{value}</h2>
                </div>
            </div>

            {trend && (
                <div className={styles.footerRow}>
                    <span className={`${styles.trend} ${styles[trendType]}`}>
                        {trend}
                    </span>
                </div>
            )}
            <div className={styles.indicator} style={{ backgroundColor: color }}></div>
        </div>
    );
};

export default AdminStatCard;