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
  const adminUser = {
    name: "عبد الرحمن سماق",
    role: "مدير النظام",
    initials: "ع.س",
    email: "admin@yaqeen.gov.sy"
  };

  const [requests] = useState([
    { id: 'REQ-000044', name: 'خالد الأحمد', type: 'إخراج قيد فردي', date: '2026/04/09', status: 'pending' },
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* 🛡️ مسارات المدير */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout currentUser={adminUser} headerTitle="إدارة النظام" />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="stats" element={<AdminStatsPage />} />
          <Route path="performance" element={<AdminPerfPage />} />
          <Route path="ocr" element={<AdminOCRPage />} />
          {/* مسار المراجعة الذكي للمدير */}
          <Route path="review/:requestId" element={<RequestReview isAdminMode={true} />} />
        </Route>

        {/* مسار المراجعة الافتراضي للموظف */}
        <Route path="/review" element={
          <MainLayout currentUser={adminUser} pendingCount={requests.length} headerTitle="مراجعة الطلب" />
        }>
          <Route index element={<RequestReview isAdminMode={false} />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;