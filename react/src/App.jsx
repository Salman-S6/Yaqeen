import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './api/authService';
import { employeeRequestService } from './api/employeeRequestService';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './assets/pages/Login/Login';

// واجهات الموظفين والطلبات
import PendingRequests from './assets/pages/PendingRequests/PendingRequests';
import RequestReview from './assets/pages/RequestReview/RequestReview';
import EmployeeDashboard from './assets/pages/EmployeeDashboard/EmployeeDashboard';

// واجهات الإدارة والتحليلات
import AdminUsersPage from './assets/pages/AdminUsersPage/AdminUsersPage';
import AdminStatsPage from './assets/pages/AdminStatsPage/AdminStatsPage';
import AdminPerfPage from './assets/pages/AdminPerfPage/AdminPerfPage';
import AdminOCRPage from './assets/pages/AdminOCRPage/AdminOCRPage';
import ExternalVerifyPage from './assets/pages/ExternalVerifyPage/ExternalVerifyPage';
import AdminServicesPage from './assets/pages/AdminServicesPage/AdminServicesPage';
import AdminRequestsPage from './assets/pages/AdminRequestsPage/AdminRequestsPage';
import AdminAuditPage from './assets/pages/AdminAuditPage/AdminAuditPage';
import UserProfilePage from './assets/pages/UserProfilePage/UserProfilePage';
import { ToastProvider, RouteToastListener } from './components/Common/ToastProvider';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getProfile();
        const responseData = response.data;
        const userData = responseData.user || responseData.data || responseData;

        if (userData && typeof userData === 'object') {
          setCurrentUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));

          let role = 'employee';
          if (userData.roles && Array.isArray(userData.roles) && userData.roles.length > 0) {
            role = userData.roles[0];
          } else if (userData.role) {
            role = userData.role;
          } else {
            role = localStorage.getItem('userRole') || 'employee';
          }

          const normalizedRole = String(role).toLowerCase();
          localStorage.setItem('userRole', role);

          if (normalizedRole === 'employee' || normalizedRole === 'موظف') {
            try {
              const reqResponse = await employeeRequestService.getPendingRequests();
              const reqData = reqResponse.data?.data || reqResponse.data;
              setRequests(Array.isArray(reqData) ? reqData : []);
            } catch (requestError) {
              console.error('فشل جلب العداد المركزي للطلبات:', requestError);
            }
          }
        }
      } catch {
        console.warn('فشل جلب الملف الشخصي، الاعتماد على البيانات المحلية.');
        if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
          try {
            setCurrentUser(JSON.parse(savedUser));
          } catch {
            setCurrentUser(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  const handleRemoveRequest = (id) => {
    setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', backgroundColor: '#f4f7f6', color: '#2d5a4c',
        flexDirection: 'column', fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          border: '4px solid #f3f3f3', borderTop: '4px solid #2d5a4c',
          borderRadius: '50%', width: '40px', height: '40px',
          animation: 'spin 1s linear infinite', marginBottom: '15px'
        }}></div>
        <h2>جاري تشغيل نظام يَقِين...</h2>
      </div>
    );
  }

  return (
    <Router>
      <ToastProvider>
        <RouteToastListener />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={['employee', 'موظف']}>
            <MainLayout currentUser={currentUser} pendingCount={requests.length} />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard requests={requests} />} />
          <Route path="pending-requests" element={<PendingRequests requests={requests} title="الطلبات المعلّقة" />} />
          <Route path="review-request/:requestId" element={
            <RequestReview isAdminMode={false} onActionComplete={handleRemoveRequest} />
          } />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'مدير النظام']}>
            <MainLayout currentUser={currentUser} headerTitle="إدارة النظام" />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="all-requests" element={<AdminRequestsPage />} />
          <Route path="review-request/:requestId" element={<RequestReview isAdminMode={true} />} />
          <Route path="stats" element={<AdminStatsPage />} />
          <Route path="performance" element={<AdminPerfPage />} />
          <Route path="ocr" element={<AdminOCRPage />} />
          <Route path="verify-qr" element={<ExternalVerifyPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="audit-logs" element={<AdminAuditPage />} />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </ToastProvider>
    </Router>
  );
}

export default App;
