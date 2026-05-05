import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RecentRequestsTable.module.css';

const RecentRequestsTable = ({ data = [] }) => {
  const navigate = useNavigate();

  const handleReviewClick = () => {
    navigate('/review');
  };

  if (!data || data.length === 0) {
    return <p className={styles.loadingText}>جاري تحميل البيانات...</p>;
  }

  return (
    <table className={styles.tableContainer}>
      <thead>
        <tr>
          <th>رقم الطلب</th>
          <th>المواطن</th>
          <th>نوع الخدمة</th>
          <th>وقت الانتظار</th>
          <th>الحالة</th>
          <th>الإجراء</th>
        </tr>
      </thead>

      <tbody>
        {data.map((req, index) => {
          
          const isRedRow = index === 0 || index === data.length - 2;

          const isReviewAction = index === 0 || index === 1 || index === data.length - 2;

          return (
            <tr 
              key={req.id} 
              className={isRedRow ? styles.redRow : ''}
            >
              <td className={isRedRow ? styles.redNumber : styles.greenNumber}>
                {req.id}
              </td>
              <td>{req.citizen}</td>
              <td>{req.service}</td>
              <td>
                <span>{req.waitTime}</span>
              </td>
              <td>
                <span className={req.status === 'معلق' ? styles.statusPending : styles.statusApproved}>
                  {req.status}
                </span>
              </td>
              {/* الإجراء */}
<td>
  {isReviewAction ? (
    <button 
      className={index === 1 ? styles.actionBtnSecondary : styles.actionBtnPrimary} 
      onClick={handleReviewClick}
    >
      مراجعة
    </button>
  ) : (
    <button className={styles.actionBtnSecondary}>
      عرض
    </button>
  )}
</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RecentRequestsTable;