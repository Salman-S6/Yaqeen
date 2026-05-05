import React from 'react';
import StatCard from './components/StatCard';
import RecentRequestsTable from './components/RecentRequestsTable';
import SLAAlert from './components/SLAAlert';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
  // مصفوفة بيانات الطلبات (تم ترتيبها لتسهيل القراءة)
  const requestsData = [
    { id: 'REQ-000044', citizen: 'خالد الأحمد', service: 'إخراج قيد فردي', waitTime: '26 ساعة', status: 'معلق' },
    { id: 'REQ-000043', citizen: 'سارة محمود', service: 'بيان عائلي', waitTime: '4 ساعات', status: 'معلق' },
    { id: 'REQ-000042', citizen: 'أحمد المحمود', service: 'إخراج قيد فردي', waitTime: '-', status: 'معتمد' },
    { id: 'REQ-000041', citizen: 'ليلى حسن', service: 'بيان عائلي', waitTime: '22 ساعة', status: 'معلق' },
    { id: 'REQ-000040', citizen: 'يوسف العمر', service: 'وثيقة أخرى', waitTime: '1 ساعة', status: 'معتمد' }
  ];

  // بيانات بطاقات الإحصائيات (Stat Cards)
  const statsData = [
    { title: "طلبات معلقة", value: "12", icon: "📁", color: "#f59e0b" },
    { title: "طلبات معتمدة", value: "47", icon: "✅", color: "#10b981" },
    { title: "تجاوزات SLA اليوم", value: "3", icon: "⚡", color: "#ef4444" },
    { title: "متوسط وقت المراجعة", value: "2.4", icon: "🕒", color: "#3b82f6" },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.contentContainer}>

        <SLAAlert />
        
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>آخر طلبات مسندة</h3>
            <button className={styles.viewAllBtn}>عرض الكل</button>
          </div>
          
          <RecentRequestsTable 
            data={requestsData} 
            className={styles.customTable} 
          />
        </div>
        
      </div>
    </div>
  );
};

export default EmployeeDashboard;