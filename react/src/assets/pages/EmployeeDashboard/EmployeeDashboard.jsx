import React from 'react';
import SLAAlert from './components/SLAAlert';
import StatCard from './components/StatCard';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
  // البيانات اللي كانت عندك (تأكدي إنها موجودة كاملة)
  const statsData = [
    { title: "طلبات معلقة مسندة إليك", value: "12", icon: "📁", color: "#f59e0b", subText: "5 جديدة اليوم", subColor: "#f59e0b" },
    { title: "طلبات معتمدة هذا الأسبوع", value: "47", icon: "✅", color: "#10b981", subText: "نسبة القبول 94%" },
    { title: "تجاوزات SLA اليوم", value: "3", icon: "⚡", color: "#ef4444" },
    { title: "متوسط وقت المراجعة (ساعة)", value: "2.4", icon: "🕒", color: "#3b82f6" }
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <header className={styles.header}>
        <h1 className={styles.mainTitle}>لوحة الموظف</h1>
        <p className={styles.subTitle}>تدقيق البيانات المستخرجة من الوثائق</p>
      </header>

      <div className={styles.contentContainer}>
        <SLAAlert count={3} />
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;