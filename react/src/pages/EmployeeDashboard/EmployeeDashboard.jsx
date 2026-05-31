import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard/StatCard';
import RequestsTable from '../../components/RequestsTable/RequestsTable';
import SLAAlert from '../../components/SLAAlert/SLAAlert';
import { employeeRequestService } from '../../api/employeeRequestService';
import { getApiErrorMessage, getResponseData } from '../../utils/apiResponse';
import styles from './EmployeeDashboard.module.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await employeeRequestService.getDashboardData();
      setDashboardData(getResponseData(response, null));
    } catch (err) {
      console.error('خطأ في جلب بيانات لوحة التحكم:', err);
      setDashboardData(null);
      setError(getApiErrorMessage(err, 'فشل تحميل بيانات لوحة الموظف.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleReview = (id) => {
    if (id) {
      navigate(`/employee/review-request/${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.dashboardWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <h3 style={{ color: '#00a65a' }}>جاري تحميل البيانات...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ color: '#ef4444' }}>{error}</h3>
        <button
          type="button"
          onClick={fetchDashboard}
          style={{ border: 'none', background: '#007c4d', color: '#fff', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const kpis = dashboardData?.kpis || {};
  const requestsData = (Array.isArray(dashboardData?.latest_assigned_requests)
    ? dashboardData.latest_assigned_requests
    : []
  ).map((req) => ({
    id: req.id,
    request_number: req.request_number || `#${req.id}`,
    citizen_name: req.citizen?.full_name || `${req.citizen?.first_name || ''} ${req.citizen?.last_name || ''}`.trim() || 'غير محدد',
    service_type: req.service_type?.name || req.service_name || 'غير محدد',
    submitted_date: req.submitted_at?.split(' ')[0] || req.created_at?.split('T')[0] || req.submitted_at || '---',
    wait_time_text: req.wait_time_text || req.waiting_time || '---',
    is_sla_breached: !!req.is_sla_breached
  }));

  const statsData = [
    { title: 'طلبات معلقة', value: kpis.pending_requests ?? 0, icon: '📁', color: '#f59e0b' },
    { title: 'طلبات معتمدة', value: kpis.approved_requests ?? 0, icon: '✅', color: '#10b981' },
    { title: 'تجاوزات SLA اليوم', value: kpis.sla_breaches_today ?? 0, icon: '⚡', color: '#ef4444' },
    { title: 'متوسط وقت المراجعة', value: kpis.average_review_time ?? 0, icon: '🕒', color: '#3b82f6' }
  ];

  return (
    <div className={styles.dashboardWrapper}>
      <div className={styles.contentContainer}>
        {kpis.sla_breaches_today > 0 && <SLAAlert />}

        <div className={styles.statsGrid}>
          {statsData.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        <div className={styles.tableSection}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>آخر طلبات مسندة</h3>
            <button
              type="button"
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
