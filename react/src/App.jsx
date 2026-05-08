import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from "./assets/pages/login/login";
import PendingRequests from './assets/pages/PendingRequests/PendingRequests';
import RequestReview from './assets/pages/RequestReview/RequestReview';
import AdminUsersPage from './assets/pages/AdminUsersPage/AdminUsersPage';
import EmployeeDashboard from './assets/pages/EmployeeDashboard/EmployeeDashboard';
import AdminStatsPage from './assets/pages/AdminStatsPage/AdminStatsPage';
import AdminPerfPage from './assets/pages/AdminPerfPage/AdminPerfPage';
import AdminOCRPage from './assets/pages/AdminOCRPage/AdminOCRPage';

function App() {
  const employeeUser = { name: "أحمد المحمود", role: "موظف", initials: "أ.م", email: "ahmed.m@yaqeen.gov.sy" };
  const adminUser = { name: "عبد الرحمن سماق", role: "مدير النظام", initials: "ع.س", email: "admin@yaqeen.gov.sy" };

  // 💡 تحويل المصفوفة إلى State لكي نستطيع الحذف منها
  const [requests, setRequests] = useState([
    { id: 'REQ-000044', name: 'خالد الأحمد', type: 'إخراج قيد فردي', date: '2026/04/09', status: 'pending' },
    { id: 'REQ-000041', name: 'ليلى حسن', type: 'بيان عائلي', date: '2026/04/09', status: 'pending' }
  ]);

  // 💡 دالة حذف الطلب من القائمة (ستجعل العداد ينقص تلقائياً)
  const handleRemoveRequest = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 مسارات الموظف */}
        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={['employee', 'موظف']}>
            {/* 💡 نمرر requests.length لضمان تحديث السايد بار فوراً */}
            <MainLayout currentUser={employeeUser} pendingCount={requests.length} />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<EmployeeDashboard requests={requests} />} />
          <Route path="pending-requests" element={<PendingRequests requests={requests} title="الطلبات المعلّقة" />} />
          {/* 💡 نمرر دالة الحذف للمراجعة */}
          <Route path="review/:requestId" element={
            <RequestReview isAdminMode={false} onActionComplete={handleRemoveRequest} />
          } />
        </Route>

        {/* 🛡️ مسارات المدير */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin', 'مدير النظام']}>
            <MainLayout currentUser={adminUser} headerTitle="إدارة النظام" />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="stats" element={<AdminStatsPage />} />
          <Route path="performance" element={<AdminPerfPage />} />
          <Route path="ocr" element={<AdminOCRPage />} />
          <Route path="review/:requestId" element={<RequestReview isAdminMode={true} onActionComplete={handleRemoveRequest} />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;