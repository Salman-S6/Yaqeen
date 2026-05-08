import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../../components/StatCard/StatCard';
import RequestsTable from '../../../components/RequestsTable/RequestsTable'; // 👈 تأكد من تطابق الاسم
import SLAAlert from '../../../components/SLAAlert/SLAAlert';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  // مصفوفة بيانات الطلبات (تمت إضافة isUrgent و date لتتوافق مع الجدول)
  const requestsData = [
    { id: 'REQ-000044', name: 'خالد الأحمد', type: 'إخراج قيد فردي', waitTime: '26 ساعة', date: '2026/04/09', isUrgent: true },
    { id: 'REQ-000043', name: 'سارة محمود', type: 'بيان عائلي', waitTime: '4 ساعات', date: '2026/04/09', isUrgent: false },
    { id: 'REQ-000041', name: 'ليلى حسن', type: 'بيان عائلي', waitTime: '22 ساعة', date: '2026/04/09', isUrgent: true },
  ];

  // 💡 الحل الجذري: دالة التنقل بالرابط الكامل مع الـ ID
  const handleReview = (id) => {
    if (id) {
      navigate(`/employee/review/${id}`);
    }
  };

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
            <button 
              className={styles.viewAllBtn}
              onClick={() => navigate('/employee/pending-requests')}
            >
              عرض الكل
            </button>
          </div>
          
          {/* ✅ تمرير الدالة هنا للجدول */}
          <RequestsTable 
            data={requestsData} 
            onReview={handleReview} 
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;