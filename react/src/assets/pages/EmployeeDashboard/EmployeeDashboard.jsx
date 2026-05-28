import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../../components/StatCard/StatCard';
import RequestsTable from '../../../components/RequestsTable/RequestsTable';
import SLAAlert from '../../../components/SLAAlert/SLAAlert';
import { employeeRequestService } from '../../../api/employeeRequestService'; // 🟢 استدعاء الخدمة
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  
  // 🟢 حالات (States) لتخزين بيانات السيرفر
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🟢 جلب البيانات بمجرد فتح لوحة التحكم
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await employeeRequestService.getDashboardData();
        // التأكد من الوصول الصحيح لـ data الموجودة داخل الـ JSON
        setDashboardData(response.data.data || response.data);
      } catch (error) {
        console.error("خطأ في جلب بيانات لوحة التحكم:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const handleReview = (id) => {
    if (id) {
      navigate(`/employee/review-request/${id}`); 
    }
  };

  // 🟢 شاشة تحميل بسيطة ريثما تصل البيانات
  if (isLoading) {
    return (
      <div className={styles.dashboardWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <h3 style={{ color: '#00a65a' }}>جاري تحميل البيانات...</h3>
      </div>
    );
  }

  // 🟢 تجهيز البيانات بشكل آمن بعد وصولها
  const kpis = dashboardData?.kpis || {};
  const requestsData = dashboardData?.latest_assigned_requests || [];

  // ربط أرقام الـ KPIs بالبطاقات الأربعة (مع توفير 0 كقيمة افتراضية للحماية)
  const statsData = [
    { title: "طلبات معلقة", value: kpis.pending_requests ?? 0, icon: "📁", color: "#f59e0b" },
    { title: "طلبات معتمدة", value: kpis.approved_requests ?? 0, icon: "✅", color: "#10b981" },
    { title: "تجاوزات SLA اليوم", value: kpis.sla_breaches_today ?? 0, icon: "⚡", color: "#ef4444" },
    { title: "متوسط وقت المراجعة", value: kpis.average_review_time ?? 0, icon: "🕒", color: "#3b82f6" },
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.contentContainer}>
        
        {/* 🟢 ذكاء الواجهة: التنبيه يظهر فقط إذا كان هناك تجاوزات مسجلة اليوم */}
        {kpis.sla_breaches_today > 0 && <SLAAlert />}
        
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