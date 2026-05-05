import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from "./assets/pages/login/login";
import PendingRequests from './assets/pages/PendingRequests/PendingRequests';
import RequestReview from './assets/pages/RequestReview/RequestReview';
import AdminUsersPage from './assets/pages/AdminUsersPage/AdminUsersPage';
import EmployeeDashboard from './assets/pages/EmployeeDashboard/EmployeeDashboard';

function App() {
  const employeeUser = {
    name: "أحمد المحمود",
    role: "مدقق بيانات",
    initials: "أ.م",
    email: "ahmed.m@yaqeen.gov.sy"
  };

  const adminUser = {
    name: "عبد الرحمن سماق",
    role: "مدير النظام",
    initials: "ع.س",
    email: "admin@yaqeen.gov.sy"
  };

  const user = employeeUser;

  const [requests] = useState([
    { id: 'REQ-000044', name: 'خالد الأحمد', type: 'إخراج قيد فردي', date: '2026/04/09', status: 'pending' },
    { id: 'REQ-000041', name: 'ليلى حسن', type: 'بيان عائلي', date: '2026/04/09', status: 'pending' }
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* 🔒 مسارات الموظف */}
        <Route path="/employee" element={
          <ProtectedRoute allowedRoles={['employee']}>
            <MainLayout currentUser={employeeUser} pendingCount={requests.length} />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="pending-requests" replace />} />
          <Route path="pending-requests" element={<PendingRequests requests={requests} title="الطلبات المعلّقة" />} />
          <Route path="review" element={<RequestReview title="مراجعة طلب" />} />
          <Route path="notifications" element={<div>صفحة الإشعارات</div>} />
        </Route>

        {/* 🛡️ مسارات المدير */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout currentUser={adminUser} headerTitle="إدارة النظام" />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="users" replace />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>

        <Route path="/review" element={
          <MainLayout
            currentUser={user}
            pendingCount={requests.length}
            headerTitle="مراجعة الطلب"
            headerSubtitle="تدقيق البيانات المستخرجة من الوثائق"
          />
        }>
          <Route index element={<RequestReview />} />
        </Route>

        <Route path="/employee-dashboard" element={
          <MainLayout
            currentUser={user}
            pendingCount={requests.length}
            headerTitle="لوحة الموظف"
            headerSubtitle="نظرة عامة على الأداء والطلبات"
          />
        }>
          <Route index element={<EmployeeDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;