import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './api/authService';
import { employeeRequestService } from './api/employeeRequestService';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Login from './pages/Login/Login';

import PendingRequests from './pages/PendingRequests/PendingRequests';
import RequestReview from './pages/RequestReview/RequestReview';
import EmployeeDashboard from './pages/EmployeeDashboard/EmployeeDashboard';

import AdminUsersPage from './pages/AdminUsersPage/AdminUsersPage';
import AdminStatsPage from './pages/AdminStatsPage/AdminStatsPage';
import AdminPerfPage from './pages/AdminPerfPage/AdminPerfPage';
import AdminOCRPage from './pages/AdminOCRPage/AdminOCRPage';
import ExternalVerifyPage from './pages/ExternalVerifyPage/ExternalVerifyPage';
import AdminServicesPage from './pages/AdminServicesPage/AdminServicesPage';
import AdminRequestsPage from './pages/AdminRequestsPage/AdminRequestsPage';
import AdminAuditPage from './pages/AdminAuditPage/AdminAuditPage';
import UserProfilePage from './pages/UserProfilePage/UserProfilePage';

import { ToastProvider, RouteToastListener } from './components/Common/ToastProvider';
import { clearAuthData, getPrimaryRole, getStoredUser, normalizeRole } from './utils/auth';
import { getResponseCollection } from './utils/apiResponse';

function App() {
    const [currentUser, setCurrentUser] = useState(() => getStoredUser());
    const [isLoading, setIsLoading] = useState(true);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const checkAuthAndFetchData = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                clearAuthData();
                setCurrentUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const response = await authService.getProfile();

                const userData =
                    response.data?.user ||
                    response.data?.data ||
                    response.data;

                if (!userData || typeof userData !== 'object') {
                    clearAuthData();
                    setCurrentUser(null);
                    setIsLoading(false);
                    return;
                }

                const normalizedRole = normalizeRole(getPrimaryRole(userData));

                if (!normalizedRole) {
                    clearAuthData();
                    setCurrentUser(null);
                    setIsLoading(false);
                    return;
                }

                setCurrentUser(userData);

                localStorage.setItem('user', JSON.stringify(userData));
                localStorage.setItem('userRole', normalizedRole);

                if (userData.email) {
                    localStorage.setItem('userEmail', userData.email);
                }

                if (normalizedRole === 'employee') {
                    try {
                        const reqResponse = await employeeRequestService.getPendingRequests();
                        const reqData = getResponseCollection(reqResponse);

                        setRequests(reqData);
                    } catch (requestError) {
                        console.error('فشل جلب العداد المركزي للطلبات:', requestError);
                        setRequests([]);
                    }
                }
            } catch (error) {
                console.warn('فشل جلب الملف الشخصي، سيتم حذف بيانات الجلسة المحلية.', error);
                clearAuthData();
                setCurrentUser(null);
                setRequests([]);
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
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#f4f7f6',
                    color: '#2d5a4c',
                    flexDirection: 'column',
                    fontFamily: 'Arial, sans-serif'
                }}
            >
                <div
                    style={{
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #2d5a4c',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        animation: 'spin 1s linear infinite',
                        marginBottom: '15px'
                    }}
                ></div>

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

                    <Route
                        path="/employee"
                        element={
                            <ProtectedRoute allowedRoles={['employee', 'موظف']}>
                                <MainLayout
                                    currentUser={currentUser}
                                    pendingCount={requests.length}
                                />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="dashboard" replace />} />

                        <Route
                            path="dashboard"
                            element={<EmployeeDashboard requests={requests} />}
                        />

                        <Route
                            path="pending-requests"
                            element={
                                <PendingRequests
                                    requests={requests}
                                    title="الطلبات المعلّقة"
                                />
                            }
                        />

                        <Route
                            path="review-request/:requestId"
                            element={
                                <RequestReview
                                    isAdminMode={false}
                                    onActionComplete={handleRemoveRequest}
                                />
                            }
                        />

                        <Route path="profile" element={<UserProfilePage />} />
                    </Route>

                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'مدير النظام']}>
                                <MainLayout
                                    currentUser={currentUser}
                                    headerTitle="إدارة النظام"
                                />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="users" replace />} />
                        <Route path="users" element={<AdminUsersPage />} />
                        <Route path="all-requests" element={<AdminRequestsPage />} />
                        <Route
                            path="review-request/:requestId"
                            element={<RequestReview isAdminMode={true} />}
                        />
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