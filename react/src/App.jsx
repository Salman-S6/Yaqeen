import React, { useState } from 'react'; // ضروري جداً لتشغيل الـ State
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from "./assets/pages/login/login";
import PendingRequests from './assets/pages/PendingRequests/PendingRequests';
import RequestReview from './assets/pages/RequestReview/RequestReview';

function App() {
  // 1. تعريف المستخدم (ليظهر اسمه وإيميله في السايدبار)
  const user = {
    name: "أحمد المحمود",
    role: "مدقق بيانات - مستوى 1",
    initials: "أ.م",
    email: "ahmed.m@yaqeen.gov.sy"
  };

  // 2. العداد الواقعي (مصفوفة الطلبات)
  // وضعنا 7 طلبات لتطابق التصميم الذي أرسلته سابقاً
  const [requests, setRequests] = useState([
    { id: 'REQ-000044', name: 'خالد الأحمد', type: 'إخراج قيد فردي', date: '2026/04/09', waitTime: '26 ساعة', isUrgent: true },
    { id: 'REQ-000041', name: 'ليلى حسن', type: 'بيان عائلي', date: '2026/04/09', waitTime: '22 ساعة', isUrgent: true },
    { id: 'REQ-000040', name: 'يوسف العمر', type: 'وثيقة أخرى', date: '2026/04/09', waitTime: '20 ساعة', isUrgent: true },
    { id: 'REQ-000043', name: 'سارة محمود', type: 'بيان عائلي', date: '2026/04/08', waitTime: '4 ساعات', isUrgent: false },
    { id: 'REQ-000039', name: 'أحمد المحمود', type: 'بيان عائلي', date: '2026/04/08', waitTime: '2 ساعة', isUrgent: false },
    { id: 'REQ-000038', name: 'نور الدين', type: 'إخراج قيد فردي', date: '2026/04/07', waitTime: '1 ساعة', isUrgent: false },
    { id: 'REQ-000037', name: 'هدى السالم', type: 'وثيقة أخرى', date: '2026/04/07', waitTime: '30 دقيقة', isUrgent: false }
  ]);

  // 3. دالة الحذف (المراجعة) التي تنقص العداد في كل النظام فوراً
  const handleDelete = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* مسار تسجيل الدخول */}
        <Route path="/login" element={
          <MainLayout>
            <Login />
          </MainLayout>
        } />

        {/* مسار الطلبات المعلّقة (الإدارة المركزية) */}
        <Route path="/pending-requests" element={
          <MainLayout
            currentUser={user}
            pendingCount={requests.length}
            headerTitle="الطلبات المعلّقة"
            headerSubtitle={`${requests.length} طلبات في انتظار مراجعتك`}
          >
            <PendingRequests requests={requests} onReview={handleDelete} />
          </MainLayout>
        } />
{/* مسار صفحة مراجعة الطلب */}
        <Route path="/review" element={
          <MainLayout
            currentUser={user}
            pendingCount={requests.length}
            headerTitle="مراجعة الطلب"
            headerSubtitle="تدقيق البيانات المستخرجة من الوثائق"
          >
            <RequestReview />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

// 4. السطر الأهم لمنع الشاشة البيضاء: تصدير المكون
export default App;