import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './api/authService';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from "./assets/pages/login/login";

// استيراد واجهة الطلبات المحدثة بعد الـ Refactoring المجلد الموحد
import PendingRequests from './assets/pages/PendingRequests/PendingRequests';
import RequestReview from './assets/pages/RequestReview/RequestReview';
import AdminUsersPage from './assets/pages/AdminUsersPage/AdminUsersPage';
import EmployeeDashboard from './assets/pages/EmployeeDashboard/EmployeeDashboard';
import AdminStatsPage from './assets/pages/AdminStatsPage/AdminStatsPage';
import AdminPerfPage from './assets/pages/AdminPerfPage/AdminPerfPage';
import AdminOCRPage from './assets/pages/AdminOCRPage/AdminOCRPage';

// استيراد واجهة التحقق الخارجي QR للـ Admin
import ExternalVerifyPage from "./assets/pages/ExternalVerifyPage/ExternalVerifyPage";

// استيراد واجهة إدارة الخدمات المتاحة للـ Admin 
import AdminServicesPage from "./assets/pages/AdminServicesPage/AdminServicesPage";

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        return JSON.parse(savedUser);
      } catch (e) { return null; }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  const [requests, setRequests] = useState([
    { id: 'REQ-000044', name: 'خالد الأحمد', type: 'إخراج قيد فردي', date: '2026/04/09', status: 'pending' },
    { id: 'REQ-000041', name: 'ليلى حسن', type: 'بيان عائلي', date: '2026/04/09', status: 'pending' }
  ]);

  useEffect(() => {
    const checkAuth = async () => {
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
          
          localStorage.setItem('userRole', role);
        } else {
          throw new Error("بيانات الملف الشخصي غير مكتملة");
        }

      } catch (error) {
        console.warn("فشل جلب الملف الشخصي، الاعتماد على البيانات المحلية.");
        if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
          setCurrentUser(JSON.parse(savedUser));
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleRemoveRequest = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
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
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <h2>جاري تشغيل نظام يَقِين...</h2>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* مسارات الموظف (Employee Portal) */}
        {/* 🟢 تم تصحيح السطر التالي وإضافة علامة الـ (=) المطلوبة لإصلاح بناء الجملة فورا */}
        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={['employee', 'موظف']}>
            <MainLayout currentUser={currentUser} pendingCount={requests.length} />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard requests={requests} />} />
          <Route path="pending-requests" element={<PendingRequests requests={requests} title="الطلبات المعلّقة" />} />
          
          {/* الـ Route الخاص بمراجعة الطلب التفصيلي متناسق مع روابط المعالجة بالمنصة */}
          <Route path="review-request/:requestId" element={
            <RequestReview isAdminMode={false} onActionComplete={handleRemoveRequest} />
          } />
        </Route>

        {/* مسارات الأدمن (مدير النظام) */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'مدير النظام']}>
            <MainLayout currentUser={currentUser} headerTitle="إدارة النظام" />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="stats" element={<AdminStatsPage />} />
          <Route path="performance" element={<AdminPerfPage />} />
          <Route path="ocr" element={<AdminOCRPage />} />
          <Route path="verify-qr" element={<ExternalVerifyPage />} />
          <Route path="services" element={<AdminServicesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;