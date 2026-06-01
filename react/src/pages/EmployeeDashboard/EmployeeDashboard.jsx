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

      /**
       * getResponseData يتعامل مع شكل الاستجابة القادم من الباك.
       * الباك يرجع البيانات داخل:
       * response.data.data
       */
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
      <div
        className={styles.dashboardWrapper}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh'
        }}
      >
        <h3 style={{ color: '#00a65a' }}>جاري تحميل البيانات...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={styles.dashboardWrapper}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <h3 style={{ color: '#ef4444' }}>{error}</h3>

        <button
          type="button"
          onClick={fetchDashboard}
          style={{
            border: 'none',
            background: '#007c4d',
            color: '#fff',
            padding: '10px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700
          }}
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

    /**
     * الباك يرجع اسم المواطن مباشرة داخل citizen_name.
     * تمت إضافة بدائل احتياطية فقط حتى لا تتعطل الواجهة إذا تغير شكل JSON لاحقًا.
     */
    citizen_name:
      req.citizen_name ||
      req.applicant_name ||
      req.user?.name ||
      req.citizen?.full_name ||
      `${req.citizen?.first_name || ''} ${req.citizen?.last_name || ''}`.trim() ||
      'غير محدد',

    /**
     * في JSON الحالي service_type عبارة عن نص مباشر وليس object.
     * لذلك يجب قراءته مباشرة إذا كان string.
     */
    service_type:
      typeof req.service_type === 'string'
        ? req.service_type
        : req.service_type?.name ||
          req.service_name ||
          req.service?.name ||
          'غير محدد',

    /**
     * الباك يرجع تاريخ التقديم مباشرة داخل submitted_date.
     */
    submitted_date:
      req.submitted_date ||
      req.submitted_at?.split(' ')[0] ||
      req.submitted_at?.split('T')[0] ||
      req.created_at?.split(' ')[0] ||
      req.created_at?.split('T')[0] ||
      '---',

    wait_time_text: req.wait_time_text || req.waiting_time || '---',
    wait_time_hours: req.wait_time_hours ?? 0,
    is_sla_breached: Boolean(req.is_sla_breached)
  }));

  const statsData = [
    {
      title: 'طلبات معلقة',
      value: kpis.pending_requests ?? 0,
      icon: '📁',
      color: '#f59e0b'
    },
    {
      title: 'طلبات معتمدة',
      value: kpis.approved_requests ?? 0,
      icon: '✅',
      color: '#10b981'
    },
    {
      title: 'تجاوزات SLA اليوم',
      value: kpis.sla_breaches_today ?? 0,
      icon: '⚡',
      color: '#ef4444'
    },
    {
      title: 'متوسط وقت المراجعة',
      value: kpis.average_review_time ?? 0,
      icon: '🕒',
      color: '#3b82f6'
    }
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

          <RequestsTable data={requestsData} onReview={handleReview} />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;